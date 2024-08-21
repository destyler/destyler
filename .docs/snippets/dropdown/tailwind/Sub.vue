// @noErrors
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
      class="
      relative flex cursor-default select-none
      items-center rounded-sm px-2 py-1.5 text-sm
      outline-none transition-colors cursor-pointer
      focus:bg-accent focus:text-accent-foreground
      data-[disabled]:pointer-events-none data-[disabled]:opacity-50
      "
    >
      <Icon v-if="props.items.icon" :name="props.items.icon" class="mr-2 h-4 w-4" />
      {{ props.items.label }}
      <Shortcut>
        <Icon name="lucide-chevron-right" />
      </Shortcut>
    </DropdownSubTrigger>
    <DropdownPortal>
      <DropdownSubContent
        class="
        z-50 min-w-32 overflow-hidden rounded-md border
        bg-popover p-1 text-popover-foreground shadow-md
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        :side-offset="8"
        :align-offset="-5"
      >
        <template v-if="props.items.radio">
          <DropdownRadioGroup v-model="props.items!.model">
            <DropdownRadioItem
              v-for="item in props.items.child"
              :key="item.value"
              :value="item.value"
              class="
                relative flex cursor-default select-none
                items-center rounded-sm px-2 pl-8 py-1.5 text-sm
                outline-none transition-colors cursor-pointer
                focus:bg-accent focus:text-accent-foreground
                data-[disabled]:pointer-events-none data-[disabled]:opacity-50
              "
            >
              <DropdownItemIndicator class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <Icon name="lucide-check" class="h-4 w-4" />
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
              class="
                relative flex cursor-default select-none
                items-center rounded-sm px-2 py-1.5 text-sm
                outline-none transition-colors cursor-pointer
                focus:bg-accent focus:text-accent-foreground
                data-[disabled]:pointer-events-none data-[disabled]:opacity-50
                "
            >
              <Icon v-if="item.icon" :name="item.icon" class="mr-2 h-4 w-4" />
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
              class="
                relative flex cursor-default select-none
                items-center rounded-sm px-2 pl-8 py-1.5 text-sm
                outline-none transition-colors cursor-pointer
                focus:bg-accent focus:text-accent-foreground
                data-[disabled]:pointer-events-none data-[disabled]:opacity-50
                "
            >
              <DropdownItemIndicator class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <Icon name="lucide-check" class="h-4 w-4" />
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
