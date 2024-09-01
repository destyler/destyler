import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const linkProps = {
  asChild: {
    ...primitiveProps.asChild,
  },
  to: {
    type: String as PropType<string>,
    required: false,
    default: undefined,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  target: {
    // eslint-disable-next-line ts/ban-types
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & {}) | null>,
    required: false,
    default: undefined,
  },
  rel: {
    // eslint-disable-next-line ts/ban-types
    type: String as PropType<'noopener' | 'noreferrer' | 'nofollow' | 'sponsored' | 'ugc' | (string & {}) | null>,
    required: false,
    default: undefined,
  },
  noRel: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
} as const

export type LinkProps = ExtractPublicPropTypes<typeof linkProps>

export const Link = defineComponent({
  name: 'DestylerLink',
  inheritAttrs: false,
  props: linkProps,
  setup(props) {
    const { forwardRef, currentElement } = useForwardExpose()
    const hasTarget = computed(() => props.target && props.target !== '_self')

    const isTagName = computed(() => {
      return currentElement.value?.tagName.toLowerCase()
    })

    return {
      hasTarget,
      isTagName,
      forwardRef,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$attrs, {
      'ref': this.forwardRef,
      'as': 'a',
      'asChild': this.$props.asChild,
      'role': this.isTagName !== 'a' || this.$props.disabled ? 'link' : undefined,
      'href': this.$props.disabled ? undefined : this.$props.to,
      'target': this.hasTarget ? this.$props.target : undefined,
      'rel': this.$props.noRel ? undefined : this.$props.rel,
      'noRel': this.$props.noRel ? undefined : this.$props.noRel,
      'tabindex': this.$props.disabled ? 0 : undefined,
      'aria-disabled': this.$props.disabled ? true : undefined,
      'data-disabled': this.$props.disabled ? '' : undefined,
    }), () => this.$slots.default?.())
  },
})
