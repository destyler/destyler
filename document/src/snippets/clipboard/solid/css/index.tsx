/** @jsxImportSource solid-js */
import * as clipboard from '@destyler/clipboard'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function Clipboard() {

  const [state, send] = useMachine(
    clipboard.machine({
      id: createUniqueId(),
      value: 'https://github.com/destyler/destyler',
    })
  )

  const api = createMemo(() => clipboard.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="clipboard-root">
        <label {...api().getLabelProps()} class="clipboard-label">
          Copy Link
        </label>
        <div {...api().getControlProps()} class="clipboard-control">
          <div class="clipboard-input-wrapper">
            <input
              {...api().getInputProps()}
              class="clipboard-input"
              readOnly
            />
          </div>
          <button
            {...api().getTriggerProps()}
            class="clipboard-trigger"
          >
            {api().copied
              ? (
                  <div class="clipboard-icon-copied i-carbon:checkmark" />
                )
              : (
                  <div class="clipboard-icon-copy i-carbon:copy" />
                )}
          </button>
        </div>
      </div>
    </>
  )
}
