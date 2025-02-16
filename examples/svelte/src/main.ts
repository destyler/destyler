import { mount } from 'svelte'
import App from './App.svelte'
import '@unocss/reset/tailwind.css'
import 'uno.css'

import '../../../shared/src/bootstrap.css'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
