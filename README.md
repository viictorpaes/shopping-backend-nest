// Shopping Backend

// Este é o backend de um sistema de compras online desenvolvido com NestJS, TypeScript e SQLite.

// ## Requisitos

// - Node.js (v16 ou superior)
// - npm ou yarn

// ## Passos para rodar o projeto

// 1. Clone o repositório:
//    ```bash
//    git clone <URL_DO_REPOSITORIO>
//    cd shopping-backend
//    ```

// 2. Instale as dependências:
//    ```bash
//    npm install
//    ```

// 3. Configure o banco de dados SQLite (já configurado por padrão).

// 4. Rode as migrações (se necessário):
//    ```bash
//    npm run typeorm migration:run
//    ```

// 5. Inicie o servidor:
//    ```bash
//    npm run start
//    ```

// 6. Acesse a API em `http://localhost:3000`.

// ## Endpoints

// - **Produtos**
//   - `GET /products` - Listar todos os produtos.
//   - `GET /products/:id` - Buscar um produto específico.
//   - `POST /products` - Criar um novo produto.
//   - `PUT /products/:id` - Atualizar um produto.
//   - `DELETE /products/:id` - Remover um produto.

// - **Carrinho**
//   - `POST /cart` - Adicionar um produto ao carrinho.
//   - `DELETE /cart/:id` - Remover um produto do carrinho.
//   - `POST /cart/checkout` - Finalizar a compra.

// ## Tecnologias Utilizadas

// - NestJS
// - TypeScript
// - SQLite
// - TypeORM