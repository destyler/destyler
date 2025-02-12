import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  useRoutes,
} from 'react-router-dom'

import routes from '~react-pages'

import DefaultLayout from './layout/default'

import '@unocss/reset/tailwind.css'
import 'uno.css'

function App() {
  return (
    <Suspense>
      {useRoutes(routes)}
    </Suspense>
  )
}

const app = createRoot(document.getElementById('root')!)

app.render(
  <StrictMode>
    <BrowserRouter>
      <DefaultLayout>
        <App />
      </DefaultLayout>
    </BrowserRouter>
  </StrictMode>,
)
