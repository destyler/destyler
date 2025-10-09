<script lang="ts">
  import { onMount } from 'svelte'
  import CheckboxExample from '@component/checkbox/snippets/Checkbox.svelte'
  import CollapseExample from '@component/collapse/snippets/Collapse.svelte'
  import ColorPickerExample from '@component/color-picker/snippets/ColorPicker.svelte'
  import ComboboxExample from '@component/combobox/snippets/Combobox.svelte'
  import DialogExample from '@component/dialog/snippets/Dialog.svelte'
  import FloatingPanelExample from '@component/floating-panel/snippets/FloatingPanel.svelte'
  import HoverCardExample from '@component/hover-card/snippets/HoverCard.svelte'
  import ImageExample from '@component/image/snippets/Image.svelte'
  import DropdownExample from '@component/menu/snippets/menu/Menu.svelte'
  import NumberInputExample from '@component/number-input/snippets/NumberInput.svelte'
  import PaginationExample from '@component/pagination/snippets/Pagination.svelte'
  import PopoverExample from '@component/popover/snippets/Popover.svelte'
  import ProgressExample from '@component/progress/snippets/Progress.svelte'
  import RadioExample from '@component/radio/snippets/Radio.svelte'
  import SelectExample from '@component/select/snippets/Select.svelte'
  import SliderExample from '@component/slider/snippets/Slider.svelte'
  import StepsExample from '@component/steps/snippets/Steps.svelte'
  import SwitchExample from '@component/switch/snippets/Switch.svelte'
  import TabsExample from '@component/tabs/snippets/Tabs.svelte'
  import TimerExample from '@component/timer/snippets/Timer.svelte'
  import TreeExample from '@component/tree/snippets/Tree.svelte'

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
      <div bind:this={refs[1]} class="mt-0! col-span-8 flex items-center homeDemoAnimateTop p-10px" data-layout="sinppets">
        <SliderExample />
      </div>

      <div bind:this={refs[2]} class="mt-0! col-span-2 row-span-2 flex items-center homeDemoAnimateRight" data-layout="sinppets">
        <RadioExample />
      </div>

      <div bind:this={refs[4]} class="col-span-1 homeDemoAnimateLeft z-10 mt-0!" data-layout="sinppets">
        <DropdownExample />
      </div>

      <div bind:this={refs[3]} class="col-span-7 flex flex-wrap mt-0! items-center justify-between gap-1 homeDemoAnimateBottom" data-layout="sinppets">
        <ImageExample />
        <HoverCardExample />
        <FloatingPanelExample />
        <SwitchExample />
        <PaginationExample />
      </div>

      <div bind:this={refs[5]} class="mt-0! col-span-3 row-span-8 gap-6 flex flex-col justify-between homeDemoAnimateLeft" data-layout="sinppets">
        <div class="flex justify-between items-center mt-0!" data-layout="sinppets">
          <TimerExample />
          <ColorPickerExample />
        </div>
        <div class="flex justify-between items-center mt-0!" data-layout="sinppets">
          <DialogExample />
          <PopoverExample />
        </div>
        <TabsExample />
      </div>

      <div bind:this={refs[6]} class="col-span-5 row-span-2 flex flex-col homeDemoAnimateBottom" data-layout="sinppets">
        <ProgressExample />
        <CollapseExample />
      </div>

      <div bind:this={refs[7]} class="col-span-2 row-span-2 gap-6 flex flex-col homeDemoAnimateRight z-10" data-layout="sinppets">
        <CheckboxExample />
        <ComboboxExample />
        <SelectExample />
        <NumberInputExample />
      </div>

      <div bind:this={refs[8]} class="col-span-7 row-span-6 flex flex-wrap items-center justify-between gap-1 homeDemoAnimateBottom">
        <div class="flex-shrink-0" data-layout="sinppets">
          <TreeExample />
        </div>
        <div class="flex-1" data-layout="sinppets">
          <StepsExample className="w-full!" />
        </div>
      </div>
    </div>
  </div>
</div>
{/if}
