import 'reflect-metadata'
import '@config/env.js'
import '@shared/container/index.js'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import Fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { AppError } from '@shared/errors/AppError.js'
import { routes } from './routes/index.js'

export function buildApp() {
  const app = Fastify({ logger: true })

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)
  app.register(cors, { origin: true })
  app.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Brev.ly API',
        description: 'API REST para criação, gerenciamento, redirecionamento e exportação de links encurtados.',
        version: '1.0.0',
      },
      servers: [{
        url: `http://localhost:${process.env.PORT ?? 3333}`,
        description: 'Ambiente local',
      }],
      tags: [
        { name: 'Status', description: 'Disponibilidade da API.' },
        { name: 'Links', description: 'Gerenciamento dos links encurtados.' },
      ],
    },
    transform: jsonSchemaTransform,
  })
  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: true },
    staticCSP: true,
  })
  app.register(routes)

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message })
    }
    if (error instanceof Error && 'validation' in error) {
      return reply.status(400).send({
        message: 'Dados inválidos.',
        issues: error.validation,
      })
    }
    app.log.error(error)
    return reply.status(500).send({ message: 'Erro interno do servidor.' })
  })

  return app
}
