import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../src/product/product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../src/product/product.entity';
import { LogService } from '../src/logs/log.service';
import { Repository } from 'typeorm';

const mockProductRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockLogService = {
  createLog: jest.fn(),
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useValue: mockProductRepository },
        { provide: LogService, useValue: mockLogService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [{ id: 1, name: 'Product 1', price: 100 }];
      mockProductRepository.find.mockResolvedValue(products);

      const result = await service.findAll();
      expect(result).toEqual(products);
      expect(mockProductRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const product = { id: 1, name: 'Product 1', price: 100 };
      mockProductRepository.findOneBy.mockResolvedValue(product);

      const result = await service.findOne(1);
      expect(result).toEqual(product);
      expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow('Product not found');
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const product = { name: 'Product 1', price: 100 };
      const savedProduct = { id: 1, ...product };
      mockProductRepository.create.mockReturnValue(product);
      mockProductRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(product);
      expect(result).toEqual(savedProduct);
      expect(mockProductRepository.create).toHaveBeenCalledWith(product);
      expect(mockProductRepository.save).toHaveBeenCalledWith(product);
      expect(mockLogService.createLog).toHaveBeenCalledWith('CREATE_PRODUCT', 'Produto criado com ID 1');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const product = { id: 1, name: 'Updated Product', price: 150 };
      mockProductRepository.findOneBy.mockResolvedValue(product);
      mockProductRepository.update.mockResolvedValue(undefined);

      const result = await service.update(1, { name: 'Updated Product', price: 150 });
      expect(result).toEqual(product);
      expect(mockProductRepository.update).toHaveBeenCalledWith(1, { name: 'Updated Product', price: 150 });
      expect(mockLogService.createLog).toHaveBeenCalledWith('UPDATE_PRODUCT', 'Produto atualizado com ID 1');
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(1, { name: 'Updated Product' })).rejects.toThrow('Product not found');
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const product = { id: 1, name: 'Product 1', price: 100 };
      mockProductRepository.findOneBy.mockResolvedValue(product);
      mockProductRepository.delete.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
      expect(mockLogService.createLog).toHaveBeenCalledWith('DELETE_PRODUCT', 'Produto removido com ID 1');
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow('Product not found');
    });
  });
});
