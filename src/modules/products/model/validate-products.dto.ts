export class ValidateProductsDTO {
  code: string | number;
  name: string
  costPrice?: number;
  salesPrice?: number;
  newPrice?: number;
  isValidCost?: boolean;
  isValidPrice?: boolean;
  isValidPack?: boolean;
  isFound?: boolean;
}
