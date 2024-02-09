import type { ComponentResolver } from 'unplugin-vue-components'

import { primitiveComponentName } from '@destyler/primitive/dist/resolver'
import { labelComponentName } from '@destyler/label/dist/resolver'
import { imageComponentName } from '@destyler/image/dist/resolver'
import { countdownComponentName } from '@destyler/countdown/dist/resolver'
import { cllapsibleComponentName } from '@destyler/collapsible/dist/resolver'
import { presenceComponentName } from '@destyler/presence/dist/resolver'
import { iconComponentName } from '@destyler/icon/dist/resolver'
import { collapseComponentName } from '@destyler/collapse/dist/resolver'
import { teleportComponentName } from '@destyler/teleport/dist/resolver'
import { arrowComponentName } from '@destyler/arrow/dist/resolver'
import { popperComponentName } from '@destyler/popper/dist/resolver'
import { focusScopeComponentName } from '@destyler/focus-scope/dist/resolver'
import { dismissableLayerComponentName } from '@destyler/dismissable-layer/dist/resolver'
import { popoverComponentName } from '@destyler/popover/dist/resolver'
import { tooltipComponentName } from '@destyler/tooltip/dist/resolver'
import { visuallyhiddenComponentName } from '@destyler/visually-hidden/dist/resolver'
import { onlineComponentName } from '@destyler/online/dist/resolver'
import { checkboxComponentName } from '@destyler/checkbox/dist/resolver'
import { progressComponentName } from '@destyler/progress/dist/resolver'
import { sliderComponentName } from '@destyler/slider/dist/resolver'
import { dialogComponentName } from '@destyler/dialog/dist/resolver'
import { modalComponentName } from '@destyler/modal/dist/resolver'
import { infoComponentName } from '@destyler/info/dist/resolver'
import { buttonComponentName } from '@destyler/button/dist/resolver'
import { backTopComponentName } from '@destyler/back-top/dist/resolver'
import { aspectRadioComponentName } from '@destyler/aspect-radio/dist/resolver'
import { previewComponentName } from '@destyler/preview/dist/resolver'
import { selectComponentName } from '@destyler/select/dist/resolver'
import { rovingFocusGroupComponentName } from '@destyler/roving-focus/dist/resolver'
import { dividerComponentName } from '@destyler/divider/dist/resolver'
import { radioComponentName } from '@destyler/radio/dist/resolver'
import { switchComponentName } from '@destyler/switch/dist/resolver'
import { linkComponentName } from '@destyler/link/dist/resolver'
import { toggleComponentName } from '@destyler/toggle/dist/resolver'
import { menubarComponentName } from '@destyler/menubar/dist/resolver'

export const destylerComponentNames = [
  ...primitiveComponentName,
  ...labelComponentName,
  ...imageComponentName,
  ...countdownComponentName,
  ...cllapsibleComponentName,
  ...presenceComponentName,
  ...iconComponentName,
  ...collapseComponentName,
  ...teleportComponentName,
  ...arrowComponentName,
  ...popperComponentName,
  ...focusScopeComponentName,
  ...dismissableLayerComponentName,
  ...popoverComponentName,
  ...tooltipComponentName,
  ...visuallyhiddenComponentName,
  ...onlineComponentName,
  ...checkboxComponentName,
  ...progressComponentName,
  ...sliderComponentName,
  ...dialogComponentName,
  ...modalComponentName,
  ...infoComponentName,
  ...buttonComponentName,
  ...backTopComponentName,
  ...aspectRadioComponentName,
  ...previewComponentName,
  ...selectComponentName,
  ...rovingFocusGroupComponentName,
  ...dividerComponentName,
  ...radioComponentName,
  ...switchComponentName,
  ...linkComponentName,
  ...toggleComponentName,
  ...menubarComponentName,
]

export function DestylerUIResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (destylerComponentNames.includes(name))
        return { name, from: 'destyler' }
    },
  }
}
