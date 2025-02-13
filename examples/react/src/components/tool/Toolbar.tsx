import type { ReactNode } from 'react'
import { dataAttr } from '@zag-js/dom-query'
import { useState } from 'react'

interface ToolbarProps {
  viz?: boolean
  children?: ReactNode
  controls?: ReactNode
}

export function Toolbar({ viz, children, controls }: ToolbarProps) {
  const hasControls = !!controls
  const [activeState, setActiveState] = useState(viz ? 1 : !hasControls ? 1 : 0)

  return (
    <div className="toolbar z-10 fixed right-0 top-0 bottom-0 w-80">
      <nav>
        {hasControls && (
          <button
            data-active={dataAttr(activeState === 0)}
            onClick={() => setActiveState(0)}
          >
            Controls
          </button>
        )}
        <button
          data-active={dataAttr(activeState === 1)}
          onClick={() => setActiveState(1)}
        >
          Visualizer
        </button>
      </nav>
      <div>
        {hasControls && (
          <div data-content data-active={dataAttr(activeState === 0)}>
            {controls}
          </div>
        )}
        <div data-content data-active={dataAttr(activeState === 1)}>
          {children}
        </div>
      </div>
    </div>
  )
}
