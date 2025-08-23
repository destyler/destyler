// Refactored from https://github.com/focus-trap/focus-trap/blob/master/index.js
// MIT License

import type {
  ActivateOptions,
  DeactivateOptions,
  FindNextNodeOptions,
  FocusTrapOptions,
  FocusTrapState,
  PauseOptions,
  UnpauseOptions,
} from './types'
import {
  addDomEvent,
  getActiveElement,
  getDocument,
  getEventTarget,
  getFocusables,
  getTabbables,
  getTabIndex,
  isDocument,
  isFocusable,
  isTabbable,
} from '@destyler/dom'

const isTabEvent = (event: KeyboardEvent) => event.key === 'Tab'

const valueOrHandler = (value: any, ...params: any[]) => (typeof value === 'function' ? value(...params) : value)

const isEscapeEvent = (event: KeyboardEvent) => !event.isComposing && event.key === 'Escape'

const delay = (fn: () => void) => setTimeout(fn, 0)

function isSelectableInput(node: HTMLElement): node is HTMLInputElement {
  return node.localName === 'input' && 'select' in node && typeof node.select === 'function'
}

const activeFocusTraps = {
  activateTrap(trapStack: FocusTrap[], trap: FocusTrap) {
    if (trapStack.length > 0) {
      const activeTrap = trapStack[trapStack.length - 1]
      if (activeTrap !== trap) {
        activeTrap.pause()
      }
    }

    const trapIndex = trapStack.indexOf(trap)
    if (trapIndex === -1) {
      trapStack.push(trap)
    }
    else {
      trapStack.splice(trapIndex, 1)
      trapStack.push(trap)
    }
  },

  deactivateTrap(trapStack: FocusTrap[], trap: FocusTrap) {
    const trapIndex = trapStack.indexOf(trap)
    if (trapIndex !== -1) {
      trapStack.splice(trapIndex, 1)
    }

    if (trapStack.length > 0) {
      trapStack[trapStack.length - 1].unpause()
    }
  },
}

const sharedTrapStack: FocusTrap[] = []

export class FocusTrap {
  private trapStack: FocusTrap[]
  private config: FocusTrapOptions
  private doc: Document

  private state: FocusTrapState = {
    containers: [],
    containerGroups: [],
    tabbableGroups: [],
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false,
    delayInitialFocusTimer: undefined,
    recentNavEvent: undefined,
  }

  get active() {
    return this.state.active
  }

  get paused() {
    return this.state.paused
  }

  constructor(elements: HTMLElement | HTMLElement[], options: FocusTrapOptions) {
    this.trapStack = options.trapStack || sharedTrapStack

    const config: FocusTrapOptions = {
      returnFocusOnDeactivate: true,
      escapeDeactivates: true,
      delayInitialFocus: true,
      isKeyForward(e) {
        return isTabEvent(e) && !e.shiftKey
      },
      isKeyBackward(e) {
        return isTabEvent(e) && e.shiftKey
      },
      ...options,
    }

    this.doc = config.document || getDocument(Array.isArray(elements) ? elements[0] : elements)
    this.config = config

    this.updateContainerElements(elements)
    this.setupMutationObserver()
  }

  private findContainerIndex(element: HTMLElement, event?: Event): number {
    const composedPath = typeof event?.composedPath === 'function' ? event.composedPath() : undefined
    return this.state.containerGroups.findIndex(
      ({ container, tabbableNodes }) =>
        container.contains(element)
        || composedPath?.includes(container)
        || tabbableNodes.find(node => node === element),
    )
  }

