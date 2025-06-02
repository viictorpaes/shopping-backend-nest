import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
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

  findByCriteria(criteria: Partial<Product> & { priceGte?: number; priceLte?: number }): Promise<Product[]> {
    const where: FindOptionsWhere<Product> = {};

    if (criteria.name) {
      where.name = Like(`%${criteria.name}%`);
    }
    if (criteria.priceGte) {
      where.price = MoreThanOrEqual(criteria.priceGte); // Preço maior ou igual
    }
    if (criteria.priceLte) {
      where.price = LessThanOrEqual(criteria.priceLte); // Preço menor ou igual
    }
    if (criteria.description) {
      where.description = Like(`%${criteria.description}%`);
    }
    if (criteria.discount) {
      where.discount = criteria.discount; // Filtrar por desconto
    }

    return this.productRepository.find({ where });
  }
}

