import type { FC } from 'react'
import * as fileUpload from '@destyler/file-upload'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

const FileUpload: FC = () => {
  const [state, send] = useMachine(fileUpload.machine({
    id: useId(),
  }))

  const api = fileUpload.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        FileUpload Component
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default FileUpload
