# Shopping Backend

Este é o backend para gerenciar produtos e carrinho de compras. Ele foi desenvolvido usando NestJS e SQLite.

## Pré-requisitos

Certifique-se de ter instalado:
- Node.js (versão 16 ou superior)
- NPM (gerenciador de pacotes do Node.js)

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd shopping-backend
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

## Rodando o Projeto

1. Execute as migrations para configurar o banco de dados:
   ```bash
   npm run typeorm migration:run
   ```

2. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```

3. Acesse o Swagger para explorar a API:
   - URL: [http://localhost:3000/api](http://localhost:3000/api)

## Rotas Disponíveis

### Produtos

#### **Listar todos os produtos**
- **URL**: `GET /products`
- **Descrição**: Retorna todos os produtos cadastrados.

#### **Buscar um produto pelo ID**
- **URL**: `GET /products/:productId`
- **Descrição**: Retorna um produto específico pelo ID.
- **Exemplo**:
  ```bash
  curl http://localhost:3000/products/1
  ```

#### **Criar um novo produto**
- **URL**: `POST /products`
- **Descrição**: Cria um novo produto.
- **Corpo**:
  ```json
  {
    "name": "Produto 1",
    "price": 100,
    "description": "Descrição Produto 1"
  }
  ```

#### **Atualizar um produto pelo ID**
- **URL**: `PUT /products/:productId`
- **Descrição**: Atualiza um produto específico pelo ID.
- **Corpo**:
  ```json
  {
    "name": "Produto Atualizado",
    "price": 120,
    "description": "Descrição Atualizada"
  }
  ```

#### **Remover um produto pelo ID**
- **URL**: `DELETE /products/:productId`
- **Descrição**: Remove um produto específico pelo ID.

#### **Buscar produtos por critérios**
- **URL**: `GET /products/search`
- **Descrição**: Busca produtos com base em critérios.
- **Query Params**:
  - `productId` (opcional)
  - `name` (opcional)
  - `price` (opcional)
  - `description` (opcional)
- **Exemplo**:
  ```bash
  curl "http://localhost:3000/products/search?name=Produto&price=100"
  ```

---

### Carrinho

#### **Listar todos os itens do carrinho**
- **URL**: `GET /cart`
- **Descrição**: Retorna todos os itens do carrinho.

#### **Adicionar produtos ao carrinho**
- **URL**: `POST /cart`
- **Descrição**: Adiciona múltiplos produtos ao carrinho.
- **Corpo**:
  ```json
  {
    "products": [
      { "productId": 1, "quantity": 2 },
      { "productId": 2, "quantity": 3 }
    ]
  }
  ```

#### **Remover um produto do carrinho**
- **URL**: `DELETE /cart/:id`
- **Descrição**: Remove um item específico do carrinho pelo ID.

#### **Finalizar compra**
- **URL**: `POST /cart/checkout`
- **Descrição**: Limpa todos os itens do carrinho.

---

## Observações

- Certifique-se de que o banco de dados SQLite (`shopping.db`) foi criado corretamente após executar as migrations.
- Use o Swagger para explorar e testar as rotas: [http://localhost:3000/api](http://localhost:3000/api).

Se encontrar algum problema, entre em contato ou abra uma issue no repositório.