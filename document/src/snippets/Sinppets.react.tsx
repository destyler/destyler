import AspectRatio from '@component/aspect-ratio/snippets/AspectRatio.react.tsx'
import Breadcrumbs from '@component/breadcrumbs/snippets/Breadcrumbs.react.tsx'
import Carousel from '@component/carousel/snippets/Carousel.react.tsx'
import Checkbox from '@component/checkbox/snippets/Checkbox.react.tsx'
import Clipboard from '@component/clipboard/snippets/Clipboard.react.tsx'
import Collapse from '@component/collapse/snippets/Collapse.react.tsx'
import Collapsible from '@component/collapsible/snippets/Collapsible.react.tsx'
import ColorPicker from '@component/color-picker/snippets/ColorPicker.react.tsx'
import Combobox from '@component/combobox/snippets/Combobox.react.tsx'
import Dialog from '@component/dialog/snippets/Dialog.react.tsx'
import Dynamic from '@component/dynamic/snippets/Dynamic.react.tsx'
import Edit from '@component/edit/snippets/Edit.react.tsx'
import FileUpload from '@component/file-upload/snippets/FileUpload.react.tsx'
import HoverCard from '@component/hover-card/snippets/HoverCard.react.tsx'
import Image from '@component/image/snippets/Image.react.tsx'
import Label from '@component/label/snippets/Label.react.tsx'
import ContentMenu from '@component/menu/snippets/content-menu/ContentMenu.react.tsx'
import Menu from '@component/menu/snippets/menu/Menu.react.tsx'
import NumberInput from '@component/number-input/snippets/NumberInput.react.tsx'
import OtpInput from '@component/otp-input/snippets/OtpInput.react.tsx'
import Pagination from '@component/pagination/snippets/Pagination.react.tsx'
import Popover from '@component/popover/snippets/Popover.react.tsx'
import Progress from '@component/progress/snippets/Progress.react.tsx'
import QrCode from '@component/qr-code/snippets/QRCode.react.tsx'
import Radio from '@component/radio/snippets/Radio.react.tsx'
import Select from '@component/select/snippets/Select.react.tsx'
import Separator from '@component/separator/snippets/Separator.react.tsx'
import Signature from '@component/signature/snippets/Signature.react.tsx'
import Slider from '@component/slider/snippets/Slider.react.tsx'
import Splitter from '@component/splitter/snippets/Splitter.react.tsx'
import Steps from '@component/steps/snippets/Steps.react.tsx'
import Switch from '@component/switch/snippets/Switch.react.tsx'
import Tabs from '@component/tabs/snippets/Tabs.react.tsx'
import Timer from '@component/timer/snippets/Timer.react.tsx'
import Toggle from '@component/toggle/snippets/Toggle.react.tsx'
import Tooltip from '@component/tooltip/snippets/Tooltip.react.tsx'
import Tree from '@component/tree/snippets/Tree.react.tsx'

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
      {name === 'toggle' && <Toggle />}
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
