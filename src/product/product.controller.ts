import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException } from '@nestjs/common';
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
  findOne(@Param('productId') productId: string): Promise<Product | null> {
    const id = parseInt(productId, 10);
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid productId. It must be a positive number.');
    }
    return this.productService.findOne(id);
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
      throw new BadRequestException('At least one search criterion must be provided');
    }

    // Validação adicional para garantir que os parâmetros sejam válidos
    const validKeys = ['productId', 'name', 'price', 'description'];
    const invalidKeys = Object.keys(query).filter(key => !validKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new BadRequestException(`Invalid query parameters: ${invalidKeys.join(', ')}`);
    }

    return this.productService.findByCriteria(query);
  }
}
