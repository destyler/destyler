import { normalizeProps, useMachine } from '@destyler/react'
import * as splitter from '@destyler/splitter'
import { useId } from 'react'

export default function SplitterDemo() {
  const [state, send] = useMachine(
    splitter.machine({
      id: useId(),
      size: [
        { id: 'a', size: 30, minSize: 15 },
        { id: 'b', size: 70, minSize: 0 },
      ],
    })
  )

  const api = splitter.connect(state, send, normalizeProps)

  return (
    <>
      <div
        {...api.getRootProps()}
        className="splitter-root"
      >
        <div
          {...api.getPanelProps({ id: 'a' })}
          className="splitter-panel-a"
        >
          <div className="splitter-panel-content">
            <p className="splitter-panel-text">One</p>
          </div>
        </div>
        <div
          {...api.getResizeTriggerProps({ id: 'a:b' })}
          className="splitter-resize-trigger"
        >
          <div className="splitter-resize-handle" />
          <div className="splitter-resize-area" />
        </div>
        <div
          {...api.getPanelProps({ id: 'b' })}
          className="splitter-panel-b"
        >
          <div className="splitter-panel-content">
            <p className="splitter-panel-text">Two</p>
          </div>
        </div>
      </div>
    </>
  )
}
