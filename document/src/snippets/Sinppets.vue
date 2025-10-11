<script setup lang="ts">
import AspectRatio from '@component/aspect-ratio/snippets/AspectRatio.vue'
import Breadcrumbs from '@component/breadcrumbs/snippets/Breadcrumbs.vue'
import Carousel from '@component/carousel/snippets/Carousel.vue'
import Checkbox from '@component/checkbox/snippets/Checkbox.vue'
import Clipboard from '@component/clipboard/snippets/Clipboard.vue'
import Collapse from '@component/collapse/snippets/Collapse.vue'
import Collapsible from '@component/collapsible/snippets/Collapsible.vue'
import ColorPicker from '@component/color-picker/snippets/ColorPicker.vue'
import Combobox from '@component/combobox/snippets/Combobox.vue'
import Dialog from '@component/dialog/snippets/Dialog.vue'
import Dynamic from '@component/dynamic/snippets/Dynamic.vue'
import Edit from '@component/edit/snippets/Edit.vue'
import FileUpload from '@component/file-upload/snippets/FileUpload.vue'
import HoverCard from '@component/hover-card/snippets/HoverCard.vue'
import Image from '@component/image/snippets/Image.vue'
import Label from '@component/label/snippets/Label.vue'
import ContentMenu from '@component/menu/snippets/content-menu/ContentMenu.vue'
import Menu from '@component/menu/snippets/menu/Menu.vue'
import NumberInput from '@component/number-input/snippets/NumberInput.vue'
import OtpInput from '@component/otp-input/snippets/OtpInput.vue'
import Pagination from '@component/pagination/snippets/Pagination.vue'
import Popover from '@component/popover/snippets/Popover.vue'
import Progress from '@component/progress/snippets/Progress.vue'
import QrCode from '@component/qr-code/snippets/QRCode.vue'
import Radio from '@component/radio/snippets/Radio.vue'
import Select from '@component/select/snippets/Select.vue'
import Separator from '@component/separator/snippets/Separator.vue'
import Signature from '@component/signature/snippets/Signature.vue'
import Slider from '@component/slider/snippets/Slider.vue'
import Splitter from '@component/splitter/snippets/Splitter.vue'
import Steps from '@component/steps/snippets/Steps.vue'
import Switch from '@component/switch/snippets/Switch.vue'
import Tabs from '@component/tabs/snippets/Tabs.vue'
import Timer from '@component/timer/snippets/Timer.vue'
import Toggle from '@component/toggle/snippets/Toggle.vue'
import Tooltip from '@component/tooltip/snippets/Tooltip.vue'
import Tree from '@component/tree/snippets/Tree.vue'

const props = defineProps<{
  name: string
}>()
</script>

<template>
  <div data-layout="sinppets" class="min-w-150px flex justify-center items-center mt-0!">
    <Checkbox v-if="props.name === 'checkbox'" />
    <Collapse v-if="props.name === 'collapse'" class="w-450px!" />
    <Combobox v-if="props.name === 'combobox'" />
    <Dynamic v-if="props.name === 'dynamic'" />
    <Label v-if="props.name === 'label'" />
    <OtpInput v-if="props.name === 'otp-input'" />
    <Radio v-if="props.name === 'radio'" />
    <Select v-if="props.name === 'select'" />
    <Slider v-if="props.name === 'slider'" class="w-450px!" />
    <Switch v-if="props.name === 'switch'" />
    <Toggle v-if="props.name === 'toggle'" />
    <!-- <Calendar v-if="props.name === 'calendar'" /> -->
    <QrCode v-if="props.name === 'qr-code'" />
    <Collapsible v-if="props.name === 'collapsible'" />
    <Dialog v-if="props.name === 'dialog'" />
    <Image v-if="props.name === 'image'" />
    <HoverCard v-if="props.name === 'hover-card'" />
    <AspectRatio v-if="props.name === 'aspect-ratio'" />
    <Breadcrumbs v-if="props.name === 'breadcrumbs'" />
    <Carousel v-if="props.name === 'carousel'" />
    <Clipboard v-if="props.name === 'clipboard'" />
    <ColorPicker v-if="props.name === 'color-picker'" />
    <Separator v-if="props.name === 'separator'" />
    <Edit v-if="props.name === 'edit'" />
    <FileUpload v-if="props.name === 'file-upload'" />
    <Menu v-if="props.name === 'menu'" />
    <ContentMenu v-if="props.name === 'content-menu'" />
    <NumberInput v-if="props.name === 'number-input'" />
    <Pagination v-if="props.name === 'pagination'" />
    <Popover v-if="props.name === 'popover'" />
    <Progress v-if="props.name === 'progress'" class="w-450px!" />
    <Signature v-if="props.name === 'signature'" />
    <Splitter v-if="props.name === 'splitter'" />
    <Steps v-if="props.name === 'steps'" class="w-450px!" />
    <Tabs v-if="props.name === 'tabs'" />
    <Timer v-if="props.name === 'timer'" />
    <Tooltip v-if="props.name === 'tooltip'" />
    <Tree v-if="props.name === 'tree'" />
  </div>
</template>
