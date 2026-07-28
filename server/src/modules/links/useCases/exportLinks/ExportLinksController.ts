import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { ExportLinksUseCase } from './ExportLinksUseCase.js'

export class ExportLinksController {
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    const useCase = container.resolve(ExportLinksUseCase)
    return reply.send(await useCase.execute())
  }
}

