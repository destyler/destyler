import type { CSSProperties, PropType, Ref, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, ref, watch, watchEffect } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { areEqual, createContext } from '@destyler/shared'
import { useDirection, useForwardExpose, useId } from '@destyler/composition'
import { Primitive, primitiveProps } from '@destyler/primitive'

import { assert } from '../utils/assert'
import debounce from '../utils/debounce'
import { getResizeHandleElement } from '../utils/dom'
import { determinePivotIndices } from '../utils/pivot'
import { computePanelFlexBoxStyle } from '../utils/style'
import { validatePanelGroupLayout } from '../utils/validation'
import { callPanelCallbacks } from '../utils/callPanelCallbacks'
import { adjustLayoutByDelta, compareLayouts } from '../utils/layout'
import { calculateDeltaPercentage, calculateUnsafeDefaultLayout } from '../utils/calculate'
import { getResizeEventCursorPosition, isKeyDown, isMouseEvent, isTouchEvent } from '../utils/events'
import { initializeDefaultStorage, loadPanelGroupState, savePanelGroupState } from '../utils/storage'
import { useWindowSplitterPanelGroupBehavior } from '../composables/useWindowSplitterPanelGroupBehavior'
import type { Direction, DragState, PanelConstraints, PanelData, PanelGroupStorage, ResizeEvent, ResizeHandler } from '../types'
import { EXCEEDED_HORIZONTAL_MAX, EXCEEDED_HORIZONTAL_MIN, EXCEEDED_VERTICAL_MAX, EXCEEDED_VERTICAL_MIN, reportConstraintsViolation } from '../utils/registry'

const defaultStorage: PanelGroupStorage = {
  getItem: (name: string) => {
    initializeDefaultStorage(defaultStorage)
    return defaultStorage.getItem(name)
  },
  setItem: (name: string, value: string) => {
    initializeDefaultStorage(defaultStorage)
    defaultStorage.setItem(name, value)
  },
}

export const splitterGroupProps = {
  ...primitiveProps,
  id: {
    type: String as PropType<string>,
    required: false,
  },
  autoSaveId: {
    type: String as PropType<string>,
    required: false,
    default: null,
  },
  direction: {
    type: String as PropType<Direction>,
    required: true,
  },
  keyboardResizeBy: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
  storage: {
    type: Object as PropType<PanelGroupStorage>,
    required: false,
    default: () => defaultStorage,
  },
} as const

export type SplitterGroupProps = ExtractPublicPropTypes<typeof splitterGroupProps>

export const splitterGroupEmits = {
  layout: (_layout: number[]) => true,
}

export interface PanelGroupContext {
  direction: 'horizontal' | 'vertical'
  dragState: DragState | null
  groupId: string
  reevaluatePanelConstraints: (panelData: PanelData, prevConstraints: PanelConstraints) => void
  registerPanel: (panelData: PanelData) => void
  registerResizeHandle: (dragHandleId: string) => ResizeHandler
  resizePanel: (panelData: PanelData, size: number) => void
  startDragging: (dragHandleId: string, event: ResizeEvent) => void
  stopDragging: () => void
  unregisterPanel: (panelData: PanelData) => void
  panelGroupElement: Ref<ParentNode | null>
  collapsePanel: (panelData: PanelData) => void
  expandPanel: (panelData: PanelData) => void
  isPanelCollapsed: (panelData: PanelData) => boolean
  isPanelExpanded: (panelData: PanelData) => boolean
  getPanelSize: (panelData: PanelData) => number
  getPanelStyle: (panelData: PanelData, defaultSize: number | undefined) => CSSProperties
}

export const [injectPanelGroupContext, providePanelGroupContext] = createContext<PanelGroupContext>('PanelGroup')

