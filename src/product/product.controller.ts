import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException, UsePipes, ValidationPipe, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@ApiTags('Products') // Define a tag para o grupo de rotas
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso.' })
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produto pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'ID do produto inválido.' })
  async findOne(@Param('id') id: number): Promise<Product | null> {
    try {
      if (id <= 0) {
        throw new BadRequestException('Invalid ID');
      }
      return await this.productService.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching product');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() product: Partial<Product>): Promise<Product> {
    try {
      return await this.productService.create(product);
    } catch (error) {
      throw new InternalServerErrorException('Error creating product');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um produto pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Param('id') id: number, @Body() product: Partial<Product>): Promise<Product> {
    try {
      return await this.productService.update(id, product);
    } catch (error) {
      throw new InternalServerErrorException('Error updating product');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um produto pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso.' })
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.productService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting product');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar produtos por critérios' })
  @ApiQuery({ name: 'id', required: false, type: Number, description: 'ID do produto' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Nome do produto' })
  @ApiQuery({ name: 'price', required: false, type: Number, description: 'Preço do produto' })
  @ApiQuery({ name: 'description', required: false, type: String, description: 'Descrição do produto' })
  @ApiResponse({ status: 200, description: 'Produtos encontrados com sucesso.' })
  async findByCriteria(@Query() query: Partial<Product>): Promise<Product[]> {
    try {
      if (!query || Object.keys(query).length === 0) {
        throw new BadRequestException('Invalid search criteria');
      }

      const validKeys = ['id', 'name', 'price', 'description'];
      const invalidKeys = Object.keys(query).filter(key => !validKeys.includes(key));
      if (invalidKeys.length > 0) {
        throw new BadRequestException('Invalid search criteria');
      }

      return await this.productService.findByCriteria(query);
    } catch (error) {
      throw new InternalServerErrorException('Error searching products');
    }
  }
}
