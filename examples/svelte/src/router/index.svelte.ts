import AspectRatio from '../pages/aspect-ratio.svelte'
import Breadcrumbs from '../pages/breadcrumbs.svelte'
import Calendar from '../pages/calendar.svelte'
import Carousel from '../pages/carousel.svelte'
import Checkbox from '../pages/checkbox.svelte'
import Clipboard from '../pages/clipboard.svelte'
import Collapse from '../pages/collapse.svelte'
import Collapsible from '../pages/collapsible.svelte'
import ColorPicker from '../pages/color-picker.svelte'
import Combobox from '../pages/combobox.svelte'
import Dialog from '../pages/dialog.svelte'
import Divider from '../pages/divider.svelte'
import Dynamic from '../pages/dynamic.svelte'
import Edit from '../pages/edit.svelte'
import FileUpload from '../pages/file-upload.svelte'
import FloatingPanel from '../pages/floating-panel.svelte'
import HoverCard from '../pages/hover-card.svelte'
import Image from '../pages/image.svelte'
import HomePage from '../pages/index.svelte'
import Label from '../pages/label.svelte'
import Menu from '../pages/menu.svelte'
import NumberInput from '../pages/number-input.svelte'
import OtpInput from '../pages/otp-input.svelte'
import Pagination from '../pages/pagination.svelte'
import Popover from '../pages/popover.svelte'
import Presence from '../pages/presence.svelte'
import Progress from '../pages/progress.svelte'
import QrCode from '../pages/qr-code.svelte'
import Radio from '../pages/radio.svelte'
import Select from '../pages/select.svelte'
import Signature from '../pages/signature.svelte'
import Slider from '../pages/slider.svelte'
import Splitter from '../pages/splitter.svelte'
import Step from '../pages/step.svelte'
import Switch from '../pages/switch.svelte'
import Tabs from '../pages/tabs.svelte'
import Timer from '../pages/timer.svelte'
import Toggle from '../pages/toggle.svelte'
import Tooltip from '../pages/tooltip.svelte'
import Tour from '../pages/tour.svelte'
import Tree from '../pages/tree.svelte'

export const router = [
  { path: '/', component: HomePage },
  { path: '/aspect-ratio', component: AspectRatio },
  { path: '/breadcrumbs', component: Breadcrumbs },
  { path: '/calendar', component: Calendar },
  { path: '/carousel', component: Carousel },
  { path: '/checkbox', component: Checkbox },
  { path: '/clipboard', component: Clipboard },
  { path: '/collapse', component: Collapse },
  { path: '/collapsible', component: Collapsible },
  { path: '/color-picker', component: ColorPicker },
  { path: '/combobox', component: Combobox },
  { path: '/dialog', component: Dialog },
  { path: '/divider', component: Divider },
  { path: '/dynamic', component: Dynamic },
  { path: '/edit', component: Edit },
  { path: '/file-upload', component: FileUpload },
  { path: '/floating-panel', component: FloatingPanel },
  { path: '/hover-card', component: HoverCard },
  { path: '/image', component: Image },
  { path: '/label', component: Label },
  { path: '/menu', component: Menu },
  { path: '/number-input', component: NumberInput },
  { path: '/otp-input', component: OtpInput },
  { path: '/pagination', component: Pagination },
  { path: '/popover', component: Popover },
  { path: '/progress', component: Progress },
  { path: '/presence', component: Presence },
  { path: '/qr-code', component: QrCode },
  { path: '/radio', component: Radio },
  { path: '/select', component: Select },
  { path: '/signature', component: Signature },
  { path: '/slider', component: Slider },
  { path: '/splitter', component: Splitter },
  { path: '/step', component: Step },
  { path: '/switch', component: Switch },
  { path: '/tabs', component: Tabs },
  { path: '/timer', component: Timer },
  { path: '/toggle', component: Toggle },
  { path: '/tooltip', component: Tooltip },
  { path: '/tour', component: Tour },
  { path: '/tree', component: Tree },
]
