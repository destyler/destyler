import AspectRatio from './aspect-ratio/AspectRatio.react.tsx'
import Breadcrumbs from './breadcrumbs/Breadcrumbs.react.tsx'
import Carousel from './carousel/Carousel.react.tsx'
import Checkbox from './checkbox/Checkbox.react.tsx'
import Clipboard from './clipboard/Clipboard.react.tsx'
import Collapse from './collapse/Collapse.react.tsx'
import Collapsible from './collapsible/Collapsible.react.tsx'
import ColorPicker from './color-picker/ColorPicker.react.tsx'
import Combobox from './combobox/Combobox.react.tsx'
import ContentMenu from './content-menu/ContentMenu.react.tsx'
import Dialog from './dialog/Dialog.react.tsx'
import Dynamic from './dynamic/Dynamic.react.tsx'
import Edit from './edit/Edit.react.tsx'
import FileUpload from './file-upload/FileUpload.react.tsx'
import HoverCard from './hover-card/HoverCard.react.tsx'
import Image from './image/Image.react.tsx'
import Label from './label/Label.react.tsx'
import Menu from './menu/Menu.react.tsx'
import NumberInput from './number-input/NumberInput.react.tsx'
import OtpInput from './otpInput/OTPInput.react.tsx'
import Pagination from './pagination/Pagination.react.tsx'
import Popover from './popover/Popover.react.tsx'
import Progress from './progress/Progress.react.tsx'
import QrCode from './qr-code/QRCode.react.tsx'
import Radio from './radio/Radio.react.tsx'
import Select from './select/Select.react.tsx'
import Separator from './separator/Separator.react.tsx'
import Signature from './signature/Signature.react.tsx'
import Slider from './slider/Slider.react.tsx'
import Splitter from './splitter/Splitter.react.tsx'
import Steps from './steps/Steps.react.tsx'
import Switch from './switch/Switch.react.tsx'
import Tabs from './tabs/Tabs.react.tsx'
import Timer from './timer/Timer.react.tsx'
import ToggleGroup from './toggleGroup/ToggleGroup.react.tsx'
import Tooltip from './tooltip/Tooltip.react.tsx'
import Tree from './tree/Tree.react.tsx'

interface SnippetsProps {
  name: string
}

export default function Snippets({ name }: SnippetsProps) {
  return (
    <div data-layout="sinppets" className="min-w-150px flex justify-center items-center mt-0!">
      {name === 'checkbox' && <Checkbox />}
      {name === 'collapse' && <Collapse className="w-450px!" />}
      {name === 'combobox' && <Combobox />}
      {name === 'dynamic' && <Dynamic />}
      {name === 'label' && <Label />}
      {name === 'otpInput' && <OtpInput />}
      {name === 'radio' && <Radio />}
      {name === 'select' && <Select />}
      {name === 'slider' && <Slider className="w-450px!" />}
      {name === 'switch' && <Switch />}
      {name === 'toggleGroup' && <ToggleGroup />}
      {name === 'qr-code' && <QrCode />}
      {name === 'collapsible' && <Collapsible />}
      {name === 'dialog' && <Dialog />}
      {name === 'image' && <Image />}
      {name === 'hover-card' && <HoverCard />}
      {name === 'aspect-ratio' && <AspectRatio />}
      {name === 'breadcrumbs' && <Breadcrumbs />}
      {name === 'carousel' && <Carousel />}
      {name === 'clipboard' && <Clipboard />}
      {name === 'color-picker' && <ColorPicker />}
      {name === 'separator' && <Separator />}
      {name === 'edit' && <Edit />}
      {name === 'file-upload' && <FileUpload />}
      {name === 'menu' && <Menu />}
      {name === 'content-menu' && <ContentMenu />}
      {name === 'number-input' && <NumberInput />}
      {name === 'pagination' && <Pagination />}
      {name === 'popover' && <Popover />}
      {name === 'progress' && <Progress className="w-450px!" />}
      {name === 'signature' && <Signature />}
      {name === 'splitter' && <Splitter />}
      {name === 'steps' && <Steps className="w-450px!" />}
      {name === 'tabs' && <Tabs />}
      {name === 'timer' && <Timer />}
      {name === 'tooltip' && <Tooltip />}
      {name === 'tree' && <Tree />}
    </div>
  )
}
