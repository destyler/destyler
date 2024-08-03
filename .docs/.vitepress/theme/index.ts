import '@unocss/reset/tailwind.css'
import 'uno.css'

import Layout from './layouts/index.vue'
import Preview from '~/theme/components/preview/Preview.vue'

import './styles/main.css'
import './styles/theme.css'
import './styles/variable.css'
import './styles/docs.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('Preview', Preview)
  },
}
