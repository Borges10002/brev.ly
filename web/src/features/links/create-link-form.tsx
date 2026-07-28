import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { env } from '../../lib/env'
import { Spinner } from '../../components/spinner'
import { linksService } from './links-service'

const schema = z.object({
  originalUrl: z.url('Informe uma URL válida.'),
  shortUrl: z
    .string()
    .min(3, 'Use pelo menos 3 caracteres.')
    .max(40)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Use letras, números, hífen ou underline.'),
})

type FormData = z.infer<typeof schema>

export function CreateLinkForm() {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: linksService.create,
    onSuccess: async () => {
      reset()
      await queryClient.invalidateQueries({ queryKey: ['links'] })
    },
    onError: (error) => setError('root', { message: error.message }),
  })

  return (
    <section className="card form-card">
      <h1>Novo link</h1>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <label>
          Link original
          <input
            type="url"
            placeholder="www.exemplo.com.br"
            aria-invalid={Boolean(errors.originalUrl)}
            {...register('originalUrl')}
          />
          {errors.originalUrl && <small>{errors.originalUrl.message}</small>}
        </label>

        <label>
          Link encurtado
          <div className="input-prefix">
            <span>{env.frontendUrl.replace(/^https?:\/\//, '')}/</span>
            <input
              placeholder="brev-ly"
              aria-invalid={Boolean(errors.shortUrl)}
              {...register('shortUrl')}
            />
          </div>
          {errors.shortUrl && <small>{errors.shortUrl.message}</small>}
        </label>

        {errors.root && <p className="form-error">{errors.root.message}</p>}
        <button className="primary-button" disabled={mutation.isPending}>
          {mutation.isPending ? <Spinner /> : 'Salvar link'}
        </button>
      </form>
    </section>
  )
}

