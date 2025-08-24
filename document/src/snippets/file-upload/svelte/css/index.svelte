<script lang="ts">
  import * as fileUpload from "@destyler/file-upload"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import './index.css'

  const id = $props.id()

  const [state, send] = useMachine(fileUpload.machine({ id }))

  const api = $derived(fileUpload.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="file-upload-root">
  <div
    {...api.getDropzoneProps()}
    class="dropzone"
  >
    <input {...api.getHiddenInputProps()} />
    <div class="dropzone-content">
      <div class="icon-container">
        <div class="upload-icon"></div>
      </div>
      <p class="dropzone-text">Drag and drop files here</p>
      <p class="dropzone-subtext">or</p>
    </div>
    <button
      {...api.getTriggerProps()}
      class="choose-files-btn"
    >
      Choose Files
    </button>
  </div>

  <ul
    {...api.getItemGroupProps()}
    class="file-list"
  >
    {#each api.acceptedFiles as file (file.name)}
      <li
        {...api.getItemProps({ file })}
        class="file-item"
      >
        <div class="file-item-info">
          <div class="file-icon-container">
            <div class="file-icon"></div>
          </div>
          <div
            {...api.getItemNameProps({ file })}
            class="file-name"
          >
            {file.name}
          </div>
        </div>
        <button
          {...api.getItemDeleteTriggerProps({ file })}
          class="delete-btn"
        >
          <div class="delete-icon"></div>
        </button>
      </li>
    {/each}
  </ul>
</div>
