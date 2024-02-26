export interface PanelGroupStorage {
  getItem(name: string): string | null
  setItem(name: string, value: string): void
}

export type PanelResizeHandleOnDragging = (isDragging: boolean) => void
export type ResizeHandlerState = 'drag' | 'hover' | 'inactive'
export type Direction = 'horizontal' | 'vertical'
export type PanelOnCollapse = () => void
export type PanelOnExpand = () => void
export type PanelOnResize = (
  size: number,
  prevSize: number | undefined
) => void

export interface PanelCallbacks {
  onCollapse?: PanelOnCollapse
  onExpand?: PanelOnExpand
  onResize?: PanelOnResize
}

export interface PanelConstraints {
  collapsedSize?: number | undefined
  collapsible?: boolean | undefined
  defaultSize?: number | undefined
  maxSize?: number | undefined
  minSize?: number | undefined
}

export interface PanelData {
  callbacks: PanelCallbacks
  constraints: PanelConstraints
  id: string
  idIsFromProps: boolean
  order: number | undefined
}

export type ResizeEvent = KeyboardEvent | MouseEvent | TouchEvent
export type ResizeHandler = (event: ResizeEvent) => void

export interface DragState {
  dragHandleId: string
  dragHandleRect: DOMRect
  initialCursorPosition: number
  initialLayout: number[]
}
