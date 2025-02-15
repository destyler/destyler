import * as presence from '@destyler/presence'
import { normalizeProps, useMachine } from '@destyler/react'
import { useEffect, useRef } from 'react'

interface PresenceProps {
  present: boolean
  unmountOnExit?: boolean
  onExitComplete?: () => void
}

export function Presence({
  present,
  unmountOnExit,
  onExitComplete,
  ...props
}: PresenceProps) {
  const [state, send] = useMachine(presence.machine({ present }), {
    context: { present, onExitComplete },
  })

  const api = presence.connect(state, send, normalizeProps)
  const nodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.setNode(nodeRef.current)
  }, [nodeRef.current])

  const unmount = !api.present && unmountOnExit

  if (unmount)
    return null

  return (
    <div
      {...props}
      hidden={!api.present}
      data-state={api.skip ? undefined : present ? 'open' : 'closed'}
      ref={nodeRef}
    />
  )
}
