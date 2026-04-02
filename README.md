# 🎬 MovieShelf API

REST API para o MovieShelf — catálogo pessoal de filmes e séries com integração TMDB.

## 🚀 Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **ORM:** Prisma 7
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT (jsonwebtoken + bcryptjs)
- **Validação:** Zod
- **API Externa:** TMDB (The Movie Database)
- **Segurança:** Helmet, CORS, Rate Limiting

## 📁 Estrutura

```
src/
├── config/
│   ├── env.ts              # Variáveis de ambiente
│   └── prisma.ts           # Cliente Prisma com adapter-pg
├── controllers/
│   ├── auth.controller.ts   # Registro e login
│   ├── favorite.controller.ts
│   ├── list.controller.ts
│   ├── profile.controller.ts
│   ├── review.controller.ts
│   └── tmdb.controller.ts  # Busca, trending, detalhes, gêneros, discover
├── middlewares/
│   └── auth.ts             # Middleware JWT
├── routes/
│   ├── auth.routes.ts
│   ├── favorite.routes.ts
│   ├── list.routes.ts
│   ├── profile.routes.ts
│   ├── review.routes.ts
│   └── tmdb.routes.ts
├── services/
│   └── tmdb.service.ts     # Integração com TMDB API
├── utils/
│   ├── password.ts         # Hash e comparação bcrypt
│   └── token.ts            # Geração e verificação JWT
└── server.ts               # Entry point
```

## 🗄️ Banco de Dados

### Models

- **User** — Registro com nome, email e senha (bcrypt)
- **Favorite** — Filmes/séries favoritados (unique por user + tmdbId + mediaType)
- **List** — Listas personalizadas com nome e descrição
- **ListItem** — Itens dentro das listas (unique por list + tmdbId + mediaType)
- **Review** — Avaliações com nota (1-5) e comentário (unique por user + tmdbId + mediaType)

## 📡 Endpoints

### Auth

| Método | Rota             | Descrição           |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Criar conta         |
| POST   | `/auth/login`    | Login (retorna JWT) |

### Profile

| Método | Rota       | Descrição                      |
| ------ | ---------- | ------------------------------ |
| GET    | `/profile` | Dados do perfil + contagens 🔒 |

### TMDB

| Método | Rota                                 | Descrição                                     |
| ------ | ------------------------------------ | --------------------------------------------- |
| GET    | `/tmdb/search?q=batman`              | Buscar filmes e séries                        |
| GET    | `/tmdb/trending?type=all`            | Em alta (all/movie/tv)                        |
| GET    | `/tmdb/genres?type=movie`            | Lista de gêneros                              |
| GET    | `/tmdb/discover?type=movie&genre=28` | Discover por tipo e gênero                    |
| GET    | `/tmdb/movie/:id`                    | Detalhes do filme (sinopse, elenco, trailers) |
| GET    | `/tmdb/tv/:id`                       | Detalhes da série                             |

### Favoritos 🔒

| Método | Rota                                  | Descrição                                    |
| ------ | ------------------------------------- | -------------------------------------------- |
| POST   | `/favorites`                          | Adicionar favorito                           |
| GET    | `/favorites`                          | Listar favoritos (filtro: `?type=movie\|tv`) |
| GET    | `/favorites/check/:tmdbId/:mediaType` | Verificar se é favorito                      |
| DELETE | `/favorites/:tmdbId/:mediaType`       | Remover favorito                             |

### Reviews 🔒

| Método | Rota                          | Descrição                            |
| ------ | ----------------------------- | ------------------------------------ |
| POST   | `/reviews`                    | Criar review (nota 1-5 + comentário) |
| GET    | `/reviews`                    | Listar minhas reviews                |
| GET    | `/reviews/:tmdbId/:mediaType` | Buscar review específica             |
| PATCH  | `/reviews/:tmdbId/:mediaType` | Atualizar review                     |
| DELETE | `/reviews/:tmdbId/:mediaType` | Remover review                       |

### Listas 🔒

| Método | Rota                       | Descrição                                    |
| ------ | -------------------------- | -------------------------------------------- |
| POST   | `/lists`                   | Criar lista                                  |
| GET    | `/lists`                   | Listar minhas listas (com contagem de itens) |
| GET    | `/lists/:id`               | Ver lista com itens                          |
| PATCH  | `/lists/:id`               | Atualizar nome/descrição                     |
| DELETE | `/lists/:id`               | Remover lista                                |
| POST   | `/lists/:id/items`         | Adicionar item à lista                       |
| DELETE | `/lists/:id/items/:itemId` | Remover item da lista                        |

> 🔒 = Requer header `Authorization: Bearer <token>`

## ⚙️ Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL

### Setup

```bash
# Clonar repositório
git clone https://github.com/pecinallib/movieshelf-api.git
cd movieshelf-api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Gerar Prisma Client
npx prisma generate

# Rodar migrações
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

### Variáveis de Ambiente

```
DATABASE_URL="postgresql://user:pass@localhost:5432/movieshelf?schema=public"
JWT_SECRET="sua-chave-secreta"
TMDB_API_KEY="sua-api-key-tmdb"
TMDB_ACCESS_TOKEN="seu-token-de-acesso-tmdb"
TMDB_BASE_URL="https://api.themoviedb.org/3"
PORT=3333
```

## 📜 Scripts

| Script                    | Comando                                      |
| ------------------------- | -------------------------------------------- |
| `npm run dev`             | Servidor em modo desenvolvimento (tsx watch) |
| `npm run build`           | Compilar TypeScript                          |
| `npm start`               | Servidor em produção                         |
| `npm run prisma:generate` | Gerar Prisma Client                          |
| `npm run prisma:migrate`  | Rodar migrações                              |

## 🔗 Projeto Relacionado

- [MovieShelf Web](https://github.com/pecinallib/movieshelf-web) — Frontend React

## 👤 Autor

**Matheus Pecinalli** — [GitHub](https://github.com/pecinallib) · [LinkedIn](https://linkedin.com/in/dev-pecinalli) · [Portfólio](https://pecinalli-dev.vercel.app)

## 📄 Licença

Este projeto está sob a licença MIT.
