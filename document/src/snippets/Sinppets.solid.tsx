/** @jsxImportSource solid-js */
import type { Component } from 'solid-js'
import AspectRatio from '@component/aspect-ratio/snippets/AspectRatio.solid.tsx'
import Breadcrumbs from '@component/breadcrumbs/snippets/Breadcrumbs.solid.tsx'
import Calendar from '@component/calendar/snippets/Calendar.solid.tsx'
import Carousel from '@component/carousel/snippets/Carousel.solid.tsx'
import Checkbox from '@component/checkbox/snippets/Checkbox.solid.tsx'
import Clipboard from '@component/clipboard/snippets/Clipboard.solid.tsx'
import Collapse from '@component/collapse/snippets/Collapse.solid.tsx'
import Collapsible from '@component/collapsible/snippets/Collapsible.solid.tsx'
import ColorPicker from '@component/color-picker/snippets/ColorPicker.solid.tsx'
import Combobox from '@component/combobox/snippets/Combobox.solid.tsx'
import Dialog from '@component/dialog/snippets/Dialog.solid.tsx'
import Dynamic from '@component/dynamic/snippets/Dynamic.solid.tsx'
import Edit from '@component/edit/snippets/Edit.solid.tsx'
import FileUpload from '@component/file-upload/snippets/FileUpload.solid.tsx'
import HoverCard from '@component/hover-card/snippets/HoverCard.solid.tsx'
import Image from '@component/image/snippets/Image.solid.tsx'
import Label from '@component/label/snippets/Label.solid.tsx'
import ContentMenu from '@component/menu/snippets/content-menu/ContentMenu.solid.tsx'
import Menu from '@component/menu/snippets/menu/Menu.solid.tsx'
import NumberInput from '@component/number-input/snippets/NumberInput.solid.tsx'
import OtpInput from '@component/otp-input/snippets/OtpInput.solid.tsx'
import Pagination from '@component/pagination/snippets/Pagination.solid.tsx'
import Popover from '@component/popover/snippets/Popover.solid.tsx'
import Progress from '@component/progress/snippets/Progress.solid.tsx'
import QrCode from '@component/qr-code/snippets/QRCode.solid.tsx'
import Radio from '@component/radio/snippets/Radio.solid.tsx'
import Select from '@component/select/snippets/Select.solid.tsx'
import Separator from '@component/separator/snippets/Separator.solid.tsx'
import Signature from '@component/signature/snippets/Signature.solid.tsx'
import Slider from '@component/slider/snippets/Slider.solid.tsx'
import Splitter from '@component/splitter/snippets/Splitter.solid.tsx'
import Steps from '@component/steps/snippets/Steps.solid.tsx'
import Switch from '@component/switch/snippets/Switch.solid.tsx'
import Tabs from '@component/tabs/snippets/Tabs.solid.tsx'
import Timer from '@component/timer/snippets/Timer.solid.tsx'
import Toast from '@component/toast/snippets/Toast.solid.tsx'
import Toggle from '@component/toggle/snippets/Toggle.solid.tsx'
import Tooltip from '@component/tooltip/snippets/Tooltip.solid.tsx'
import Tree from '@component/tree/snippets/Tree.solid.tsx'

interface SnippetsProps {
  name: string
}

const Snippets: Component<SnippetsProps> = (props) => {
  return (
    <div data-layout="sinppets" class="min-w-150px flex justify-center items-center mt-0!">
      {props.name === 'checkbox' && <Checkbox />}
      {props.name === 'collapse' && <Collapse className="w-450px!" />}
      {props.name === 'combobox' && <Combobox />}
      {props.name === 'calendar' && <Calendar />}
      {props.name === 'dynamic' && <Dynamic />}
      {props.name === 'label' && <Label />}
      {props.name === 'otp-input' && <OtpInput />}
      {props.name === 'radio' && <Radio />}
      {props.name === 'select' && <Select />}
      {props.name === 'slider' && <Slider className="w-450px!" />}
      {props.name === 'switch' && <Switch />}
      {props.name === 'toggle' && <Toggle />}
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
      {props.name === 'toast' && <Toast />}
    </div>
  )
}

export default Snippets
