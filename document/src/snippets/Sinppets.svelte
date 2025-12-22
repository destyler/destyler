<script lang="ts">
  import AspectRatio from '@component/aspect-ratio/snippets/AspectRatio.svelte'
  import Breadcrumbs from '@component/breadcrumbs/snippets/Breadcrumbs.svelte'
  import Carousel from '@component/carousel/snippets/Carousel.svelte'
  import Checkbox from '@component/checkbox/snippets/Checkbox.svelte'
  import Clipboard from '@component/clipboard/snippets/Clipboard.svelte'
  import Collapse from '@component/collapse/snippets/Collapse.svelte'
  import Collapsible from '@component/collapsible/snippets/Collapsible.svelte'
  import ColorPicker from '@component/color-picker/snippets/ColorPicker.svelte'
  import Combobox from '@component/combobox/snippets/Combobox.svelte'
  import Dialog from '@component/dialog/snippets/Dialog.svelte'
  import Dynamic from '@component/dynamic/snippets/Dynamic.svelte'
  import Edit from '@component/edit/snippets/Edit.svelte'
  import FileUpload from '@component/file-upload/snippets/FileUpload.svelte'
  import HoverCard from '@component/hover-card/snippets/HoverCard.svelte'
  import Image from '@component/image/snippets/Image.svelte'
  import Label from '@component/label/snippets/Label.svelte'
  import ContentMenu from '@component/menu/snippets/content-menu/ContentMenu.svelte'
  import Menu from '@component/menu/snippets/menu/Menu.svelte'
  import NumberInput from '@component/number-input/snippets/NumberInput.svelte'
  import OtpInput from '@component/otp-input/snippets/OtpInput.svelte'
  import Pagination from '@component/pagination/snippets/Pagination.svelte'
  import Popover from '@component/popover/snippets/Popover.svelte'
  import Progress from '@component/progress/snippets/Progress.svelte'
  import QrCode from '@component/qr-code/snippets/QRCode.svelte'
  import Radio from '@component/radio/snippets/Radio.svelte'
  import Select from '@component/select/snippets/Select.svelte'
  import Separator from '@component/separator/snippets/Separator.svelte'
  import Signature from '@component/signature/snippets/Signature.svelte'
  import Slider from '@component/slider/snippets/Slider.svelte'
  import Splitter from '@component/splitter/snippets/Splitter.svelte'
  import Steps from '@component/steps/snippets/Steps.svelte'
  import Switch from '@component/switch/snippets/Switch.svelte'
  import Tabs from '@component/tabs/snippets/Tabs.svelte'
  import Timer from '@component/timer/snippets/Timer.svelte'
  import Toggle from '@component/toggle/snippets/Toggle.svelte'
  import Tooltip from '@component/tooltip/snippets/Tooltip.svelte'
  import Tree from '@component/tree/snippets/Tree.svelte'
  import Calendar from '@component/calendar/snippets/Calendar.svelte'
  import Toast from '@component/toast/snippets/Toast.svelte'
  import Tour from '@component/tour/snippets/Tour.svelte'
  import FloatingPanel from '@component/floating-panel/snippets/FloatingPanel.svelte'
  import ScrollArea from '@component/scroll-area/snippets/ScrollArea.svelte'
  import NavigateMenu from '@component/navigation-menu/snippets/NavigationMenu.svelte'

  export let name: string;
</script>

<div data-layout="sinppets" class="min-w-150px flex justify-center items-center mt-0!">
  {#if name === 'checkbox'}
    <Checkbox />
  {/if}
  {#if name === 'collapse'}
    <Collapse className="w-450px!" />
  {/if}
  {#if name === 'combobox'}
    <Combobox />
  {/if}
  {#if name === 'calendar'}
    <Calendar />
  {/if}
  {#if name === 'dynamic'}
    <Dynamic />
  {/if}
  {#if name === 'label'}
    <Label />
  {/if}
  {#if name === 'otp-input'}
    <OtpInput />
  {/if}
  {#if name === 'radio'}
    <Radio />
  {/if}
  {#if name === 'select'}
    <Select />
  {/if}
  {#if name === 'slider'}
    <Slider className="w-450px!" />
  {/if}
  {#if name === 'switch'}
    <Switch />
  {/if}
  {#if name === 'toggle'}
    <Toggle />
  {/if}
  {#if name === 'qr-code'}
    <QrCode />
  {/if}
  {#if name === 'collapsible'}
    <Collapsible />
  {/if}
  {#if name === 'dialog'}
    <Dialog />
  {/if}
  {#if name === 'image'}
    <Image />
  {/if}
  {#if name === 'hover-card'}
    <HoverCard />
  {/if}
  {#if name === 'aspect-ratio'}
    <AspectRatio />
  {/if}
  {#if name === 'breadcrumbs'}
    <Breadcrumbs />
  {/if}
  {#if name === 'carousel'}
    <Carousel />
  {/if}
  {#if name === 'clipboard'}
    <Clipboard />
  {/if}
  {#if name === 'color-picker'}
    <ColorPicker />
  {/if}
  {#if name === 'separator'}
    <Separator />
  {/if}
  {#if name === 'edit'}
    <Edit />
  {/if}
  {#if name === 'file-upload'}
    <FileUpload />
  {/if}
  {#if name === 'floating-panel'}
    <FloatingPanel />
  {/if}
  {#if name === 'menu'}
    <Menu />
  {/if}
  {#if name === 'content-menu'}
    <ContentMenu />
  {/if}
  {#if name === 'number-input'}
    <NumberInput />
  {/if}
  {#if name === 'pagination'}
    <Pagination />
  {/if}
  {#if name === 'popover'}
    <Popover />
  {/if}
  {#if name === 'progress'}
    <Progress />
  {/if}
  {#if name === 'signature'}
    <Signature />
  {/if}
  {#if name === 'splitter'}
    <Splitter />
  {/if}
  {#if name === 'steps'}
    <Steps className="w-450px!" />
  {/if}
  {#if name === 'tabs'}
    <Tabs />
  {/if}
  {#if name === 'timer'}
    <Timer />
  {/if}
  {#if name === 'tooltip'}
    <Tooltip />
  {/if}
  {#if name === 'tree'}
    <Tree />
  {/if}
  {#if name === 'toast'}
    <Toast />
  {/if}
  {#if name === 'tour'}
    <Tour />
  {/if}
  {#if name === 'scroll-area'}
    <ScrollArea />
  {/if}
  {#if name === 'navigation-menu'}
    <NavigateMenu />
  {/if}
</div>
