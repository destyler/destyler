import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId, useState } from 'react'
import '../../styles/components/label.css'

export default function Label() {
  const id = useId()
  const [state, send] = useMachine(label.machine({ id }))
  const api = label.connect(state, send, normalizeProps)
  const [firstName, setFirstName] = useState('Elone Hoo')

  return (
    <>
      <div>
        <label {...api.getRootProps()}>
          First name
        </label>
        <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
      </div>
    </>
  )
}
