import type { ComponentResolver } from 'unplugin-vue-components'

import { primitiveComponentName } from '@destyler/primitive/resolver'
import { labelComponentName } from '@destyler/label/resolver'
import { imageComponentName } from '@destyler/image/resolver'
import { countdownComponentName } from '@destyler/countdown/resolver'
import { collapsibleComponentName } from '@destyler/collapsible/resolver'
import { presenceComponentName } from '@destyler/presence/resolver'
import { iconComponentName } from '@destyler/icon/resolver'
import { collapseComponentName } from '@destyler/collapse/resolver'
import { teleportComponentName } from '@destyler/teleport/resolver'
import { arrowComponentName } from '@destyler/arrow/resolver'
import { popperComponentName } from '@destyler/popper/resolver'
import { focusScopeComponentName } from '@destyler/focus-scope/resolver'
import { dismissableLayerComponentName } from '@destyler/dismissable-layer/resolver'
import { popoverComponentName } from '@destyler/popover/resolver'
import { tooltipComponentName } from '@destyler/tooltip/resolver'
import { visuallyhiddenComponentName } from '@destyler/visually-hidden/resolver'
import { onlineComponentName } from '@destyler/online/resolver'
import { checkboxComponentName } from '@destyler/checkbox/resolver'
import { progressComponentName } from '@destyler/progress/resolver'
import { sliderComponentName } from '@destyler/slider/resolver'
import { dialogComponentName } from '@destyler/dialog/resolver'
import { modalComponentName } from '@destyler/modal/resolver'
import { infoComponentName } from '@destyler/info/resolver'
import { buttonComponentName } from '@destyler/button/resolver'
import { backTopComponentName } from '@destyler/back-top/resolver'
import { aspectRadioComponentName } from '@destyler/aspect-radio/resolver'
import { previewComponentName } from '@destyler/preview/resolver'
import { selectComponentName } from '@destyler/select/resolver'
import { rovingFocusGroupComponentName } from '@destyler/roving-focus/resolver'
import { dividerComponentName } from '@destyler/divider/resolver'
import { radioComponentName } from '@destyler/radio/resolver'
import { switchComponentName } from '@destyler/switch/resolver'
import { linkComponentName } from '@destyler/link/resolver'
import { toggleComponentName } from '@destyler/toggle/resolver'
import { menubarComponentName } from '@destyler/menubar/resolver'
import { toolbarComponentName } from '@destyler/toolbar/resolver'

export const destylerComponentNames = [
  ...primitiveComponentName,
  ...labelComponentName,
  ...imageComponentName,
  ...countdownComponentName,
  ...collapsibleComponentName,
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
  ...toolbarComponentName,
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
