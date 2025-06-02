import { IsNotEmpty, IsPositive, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AddProductDto {
  @IsNotEmpty()
  @IsPositive()
  productId: number; // ID do produto

  @IsNotEmpty()
  @IsPositive()
  quantity: number; // Quantidade do produto
}

export class AddProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddProductDto)
  products: AddProductDto[];
}

export class UpdateCartQuantityDto {
  @IsNotEmpty()
  @IsPositive()
  quantity: number; // Nova quantidade do produto
}

export class RemoveProductDto {
  @IsNotEmpty()
  @IsPositive()
  productId: number; // ID do produto
}
