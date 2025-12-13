# 📌 Feature Flag Manager

Um **gerenciador de feature flags** que permite ao usuário cadastrar **projetos**, **ambientes** e **feature flags** de forma simples e organizada.

Este projeto é estruturado como um **monorepo**, contendo **backend** e **frontend** integrados.

---

## 🧠 Tecnologias

> [!ATENÇÃO]
> Para executar o projeto sem problemas, principalmente os testes, rodar o node em uma destas versões 20.19+, 22.12+, 24.0+

Este projeto é um **monorepo**, dividido da seguinte forma:

### 🛠 Backend

- NestJS --- Framework progressivo para Node.js

- Prisma ORM --- ORM moderno para TypeScript

- PostgreSQL --- Banco de dados relacional

### 🖥 Frontend

- AstroJS --- Framework focado em performance

- React (Islands) --- Componentes interativos

- shadcn/ui --- Biblioteca de componentes

- Tailwind CSS --- Estilização utilitária

---

## 🎨 Design

O design do frontend foi gerado utilizando a **Lovable AI**, garantindo uma interface moderna e funcional.

---

## 🧹 Padronização e Qualidade de Código

Este projeto utiliza boas práticas de padronização e automação:

- Prettier para formatação de código

- lefthook para hooks de Git

- commitlint para padronização de mensagens de commit

Exemplo de commit\
(feat(backend): add new feature)

---

## 🚀 Como Rodar o Projeto

---

### Configuração inicial

## 🔐 Configuração de Variáveis de Ambiente

Na raiz do projeto, crie um arquivo chamado `.env.backend` com o seguinte conteúdo:

`SECRET_KEY="secret_sha256"`

### 🛠 Backend

Crie um arquivo `.env` na raiz do backend:

`DATABASE_URL="postgresql://admin:adminpassword@localhost:5431/feature_flags_db?schema=public"` <br>
`SECRET_KEY="secret_sha256"`

### 🖥 Frontend

No diretório do frontend, crie um arquivo `.env` com a variável abaixo para rodar localmente sem Docker:

`INTERNAL_API_URL="http://127.0.0.1:3000"`

### Testes E2E

Crie um arquivo `.env.test` na raiz do backend para executar os testes E2E:

`DATABASE_URL="postgresql://admin:adminpassword@localhost:5434/feature_flags_test_db?schema=public"`<br>
`SECRET_KEY="secret_sha256"`

---

## 🐳 Rodando com Docker (Recomendado)

### Subindo os containers

Ainda na raiz do projeto, com o Docker já instalado e em execução na sua máquina, execute:

`docker compose up --build -d`

Isso irá iniciar:

- Backend: <http://localhost:3000>

- Frontend: <http://localhost:4321>

- Banco de dados PostgreSQL: porta 5431

- Banco de dados PostgreSQL para testes E2E: porta 5434

OBS: após a configuração inicial o docker pode ser rodado com docker compose up -d

---

## 💻 Rodando Localmente (Sem Docker)

Para rodar o projeto localmente sem Docker, siga os passos abaixo.

### Instalação das dependências

É necessário instalar as dependências na raiz do projeto, no backend e no frontend:

Na raiz do projeto:\
npm install

No backend:\
cd backend\
npm install

No frontend:\
cd frontend\
npm install

---

## 🛠️ Banco de Dados com Prisma

Caso esteja rodando o projeto localmente ainda vai ser necessário rodar o docker para configurar o banco de dados e o prisma,
neste caso ainda será necessário executar o generate na sua máquina:

cd backend\
npx prisma generate
npx prisma migrate dev --name init

---

## ▶️ Executando a Aplicação Localmente

### Backend

Para iniciar o backend em modo de desenvolvimento:

cd backend\
npm run start:dev

A API ficará disponível em:\
<http://localhost:3000>

---

### Frontend

Para iniciar o frontend em modo de desenvolvimento:

cd frontend\
npm run dev

O frontend ficará disponível em:\
<http://localhost:4321>

---

## 🧪 Testes do Backend

Para rodar os testes unitários do backend, execute:

cd backend\
npm install\
npm test

E para rodar os testes E2E, execute:

cd backend\
npm install\
npm run test:db:setup\
npm run test:e2e

OBS: É necessário rodar o comando **test:db:setup** para executar a migration no banco de testes.\
Esse passo é obrigatório na primeira execução e sempre que houver alterações no schema do Prisma.

---

## 📁 Estrutura do Projeto

```text
/
├── backend/            # Aplicação NestJS (API REST)
│   ├── src/
│   ├── prisma/         # Schema e Migrations do banco
│   ├── Dockerfile.backend
│   └── ...
├── frontend/           # Aplicação Astro + React (Interface)
│   ├── src/
│   ├── Dockerfile.frontend
│   └── ...
├── docker-compose.yml  # Orquestração dos serviços (App + Bancos)
├── lefthook.yml        # Configuração de Git Hooks
└── package.json        # Scripts globais do monorepo`
```

---
