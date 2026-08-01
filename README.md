<div align="center">
  <h1>🔗 Brev.ly</h1>
  <p>Encurte, compartilhe e acompanhe seus links em um só lugar.</p>

  <p>
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white">
    <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=111">
    <img alt="Fastify" src="https://img.shields.io/badge/Fastify-5-111111?style=flat-square&logo=fastify&logoColor=white">
    <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=flat-square&logo=postgresql&logoColor=white">
    <img alt="Docker" src="https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white">
  </p>
</div>

## Sobre

O **Brev.ly** é uma aplicação Full Stack para gerenciamento de URLs encurtadas.
Nela é possível criar, listar, copiar e remover links, acompanhar a quantidade de
acessos e exportar um relatório completo em CSV.

O projeto é dividido em duas aplicações independentes:

| Aplicação | Responsabilidade | Tecnologias principais |
| --- | --- | --- |
| [`web`](./web) | Interface responsiva e experiência do usuário | React, Vite, Tailwind CSS, React Query, React Hook Form e Zod |
| [`server`](./server) | API, regras de negócio, banco e relatórios | Fastify, Drizzle, PostgreSQL, R2, Swagger e Vitest |

## Funcionalidades

- Criar um link encurtado personalizado.
- Validar URL original e formato do encurtamento.
- Impedir encurtamentos duplicados.
- Listar os links cadastrados.
- Copiar e remover links.
- Redirecionar para a URL original.
- Incrementar a contagem de acessos de forma atômica.
- Exportar os links e acessos em CSV.
- Armazenar relatórios no Cloudflare R2.
- Exibir estados de carregamento, erro e lista vazia.
- Funcionar em desktop e dispositivos móveis.

## Como o projeto está organizado

```text
brev.ly/
├── web/                 # SPA React
│   └── src/
│       ├── components/  # Componentes reutilizáveis
│       ├── features/    # Funcionalidades de links
│       ├── lib/         # API e configurações
│       ├── pages/       # Home, redirecionamento e 404
│       └── styles/      # Tema e estilos responsivos
├── server/              # API Fastify
│   └── src/
│       ├── config/      # Variáveis de ambiente
│       ├── modules/     # Domínios e casos de uso
│       └── shared/      # HTTP, banco, erros e container
└── docker-compose.yml   # PostgreSQL local
```

### Web

O frontend é uma SPA mobile-first estilizada com Tailwind CSS. As páginas apenas organizam a interface,
enquanto regras de formulário, chamadas HTTP e estados assíncronos ficam na
feature `links`.

#### Melhorias do frontend

- Interface modernizada com Tailwind CSS 4 e identidade visual baseada em tokens de cores e tipografia.
- Layout mobile-first, adaptado para celulares e desktops sem perder a legibilidade dos links.
- Formulário com validação usando React Hook Form e Zod, mensagens de erro e bloqueio durante o envio.
- Atualização automática da listagem após criar ou excluir um link com React Query.
- Feedback visual para carregamento, falhas, lista vazia, exportação do CSV e redirecionamento.
- Ações rápidas para copiar, excluir e abrir links, além da exibição da quantidade de acessos.
- Páginas dedicadas para redirecionamento, link inválido e rota não encontrada.
- Testes automatizados de componentes, páginas, integração com a API e estados assíncronos.

Rotas disponíveis:

| Rota | Descrição |
| --- | --- |
| `/` | Cadastro e gerenciamento dos links |
| `/:shortUrl` | Resolução e redirecionamento do link |
| `*` | Página de recurso não encontrado |

### Server

O backend usa uma arquitetura modular baseada em SOLID. Cada operação possui
Controller e UseCase próprios. Repositórios e serviços externos são acessados
por contratos e conectados às implementações pelo `tsyringe`.

```text
modules/links/
├── dtos/
├── entities/
├── repositories/
├── providers/
├── infra/
│   ├── drizzle/
│   └── storage/
└── useCases/
    ├── createLink/
    ├── deleteLink/
    ├── exportLinks/
    ├── getOriginalUrl/
    └── listLinks/
```

Endpoints:

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica a disponibilidade da API |
| `GET` | `/links` | Lista todos os links |
| `POST` | `/links` | Cria um link |
| `GET` | `/links/:shortUrl` | Obtém a URL original e registra um acesso |
| `DELETE` | `/links/:id` | Remove um link |
| `POST` | `/links/export` | Gera e publica o relatório CSV |

## Executando localmente

### Pré-requisitos

- Node.js 22 ou superior
- npm
- Docker Desktop

### 1. Clone o projeto

```bash
git clone git@github.com:Borges10002/brev.ly.git
cd brev.ly
```

### 2. Configure o backend

```bash
cd server
copy .env.example .env
npm install
```

No Linux ou macOS, use `cp .env.example .env`.

### 3. Inicie o PostgreSQL

Na raiz do projeto:

```bash
docker compose up -d
```

Depois aplique as migrations:

```bash
cd server
npm run db:migrate
npm run dev
```

A API estará disponível em `http://localhost:3333`.

### 4. Configure o frontend

Em outro terminal:

```bash
cd web
copy .env.example .env
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

## Variáveis de ambiente

### Server

```env
PORT=3333
DATABASE_URL=postgresql://brevly:brevly@localhost:5432/brevly

CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_ACCESS_KEY_ID=""
CLOUDFLARE_SECRET_ACCESS_KEY=""
CLOUDFLARE_BUCKET=""
CLOUDFLARE_PUBLIC_URL=""
```

As variáveis do Cloudflare são necessárias para a exportação do CSV.

### Web

```env
VITE_FRONTEND_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3333
```

## Swagger

Com o backend em execução:

- Swagger UI: [`http://localhost:3333/docs`](http://localhost:3333/docs)
- OpenAPI JSON: [`http://localhost:3333/docs/json`](http://localhost:3333/docs/json)

A documentação apresenta os corpos das requisições, parâmetros, respostas e
possíveis erros de todos os endpoints.

## Testes

O servidor possui testes unitários dos UseCases e testes dos Controllers usando
`app.inject` do Fastify. Banco e storage são substituídos por implementações em
memória durante os testes.

```bash
cd server
npm test
```

O frontend usa Vitest, Testing Library e `jsdom`. A suíte cobre formulários,
integração HTTP, listagem, estados assíncronos, ações e páginas:

```bash
cd web
npm test
```

Comandos disponíveis nas duas aplicações:

```bash
npm run test:watch  # testes em modo de observação
npm run typecheck   # validação do TypeScript
npm run build       # build de produção
```

No frontend, também é possível gerar o relatório de cobertura:

```bash
npm run test:coverage
```

## Build de produção

```bash
cd server
npm run build
npm start
```

```bash
cd web
npm run build
npm run preview
```

## Autor

Desenvolvido por [Borges10002](https://github.com/Borges10002).
