import { createInjectionKey } from '@destyler/shared'
import {Ref} from 'vue'

export type OnBeforeLeave = ( name: string & number, oldName: string & number & null ) => boolean | Promise<boolean>

export type OnUpdateValue = (value: string & number) => void

export type OnClose = (name: string & number) => void

export interface TabsInjection {
  mergedClsPrefixRef: Ref<string>
  valueRef: Ref<string | number | null>
  closableRef: Ref<boolean>
  tabChangeIdRef: { id: number }
  onBeforeLeaveRef: Ref<OnBeforeLeave | undefined>
  triggerRef: Ref<'click' | 'hover'>
  activateTab: (panelName: string | number) => void
  handleClose: (panelName: string | number) => void
  handleAdd: () => void
}

export const tabsInjectionKey = createInjectionKey<TabsInjection>('destyler-tabs')
