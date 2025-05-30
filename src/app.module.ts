import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'shopping.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Desative em produção
    }),
    ProductModule,
    CartModule,
  ],
})
export class AppModule {}
