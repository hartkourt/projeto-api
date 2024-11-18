API de Produtos e Categorias com Autenticação JWT
Este é um projeto de uma API RESTful construída com Node.js, Express, Prisma e JWT para autenticação. A API permite gerenciar produtos e categorias, oferecendo rotas públicas e privadas. As rotas privadas exigem que o usuário tenha um token JWT válido para acessá-las.

Tecnologias Utilizadas
Node.js: Ambiente de execução para JavaScript no lado do servidor.
Express: Framework para facilitar o desenvolvimento de APIs RESTful.
MongoDB: Banco de dados utilizado no projeto para armazenamento de dados.
Prisma: ORM para interagir com o banco de dados.
JWT (JSON Web Token): Para autenticação e autorização.
bcrypt: Para criptografar senhas de usuários.

Estrutura do Projeto

├── routes/
│   ├── public.js     # Rotas públicas: Cadastro e Login
│   └── private.js    # Rotas privadas: Gerenciamento de Produtos e Categorias
├── middlewares/
│   └── auth.js       # Middleware para autenticação de token JWT
├── server.js         # Arquivo principal do servidor
└── .env              # Variáveis de ambiente (como JWT_SECRET)

Pré-requisitos
Node.js (v14 ou superior)
Banco de Dados (utiliza Prisma para gerenciar o banco de dados, junto com MongoDB.)

Instalação
Clone o repositório:
git clone https://github.com/hartkourt/projeto-api
cd projeto-api

Instale as dependências do projeto:
npm install

Configure o arquivo .env com as variáveis necessárias:
DATABASE_URL="mongodb+srv://amandahartkopf:%25031928%25@projeto.h3r6y.mongodb.net/Projeto?retryWrites=true&w=majority&appName=Projeto"
JWT_SECRET="0a38bb050d4b273cd7948a3d1da92e771cdbedf65d7edc89a97a941d2fc7fb2d"

Rode as migrações para criar as tabelas no banco de dados (se estiver usando Prisma):
npx prisma migrate dev

Inicie o servidor:
npm start

O servidor irá rodar na porta 3000 por padrão.

Endpoints
Rotas Públicas (sem autenticação necessária)

POST /public/cadastro
Descrição: Cria um novo usuário.
Corpo da Requisição:
json
{
  "name": "Nome do Usuário",
  "username": "nomeusuario",
  "password": "senha123"
}

POST /public/login
Descrição: Realiza login e retorna um token JWT.
Corpo da Requisição:
json
{
  "username": "nomeusuario",
  "password": "senha123"
}

Resposta:
Retorna o token JWT que pode ser usado nas rotas privadas.

Rotas Privadas (necessitam de autenticação com JWT)

POST /private/criar-produto
Descrição: Cria um novo produto.
Corpo da Requisição:
json
{
  "name": "Produto Exemplo",
  "description": "Descrição do produto",
  "amount": 10,
  "price": 99.99,
  "categories": [1, 2]
}
Onde categories é um array com os IDs das categorias associadas ao produto.

GET /private/listar-produtos
Descrição: Lista todos os produtos com suas categorias associadas.

GET /private/listar-produto/:id
Descrição: Retorna um produto específico pelo ID.

PUT /private/editar-produto/:id
Descrição: Edita um produto existente.
Corpo da Requisição:
json
{
  "name": "Novo Nome do Produto",
  "description": "Nova descrição",
  "amount": 20,
  "price": 199.99,
  "categories": [1, 3]
}

DELETE /private/deletar-produto/:id
Descrição: Deleta um produto pelo ID.

POST /private/criar-categoria
Descrição: Cria uma nova categoria.
Corpo da Requisição:
json
{
  "name": "Categoria Exemplo",
  "description": "Descrição da categoria"
}

GET /private/listar-categorias
Descrição: Lista todas as categorias com os produtos associados.

GET /private/listar-categoria/:id
Descrição: Retorna uma categoria específica pelo ID.

PUT /private/editar-categoria/:id
Descrição: Edita uma categoria existente.
Corpo da Requisição:
json
{
  "name": "Nova Categoria",
  "description": "Nova descrição"
}

DELETE /private/deletar-categoria/:id
Descrição: Deleta uma categoria pelo ID.

Autenticação com JWT
Para acessar as rotas privadas, é necessário enviar um token JWT válido no cabeçalho da requisição. Para obter um token, faça o login usando a rota /public/login.

Cabeçalho da Requisição:
Authorization: Bearer <seu-token-jwt>

Exemplo de Teste com Postman

1. Cadastro de Usuário
Método: POST
URL: http://localhost:3000/public/cadastro
Body:
json
{
  "name": "João Silva",
  "username": "joao",
  "password": "senha123"
}

2. Login para Obter o Token JWT
Método: POST

URL: http://localhost:3000/public/login
Body:
json
{
  "username": "joao",
  "password": "senha123"
}

Resposta:
"seu-token-jwt-aqui"

3. Criar Produto com Token JWT
Método: POST
URL: http://localhost:3000/private/criar-produto
Cabeçalho:
Authorization: Bearer seu-token-jwt-aqui
Body:
{
  "name": "Produto Teste",
  "description": "Descrição do produto",
  "amount": 10,
  "price": 99.99,
  "categories": [1]
}

Esse README cobre a configuração do projeto, as rotas públicas e privadas, autenticação JWT, e exemplos de testes com o Postman. Adapte conforme necessário com base em qualquer alteração no projeto ou configurações adicionais.
