<script setup lang="ts">
import { Icon } from '@destyler/icon'
import {
  DropdownCheckboxItem,
  DropdownItem,
  DropdownItemIndicator,
  DropdownPortal,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
} from '@destyler/dropdown'
import Shortcut from './Shortcut.vue'

const props = defineProps<{
  items: any
}>()
</script>

<template>
  <DropdownSub>
    <DropdownSubTrigger
      inline="flex"
      items="center"
      justify="center"
      whitespace="nowrap"
      rounded="md"
      font="medium"
      transition="colors"
      shadow="~"
      h="9"
      p="x-4 y-2"
      text="sm primary-foreground"
      focus-visible="outline-none ring-1"
      disabled="pointer-events-none op-50"
      bg="primary hover:primary/90"
    >
      <Icon
        v-if="props.items.icon"
        :name="props.items.icon"
        m="r-2"
        h="4"
        w="4"
      />
      {{ props.items.label }}
      <Shortcut>
        <Icon name="lucide-chevron-right" />
      </Shortcut>
    </DropdownSubTrigger>
    <DropdownPortal>
      <DropdownSubContent
        z="50"
        min-w="32"
        overflow="hidden"
        rounded="md"
        border="~"
        w="56"
        bg="popover"
        p="1"
        text="popover-foreground"
        shadow="md"
        class="
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
        "
        :side-offset="8"
        :align-offset="-5"
      >
        <template v-if="props.items.radio">
          <DropdownRadioGroup v-model="props.items!.model">
            <DropdownRadioItem
              v-for="item in props.items.child"
              :key="item.value"
              :value="item.value"
              relative="~"
              flex="~"
              select="none"
              items="center"
              rounded="sm"
              p="x-2 y-1.5"
              text="sm focus:accent-foreground"
              outline="none"
              transition="colors"
              cursor="pointer"
              bg="focus:accent"
              pointer-events="data-[disabled]:none"
              op="data-[disabled]:50"
            >
              <DropdownItemIndicator
                absolute="~"
                left="2"
                flex="~"
                h="3.5"
                w="3.5"
                items="center"
                justify="center"
              >
                <Icon name="lucide-check" w="4" h="4" />
              </DropdownItemIndicator>
              {{ item.label }}
              <Shortcut v-if="item.shortcut">
                {{ item.shortcut }}
              </Shortcut>
            </DropdownRadioItem>
          </DropdownRadioGroup>
        </template>
        <template v-else>
          <template
            v-for="item in props.items.child"
            :key="item.value"
          >
            <DropdownItem
              v-if="item.type === 'item'"
              :value="item.value"
              :disabled="item.disabled || false"
              relative="~"
              flex="~"
              select="none"
              items="center"
              rounded="sm"
              p="x-2 y-1.5"
              text="sm focus:accent-foreground"
              outline="none"
              transition="colors"
              cursor="pointer"
              bg="focus:accent"
              pointer-events="data-[disabled]:none"
              op="data-[disabled]:50"
            >
              <Icon v-if="item.icon" :name="item.icon" m="r-2" h="4" w="4" />
              {{ item.label }}
              <Shortcut v-if="item.shortcut">
                {{ item.shortcut }}
              </Shortcut>
            </DropdownItem>
            <DropdownCheckboxItem
              v-if="item.type === 'check'"
              v-model:checked="item.checked"
              :value="item.value"
              :disabled="item.disabled || false"
              relative="~"
              flex="~"
              select="none"
              items="center"
              rounded="sm"
              p="x-2 y-1.5"
              text="sm focus:accent-foreground"
              outline="none"
              transition="colors"
              cursor="pointer"
              bg="focus:accent"
              pointer-events="data-[disabled]:none"
              op="data-[disabled]:50"
            >
              <DropdownItemIndicator
                absolute="~"
                left="2"
                flex="~"
                h="3.5"
                w="3.5"
                items="center"
                justify="center"
              >
                <Icon name="lucide-check" h="4" w="4" />
              </DropdownItemIndicator>
              {{ item.label }}
              <Shortcut v-if="item.shortcut">
                {{ item.shortcut }}
              </Shortcut>
            </DropdownCheckboxItem>
            <Sub v-if="item.type === 'sub'" :items="item" />
          </template>
        </template>
      </DropdownSubContent>
    </DropdownPortal>
  </DropdownSub>
</template>
