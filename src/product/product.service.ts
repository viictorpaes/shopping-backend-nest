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

  async findOne(idProduto: number): Promise<Product | null> {
    const updatedProduct = await this.productRepository.findOneBy({ id: idProduto });
    if (!updatedProduct) {
      throw new Error(`Product with idProduto ${idProduto} not found`);
    }
    return updatedProduct;
  }

  create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async update(idProduto: number, productData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(idProduto, productData);
    const product = await this.productRepository.findOneBy({ id: idProduto });
    if (!product) {
      throw new Error(`Product with idProduto ${idProduto} not found`);
    }
    return product;
  }

  async remove(idProduto: number): Promise<void> {
    await this.productRepository.delete(idProduto);
  }

  findByCriteria(criteria: Partial<Product>): Promise<Product[]> {
    const where: FindOptionsWhere<Product> = {};

    // Verifica se os critérios foram enviados e os adiciona ao objeto `where`
    if (criteria.name) {
      where.name = Like(`%${criteria.name}%`); // Busca parcial por nome
    }
    if (criteria.price) {
      where.price = +criteria.price; // Converte o preço para número
    }
    if (criteria.description) {
      where.description = Like(`%${criteria.description}%`); // Busca parcial por descrição
    }

    return this.productRepository.find({ where });
  }
}
