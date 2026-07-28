import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { DeleteLinkUseCase } from './DeleteLinkUseCase.js'

export class DeleteLinkController {
  async handle(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const useCase = container.resolve(DeleteLinkUseCase)
    await useCase.execute(request.params.id)
    return reply.status(204).send()
  }
}

