import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    forwardRef(() => ProductModule),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService, TypeOrmModule], 
})
export class CartModule {}
