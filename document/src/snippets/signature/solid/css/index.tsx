/** @jsxImportSource solid-js */
import * as signature from '@destyler/signature'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import './index.css'

export default function Signature() {
  const id = createUniqueId()

  const [state, send] = useMachine(signature.machine({ id }))

  const api = createMemo(() =>
    signature.connect(state, send, normalizeProps),
  )

  return (
    <div {...api().getRootProps()} class="signature-container">
      <div class="signature-header">
        <label 
          {...api().getLabelProps()} 
          class="signature-label"
        >
          Signature
        </label>
        <p class="signature-description">
          Draw your signature in the area below
        </p>
      </div>

      <div
        {...api().getControlProps()}
        class="signature-control"
      >
        <svg 
          {...api().getSegmentProps()} 
          class="signature-canvas"
        >
          <For each={api().paths}>
            {(path, i) => (
              <path
                {...api().getSegmentPathProps({ path })}
                class="signature-path"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            )}
          </For>
          {api().currentPath && (
            <path
              {...api().getSegmentPathProps({ path: api().currentPath! })}
              class="signature-path"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          )}
        </svg>
        <button
          {...api().getClearTriggerProps()}
          class="signature-clear-button"
        >
          <span class="signature-clear-icon i-lucide:x"></span>
          <span class="signature-sr-only">Clear signature</span>
        </button>
        <div
          {...api().getGuideProps()}
          class="signature-guide"
        >
          Sign above
        </div>
      </div>
      <div class="signature-footer">
        <p class="signature-counter">
          {api().paths.length} stroke{api().paths.length !== 1 ? 's' : ''}
        </p>
        <div class="signature-actions">
          <button
            {...api().getClearTriggerProps()}
            class="signature-clear-action"
          >
            <span class="signature-eraser-icon i-lucide:eraser"></span>
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
