/** @jsxImportSource solid-js */
import type { Component } from 'solid-js'
import AspectRatio from '@component/aspect-ratio/snippets/AspectRatio.solid.tsx'
import Breadcrumbs from '@component/aspect-ratio/snippets/Breadcrumbs.solid.tsx'
import Carousel from '@component/aspect-ratio/snippets/Carousel.solid.tsx'
import Checkbox from '@component/aspect-ratio/snippets/Checkbox.solid.tsx'
import Clipboard from '@component/aspect-ratio/snippets/Clipboard.solid.tsx'
import Collapse from '@component/aspect-ratio/snippets/Collapse.solid.tsx'
import Collapsible from '@component/aspect-ratio/snippets/Collapsible.solid.tsx'
import ColorPicker from '@component/aspect-ratio/snippets/ColorPicker.solid.tsx'
import Combobox from '@component/aspect-ratio/snippets/Combobox.solid.tsx'
import ContentMenu from '@component/aspect-ratio/snippets/ContentMenu.solid.tsx'
import Dialog from '@component/aspect-ratio/snippets/Dialog.solid.tsx'
import Dynamic from '@component/aspect-ratio/snippets/Dynamic.solid.tsx'
import Edit from '@component/aspect-ratio/snippets/Edit.solid.tsx'
import FileUpload from '@component/aspect-ratio/snippets/FileUpload.solid.tsx'
import HoverCard from '@component/aspect-ratio/snippets/HoverCard.solid.tsx'
import Image from '@component/aspect-ratio/snippets/Image.solid.tsx'
import Label from '@component/aspect-ratio/snippets/Label.solid.tsx'
import Menu from '@component/aspect-ratio/snippets/Menu.solid.tsx'
import NumberInput from '@component/aspect-ratio/snippets/NumberInput.solid.tsx'
import OtpInput from '@component/aspect-ratio/snippets/OtpInput.solid.tsx'
import Pagination from '@component/aspect-ratio/snippets/Pagination.solid.tsx'
import Popover from '@component/aspect-ratio/snippets/Popover.solid.tsx'
import Progress from '@component/aspect-ratio/snippets/Progress.solid.tsx'
import QrCode from '@component/aspect-ratio/snippets/QRCode.solid.tsx'
import Radio from '@component/aspect-ratio/snippets/Radio.solid.tsx'
import Select from '@component/aspect-ratio/snippets/Select.solid.tsx'
import Separator from '@component/aspect-ratio/snippets/Separator.solid.tsx'
import Signature from '@component/aspect-ratio/snippets/Signature.solid.tsx'
import Slider from '@component/aspect-ratio/snippets/Slider.solid.tsx'
import Splitter from '@component/aspect-ratio/snippets/Splitter.solid.tsx'
import Steps from '@component/aspect-ratio/snippets/Steps.solid.tsx'
import Switch from '@component/aspect-ratio/snippets/Switch.solid.tsx'
import Tabs from '@component/aspect-ratio/snippets/Tabs.solid.tsx'
import Timer from '@component/aspect-ratio/snippets/Timer.solid.tsx'
import ToggleGroup from '@component/aspect-ratio/snippets/ToggleGroup.solid.tsx'
import Tooltip from '@component/aspect-ratio/snippets/Tooltip.solid.tsx'
import Tree from '@component/aspect-ratio/snippets/Tree.solid.tsx'

interface SnippetsProps {
  name: string
}

const Snippets: Component<SnippetsProps> = (props) => {
  return (
    <div data-layout="sinppets" class="min-w-150px flex justify-center items-center mt-0!">
      {props.name === 'checkbox' && <Checkbox />}
      {props.name === 'collapse' && <Collapse className="w-450px!" />}
      {props.name === 'combobox' && <Combobox />}
      {props.name === 'dynamic' && <Dynamic />}
      {props.name === 'label' && <Label />}
      {props.name === 'otpInput' && <OtpInput />}
      {props.name === 'radio' && <Radio />}
      {props.name === 'select' && <Select />}
      {props.name === 'slider' && <Slider className="w-450px!" />}
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
      {props.name === 'progress' && <Progress />}
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
