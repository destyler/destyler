/** @jsxImportSource solid-js */
import { normalizeProps, useActor } from '@destyler/solid'
import * as toast from '@destyler/toast'
import { createMemo } from 'solid-js'

export function ToastItem(props: { actor: toast.Service }) {
  const [state, send] = useActor(props.actor)

  const api = createMemo(() => toast.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()}>
      <div {...api().getGhostBeforeProps()}></div>
      <p {...api().getTitleProps()}>
        {api().title}
      </p>
      <p {...api().getDescriptionProps()}>
        {api().description}
      </p>
      <button {...api().getCloseTriggerProps()}>
        <div class="i-ph-x-bold"></div>
      </button>
      <div {...api().getGhostAfterProps()} />
    </div>
  )
}
