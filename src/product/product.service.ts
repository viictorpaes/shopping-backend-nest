import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Product } from './product.entity';
import { Cart } from '../cart/cart.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>, 
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(productId: number): Promise<Product | null> {
    const product = await this.productRepository.findOneBy({ productId });
    if (!product) {
      throw new NotFoundException(`Product with productId ${productId} not found`);
    }
    return product;
  }

  create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async update(productId: number, productData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(productId, productData);
    const product = await this.productRepository.findOneBy({ productId });
    if (!product) {
      throw new Error(`Product with productId ${productId} not found`);
    }
    return product;
  }

  async remove(productId: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ productId });
    if (!product) {
      throw new Error(`Product with productId ${productId} not found`);
    }

    await this.cartRepository.delete({ product: { productId } });
    await this.productRepository.delete(productId);
  }

  findByCriteria(criteria: Partial<Product>): Promise<Product[]> {
    const where: FindOptionsWhere<Product> = {};

    // Adiciona validação para os critérios
    if (criteria.productId) {
      const productId = parseInt(criteria.productId as any, 10);
      if (isNaN(productId) || productId <= 0) {
        throw new BadRequestException('Invalid productId. It must be a positive number.');
      }
      where.productId = productId;
    }
    if (criteria.name) {
      where.name = Like(`%${criteria.name}%`);
    }
    if (criteria.price) {
      const price = parseFloat(criteria.price as any);
      if (isNaN(price) || price <= 0) {
        throw new BadRequestException('Invalid price. It must be a positive number.');
      }
      where.price = price;
    }
    if (criteria.description) {
      where.description = Like(`%${criteria.description}%`);
    }

    return this.productRepository.find({ where });
  }
}
