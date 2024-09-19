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
import './style.css'

const props = defineProps<{
  items: any
}>()
</script>

<template>
  <DropdownSub>
    <DropdownSubTrigger class="button">
      <Icon v-if="props.items.icon" :name="props.items.icon" class="icon" />
      {{ props.items.label }}
      <Shortcut>
        <Icon name="lucide-chevron-right" />
      </Shortcut>
    </DropdownSubTrigger>
    <DropdownPortal>
      <DropdownSubContent
        class="content"
        :side-offset="8"
        :align-offset="-5"
      >
        <template v-if="props.items.radio">
          <DropdownRadioGroup v-model="props.items!.model">
            <DropdownRadioItem
              v-for="item in props.items.child"
              :key="item.value"
              :value="item.value"
              class="pl-8 item"
            >
              <DropdownItemIndicator class="item-indicator">
                <Icon name="lucide-check" class="icon" />
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
              class="item"
            >
              <Icon v-if="item.icon" :name="item.icon" class="mr-2 icon" />
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
              class="pl-8 item"
            >
              <DropdownItemIndicator class="item-indicator">
                <Icon name="lucide-check" class="icon" />
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
