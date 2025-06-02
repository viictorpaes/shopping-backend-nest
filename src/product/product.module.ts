import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CartModule } from '../cart/cart.module';
import { LogModule } from '../logs/log.module'; // Importa o LogModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => CartModule),
    LogModule, // Adiciona o LogModule como dependência
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
