import { Controller, Get, Post, Delete, Body, Param, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findAll(): Promise<Cart[]> {
    return this.cartService.findAll();
  }

  @Post()
  addProducts(@Body() products: { id: number; quantity: number }[]): Promise<Cart[]> {
    if (!Array.isArray(products)) {
      throw new BadRequestException('The request body must be an array of products');
    }

    const formattedProducts = products.map(product => ({
      productId: product.id,
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
