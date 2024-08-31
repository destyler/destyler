import type { PropType } from 'vue'
import { defineComponent, h, nextTick } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { EVENT_ROOT_CONTENT_DISMISS } from '../utils'

export const navigationLinkProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'a',
  },
  active: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type NavigationLinkProps = ExtractPublicPropTypes<typeof navigationLinkProps>

export const navigationLinkEmits = {
  select: (_ev: MouseEvent) => true,

}

export const NavigationLink = defineComponent({
  name: 'DestylerNavigationLink',
  props: navigationLinkProps,
  emits: navigationLinkEmits,

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
    return h(Primitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-destyler-collection-item': '',
      'data-active': this.$props.active ? '' : undefined,
      'aria-current': this.$props.active ? 'page' : undefined,
      'onClick': (event: any) => {
        this.handleClick(event)
      },
    }, () => this.$slots.default?.())
  },
})
