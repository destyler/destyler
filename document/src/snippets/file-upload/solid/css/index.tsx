/** @jsxImportSource solid-js */
import * as fileUpload from '@destyler/file-upload'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import './index.css'

export default function FileUpload() {

  const [state, send] = useMachine(fileUpload.machine({ id: createUniqueId() }))

  const api = createMemo(() => fileUpload.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="file-upload-root">
      <div
        {...api().getDropzoneProps()}
        class="dropzone"
      >
        <input {...api().getHiddenInputProps()} />
        <div class="dropzone-content">
          <div class="icon-container">
            <div class="upload-icon"></div>
          </div>
          <p class="dropzone-text">Drag and drop files here</p>
          <p class="dropzone-subtext">or</p>
        </div>
        <button
          {...api().getTriggerProps()}
          class="choose-files-btn"
        >
          Choose Files
        </button>
      </div>

      <ul
        {...api().getItemGroupProps()}
        class="file-list"
      >
        <For each={api().acceptedFiles}>
          {file => (
            <li
              {...api().getItemProps({ file })}
              class="file-item"
            >
              <div class="file-item-info">
                <div class="file-icon-container">
                  <div class="file-icon"></div>
                </div>
                <div
                  {...api().getItemNameProps({ file })}
                  class="file-name"
                >
                  {file.name}
                </div>
              </div>
              <button
                {...api().getItemDeleteTriggerProps({ file })}
                class="delete-btn"
              >
                <div class="delete-icon"></div>
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
