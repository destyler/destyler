<script lang="ts">
  import AspectRatio from '@component/aspect-ratio/snippets/AspectRatio.svelte'
  import Breadcrumbs from '@component/aspect-ratio/snippets/Breadcrumbs.svelte'
  import Carousel from '@component/aspect-ratio/snippets/Carousel.svelte'
  import Checkbox from '@component/aspect-ratio/snippets/Checkbox.svelte'
  import Clipboard from '@component/aspect-ratio/snippets/Clipboard.svelte'
  import Collapse from '@component/aspect-ratio/snippets/Collapse.svelte'
  import Collapsible from '@component/aspect-ratio/snippets/Collapsible.svelte'
  import ColorPicker from '@component/aspect-ratio/snippets/ColorPicker.svelte'
  import Combobox from '@component/aspect-ratio/snippets/Combobox.svelte'
  import ContentMenu from '@component/aspect-ratio/snippets/ContentMenu.svelte'
  import Dialog from '@component/aspect-ratio/snippets/Dialog.svelte'
  import Dynamic from '@component/aspect-ratio/snippets/Dynamic.svelte'
  import Edit from '@component/aspect-ratio/snippets/Edit.svelte'
  import FileUpload from '@component/aspect-ratio/snippets/FileUpload.svelte'
  import HoverCard from '@component/aspect-ratio/snippets/HoverCard.svelte'
  import Image from '@component/aspect-ratio/snippets/Image.svelte'
  import Label from '@component/aspect-ratio/snippets/Label.svelte'
  import Menu from '@component/aspect-ratio/snippets/Menu.svelte'
  import NumberInput from '@component/aspect-ratio/snippets/NumberInput.svelte'
  import OtpInput from '@component/aspect-ratio/snippets/OtpInput.svelte'
  import Pagination from '@component/aspect-ratio/snippets/Pagination.svelte'
  import Popover from '@component/aspect-ratio/snippets/Popover.svelte'
  import Progress from '@component/aspect-ratio/snippets/Progress.svelte'
  import QrCode from '@component/aspect-ratio/snippets/QRCode.svelte'
  import Radio from '@component/aspect-ratio/snippets/Radio.svelte'
  import Select from '@component/aspect-ratio/snippets/Select.svelte'
  import Separator from '@component/aspect-ratio/snippets/Separator.svelte'
  import Signature from '@component/aspect-ratio/snippets/Signature.svelte'
  import Slider from '@component/aspect-ratio/snippets/Slider.svelte'
  import Splitter from '@component/aspect-ratio/snippets/Splitter.svelte'
  import Steps from '@component/aspect-ratio/snippets/Steps.svelte'
  import Switch from '@component/aspect-ratio/snippets/Switch.svelte'
  import Tabs from '@component/aspect-ratio/snippets/Tabs.svelte'
  import Timer from '@component/aspect-ratio/snippets/Timer.svelte'
  import ToggleGroup from '@component/aspect-ratio/snippets/ToggleGroup.svelte'
  import Tooltip from '@component/aspect-ratio/snippets/Tooltip.svelte'
  import Tree from '@component/aspect-ratio/snippets/Tree.svelte'

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
