import { api } from '../../lib/api'
import type { Link } from './types'

export const linksService = {
  async list() {
    return (await api<{ links: Link[] }>('/links')).links
  },
  async create(input: { originalUrl: string; shortUrl: string }) {
    return (await api<{ link: Link }>('/links', {
      method: 'POST',
      body: JSON.stringify(input),
    })).link
  },
  delete(id: string) {
    return api<void>(`/links/${id}`, { method: 'DELETE' })
  },
  async resolve(shortUrl: string) {
    return (await api<{ link: Link }>(`/links/${encodeURIComponent(shortUrl)}`)).link
  },
  async export() {
    return api<{ url: string }>('/links/export', { method: 'POST' })
  },
}

