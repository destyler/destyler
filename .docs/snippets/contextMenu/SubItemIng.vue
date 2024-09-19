<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { ContextMenuCheckboxItem, ContextMenuItem, ContextMenuItemIndicator, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from '@destyler/context-menu'
import { useAttrs } from 'vue'
import ContextMenuShortcut from './Shortcut.vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  item?: any
}>()

const attrs = useAttrs()
</script>

<template>
  <ContextMenuSub>
    <ContextMenuSubTrigger
      v-bind="attrs"
      class="
              flex cursor-default select-none items-center rounded-sm
              px-2 py-1.5 text-sm outline-none
              focus:bg-accent focus:text-accent-foreground
              data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
    >
      {{ props.item.label }}
      <Icon name="carbon:chevron-right" class="ml-auto h-4 w-4" />
    </ContextMenuSubTrigger>
    <ContextMenuPortal>
      <ContextMenuSubContent
        class="
              z-50 w-58 min-w-32 overflow-hidden rounded-md border
              bg-popover p-1 text-popover-foreground shadow-lg
              data-[state=open]:animate-in data-[state=closed]:animate-out
              data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
              data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
              data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
              data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
              "
        :side-offset="2"
        :align-offset="-5"
      >
        <template
          v-for="subItem in props.item.items"
          :key="subItem.label"
        >
          <ContextMenuItem
            v-if="subItem.type === 'item'"
            class="
                  relative flex cursor-default select-none items-center
                  rounded-sm px-2 py-1.5 pl-4 text-sm outline-none
                  focus:bg-accent focus:text-accent-foreground
                  data-[disabled]:pointer-events-none data-[disabled]:opacity-50
                  "
            :disabled="subItem.disabled"
          >
            <span>{{ subItem.label }}</span>
            <ContextMenuShortcut>{{ subItem.shortcut }}</ContextMenuShortcut>
          </ContextMenuItem>
          <SubItemIng
            v-else-if="subItem.type === 'sub'"
            :item="subItem"
            class="pl-4"
          />
          <ContextMenuCheckboxItem
            v-else-if="subItem.type === 'check'"
            :checked="subItem.checked"
            class="
            relative flex cursor-default select-none items-center
            rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
            focus:bg-accent focus:text-accent-foreground
            data-[disabled]:pointer-events-none data-[disabled]:opacity-50
            "
          >
            <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
              <ContextMenuItemIndicator>
                <Icon name="carbon:checkmark" class="w-4 h-4 text-primary" />
              </ContextMenuItemIndicator>
            </span>
            <span>{{ subItem.label }}</span>
            <ContextMenuShortcut>{{ subItem.shortcut }}</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuRadioGroup
            v-else-if="subItem.type === 'radio'"
          >
            <ContextMenuLabel
              class="px-2 py-1.5 text-sm font-semibold text-foreground pl-8"
            >
              {{ subItem.label }}
            </ContextMenuLabel>
            <ContextMenuSeparator class="-mx-1 my-1 h-px bg-border" />
            <ContextMenuRadioItem
              v-for="radioItem in subItem.items"
              :key="radioItem.label"
              :value="radioItem.value"
              class="
              relative flex cursor-default select-none items-center
              rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none
              focus:bg-accent focus:text-accent-foreground
              data-[disabled]:pointer-events-none data-[disabled]:opacity-50
              "
            >
              <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <ContextMenuItemIndicator>
                  <Icon name="carbon:dot-mark" class="h-4 w-4 fill-current text-primary" />
                </ContextMenuItemIndicator>
              </span>
              {{ radioItem.label }}
              <ContextMenuShortcut>{{ radioItem.shortcut }}</ContextMenuShortcut>
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator
            v-else-if="subItem.type === 'separator'"
            class="-mx-1 my-1 h-px bg-border"
          />
        </template>
      </ContextMenuSubContent>
    </ContextMenuPortal>
  </ContextMenuSub>
</template>
