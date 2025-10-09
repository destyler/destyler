import CheckboxExample from '@component/checkbox/snippets/Checkbox.react.tsx'
import CollapseExample from '@component/collapse/snippets/Collapse.react.tsx'
import ColorPickerExample from '@component/color-picker/snippets/ColorPicker.react.tsx'
import ComboboxExample from '@component/combobox/snippets/Combobox.react.tsx'
import DialogExample from '@component/dialog/snippets/Dialog.react.tsx'
import FloatingPanelExample from '@component/floating-panel/snippets/FloatingPanel.react.tsx'
import HoverCardExample from '@component/hover-card/snippets/HoverCard.react.tsx'
import ImageExample from '@component/image/snippets/Image.react.tsx'
import DropdownExample from '@component/menu/snippets/menu/Menu.react.tsx'
import NumberInputExample from '@component/number-input/snippets/NumberInput.react.tsx'
import PaginationExample from '@component/pagination/snippets/Pagination.react.tsx'
import PopoverExample from '@component/popover/snippets/Popover.react.tsx'
import ProgressExample from '@component/progress/snippets/Progress.react.tsx'
import RadioExample from '@component/radio/snippets/Radio.react.tsx'
import SelectExample from '@component/select/snippets/Select.react.tsx'
import SliderExample from '@component/slider/snippets/Slider.react.tsx'
import StepsExample from '@component/steps/snippets/Steps.react.tsx'
import SwitchExample from '@component/switch/snippets/Switch.react.tsx'
import TabsExample from '@component/tabs/snippets/Tabs.react.tsx'
import TimerExample from '@component/timer/snippets/Timer.react.tsx'
import TreeExample from '@component/tree/snippets/Tree.react.tsx'
import { useEffect, useRef, useState } from 'react'

export default function ReactDemo() {
  const [show, setShow] = useState(false)
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      refs.current.forEach((element) => {
        if (!element)
          return
        element.style.animationFillMode = 'forwards'
        element.style.transformOrigin = 'center'
        element.style.animationDuration = '1s'
      })
    }, 101)
    return () => clearTimeout(timer)
  }, [])

  if (!show)
    return null

  return (
    <div className="mt-0! py-24 sm:py-32 hidden lg:block !pt-12 bg-gradient-to-b from-background/900 to-background/950">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col mt-0!">
        <div className="flex flex-col lg:grid gap-8 relative lg:grid-cols-10 lg:gap-8 overflow-hidden p-px mt-0!">
          <div ref={(el) => { refs.current[1] = el }} data-layout="sinppets" className="mt-0! col-span-8 flex items-center homeDemoAnimateTop p-10px">
            <SliderExample className="w-full!" />
          </div>

          <div ref={(el) => { refs.current[2] = el }} data-layout="sinppets" className="mt-0! col-span-2 row-span-2 flex items-center homeDemoAnimateRight">
            <RadioExample />
          </div>

          <div ref={(el) => { refs.current[4] = el }} data-layout="sinppets" className="col-span-1 homeDemoAnimateLeft z-10 mt-0!">
            <DropdownExample />
          </div>

          <div ref={(el) => { refs.current[3] = el }} data-layout="sinppets" className="col-span-7 flex flex-wrap mt-0! items-center justify-between gap-1 homeDemoAnimateBottom">
            <ImageExample />
            <HoverCardExample />
            <FloatingPanelExample />
            <SwitchExample />
            <PaginationExample />
          </div>

          <div ref={(el) => { refs.current[5] = el }} data-layout="sinppets" className="mt-0! col-span-3 row-span-8 gap-6 flex flex-col justify-between homeDemoAnimateLeft">
            <div className="flex justify-between items-center mt-0!" data-layout="sinppets">
              <TimerExample />
              <ColorPickerExample />
            </div>
            <div className="flex justify-between items-center mt-0!" data-layout="sinppets">
              <DialogExample />
              <PopoverExample />
            </div>
            <TabsExample />
          </div>

          <div ref={(el) => { refs.current[6] = el }} data-layout="sinppets" className="col-span-5 row-span-2 flex flex-col homeDemoAnimateBottom">
            <ProgressExample />
            <CollapseExample />
          </div>

          <div ref={(el) => { refs.current[7] = el }} data-layout="sinppets" className="col-span-2 row-span-2 gap-6 flex flex-col homeDemoAnimateRight z-10">
            <CheckboxExample />
            <ComboboxExample />
            <SelectExample />
            <NumberInputExample />
          </div>

          <div ref={(el) => { refs.current[8] = el }} className="col-span-7 row-span-6 flex flex-wrap items-center justify-between gap-0 homeDemoAnimateBottom">
            <div className="flex-shrink-0" data-layout="sinppets">
              <TreeExample />
            </div>
            <div className="flex-1" data-layout="sinppets">
              <StepsExample className="w-full!" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
