import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import type { ICreateLinkDTO } from '@modules/links/dtos/ICreateLinkDTO.js'
import { CreateLinkUseCase } from './CreateLinkUseCase.js'

export class CreateLinkController {
  async handle(
    request: FastifyRequest<{ Body: ICreateLinkDTO }>,
    reply: FastifyReply,
  ) {
    const useCase = container.resolve(CreateLinkUseCase)
    const link = await useCase.execute(request.body)
    return reply.status(201).send({ link })
  }
}
