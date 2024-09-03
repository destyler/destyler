<script setup lang="ts">
import {
  MenubarItem,
  MenubarPortal,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@destyler/menubar'
import { Icon } from '@destyler/icon'
import Shortcut from './Shortcut.vue'

const props = defineProps<{
  items?: any
}>()
</script>

<template>
  <MenubarSub>
    <MenubarSubTrigger
      flex="~"
      cursor="pointer"
      select="none"
      items="center"
      rounded="sm"
      p="x-2 y-1.5"
      text="sm focus:accent-foreground data-[state=open]:accent-foreground"
      outline="none"
      bg="focus:accent data-[state=open]:accent"
    >
      <Icon
        v-if="props.items.icon"
        :name="props.items.icon"
        m="r-2"
        h="4"
        w="4"
      />
      {{ props.items.label }}
      <Icon
        name="carbon:chevron-right"
        m="l-autopx"
        h="4"
        w="4"
      />
    </MenubarSubTrigger>
    <MenubarPortal>
      <MenubarSubContent
        :align-offset="-5"
        z="50"
        min-w="8rem"
        overflow="hidden"
        rounded="md"
        border="~"
        bg="popover"
        p="1"
        text="popover-foreground"
        class="
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95
        data-[state=open]:zoom-in-95
        data-[side=bottom]:slide-in-from-top-2
        data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2
        data-[side=top]:slide-in-from-bottom-2
        "
      >
        <template
          v-for="item in props.items.items"
          :key="item?.value"
        >
          <MenubarItem
            v-if="item?.type === 'item'"
            :value="item?.value"
            :disabled="item?.disabled"
            class=" data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            relative="~"
            flex="~"
            cursor="pointer"
            select="none"
            items="center"
            rounded="sm"
            p="x-2 y-1.5"
            outline="none"
            bg="focus:accent"
            text="sm focus:accent-foreground"
            pointer-events="data-[disabled]:none"
            op="data-[disabled]:50"
            :class="item?.class"
          >
            <Icon
              v-if="item.icon"
              :name="item.icon"
              m="r-2"
              h="4"
              w="4"
            />
            {{ item?.label }}
            <Shortcut v-show="item?.shortcut">
              {{ item.shortcut }}
            </Shortcut>
          </MenubarItem>
          <MenubarSeparator
            v-else-if="item?.type === 'separator'"
            m="x--1 y-1"
            h="px"
            bg="muted"
          />
          <Sub v-else-if="item?.type === 'sub'" :items="item" />
        </template>
      </MenubarSubContent>
    </MenubarPortal>
  </MenubarSub>
</template>
