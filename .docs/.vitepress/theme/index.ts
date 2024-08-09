import type { EnhanceAppContext } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'

import '@shikijs/twoslash/style-rich.css'
import '@shikijs/vitepress-twoslash/style.css'
import 'floating-vue/dist/style.css'

import '@unocss/reset/tailwind.css'
import 'uno.css'

import Layout from './layouts/index.vue'
import Preview from '~/theme/global/preview/Preview.vue'
import Features from '~/theme/global/features/Features.vue'
import CodeGroupPackage from '~/theme/global/CodeGroupPackage.vue'
import CodePreview from '~/theme/global/code/CodePreview.vue'
import Props from '~/theme/global/api/Props.vue'
import Slots from '~/theme/global/api/Slots.vue'
import Event from '~/theme/global/api/Event.vue'
import Attribute from '~/theme/global/api/Attribute.vue'
import Variable from '~/theme/global/api/Variable.vue'

import './styles/main.css'
import './styles/theme.css'
import './styles/variable.css'
import './styles/docs.css'
import './styles/twoslash.css'

export default {
  Layout,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('Preview', Preview)
    app.component('Features', Features)
    app.component('CodeGroupPackage', CodeGroupPackage)
    app.component('CodePreview', CodePreview)
    app.component('Props', Props)
    app.component('Slots', Slots)
    app.component('Event', Event)
    app.component('Attribute', Attribute)
    app.component('Variable', Variable)
    app.use(TwoslashFloatingVue)
  },
}
