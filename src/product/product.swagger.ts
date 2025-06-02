import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

export const ProductSwagger = {
  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Listar todos os produtos ou buscar por critérios' }),
      ApiQuery({ name: 'name', required: false, type: String, description: 'Nome do produto' }),
      ApiQuery({ name: 'priceGte', required: false, type: Number, description: 'Preço maior ou igual' }),
      ApiQuery({ name: 'priceLte', required: false, type: Number, description: 'Preço menor ou igual' }),
      ApiQuery({ name: 'description', required: false, type: String, description: 'Descrição do produto' }),
      ApiResponse({ status: 200, description: 'Produtos encontrados com sucesso.' }),
    ),
  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Buscar um produto pelo ID' }),
      ApiParam({ name: 'id', type: Number, description: 'ID do produto' }),
      ApiResponse({ status: 200, description: 'Produto encontrado com sucesso.' }),
      ApiResponse({ status: 400, description: 'ID do produto inválido.' }),
    ),
  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Criar um novo produto' }),
      ApiResponse({ status: 201, description: 'Produto criado com sucesso.' }),
    ),
  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Atualizar um produto pelo ID' }),
      ApiParam({ name: 'id', type: Number, description: 'ID do produto' }),
      ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' }),
    ),
  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Remover um produto pelo ID' }),
      ApiParam({ name: 'id', type: Number, description: 'ID do produto' }),
      ApiResponse({ status: 200, description: 'Produto removido com sucesso.' }),
    ),
};
