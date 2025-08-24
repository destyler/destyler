<script setup lang="ts">
import * as menu from "@destyler/menu";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed, ref } from "vue";

const [state, send] = useMachine(menu.machine({ id: "1", "aria-label": "File" }));

const api = computed(() => menu.connect(state.value, send, normalizeProps));

interface MenuItem {
  value: string
  label: string
  icon: string
  shortcut?: string
  disabled?: boolean
}

const items = ref<MenuItem[][]>([
  [
    {
      value: 'profile',
      label: 'Profile',
      icon: 'i-lucide-user',
      shortcut: '⇧⌘P',
    },
    {
      value: 'billing',
      label: 'Billing',
      icon: 'i-lucide-credit-card',
      shortcut: '⌘B',
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: 'i-lucide-settings',
      shortcut: '⌘S',
    },
    {
      value: 'feature',
      icon: 'i-lucide-sparkles',
      label: 'Feature',
    },
    {
      value: 'keyboard-shortcuts',
      label: 'Keyboard Shortcuts',
      icon: 'i-lucide-keyboard',
      shortcut: '⌘K',
    },
  ],
  [
    {
      value: 'team',
      icon: 'i-lucide-users',
      label: 'Team',
    },
    {
      value: 'invite-users',
      icon: 'i-lucide-user-plus',
      label: 'Invite Users',
    },
    {
      value: 'new-team',
      icon: 'i-lucide-plus',
      label: 'New Team',
      shortcut: '⌘+T',
    },
  ],
  [
    {
      value: 'github',
      icon: 'i-lucide-github',
      label: 'GitHub',
    },
    {
      value: 'support',
      icon: 'i-lucide-paintbrush',
      label: 'Support',
    },
    {
      value: 'api',
      icon: 'i-lucide-cloud',
      label: 'API',
      disabled: true,
    },
  ],
  [
    {
      value: 'log-out',
      label: 'Log Out',
      icon: 'i-lucide-log-out',
      shortcut: '⇧⌘Q',
    },
  ],
])
</script>

<template>
  <div>
    <button 
      v-bind="api.getContextTriggerProps()"
      class="context-menu-trigger"
    >
      <div class="context-menu-trigger-text">Open context menu</div>
    </button>
    <Teleport to="body">
      <div
        v-if="api.open"
        v-bind="api.getPositionerProps()"
        class="context-menu-positioner"
      >
        <div class="context-menu-title">
          My Account
        </div>
        <div class="context-menu-separator" v-bind="api.getSeparatorProps()" />
        <ul
          v-for="(itemList, index) in items"
          :key="index"
          v-bind="api.getContentProps()"
          class="context-menu-content"
        >
          <li
            v-for="item in itemList"
            :key="item.value"
            v-bind="api.getItemProps({ value: item.value, disabled: item?.disabled })"
            class="context-menu-item"
          >
            <div class="context-menu-item-icon" :class="item.icon" />
            {{ item.label }}
            <span v-if="item?.shortcut" class="context-menu-item-shortcut">
              {{ item.shortcut }}
            </span>
          </li>
          <div v-if="index < items.length - 1" class="context-menu-separator" v-bind="api.getSeparatorProps()" />
        </ul>
      </div>
    </Teleport>
  </div>
</template>
