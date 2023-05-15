import { Decimal } from '@prisma/client/runtime';

export class ValidateProductsDTO {
  code: string;
  name: string
  costPrice?: Decimal;
  salesPrice?: Decimal;
  newPrice?: Decimal;
  isValidCost?: boolean;
  isValidPrice?: boolean;
  isValidPack?: boolean;
  isFound?: boolean;
}
