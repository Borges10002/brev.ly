import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithQuery } from '../../tests/render'
import { LinksList } from './links-list'
import { linksService } from './links-service'

vi.mock('./links-service', () => ({
  linksService: {
    list: vi.fn(),
    delete: vi.fn(),
    export: vi.fn(),
  },
}))

const link = {
  id: '9573c8bf-7c80-4361-a6d0-374e512c68de',
  originalUrl: 'https://rocketseat.com.br',
  shortUrl: 'rocket',
  accessCount: 3,
  createdAt: '2026-07-29T12:00:00.000Z',
}

describe('LinksList', () => {
  beforeEach(() => {
    vi.mocked(linksService.list).mockReset()
    vi.mocked(linksService.delete).mockReset()
    vi.mocked(linksService.export).mockReset()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
    vi.stubGlobal('open', vi.fn())
  })

  it('shows the empty state', async () => {
    vi.mocked(linksService.list).mockResolvedValue([])
    renderWithQuery(<LinksList />)

    expect(
      await screen.findByText(/ainda não existem links cadastrados/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /baixar csv/i })).toBeDisabled()
  })

  it('shows a loading state', () => {
    vi.mocked(linksService.list).mockReturnValue(new Promise(() => {}))
    renderWithQuery(<LinksList />)

    expect(screen.getByText(/carregando links/i)).toBeInTheDocument()
  })

  it('shows an error state', async () => {
    vi.mocked(linksService.list).mockRejectedValue(new Error('offline'))
    renderWithQuery(<LinksList />)

    expect(
      await screen.findByText(/não foi possível carregar seus links/i),
    ).toBeInTheDocument()
  })

  it('lists and copies a shortened link', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText')
    vi.mocked(linksService.list).mockResolvedValue([link])
    renderWithQuery(<LinksList />)

    expect(await screen.findByText('3 acessos')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /copiar link/i }))

    expect(writeText).toHaveBeenCalledWith(
      'http://localhost:5173/rocket',
    )
  })

  it('deletes a link', async () => {
    const user = userEvent.setup()
    vi.mocked(linksService.list).mockResolvedValue([link])
    vi.mocked(linksService.delete).mockResolvedValue(undefined)
    renderWithQuery(<LinksList />)

    await screen.findByText('3 acessos')
    await user.click(screen.getByRole('button', { name: /excluir link/i }))

    await waitFor(() => {
      expect(vi.mocked(linksService.delete).mock.calls[0]?.[0]).toBe(link.id)
    })
  })

  it('exports the CSV and opens its URL', async () => {
    const user = userEvent.setup()
    vi.mocked(linksService.list).mockResolvedValue([link])
    vi.mocked(linksService.export).mockResolvedValue({
      url: 'https://cdn.example.com/report.csv',
    })
    renderWithQuery(<LinksList />)

    await screen.findByText('3 acessos')
    await user.click(screen.getByRole('button', { name: /baixar csv/i }))

    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith(
        'https://cdn.example.com/report.csv',
        '_blank',
        'noopener,noreferrer',
      )
    })
  })
})
