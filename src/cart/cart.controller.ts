import { Controller, Get, Post, Delete, Body, Param, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { IsArray, ValidateNested, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

class AddProductDto {
  @IsNotEmpty()
  @IsPositive()
  productId: number;

  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}

class AddProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddProductDto)
  products: AddProductDto[];
}

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findAll(): Promise<Cart[]> {
    return this.cartService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  addProducts(@Body() body: AddProductsDto): Promise<Cart[]> {
    const formattedProducts = body.products.map(product => ({
      productId: product.productId,
      quantity: product.quantity,
    }));
    return this.cartService.addProducts(formattedProducts);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: number): Promise<void> {
    return this.cartService.removeProduct(id);
  }

  @Post('checkout')
  checkout(): Promise<void> {
    return this.cartService.checkout();
  }
}
