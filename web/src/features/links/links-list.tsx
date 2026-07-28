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
    <section className="card links-card">
      <header>
        <h1>Meus links</h1>
        <button
          className="secondary-button"
          disabled={!links.data?.length || exportCsv.isPending}
          onClick={() => exportCsv.mutate()}
        >
          {exportCsv.isPending ? <Spinner /> : <Download size={16} />}
          Baixar CSV
        </button>
      </header>

      {links.isPending ? (
        <div className="state"><Spinner /><p>Carregando links...</p></div>
      ) : links.isError ? (
        <div className="state"><p>Não foi possível carregar seus links.</p></div>
      ) : !links.data?.length ? (
        <div className="state empty-state">
          <Link2 size={32} />
          <p>Ainda não existem links cadastrados</p>
        </div>
      ) : (
        <ul className="links-list">
          {links.data.map((link) => {
            const shortLink = `${env.frontendUrl}/${link.shortUrl}`
            return (
              <li key={link.id}>
                <div className="link-info">
                  <a href={shortLink} target="_blank" rel="noreferrer">{shortLink}</a>
                  <span title={link.originalUrl}>{link.originalUrl}</span>
                </div>
                <span className="access-count">{link.accessCount} acessos</span>
                <div className="actions">
                  <button
                    aria-label="Copiar link"
                    title="Copiar link"
                    onClick={() => navigator.clipboard.writeText(shortLink)}
                  >
                    <Copy size={16} />
                  </button>
                  <button
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

