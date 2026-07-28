import { env } from './env'

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.backendUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null
    throw new ApiError(body?.message ?? 'Não foi possível concluir a operação.', response.status)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

