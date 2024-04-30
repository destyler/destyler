import type { CSSProperties, Component, PropType, Ref } from 'vue'
import { computed, defineComponent, h, ref, watch, watchEffect } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { areEqual, createContext } from '@destyler/shared'
import { useDirection, useForwardExpose } from '@destyler/composition'
import { DestylerPrimitive } from '@destyler/primitive'
import type { AsTag } from '@destyler/primitive'

import { assert } from '../utils/assert'
import debounce from '../utils/debounce'
import { getResizeHandleElement } from '../utils/dom'
import { determinePivotIndices } from '../utils/pivot'
import { useUniqueId } from '../composables/useUniqueId'
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

export const destylerSplitterGroupProps = {
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

export type DestylerSplitterGroupProps = ExtractPublicPropTypes<typeof destylerSplitterGroupProps>

export interface PanelGroupContext {
  direction: 'horizontal' | 'vertical'
  dragState: DragState | null
  getPanelStyle: (panelData: PanelData, defaultSize: number | undefined) => CSSProperties
  groupId: string
  reevaluatePanelConstraints: (panelData: PanelData, prevConstraints: PanelConstraints) => void
  registerPanel: (panelData: PanelData) => void
  registerResizeHandle: (dragHandleId: string) => ResizeHandler
  resizePanel: (panelData: PanelData, size: number) => void
  startDragging: (dragHandleId: string, event: ResizeEvent) => void
  stopDragging: () => void
  unregisterPanel: (panelData: PanelData) => void
  panelGroupElement: Ref<ParentNode | null>
}

export const [injectPanelGroupContext, providePanelGroupContext] = createContext<PanelGroupContext>('PanelGroup')

export const DestylerSplitterGroup = defineComponent({
  name: 'DestylerSplitterGroup',
  props: destylerSplitterGroupProps,
  emits: ['layout'],
  setup(props, { emit }) {
    const LOCAL_STORAGE_DEBOUNCE_INTERVAL = 100

    const debounceMap: {
      [key: string]: typeof savePanelGroupState
    } = {}

    const groupId = useUniqueId(props.id)
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

        // Limit the frequency of localStorage updates.
        if (!debouncedSave) {
          debouncedSave = debounce(
            savePanelGroupState,
            LOCAL_STORAGE_DEBOUNCE_INTERVAL,
          )

          debounceMap[autoSaveId] = debouncedSave
        }

        // Clone mutable data before passing to the debounced function,
        // else we run the risk of saving an incorrect combination of mutable and immutable values to state.
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

    // (Re)calculate group layout whenever panels are registered or unregistered.
    // useIsomorphicLayoutEffect
    watch(() => eagerValuesRef.value.panelDataArrayChanged, () => {
      if (eagerValuesRef.value.panelDataArrayChanged) {
        eagerValuesRef.value.panelDataArrayChanged = false

        const { autoSaveId, storage } = committedValuesRef.value
        const { layout: prevLayout, panelDataArray } = eagerValuesRef.value

        // If this panel has been configured to persist sizing information,
        // default size should be restored from local storage if possible.
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

        // Validate even saved layouts in case something has changed since last render
        // e.g. for pixel groups, this could be the size of the window
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

        // Support RTL layouts
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

        // Only update the cursor for layout changes triggered by touch/mouse events (not keyboard)
        // Update the cursor even if the layout hasn't changed (we may need to show an invalid cursor state)
        if (isMouseEvent(event) || isTouchEvent(event)) {
          // Watch for multiple subsequent deltas; this might occur for tiny cursor movements.
          // In this case, Panel sizes might not change–
          // but updating cursor in this scenario would cause a flicker.
          if (prevDeltaRef.value !== delta) {
            prevDeltaRef.value = delta

            if (!layoutChanged) {
              // If the pointer has moved too far to resize the panel any further, note this so we can update the cursor.
              // This mimics VS Code behavior.
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

    // External APIs are safe to memoize via committed values ref
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

        // TRICKY
        // When a panel is removed from the group, we should delete the most recent prev-size entry for it.
        // If we don't do this, then a conditionally rendered panel might not call onResize when it's re-mounted.
        // Strict effects mode makes this tricky though because all panels will be registered, unregistered, then re-registered on mount.
        delete panelIdToLastNotifiedSizeMapRef.value[panelData.id]

        eagerValuesRef.value.panelDataArrayChanged = true
      }
    }

    providePanelGroupContext({
      direction: props.direction,
      dragState: dragState.value,
      getPanelStyle,
      groupId,
      reevaluatePanelConstraints,
      registerPanel,
      registerResizeHandle,
      resizePanel,
      startDragging,
      stopDragging,
      unregisterPanel,
      panelGroupElement: panelGroupElementRef,
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
    }
  },
  render() {
    return h(DestylerPrimitive, {
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
    }, () => this.$slots.default?.())
  },
})
