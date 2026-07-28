import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { CreateLinkController } from '@modules/links/useCases/createLink/CreateLinkController.js'
import { DeleteLinkController } from '@modules/links/useCases/deleteLink/DeleteLinkController.js'
import { ExportLinksController } from '@modules/links/useCases/exportLinks/ExportLinksController.js'
import { GetOriginalUrlController } from '@modules/links/useCases/getOriginalUrl/GetOriginalUrlController.js'
import { ListLinksController } from '@modules/links/useCases/listLinks/ListLinksController.js'

const createLinkController = new CreateLinkController()
const deleteLinkController = new DeleteLinkController()
const exportLinksController = new ExportLinksController()
const getOriginalUrlController = new GetOriginalUrlController()
const listLinksController = new ListLinksController()

const shortUrl = z.string().min(3).max(40).regex(/^[a-zA-Z0-9_-]+$/)
  .describe('Identificador único usado na URL encurtada.')

const linkSchema = z.object({
  id: z.uuid().describe('Identificador interno do link.'),
  originalUrl: z.url().describe('URL completa de destino.'),
  shortUrl,
  accessCount: z.number().int().nonnegative().describe('Quantidade de acessos.'),
  createdAt: z.date().describe('Data de criação do link.'),
})

const errorSchema = z.object({ message: z.string() })

export const linksRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get('/links', {
    schema: {
      operationId: 'listLinks',
      summary: 'Listar links',
      description: 'Retorna todos os links do mais recente para o mais antigo.',
      tags: ['Links'],
      response: {
        200: z.object({ links: z.array(linkSchema) }).describe('Lista de links.'),
        500: errorSchema.describe('Erro interno.'),
      },
    },
  }, listLinksController.handle)

  app.post('/links', {
    schema: {
      operationId: 'createLink',
      summary: 'Criar link',
      description: 'Cadastra uma URL original associada a um encurtamento único.',
      tags: ['Links'],
      body: z.object({
        originalUrl: z.url().describe('URL completa de destino.'),
        shortUrl,
      }),
      response: {
        201: z.object({ link: linkSchema }).describe('Link criado.'),
        400: errorSchema.describe('Dados inválidos.'),
        409: errorSchema.describe('Encurtamento já existente.'),
        500: errorSchema.describe('Erro interno.'),
      },
    },
  }, createLinkController.handle)

  app.delete('/links/:id', {
    schema: {
      operationId: 'deleteLink',
      summary: 'Excluir link',
      description: 'Remove definitivamente um link pelo identificador.',
      tags: ['Links'],
      params: z.object({ id: z.uuid().describe('UUID do link.') }),
      response: {
        204: z.null().describe('Link removido; resposta sem conteúdo.'),
        400: errorSchema.describe('Identificador inválido.'),
        404: errorSchema.describe('Link não encontrado.'),
        500: errorSchema.describe('Erro interno.'),
      },
    },
  }, deleteLinkController.handle)

  app.get('/links/:shortUrl', {
    schema: {
      operationId: 'resolveLink',
      summary: 'Resolver link encurtado',
      description: 'Retorna a URL original e incrementa atomicamente os acessos.',
      tags: ['Links'],
      params: z.object({ shortUrl }),
      response: {
        200: z.object({ link: linkSchema }).describe('Link encontrado.'),
        400: errorSchema.describe('Encurtamento inválido.'),
        404: errorSchema.describe('Link não encontrado.'),
        500: errorSchema.describe('Erro interno.'),
      },
    },
  }, getOriginalUrlController.handle)

  app.post('/links/export', {
    schema: {
      operationId: 'exportLinks',
      summary: 'Exportar relatório CSV',
      description: 'Gera o CSV, envia ao Cloudflare R2 e retorna a URL pública.',
      tags: ['Links'],
      response: {
        200: z.object({
          url: z.url().describe('URL pública do arquivo CSV.'),
        }).describe('Relatório gerado.'),
        500: errorSchema.describe('Falha ao gerar ou enviar o relatório.'),
      },
    },
  }, exportLinksController.handle)
}
