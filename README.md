# Shopping Backend

## Descrição
Este é o backend para um sistema de gerenciamento de produtos e carrinho de compras. Ele foi desenvolvido utilizando **NestJS** e **TypeORM** com banco de dados SQLite.

## Funcionalidades
- **Gerenciamento de Produtos**:
  - Criar, atualizar, listar e remover produtos.
  - Upload de fotos para produtos.
  - Busca por critérios como nome, preço e descrição.
- **Gerenciamento de Carrinho**:
  - Adicionar produtos ao carrinho.
  - Atualizar a quantidade de produtos no carrinho.
  - Remover produtos do carrinho.
  - Finalizar o carrinho (checkout).
- **Logs**:
  - Registro de ações realizadas no sistema, como criação, atualização e exclusão de produtos e itens do carrinho.

## Requisitos
- **Node.js**: Versão `18.16.0` (definida no arquivo `.nvmrc`).
- **Banco de Dados**: SQLite.

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/viictorpaes/shopping-backend-nest.git
   cd shopping-backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o ambiente:
   - Crie um arquivo `.env` baseado no `.env.example`:
     ```dotenv
     PORT=3000
     DATABASE_NAME=shopping.db
     ```

4. Execute as migrations:
   ```bash
   npm run typeorm migration:run
   ```

## Uso
1. Inicie o servidor:
   ```bash
   npm run start:dev
   ```

