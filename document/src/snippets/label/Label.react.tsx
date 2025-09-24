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
      <div className="flex flex-wrap items-center gap-[15px] px-5">
        <label {...api.getRootProps()}>
          First name
        </label>
        <input
          id="firstName"
          className="bg-input border inline-flex h-[35px] w-[200px]
          appearance-none items-center justify-center rounded-lg
          px-[10px] text-sm leading-none shadow-sm outline-none
          focus:shadow-[0_0_0_2px_black] text-foreground
          selection:color-primary selection:bg-background"
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </div>
    </>
  )
}