export const SplitterGroup = defineComponent({
  name: 'DestylerSplitterGroup',
  props: splitterGroupProps,
  emits: splitterGroupEmits,
  slots: Object as SlotsType<{
    default: (props: { layout: number[] }) => VNode[]
  }>,
  setup(props, { emit }) {
    const LOCAL_STORAGE_DEBOUNCE_INTERVAL = 100

    const debounceMap: {
      [key: string]: typeof savePanelGroupState
    } = {}

    const groupId = useId(props.id, 'destyler-splitter-group')
    const dir = useDirection()
    const { forwardRef, currentElement: panelGroupElementRef } = useForwardExpose()

    const dragState = ref<DragState | null>(null)
    const layout = ref<number[]>([])
    const panelIdToLastNotifiedSizeMapRef = ref<Record<string, number>>({})
    const panelSizeBeforeCollapseRef = ref<Map<string, number>>(new Map())
    const prevDeltaRef = ref<number>(0)

    const committedValuesRef = computed(() => ({
      autoSaveId: props.autoSaveId,
      direction: props.direction,
      dragState: dragState.value,
      id: groupId,
      keyboardResizeBy: props.keyboardResizeBy,
      storage: props.storage,
    }) satisfies {
      autoSaveId: string | null
      direction: Direction
      dragState: DragState | null
      id: string
      keyboardResizeBy: number | null
      storage: PanelGroupStorage
    })

    const eagerValuesRef = ref<{
      layout: number[]
      panelDataArray: PanelData[]
      panelDataArrayChanged: boolean
    }>({
      layout: layout.value,
      panelDataArray: [],
      panelDataArrayChanged: false,
    })

    const setLayout = (val: number[]) => layout.value = val

    useWindowSplitterPanelGroupBehavior({
      eagerValuesRef,
      groupId,
      layout,
      panelDataArray: eagerValuesRef.value.panelDataArray,
      setLayout,
      panelGroupElement: panelGroupElementRef,
    })

    watchEffect(() => {
      const { panelDataArray } = eagerValuesRef.value
      const { autoSaveId } = props
      // If this panel has been configured to persist sizing information, save sizes to local storage.
      if (autoSaveId) {
        if (layout.value.length === 0 || layout.value.length !== panelDataArray.length)
          return

        let debouncedSave = debounceMap[autoSaveId]

        if (!debouncedSave) {
          debouncedSave = debounce(
            savePanelGroupState,
            LOCAL_STORAGE_DEBOUNCE_INTERVAL,
          )

          debounceMap[autoSaveId] = debouncedSave
        }

        const clonedPanelDataArray = [...panelDataArray]
        const clonedPanelSizesBeforeCollapse = new Map(
          panelSizeBeforeCollapseRef.value,
        )

        debouncedSave(
          autoSaveId,
          clonedPanelDataArray,
          clonedPanelSizesBeforeCollapse,
          layout.value,
          props.storage,
        )
      }
    })

    function getPanelStyle(panelData: PanelData, defaultSize: number | undefined) {
      const { panelDataArray } = eagerValuesRef.value

      const panelIndex = findPanelDataIndex(panelDataArray, panelData)

      return computePanelFlexBoxStyle({
        defaultSize,
        dragState: dragState.value,
        layout: layout.value,
        panelData: panelDataArray,
        panelIndex,
      })
    }

    function registerPanel(panelData: PanelData) {
      const { panelDataArray } = eagerValuesRef.value

      panelDataArray.push(panelData)
      panelDataArray.sort((panelA, panelB) => {
        const orderA = panelA.order
        const orderB = panelB.order
        if (orderA == null && orderB == null)
          return 0
        else if (orderA == null)
          return -1
        else if (orderB == null)
          return 1
        else
          return orderA - orderB
      })

      eagerValuesRef.value.panelDataArrayChanged = true
    }

    watch(() => eagerValuesRef.value.panelDataArrayChanged, () => {
      if (eagerValuesRef.value.panelDataArrayChanged) {
        eagerValuesRef.value.panelDataArrayChanged = false

        const { autoSaveId, storage } = committedValuesRef.value
        const { layout: prevLayout, panelDataArray } = eagerValuesRef.value

        let unsafeLayout: number[] | null = null
        if (autoSaveId) {
          const state = loadPanelGroupState(autoSaveId, panelDataArray, storage)
          if (state) {
            panelSizeBeforeCollapseRef.value = new Map(
              Object.entries(state.expandToSizes),
            )
            unsafeLayout = state.layout
          }
        }

        if (unsafeLayout === null) {
          unsafeLayout = calculateUnsafeDefaultLayout({
            panelDataArray,
          })
        }

        const nextLayout = validatePanelGroupLayout({
          layout: unsafeLayout,
          panelConstraints: panelDataArray.map(
            panelData => panelData.constraints,
          ),
        })

        if (!areEqual(prevLayout, nextLayout)) {
          setLayout(nextLayout)

          eagerValuesRef.value.layout = nextLayout
          emit('layout', nextLayout)

          callPanelCallbacks(
            panelDataArray,
            nextLayout,
            panelIdToLastNotifiedSizeMapRef.value,
          )
        }
      }
    })

    function registerResizeHandle(dragHandleId: string) {
      return function resizeHandler(event: ResizeEvent) {
        event.preventDefault()
        const panelGroupElement = panelGroupElementRef.value
        if (!panelGroupElement)
          return () => null

        const { direction, dragState, id: groupId, keyboardResizeBy } = committedValuesRef.value
        const { layout: prevLayout, panelDataArray } = eagerValuesRef.value

        const { initialLayout } = dragState ?? {}

        const pivotIndices = determinePivotIndices(
          groupId,
          dragHandleId,
          panelGroupElement,
        )

        let delta = calculateDeltaPercentage(
          event,
          dragHandleId,
          direction,
          dragState,
          keyboardResizeBy,
          panelGroupElement,
        )
        if (delta === 0)
          return

        const isHorizontal = direction === 'horizontal'
        if (dir.value === 'rtl' && isHorizontal)
          delta = -delta

        const panelConstraints = panelDataArray.map(panelData => panelData.constraints)

        const nextLayout = adjustLayoutByDelta({
          delta,
          layout: initialLayout ?? prevLayout,
          panelConstraints,
          pivotIndices,
          trigger: isKeyDown(event) ? 'keyboard' : 'mouse-or-touch',
        })

        const layoutChanged = !compareLayouts(prevLayout, nextLayout)

        if (isMouseEvent(event) || isTouchEvent(event)) {
          if (prevDeltaRef.value !== delta) {
            prevDeltaRef.value = delta

            if (!layoutChanged) {
              if (isHorizontal) {
                reportConstraintsViolation(
                  dragHandleId,
                  delta < 0 ? EXCEEDED_HORIZONTAL_MIN : EXCEEDED_HORIZONTAL_MAX,
                )
              }
              else {
                reportConstraintsViolation(
                  dragHandleId,
                  delta < 0 ? EXCEEDED_VERTICAL_MIN : EXCEEDED_VERTICAL_MAX,
                )
              }
            }
            else {
              reportConstraintsViolation(dragHandleId, 0)
            }
          }
        }

        if (layoutChanged) {
          setLayout(nextLayout)

          eagerValuesRef.value.layout = nextLayout
          emit('layout', nextLayout)

          callPanelCallbacks(
            panelDataArray,
            nextLayout,
            panelIdToLastNotifiedSizeMapRef.value,
          )
        }
      }
    }

    function resizePanel(panelData: PanelData, unsafePanelSize: number) {
      const { layout: prevLayout, panelDataArray } = eagerValuesRef.value

      const panelConstraintsArray = panelDataArray.map(panelData => panelData.constraints)

      const { panelSize, pivotIndices } = panelDataHelper(
        panelDataArray,
        panelData,
        prevLayout,
      )

      assert(panelSize != null)

      const isLastPanel = findPanelDataIndex(panelDataArray, panelData) === panelDataArray.length - 1
      const delta = isLastPanel
        ? panelSize - unsafePanelSize
        : unsafePanelSize - panelSize

      const nextLayout = adjustLayoutByDelta({
        delta,
        layout: prevLayout,
        panelConstraints: panelConstraintsArray,
        pivotIndices,
        trigger: 'imperative-api',
      })

      if (!compareLayouts(prevLayout, nextLayout)) {
        setLayout(nextLayout)

        eagerValuesRef.value.layout = nextLayout
        emit('layout', nextLayout)

        callPanelCallbacks(
          panelDataArray,
          nextLayout,
          panelIdToLastNotifiedSizeMapRef.value,
        )
      }
    }

    function reevaluatePanelConstraints(panelData: PanelData, prevConstraints: PanelConstraints) {
      const { layout, panelDataArray } = eagerValuesRef.value

      const {
        collapsedSize: prevCollapsedSize = 0,
        collapsible: prevCollapsible,
      } = prevConstraints

      const {
        collapsedSize: nextCollapsedSize = 0,
        collapsible: nextCollapsible,
        maxSize: nextMaxSize = 100,
        minSize: nextMinSize = 0,
      } = panelData.constraints

      const { panelSize: prevPanelSize } = panelDataHelper(
        panelDataArray,
        panelData,
        layout,
      )
      if (prevPanelSize === null) {
        // It's possible that the panels in this group have changed since the last render
        return
      }

      if (
        prevCollapsible
        && nextCollapsible
        && prevPanelSize === prevCollapsedSize
      ) {
        if (prevCollapsedSize !== nextCollapsedSize) {
          resizePanel(panelData, nextCollapsedSize)
        }
        else {
          // Stay collapsed
        }
      }
      else if (prevPanelSize < nextMinSize) {
        resizePanel(panelData, nextMinSize)
      }
      else if (prevPanelSize > nextMaxSize) {
        resizePanel(panelData, nextMaxSize)
      }
    }

    function startDragging(dragHandleId: string, event: ResizeEvent) {
      const { direction } = committedValuesRef.value
      const { layout } = eagerValuesRef.value
      if (!panelGroupElementRef.value)
        return

      const handleElement = getResizeHandleElement(
        dragHandleId,
        panelGroupElementRef.value,
      )
      assert(handleElement)

      const initialCursorPosition = getResizeEventCursorPosition(
        direction,
        event,
      )

      dragState.value = {
        dragHandleId,
        dragHandleRect: handleElement.getBoundingClientRect(),
        initialCursorPosition,
        initialLayout: layout,
      }
    }
    function stopDragging() {
      dragState.value = null
    }

    function unregisterPanel(panelData: PanelData) {
      const { panelDataArray } = eagerValuesRef.value

      const index = findPanelDataIndex(panelDataArray, panelData)
      if (index >= 0) {
        panelDataArray.splice(index, 1)

        delete panelIdToLastNotifiedSizeMapRef.value[panelData.id]

        eagerValuesRef.value.panelDataArrayChanged = true
      }
    }

    function collapsePanel(panelData: PanelData) {
      const { layout: prevLayout, panelDataArray } = eagerValuesRef.value

      if (panelData.constraints.collapsible) {
        const panelConstraintsArray = panelDataArray.map(
          panelData => panelData.constraints,
        )

        const {
          collapsedSize = 0,
          panelSize,
          pivotIndices,
        } = panelDataHelper(panelDataArray, panelData, prevLayout)

        assert(
          panelSize != null,
            `Panel size not found for panel "${panelData.id}"`,
        )

        if (panelSize !== collapsedSize) {
          panelSizeBeforeCollapseRef.value.set(panelData.id, panelSize)

          const isLastPanel
              = findPanelDataIndex(panelDataArray, panelData)
              === panelDataArray.length - 1
          const delta = isLastPanel
            ? panelSize - collapsedSize
            : collapsedSize - panelSize

          const nextLayout = adjustLayoutByDelta({
            delta,
            layout: prevLayout,
            panelConstraints: panelConstraintsArray,
            pivotIndices,
            trigger: 'imperative-api',
          })

          if (!compareLayouts(prevLayout, nextLayout)) {
            setLayout(nextLayout)

            eagerValuesRef.value.layout = nextLayout

            emit('layout', nextLayout)

            callPanelCallbacks(
              panelDataArray,
              nextLayout,
              panelIdToLastNotifiedSizeMapRef.value,
            )
          }
        }
      }
    }

    function expandPanel(panelData: PanelData) {
      const { layout: prevLayout, panelDataArray } = eagerValuesRef.value

      if (panelData.constraints.collapsible) {
        const panelConstraintsArray = panelDataArray.map(
          panelData => panelData.constraints,
        )

        const {
          collapsedSize = 0,
          panelSize,
          minSize = 0,
          pivotIndices,
        } = panelDataHelper(panelDataArray, panelData, prevLayout)

        if (panelSize === collapsedSize) {
          const prevPanelSize = panelSizeBeforeCollapseRef.value.get(
            panelData.id,
          )

          const baseSize
              = prevPanelSize != null && prevPanelSize >= minSize
                ? prevPanelSize
                : minSize

          const isLastPanel
              = findPanelDataIndex(panelDataArray, panelData)
              === panelDataArray.length - 1
          const delta = isLastPanel ? panelSize - baseSize : baseSize - panelSize

          const nextLayout = adjustLayoutByDelta({
            delta,
            layout: prevLayout,
            panelConstraints: panelConstraintsArray,
            pivotIndices,
            trigger: 'imperative-api',
          })

          if (!compareLayouts(prevLayout, nextLayout)) {
            setLayout(nextLayout)

            eagerValuesRef.value.layout = nextLayout

            emit('layout', nextLayout)

            callPanelCallbacks(
              panelDataArray,
              nextLayout,
              panelIdToLastNotifiedSizeMapRef.value,
            )
          }
        }
      }
    }

    function getPanelSize(panelData: PanelData) {
      const { layout, panelDataArray } = eagerValuesRef.value

      const { panelSize } = panelDataHelper(panelDataArray, panelData, layout)

      assert(
        panelSize != null,
          `Panel size not found for panel "${panelData.id}"`,
      )

      return panelSize
    }

    function isPanelCollapsed(panelData: PanelData) {
      const { layout, panelDataArray } = eagerValuesRef.value

      const {
        collapsedSize = 0,
        collapsible,
        panelSize,
      } = panelDataHelper(panelDataArray, panelData, layout)

      return collapsible === true && panelSize === collapsedSize
    }

    function isPanelExpanded(panelData: PanelData) {
      const { layout, panelDataArray } = eagerValuesRef.value

      const {
        collapsedSize = 0,
        collapsible,
        panelSize,
      } = panelDataHelper(panelDataArray, panelData, layout)

      assert(
        panelSize != null,
          `Panel size not found for panel "${panelData.id}"`,
      )

      return !collapsible || panelSize > collapsedSize
    }

    providePanelGroupContext({
      direction: props.direction,
      dragState: dragState.value,
      groupId,
      reevaluatePanelConstraints,
      registerPanel,
      registerResizeHandle,
      resizePanel,
      startDragging,
      stopDragging,
      unregisterPanel,
      panelGroupElement: panelGroupElementRef,

      collapsePanel,
      expandPanel,
      isPanelCollapsed,
      isPanelExpanded,
      getPanelSize,
      getPanelStyle,
    })

    function findPanelDataIndex(panelDataArray: PanelData[], panelData: PanelData) {
      return panelDataArray.findIndex(
        prevPanelData =>
          prevPanelData === panelData || prevPanelData.id === panelData.id,
      )
    }

    function panelDataHelper(
      panelDataArray: PanelData[],
      panelData: PanelData,
      layout: number[],
    ) {
      const panelIndex = findPanelDataIndex(panelDataArray, panelData)

      const isLastPanel = panelIndex === panelDataArray.length - 1
      const pivotIndices = isLastPanel
        ? [panelIndex - 1, panelIndex]
        : [panelIndex, panelIndex + 1]

      const panelSize = layout[panelIndex]

      return {
        ...panelData.constraints,
        panelSize,
        pivotIndices,
      }
    }

    return {
      forwardRef,
      groupId,
      layout,
    }
  },
  render() {
    return h(Primitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'ref': (el: any) => this.forwardRef(el),
      'style': {
        display: 'flex',
        flexDirection: this.$props.direction === 'horizontal' ? 'row' : 'column',
        height: '100%',
        overflow: 'hidden',
        width: '100%',
      },
      'data-panel-group': '',
      'data-orientation': this.$props.direction,
      'data-panel-group-id': this.groupId,
    }, () => this.$slots.default?.({ layout: this.layout }))
  },
})
