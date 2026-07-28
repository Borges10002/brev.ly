import type { ICreateLinkDTO } from '@modules/links/dtos/ICreateLinkDTO.js'
import type { Link } from '@modules/links/entities/Link.js'
import type { ILinksRepository } from '@modules/links/repositories/ILinksRepository.js'

export class InMemoryLinksRepository implements ILinksRepository {
  items: Link[] = []

  async create(data: ICreateLinkDTO) {
    const link: Link = {
      id: crypto.randomUUID(),
      ...data,
      accessCount: 0,
      createdAt: new Date(),
    }
    this.items.push(link)
    return link
  }

  async findByShortUrl(shortUrl: string) {
    return this.items.find((link) => link.shortUrl === shortUrl) ?? null
  }

  async list() {
    return [...this.items].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )
  }

  async deleteById(id: string) {
    const index = this.items.findIndex((link) => link.id === id)
    if (index < 0) return false
    this.items.splice(index, 1)
    return true
  }

  async findAndIncrementAccess(shortUrl: string) {
    const link = await this.findByShortUrl(shortUrl)
    if (!link) return null
    link.accessCount += 1
    return link
  }
}

