import { Link } from 'react-router-dom'
import { Logo } from '../components/logo'

export function NotFoundPage() {
  return (
    <main className="centered-page">
      <Logo />
      <h1>Página não encontrada</h1>
      <p>Talvez o endereço esteja incorreto ou a página não exista mais.</p>
      <Link to="/">Voltar para a página inicial</Link>
    </main>
  )
}

