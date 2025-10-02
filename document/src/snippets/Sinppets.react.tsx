import AspectRatio from '@component-docs/aspect-ratio/docs/snippets/aspect-ratio/AspectRatio.react.tsx'
import Breadcrumbs from '@component-docs/breadcrumbs/docs/snippets/breadcrumbs/Breadcrumbs.react.tsx'
import Carousel from '@component-docs/carousel/docs/snippets/carousel/Carousel.react.tsx'
import Checkbox from '@component-docs/checkbox/docs/snippets/checkbox/Checkbox.react.tsx'
import Clipboard from '@component-docs/clipboard/docs/snippets/clipboard/Clipboard.react.tsx'
import Collapse from '@component-docs/collapse/docs/snippets/collapse/Collapse.react.tsx'
import Collapsible from '@component-docs/collapsible/docs/snippets/collapsible/Collapsible.react.tsx'
import ColorPicker from '@component-docs/color-picker/docs/snippets/color-picker/ColorPicker.react.tsx'
import Combobox from '@component-docs/combobox/docs/snippets/combobox/Combobox.react.tsx'
import Dialog from '@component-docs/dialog/docs/snippets/dialog/Dialog.react.tsx'
import Dynamic from '@component-docs/dynamic/docs/snippets/dynamic/Dynamic.react.tsx'
import Edit from '@component-docs/edit/docs/snippets/edit/Edit.react.tsx'
import FileUpload from '@component-docs/file-upload/docs/snippets/file-upload/FileUpload.react.tsx'
import HoverCard from '@component-docs/hover-card/docs/snippets/hover-card/HoverCard.react.tsx'
import Image from '@component-docs/image/docs/snippets/image/Image.react.tsx'
import Label from '@component-docs/label/docs/snippets/label/Label.react.tsx'
import ContentMenu from '@component-docs/menu/docs/snippets/content-menu/ContentMenu.react.tsx'
import Menu from '@component-docs/menu/docs/snippets/menu/Menu.react.tsx'
import NumberInput from '@component-docs/number-input/docs/snippets/number-input/NumberInput.react.tsx'
import OtpInput from '@component-docs/otp-input/docs/snippets/otpInput/OtpInput.react.tsx'
import Pagination from '@component-docs/pagination/docs/snippets/pagination/Pagination.react.tsx'
import Popover from '@component-docs/popover/docs/snippets/popover/Popover.react.tsx'
import Progress from '@component-docs/progress/docs/snippets/progress/Progress.react.tsx'
import QrCode from '@component-docs/qr-code/docs/snippets/qr-code/QRCode.react.tsx'
import Radio from '@component-docs/radio/docs/snippets/radio/Radio.react.tsx'
import Select from '@component-docs/select/docs/snippets/select/Select.react.tsx'
import Separator from '@component-docs/separator/docs/snippets/separator/Separator.react.tsx'
import Signature from '@component-docs/signature/docs/snippets/signature/Signature.react.tsx'
import Slider from '@component-docs/slider/docs/snippets/slider/Slider.react.tsx'
import Splitter from '@component-docs/splitter/docs/snippets/splitter/Splitter.react.tsx'
import Steps from '@component-docs/steps/docs/snippets/steps/Steps.react.tsx'
import Switch from '@component-docs/switch/docs/snippets/switch/Switch.react.tsx'
import Tabs from '@component-docs/tabs/docs/snippets/tabs/Tabs.react.tsx'
import Timer from '@component-docs/timer/docs/snippets/timer/Timer.react.tsx'
import ToggleGroup from '@component-docs/toggle/docs/snippets/toggleGroup/ToggleGroup.react.tsx'
import Tooltip from '@component-docs/tooltip/docs/snippets/tooltip/Tooltip.react.tsx'
import Tree from '@component-docs/tree/docs/snippets/tree/Tree.react.tsx'

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
