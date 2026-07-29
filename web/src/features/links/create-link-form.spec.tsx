import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithQuery } from '../../tests/render'
import { CreateLinkForm } from './create-link-form'
import { linksService } from './links-service'

vi.mock('./links-service', () => ({
  linksService: {
    create: vi.fn(),
  },
}))

describe('CreateLinkForm', () => {
  beforeEach(() => {
    vi.mocked(linksService.create).mockReset()
  })

  it('shows a validation error for a malformed short URL', async () => {
    const user = userEvent.setup()
    renderWithQuery(<CreateLinkForm />)

    await user.type(
      screen.getByLabelText(/link original/i),
      'https://example.com',
    )
    await user.type(screen.getByLabelText(/link encurtado/i), '@')
    await user.click(screen.getByRole('button', { name: /salvar link/i }))

    expect(
      await screen.findByText('Use pelo menos 3 caracteres.'),
    ).toBeInTheDocument()
    expect(linksService.create).not.toHaveBeenCalled()
  })

  it('creates a link and clears the form', async () => {
    const user = userEvent.setup()
    vi.mocked(linksService.create).mockResolvedValue({
      id: crypto.randomUUID(),
      originalUrl: 'https://rocketseat.com.br',
      shortUrl: 'rocket',
      accessCount: 0,
      createdAt: new Date().toISOString(),
    })
    renderWithQuery(<CreateLinkForm />)

    const originalUrl = screen.getByLabelText(/link original/i)
    const shortUrl = screen.getByLabelText(/link encurtado/i)
    await user.type(originalUrl, 'https://rocketseat.com.br')
    await user.type(shortUrl, 'rocket')
    await user.click(screen.getByRole('button', { name: /salvar link/i }))

    await waitFor(() => {
      expect(vi.mocked(linksService.create).mock.calls[0]?.[0]).toEqual({
        originalUrl: 'https://rocketseat.com.br',
        shortUrl: 'rocket',
      })
    })
    await waitFor(() => {
      expect(originalUrl).toHaveValue('')
      expect(shortUrl).toHaveValue('')
    })
  })

  it('shows an API error', async () => {
    const user = userEvent.setup()
    vi.mocked(linksService.create).mockRejectedValue(
      new Error('Este encurtamento já está em uso.'),
    )
    renderWithQuery(<CreateLinkForm />)

    await user.type(screen.getByLabelText(/link original/i), 'https://example.com')
    await user.type(screen.getByLabelText(/link encurtado/i), 'example')
    await user.click(screen.getByRole('button', { name: /salvar link/i }))

    expect(
      await screen.findByText('Este encurtamento já está em uso.'),
    ).toBeInTheDocument()
  })
})
