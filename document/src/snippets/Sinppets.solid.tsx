/** @jsxImportSource solid-js */
import type { Component } from 'solid-js'
import AspectRatio from '@component/aspect-ratio/docs/snippets/aspect-ratio/AspectRatio.solid.tsx'
import Breadcrumbs from '@component/breadcrumbs/docs/snippets/breadcrumbs/Breadcrumbs.solid.tsx'
import Carousel from '@component/carousel/docs/snippets/carousel/Carousel.solid.tsx'
import Checkbox from '@component/checkbox/docs/snippets/checkbox/Checkbox.solid.tsx'
import Clipboard from '@component/clipboard/docs/snippets/clipboard/Clipboard.solid.tsx'
import Collapse from '@component/collapse/docs/snippets/collapse/Collapse.solid.tsx'
import Collapsible from '@component/collapsible/docs/snippets/collapsible/Collapsible.solid.tsx'
import ColorPicker from '@component/color-picker/docs/snippets/color-picker/ColorPicker.solid.tsx'
import Combobox from '@component/combobox/docs/snippets/combobox/Combobox.solid.tsx'
import ContentMenu from '@component/menu/docs/snippets/content-menu/ContentMenu.solid.tsx'
import Dialog from '@component/dialog/docs/snippets/dialog/Dialog.solid.tsx'
import Dynamic from '@component/dynamic/docs/snippets/dynamic/Dynamic.solid.tsx'
import Edit from '@component/edit/docs/snippets/edit/Edit.solid.tsx'
import FileUpload from '@component/file-upload/docs/snippets/file-upload/FileUpload.solid.tsx'
import HoverCard from '@component/hover-card/docs/snippets/hover-card/HoverCard.solid.tsx'
import Image from '@component/image/docs/snippets/image/Image.solid.tsx'
import Label from '@component/label/docs/snippets/label/Label.solid.tsx'
import Menu from '@component/menu/docs/snippets/menu/Menu.solid.tsx'
import NumberInput from '@component/number-input/docs/snippets/number-input/NumberInput.solid.tsx'
import OtpInput from '@component/otp-input/docs/snippets/otpInput/OtpInput.solid.tsx'
import Pagination from '@component/pagination/docs/snippets/pagination/Pagination.solid.tsx'
import Popover from '@component/popover/docs/snippets/popover/Popover.solid.tsx'
import Progress from '@component/progress/docs/snippets/progress/Progress.solid.tsx'
import QrCode from '@component/qr-code/docs/snippets/qr-code/QRCode.solid.tsx'
import Radio from '@component/radio/docs/snippets/radio/Radio.solid.tsx'
import Select from '@component/select/docs/snippets/select/Select.solid.tsx'
import Separator from '@component/separator/docs/snippets/separator/Separator.solid.tsx'
import Signature from '@component/signature/docs/snippets/signature/Signature.solid.tsx'
import Slider from '@component/slider/docs/snippets/slider/Slider.solid.tsx'
import Splitter from '@component/splitter/docs/snippets/splitter/Splitter.solid.tsx'
import Steps from '@component/steps/docs/snippets/steps/Steps.solid.tsx'
import Switch from '@component/switch/docs/snippets/switch/Switch.solid.tsx'
import Tabs from '@component/tabs/docs/snippets/tabs/Tabs.solid.tsx'
import Timer from '@component/timer/docs/snippets/timer/Timer.solid.tsx'
import ToggleGroup from '@component/toggle/docs/snippets/toggleGroup/ToggleGroup.solid.tsx'
import Tooltip from '@component/tooltip/docs/snippets/tooltip/Tooltip.solid.tsx'
import Tree from '@component/tree/docs/snippets/tree/Tree.solid.tsx'

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
