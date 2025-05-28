import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ['product'] }); // Inclui as informações do produto
  }

  async addProduct(idProduto: number, quantity: number): Promise<Cart> {
    const product = await this.productRepository.findOneBy({ id: idProduto }); // Usa idProduto
    if (!product) {
      throw new Error('Product not found');
    }

    const cartItem = this.cartRepository.create({ product, quantity });
    return this.cartRepository.save(cartItem);
  }

  async removeProduct(id: number): Promise<void> {
    await this.cartRepository.delete(id);
  }

  async checkout(): Promise<void> {
    await this.cartRepository.clear();
  }
}
