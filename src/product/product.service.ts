import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product | null> {
    const updatedProduct = await this.productRepository.findOneBy({ id });
    if (!updatedProduct) {
      throw new Error(`Product with id ${id} not found`);
    }
    return updatedProduct;
  }

  create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, productData);
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  findByCriteria(criteria: Partial<Product>): Promise<Product[]> {
    const where: FindOptionsWhere<Product> = {};

    if (criteria.name) {
      where.name = Like(`%${criteria.name}%`);
    }
    if (criteria.price) {
      where.price = +criteria.price;
    }
    if (criteria.description) {
      where.description = Like(`%${criteria.description}%`);
    }

    return this.productRepository.find({ where });
  }
}
