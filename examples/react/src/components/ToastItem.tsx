import { normalizeProps, useActor } from '@destyler/react'
import * as toast from '@destyler/toast'

export function ToastItem(props: { actor: toast.Service }) {
  const [state, send] = useActor(props.actor)

  const api = toast.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      <div {...api.getGhostBeforeProps()}></div>
      <p {...api.getTitleProps()}>
        {api.title}
      </p>
      <p {...api.getDescriptionProps()}>
        {api.description}
      </p>
      <button {...api.getCloseTriggerProps()}>
        <div className="i-carbon-close"></div>
      </button>
      <div {...api.getGhostAfterProps()} />
    </div>
  )
}
