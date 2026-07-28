import { desc, eq, sql } from 'drizzle-orm'
import { injectable } from 'tsyringe'
import { db } from '@shared/infra/database/client.js'
import { links } from '@shared/infra/database/schema.js'
import type { ICreateLinkDTO } from '@modules/links/dtos/ICreateLinkDTO.js'
import type { ILinksRepository } from '@modules/links/repositories/ILinksRepository.js'

@injectable()
export class LinksRepository implements ILinksRepository {
  async create(data: ICreateLinkDTO) {
    const [link] = await db.insert(links).values(data).returning()
    if (!link) throw new Error('Não foi possível criar o link.')
    return link
  }

  async findByShortUrl(shortUrl: string) {
    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.shortUrl, shortUrl))
      .limit(1)
    return link ?? null
  }

  list() {
    return db.select().from(links).orderBy(desc(links.createdAt))
  }

  async deleteById(id: string) {
    const deleted = await db
      .delete(links)
      .where(eq(links.id, id))
      .returning({ id: links.id })
    return deleted.length > 0
  }

  async findAndIncrementAccess(shortUrl: string) {
    const [link] = await db
      .update(links)
      .set({ accessCount: sql`${links.accessCount} + 1` })
      .where(eq(links.shortUrl, shortUrl))
      .returning()
    return link ?? null
  }
}
