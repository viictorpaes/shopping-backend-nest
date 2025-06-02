import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Shopping API')
    .setDescription('API para gerenciar produtos e carrinho de compras')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Adiciona o filtro global de exceções
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 3000); // Usa a variável PORT ou 3000 como padrão
}
bootstrap();