  private updateTabbableNodes() {
    this.state.containerGroups = this.state.containers.map((container) => {
      const tabbableNodes = getTabbables(container)
      const focusableNodes = getFocusables(container)

      const firstTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[0] : undefined
      const lastTabbableNode = tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : undefined

      const firstDomTabbableNode = focusableNodes.find(node => isTabbable(node))
      const lastDomTabbableNode = focusableNodes
        .slice()
        .reverse()
        .find(node => isTabbable(node))

      const posTabIndexesFound = !!tabbableNodes.find(node => getTabIndex(node) > 0)

      function nextTabbableNode(node: HTMLElement, forward = true) {
        const nodeIdx = tabbableNodes.indexOf(node)
        if (nodeIdx < 0) {
          if (forward) {
            return focusableNodes.slice(focusableNodes.indexOf(node) + 1).find(el => isTabbable(el))
          }
          return focusableNodes
            .slice(0, focusableNodes.indexOf(node))
            .reverse()
            .find(el => isTabbable(el))
        }
        return tabbableNodes[nodeIdx + (forward ? 1 : -1)]
      }

      return {
        container,
        tabbableNodes,
        focusableNodes,
        posTabIndexesFound,
        firstTabbableNode,
        lastTabbableNode,
        firstDomTabbableNode,
        lastDomTabbableNode,
        nextTabbableNode,
      }
    })

    this.state.tabbableGroups = this.state.containerGroups.filter(group => group.tabbableNodes.length > 0)

    if (
      this.state.tabbableGroups.length <= 0
      && !this.getNodeForOption('fallbackFocus')
    ) {
      throw new Error(
        'Your focus-trap must have at least one container with at least one tabbable node in it at all times',
      )
    }

    if (this.state.containerGroups.find(g => g.posTabIndexesFound) && this.state.containerGroups.length > 1) {
      throw new Error(
        'At least one node with a positive tabindex was found in one of your focus-trap\'s multiple containers. Positive tabindexes are only supported in single-container focus-traps.',
      )
    }
  }

  private listenerCleanups: VoidFunction[] = []

  private addListeners() {
    if (!this.state.active)
      return

    activeFocusTraps.activateTrap(this.trapStack, this)

    this.state.delayInitialFocusTimer = this.config.delayInitialFocus
      ? delay(() => {
          this.tryFocus(this.getInitialFocusNode())
        })
      : this.tryFocus(this.getInitialFocusNode())

    this.listenerCleanups.push(
      addDomEvent(this.doc, 'focusin', this.handleFocus, true),
      addDomEvent(this.doc, 'mousedown', this.handlePointerDown, { capture: true, passive: false }),
      addDomEvent(this.doc, 'touchstart', this.handlePointerDown, { capture: true, passive: false }),
      addDomEvent(this.doc, 'click', this.handleClick, { capture: true, passive: false }),
      addDomEvent(this.doc, 'keydown', this.handleTabKey, { capture: true, passive: false }),
      addDomEvent(this.doc, 'keydown', this.handleEscapeKey),
    )

    return this
  }

  private removeListeners() {
    if (!this.state.active)
      return
    this.listenerCleanups.forEach(cleanup => cleanup())
    this.listenerCleanups = []
    return this
  }

  private handleFocus = (event: FocusEvent) => {
    const target = getEventTarget(event) as HTMLElement
    const targetContained = this.findContainerIndex(target, event) >= 0

    if (targetContained || isDocument(target)) {
      if (targetContained) {
        this.state.mostRecentlyFocusedNode = target
      }
    }
    else {
      event.stopImmediatePropagation()

      let nextNode
      let navAcrossContainers = true

      if (this.state.mostRecentlyFocusedNode) {
        if (getTabIndex(this.state.mostRecentlyFocusedNode) > 0) {
          const mruContainerIdx = this.findContainerIndex(this.state.mostRecentlyFocusedNode)
          const { tabbableNodes } = this.state.containerGroups[mruContainerIdx]

          if (tabbableNodes.length > 0) {
            const mruTabIdx = tabbableNodes.findIndex(node => node === this.state.mostRecentlyFocusedNode)

            if (mruTabIdx >= 0) {
              if (this.config.isKeyForward!(this.state.recentNavEvent!)) {
                if (mruTabIdx + 1 < tabbableNodes.length) {
                  nextNode = tabbableNodes[mruTabIdx + 1]
                  navAcrossContainers = false
                }
              }
              else {
                if (mruTabIdx - 1 >= 0) {
                  nextNode = tabbableNodes[mruTabIdx - 1]
                  navAcrossContainers = false
                }
              }
            }
          }
        }
        else {
          if (!this.state.containerGroups.some(g => g.tabbableNodes.some(n => getTabIndex(n) > 0))) {
            navAcrossContainers = false
          }
        }
      }
      else {
        navAcrossContainers = false
      }

      if (navAcrossContainers) {
        nextNode = this.findNextNavNode({
          target: this.state.mostRecentlyFocusedNode,
          isBackward: this.config.isKeyBackward!(this.state.recentNavEvent!),
        })
      }

      if (nextNode) {
        this.tryFocus(nextNode)
      }
      else {
        this.tryFocus(this.state.mostRecentlyFocusedNode || this.getInitialFocusNode())
      }
    }

    this.state.recentNavEvent = undefined // clear
  }

