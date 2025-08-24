/** @jsxImportSource solid-js */
import type { Component } from 'solid-js'
import Checkbox from './checkbox/Checkbox.solid.tsx'
import Collapse from './collapse/Collapse.solid.tsx'
import Combobox from './combobox/Combobox.solid.tsx'
import Dynamic from './dynamic/Dynamic.solid.tsx'
import Label from './label/Label.solid.tsx'
import OtpInput from './otpInput/OtpInput.solid.tsx'
import Radio from './radio/Radio.solid.tsx'
import Select from './select/Select.solid.tsx'
import Slider from './slider/Slider.solid.tsx'
import Switch from './switch/Switch.solid.tsx'
import ToggleGroup from './toggleGroup/ToggleGroup.solid.tsx'
import QrCode from './qr-code/QRCode.solid.tsx'
import Collapsible from './collapsible/Collapsible.solid.tsx'
import Dialog from './dialog/Dialog.solid.tsx'
import Image from './image/Image.solid.tsx'
import HoverCard from './hover-card/HoverCard.solid.tsx'
import AspectRatio from './aspect-ratio/AspectRatio.solid.tsx'
import Breadcrumbs from './breadcrumbs/Breadcrumbs.solid.tsx'
import Carousel from './carousel/Carousel.solid.tsx'
import Clipboard from './clipboard/Clipboard.solid.tsx'
import ColorPicker from './color-picker/ColorPicker.solid.tsx'
import Separator from './separator/Separator.solid.tsx'
import Edit from './edit/Edit.solid.tsx'
import FileUpload from './file-upload/FileUpload.solid.tsx'
import Menu from './menu/Menu.solid.tsx'
import ContentMenu from './content-menu/ContentMenu.solid.tsx'
import NumberInput from './number-input/NumberInput.solid.tsx'
import Pagination from './pagination/Pagination.solid.tsx'
import Popover from './popover/Popover.solid.tsx'
import Signature from './signature/Signature.solid.tsx'
import Splitter from './splitter/Splitter.solid.tsx'
import Steps from './steps/Steps.solid.tsx'
import Tabs from './tabs/Tabs.solid.tsx'
import Timer from './timer/Timer.solid.tsx'
import Tooltip from './tooltip/Tooltip.solid.tsx'
import Tree from './tree/Tree.solid.tsx'

interface SnippetsProps {
  name: string
}

const Snippets: Component<SnippetsProps> = (props) => {
  return (
    <div class="min-w-150px flex justify-center items-center mt-0!">
      {props.name === 'checkbox' && <Checkbox />}
      {props.name === 'collapse' && <Collapse className='w-450px!' />}
      {props.name === 'combobox' && <Combobox />}
      {props.name === 'dynamic' && <Dynamic />}
      {props.name === 'label' && <Label />}
      {props.name === 'otpInput' && <OtpInput />}
      {props.name === 'radio' && <Radio />}
      {props.name === 'select' && <Select />}
      {props.name === 'slider' && <Slider className='w-450px!' />}
      {props.name === 'switch' && <Switch />}
      {props.name === 'toggleGroup' && <ToggleGroup />}
      {props.name === 'qr-code' && <QrCode />}
      {props.name === 'collapsible' && <Collapsible />}
      {props.name === 'dialog' && <Dialog />}
      {props.name === 'image' && <Image />}
      {props.name === 'hover-card' && <HoverCard />}
      {props.name === 'aspect-ratio' && <AspectRatio />}
      {props.name === 'breadcrumbs' && <Breadcrumbs />}
      {props.name === 'carousel' && <Carousel />}
      {props.name === 'clipboard' && <Clipboard />}
      {props.name === 'color-picker' && <ColorPicker />}
      {props.name === 'separator' && <Separator />}
      {props.name === 'edit' && <Edit />}
      {props.name === 'file-upload' && <FileUpload />}
      {props.name === 'menu' && <Menu />}
      {props.name === 'content-menu' && <ContentMenu />}
      {props.name === 'number-input' && <NumberInput />}
      {props.name === 'pagination' && <Pagination />}
      {props.name === 'popover' && <Popover />}
      {props.name === 'signature' && <Signature />}
      {props.name === 'splitter' && <Splitter />}
      {props.name === 'steps' && <Steps className="w-450px!" />}
      {props.name === 'tabs' && <Tabs />}
      {props.name === 'timer' && <Timer />}
      {props.name === 'tooltip' && <Tooltip />}
      {props.name === 'tree' && <Tree />}
    </div>
  )
}

export default Snippets
