import type { PropType, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, onUnmounted } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose, useMounted, useSize } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { CollectionItem } from '@destyler/collection'

import { convertValueToPercentage, getLabel, getThumbInBoundsOffset, injectSliderOrientationContext } from '../utils'
import { injectSliderRootContext } from './root'

export const sliderThumbImplProps = {
  ...primitiveProps,
  index: {
    type: Number as PropType<number>,
    required: true,
  },
} as const

export type SliderThumbImplProps = ExtractPublicPropTypes<typeof sliderThumbImplProps>

export const SliderThumbImpl = defineComponent({
  name: 'DestylerSliderThumbImpl',
  inheritAttrs: false,
  props: sliderThumbImplProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props) {
    const rootContext = injectSliderRootContext()
    const orientation = injectSliderOrientationContext()

    const { forwardRef, currentElement: thumbElement } = useForwardExpose()

    const value = computed(() => rootContext.modelValue?.value?.[props.index])
    const percent = computed(() => value.value === undefined ? 0 : convertValueToPercentage(value.value, rootContext.min.value ?? 0, rootContext.max.value ?? 100))
    const label = computed(() => getLabel(props.index, rootContext.modelValue?.value?.length ?? 0))
    const size = useSize(thumbElement)
    const orientationSize = computed(() => size[orientation!.size].value)
    const thumbInBoundsOffset = computed(() => orientationSize.value
      ? getThumbInBoundsOffset(orientationSize.value, percent.value, orientation!.direction)
      : 0)

    const isMounted = useMounted()
    onMounted(() => {
      rootContext.thumbElements.value.push(thumbElement.value)
    })
    onUnmounted(() => {
      const i = rootContext.thumbElements.value.findIndex(i => i === thumbElement.value) ?? -1
      rootContext.thumbElements.value.splice(i, 1)
    })

    return {
      rootContext,
      orientation,
      forwardRef,
      label,
      thumbInBoundsOffset,
      isMounted,
      value,
      percent,
    }
  },
  render() {
    return h(CollectionItem, null, {
      default: () => h(Primitive, mergeProps(this.$attrs, {
        'ref': (el: any) => this.forwardRef(el),
        'role': 'slider',
        'data-destyler-collection-item': '',
        'tabindex': this.rootContext.disabled.value ? undefined : 0,
        'aria-label': this.$attrs['aria-label'] || this.label,
        'data-disabled': this.rootContext.disabled.value ? '' : undefined,
        'data-orientation': this.rootContext.orientation.value,
        'aria-valuenow': this.value,
        'aria-valuemin': this.rootContext.min.value,
        'aria-valuemax': this.rootContext.max.value,
        'aria-orientation': this.rootContext.orientation.value,
        'asChild': this.$props.asChild,
        'as': this.$props.as,
        'style': {
          transform: 'var(--destyler-slider-thumb-transform)',
          position: 'absolute',
          [this.orientation!.startEdge]: `calc(${this.percent}% + ${this.thumbInBoundsOffset}px)`,
          display: !this.isMounted && this.value === undefined ? 'none' : undefined,
        },
        'onFocus': () => {
          this.rootContext.valueIndexToChangeRef.value = this.index
        },
      }), () => this.$slots.default?.()),
    })
  },
})
