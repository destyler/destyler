// Based on https://github.com/theKashey/aria-hidden/blob/master/src/index.ts
// Licensed under MIT

import { walkTreeOutside } from './walk-tree-outside'

function getParentNode(originalTarget: Element | Element[]): HTMLElement | null {
  const target = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget
  return target.ownerDocument.body
}

export function hideOthers(originalTarget: Element | Element[], parentNode = getParentNode(originalTarget), markerName = 'data-aria-hidden') {
  if (!parentNode)
    return
  return walkTreeOutside(originalTarget, {
    parentNode,
    markerName,
    controlAttribute: 'aria-hidden',
    explicitBooleanValue: true,
  })
}

export function inertOthers(originalTarget: Element | Element[], parentNode = getParentNode(originalTarget), markerName = 'data-inerted') {
  if (!parentNode)
    return
  return walkTreeOutside(originalTarget, {
    parentNode,
    markerName,
    controlAttribute: 'inert',
    explicitBooleanValue: false,
  })
}

const supportsInert = () => typeof HTMLElement !== 'undefined' && HTMLElement.prototype.hasOwnProperty('inert')

export function suppressOthers(originalTarget: Element | Element[], parentNode?: HTMLElement, markerName: string = 'data-suppressed') {
  const fn = supportsInert() ? inertOthers : hideOthers
  return fn(originalTarget, parentNode, markerName)
}
