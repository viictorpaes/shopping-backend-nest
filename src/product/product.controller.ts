import { Controller, Get, Post, Put, Delete, Param, Body, Query, UsePipes, ValidationPipe, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { FindByCriteriaDto } from './product.dto';
import { ProductSwagger } from './product.swagger';

@Controller('products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  @Get()
  @ProductSwagger.findAll()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async findAll(@Query() query: FindByCriteriaDto): Promise<Product[]> {
    try {
      if (query && Object.keys(query).length > 0) {
        const products = await this.productService.findByCriteria(query);
        if (products.length === 0) {
          throw new NotFoundException('No products found matching the criteria');
        }
        return products;
      } else {
        return await this.productService.findAll();
      }
    } catch (error) {
      this.logger.error('Error fetching products', error.stack);
      throw new BadRequestException('An error occurred while fetching products');
    }
  }

  @Get(':id')
  @ProductSwagger.findOne()
  async findOne(@Param('id') id: number): Promise<Product | null> {
    try {
      if (id <= 0) {
        throw new BadRequestException('Invalid ID');
      }
      return await this.productService.findOne(id);
    } catch (error) {
      this.logger.error('Error fetching product', error.stack);
      throw new BadRequestException('An error occurred while fetching the product');
    }
  }

  @Post()
  @ProductSwagger.create()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      this.logger.error('Error creating product', error.stack);
      throw new BadRequestException('An error occurred while creating the product');
    }
  }

  @Put(':id')
  @ProductSwagger.update()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      this.logger.error('Error updating product', error.stack);
      throw new BadRequestException('An error occurred while updating the product');
    }
  }

  @Delete(':id')
  @ProductSwagger.remove()
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.productService.remove(id);
    } catch (error) {
      this.logger.error('Error deleting product', error.stack);
      throw new BadRequestException('An error occurred while deleting the product');
    }
  }
}
