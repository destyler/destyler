import type { PropType, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, onMounted, onUnmounted, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useId } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import type { PanelData } from '../types'
import { injectPanelGroupContext } from './group'

export const splitterPanelProps = {
  ...primitiveProps,
  /**
   * The size of panel when it is collapsed.
   */
  collapsedSize: {
    type: Number as PropType<number>,
    required: false,
  },
  /**
   * Should panel collapse when resized beyond its `minSize`. When `true`, it will be collapsed to `collapsedSize`.
   */
  collapsible: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * Initial size of panel (numeric value between 1-100)
   *
   * @default false
   */
  defaultSize: {
    type: Number as PropType<number>,
    required: false,
  },
  /*
   * Panel id (unique within group);
  falls back to `useId` when not provided
   */
  id: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * The maximum allowable size of panel (numeric value between 1-100); defaults to `100`
   */
  maxSize: {
    type: Number as PropType<number>,
    required: false,
  },
  /**
   * The minimum allowable size of panel (numeric value between 1-100); defaults to `10`
   */
  minSize: {
    type: Number as PropType<number>,
    required: false,
  },
  /**
   * The order of panel within group; required for groups with conditionally rendered panels
   */
  order: {
    type: Number as PropType<number>,
    required: false,
  },
} as const

export type SplitterPanelProps = ExtractPublicPropTypes<typeof splitterPanelProps>

export const splitterPanelEmits = {
  /**
   * Event handler called when panel is collapsed.
   */
  collapse: () => true,
  /**
   * Event handler called when panel is expanded.
   */
  expand: () => true,
  /**
   * Event handler called when panel is resized;
   * size parameter is a numeric value
   * between 1-100.
   */
  resize: (_size: number, _prevSize: number | undefined) => true,
}

export const SplitterPanel = defineComponent({
  name: 'DestylerSplitterPanel',
  props: splitterPanelProps,
  emits: splitterPanelEmits,
  slots: Object as SlotsType<{
    default: (props: {
      /**
       * Is the panel collapsed
       */
      isCollapsed: boolean
      /**
       * Is the panel expanded
       */
      isExpanded: boolean
    }) => VNode[]
  }>,
  setup(props, { emit, expose }) {
    const panelGroupContext = injectPanelGroupContext()
    if (panelGroupContext === null) {
      throw new Error(
        'SplitterPanel components must be rendered within a SplitterGroup container',
      )
    }

    const { collapsePanel, expandPanel, getPanelSize, getPanelStyle, isPanelCollapsed, resizePanel, groupId, reevaluatePanelConstraints, registerPanel, unregisterPanel } = panelGroupContext
    const panelId = useId(props.id, 'destyler-splitter-panel')

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

    const isCollapsed = computed(() => isPanelCollapsed(panelDataRef.value))
    const isExpanded = computed(() => !isCollapsed.value)

    expose({
      collapse: () => {
        collapsePanel(panelDataRef.value)
      },
      expand: () => {
        expandPanel(panelDataRef.value)
      },
      getSize() {
        return getPanelSize(panelDataRef.value)
      },
      resize: (size: number) => {
        resizePanel(panelDataRef.value, size)
      },
      isCollapsed,
      isExpanded,
    })

    return {
      groupId,
      panelId,
      style,
      isCollapsed,
      isExpanded,
    }
  },
  render() {
    return h(Primitive, {
      'id': this.groupId,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'style': this.style,
      'data-panel': '',
      'data-panel-collapsible': this.$props.collapsible || undefined,
      'data-panel-group-id': this.groupId,
      'data-panel-id': this.panelId,
      'data-panel-size': Number.parseFloat(`${this.style.flexGrow}`).toFixed(1),
    }, () => this.$slots.default?.({ isCollapsed: this.isCollapsed, isExpanded: this.isExpanded }))
  },
})
