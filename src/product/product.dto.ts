import { IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number; // Desconto opcional
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number; // Desconto opcional
}

export class FindByCriteriaDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  priceGte?: number; // Preço maior ou igual

  @IsOptional()
  @IsNumber()
  @IsPositive()
  priceLte?: number; // Preço menor ou igual

  @IsOptional()
  @IsString()
  description?: string;
}
