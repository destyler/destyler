import * as clipboard from '@destyler/clipboard'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './style.css'

export default function Clipboard() {
  const [state, send] = useMachine(
    clipboard.machine({
      id: useId(),
      value: 'https://github.com/destyler/destyler',
    }),
  )

  const api = clipboard.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        <label {...api.getLabelProps()}>
          Copy Link
        </label>
        <div {...api.getControlProps()}>
          <input {...api.getInputProps()} readOnly />
          <button {...api.getTriggerProps()}>
            <div />
          </button>
        </div>
      </div>
    </>
  )
}
