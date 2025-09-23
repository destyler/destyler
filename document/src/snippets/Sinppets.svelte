<script lang="ts">
  import Checkbox from './checkbox/Checkbox.svelte';
  import Collapse from './collapse/Collapse.svelte';
  import Combobox from './combobox/Combobox.svelte';
  import Dynamic from './dynamic/Dynamic.svelte';
  import Label from './label/Label.svelte';
  import OtpInput from './otpInput/OtpInput.svelte';
  import Radio from './radio/Radio.svelte';
  import Select from './select/Select.svelte';
  import Slider from './slider/Slider.svelte';
  import Switch from './switch/Switch.svelte';
  import ToggleGroup from './toggleGroup/ToggleGroup.svelte';
  import QrCode from './qr-code/QRCode.svelte';
  import Collapsible from './collapsible/Collapsible.svelte';
  import Dialog from './dialog/Dialog.svelte';
  import Image from './image/Image.svelte';
  import HoverCard from './hover-card/HoverCard.svelte';
  import AspectRadio from './aspect-ratio/AspectRatio.svelte';
  import Breadcrumbs from './breadcrumbs/Breadcrumbs.svelte';
  import Carousel from './carousel/Carousel.svelte';
  import Clipboard from './clipboard/Clipboard.svelte';
  import ColorPicker from './color-picker/ColorPicker.svelte';
  import Separator from './separator/Separator.svelte';
  import Edit from './edit/Edit.svelte';
  import FileUpload from './file-upload/FileUpload.svelte';
  import Menu from './menu/Menu.svelte';
  import ContentMenu from './content-menu/ContentMenu.svelte';
  import NumberInput from './number-input/NumberInput.svelte';
  import Pagination from './pagination/Pagination.svelte';
  import Popover from './popover/Popover.svelte';
  import Signature from './signature/Signature.svelte';
  import Splitter from './splitter/Splitter.svelte';
  import Steps from './steps/Steps.svelte';
  import Tabs from './tabs/Tabs.svelte';
  import Timer from './timer/Timer.svelte';
  import Tooltip from './tooltip/Tooltip.svelte';
  import Tree from './tree/Tree.svelte';

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
    <AspectRadio />
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
