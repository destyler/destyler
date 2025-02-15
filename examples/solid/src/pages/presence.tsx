import * as presence from '@destyler/presence'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createEffect, createSignal } from 'solid-js'

interface PresenceProps {
  present: boolean
  unmountOnExit?: boolean
  onExitComplete?: () => void
}

export function Presence(props: PresenceProps) {
  const [node, setNode] = createSignal<HTMLDivElement>()
  const [state, send] = useMachine(presence.machine({ present: props.present }), {
    context: { present: props.present, onExitComplete: props.onExitComplete },
  })

  const api = presence.connect(state, send, normalizeProps)

  createEffect(() => {
    api.setNode(node())
  })

  const unmount = !api.present && props.unmountOnExit

  if (unmount)
    return null

  return (
    <div
      {...props}
      hidden={!api.present}
      data-state={api.skip ? undefined : props.present ? 'open' : 'closed'}
      ref={setNode}
    />
  )
}
