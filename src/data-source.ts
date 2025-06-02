import { DataSource } from 'typeorm';
import 'dotenv/config'; // Carrega variáveis de ambiente do arquivo .env

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_NAME || 'shopping.db', // Usa a variável DATABASE_NAME
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Certifique-se de que as entidades estão sendo carregadas corretamente
  migrations: [__dirname + '/migrations/*{.ts,.js}'], // Certifique-se de que as migrations estão sendo carregadas corretamente
  synchronize: false, // Desative em produção
  migrationsRun: true, // Executa as migrations automaticamente ao inicializar
});
