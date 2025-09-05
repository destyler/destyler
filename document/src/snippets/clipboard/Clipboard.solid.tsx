/** @jsxImportSource solid-js */
import * as clipboard from '@destyler/clipboard'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '../../styles/components/clipboard.css'

export default function Clipboard() {
  const [state, send] = useMachine(
    clipboard.machine({
      id: createUniqueId(),
      value: 'https://github.com/destyler/destyler',
    }),
  )

  const api = createMemo(() => clipboard.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()}>
        <label {...api().getLabelProps()}>
          Copy Link
        </label>
        <div {...api().getControlProps()}>
          <input {...api().getInputProps()} readOnly />
          <button {...api().getTriggerProps()}>
            <div />
          </button>
        </div>
      </div>
    </>
  )
}
