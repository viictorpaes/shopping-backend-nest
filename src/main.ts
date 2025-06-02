import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { AppDataSource } from './data-source'; // Importa o AppDataSource
import * as multer from 'multer'; // Corrige a importação do multer

async function bootstrap() {
  // Inicializa o AppDataSource e executa as migrations
  await AppDataSource.initialize()
    .then(() => console.log('Data Source has been initialized and migrations executed'))
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
      process.exit(1);
    });

  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Shopping API')
    .setDescription('API para gerenciar produtos e carrinho de compras')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Configuração do middleware para upload
  app.use(multer({ dest: './uploads' }).any());

  // Adiciona o filtro global de exceções
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 3000); // Usa a variável PORT ou 3000 como padrão
}
bootstrap();
