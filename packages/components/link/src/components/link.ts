import type { PropType, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

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
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props) {
    const hasTarget = computed(() => props.target && props.target !== '_self')

    return {
      hasTarget,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$attrs, {
      'as': 'a',
      'asChild': this.$props.asChild,
      'role': 'link',
      'href': this.$props.disabled ? undefined : this.$props.to,
      'target': this.hasTarget ? this.$props.target : undefined,
      'rel': this.$props.noRel ? undefined : this.$props.rel,
      'noRel': this.$props.noRel ? undefined : this.$props.noRel,
      'tabindex': this.$props.disabled ? undefined : 0,
      'aria-disabled': this.$props.disabled ? true : undefined,
      'data-disabled': this.$props.disabled ? '' : undefined,
    }), () => this.$slots.default?.())
  },
})
