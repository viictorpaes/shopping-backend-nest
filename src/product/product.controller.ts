import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':idProduto')
  findOne(@Param('idProduto') idProduto: number): Promise<Product | null> {
    return this.productService.findOne(idProduto);
  }

  @Post()
  create(@Body() product: Partial<Product>): Promise<Product> {
    return this.productService.create(product);
  }

  @Put(':idProduto')
  update(@Param('idProduto') idProduto: number, @Body() product: Partial<Product>): Promise<Product> {
    return this.productService.update(idProduto, product);
  }

  @Delete(':idProduto')
  remove(@Param('idProduto') idProduto: number): Promise<void> {
    return this.productService.remove(idProduto);
  }

  @Get('search')
  findByCriteria(@Query() query: Partial<Product>): Promise<Product[]> {
    return this.productService.findByCriteria(query);
  }
}
