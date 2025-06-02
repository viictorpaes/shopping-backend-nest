import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource, // Adicionado para gerenciar transações
  ) {}

  findAll(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ['product'] });
  }

  async findCartItem(cartId: number, productId: number): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { id: cartId, product: { id: productId } },
      relations: ['product'],
    });
  }

  async addProducts(products: { productId: number; quantity: number }[]): Promise<Cart[]> {
    const productIds = products.map(p => p.productId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Busca todos os produtos de uma vez
      const foundProducts = await queryRunner.manager.find(Product, {
        where: { id: In(productIds) },
      });

      if (foundProducts.length !== productIds.length) {
        throw new NotFoundException('One or more products not found');
      }

      const cartItems: Cart[] = [];
      for (const { productId, quantity } of products) {
        const product = foundProducts.find(p => p.id === productId);
        const cartItem = this.cartRepository.create({ product, quantity });
        cartItems.push(await queryRunner.manager.save(Cart, cartItem));
      }

      await queryRunner.commitTransaction();
      return cartItems;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error adding products to cart', error.stack);
      throw error; // Repassa a exceção original
    } finally {
      await queryRunner.release();
    }
  }

  async updateQuantity(cartId: number, productId: number, quantity: number): Promise<Cart> {
    const cartItem = await this.findCartItem(cartId, productId);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = quantity;
    return this.cartRepository.save(cartItem);
  }

  async removeProduct(cartItemId: number): Promise<void> {
    const cartItem = await this.cartRepository.findOneBy({ id: cartItemId });
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    await this.cartRepository.delete(cartItemId);
  }

  async checkout(cartId: number): Promise<void> {
    const cartItems = await this.cartRepository.find({ where: { id: cartId } });
    if (cartItems.length === 0) {
      throw new NotFoundException('Cart not found or empty');
    }

    await this.cartRepository.delete({ id: cartId }); // Remove apenas os itens do carrinho específico
  }
}
