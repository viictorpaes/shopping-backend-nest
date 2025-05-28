import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductModule } from '../product/product.module'; // Importação do ProductModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    ProductModule, // Certifique-se de importar o módulo de produtos
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
