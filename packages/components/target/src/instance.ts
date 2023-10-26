export interface ExposedBinderInstance {
  targetRef: HTMLElement | null
}

export interface BinderInstance extends ExposedBinderInstance {
  syncTargetWithParent: boolean
  syncTarget: boolean
  setTargetRef: (el: HTMLElement | null) => void
  addScrollListener: (listener: () => void) => void
  removeScrollListener: (listener: () => void) => void
  addResizeListener: (listener: () => void) => void
  removeResizeListener: (listener: () => void) => void
}
