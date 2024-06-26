import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, onMounted, onUnmounted, watch, withDirectives } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { BindOnceDirective } from '@destyler/directives'

import type { PanelData } from '../types'
import { useUniqueId } from '../composables/useUniqueId'
import { injectPanelGroupContext } from './group'

export const destylerSplitterPanelProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  collapsedSize: {
    type: Number as PropType<number>,
    required: false,
  },
  collapsible: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  defaultSize: {
    type: Number as PropType<number>,
    required: false,
  },
  id: {
    type: String as PropType<string>,
    required: false,
  },
  maxSize: {
    type: Number as PropType<number>,
    required: false,
  },
  minSize: {
    type: Number as PropType<number>,
    required: false,
  },
  order: {
    type: Number as PropType<number>,
    required: false,
  },
} as const

export type DestylerSplitterPanelProps = ExtractPublicPropTypes<typeof destylerSplitterPanelProps>

export const DestylerSplitterPanel = defineComponent({
  name: 'DestylerSplitterPanel',
  props: destylerSplitterPanelProps,
  emits: ['collapse', 'expand', 'resize'],
  setup(props, { emit }) {
    const panelGroupContext = injectPanelGroupContext()
    if (panelGroupContext === null)
      throw new Error('DestylerSplitterPanel components must be rendered within a SplitterGroup container')

    const { getPanelStyle, groupId, reevaluatePanelConstraints, registerPanel, unregisterPanel } = panelGroupContext
    const panelId = useUniqueId(props.id)

    const panelDataRef = computed(() => ({
      callbacks: {
        onCollapse: () => emit('collapse'),
        onExpand: () => emit('expand'),
        onResize: (...args) => emit('resize', ...args),
      },
      constraints: {
        collapsedSize: props.collapsedSize,
        collapsible: props.collapsible,
        defaultSize: props.defaultSize,
        maxSize: props.maxSize,
        minSize: props.minSize,
      },
      id: panelId,
      idIsFromProps: props.id !== undefined,
      order: props.order,
    }) satisfies PanelData)

    watch(() => panelDataRef.value.constraints, (prevConstraints, constraints) => {
      if (
        prevConstraints.collapsedSize !== constraints.collapsedSize
        || prevConstraints.collapsible !== constraints.collapsible
        || prevConstraints.maxSize !== constraints.maxSize
        || prevConstraints.minSize !== constraints.minSize
      ) {
        reevaluatePanelConstraints(panelDataRef.value, prevConstraints)
      }
    }, { deep: true })

    onMounted(() => {
      const panelData = panelDataRef.value
      registerPanel(panelData)
      onUnmounted(() => {
        unregisterPanel(panelData)
      })
    })

    const style = computed(() => getPanelStyle(panelDataRef.value, props.defaultSize))

    return {
      groupId,
      panelId,
      style,
    }
  },
  render() {
    return withDirectives(h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'style': this.style,
      'data-panel': '',
      'data-panel-collapsible': this.$props.collapsible || undefined,
      'data-panel-group-id': this.groupId,
      'data-panel-id': this.panelId,
      'data-panel-size': Number.parseFloat(`${this.style.flexGrow}`).toFixed(1),
    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.panelId }],
    ])
  },
})
