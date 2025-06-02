import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

export const CartSwagger = {
  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Listar todos os itens do carrinho' }),
      ApiResponse({ status: 200, description: 'Itens do carrinho retornados com sucesso.' }),
    ),
  addProducts: () =>
    applyDecorators(
      ApiOperation({ summary: 'Adicionar produtos ao carrinho' }),
      ApiResponse({ status: 201, description: 'Produtos adicionados ao carrinho com sucesso.' }),
    ),
  removeProduct: () =>
    applyDecorators(
      ApiOperation({ summary: 'Remover um produto do carrinho' }),
      ApiParam({ name: 'id', type: Number, description: 'ID do carrinho' }),
      ApiQuery({ name: 'productId', required: true, type: Number, description: 'ID do produto' }),
      ApiResponse({ status: 200, description: 'Produto removido do carrinho com sucesso.' }),
      ApiResponse({ status: 404, description: 'Item do carrinho não encontrado.' }),
    ),
  updateQuantity: () =>
    applyDecorators(
      ApiOperation({ summary: 'Atualizar a quantidade de um produto no carrinho' }),
      ApiParam({ name: 'id', type: Number, description: 'ID do carrinho' }),
      ApiQuery({ name: 'productId', required: true, type: Number, description: 'ID do produto' }),
      ApiResponse({ status: 200, description: 'Quantidade do produto atualizada com sucesso.' }),
      ApiResponse({ status: 404, description: 'Item do carrinho não encontrado.' }),
    ),
  checkout: () =>
    applyDecorators(
      ApiOperation({ summary: 'Finalizar o carrinho' }),
      ApiParam({ name: 'id', type: Number, description: 'ID do carrinho' }),
      ApiResponse({ status: 200, description: 'Carrinho finalizado com sucesso.' }),
      ApiResponse({ status: 404, description: 'Carrinho não encontrado ou vazio.' }),
    ),
};
