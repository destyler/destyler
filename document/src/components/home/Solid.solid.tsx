/** @jsxImportSource solid-js */
import CheckboxExample from '@component/checkbox/snippets/Checkbox.solid.tsx'
import CollapseExample from '@component/collapse/snippets/Collapse.solid.tsx'
import ColorPickerExample from '@component/color-picker/snippets/ColorPicker.solid.tsx'
import ComboboxExample from '@component/combobox/snippets/Combobox.solid.tsx'
import DialogExample from '@component/dialog/snippets/Dialog.solid.tsx'
import FloatingPanelExample from '@component/floating-panel/snippets/FloatingPanel.solid.tsx'
import HoverCardExample from '@component/hover-card/snippets/HoverCard.solid.tsx'
import ImageExample from '@component/image/snippets/Image.solid.tsx'
import DropdownExample from '@component/menu/snippets/menu/Menu.solid.tsx'
import NumberInputExample from '@component/number-input/snippets/NumberInput.solid.tsx'
import PaginationExample from '@component/pagination/snippets/Pagination.solid.tsx'
import PopoverExample from '@component/popover/snippets/Popover.solid.tsx'
import ProgressExample from '@component/progress/snippets/Progress.solid.tsx'
import RadioExample from '@component/radio/snippets/Radio.solid.tsx'
import SelectExample from '@component/select/snippets/Select.solid.tsx'
import SliderExample from '@component/slider/snippets/Slider.solid.tsx'
import StepsExample from '@component/steps/snippets/Steps.solid.tsx'
import SwitchExample from '@component/switch/snippets/Switch.solid.tsx'
import TabsExample from '@component/tabs/snippets/Tabs.solid.tsx'
import TimerExample from '@component/timer/snippets/Timer.solid.tsx'
import TreeExample from '@component/tree/snippets/Tree.solid.tsx'
import { createEffect, createSignal, onCleanup, Show } from 'solid-js'

export default function SolidDemo() {
  const [show, setShow] = createSignal(false)
  const refs: HTMLDivElement[] = []

  createEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, 100)
    onCleanup(() => clearTimeout(timer))
  })

  createEffect(() => {
    const timer = setTimeout(() => {
      refs.forEach((element) => {
        if (!element)
          return
        element.style.animationFillMode = 'forwards'
        element.style.transformOrigin = 'center'
        element.style.animationDuration = '1s'
      })
    }, 101)
    onCleanup(() => clearTimeout(timer))
  })

  return (
    <Show when={show()}>
      <div class="mt-0! py-24 sm:py-32 hidden lg:block !pt-12 bg-gradient-to-b from-background/900 to-background/950">
        <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col mt-0!">
          <div class="flex flex-col lg:grid gap-8 relative lg:grid-cols-10 lg:gap-8 overflow-hidden p-px mt-0!">
            <div ref={el => refs[1] = el} data-layout="sinppets" class="mt-0! col-span-8 flex items-center homeDemoAnimateTop p-10px">
              <SliderExample />
            </div>

            <div ref={el => refs[2] = el} data-layout="sinppets" class="mt-0! col-span-2 row-span-2 flex items-center homeDemoAnimateRight">
              <RadioExample />
            </div>

            <div ref={el => refs[4] = el} data-layout="sinppets" class="col-span-1 homeDemoAnimateLeft z-10 mt-0!">
              <DropdownExample />
            </div>

            <div ref={el => refs[3] = el} data-layout="sinppets" class="col-span-7 flex flex-wrap mt-0! items-center justify-between gap-1 homeDemoAnimateBottom">
              <ImageExample />
              <HoverCardExample />
              <FloatingPanelExample />
              <SwitchExample />
              <PaginationExample />
            </div>

            <div ref={el => refs[5] = el} class="mt-0! col-span-3 row-span-8 gap-6 flex flex-col justify-between homeDemoAnimateLeft" data-layout="sinppets">
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

            <div ref={el => refs[6] = el} data-layout="sinppets" class="col-span-5 row-span-2 flex flex-col homeDemoAnimateBottom">
              <ProgressExample />
              <CollapseExample />
            </div>

            <div ref={el => refs[7] = el} data-layout="sinppets" class="col-span-2 row-span-2 gap-6 flex flex-col homeDemoAnimateRight z-10">
              <CheckboxExample />
              <ComboboxExample />
              <SelectExample />
              <NumberInputExample />
            </div>

            <div ref={el => refs[8] = el} class="col-span-7 row-span-6 flex flex-wrap items-center justify-between gap-1 homeDemoAnimateBottom">
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
    </Show>
  )
}
