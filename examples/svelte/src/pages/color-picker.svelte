<script lang="ts">
  import * as colorPicker from '@destyler/color-picker'
  import { colorPickerControls } from '@destyler/shared-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(colorPickerControls)
  const id = $props.id()

  const [state, send] = useMachine(colorPicker.machine({
    id,
    value: colorPicker.parse('hsl(0, 100%, 50%)'),
  }), {
    context: controls.context,
  })

  const api = $derived(colorPicker.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="p-4">
  <label {...api.getLabelProps()} class="block mb-2 text-lg font-medium text-gray-700">
    Select Color: {api.valueAsString}
  </label>
  <input {...api.getHiddenInputProps()}>
  <div {...api.getControlProps()} class="flex items-center gap-4 mb-4">
    <button {...api.getTriggerProps()} class="relative flex justify-center items-center w-24 h-24 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div {...api.getTransparencyGridProps({ size: '10px' })} class="absolute inset-0" ></div>
      <div {...api.getSwatchProps({ value: api.value })} class="absolute inset-0 w-22 h-22 bg-[--color] rounded-md" ></div>
    </button>
    <div class="flex flex-col gap-2">
      <input
        {...api.getChannelInputProps({ channel: 'hex' })}
        class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      <input
        {...api.getChannelInputProps({ channel: 'alpha' })}
        class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
    </div>
  </div>

  <div {...api.getPositionerProps()} class="fixed mt-2 z-50 border border-gray/40 rounded-md">
    <div {...api.getContentProps()} class="p-4 bg-white rounded-lg shadow-xl">
      <div {...api.getAreaProps()} class="relative w-64 h-40 mb-4">
        <div {...api.getAreaBackgroundProps()} class="absolute inset-0 rounded-lg w-full h-full" ></div>
        <div {...api.getAreaThumbProps()} class="absolute w-4 h-4 -translate-x-2 -translate-y-2 border-2 border-white rounded-full shadow-md cursor-pointer" ></div>
      </div>

      <div {...api.getChannelSliderProps({ channel: 'hue' })} class="relative h-5 mb-4">
        <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} class="absolute inset-0 rounded-md h-full" ></div>
        <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} class="absolute w-3 h-5 -translate-x-1.5 bg-white rounded-sm shadow-md cursor-pointer" ></div>
      </div>

      <div {...api.getChannelSliderProps({ channel: 'alpha' })} class="relative h-5">
        <div {...api.getTransparencyGridProps({ size: '12px' })} class="absolute inset-0 rounded-md" ></div>
        <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} class="absolute inset-0 rounded-md h-full" ></div>
        <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} class="absolute w-3 h-5 -translate-x-1.5 bg-white rounded-sm shadow-md cursor-pointer" ></div>
      </div>
    </div>
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
