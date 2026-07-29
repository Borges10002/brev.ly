import { Link } from 'react-router-dom'
import { Logo } from '../components/logo'

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%_-_2.5rem)] max-w-[36.25rem] flex-col items-center justify-center text-center">
      <Logo />
      <h1 className="mt-7 mb-2 text-2xl font-bold">Página não encontrada</h1>
      <p className="mb-5 text-gray-500">Talvez o endereço esteja incorreto ou a página não exista mais.</p>
      <Link className="font-semibold text-blue-base underline-offset-4 hover:underline" to="/">Voltar para a página inicial</Link>
    </main>
  )
}
