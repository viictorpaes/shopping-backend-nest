import { Controller, Get, Post, Delete, Patch, Body, Param, Query, UsePipes, ValidationPipe, Logger, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
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
  async findAll(): Promise<Cart[]> {
    try {
      return await this.cartService.findAll();
    } catch (error) {
      this.logger.error('Error fetching cart items', error.stack);
      throw new BadRequestException('An error occurred while fetching cart items');
    }
  }

  @Post()
  @CartSwagger.addProducts()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Garante que apenas propriedades esperadas sejam aceitas
  async addProducts(@Body() body: AddProductsDto): Promise<Cart[]> {
    try {
      return await this.cartService.addProducts(body.products);
    } catch (error) {
      this.logger.error('Error adding products to cart', error.stack);
      throw new BadRequestException('An error occurred while adding products to the cart');
    }
  }

  @Delete(':id')
  @CartSwagger.removeProduct()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Garante que apenas propriedades esperadas sejam aceitas
  async removeProduct(
    @Param('id', ParseIntPipe) id: number,
    @Query('productId', ParseIntPipe) productId: number, // Valida productId como número positivo
  ): Promise<void> {
    try {
      const cartItem = await this.cartService.findCartItem(id, productId);
      if (!cartItem) {
        throw new NotFoundException(`Cart item with ID ${id} and product ID ${productId} not found`);
      }
      await this.cartService.removeProduct(cartItem.id); // Passa o ID do item do carrinho
    } catch (error) {
      this.logger.error('Error removing product from cart', error.stack);
      throw new BadRequestException('An error occurred while removing product from the cart');
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
      throw new BadRequestException('An error occurred while updating cart item quantity');
    }
  }

  @Post('checkout/:id')
  @CartSwagger.checkout()
  async checkout(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.cartService.checkout(id);
    } catch (error) {
      this.logger.error('Error during checkout', error.stack);
      throw new BadRequestException('An error occurred during checkout');
    }
  }
}
