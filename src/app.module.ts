import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // ou 'mysql', 'postgres', etc., dependendo do banco de dados
      database: 'shopping.db', // Nome do arquivo SQLite ou configuração do banco
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Caminho para as entidades
      synchronize: true, // Não use em produção, pois recria tabelas automaticamente
    }),
    ProductModule,
    CartModule,
  ],
})
export class AppModule {}
