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
      class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-primary/15 border-dashed hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus-visible:ring-2 focus-visible:ring-offset-2 text-sm cursor-default transition-colors"
    >
      <div class="text-primary">Open context menu</div>
    </button>
    <Teleport to="body">
      <div
        v-if="api.open"
        v-bind="api.getPositionerProps()"
        class="z-50! min-w-32 overflow-hidden rounded-md border border-border! w-56
        bg-popover p-1 text-popover-foreground shadow-md outline-none!
        focus:outline-none
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95
        data-[state=open]:zoom-in-95
        data-[side=bottom]:slide-in-from-top-2
        data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2
        data-[side=top]:slide-in-from-bottom-2"
      >
        <div class="px-2 py-1.5 text-sm font-semibold text-primary">
          My Account
        </div>
        <div class="-mx-1 my-1 h-px bg-muted" v-bind="api.getSeparatorProps()" />
        <ul
          v-for="(itemList, index) in items"
          :key="index"
          v-bind="api.getContentProps()"
          class="group p-1 pb-0 last:pb-1 outline-none!"
        >
          <li
            v-for="item in itemList"
            :key="item.value"
            v-bind="api.getItemProps({ value: item.value, disabled: item?.disabled })"
            class="relative flex select-none items-center rounded-sm
            px-2 py-1.5 text-sm outline-none transition-colors cursor-pointer
            data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground
            data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
          >
            <div class="mr-2 h-4 w-4" :class="item.icon" />
            {{ item.label }}
            <span v-if="item?.shortcut" class="ml-auto text-xs tracking-widest opacity-60">
              {{ item.shortcut }}
            </span>
          </li>
          <div v-if="index < items.length - 1" class="-mx-1 my-1 h-px bg-muted" v-bind="api.getSeparatorProps()" />
        </ul>
      </div>
    </Teleport>
  </div>
</template>
