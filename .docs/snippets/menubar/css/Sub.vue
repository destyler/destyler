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
import './style.css'

const props = defineProps<{
  items?: any
}>()
</script>

<template>
  <MenubarSub>
    <MenubarSubTrigger
      class="trigger"
    >
      <Icon v-if="props.items.icon" :name="props.items.icon" class="icon mr-2" />
      {{ props.items.label }}
      <Icon name="carbon:chevron-right" class="ml-auto icon" />
    </MenubarSubTrigger>
    <MenubarPortal>
      <MenubarSubContent
        :align-offset="-5"
        class="content"
      >
        <template
          v-for="item in props.items.items"
          :key="item?.value"
        >
          <MenubarItem
            v-if="item?.type === 'item'"
            :value="item?.value"
            :disabled="item?.disabled"
            class="item"
            :class="item?.class"
          >
            <Icon v-if="item.icon" :name="item.icon" class="mr-2 icon" />
            {{ item?.label }}
            <Shortcut v-show="item?.shortcut">
              {{ item.shortcut }}
            </Shortcut>
          </MenubarItem>
          <MenubarSeparator v-else-if="item?.type === 'separator'" class="separator" />
          <Sub v-else-if="item?.type === 'sub'" :items="item" />
        </template>
      </MenubarSubContent>
    </MenubarPortal>
  </MenubarSub>
</template>