  private handlePointerDown = (event: MouseEvent | TouchEvent) => {
    const target = getEventTarget(event) as HTMLElement

    if (this.findContainerIndex(target, event) >= 0) {
      return
    }

    if (valueOrHandler(this.config.clickOutsideDeactivates, event)) {
      this.deactivate({ returnFocus: this.config.returnFocusOnDeactivate })
      return
    }

    if (valueOrHandler(this.config.allowOutsideClick, event)) {
      return
    }

    event.preventDefault()
  }

  private handleClick = (event: MouseEvent) => {
    const target = getEventTarget(event) as HTMLElement

    if (this.findContainerIndex(target, event) >= 0) {
      return
    }

    if (valueOrHandler(this.config.clickOutsideDeactivates, event)) {
      return
    }

    if (valueOrHandler(this.config.allowOutsideClick, event)) {
      return
    }

    event.preventDefault()
    event.stopImmediatePropagation()
  }

  private handleTabKey = (event: KeyboardEvent) => {
    if (this.config.isKeyForward!(event) || this.config.isKeyBackward!(event)) {
      this.state.recentNavEvent = event
      const isBackward = this.config.isKeyBackward!(event)

      const destinationNode = this.findNextNavNode({ event, isBackward })
      if (!destinationNode)
        return

      if (isTabEvent(event)) {
        event.preventDefault()
      }

      this.tryFocus(destinationNode)
    }
  }

  private handleEscapeKey = (event: KeyboardEvent) => {
    if (isEscapeEvent(event) && valueOrHandler(this.config.escapeDeactivates, event) !== false) {
      event.preventDefault()
      this.deactivate()
    }
  }

  private _mutationObserver?: MutationObserver

  private setupMutationObserver = () => {
    const win = this.doc.defaultView || window
    this._mutationObserver = new win.MutationObserver((mutations) => {
      const isFocusedNodeRemoved = mutations.some((mutation) => {
        const removedNodes = Array.from(mutation.removedNodes)
        return removedNodes.includes(this.state.mostRecentlyFocusedNode!)
      })

      if (isFocusedNodeRemoved) {
        this.tryFocus(this.getInitialFocusNode())
      }
    })
  }

  private updateObservedNodes = () => {
    this._mutationObserver?.disconnect()

    if (this.state.active && !this.state.paused) {
      this.state.containers.forEach((container) => {
        this._mutationObserver?.observe(container, { subtree: true, childList: true })
      })
    }
  }

  private getInitialFocusNode = () => {
    let node = this.getNodeForOption('initialFocus', { hasFallback: true })

    if (node === false) {
      return false
    }

    if (node === undefined || (node && !isFocusable(node))) {
      if (this.findContainerIndex(this.doc.activeElement as HTMLElement) >= 0) {
        node = this.doc.activeElement
      }
      else {
        const firstTabbableGroup = this.state.tabbableGroups[0]
        const firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode

        node = firstTabbableNode || this.getNodeForOption('fallbackFocus')
      }
    }
    else if (node === null) {
      node = this.getNodeForOption('fallbackFocus')
    }

    if (!node) {
      throw new Error('Your focus-trap needs to have at least one focusable element')
    }

    if (!node.isConnected) {
      node = this.getNodeForOption('fallbackFocus')
    }

    return node
  }

  private tryFocus = (node: HTMLElement | false | null) => {
    if (node === false)
      return
    if (node === getActiveElement(this.doc))
      return
    if (!node || !node.focus) {
      this.tryFocus(this.getInitialFocusNode())
      return
    }

    node.focus({ preventScroll: !!this.config.preventScroll })
    this.state.mostRecentlyFocusedNode = node

    if (isSelectableInput(node)) {
      node.select()
    }
  }

