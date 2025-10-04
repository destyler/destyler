<script lang="ts">
  import Checkbox from '@component/checkbox/docs/snippets/checkbox/Checkbox.svelte';
  import Collapse from '@component/collapse/docs/snippets/collapse/Collapse.svelte';
  import Combobox from '@component/combobox/docs/snippets/combobox/Combobox.svelte';
  import Dynamic from '@component/dynamic/docs/snippets/dynamic/Dynamic.svelte';
  import Label from '@component/label/docs/snippets/label/Label.svelte';
  import OtpInput from '@component/otp-input/docs/snippets/otpInput/OtpInput.svelte';
  import Radio from '@component/radio/docs/snippets/radio/Radio.svelte';
  import Select from '@component/select/docs/snippets/select/Select.svelte';
  import Slider from '@component/slider/docs/snippets/slider/Slider.svelte';
  import Switch from '@component/switch/docs/snippets/switch/Switch.svelte';
  import ToggleGroup from '@component/toggle/docs/snippets/toggleGroup/ToggleGroup.svelte';
  import QrCode from '@component/qr-code/docs/snippets/qr-code/QRCode.svelte';
  import Collapsible from '@component/collapsible/docs/snippets/collapsible/Collapsible.svelte';
  import Dialog from '@component/dialog/docs/snippets/dialog/Dialog.svelte';
  import Image from '@component/image/docs/snippets/image/Image.svelte';
  import HoverCard from '@component/hover-card/docs/snippets/hover-card/HoverCard.svelte';
  import AspectRatio from '@component/aspect-ratio/docs/snippets/aspect-ratio/AspectRatio.svelte';
  import Breadcrumbs from '@component/breadcrumbs/docs/snippets/breadcrumbs/Breadcrumbs.svelte';
  import Carousel from '@component/carousel/docs/snippets/carousel/Carousel.svelte';
  import Clipboard from '@component/clipboard/docs/snippets/clipboard/Clipboard.svelte';
  import ColorPicker from '@component/color-picker/docs/snippets/color-picker/ColorPicker.svelte';
  import Separator from '@component/separator/docs/snippets/separator/Separator.svelte';
  import Edit from '@component/edit/docs/snippets/edit/Edit.svelte';
  import FileUpload from '@component/file-upload/docs/snippets/file-upload/FileUpload.svelte';
  import Menu from '@component/menu/docs/snippets/menu/Menu.svelte';
  import ContentMenu from '@component/menu/docs/snippets/content-menu/ContentMenu.svelte';
  import NumberInput from '@component/number-input/docs/snippets/number-input/NumberInput.svelte';
  import Pagination from '@component/pagination/docs/snippets/pagination/Pagination.svelte';
  import Popover from '@component/popover/docs/snippets/popover/Popover.svelte';
  import Progress from '@component/progress/docs/snippets/progress/Progress.svelte';
  import Signature from '@component/signature/docs/snippets/signature/Signature.svelte';
  import Splitter from '@component/splitter/docs/snippets/splitter/Splitter.svelte';
  import Steps from '@component/steps/docs/snippets/steps/Steps.svelte';
  import Tabs from '@component/tabs/docs/snippets/tabs/Tabs.svelte';
  import Timer from '@component/timer/docs/snippets/timer/Timer.svelte';
  import Tooltip from '@component/tooltip/docs/snippets/tooltip/Tooltip.svelte';
  import Tree from '@component/tree/docs/snippets/tree/Tree.svelte';

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
  {#if name === 'dynamic'}
    <Dynamic />
  {/if}
  {#if name === 'label'}
    <Label />
  {/if}
  {#if name === 'otpInput'}
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
  {#if name === 'toggleGroup'}
    <ToggleGroup />
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
</div>
