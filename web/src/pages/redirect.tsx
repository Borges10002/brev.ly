import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Logo } from '../components/logo'
import { Spinner } from '../components/spinner'
import { linksService } from '../features/links/links-service'

export function RedirectPage() {
  const { shortUrl = '' } = useParams()
  const query = useQuery({
    queryKey: ['link', shortUrl],
    queryFn: () => linksService.resolve(shortUrl),
    retry: false,
  })

  useEffect(() => {
    if (query.data) window.location.replace(query.data.originalUrl)
  }, [query.data])

  if (query.isError) {
    return (
      <main className="mx-auto flex min-h-screen w-[calc(100%_-_2.5rem)] max-w-[36.25rem] flex-col items-center justify-center text-center">
        <Logo />
        <h1 className="mt-7 mb-2 text-2xl font-bold">Link não encontrado</h1>
        <p className="mb-5 text-gray-500">O link que você procura não existe, foi removido ou está incorreto.</p>
        <Link className="font-semibold text-blue-base underline-offset-4 hover:underline" to="/">Voltar para a página inicial</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%_-_2.5rem)] max-w-[36.25rem] flex-col items-center justify-center text-center">
      <Logo />
      <div className="mt-7"><Spinner /></div>
      <h1 className="mt-4 mb-2 text-2xl font-bold">Redirecionando...</h1>
      <p className="text-gray-500">O link será aberto automaticamente em alguns instantes.</p>
    </main>
  )
}
