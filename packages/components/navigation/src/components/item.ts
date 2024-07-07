import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h, ref, withModifiers } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useArrowNavigation, useCollection, useForwardExpose, useId } from '@destyler/composition'
import {
  focusFirst,
  getTabbableCandidates,
  makeContentId,
  removeFromTabOrder,
} from '../utils'

import { injectNavigationContext } from './root'

export const navigationItemProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'li',
  },
  value: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type NavigationItemProps = ExtractPublicPropTypes<typeof navigationItemProps>

export interface NavigationItemContext {
  value: string
  contentId: string
  triggerRef: Ref<HTMLElement | undefined>
  focusProxyRef: Ref<HTMLElement | undefined>
  wasEscapeCloseRef: Ref<boolean>
  onEntryKeyDown: () => void
  onFocusProxyEnter: (side: 'start' | 'end') => void
  onContentFocusOutside: () => void
  onRootContentClose: () => void
}

export const [injectNavigationItemContext, provideNavigationItemContext] = createContext<NavigationItemContext>('NavigationItem')

export const NavigationItem = defineComponent({
  name: 'DestylerNavigationItem',
  props: navigationItemProps,
  slots: Object as SlotsType<{
      default: () => VNode[]
    }>,
  setup(props) {
    useForwardExpose()
    const { injectCollection } = useCollection('nav')
    const collectionItems = injectCollection()

    const context = injectNavigationContext()

    const value = props.value || useId()
    const triggerRef = ref<HTMLElement>()
    const focusProxyRef = ref<HTMLElement>()

    const contentId = makeContentId(context.baseId, value)

    let restoreContentTabOrderRef: () => void = () => ({})

    const wasEscapeCloseRef = ref(false)
    async function handleContentEntry(side = 'start') {
      const el = document.getElementById(contentId)
      if (el) {
        restoreContentTabOrderRef()
        const candidates = getTabbableCandidates(el)
        if (candidates.length)
          focusFirst(side === 'start' ? candidates : candidates.reverse())
      }
    }

    function handleContentExit() {
      const el = document.getElementById(contentId)
      if (el) {
        const candidates = getTabbableCandidates(el)
        if (candidates.length)
          restoreContentTabOrderRef = removeFromTabOrder(candidates)
      }
    }

    provideNavigationItemContext({
      value,
      contentId,
      triggerRef,
      focusProxyRef,
      wasEscapeCloseRef,
      onEntryKeyDown: handleContentEntry,
      onFocusProxyEnter: handleContentEntry,
      onContentFocusOutside: handleContentExit,
      onRootContentClose: handleContentExit,
    })

    function handleClose() {
      context.onItemDismiss()
      triggerRef.value?.focus()
    }

    function handleKeydown(ev: KeyboardEvent) {
      const currentFocus = document.activeElement as HTMLElement
      if (ev.keyCode === 32 || ev.key === 'Enter') {
        if (context.modelValue.value === value) {
          handleClose()
          ev.preventDefault()
          return
        }
        else {
          (ev.target as HTMLElement).click()
          ev.preventDefault()
          return
        }
      }

      const itemsArray = collectionItems.value.filter(i =>
        i.parentElement?.hasAttribute('data-menu-item'),
      )

      const newSelectedElement = useArrowNavigation(ev, currentFocus, undefined, {
        itemsArray,
        loop: false,
      })

      if (newSelectedElement)
        newSelectedElement?.focus()

      ev.preventDefault()
      ev.stopPropagation()
    }

    return {
      handleKeydown,
    }
  },
  render() {
    return h(Primitive, {
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'data-menu-item': '',
      'onKeydown': withModifiers((event: any) => {
        this.handleKeydown(event)
      }, ['up', 'down', 'left', 'right', 'home', 'end', 'space']),
    }, () => this.$slots.default?.())
  },
})
