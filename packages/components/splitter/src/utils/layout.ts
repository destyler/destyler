/* eslint-disable no-lone-blocks */
import type { PanelConstraints } from '../types'
import { assert } from './assert'
import { fuzzyCompareNumbers, fuzzyNumbersEqual } from './compare'
import { resizePanel } from './resizePanel'

export function compareLayouts(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return false
  }
  else {
    for (let index = 0; index < a.length; index++) {
      if (a[index] !== b[index])
        return false
    }
  }
  return true
}

export function adjustLayoutByDelta({
  delta,
  layout: prevLayout,
  panelConstraints: panelConstraintsArray,
  pivotIndices,
  trigger,
}: {
  delta: number
  layout: number[]
  panelConstraints: PanelConstraints[]
  pivotIndices: number[]
  trigger: 'imperative-api' | 'keyboard' | 'mouse-or-touch'
}): number[] {
  if (fuzzyNumbersEqual(delta, 0))
    return prevLayout

  const nextLayout = [...prevLayout]

  const [firstPivotIndex, secondPivotIndex] = pivotIndices
  assert(firstPivotIndex != null)
  assert(secondPivotIndex != null)

  let deltaApplied = 0

  {
    if (trigger === 'keyboard') {
      {
        const index = delta < 0 ? secondPivotIndex : firstPivotIndex
        const panelConstraints = panelConstraintsArray[index]
        assert(panelConstraints)

        if (panelConstraints.collapsible) {
          const prevSize = prevLayout[index]
          assert(prevSize != null)

          const panelConstraints = panelConstraintsArray[index]
          assert(panelConstraints)
          const { collapsedSize = 0, minSize = 0 } = panelConstraints

          if (fuzzyNumbersEqual(prevSize, collapsedSize)) {
            const localDelta = minSize - prevSize

            if (fuzzyCompareNumbers(localDelta, Math.abs(delta)) > 0)
              delta = delta < 0 ? 0 - localDelta : localDelta
          }
        }
      }

      {
        const index = delta < 0 ? firstPivotIndex : secondPivotIndex
        const panelConstraints = panelConstraintsArray[index]
        assert(panelConstraints)
        const { collapsible } = panelConstraints

        if (collapsible) {
          const prevSize = prevLayout[index]
          assert(prevSize != null)

          const panelConstraints = panelConstraintsArray[index]
          assert(panelConstraints)
          const { collapsedSize = 0, minSize = 0 } = panelConstraints

          if (fuzzyNumbersEqual(prevSize, minSize)) {
            const localDelta = prevSize - collapsedSize

            if (fuzzyCompareNumbers(localDelta, Math.abs(delta)) > 0)
              delta = delta < 0 ? 0 - localDelta : localDelta
          }
        }
      }
    }
  }

  {
    const increment = delta < 0 ? 1 : -1

    let index = delta < 0 ? secondPivotIndex : firstPivotIndex
    let maxAvailableDelta = 0

    while (true) {
      const prevSize = prevLayout[index]
      assert(prevSize != null)

      const maxSafeSize = resizePanel({
        panelConstraints: panelConstraintsArray,
        panelIndex: index,
        size: 100,
      })
      const delta = maxSafeSize - prevSize
      maxAvailableDelta += delta
      index += increment

      if (index < 0 || index >= panelConstraintsArray.length)
        break
    }

    const minAbsDelta = Math.min(Math.abs(delta), Math.abs(maxAvailableDelta))
    delta = delta < 0 ? 0 - minAbsDelta : minAbsDelta
  }

  {
    const pivotIndex = delta < 0 ? firstPivotIndex : secondPivotIndex
    let index = pivotIndex
    while (index >= 0 && index < panelConstraintsArray.length) {
      const deltaRemaining = Math.abs(delta) - Math.abs(deltaApplied)

      const prevSize = prevLayout[index]
      assert(prevSize != null)

      const unsafeSize = prevSize - deltaRemaining
      const safeSize = resizePanel({
        panelConstraints: panelConstraintsArray,
        panelIndex: index,
        size: unsafeSize,
      })

      if (!fuzzyNumbersEqual(prevSize, safeSize)) {
        deltaApplied += prevSize - safeSize

        nextLayout[index] = safeSize

        if (
          deltaApplied
            .toPrecision(3)
            .localeCompare(Math.abs(delta).toPrecision(3), undefined, {
              numeric: true,
            }) >= 0
        ) {
          break
        }
      }

      if (delta < 0)
        index--
      else
        index++
    }
  }

  if (fuzzyNumbersEqual(deltaApplied, 0)) {
    return prevLayout
  }

  {
    const pivotIndex = delta < 0 ? secondPivotIndex : firstPivotIndex

    const prevSize = prevLayout[pivotIndex]
    assert(prevSize != null)

    const unsafeSize = prevSize + deltaApplied
    const safeSize = resizePanel({
      panelConstraints: panelConstraintsArray,
      panelIndex: pivotIndex,
      size: unsafeSize,
    })

    nextLayout[pivotIndex] = safeSize

    if (!fuzzyNumbersEqual(safeSize, unsafeSize)) {
      let deltaRemaining = unsafeSize - safeSize

      const pivotIndex = delta < 0 ? secondPivotIndex : firstPivotIndex
      let index = pivotIndex
      while (index >= 0 && index < panelConstraintsArray.length) {
        const prevSize = nextLayout[index]
        assert(prevSize != null)

        const unsafeSize = prevSize + deltaRemaining
        const safeSize = resizePanel({
          panelConstraints: panelConstraintsArray,
          panelIndex: index,
          size: unsafeSize,
        })

        if (!fuzzyNumbersEqual(prevSize, safeSize)) {
          deltaRemaining -= safeSize - prevSize

          nextLayout[index] = safeSize
        }

        if (fuzzyNumbersEqual(deltaRemaining, 0))
          break

        if (delta > 0)
          index--
        else
          index++
      }
    }
  }

  const totalSize = nextLayout.reduce((total, size) => size + total, 0)

  if (!fuzzyNumbersEqual(totalSize, 100))
    return prevLayout

  return nextLayout
}
