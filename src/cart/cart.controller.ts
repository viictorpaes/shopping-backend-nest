import { Controller, Get, Post, Delete, Patch, Body, Param, Query, UsePipes, ValidationPipe, Logger, ParseIntPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { CartSwagger } from './cart.swagger';
import { AddProductsDto, UpdateCartQuantityDto, RemoveProductDto } from './cart.dto';

@Controller('cart') // Define o prefixo da rota como 'cart'
export class CartController {
  private readonly logger = new Logger(CartController.name); // Logger para registrar mensagens de erro

  constructor(private readonly cartService: CartService) {}

  @Get() // Rota para listar todos os itens do carrinho
  @CartSwagger.findAll()
  async findAll(): Promise<Cart[]> {
    try {
      // Chama o serviço para buscar todos os itens do carrinho
      return await this.cartService.findAll();
    } catch (error) {
      // Registra o erro e retorna uma exceção
      this.logger.error('Error fetching cart items', error.stack);
      throw new BadRequestException('An error occurred while fetching cart items');
    }
  }

  @Post() // Rota para adicionar produtos ao carrinho
  @CartSwagger.addProducts()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Valida o corpo da requisição
  async addProducts(@Body() body: AddProductsDto): Promise<Cart[]> {
    try {
      // Chama o serviço para adicionar produtos ao carrinho
      return await this.cartService.addProducts(body.products);
    } catch (error) {
      // Registra o erro e retorna uma exceção
      this.logger.error('Error adding products to cart', error.stack);
      throw new BadRequestException('An error occurred while adding products to the cart');
    }
  }

  @Delete(':id') // Rota para remover um produto do carrinho
  @CartSwagger.removeProduct()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Valida os parâmetros da requisição
  async removeProduct(
    @Param('id', ParseIntPipe) id: number, // Valida o ID do carrinho como número
    @Query('productId', ParseIntPipe) productId: number, // Valida o ID do produto como número
  ): Promise<void> {
    try {
      // Verifica se o item existe no carrinho
      const cartItem = await this.cartService.findCartItem(id, productId);
      if (!cartItem) {
        throw new NotFoundException(`Cart item with ID ${id} and product ID ${productId} not found`);
      }
      // Remove o item do carrinho
      await this.cartService.removeProduct(cartItem.id);
    } catch (error) {
      // Registra o erro e retorna uma exceção
      this.logger.error('Error removing product from cart', error.stack);
      throw new BadRequestException('An error occurred while removing product from the cart');
    }
  }

  @Patch(':id') // Rota para atualizar a quantidade de um produto no carrinho
  @CartSwagger.updateQuantity()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Valida os parâmetros e o corpo da requisição
  async updateQuantity(
    @Param('id', ParseIntPipe) id: number, // Valida o ID do carrinho como número
    @Query('productId', ParseIntPipe) productId: number, // Valida o ID do produto como número
    @Body() updateCartQuantityDto: UpdateCartQuantityDto, // Valida o corpo da requisição
  ): Promise<Cart> {
    try {
      // Atualiza a quantidade do produto no carrinho
      return await this.cartService.updateQuantity(id, productId, updateCartQuantityDto.quantity);
    } catch (error) {
      // Registra o erro e retorna uma exceção
      this.logger.error('Error updating cart item quantity', error.stack);
      throw new BadRequestException('An error occurred while updating cart item quantity');
    }
  }

  @Post('checkout/:id') // Rota para finalizar o carrinho
  @CartSwagger.checkout()
  async checkout(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      // Finaliza o carrinho
      await this.cartService.checkout(id);
    } catch (error) {
      // Registra o erro e retorna uma exceção
      this.logger.error('Error during checkout', error.stack);
      throw new BadRequestException('An error occurred during checkout');
    }
  }
}
