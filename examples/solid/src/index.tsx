/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App.tsx'
import '@unocss/reset/tailwind.css'
import 'uno.css'

import '../../../shared/src/bootstrap.css'

const root = document.getElementById('root')

render(() => <App />, root!)
