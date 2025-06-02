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

  async findOne(id: number): Promise<Product | null> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, productData);
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Apenas remove o produto, ON DELETE CASCADE cuidará dos itens relacionados no carrinho
    await this.productRepository.delete(id);
  }

  findByCriteria(criteria: Partial<Product>): Promise<Product[]> {
    const where: FindOptionsWhere<Product> = {};

    if (criteria.id) {
      const id = parseInt(criteria.id as any, 10);
      if (isNaN(id) || id <= 0) {
        throw new BadRequestException('Invalid search criteria');
      }
      where.id = id;
    }
    if (criteria.name) {
      where.name = Like(`%${criteria.name}%`);
    }
    if (criteria.price) {
      const price = parseFloat(criteria.price as any);
      if (isNaN(price) || price <= 0) {
        throw new BadRequestException('Invalid search criteria');
      }
      where.price = price;
    }
    if (criteria.description) {
      where.description = Like(`%${criteria.description}%`);
    }

    return this.productRepository.find({ where });
  }
}
