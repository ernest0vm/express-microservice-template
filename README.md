# Express Microservice Template

TypeScript starter for Express microservices with Prisma 7, PostgreSQL, JWT auth, and Vitest.

**Requirements:**

- Node.js `>= 22`
- Yarn `4.x`
- [Docker](https://docs.docker.com/get-docker/)

## Quick start

```bash
cp .env.example .env
yarn install
yarn db:migrate
yarn db:seed
yarn dev
```

`yarn dev` starts PostgreSQL via Docker Compose (and waits until it is healthy) before launching the app.

| Endpoint | Auth | Description |
| -------- | ---- | ----------- |
| `GET http://localhost:3000/healthcheck` | No | Liveness check (root, outside API context) |
| `POST http://localhost:3000/my-service/v1/auth/token` | No | Issue a JWT (`admin` / `admin` by default) |
| `GET http://localhost:3000/my-service/v1/examples` | No | List examples |
| `POST http://localhost:3000/my-service/v1/examples` | JWT | Create example |

Example: get a token and create an item:

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/my-service/v1/auth/token \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin"}' | jq -r .token)

curl -X POST http://localhost:3000/my-service/v1/examples \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"New example"}'
```

## Project structure

```
├── prisma/
│   ├── schema.prisma       # Data models
│   ├── migrations/         # Versioned SQL migrations
│   └── seed.ts             # Seed script
├── prisma.config.ts        # Prisma 7 CLI config (DATABASE_URL, seeds)
├── src/
│   ├── app.ts              # Express app, middleware, routes (exported for tests)
│   ├── server.ts           # HTTP server bootstrap
│   ├── config.ts           # Env → typed config object
│   ├── generated/prisma/   # Generated Prisma Client (do not edit)
│   ├── types/              # Shared TypeScript types
│   ├── routes/             # One Router per domain
│   ├── controllers/        # Business logic
│   ├── middlewares/        # Auth, validation, error handling
│   ├── lib/                # JWT, Prisma client, messages
│   └── loggers/            # Winston + Morgan
├── tests/                  # Vitest + Supertest
├── docker-compose.yml      # Local PostgreSQL
└── Dockerfile
```

## Conventions

| Area          | Convention                                                   |
| ------------- | ------------------------------------------------------------ |
| Entry         | `app.ts` builds the Express app; `server.ts` listens         |
| API prefix    | Versioned via `SERVICE_CONTEXT` (e.g. `/my-service/v1`)      |
| Routes        | One `express.Router()` per domain, mounted under the context |
| Controllers   | Static class methods; pass errors with `next(err)`           |
| Auth          | JWT on write routes (e.g. POST); payload on `req.extraData` |
| Errors        | Centralized `handleError` with `EA####` codes                |
| Logging       | Morgan (success/error streams) + Winston                     |
| Config        | `dotenv` → `src/config.ts`                                   |
| Database      | Prisma 7 + PostgreSQL (`@prisma/adapter-pg`)                 |
| Health        | `/healthcheck` at root (outside versioned context)           |
| Tests         | Vitest + Supertest                                           |
| Lint / format | ESLint + Prettier                                            |

## Environment

Copy `.env.example` to `.env` and adjust as needed:

| Variable              | Default                                                    | Description                |
| --------------------- | ---------------------------------------------------------- | -------------------------- |
| `NODE_ENV`            | `development`                                              | Runtime environment        |
| `SERVER_PORT`         | `3000`                                                     | HTTP port                  |
| `SERVICE_CONTEXT`     | `/my-service/v1`                                           | API base path              |
| `DATABASE_URL`        | `postgresql://postgres:postgres@localhost:5432/my_service` | Postgres connection string |
| `SECRET`              | —                                                          | JWT signing secret         |
| `JWT_EXPIRATION_TIME` | `3600`                                                     | Token TTL (seconds)        |
| `JWT_ISSUER`          | `my-service`                                               | JWT issuer claim           |
| `AUTH_USERNAME`       | `admin`                                                    | Demo user for `/auth/token` |
| `AUTH_PASSWORD`       | `admin`                                                    | Demo password for `/auth/token` |
| `LOG_LEVEL`           | `debug`                                                    | Winston log level          |

## Database (Prisma 7)

`src/config.ts` is the single source of truth for app settings (including `DATABASE_URL`). Prisma CLI reads that same config through `prisma.config.ts` — the URL is no longer set in `schema.prisma`.

```
.env  →  src/config.ts  →  src/lib/prisma.ts   (runtime)
                        →  prisma.config.ts    (CLI: migrate, seed, studio)
prisma/schema.prisma  →  prisma/migrations/    (schema history)
                      →  src/generated/prisma/ (client + types)
```

| Path                    | Role                                  |
| ----------------------- | ------------------------------------- |
| `src/config.ts`         | App config source of truth            |
| `prisma/schema.prisma`  | Models and relations                  |
| `prisma/migrations/`    | Versioned SQL history                 |
| `prisma.config.ts`      | Prisma CLI config                     |
| `src/lib/prisma.ts`     | Runtime Prisma client                 |
| `src/generated/prisma/` | Generated client (`yarn db:generate`) |

```bash
yarn db:generate   # Generate client → src/generated/prisma
yarn db:migrate    # Apply migrations (dev)
yarn db:push       # Push schema without migrations
yarn db:seed       # Run prisma/seed.ts
yarn db:studio     # Open Prisma Studio
```

## Customize for a new service

1. Rename the package in `package.json`
2. Set `SERVICE_CONTEXT` in `.env` (e.g. `/payments-service/v1`)
3. Add models in `prisma/schema.prisma`, then `yarn db:migrate`
4. Add routes under `src/routes/` and mount them in `src/app.ts`
5. Add controllers and validation middleware as needed
6. Extend `src/config.ts` with service-specific settings

## Optional integrations

- **AMQP** — `lib/amqp.ts` plus a `receiver.ts` worker
- **Response transform** — `express-mung` for camelCase responses
- **Swagger** — `swagger-ui-express` at `/api-docs`
- **Cron** — start jobs from `app.ts` or `server.ts`

## Scripts

| Script                            | Description                                 |
| --------------------------------- | ------------------------------------------- |
| `yarn build`                      | Generate Prisma Client + compile TypeScript |
| `yarn start`                      | Run compiled app (production)               |
| `yarn dev`                        | Start Postgres (Docker) + Nodemon + tsx     |
| `yarn db:up`                      | Start Postgres with Docker Compose          |
| `yarn db:down`                    | Stop Postgres (Docker Compose)              |
| `yarn db:generate`                | Generate Prisma Client                      |
| `yarn db:migrate`                 | Run migrations (dev)                        |
| `yarn db:push`                    | Push schema without migrations              |
| `yarn db:seed`                    | Seed the database                           |
| `yarn db:studio`                  | Open Prisma Studio                          |
| `yarn lint` / `yarn lint:fix`     | ESLint                                      |
| `yarn format` / `yarn format:fix` | Prettier                                    |
| `yarn types`                      | Generate client + type-check (no emit)      |
| `yarn test` / `yarn test:watch`   | Vitest (+ coverage on `test`)               |

## Docker

Local Postgres (also started automatically by `yarn dev`):

```bash
yarn db:up
```

Build and run the service:

```bash
docker build -t my-service .
docker run -p 3000:3000 --env-file .env my-service
```
