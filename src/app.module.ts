import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Carrega variáveis de ambiente do arquivo .env
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_NAME || 'shopping.db', // Usa a variável DATABASE_NAME
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Desative em produção
    }),
    ProductModule,
    CartModule,
  ],
})
export class AppModule {}