  activate(activateOptions?: ActivateOptions) {
    if (this.state.active) {
      return this
    }

    const onActivate = this.getOption(activateOptions, 'onActivate')
    const onPostActivate = this.getOption(activateOptions, 'onPostActivate')
    const checkCanFocusTrap = this.getOption(activateOptions, 'checkCanFocusTrap')

    if (!checkCanFocusTrap) {
      this.updateTabbableNodes()
    }

    this.state.active = true
    this.state.paused = false
    this.state.nodeFocusedBeforeActivation = (this.doc.activeElement as HTMLElement) || null

    onActivate?.()

    const finishActivation = () => {
      if (checkCanFocusTrap) {
        this.updateTabbableNodes()
      }
      this.addListeners()
      this.updateObservedNodes()
      onPostActivate?.()
    }

    if (checkCanFocusTrap) {
      checkCanFocusTrap(this.state.containers.concat()).then(finishActivation, finishActivation)
      return this
    }

    finishActivation()
    return this
  }

  deactivate = (deactivateOptions?: DeactivateOptions) => {
    if (!this.state.active)
      return this

    const options = {
      onDeactivate: this.config.onDeactivate,
      onPostDeactivate: this.config.onPostDeactivate,
      checkCanReturnFocus: this.config.checkCanReturnFocus,
      ...deactivateOptions,
    }

    clearTimeout(this.state.delayInitialFocusTimer)
    this.state.delayInitialFocusTimer = undefined

    this.removeListeners()
    this.state.active = false
    this.state.paused = false
    this.updateObservedNodes()

    activeFocusTraps.deactivateTrap(this.trapStack, this)

    const onDeactivate = this.getOption(options, 'onDeactivate')
    const onPostDeactivate = this.getOption(options, 'onPostDeactivate')
    const checkCanReturnFocus = this.getOption(options, 'checkCanReturnFocus')
    const returnFocus = this.getOption(options, 'returnFocus', 'returnFocusOnDeactivate')

    onDeactivate?.()

    const finishDeactivation = () => {
      delay(() => {
        if (returnFocus) {
          const returnFocusNode = this.getReturnFocusNode(this.state.nodeFocusedBeforeActivation)
          this.tryFocus(returnFocusNode)
        }
        onPostDeactivate?.()
      })
    }

    if (returnFocus && checkCanReturnFocus) {
      const returnFocusNode = this.getReturnFocusNode(this.state.nodeFocusedBeforeActivation)
      checkCanReturnFocus(returnFocusNode).then(finishDeactivation, finishDeactivation)
      return this
    }

    finishDeactivation()
    return this
  }

  pause = (pauseOptions?: PauseOptions) => {
    if (this.state.paused || !this.state.active) {
      return this
    }

    const onPause = this.getOption(pauseOptions, 'onPause')
    const onPostPause = this.getOption(pauseOptions, 'onPostPause')

    this.state.paused = true
    onPause?.()

    this.removeListeners()
    this.updateObservedNodes()

    onPostPause?.()
    return this
  }

  unpause = (unpauseOptions?: UnpauseOptions) => {
    if (!this.state.paused || !this.state.active) {
      return this
    }

    const onUnpause = this.getOption(unpauseOptions, 'onUnpause')
    const onPostUnpause = this.getOption(unpauseOptions, 'onPostUnpause')

    this.state.paused = false
    onUnpause?.()

    this.updateTabbableNodes()
    this.addListeners()
    this.updateObservedNodes()

    onPostUnpause?.()
    return this
  }

  updateContainerElements = (containerElements: HTMLElement | HTMLElement[]) => {
    this.state.containers = Array.isArray(containerElements)
      ? containerElements.filter(Boolean)
      : [containerElements].filter(Boolean)

    if (this.state.active) {
      this.updateTabbableNodes()
    }

    this.updateObservedNodes()

    return this
  }

  private getReturnFocusNode = (previousActiveElement: HTMLElement | null) => {
    const node = this.getNodeForOption('setReturnFocus', {
      params: [previousActiveElement],
    })
    return node || (node === false ? false : previousActiveElement)
  }