2. Acesse a documentação da API:
   - URL: [http://localhost:3000/api](http://localhost:3000/api)

## Testes
1. Execute os testes unitários:
   ```bash
   npm run test
   ```

2. Execute os testes de cobertura:
   ```bash
   npm run test:cov
   ```

3. Execute os testes end-to-end:
   ```bash
   npm run test:e2e
   ```
## Testando no Swagger

O Swagger é uma interface gráfica que permite testar as rotas da API diretamente no navegador.

1. **Acesse o Swagger**:
   - URL: [http://localhost:3000/api](http://localhost:3000/api)

2. **Rotas disponíveis**:
   - **Produtos**:
     - `GET /products`: Lista todos os produtos ou busca por critérios.
     - `GET /products/:id`: Busca um produto pelo ID.
     - `POST /products`: Cria um novo produto.
     - `PUT /products/:id`: Atualiza um produto pelo ID.
     - `DELETE /products/:id`: Remove um produto pelo ID.
     - `POST /products/:id/photos`: Faz upload de fotos para um produto.
   - **Carrinho**:
     - `GET /cart`: Lista todos os itens do carrinho.
     - `POST /cart`: Adiciona produtos ao carrinho.
     - `DELETE /cart/:id`: Remove um produto do carrinho.
     - `PATCH /cart/:id`: Atualiza a quantidade de um produto no carrinho.
     - `POST /cart/checkout/:id`: Finaliza o carrinho.

3. **Como testar**:
   - Clique na rota desejada.
   - Preencha os parâmetros necessários (ex.: `id`, `body`).
   - Clique em "Execute" para enviar a requisição.
   - Veja a resposta diretamente na interface do Swagger.

4. **Exemplo de teste**:
   - Para criar um produto:
     - Selecione `POST /products`.
     - Clique em "Try it out".
     - Preencha o corpo da requisição:
       ```json
       {
         "name": "Camisa",
         "price": 100,
         "description": "Camisa de algodão",
         "discount": 10,
         "photos": ["http://example.com/photo1.jpg"]
       }
       ```
     - Clique em "Execute".
     - Veja a resposta com o produto criado.

---
## Rotas e Exemplos

### **Produtos**
#### **GET /products**
Lista todos os produtos ou busca por critérios.

**Exemplo no Insomnia**:
- **URL**: `http://localhost:3000/products`
- **Query Params**:
  ```json
  {
    "name": "camisa",
    "priceGte": 50,
    "priceLte": 200,
    "description": "camisa"
  }
  ```

#### **GET /products/:id**
Busca um produto pelo ID.

**Exemplo no Insomnia**:
- **URL**: `http://localhost:3000/products/1`

#### **POST /products**
Cria um novo produto.

**Exemplo no Insomnia**:
- **URL**: `http://localhost:3000/products`
- **Body**:
  ```json
  {
    "name": "camisa 2",
    "price": 100,
    "description": "camisa camisa a",
    "discount": 10,
    "photos": ["http://example.com/photo1.jpg", "http://example.com/photo2.jpg"]
  }
  ```

#### **PUT /products/:id**
Atualiza um produto pelo ID.

**Exemplo no Insomnia**:
- **URL**: `http://localhost:3000/products/1`
- **Body**:
  ```json
  {
    "name": "camisa atualizada",
    "price": 120
  }
  ```

#### **DELETE /products/:id**
Remove um produto pelo ID.

**Exemplo no Insomnia**:
- **URL**: `http://localhost:3000/products/1`

#### **POST /products/:id/photos**
Faz upload de fotos para um produto.

**Exemplo no Insomnia**:
- **URL**: `http://localhost:3000/products/1/photos`
- **Body**:
  - Envie os arquivos no campo `photos` como `form-data`.

---

### **Carrinho**
#### **GET /cart**
Lista todos os itens do carrinho.

**Exemplo no Insomnia**:
- **URL**: `http://localhost:3000/cart`

#### **POST /cart**
Adiciona produtos ao carrinho.

**Exemplo no Insomnia**:
- **URL**: `http://localhost:3000/cart`
- **Body**:
  ```json
  {
    "products": [
      { "productId": 2, "quantity": 3 },
      { "productId": 3, "quantity": 1 }
    ]
  }
  ```

#### **DELETE /cart/:id**
Remove um produto do carrinho.

**Exemplo no Insomnia**:
- **URL**: `http://localhost:3000/cart/4?productId=2`

#### **PATCH /cart/:id**
Atualiza a quantidade de um produto no carrinho.

**Exemplo no Insomnia**:
- **URL**: `http://localhost:3000/cart/4?productId=2`
- **Body**:
  ```json
  {
    "quantity": 5
  }
  ```

#### **POST /cart/checkout/:id**
Finaliza o carrinho.

**Exemplo no Insomnia**:
- **URL**: `http://localhost:3000/cart/checkout/4`

---

## Regras de Negócio
### Produtos
- **Criação**:
  - Um produto deve conter `name`, `price` e `description`.
  - O campo `discount` é opcional e deve ser maior ou igual a 0.
  - O campo `photos` aceita múltiplas URLs de imagens.

- **Busca**:
  - É possível buscar produtos por critérios como `name`, `priceGte`, `priceLte` e `description`.

- **Upload de Fotos**:
  - Até 10 fotos podem ser enviadas por produto.
  - As fotos são armazenadas no diretório `./uploads`.

### Carrinho
- **Adição de Produtos**:
  - Produtos são adicionados ao carrinho com `productId` e `quantity`.
  - Caso o produto não exista, uma exceção será lançada.

- **Atualização de Quantidade**:
  - A quantidade de um produto no carrinho pode ser atualizada.
  - Caso o item não exista, uma exceção será lançada.

- **Remoção de Produtos**:
  - Produtos podem ser removidos do carrinho utilizando o `id` do carrinho e o `productId`.

- **Checkout**:
  - Finaliza o carrinho removendo todos os itens associados ao `id` do carrinho.

### Logs
- Todas as ações realizadas no sistema são registradas no banco de dados:
  - Exemplo: `CREATE_PRODUCT`, `DELETE_CART_ITEM`.

---

## Estrutura do Projeto
- **src**:
  - `product`: Gerenciamento de produtos.
  - `cart`: Gerenciamento de carrinho.
  - `logs`: Registro de ações realizadas.
  - `common`: Filtros globais e utilitários.
  - `migrations`: Scripts para criação e alteração de tabelas no banco de dados.

## Contribuição
1. Crie um branch para sua feature:
   ```bash
   git checkout -b minha-feature
   ```

2. Faça suas alterações e commit:
   ```bash
   git commit -m "Adiciona minha feature"
   ```

3. Envie o branch para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```

4. Abra um Pull Request.

## Licença
Este projeto está sob a licença **Victor Paes**.