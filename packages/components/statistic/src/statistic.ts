import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { resolveWrappedSlot } from '@destyler/shared'

export const destylerStatisticProps = {
  tabularNums: {
    type: Boolean as PropType<boolean>,
  },
  label: {
    type: String as PropType<string>,
  },
  value: {
    type: [String, Number] as PropType<string | number>,
  },
}

const DestylerStatistic = defineComponent({
  name: 'DestylerStatistic',
  props: destylerStatisticProps,
  render() {
    const {
      $slots: {
        default: defaultSlot,
        label: labelSlot,
        prefix: prefixSlot,
        suffix: suffixSlot,
      },
    } = this
    return h('div', {
      destyler: 'statistic',
    }, [
      resolveWrappedSlot(labelSlot, (children) => {
        return h('div', {
          destyler: 'statistic-label',
        }, [this.$props.label || children])
      }),
      h('div', {
        destyler: 'statistic-value',
      }, [
        (resolveWrappedSlot(prefixSlot, (children) => {
          return children && h('span', {
            destyler: 'statistic-value-prefix',
          }, children)
        })), (this.$props.value !== undefined
          ? h('span', {
            destyler: 'statistic-value-content',
          }, this.$props.value)
          : resolveWrappedSlot(defaultSlot, (children) => {
            return children && h('span', { destyler: 'statistic-value-content' }, children)
          })), (resolveWrappedSlot(suffixSlot, (children) => {
          return children && h('span', {
            destyler: 'statistic-value-suffix',
          }, children)
        }))]),
    ])
  },
})

export {
  DestylerStatistic,
}
