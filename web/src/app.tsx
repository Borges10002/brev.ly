import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from './pages/home'
import { NotFoundPage } from './pages/not-found'
import { RedirectPage } from './pages/redirect'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
})

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/:shortUrl', element: <RedirectPage /> },
  { path: '*', element: <NotFoundPage /> },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

