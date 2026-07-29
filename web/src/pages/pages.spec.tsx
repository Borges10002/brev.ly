import { screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { linksService } from '../features/links/links-service'
import { renderWithQuery } from '../tests/render'
import { NotFoundPage } from './not-found'
import { RedirectPage } from './redirect'

vi.mock('../features/links/links-service', () => ({
  linksService: {
    resolve: vi.fn(),
  },
}))

describe('Pages', () => {
  beforeEach(() => {
    vi.mocked(linksService.resolve).mockReset()
  })

  it('renders the not-found page', () => {
    renderWithQuery(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /página não encontrada/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /voltar/i })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('shows the redirect loading state', () => {
    vi.mocked(linksService.resolve).mockReturnValue(new Promise(() => {}))
    renderWithQuery(
      <MemoryRouter initialEntries={['/rocket']}>
        <Routes>
          <Route path="/:shortUrl" element={<RedirectPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /redirecionando/i }),
    ).toBeInTheDocument()
    expect(linksService.resolve).toHaveBeenCalledWith('rocket')
  })

  it('shows an unknown shortened-link error', async () => {
    vi.mocked(linksService.resolve).mockRejectedValue(new Error('not found'))
    renderWithQuery(
      <MemoryRouter initialEntries={['/unknown']}>
        <Routes>
          <Route path="/:shortUrl" element={<RedirectPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { name: /link não encontrado/i }),
    ).toBeInTheDocument()
  })
})

