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
      <main className="centered-page">
        <Logo />
        <h1>Link não encontrado</h1>
        <p>O link que você procura não existe, foi removido ou está incorreto.</p>
        <Link to="/">Voltar para a página inicial</Link>
      </main>
    )
  }

  return (
    <main className="centered-page">
      <Logo />
      <Spinner />
      <h1>Redirecionando...</h1>
      <p>O link será aberto automaticamente em alguns instantes.</p>
    </main>
  )
}

