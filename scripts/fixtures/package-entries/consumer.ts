import type { Context as NavigationContext, ValueChangeDetails } from '@destyler/navigation-menu'
import type { ScrollChangeDetails, Context as ScrollContext, VirtualItem } from '@destyler/scroll-area'
import { machine as navigationMachine } from '@destyler/navigation-menu'
import { machine as scrollMachine } from '@destyler/scroll-area'

const navigation: NavigationContext = { id: 'navigation', defaultValue: 'products' }
const scroll: ScrollContext = { id: 'scroll', type: 'hover' }
navigationMachine(navigation)
scrollMachine(scroll)

const value: ValueChangeDetails = { value: null }
const offset: ScrollChangeDetails = {
  scrollTop: 1,
  scrollLeft: 2,
  scrollHeight: 100,
  scrollWidth: 100,
  clientHeight: 50,
  clientWidth: 50,
}
const item: VirtualItem = { index: 0, start: 0, end: 30, size: 30 }
void [value, offset, item]

// @ts-expect-error the public navigation value must be a string or null
navigationMachine({ id: 'invalid-navigation', value: 123 })
// @ts-expect-error invalid scroll visibility must not degrade into an untyped import
scrollMachine({ id: 'invalid-scroll', type: 'sometimes' })
