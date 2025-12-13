# 📌 Feature Flag Manager

Um **gerenciador de feature flags** que permite ao usuário cadastrar **projetos**, **ambientes** e **feature flags** de forma simples e organizada.

Esse é um **monorepo** que contém tanto o **backend** quanto o **frontend**, integrados para uma experiência consistente no desenvolvimento de aplicações com controle de recursos.

---

## 🧠 Tecnologias

Este projeto é estruturado como um **monorepo** com:

### 🛠 Backend

- **NestJS**

- **Prisma ORM**

- **PostgreSQL**

### 🖥 Frontend

- **AstroJS**

- **React** (como Islands)

- **shadcn/ui**

- **Tailwind CSS**

---

## 🎨 Design

O layout e o design do frontend foram gerados utilizando a **Lovable AI** para uma experiência visual moderna e objetiva.

---

## 🧹 Convenções e Qualidade de Código

O projeto utiliza melhores práticas com ferramentas de padronização:

- **Prettier** --- Formatação de código consistente

- **lefthook + commitlint** --- Padronização de commits

> Exemplo de commit:\
> _(feat(backend): add new feature)_

---

## 🚀 Como Rodar o Projeto

Requisitos:

- Docker & Docker Compose

- Node.js (para casos onde for rodar local sem containers)

### 📦 1. Rodando tudo com Docker

No diretório raíz do projeto:

`docker compose up --build -d`

Isso vai iniciar:

- Backend http://localhost:3000

- Frontend http://localhost:4321

- Banco de dados PostgreSQL - Porta 5431

- Banco de dados PostgreSQL para testes E2E - 5434

---

## 📁 Variáveis de Ambiente

### 🫚 Raiz do projeto

Crie um arquivo `.env.backend` na raiz do projeto com:

`SECRET_KEY="secret_sha256"`

### 🧠 Backend

Crie um arquivo `.env` na raiz do backend com as variáveis abaixo para rodar local sem o docker:

`DATABASE_URL="postgresql://admin:adminpassword@localhost:5431/feature_flags_db?schema=public"`
`SECRET_KEY="secret_sha256"`

E crie um arquivo `.env.test` na raiz do backend com as variáveis abaixo para rodar os testes E2E:

`DATABASE_URL="postgresql://admin:adminpassword@localhost:5434/feature_flags_test_db?schema=public""`
`SECRET_KEY="secret_sha256"`

### 🖥 Frontend

No frontend, configure seu `.env` com a chave abaixo para caso vá rodar local sem o docker:

`INTERNAL_API_URL="http://127.0.0.1:3000"`

---

## 🛠️ Banco de Dados com Prisma

Após iniciar o container do banco:

### 📌 Executar a primeira migração

`cd backend` `npx prisma migrate dev --name init`

Isso vai criar as tabelas baseadas nos modelos definidos no Prisma.

---

## 🧪 Testes do Backend

Para rodar os testes unitários do backend, execute:

`cd backend`
`npm install`
`npm test`

E para rodar os testes E2E, execute:

`cd backend`
`npm install`
`test:db:setup`
`test:e2e`

OBS: É necessário rodar o comando "db:setup" para executar a migration no banco de testes, necessário na primeira vez e sempre que tiver um nova alteração no schema

## 🎯 Estrutura do Projeto

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
└── package.json        # Scripts globais do monorepo
```

---

## 📁 Scripts Úteis

Dentro de cada workspace (backend/frontend), você pode usar:

- **Instalar dependências**

  `npm install`

- **Rodar em modo de desenvolvimento**
  - backend - `npm run start:dev`
  - frontend - `npm run dev`

- **Build de produção**

  `npm run build`
