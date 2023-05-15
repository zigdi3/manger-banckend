import { Injectable } from '@nestjs/common'
import { ProductsRepository } from './products.repository'
import { products } from '@prisma/client';

import { ValidateProductsDTO } from './model/validate-products.dto';
import * as Papaparse from 'papaparse';
import * as fs from 'fs';
import { PacksRepository } from '../packs/packs.repository';
import { EOF } from 'dns';


export interface ImportedData {
  product_code: string,
  new_price: number
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

  async validateImport(dataForm: { base64Data }): Promise<ValidateProductsDTO[]> {
    const stringBufer = dataForm.base64Data;
    //const buffer = Buffer.from(stringBufer, 'base64');
    const csvData = atob(stringBufer); // decode base64 string

    const response: ValidateProductsDTO[] = [];
    let parsed = await Papaparse.parse(csvData, { header: true });

    let parsedCsv: ImportedData[] = parsed.data;

    let validations: ValidateProductsDTO = {
      code: null,
      name: null,
      costPrice: null,
      salesPrice: null,
      newPrice: null,
      isValidCost: false,
      isValidPrice: true,
      isValidPack: false,
      isFound: true,
    };

    //inserir for para o length o formulario
    for (let line of parsedCsv) {
      let product_id = line?.product_code;
      let item = await this.getById(product_id);

      if (line.product_code !== undefined && line.new_price !== undefined) {
        if (!item) {
          validations.code = line?.product_code;
          validations.isFound = false;
          response.push(validations);
        } else {
          if (!item?.name.toLowerCase().includes('KIT')) {

            //validar produtos
            if (!this.checkValidMinimumCostProduct(line?.new_price, item)) {
              validations.isValidCost = false;
            }
            if (!this.checkValidPrice(line?.new_price, item)) {
              validations.isValidPrice = false;
            }
          }
          else {
            //Validar kits
            let kit = await this.packsService.findByPackId("" + item?.code);
            if (!kit) {
              validations.code = line?.product_code;
              validations.isFound = false;
            }
            else {
              let productKit = await this.productsService.findById("" + kit?.product_id);

              //validar se o produto do kit possui o ajuste de preco no formulario
              let productFound = response.filter(res =>
                res.code.toString().trim() === productKit?.code.toString().trim()).map(
                  res => {
                    return res as ValidateProductsDTO;
                  });
              if (productFound[0]?.salesPrice === line?.new_price) {
                validations.isValidPack = true;
              }
            }
          }
          validations.costPrice = +item?.cost_price;
          validations.salesPrice = +item?.sales_price;
          validations.code = "" + item?.code;
          validations.name = "" + item?.name;
          validations.newPrice = line?.new_price;
        }
        response.push(validations);
      }
    }
    return response;
  }
  private checkValidMinimumCostProduct(price: number,
    item: products) {

    return +item?.cost_price < price ? true : false;
  }

  private checkValidPrice(value: number, p: products) {
    let res = false;
    let price = +p.sales_price;
    let limitDown = price - (+p.sales_price / 10);
    let limitUp = price + (+p.sales_price / 10)

    if (+value > limitDown && +value < limitUp) {
      res = true;
    }
    return res;
  }
}