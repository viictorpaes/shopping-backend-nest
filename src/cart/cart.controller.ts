import { Controller, Get, Post, Delete, Patch, Body, Param, Query, UsePipes, ValidationPipe, InternalServerErrorException, Logger, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { CartSwagger } from './cart.swagger';
import { AddProductsDto, UpdateCartQuantityDto, RemoveProductDto } from './cart.dto';

@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

  constructor(private readonly cartService: CartService) {}

  @Get()
  @CartSwagger.findAll()
  findAll(): Promise<Cart[]> {
    return this.cartService.findAll();
  }

  @Post()
  @CartSwagger.addProducts()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async addProducts(@Body() body: AddProductsDto): Promise<Cart[]> {
    try {
      return await this.cartService.addProducts(body.products);
    } catch (error) {
      this.logger.error('Error adding products to cart', error.stack);
      throw new InternalServerErrorException('An error occurred while adding products to the cart');
    }
  }

  @Delete(':id')
  @CartSwagger.removeProduct()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async removeProduct(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: RemoveProductDto,
  ): Promise<void> {
    try {
      const exists = await this.cartService.findCartItem(id, query.productId);
      if (!exists) {
        throw new InternalServerErrorException('Cart item not found');
      }
      await this.cartService.removeProduct(id);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred');
    }
  }

  @Patch(':id')
  @CartSwagger.updateQuantity()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Query('productId', ParseIntPipe) productId: number,
    @Body() updateCartQuantityDto: UpdateCartQuantityDto,
  ): Promise<Cart> {
    try {
      return await this.cartService.updateQuantity(id, productId, updateCartQuantityDto.quantity);
    } catch (error) {
      this.logger.error('Error updating cart item quantity', error.stack);
      throw new InternalServerErrorException('An error occurred while updating cart item quantity');
    }
  }

  @Post('checkout/:id')
  @CartSwagger.checkout()
  async checkout(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.cartService.checkout(id);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred during checkout');
    }
  }
}
