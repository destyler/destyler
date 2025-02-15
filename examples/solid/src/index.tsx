import { Router } from '@solidjs/router'
import { render } from 'solid-js/web'
import routes from '~solid-pages'

import DefaultLayout from './layouts/default'
import '@unocss/reset/tailwind.css'

import 'uno.css'
import '../../../shared/src/bootstrap.css'

const root = document.getElementById('root')

function App() {
  return (
    <DefaultLayout>
      <>
        <Router>
          {routes}
        </Router>
      </>
    </DefaultLayout>
  )
}

render(() => <App />, root!)
