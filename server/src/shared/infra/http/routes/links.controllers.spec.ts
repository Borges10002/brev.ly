import 'reflect-metadata'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { container } from 'tsyringe'
import type { FastifyInstance } from 'fastify'
import type { ILinksRepository } from '@modules/links/repositories/ILinksRepository.js'
import type { IReportStorage } from '@modules/links/providers/IReportStorage.js'
import { InMemoryLinksRepository } from '@modules/links/tests/fakes/InMemoryLinksRepository.js'
import { InMemoryReportStorage } from '@modules/links/tests/fakes/InMemoryReportStorage.js'
import { buildApp } from '../app.js'

describe('Links controllers', () => {
  let app: FastifyInstance
  let repository: InMemoryLinksRepository
  let storage: InMemoryReportStorage

  beforeEach(async () => {
    repository = new InMemoryLinksRepository()
    storage = new InMemoryReportStorage()
    container.registerInstance<ILinksRepository>('LinksRepository', repository)
    container.registerInstance<IReportStorage>('ReportStorage', storage)
    app = buildApp()
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
    container.clearInstances()
  })

  it('GET /docs/json exposes the complete OpenAPI document', async () => {
    const response = await app.inject({ method: 'GET', url: '/docs/json' })
    const document = response.json()

    expect(response.statusCode).toBe(200)
    expect(document.info.title).toBe('Brev.ly API')
    expect(Object.keys(document.paths)).toEqual(expect.arrayContaining([
      '/health',
      '/links',
      '/links/{id}',
      '/links/{shortUrl}',
      '/links/export',
    ]))
  })

  it('POST /links creates a link', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/links',
      payload: {
        originalUrl: 'https://rocketseat.com.br',
        shortUrl: 'rocket',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json().link.shortUrl).toBe('rocket')
  })

  it('POST /links validates the request body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/links',
      payload: { originalUrl: 'invalid', shortUrl: '@' },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json().message).toBe('Dados inválidos.')
  })

  it('GET /links lists links', async () => {
    await repository.create({
      originalUrl: 'https://example.com',
      shortUrl: 'example',
    })

    const response = await app.inject({ method: 'GET', url: '/links' })
    expect(response.statusCode).toBe(200)
    expect(response.json().links).toHaveLength(1)
  })

  it('GET /links/:shortUrl resolves and counts an access', async () => {
    await repository.create({
      originalUrl: 'https://example.com',
      shortUrl: 'example',
    })

    const response = await app.inject({
      method: 'GET',
      url: '/links/example',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().link.accessCount).toBe(1)
  })

  it('GET /links/:shortUrl returns 404 for an unknown link', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/links/unknown',
    })
    expect(response.statusCode).toBe(404)
  })

  it('DELETE /links/:id deletes a link', async () => {
    const link = await repository.create({
      originalUrl: 'https://example.com',
      shortUrl: 'example',
    })

    const response = await app.inject({
      method: 'DELETE',
      url: `/links/${link.id}`,
    })

    expect(response.statusCode).toBe(204)
    expect(repository.items).toHaveLength(0)
  })

  it('POST /links/export returns the report URL', async () => {
    await repository.create({
      originalUrl: 'https://example.com',
      shortUrl: 'example',
    })

    const response = await app.inject({
      method: 'POST',
      url: '/links/export',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().url).toMatch(/^https:\/\/cdn\.brev\.ly\//)
    expect(storage.uploads).toHaveLength(1)
  })
})
