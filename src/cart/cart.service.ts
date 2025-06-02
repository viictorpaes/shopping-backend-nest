import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  findAll(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ['product'] }); 
  }

  async addProducts(products: { productId: number; quantity: number }[]): Promise<Cart[]> {
    const cartItems: Cart[] = [];

    for (const { productId, quantity } of products) {
      try {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
          throw new NotFoundException('Product not found');
        }

        const cartItem = this.cartRepository.create({ product, quantity });
        cartItems.push(await this.cartRepository.save(cartItem));
      } catch (error) {
        this.logger.error(`Error adding product with ID ${productId} to cart`, error.stack);
        throw new Error('An error occurred while adding products to the cart');
      }
    }

    return cartItems;
  }

  async removeProduct(id: number): Promise<void> {
    const cartItem = await this.cartRepository.findOneBy({ id });
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    await this.cartRepository.delete(id);
  }

  async checkout(): Promise<void> {
    await this.cartRepository.clear(); 
  }
}
