import type { Placement } from '@zag-js/popper'
import type { StepDetails, StepPlacement } from '../types'

export function isTooltipStep(step: StepDetails | null): step is Omit<StepDetails, 'placement'> & { placement: Placement } {
  return step?.type === 'tooltip'
}

export function isTooltipPlacement(placement: StepPlacement | undefined): placement is Placement {
  return placement != null && placement !== 'center'
}

function normalizeStep(step: StepDetails): StepDetails {
  if (step.type === 'floating') {
    return { backdrop: false, arrow: false, placement: 'bottom-end', ...step }
  }

  if (step.target == null || step.type === 'dialog') {
    return { type: 'dialog', placement: 'center', backdrop: true, ...step }
  }

  if (!step.type || step.type === 'tooltip') {
    return { type: 'tooltip', arrow: true, backdrop: true, ...step }
  }

  return step
}

export function findStep(steps: StepDetails[], id: string | undefined | null): StepDetails | null {
  const res = id != null ? steps.find(step => step.id === id) : null
  return res ? normalizeStep(res) : null
}

export function findStepIndex(steps: StepDetails[], id: string | undefined | null): number {
  return id != null ? steps.findIndex(step => step.id === id) : -1
}
