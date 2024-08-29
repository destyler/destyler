<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { ContextMenuCheckboxItem, ContextMenuItem, ContextMenuItemIndicator, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from '@destyler/context-menu'
import { useAttrs } from 'vue'
import ContextMenuShortcut from './Shortcut.vue'
import './style.css'

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
      class="contextMenuAllItem"
    >
      {{ props.item.label }}
      <Icon name="carbon:chevron-right" class="default-icon" />
    </ContextMenuSubTrigger>
    <ContextMenuPortal>
      <ContextMenuSubContent
        class="contextMenuContent"
        :side-offset="2"
        :align-offset="-5"
      >
        <template
          v-for="subItem in props.item.items"
          :key="subItem.label"
        >
          <ContextMenuItem
            v-if="subItem.type === 'item'"
            class="contextMenuAllItem"
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
            class="contextMenuAllItem"
          >
            <span class="contextMenuItemIndicator">
              <ContextMenuItemIndicator>
                <Icon name="carbon:checkmark" class="icon" />
              </ContextMenuItemIndicator>
            </span>
            <span>{{ subItem.label }}</span>
            <ContextMenuShortcut>{{ subItem.shortcut }}</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuRadioGroup
            v-else-if="subItem.type === 'radio'"
          >
            <ContextMenuLabel
              class="contextMenuLabel pl-8"
            >
              {{ subItem.label }}
            </ContextMenuLabel>
            <ContextMenuSeparator class="separator" />
            <ContextMenuRadioItem
              v-for="radioItem in subItem.items"
              :key="radioItem.label"
              :value="radioItem.value"
              class="contextMenuAllItem"
            >
              <span class="contextMenuItemIndicator">
                <ContextMenuItemIndicator>
                  <Icon name="carbon:dot-mark" class="icon fill-current" />
                </ContextMenuItemIndicator>
              </span>
              {{ radioItem.label }}
              <ContextMenuShortcut>{{ radioItem.shortcut }}</ContextMenuShortcut>
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator
            v-else-if="subItem.type === 'separator'"
            class="separator"
          />
        </template>
      </ContextMenuSubContent>
    </ContextMenuPortal>
  </ContextMenuSub>
</template>
