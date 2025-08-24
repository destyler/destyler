<script lang="ts">
  import { onMount } from 'svelte'
  import CheckboxExample from '../../snippets/checkbox/Checkbox.svelte'
  import CollapseExample from '../../snippets/collapse/Collapse.svelte' 
  import ColorPickerExample from '../../snippets/color-picker/ColorPicker.svelte'
  import ComboboxExample from '../../snippets/combobox/Combobox.svelte'
  import DialogExample from '../../snippets/dialog/Dialog.svelte'
  import FloatingPanelExample from '../../snippets/floating-panel/FloatingPanel.svelte'
  import HoverCardExample from '../../snippets/hover-card/HoverCard.svelte'
  import ImageExample from '../../snippets/image/Image.svelte'
  import DropdownExample from '../../snippets/menu/Menu.svelte'
  import NumberInputExample from '../../snippets/number-input/NumberInput.svelte'
  import PaginationExample from '../../snippets/pagination/Pagination.svelte'
  import PopoverExample from '../../snippets/popover/Popover.svelte'
  import ProgressExample from '../../snippets/progress/Progress.svelte'
  import RadioExample from '../../snippets/radio/Radio.svelte'
  import SelectExample from '../../snippets/select/Select.svelte'
  import SliderExample from '../../snippets/slider/Slider.svelte'
  import StepsExample from '../../snippets/steps/Steps.svelte'
  import SwitchExample from '../../snippets/switch/Switch.svelte'
  import TabsExample from '../../snippets/tabs/Tabs.svelte'
  import TimerExample from '../../snippets/timer/Timer.svelte'
  import TreeExample from '../../snippets/tree/Tree.svelte'

  let refs: HTMLElement[] = []
  let show = false

  onMount(() => {
    setTimeout(() => {
      show = true
    }, 100)

    setTimeout(() => {
      refs.forEach(element => {
        if (!element) return
        element.style.animationFillMode = 'forwards'
        element.style.transformOrigin = 'center'
        element.style.animationDuration = '1s'
      })
    }, 101)
  })
</script>

{#if show}
<div class="mt-0! py-24 sm:py-32 hidden lg:block !pt-12 bg-gradient-to-b from-background/900 to-background/950">
  <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col mt-0!">
    <div class="flex flex-col lg:grid gap-8 relative lg:grid-cols-10 lg:gap-8 overflow-hidden p-px mt-0!">
      <div bind:this={refs[1]} class="mt-0! col-span-8 flex items-center homeDemoAnimateTop p-10px">
        <SliderExample />
      </div>

      <div bind:this={refs[2]} class="mt-0! col-span-2 row-span-2 flex items-center homeDemoAnimateRight">
        <RadioExample />
      </div>

      <div bind:this={refs[4]} class="col-span-1 homeDemoAnimateLeft z-10 mt-0!">
        <DropdownExample />
      </div>

      <div bind:this={refs[3]} class="col-span-7 flex flex-wrap mt-0! items-center justify-between gap-1 homeDemoAnimateBottom">
        <ImageExample />
        <HoverCardExample />
        <FloatingPanelExample />
        <SwitchExample />
        <PaginationExample />
      </div>

      <div bind:this={refs[5]} class="mt-0! col-span-3 row-span-8 gap-6 flex flex-col justify-between homeDemoAnimateLeft">
        <div class="flex justify-between items-center mt-0!">
          <TimerExample />
          <ColorPickerExample />
        </div>
        <div class="flex justify-between items-center mt-0!">
          <DialogExample />
          <PopoverExample />
        </div>
        <TabsExample />
      </div>

      <div bind:this={refs[6]} class="col-span-5 row-span-2 flex flex-col homeDemoAnimateBottom">
        <ProgressExample />
        <CollapseExample />
      </div>

      <div bind:this={refs[7]} class="col-span-2 row-span-2 gap-6 flex flex-col homeDemoAnimateRight z-10">
        <CheckboxExample />
        <ComboboxExample />
        <SelectExample />
        <NumberInputExample />
      </div>

      <div bind:this={refs[8]} class="col-span-7 row-span-6 flex flex-wrap items-center justify-between gap-1 homeDemoAnimateBottom">
        <div class="flex-shrink-0">
          <TreeExample />
        </div>
        <div class="flex-1">
          <StepsExample className="w-full!" />
        </div>
      </div>
    </div>
  </div>
</div>
{/if}
