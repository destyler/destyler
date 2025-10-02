<script setup lang="ts">
import AspectRatio from '@component-docs/aspect-ratio/docs/snippets/aspect-ratio/AspectRatio.vue'
import Breadcrumbs from '@component-docs/breadcrumbs/docs/snippets/breadcrumbs/Breadcrumbs.vue'
import Calendar from '@component-docs/calendar/docs/snippets/calendar/Calendar.vue'
import Carousel from '@component-docs/carousel/docs/snippets/carousel/Carousel.vue'
import Checkbox from '@component-docs/checkbox/docs/snippets/checkbox/Checkbox.vue'
import Clipboard from '@component-docs/clipboard/docs/snippets/clipboard/Clipboard.vue'
import Collapse from '@component-docs/collapse/docs/snippets/collapse/Collapse.vue'
import Collapsible from '@component-docs/collapsible/docs/snippets/collapsible/Collapsible.vue'
import ColorPicker from '@component-docs/color-picker/docs/snippets/color-picker/ColorPicker.vue'
import Combobox from '@component-docs/combobox/docs/snippets/combobox/Combobox.vue'
import ContentMenu from '@component-docs/menu/docs/snippets/content-menu/ContentMenu.vue'
import Dialog from '@component-docs/dialog/docs/snippets/dialog/Dialog.vue'
import Dynamic from '@component-docs/dynamic/docs/snippets/dynamic/Dynamic.vue'
import Edit from '@component-docs/edit/docs/snippets/edit/Edit.vue'
import FileUpload from '@component-docs/file-upload/docs/snippets/file-upload/FileUpload.vue'
import HoverCard from '@component-docs/hover-card/docs/snippets/hover-card/HoverCard.vue'
import Image from '@component-docs/image/docs/snippets/image/Image.vue'
import Label from '@component-docs/label/docs/snippets/label/Label.vue'
import Menu from '@component-docs/menu/docs/snippets/menu/Menu.vue'
import NumberInput from '@component-docs/number-input/docs/snippets/number-input/NumberInput.vue'
import OtpInput from '@component-docs/otp-input/docs/snippets/otpInput/OtpInput.vue'
import Pagination from '@component-docs/pagination/docs/snippets/pagination/Pagination.vue'
import Popover from '@component-docs/popover/docs/snippets/popover/Popover.vue'
import Progress from '@component-docs/progress/docs/snippets/progress/Progress.vue'
import QRCode from '@component-docs/qr-code/docs/snippets/qr-code/QRCode.vue'
import Radio from '@component-docs/radio/docs/snippets/radio/Radio.vue'
import Select from '@component-docs/select/docs/snippets/select/Select.vue'
import Separator from '@component-docs/separator/docs/snippets/separator/Separator.vue'
import Signature from '@component-docs/signature/docs/snippets/signature/Signature.vue'
import Slider from '@component-docs/slider/docs/snippets/slider/Slider.vue'
import Splitter from '@component-docs/splitter/docs/snippets/splitter/Splitter.vue'
import Steps from '@component-docs/steps/docs/snippets/steps/Steps.vue'
import Switch from '@component-docs/switch/docs/snippets/switch/Switch.vue'
import Tabs from '@component-docs/tabs/docs/snippets/tabs/Tabs.vue'
import Timer from '@component-docs/timer/docs/snippets/timer/Timer.vue'
import ToggleGroup from '@component-docs/toggle/docs/snippets/toggleGroup/ToggleGroup.vue'
import Tooltip from '@component-docs/tooltip/docs/snippets/tooltip/Tooltip.vue'
import Tree from '@component-docs/tree/docs/snippets/tree/Tree.vue'

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
    <OtpInput v-if="props.name === 'otpInput'" />
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
