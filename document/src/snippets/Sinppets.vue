<script setup lang="ts">
import AspectRatio from '@component/aspect-ratio/snippets/AspectRatio.vue'
import Breadcrumbs from '@component/aspect-ratio/snippets/Breadcrumbs.vue'
import Carousel from '@component/aspect-ratio/snippets/Carousel.vue'
import Checkbox from '@component/aspect-ratio/snippets/Checkbox.vue'
import Clipboard from '@component/aspect-ratio/snippets/Clipboard.vue'
import Collapse from '@component/aspect-ratio/snippets/Collapse.vue'
import Collapsible from '@component/aspect-ratio/snippets/Collapsible.vue'
import ColorPicker from '@component/aspect-ratio/snippets/ColorPicker.vue'
import Combobox from '@component/aspect-ratio/snippets/Combobox.vue'
import ContentMenu from '@component/aspect-ratio/snippets/ContentMenu.vue'
import Dialog from '@component/aspect-ratio/snippets/Dialog.vue'
import Dynamic from '@component/aspect-ratio/snippets/Dynamic.vue'
import Edit from '@component/aspect-ratio/snippets/Edit.vue'
import FileUpload from '@component/aspect-ratio/snippets/FileUpload.vue'
import HoverCard from '@component/aspect-ratio/snippets/HoverCard.vue'
import Image from '@component/aspect-ratio/snippets/Image.vue'
import Label from '@component/aspect-ratio/snippets/Label.vue'
import Menu from '@component/aspect-ratio/snippets/Menu.vue'
import NumberInput from '@component/aspect-ratio/snippets/NumberInput.vue'
import OtpInput from '@component/aspect-ratio/snippets/OtpInput.vue'
import Pagination from '@component/aspect-ratio/snippets/Pagination.vue'
import Popover from '@component/aspect-ratio/snippets/Popover.vue'
import Progress from '@component/aspect-ratio/snippets/Progress.vue'
import QrCode from '@component/aspect-ratio/snippets/QRCode.vue'
import Radio from '@component/aspect-ratio/snippets/Radio.vue'
import Select from '@component/aspect-ratio/snippets/Select.vue'
import Separator from '@component/aspect-ratio/snippets/Separator.vue'
import Signature from '@component/aspect-ratio/snippets/Signature.vue'
import Slider from '@component/aspect-ratio/snippets/Slider.vue'
import Splitter from '@component/aspect-ratio/snippets/Splitter.vue'
import Steps from '@component/aspect-ratio/snippets/Steps.vue'
import Switch from '@component/aspect-ratio/snippets/Switch.vue'
import Tabs from '@component/aspect-ratio/snippets/Tabs.vue'
import Timer from '@component/aspect-ratio/snippets/Timer.vue'
import ToggleGroup from '@component/aspect-ratio/snippets/ToggleGroup.vue'
import Tooltip from '@component/aspect-ratio/snippets/Tooltip.vue'
import Tree from '@component/aspect-ratio/snippets/Tree.vue'

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
