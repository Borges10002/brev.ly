import { inject, injectable } from 'tsyringe'
import { AppError } from '@shared/errors/AppError.js'
import type { ILinksRepository } from '@modules/links/repositories/ILinksRepository.js'

@injectable()
export class GetOriginalUrlUseCase {
  constructor(
    @inject('LinksRepository')
    private readonly linksRepository: ILinksRepository,
  ) {}

  async execute(shortUrl: string) {
    const link = await this.linksRepository.findAndIncrementAccess(shortUrl)
    if (!link) throw new AppError('Link não encontrado.', 404)
    return link
  }
}
