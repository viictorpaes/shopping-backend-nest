import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { LogModule } from './logs/log.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Carrega variáveis de ambiente do arquivo .env
    TypeOrmModule.forRoot({
      type: 'sqlite', // Define o tipo de banco de dados como SQLite
      database: process.env.DATABASE_NAME || 'shopping.db', // Usa a variável DATABASE_NAME ou o padrão 'shopping.db'
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Carrega todas as entidades
      synchronize: false, // Desative em produção para evitar alterações automáticas no banco
    }),
    ProductModule, // Módulo responsável pelo gerenciamento de produtos
    CartModule,    // Módulo responsável pelo gerenciamento do carrinho
    LogModule,     // Módulo responsável pelo registro de logs
  ],
})
export class AppModule {}
