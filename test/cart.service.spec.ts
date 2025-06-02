import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../src/cart/cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from '../src/cart/cart.entity';
import { Product } from '../src/product/product.entity';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockCartRepository = {
  find: jest.fn().mockResolvedValue([]), // Retorna uma lista vazia por padrão
  findOne: jest.fn().mockResolvedValue(null), // Retorna null por padrão
  create: jest.fn().mockImplementation((cartItem) => cartItem), // Retorna o item criado
  save: jest.fn().mockImplementation((cartItem) => ({ id: 1, ...cartItem })), // Retorna o item salvo com ID
  delete: jest.fn().mockResolvedValue(undefined), // Simula uma exclusão bem-sucedida
};

const mockProductRepository = {
  find: jest.fn().mockResolvedValue([]), // Retorna uma lista vazia por padrão
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      find: jest.fn().mockResolvedValue([]), // Simula busca de produtos
      save: jest.fn().mockResolvedValue({}), // Simula salvamento de itens no carrinho
    },
  }),
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getRepositoryToken(Cart), useValue: mockCartRepository },
        { provide: getRepositoryToken(Product), useValue: mockProductRepository },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all cart items', async () => {
      const cartItems = [{ id: 1, product: { id: 1, name: 'Product 1' }, quantity: 2 }];
      mockCartRepository.find.mockResolvedValue(cartItems);

      const result = await service.findAll();
      expect(result).toEqual(cartItems);
      expect(mockCartRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('addProducts', () => {
    it('should add products to the cart', async () => {
      const products = [{ productId: 1, quantity: 2 }];
      const foundProducts = [{ id: 1, name: 'Product 1' }];
      const cartItem = { id: 1, product: foundProducts[0], quantity: 2 };

      // Configura os mocks para simular o comportamento esperado
      mockDataSource.createQueryRunner().manager.find.mockResolvedValue(foundProducts);
      mockDataSource.createQueryRunner().manager.save.mockResolvedValue(cartItem);

      const result = await service.addProducts(products);
      expect(result).toEqual([cartItem]);
      expect(mockDataSource.createQueryRunner().manager.find).toHaveBeenCalledWith(Product, {
        where: { id: [1] },
      });
      expect(mockDataSource.createQueryRunner().manager.save).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if products not found', async () => {
      // Configura o mock para simular que nenhum produto foi encontrado
      mockDataSource.createQueryRunner().manager.find.mockResolvedValue([]);

      await expect(service.addProducts([{ productId: 1, quantity: 2 }])).rejects.toThrow(NotFoundException);
      await expect(service.addProducts([{ productId: 1, quantity: 2 }])).rejects.toThrow('One or more products not found');
    });
  });
});
