import * as clipboard from '@destyler/clipboard'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './index.css'

export default function Clipboard() {

  const [state, send] = useMachine(
    clipboard.machine({
      id: useId(),
      value: 'https://github.com/destyler/destyler',
    })
  )

  const api = clipboard.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="clipboard-root">
        <label {...api.getLabelProps()} className="clipboard-label">
          Copy Link
        </label>
        <div {...api.getControlProps()} className="clipboard-control">
          <div className="clipboard-input-wrapper">
            <input
              {...api.getInputProps()}
              className="clipboard-input"
              readOnly
            />
          </div>
          <button
            {...api.getTriggerProps()}
            className="clipboard-trigger"
          >
            {api.copied
              ? (
                  <div className="clipboard-icon-copied i-carbon:checkmark" />
                )
              : (
                  <div className="clipboard-icon-copy i-carbon:copy" />
                )}
          </button>
        </div>
      </div>
    </>
  )
}
