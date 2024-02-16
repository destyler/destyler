import type { Component, PropType } from 'vue'
import { defineComponent, h, nextTick } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { EVENT_ROOT_CONTENT_DISMISS } from '../utils'

export const destylerNavigationLinkProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'a',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  active: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerNavigationLinkProps = ExtractPublicPropTypes<typeof destylerNavigationLinkProps>

export const DestylerNavigationLink = defineComponent({
  name: 'DestylerNavigationLink',
  props: destylerNavigationLinkProps,
  emits: ['select'],
  setup(_, { emit }) {
    useForwardExpose()
    async function handleClick(ev: MouseEvent) {
      emit('select', ev)

      await nextTick()
      if (!ev.defaultPrevented && !ev.metaKey) {
        const rootContentDismissEvent = new CustomEvent(
          EVENT_ROOT_CONTENT_DISMISS,
          {
            bubbles: true,
            cancelable: true,
          },
        )
        ev.target?.dispatchEvent(rootContentDismissEvent)
      }
    }
    return {
      handleClick,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-radix-vue-collection-item': '',
      'data-active': this.$props.active ? '' : undefined,
      'aria-current': this.$props.active ? 'page' : undefined,
      'onClick': (event: any) => {
        this.handleClick(event)
      },
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
