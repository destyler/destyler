import * as fileUpload from '@destyler/file-upload'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './index.css'

export default function FileUpload() {

  const [state, send] = useMachine(fileUpload.machine({ id: useId() }))

  const api = fileUpload.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="file-upload-root">
      <div
        {...api.getDropzoneProps()}
        className="dropzone"
      >
        <input {...api.getHiddenInputProps()} />
        <div className="dropzone-content">
          <div className="icon-container">
            <div className="upload-icon"></div>
          </div>
          <p className="dropzone-text">Drag and drop files here</p>
          <p className="dropzone-subtext">or</p>
        </div>
        <button
          {...api.getTriggerProps()}
          className="choose-files-btn"
        >
          Choose Files
        </button>
      </div>

      <ul
        {...api.getItemGroupProps()}
        className="file-list"
      >
        {api.acceptedFiles.map(file => (
          <li
            key={file.name}
            {...api.getItemProps({ file })}
            className="file-item"
          >
            <div className="file-item-info">
              <div className="file-icon-container">
                <div className="file-icon"></div>
              </div>
              <div
                {...api.getItemNameProps({ file })}
                className="file-name"
              >
                {file.name}
              </div>
            </div>
            <button
              {...api.getItemDeleteTriggerProps({ file })}
              className="delete-btn"
            >
              <div className="delete-icon"></div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
