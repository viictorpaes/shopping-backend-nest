import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Post()
  addProduct(@Body() body: { productId: number; quantity: number }) {
    return this.cartService.addProduct(body.productId, body.quantity);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: number) {
    return this.cartService.removeProduct(id);
  }

  @Post('checkout')
  checkout() {
    return this.cartService.checkout();
  }
}