  private getOption = (
    configOverrideOptions: any,
    optionName: keyof any,
    configOptionName?: keyof FocusTrapOptions,
  ) => {
    return configOverrideOptions && configOverrideOptions[optionName] !== undefined
      ? configOverrideOptions[optionName]
      // @ts-expect-error FIX-ME
      : this.config[configOptionName || optionName]
  }

  private getNodeForOption = (
    optionName: keyof FocusTrapOptions,
    { hasFallback = false, params = [] }: { hasFallback?: boolean, params?: any[] } = {},
  ) => {
    let optionValue: any = this.config[optionName]
    if (typeof optionValue === 'function')
      optionValue = optionValue(...params)
    if (optionValue === true)
      optionValue = undefined
    if (!optionValue) {
      if (optionValue === undefined || optionValue === false) {
        return optionValue
      }
      throw new Error(`\`${optionName}\` was specified but was not a node, or did not return a node`)
    }

    let node = optionValue

    if (typeof optionValue === 'string') {
      try {
        node = this.doc.querySelector(optionValue) // resolve to node, or null if fails
      }
      catch (err: any) {
        throw new Error(`\`${optionName}\` appears to be an invalid selector; error="${err.message}"`)
      }

      if (!node) {
        if (!hasFallback) {
          throw new Error(`\`${optionName}\` as selector refers to no known node`)
        }
      }
    }

    return node
  }

  private findNextNavNode = (opts: FindNextNodeOptions) => {
    const { event, isBackward = false } = opts
    // @ts-expect-error  FIX-ME
    const target = opts.target || (getEventTarget(event) as HTMLElement)

    this.updateTabbableNodes()

    let destinationNode = null

    if (this.state.tabbableGroups.length > 0) {
      const containerIndex = this.findContainerIndex(target, event)
      const containerGroup = containerIndex >= 0 ? this.state.containerGroups[containerIndex] : undefined

      if (containerIndex < 0) {
        if (isBackward) {
          destinationNode = this.state.tabbableGroups[this.state.tabbableGroups.length - 1].lastTabbableNode
        }
        else {
          destinationNode = this.state.tabbableGroups[0].firstTabbableNode
        }
      }
      else if (isBackward) {
        let startOfGroupIndex = this.state.tabbableGroups.findIndex(
          ({ firstTabbableNode }) => target === firstTabbableNode,
        )

        if (
          startOfGroupIndex < 0
          && (containerGroup?.container === target
            || (isFocusable(target) && !isTabbable(target) && !containerGroup?.nextTabbableNode(target, false)))
        ) {
          startOfGroupIndex = containerIndex
        }

        if (startOfGroupIndex >= 0) {
          const destinationGroupIndex
            = startOfGroupIndex === 0 ? this.state.tabbableGroups.length - 1 : startOfGroupIndex - 1

          const destinationGroup = this.state.tabbableGroups[destinationGroupIndex]

          destinationNode
            = getTabIndex(target) >= 0 ? destinationGroup.lastTabbableNode : destinationGroup.lastDomTabbableNode
        }
        // @ts-expect-error FIX-ME
        else if (!isTabEvent(event)) {
          destinationNode = containerGroup?.nextTabbableNode(target, false)
        }
      }
      else {
        let lastOfGroupIndex = this.state.tabbableGroups.findIndex(
          ({ lastTabbableNode }) => target === lastTabbableNode,
        )

        if (
          lastOfGroupIndex < 0
          && (containerGroup?.container === target
            || (isFocusable(target) && !isTabbable(target) && !containerGroup?.nextTabbableNode(target)))
        ) {
          lastOfGroupIndex = containerIndex
        }

        if (lastOfGroupIndex >= 0) {
          const destinationGroupIndex
            = lastOfGroupIndex === this.state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1

          const destinationGroup = this.state.tabbableGroups[destinationGroupIndex]

          destinationNode
            = getTabIndex(target) >= 0 ? destinationGroup.firstTabbableNode : destinationGroup.firstDomTabbableNode
        }
        // @ts-expect-error FIX-ME
        else if (!isTabEvent(event)) {
          destinationNode = containerGroup?.nextTabbableNode(target)
        }
      }
    }
    else {
      destinationNode = this.getNodeForOption('fallbackFocus')
    }

    return destinationNode
  }
}
