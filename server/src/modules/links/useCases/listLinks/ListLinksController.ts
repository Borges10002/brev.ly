import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { ListLinksUseCase } from './ListLinksUseCase.js'

export class ListLinksController {
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    const useCase = container.resolve(ListLinksUseCase)
    return reply.send({ links: await useCase.execute() })
  }
}

