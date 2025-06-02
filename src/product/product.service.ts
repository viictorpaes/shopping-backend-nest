import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Product } from './product.entity';
import { Cart } from '../cart/cart.entity';
import { LogService } from '../logs/log.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>, 
    private readonly logService: LogService, // Adicionado para registrar logs
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

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    const savedProduct = await this.productRepository.save(newProduct);
    await this.logService.createLog('CREATE_PRODUCT', `Produto criado com ID ${savedProduct.id}`);
    return savedProduct;
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, productData);
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.logService.createLog('UPDATE_PRODUCT', `Produto atualizado com ID ${id}`);
    return product;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.delete(id);
    await this.logService.createLog('DELETE_PRODUCT', `Produto removido com ID ${id}`);
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

