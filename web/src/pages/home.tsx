import { Logo } from '../components/logo'
import { CreateLinkForm } from '../features/links/create-link-form'
import { LinksList } from '../features/links/links-list'

export function HomePage() {
  return (
    <main className="mx-auto w-[calc(100%_-_1.5rem)] max-w-[32.5rem] py-8 md:w-[calc(100%_-_2.5rem)] md:max-w-[61.25rem] md:py-[5.5rem]">
      <Logo />
      <div className="mt-6 grid items-start gap-5 md:mt-8 md:grid-cols-[23.75rem_1fr]">
        <CreateLinkForm />
        <LinksList />
      </div>
    </main>
  )
}
