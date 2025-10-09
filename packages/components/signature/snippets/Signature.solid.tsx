/** @jsxImportSource solid-js */
import * as signature from '@destyler/signature'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import './style.css'

export default function Signature() {
  const id = createUniqueId()

  const [state, send] = useMachine(signature.machine({ id }))

  const api = createMemo(() =>
    signature.connect(state, send, normalizeProps),
  )

  return (
    <div {...api().getRootProps()}>
      <div class="space-y-2">
        <label {...api().getLabelProps()}>
          Signature
        </label>
        <p class="text-sm text-muted-foreground mt-0!">
          Draw your signature in the area below
        </p>
      </div>

      <div {...api().getControlProps()}>
        <svg {...api().getSegmentProps()}>
          <For each={api().paths}>
            {(path, _i) => (
              <path
                {...api().getSegmentPathProps({ path })}
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
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          )}
        </svg>
        <button {...api().getClearTriggerProps()}>
          <span></span>
          <span>Clear signature</span>
        </button>
        <div {...api().getGuideProps()}>
          Sign above
        </div>
      </div>
      <div class="flex items-center justify-between mt-0!">
        <p class="text-xs text-muted-foreground mt-0!">
          {api().paths.length}
          {' '}
          stroke
          {api().paths.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
