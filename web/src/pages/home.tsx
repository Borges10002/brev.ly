import { Logo } from '../components/logo'
import { CreateLinkForm } from '../features/links/create-link-form'
import { LinksList } from '../features/links/links-list'

export function HomePage() {
  return (
    <main className="home">
      <Logo />
      <div className="dashboard">
        <CreateLinkForm />
        <LinksList />
      </div>
    </main>
  )
}

