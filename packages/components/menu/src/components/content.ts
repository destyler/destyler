import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardPropsEmits } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'

import { destylerMenuContentImplProps } from './contentImpl'
import { injectMenuContext, injectMenuRootContext } from './root'
import { DestylerMenuRootContentModal } from './rootContentModal'
import { DestylerMenuRootContentNonModal } from './rootContentNonModal'

export const destylerMenuContentProps = {
  ...destylerMenuContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerMenuContentProps = ExtractPublicPropTypes<typeof destylerMenuContentProps>

export const DestylerMenuContent = defineComponent({
  name: 'DestylerMenuContent',
  props: destylerMenuContentProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss', 'entryFocus'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    const menuContext = injectMenuContext()
    const rootContext = injectMenuRootContext()

    return {
      forwarded,
      menuContext,
      rootContext,
    }
  },
  render() {
    return h(DestylerPresence, {
      present: this.forceMount || this.menuContext.open.value,
    }, {
      default: () => {
        if (this.rootContext.modal.value) {
          return h(DestylerMenuRootContentModal, mergeProps(this.$attrs, this.forwarded), {
            default: () => this.$slots.default?.(),
          })
        }
        else {
          return h(DestylerMenuRootContentNonModal, mergeProps(this.$attrs, this.forwarded), {
            default: () => this.$slots.default?.(),
          })
        }
      },
    })
  },
})
