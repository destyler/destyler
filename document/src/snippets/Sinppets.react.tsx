import AspectRatio from '@component/aspect-ratio/snippets/AspectRatio.react.tsx'
import Breadcrumbs from '@component/aspect-ratio/snippets/Breadcrumbs.react.tsx'
import Carousel from '@component/aspect-ratio/snippets/Carousel.react.tsx'
import Checkbox from '@component/aspect-ratio/snippets/Checkbox.react.tsx'
import Clipboard from '@component/aspect-ratio/snippets/Clipboard.react.tsx'
import Collapse from '@component/aspect-ratio/snippets/Collapse.react.tsx'
import Collapsible from '@component/aspect-ratio/snippets/Collapsible.react.tsx'
import ColorPicker from '@component/aspect-ratio/snippets/ColorPicker.react.tsx'
import Combobox from '@component/aspect-ratio/snippets/Combobox.react.tsx'
import ContentMenu from '@component/aspect-ratio/snippets/ContentMenu.react.tsx'
import Dialog from '@component/aspect-ratio/snippets/Dialog.react.tsx'
import Dynamic from '@component/aspect-ratio/snippets/Dynamic.react.tsx'
import Edit from '@component/aspect-ratio/snippets/Edit.react.tsx'
import FileUpload from '@component/aspect-ratio/snippets/FileUpload.react.tsx'
import HoverCard from '@component/aspect-ratio/snippets/HoverCard.react.tsx'
import Image from '@component/aspect-ratio/snippets/Image.react.tsx'
import Label from '@component/aspect-ratio/snippets/Label.react.tsx'
import Menu from '@component/aspect-ratio/snippets/Menu.react.tsx'
import NumberInput from '@component/aspect-ratio/snippets/NumberInput.react.tsx'
import OtpInput from '@component/aspect-ratio/snippets/OtpInput.react.tsx'
import Pagination from '@component/aspect-ratio/snippets/Pagination.react.tsx'
import Popover from '@component/aspect-ratio/snippets/Popover.react.tsx'
import Progress from '@component/aspect-ratio/snippets/Progress.react.tsx'
import QrCode from '@component/aspect-ratio/snippets/QRCode.react.tsx'
import Radio from '@component/aspect-ratio/snippets/Radio.react.tsx'
import Select from '@component/aspect-ratio/snippets/Select.react.tsx'
import Separator from '@component/aspect-ratio/snippets/Separator.react.tsx'
import Signature from '@component/aspect-ratio/snippets/Signature.react.tsx'
import Slider from '@component/aspect-ratio/snippets/Slider.react.tsx'
import Splitter from '@component/aspect-ratio/snippets/Splitter.react.tsx'
import Steps from '@component/aspect-ratio/snippets/Steps.react.tsx'
import Switch from '@component/aspect-ratio/snippets/Switch.react.tsx'
import Tabs from '@component/aspect-ratio/snippets/Tabs.react.tsx'
import Timer from '@component/aspect-ratio/snippets/Timer.react.tsx'
import ToggleGroup from '@component/aspect-ratio/snippets/ToggleGroup.react.tsx'
import Tooltip from '@component/aspect-ratio/snippets/Tooltip.react.tsx'
import Tree from '@component/aspect-ratio/snippets/Tree.react.tsx'

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
