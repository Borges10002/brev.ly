import type { ICreateLinkDTO } from '@modules/links/dtos/ICreateLinkDTO.js'
import type { Link } from '@modules/links/entities/Link.js'

export interface ILinksRepository {
  create(data: ICreateLinkDTO): Promise<Link>
  findByShortUrl(shortUrl: string): Promise<Link | null>
  list(): Promise<Link[]>
  deleteById(id: string): Promise<boolean>
  findAndIncrementAccess(shortUrl: string): Promise<Link | null>
}
