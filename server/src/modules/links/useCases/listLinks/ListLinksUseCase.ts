import { inject, injectable } from 'tsyringe'
import type { ILinksRepository } from '@modules/links/repositories/ILinksRepository.js'

@injectable()
export class ListLinksUseCase {
  constructor(
    @inject('LinksRepository')
    private readonly linksRepository: ILinksRepository,
  ) {}

  execute() {
    return this.linksRepository.list()
  }
}
