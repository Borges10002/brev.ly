import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryLinksRepository } from '@modules/links/tests/fakes/InMemoryLinksRepository.js'
import { InMemoryReportStorage } from '@modules/links/tests/fakes/InMemoryReportStorage.js'
import { CreateLinkUseCase } from './createLink/CreateLinkUseCase.js'
import { DeleteLinkUseCase } from './deleteLink/DeleteLinkUseCase.js'
import { ExportLinksUseCase } from './exportLinks/ExportLinksUseCase.js'
import { GetOriginalUrlUseCase } from './getOriginalUrl/GetOriginalUrlUseCase.js'
import { ListLinksUseCase } from './listLinks/ListLinksUseCase.js'

describe('Links use cases', () => {
  let repository: InMemoryLinksRepository
  let storage: InMemoryReportStorage

  beforeEach(() => {
    repository = new InMemoryLinksRepository()
    storage = new InMemoryReportStorage()
  })

  it('creates a valid link', async () => {
    const link = await new CreateLinkUseCase(repository).execute({
      originalUrl: 'https://rocketseat.com.br',
      shortUrl: 'rocketseat',
    })

    expect(repository.items).toHaveLength(1)
    expect(link).toEqual(expect.objectContaining({
      originalUrl: 'https://rocketseat.com.br',
      shortUrl: 'rocketseat',
      accessCount: 0,
    }))
  })

  it('rejects malformed data', async () => {
    await expect(new CreateLinkUseCase(repository).execute({
      originalUrl: 'url-invalida',
      shortUrl: 'inválido!',
    })).rejects.toEqual(expect.objectContaining({
      statusCode: 400,
    }))
  })

  it('rejects a duplicated short URL', async () => {
    const useCase = new CreateLinkUseCase(repository)
    const input = {
      originalUrl: 'https://rocketseat.com.br',
      shortUrl: 'rocket',
    }

    await useCase.execute(input)

    await expect(useCase.execute(input)).rejects.toEqual(
      expect.objectContaining({ statusCode: 409 }),
    )
  })

  it('lists links from newest to oldest', async () => {
    repository.items.push(
      {
        id: crypto.randomUUID(),
        originalUrl: 'https://old.test',
        shortUrl: 'old',
        accessCount: 0,
        createdAt: new Date('2026-01-01'),
      },
      {
        id: crypto.randomUUID(),
        originalUrl: 'https://new.test',
        shortUrl: 'new',
        accessCount: 0,
        createdAt: new Date('2026-02-01'),
      },
    )

    const links = await new ListLinksUseCase(repository).execute()
    expect(links.map((link) => link.shortUrl)).toEqual(['new', 'old'])
  })

  it('deletes an existing link', async () => {
    const link = await repository.create({
      originalUrl: 'https://example.com',
      shortUrl: 'example',
    })

    await new DeleteLinkUseCase(repository).execute(link.id)
    expect(repository.items).toHaveLength(0)
  })

  it('returns 404 when deleting an unknown link', async () => {
    await expect(
      new DeleteLinkUseCase(repository).execute(crypto.randomUUID()),
    ).rejects.toEqual(expect.objectContaining({ statusCode: 404 }))
  })

  it('resolves a link and increments its access count', async () => {
    await repository.create({
      originalUrl: 'https://example.com',
      shortUrl: 'example',
    })

    const link = await new GetOriginalUrlUseCase(repository).execute('example')
    expect(link.originalUrl).toBe('https://example.com')
    expect(link.accessCount).toBe(1)
  })

  it('returns 404 for an unknown short URL', async () => {
    await expect(
      new GetOriginalUrlUseCase(repository).execute('unknown'),
    ).rejects.toEqual(expect.objectContaining({ statusCode: 404 }))
  })

  it('exports all required CSV columns through storage', async () => {
    await repository.create({
      originalUrl: 'https://example.com',
      shortUrl: 'example',
    })

    const result = await new ExportLinksUseCase(repository, storage).execute()
    const upload = storage.uploads[0]
    const csv = new TextDecoder().decode(upload?.body)

    expect(result.url).toMatch(/^https:\/\/cdn\.brev\.ly\/exports\/.+\.csv$/)
    expect(upload?.contentType).toBe('text/csv; charset=utf-8')
    expect(csv).toContain('"URL original","URL encurtada","Contagem de acessos","Data de criação"')
    expect(csv).toContain('"https://example.com","example","0"')
  })
})
