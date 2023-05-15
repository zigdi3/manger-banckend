import { Injectable } from '@nestjs/common'
import { ProductsRepository } from './products.repository'
import { products } from '@prisma/client';

import { ValidateProductsDTO } from './model/validate-products.dto';
import * as Papaparse from 'papaparse';
import * as fs from 'fs';
import { PacksRepository } from '../packs/packs.repository';
import { EOF } from 'dns';
import { Decimal } from '@prisma/client/runtime';


export interface ImportedData {
  product_code: string,
  new_price: Decimal
}


@Injectable()
export class ProductsService {
  constructor(
    private productsService: ProductsRepository,
    private packsService: PacksRepository
  ) { }

  async getAll(): Promise<products[]> {
    return this.productsService.findAll();
  }

  async getById(id: string): Promise<products> {
    return this.productsService.findById(id);
  }

  async validateImport(dataForm: any): Promise<ValidateProductsDTO[]> {
    const { fileData } = dataForm;
    const [dataType, base64] = fileData.split(';base64,');
    const base64Formated = base64.replace('\'', ' ').trim();
    const parsedData = atob(base64Formated); // decode base64 string

    const response: ValidateProductsDTO[] = [];
    let parsed = await Papaparse.parse(parsedData, { header: true });

    let parsedCsv: ImportedData[] = parsed.data;


    //inserir for para o length o formulario
    for (let line of parsedCsv) {

      const validations: ValidateProductsDTO = {
        code: null,
        name: null,
        costPrice: null,
        salesPrice: null,
        newPrice: null,
        isValidCost: false,
        isValidPrice: true,
        isValidPack: true,
        isFound: true,
      };

      let product_id = line?.product_code;
      let item = await this.getById(product_id);

      if (line.product_code !== undefined && line.new_price !== undefined) {
        if (!item) {
          validations.code = line?.product_code;
          validations.isFound = false;
          response.push(validations);
        } else {
          if (item?.code.toString().trim().length < 4) {

            //validar produtos precos
            (!this.checkValidMinimumCostProduct(line?.new_price, item)) ? validations.isValidCost = false : ' ';

            //(!this.checkValidPrice(line?.new_price, item)) ? validations.isValidPrice = false : '';
          }
          else {
            //Validar kits
            let kit = await this.packsService.findPacketsById("" + item?.code);
            if (!kit) {
              validations.code = line?.product_code;
              validations.isFound = false;
            }
            else {
              let totalPrice: Decimal = new Decimal('0.0');

              for (let itemDb of kit) {
                let productKit = await this.productsService.findById("" + itemDb?.product_id);
                let idx = 0;
                //soma o preco de venda para cada produto do pacote constando como validado
                for (let dataToEval of response) {
                  let value = dataToEval[idx]?.code;
                  let compareInDb = productKit?.code.toString(16) as string;
                  if (value == compareInDb.trim()) {
                    totalPrice = totalPrice.plus(dataToEval[idx].sales_price.times(itemDb.qty));
                  }
                  idx++;
                }
              }

              if (totalPrice !== line.new_price) {
                validations.isValidPack = false;
              }
            }
          }
          validations.costPrice = item?.cost_price;
          validations.salesPrice = item?.sales_price;
          validations.code = "" + item?.code;
          validations.name = "" + item?.name;
          validations.newPrice = line?.new_price;
        }
        response.push(validations);
      }
    }
    return response;
  }

  private checkValidMinimumCostProduct(price: Decimal,
    item: products) {

    return item?.cost_price.lessThanOrEqualTo(price) ? true : false;
  }

  private checkValidPrice(value: Decimal, p: products) {
    let res = false;
    let price = p.sales_price;
    let limitDown = price.minus(p.sales_price.dividedBy(10));
    let limitUp = price.plus(p.sales_price.dividedBy(10));

    if ((value.greaterThan(limitDown)) && (value.lessThan(limitUp)) ||
      (value.equals(limitDown)) || (value.equals(limitUp))) {
      res = true;
    }
    return res;
  }
}