import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Copy, Download, Link2, Trash2 } from 'lucide-react'
import { env } from '../../lib/env'
import { Spinner } from '../../components/spinner'
import { linksService } from './links-service'

export function LinksList() {
  const queryClient = useQueryClient()
  const links = useQuery({ queryKey: ['links'], queryFn: linksService.list })
  const remove = useMutation({
    mutationFn: linksService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['links'] }),
  })
  const exportCsv = useMutation({
    mutationFn: linksService.export,
    onSuccess: ({ url }) => window.open(url, '_blank', 'noopener,noreferrer'),
  })

  return (
    <section className="rounded-lg bg-white p-6 pb-5 md:p-8 md:pb-5">
      <header className="flex items-center justify-between border-b border-gray-200 pb-5">
        <h1 className="text-lg font-bold text-gray-800">Meus links</h1>
        <button
          className="flex min-h-8 items-center gap-2 rounded-sm border-0 bg-gray-200 px-3 text-xs font-semibold text-gray-600 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-55"
          disabled={!links.data?.length || exportCsv.isPending}
          onClick={() => exportCsv.mutate()}
        >
          {exportCsv.isPending ? <Spinner /> : <Download size={16} />}
          Baixar CSV
        </button>
      </header>

      {links.isPending ? (
        <div className="grid justify-items-center gap-3 py-12 text-center text-gray-500">
          <Spinner />
          <p className="m-0 text-xs font-semibold uppercase">Carregando links...</p>
        </div>
      ) : links.isError ? (
        <div className="grid justify-items-center gap-3 py-12 text-center text-gray-500">
          <p className="m-0 text-xs font-semibold uppercase">Não foi possível carregar seus links.</p>
        </div>
      ) : !links.data?.length ? (
        <div className="grid justify-items-center gap-3 py-12 text-center text-gray-500">
          <Link2 size={32} />
          <p className="m-0 text-xs font-semibold uppercase">Ainda não existem links cadastrados</p>
        </div>
      ) : (
        <ul className="m-0 list-none p-0">
          {links.data.map((link) => {
            const shortLink = `${env.frontendUrl}/${link.shortUrl}`
            return (
              <li
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-gray-200 py-4 md:grid-cols-[minmax(0,1fr)_auto_auto]"
                key={link.id}
              >
                <div className="grid min-w-0 gap-1">
                  <a
                    className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-blue-base no-underline hover:underline"
                    href={shortLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shortLink}
                  </a>
                  <span
                    className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-500"
                    title={link.originalUrl}
                  >
                    {link.originalUrl}
                  </span>
                </div>
                <span className="col-start-1 text-xs text-gray-500 md:col-auto">
                  {link.accessCount} acessos
                </span>
                <div className="col-start-2 row-span-2 row-start-1 flex gap-1 md:col-auto md:row-auto">
                  <button
                    className="grid size-8 place-items-center rounded-sm border-0 bg-gray-200 text-gray-600 transition hover:bg-gray-300"
                    aria-label="Copiar link"
                    title="Copiar link"
                    onClick={() => navigator.clipboard.writeText(shortLink)}
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    className="grid size-8 place-items-center rounded-sm border-0 bg-gray-200 text-gray-600 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-55"
                    aria-label="Excluir link"
                    title="Excluir link"
                    disabled={remove.isPending}
                    onClick={() => remove.mutate(link.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
