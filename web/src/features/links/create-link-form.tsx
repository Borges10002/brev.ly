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
    <section className="rounded-lg bg-white p-6 md:p-8">
      <h1 className="text-lg font-bold text-gray-800">Novo link</h1>
      <form
        className="mt-6 grid gap-5"
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
      >
        <label className="grid gap-2 text-[0.6875rem] font-semibold uppercase text-gray-500">
          Link original
          <input
            type="url"
            placeholder="www.exemplo.com.br"
            aria-invalid={Boolean(errors.originalUrl)}
            className="w-full min-w-0 rounded-md border border-gray-300 px-4 py-3.5 text-sm font-normal text-gray-800 normal-case outline-none transition focus:border-blue-base focus:ring-1 focus:ring-blue-base aria-invalid:border-danger"
            {...register('originalUrl')}
          />
          {errors.originalUrl && (
            <small className="text-xs font-normal normal-case text-danger">
              {errors.originalUrl.message}
            </small>
          )}
        </label>

        <label className="grid gap-2 text-[0.6875rem] font-semibold uppercase text-gray-500">
          Link encurtado
          <div className="flex items-center overflow-hidden rounded-md border border-gray-300 transition focus-within:border-blue-base focus-within:ring-1 focus-within:ring-blue-base">
            <span className="whitespace-nowrap pl-4 text-sm font-normal normal-case text-gray-500">
              {env.frontendUrl.replace(/^https?:\/\//, '')}/
            </span>
            <input
              placeholder="brev-ly"
              aria-invalid={Boolean(errors.shortUrl)}
              className="w-full min-w-0 border-0 px-0 py-3.5 pr-4 pl-0.5 text-sm font-normal text-gray-800 normal-case outline-none"
              {...register('shortUrl')}
            />
          </div>
          {errors.shortUrl && (
            <small className="text-xs font-normal normal-case text-danger">
              {errors.shortUrl.message}
            </small>
          )}
        </label>

        {errors.root && (
          <p className="m-0 text-xs text-danger">{errors.root.message}</p>
        )}
        <button
          className="min-h-12 rounded-md border-0 bg-blue-base font-semibold text-white transition hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-55"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Spinner /> : 'Salvar link'}
        </button>
      </form>
    </section>
  )
}
