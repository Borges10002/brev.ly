import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  id: uuid().primaryKey().defaultRandom(),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  accessCount: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

