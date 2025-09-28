import { normalizeProps, useMachine } from '@destyler/react'
import * as splitter from '@destyler/splitter'
import { useId } from 'react'
import '../../styles/components/splitter.css'

export default function SplitterDemo() {
  const [state, send] = useMachine(
    splitter.machine({
      id: useId(),
      size: [
        { id: 'a', size: 30, minSize: 15 },
        { id: 'b', size: 70, minSize: 0 },
      ],
    }),
  )

  const api = splitter.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        <div {...api.getPanelProps({ id: 'a' })} className="bg-muted/50">
          <div className="text-center p-12 whitespace-nowrap">
            <p className="text-card-foreground font-semibold text-2xl mb-2">One</p>
          </div>
        </div>
        <div {...api.getResizeTriggerProps({ id: 'a:b' })} className="group">
          <div />
          <div />
        </div>
        <div {...api.getPanelProps({ id: 'b' })} className="bg-card">
          <div className="text-center p-12 whitespace-nowrap">
            <p className="text-card-foreground font-semibold text-2xl mb-2">Two</p>
          </div>
        </div>
      </div>
    </>
  )
}
