/** @jsxImportSource solid-js */
import { fileUploadControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar,useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import * as fileUpload from '../../index'
import '../style.css'

export default function FileUpload() {
  const controls = useControls(fileUploadControls)

  const [state, send] = useMachine(fileUpload.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => fileUpload.connect(state, send, normalizeProps))

  return (
    <Layout>
      <div {...api().getRootProps()}>
        <div {...api().getDropzoneProps()}>
          <input {...api().getHiddenInputProps()} />
          <p>Drag and drop your files here</p>
          <p>or</p>
          <button {...api().getTriggerProps()}>
            Choose Files...
          </button>
        </div>

        <ul {...api().getItemGroupProps()}>
          <For each={api().acceptedFiles}>
            {file => (
              <li {...api().getItemProps({ file })}>
                <div {...api().getItemNameProps({ file })}>
                  {file.name}
                </div>
                <button {...api().getItemDeleteTriggerProps({ file })}>
                  Delete
                </button>
              </li>
            )}
          </For>
        </ul>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
