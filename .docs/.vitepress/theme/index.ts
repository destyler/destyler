import type { EnhanceAppContext } from 'vitepress'
import '@unocss/reset/tailwind.css'
import 'uno.css'

import Layout from './layouts/index.vue'
import Preview from '~/theme/global/preview/Preview.vue'
import Features from '~/theme/global/features/Features.vue'
import CodeGroupPackage from '~/theme/global/CodeGroupPackage.vue'
import CodePreview from '~/theme/global/code/CodePreview.vue'
import Props from '~/theme/global/api/Props.vue'
import Slots from '~/theme/global/api/Slots.vue'

import './styles/main.css'
import './styles/theme.css'
import './styles/variable.css'
import './styles/docs.css'

export default {
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('Preview', Preview)
    app.component('Features', Features)
    app.component('CodeGroupPackage', CodeGroupPackage)
    app.component('CodePreview', CodePreview)
    app.component('Props', Props)
    app.component('Slots', Slots)
  },
}
