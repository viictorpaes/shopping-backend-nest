import { Controller, Get, Post, Delete, Body, Param, BadRequestException, UsePipes, ValidationPipe, InternalServerErrorException } from '@nestjs/common';
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
  async addProducts(@Body() body: AddProductsDto): Promise<Cart[]> {
    try {
      const formattedProducts = body.products.map(product => ({
        productId: product.productId,
        quantity: product.quantity,
      }));
      return await this.cartService.addProducts(formattedProducts);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred');
    }
  }

  @Delete(':id')
  async removeProduct(@Param('id') id: number): Promise<void> {
    try {
      await this.cartService.removeProduct(id);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred');
    }
  }

  @Post('checkout')
  async checkout(): Promise<void> {
    try {
      await this.cartService.checkout();
    } catch (error) {
      throw new InternalServerErrorException('An error occurred');
    }
  }
}
