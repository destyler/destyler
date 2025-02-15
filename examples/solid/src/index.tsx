import { Router } from '@solidjs/router'
import { render } from 'solid-js/web'
import routes from '~solid-pages'
import '@unocss/reset/tailwind.css'
import 'uno.css'

import '../../../shared/src/bootstrap.css'

const root = document.getElementById('root')

render(() => {
  return (
    <Router>
      {routes}
    </Router>
  )
}, root!)
