import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
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

  @Get(':productId')
  @ApiOperation({ summary: 'Buscar um produto pelo ID' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'ID do produto inválido.' })
  findOne(@Param('productId') productId: string): Promise<Product | null> {
    const id = parseInt(productId, 10);
    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('Invalid productId. It must be a positive number.');
    }
    return this.productService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() product: Partial<Product>): Promise<Product> {
    return this.productService.create(product);
  }

  @Put(':productId')
  @ApiOperation({ summary: 'Atualizar um produto pelo ID' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('productId') productId: number, @Body() product: Partial<Product>): Promise<Product> {
    return this.productService.update(productId, product);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remover um produto pelo ID' })
  @ApiParam({ name: 'productId', type: Number, description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso.' })
  async remove(@Param('productId') productId: number): Promise<void> {
    return this.productService.remove(productId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar produtos por critérios' })
  @ApiQuery({ name: 'productId', required: false, type: Number, description: 'ID do produto' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Nome do produto' })
  @ApiQuery({ name: 'price', required: false, type: Number, description: 'Preço do produto' })
  @ApiQuery({ name: 'description', required: false, type: String, description: 'Descrição do produto' })
  @ApiResponse({ status: 200, description: 'Produtos encontrados com sucesso.' })
  findByCriteria(@Query() query: Partial<Product>): Promise<Product[]> {
    if (!query || Object.keys(query).length === 0) {
      throw new BadRequestException('At least one search criterion must be provided');
    }

    const validKeys = ['productId', 'name', 'price', 'description'];
    const invalidKeys = Object.keys(query).filter(key => !validKeys.includes(key));
    if (invalidKeys.length > 0) {
      throw new BadRequestException(`Invalid query parameters: ${invalidKeys.join(', ')}`);
    }

    return this.productService.findByCriteria(query);
  }
}
