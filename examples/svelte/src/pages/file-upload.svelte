<script lang="ts">
  import * as fileUpload from "@destyler/file-upload"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import { fileUploadControls } from '@destyler/shared-private'
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const controls = useControls(fileUploadControls)

  const id = $props.id()

  const [state, send] = useMachine(fileUpload.machine({ id }), {
    context: controls.context,
  })

  const api = $derived(fileUpload.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="max-w-2xl p-6">
  <div
    {...api.getDropzoneProps()}
    class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-800 transition-colors cursor-pointer bg-gray-50 data-[dragging]:bg-gray-100"
  >
    <input {...api.getHiddenInputProps()} />
    <p class="text-gray-600">Drag and drop your files here</p>
    <p class="text-sm text-gray-400 mt-2">or</p>
    <button
      {...api.getTriggerProps()}
      class="mt-4 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors"
    >
      Choose Files...
    </button>
  </div>

  <ul
    {...api.getItemGroupProps()}
    class="mt-6 space-y-3"
  >
    {#each api.acceptedFiles as file (file.name)}
      <li
        {...api.getItemProps({ file })}
        class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div
          {...api.getItemNameProps({ file })}
          class="text-gray-700 truncate"
        >
          {file.name}
        </div>
        <button
          {...api.getItemDeleteTriggerProps({ file })}
          class="ml-4 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          Delete
        </button>
      </li>
    {/each}
  </ul>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
