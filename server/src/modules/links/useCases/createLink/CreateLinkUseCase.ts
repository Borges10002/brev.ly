import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import { AppError } from '@shared/errors/AppError.js'
import type { ICreateLinkDTO } from '@modules/links/dtos/ICreateLinkDTO.js'
import type { ILinksRepository } from '@modules/links/repositories/ILinksRepository.js'

const shortUrlSchema = z
  .string()
  .min(3)
  .max(40)
  .regex(/^[a-zA-Z0-9_-]+$/)

@injectable()
export class CreateLinkUseCase {
  constructor(
    @inject('LinksRepository')
    private readonly linksRepository: ILinksRepository,
  ) {}

  async execute(data: ICreateLinkDTO) {
    const parsed = z.object({
      originalUrl: z.url(),
      shortUrl: shortUrlSchema,
    }).safeParse(data)

    if (!parsed.success) {
      throw new AppError('URL original ou encurtamento inválido.')
    }
    if (await this.linksRepository.findByShortUrl(parsed.data.shortUrl)) {
      throw new AppError('Este encurtamento já está em uso.', 409)
    }

    return this.linksRepository.create(parsed.data)
  }
}
