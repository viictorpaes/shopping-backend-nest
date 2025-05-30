import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'shopping.db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
