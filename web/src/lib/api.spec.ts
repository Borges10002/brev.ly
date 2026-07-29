import { afterEach, describe, expect, it, vi } from 'vitest'
import { api } from './api'

describe('api', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns a successful JSON response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(api<{ status: string }>('/health')).resolves.toEqual({
      status: 'ok',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3333/health',
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    )
  })

  it('returns undefined for a 204 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, {
      status: 204,
    })))

    await expect(api<void>('/links/id', { method: 'DELETE' })).resolves.toBeUndefined()
  })

  it('throws the API error message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Link não encontrado.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }),
    ))

    await expect(api('/links/unknown')).rejects.toEqual(
      expect.objectContaining({
        message: 'Link não encontrado.',
        status: 404,
      }),
    )
  })

  it('uses a fallback message for invalid error bodies', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response('not-json', { status: 500 }),
    ))

    await expect(api('/links')).rejects.toThrow(
      'Não foi possível concluir a operação.',
    )
  })
})
