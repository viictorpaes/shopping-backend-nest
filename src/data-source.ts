import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite', // ou 'mysql', 'postgres', etc.
  database: 'shopping.db', // Nome do arquivo SQLite ou configuração do banco
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Caminho para as entidades
  migrations: [__dirname + '/migrations/*{.ts,.js}'], // Caminho para as migrations
  synchronize: false, // Desative em produção
});
