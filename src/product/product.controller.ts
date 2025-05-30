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

  @Get(':productId')
  findOne(@Param('productId') productId: number): Promise<Product | null> {
    return this.productService.findOne(productId);
  }

  @Post()
  create(@Body() product: Partial<Product>): Promise<Product> {
    return this.productService.create(product);
  }

  @Put(':productId')
  update(@Param('productId') productId: number, @Body() product: Partial<Product>): Promise<Product> {
    return this.productService.update(productId, product);
  }

  @Delete(':productId')
  async remove(@Param('productId') productId: number): Promise<void> {
    return this.productService.remove(productId);
  }

  @Get('search')
  findByCriteria(@Query() query: Partial<Product>): Promise<Product[]> {
    if (!query || Object.keys(query).length === 0) {
      throw new Error('At least one search criterion must be provided');
    }
    return this.productService.findByCriteria(query);
  }
}
