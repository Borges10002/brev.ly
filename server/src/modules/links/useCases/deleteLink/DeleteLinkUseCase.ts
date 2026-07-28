import { inject, injectable } from 'tsyringe'
import { AppError } from '@shared/errors/AppError.js'
import type { ILinksRepository } from '@modules/links/repositories/ILinksRepository.js'

@injectable()
export class DeleteLinkUseCase {
  constructor(
    @inject('LinksRepository')
    private readonly linksRepository: ILinksRepository,
  ) {}

  async execute(id: string) {
    if (!(await this.linksRepository.deleteById(id))) {
      throw new AppError('Link não encontrado.', 404)
    }
  }
}
