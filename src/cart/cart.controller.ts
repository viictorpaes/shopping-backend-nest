import { Controller, Get, Post, Delete, Patch, Body, Param, Query, UsePipes, ValidationPipe, InternalServerErrorException, Logger, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { IsArray, ValidateNested, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

class AddProductDto {
  @IsNotEmpty()
  @IsPositive()
  id: number; // Certifique-se de usar id

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

class UpdateCartQuantityDto {
  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}

@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name);

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
        productId: product.id, // Map id to productId
        quantity: product.quantity,
      }));
      return await this.cartService.addProducts(formattedProducts);
    } catch (error) {
      this.logger.error('Error adding products to cart', error.stack);
      throw new InternalServerErrorException('An error occurred while adding products to the cart');
    }
  }

  @Delete(':id')
  async removeProduct(
    @Param('id', ParseIntPipe) id: number,
    @Query('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    try {
      const exists = await this.cartService.findCartItem(id, productId);
      if (!exists) {
        throw new InternalServerErrorException('Cart item not found');
      }
      await this.cartService.removeProduct(id);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred');
    }
  }

  @Patch(':id')
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
  async checkout(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.cartService.checkout(id);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred during checkout');
    }
  }
}
