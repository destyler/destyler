<script setup lang="ts">
import AspectRatio from './aspect-ratio/AspectRatio.vue'
import Breadcrumbs from './breadcrumbs/Breadcrumbs.vue'
import Calendar from './calendar/Calendar.vue'
import Carousel from './carousel/Carousel.vue'
import Checkbox from './checkbox/Checkbox.vue'
import Clipboard from './clipboard/Clipboard.vue'
import Collapse from './collapse/Collapse.vue'
import Collapsible from './collapsible/Collapsible.vue'
import ColorPicker from './color-picker/ColorPicker.vue'
import Combobox from './combobox/Combobox.vue'
import ContentMenu from './content-menu/ContentMenu.vue'
import Dialog from './dialog/Dialog.vue'
import Dynamic from './dynamic/Dynamic.vue'
import Edit from './edit/Edit.vue'
import FileUpload from './file-upload/FileUpload.vue'
import HoverCard from './hover-card/HoverCard.vue'
import Image from './image/Image.vue'
import Label from './label/Label.vue'
import Menu from './menu/Menu.vue'
import NumberInput from './number-input/NumberInput.vue'
import OTPInput from './otpInput/OTPInput.vue'
import Pagination from './pagination/Pagination.vue'
import Popover from './popover/Popover.vue'
import Progress from './progress/Progress.vue'
import QRCode from './qr-code/QRCode.vue'
import Radio from './radio/Radio.vue'
import Select from './select/Select.vue'
import Separator from './separator/Separator.vue'
import Signature from './signature/Signature.vue'
import Slider from './slider/Slider.vue'
import Splitter from './splitter/Splitter.vue'
import Steps from './steps/Steps.vue'
import Switch from './switch/Switch.vue'
import Tabs from './tabs/Tabs.vue'
import Timer from './timer/Timer.vue'
import ToggleGroup from './toggleGroup/ToggleGroup.vue'
import Tooltip from './tooltip/Tooltip.vue'
import Tree from './tree/Tree.vue'

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
    <OTPInput v-if="props.name === 'otpInput'" />
    <Radio v-if="props.name === 'radio'" />
    <Select v-if="props.name === 'select'" />
    <Slider v-if="props.name === 'slider'" class="w-450px!" />
    <Switch v-if="props.name === 'switch'" />
    <ToggleGroup v-if="props.name === 'toggleGroup'" />
    <Calendar v-if="props.name === 'calendar'" />
    <QRCode v-if="props.name === 'qr-code'" />
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
