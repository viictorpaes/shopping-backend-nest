import { Controller, Get, Post, Put, Delete, Param, Body, Query, UsePipes, ValidationPipe, Logger, NotFoundException, BadRequestException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { FindByCriteriaDto } from './product.dto';
import { ProductSwagger } from './product.swagger';

@Controller('products') // Define o prefixo da rota como 'products'
export class ProductController {
  private readonly logger = new Logger(ProductController.name); // Logger para registrar mensagens de erro

  constructor(private readonly productService: ProductService) {}

  @Get() // Rota para listar todos os produtos ou buscar por critérios
  @ProductSwagger.findAll()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true })) // Valida os parâmetros da requisição
  async findAll(@Query() query: FindByCriteriaDto): Promise<Product[]> {
    try {
      // Busca produtos por critérios ou lista todos os produtos
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
      // Registra o erro e retorna uma exceção
      this.logger.error('Error fetching products', error.stack);
      throw new BadRequestException('An error occurred while fetching products');
    }
  }

  @Get(':id') // Rota para buscar um produto pelo ID
  @ProductSwagger.findOne()
  async findOne(@Param('id') id: number): Promise<Product | null> {
    try {
      // Valida o ID e busca o produto
      if (id <= 0) {
        throw new BadRequestException('Invalid ID');
      }
      return await this.productService.findOne(id);
    } catch (error) {
      // Registra o erro e retorna uma exceção
      this.logger.error('Error fetching product', error.stack);
      throw new BadRequestException('An error occurred while fetching the product');
    }
  }

  @Post() // Rota para criar um novo produto
  @ProductSwagger.create()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Valida o corpo da requisição
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Chama o serviço para criar o produto
      return await this.productService.create(createProductDto);
    } catch (error) {
      // Registra o erro e retorna uma exceção
      this.logger.error('Error creating product', error.stack);
      throw new BadRequestException('An error occurred while creating the product');
    }
  }

  @Put(':id') // Rota para atualizar um produto pelo ID
  @ProductSwagger.update()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Valida o corpo da requisição
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      // Chama o serviço para atualizar o produto
      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      // Registra o erro e retorna uma exceção
      this.logger.error('Error updating product', error.stack);
      throw new BadRequestException('An error occurred while updating the product');
    }
  }

  @Delete(':id') // Rota para remover um produto pelo ID
  @ProductSwagger.remove()
  async remove(@Param('id') id: number): Promise<void> {
    try {
      // Chama o serviço para remover o produto
      await this.productService.remove(id);
    } catch (error) {
      // Registra o erro e retorna uma exceção
      this.logger.error('Error deleting product', error.stack);
      throw new BadRequestException('An error occurred while deleting the product');
    }
  }

  @Post(':id/photos') // Rota para fazer upload de fotos para um produto
  @UseInterceptors(FilesInterceptor('photos', 10)) // Permite até 10 arquivos
  async uploadPhotos(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Product> {
    try {
      // Busca o produto e adiciona as fotos
      const product = await this.productService.findOne(id);
      if (!product) {
        throw new BadRequestException('Product not found');
      }

      const photos = files.map(file => file.path); // Salva os caminhos dos arquivos
      product.photos = [...(product.photos || []), ...photos];
      return await this.productService.update(id, { photos: product.photos });
    } catch (error) {
      // Registra o erro e retorna uma exceção
      throw new BadRequestException('An error occurred while uploading photos');
    }
  }
}
