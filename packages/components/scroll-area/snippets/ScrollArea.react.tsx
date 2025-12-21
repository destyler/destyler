import { normalizeProps, useMachine } from '@destyler/react'
import * as scrollArea from '@destyler/scroll-area'
import { useId } from 'react'
import './style.css'

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
)

export default function ScrollArea() {
  const [state, send] = useMachine(scrollArea.machine({ id: useId() }))

  const api = scrollArea.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      <div {...api.getViewportProps()}>
        <div {...api.getContentProps()}>
          <div className="scroll-area-header">Tags</div>
          {tags.map(tag => (
            <div key={tag} className="scroll-area-item">
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div {...api.getScrollbarProps({ orientation: 'vertical' })}>
        <div {...api.getThumbProps({ orientation: 'vertical' })} />
      </div>

      <div {...api.getScrollbarProps({ orientation: 'horizontal' })}>
        <div {...api.getThumbProps({ orientation: 'horizontal' })} />
      </div>

      <div {...api.getCornerProps()} />
    </div>
  )
}
