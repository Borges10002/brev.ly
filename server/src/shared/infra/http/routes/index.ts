import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { linksRoutes } from './links.routes.js'

export const routes: FastifyPluginAsyncZod = async (app) => {
  app.get('/health', {
    schema: {
      operationId: 'healthCheck',
      summary: 'Verificar disponibilidade',
      description: 'Confirma que o processo HTTP da API está respondendo.',
      tags: ['Status'],
      response: {
        200: z.object({
          status: z.literal('ok').describe('Estado atual da API.'),
        }).describe('API disponível.'),
      },
    },
  }, async () => ({ status: 'ok' as const }))
  await app.register(linksRoutes)
}
