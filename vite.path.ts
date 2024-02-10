import path from 'node:path'

export const alias = {
  '@destyler/components/': `${path.resolve(__dirname, 'packages/components')}/`,
  '@destyler/composition': `${path.resolve(__dirname, 'packages/composition')}/src/index.ts`,
  '@destyler/composition/': `${path.resolve(__dirname, 'packages/composition')}/`,
  'destyler': `${path.resolve(__dirname, 'packages/destyler')}/src/index.ts`,
  '@destyler/directives': `${path.resolve(__dirname, 'packages/directives')}/src/index.ts`,
  '@destyler/directives/': `${path.resolve(__dirname, 'packages/directives')}/`,
  '@destyler/shared': `${path.resolve(__dirname, 'packages/shared')}/src/index.ts`,
  '@destyler/shared/': `${path.resolve(__dirname, 'packages/shared')}/`,
  '@destyler/alert': `${path.resolve(__dirname, 'packages/components/alert')}/src/index.ts`,
  '@destyler/demo/alert/': `${path.resolve(__dirname, 'packages/components/alert')}/`,
  '@destyler/arrow': `${path.resolve(__dirname, 'packages/components/arrow')}/src/index.ts`,
  '@destyler/demo/arrow/': `${path.resolve(__dirname, 'packages/components/arrow')}/`,
  '@destyler/image': `${path.resolve(__dirname, 'packages/components/image')}/src/index.ts`,
  '@destyler/demo/image/': `${path.resolve(__dirname, 'packages/components/image')}/`,
  '@destyler/collapse': `${path.resolve(__dirname, 'packages/components/collapse')}/src/index.ts`,
  '@destyler/demo/collapse/': `${path.resolve(__dirname, 'packages/components/collapse')}/`,
  '@destyler/collapsible': `${path.resolve(__dirname, 'packages/components/collapsible')}/src/index.ts`,
  '@destyler/demo/collapsible/': `${path.resolve(__dirname, 'packages/components/collapsible')}/`,
  '@destyler/countdown': `${path.resolve(__dirname, 'packages/components/countdown')}/src/index.ts`,
  '@destyler/demo/countdown/': `${path.resolve(__dirname, 'packages/components/countdown')}/`,
  '@destyler/dismissableLayer': `${path.resolve(__dirname, 'packages/components/dismissableLayer')}/src/index.ts`,
  '@destyler/demo/dismissableLayer/': `${path.resolve(__dirname, 'packages/components/dismissableLayer')}/`,
  '@destyler/focusScope': `${path.resolve(__dirname, 'packages/components/focusScope')}/src/index.ts`,
  '@destyler/demo/focusScope/': `${path.resolve(__dirname, 'packages/components/focusScope')}/`,
  '@destyler/icon': `${path.resolve(__dirname, 'packages/components/icon')}/src/index.ts`,
  '@destyler/demo/icon/': `${path.resolve(__dirname, 'packages/components/icon')}/`,
  '@destyler/label': `${path.resolve(__dirname, 'packages/components/label')}/src/index.ts`,
  '@destyler/demo/label/': `${path.resolve(__dirname, 'packages/components/label')}/`,
  '@destyler/online': `${path.resolve(__dirname, 'packages/components/online')}/src/index.ts`,
  '@destyler/demo/online/': `${path.resolve(__dirname, 'packages/components/online')}/`,
  '@destyler/popover': `${path.resolve(__dirname, 'packages/components/popover')}/src/index.ts`,
  '@destyler/demo/popover/': `${path.resolve(__dirname, 'packages/components/popover')}/`,
  '@destyler/popper': `${path.resolve(__dirname, 'packages/components/popper')}/src/index.ts`,
  '@destyler/demo/popper/': `${path.resolve(__dirname, 'packages/components/popper')}/`,
  '@destyler/presence': `${path.resolve(__dirname, 'packages/components/presence')}/src/index.ts`,
  '@destyler/demo/presence/': `${path.resolve(__dirname, 'packages/components/presence')}/`,
  '@destyler/primitive': `${path.resolve(__dirname, 'packages/components/primitive')}/src/index.ts`,
  '@destyler/demo/primitive/': `${path.resolve(__dirname, 'packages/components/primitive')}/`,
  '@destyler/tag': `${path.resolve(__dirname, 'packages/components/tag')}/src/index.ts`,
  '@destyler/demo/tag/': `${path.resolve(__dirname, 'packages/components/tag')}/`,
  '@destyler/teleport': `${path.resolve(__dirname, 'packages/components/teleport')}/src/index.ts`,
  '@destyler/demo/teleport/': `${path.resolve(__dirname, 'packages/components/teleport')}/`,
  '@destyler/tooltip': `${path.resolve(__dirname, 'packages/components/tooltip')}/src/index.ts`,
  '@destyler/demo/tooltip/': `${path.resolve(__dirname, 'packages/components/tooltip')}/`,
  '@destyler/visuallyHidden': `${path.resolve(__dirname, 'packages/components/visuallyHidden')}/src/index.ts`,
  '@destyler/demo/visuallyHidden/': `${path.resolve(__dirname, 'packages/components/visuallyHidden')}/`,
  '@destyler/checkbox': `${path.resolve(__dirname, 'packages/components/checkbox')}/src/index.ts`,
  '@destyler/demo/checkbox/': `${path.resolve(__dirname, 'packages/components/checkbox')}/`,
  '@destyler/progress': `${path.resolve(__dirname, 'packages/components/progress')}/src/index.ts`,
  '@destyler/demo/progress/': `${path.resolve(__dirname, 'packages/components/progress')}/`,
  '@destyler/slider': `${path.resolve(__dirname, 'packages/components/slider')}/src/index.ts`,
  '@destyler/demo/slider/': `${path.resolve(__dirname, 'packages/components/slider')}/`,
  '@destyler/dialog': `${path.resolve(__dirname, 'packages/components/dialog')}/src/index.ts`,
  '@destyler/demo/dialog/': `${path.resolve(__dirname, 'packages/components/dialog')}/`,
  '@destyler/modal': `${path.resolve(__dirname, 'packages/components/modal')}/src/index.ts`,
  '@destyler/demo/modal/': `${path.resolve(__dirname, 'packages/components/modal')}/`,
  '@destyler/info': `${path.resolve(__dirname, 'packages/components/info')}/src/index.ts`,
  '@destyler/demo/info/': `${path.resolve(__dirname, 'packages/components/info')}/`,
  '@destyler/button': `${path.resolve(__dirname, 'packages/components/button')}/src/index.ts`,
  '@destyler/demo/button/': `${path.resolve(__dirname, 'packages/components/button')}/`,
  '@destyler/backTop': `${path.resolve(__dirname, 'packages/components/backTop')}/src/index.ts`,
  '@destyler/demo/backTop/': `${path.resolve(__dirname, 'packages/components/backTop')}/`,
  '@destyler/aspectRadio': `${path.resolve(__dirname, 'packages/components/aspectRadio')}/src/index.ts`,
  '@destyler/demo/aspectRadio/': `${path.resolve(__dirname, 'packages/components/aspectRadio')}/`,
  '@destyler/preview': `${path.resolve(__dirname, 'packages/components/preview')}/src/index.ts`,
  '@destyler/demo/preview/': `${path.resolve(__dirname, 'packages/components/preview')}/`,
  '@destyler/select': `${path.resolve(__dirname, 'packages/components/select')}/src/index.ts`,
  '@destyler/demo/select/': `${path.resolve(__dirname, 'packages/components/select')}/`,
  '@destyler/docs/': `${path.resolve(__dirname, 'docs/components/content')}/`,
  '@destyler/divider': `${path.resolve(__dirname, 'packages/components/divider')}/src/index.ts`,
  '@destyler/demo/divider/': `${path.resolve(__dirname, 'packages/components/divider')}/`,
  '@destyler/rovingFocus': `${path.resolve(__dirname, 'packages/components/rovingFocus')}/src/index.ts`,
  '@destyler/demo/rovingFocus/': `${path.resolve(__dirname, 'packages/components/rovingFocus')}/`,
  '@destyler/radio': `${path.resolve(__dirname, 'packages/components/radio')}/src/index.ts`,
  '@destyler/demo/radio/': `${path.resolve(__dirname, 'packages/components/radio')}/`,
  '@destyler/menu': `${path.resolve(__dirname, 'packages/components/menu')}/src/index.ts`,
  '@destyler/demo/menu/': `${path.resolve(__dirname, 'packages/components/menu')}/`,
  '@destyler/switch': `${path.resolve(__dirname, 'packages/components/switch')}/src/index.ts`,
  '@destyler/demo/switch/': `${path.resolve(__dirname, 'packages/components/switch')}/`,
  '@destyler/link': `${path.resolve(__dirname, 'packages/components/link')}/src/index.ts`,
  '@destyler/demo/link/': `${path.resolve(__dirname, 'packages/components/link')}/`,
  '@destyler/toggle': `${path.resolve(__dirname, 'packages/components/toggle')}/src/index.ts`,
  '@destyler/demo/toggle/': `${path.resolve(__dirname, 'packages/components/toggle')}/`,
  '@destyler/menubar': `${path.resolve(__dirname, 'packages/components/menubar')}/src/index.ts`,
  '@destyler/demo/menubar/': `${path.resolve(__dirname, 'packages/components/menubar')}/`,
}
