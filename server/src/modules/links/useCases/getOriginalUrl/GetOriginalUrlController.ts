import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { GetOriginalUrlUseCase } from './GetOriginalUrlUseCase.js'

export class GetOriginalUrlController {
  async handle(
    request: FastifyRequest<{ Params: { shortUrl: string } }>,
    reply: FastifyReply,
  ) {
    const useCase = container.resolve(GetOriginalUrlUseCase)
    return reply.send({ link: await useCase.execute(request.params.shortUrl) })
  }
}

