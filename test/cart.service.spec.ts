import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../src/cart/cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from '../src/cart/cart.entity';
import { Product } from '../src/product/product.entity';
import { Repository } from 'typeorm';

const mockCartRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockProductRepository = {
  find: jest.fn(),
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getRepositoryToken(Cart), useValue: mockCartRepository },
        { provide: getRepositoryToken(Product), useValue: mockProductRepository },
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
      mockProductRepository.find.mockResolvedValue(foundProducts);
      mockCartRepository.create.mockReturnValue(cartItem);
      mockCartRepository.save.mockResolvedValue(cartItem);

      const result = await service.addProducts(products);
      expect(result).toEqual([cartItem]);
      expect(mockProductRepository.find).toHaveBeenCalledWith({ where: { id: [1] } });
      expect(mockCartRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if products not found', async () => {
      mockProductRepository.find.mockResolvedValue([]);

      await expect(service.addProducts([{ productId: 1, quantity: 2 }])).rejects.toThrow('One or more products not found');
    });
  });
});
