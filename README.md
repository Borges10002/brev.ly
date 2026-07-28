# Brev.ly

Monorepositório do desafio Full Stack da Rocketseat:

- `web`: SPA React + Vite
- `server`: API Fastify + Drizzle + PostgreSQL

## Arquitetura

As duas aplicações são independentes. O servidor segue uma arquitetura modular:
cada domínio fica em `src/modules`, com `entities`, `dtos`, `repositories`,
`infra` e uma pasta por operação em `useCases`, contendo seu UseCase e Controller.
Banco, HTTP, erros e o container de injeção de dependências ficam em `src/shared`.
As implementações Drizzle e R2 são ligadas aos contratos pelo `tsyringe`.

No front-end, cada funcionalidade vive em `features`; componentes genéricos ficam
em `components`, integrações em `lib` e páginas apenas compõem esses elementos.

## Como executar

1. Copie `server/.env.example` para `server/.env`.
2. Copie `web/.env.example` para `web/.env`.
3. Suba o Postgres: `docker compose up -d`.
4. Em `server`, execute `npm install`, `npm run db:migrate` e `npm run dev`.
5. Em `web`, execute `npm install` e `npm run dev`.

## Documentação e testes

Com o servidor em execução, a documentação OpenAPI pode ser acessada em
`http://localhost:3333/docs`. O documento JSON está em `/docs/json`.

Na pasta `server`, execute `npm test` para rodar os testes unitários dos UseCases
e os testes dos Controllers por meio da injeção HTTP do Fastify.
