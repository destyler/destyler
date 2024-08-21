// @noErrors
<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import {
  DropdownArrow,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownItemIndicator,
  DropdownLabel,
  DropdownPortal,
  DropdownRoot,
  DropdownSeparator,
  DropdownTrigger,
} from '@destyler/dropdown'
import Shortcut from './Shortcut.vue'
import Sub from './Sub.vue'
import './style.css'

const items = ref([
  [
    {
      value: 'profile',
      label: 'Profile',
      icon: 'lucide-user',
      type: 'item',
      shortcut: '⇧⌘P',
    },
    {
      value: 'billing',
      label: 'Billing',
      icon: 'lucide-credit-card',
      type: 'item',
      shortcut: '⌘B',
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: 'lucide-settings',
      type: 'item',
      shortcut: '⌘S',
    },
    {
      value: 'feature',
      icon: 'lucide-sparkles',
      type: 'sub',
      label: 'Feature',
      child: [
        {
          value: 'colorblind-themes',
          label: 'Colorblind Themes',
          type: 'check',
          checked: false,
        },
        {
          value: 'command-palette',
          label: 'Command Palette',
          type: 'check',
          checked: false,
        },
        {
          value: 'rich-jupyter-notebook-diffs',
          label: 'Rich Jupyter Notebook Diffs',
          type: 'check',
          checked: true,
        },
        {
          value: 'enhanced-repos-insights-views',
          label: 'Enhanced Repos Insights Views',
          type: 'check',
          checked: true,
        },
        {
          value: 'slash-commands',
          label: 'Slash Commands',
          type: 'check',
          checked: true,
        },
      ],
    },
    {
      value: 'keyboard-shortcuts',
      label: 'Keyboard Shortcuts',
      icon: 'lucide-keyboard',
      type: 'item',
      shortcut: '⌘K',
    },
  ],
  [
    {
      value: 'team',
      icon: 'lucide-users',
      label: 'Team',
      type: 'item',
    },
    {
      value: 'invite-users',
      icon: 'lucide-user-plus',
      label: 'Invite Users',
      type: 'sub',
      child: [
        {
          value: 'email',
          icon: 'lucide-mail',
          label: 'Email',
          type: 'item',
        },
        {
          value: 'message',
          icon: 'lucide-message-square',
          label: 'Message',
          type: 'item',
        },
      ],
    },
    {
      value: 'new-team',
      icon: 'lucide-plus',
      label: 'New Team',
      shortcut: '⌘+T',
      type: 'item',
    },
  ],
  [
    {
      value: 'github',
      icon: 'lucide-github',
      label: 'GitHub',
      type: 'item',
    },
    {
      value: 'support',
      icon: 'lucide-paintbrush',
      label: 'Support',
      type: 'sub',
      radio: true,
      model: 'vue',
      child: [
        {
          value: 'vue',
          label: 'Vue.js',
          type: 'item',
        },
        {
          value: 'react',
          label: 'React.js',
          type: 'item',
        },
        {
          value: 'angular',
          label: 'Angular.js',
          type: 'item',
        },
      ],
    },
    {
      value: 'api',
      icon: 'lucide-cloud',
      label: 'API',
      type: 'item',
      disabled: true,
    },
  ],
  [
    {
      value: 'log-out',
      label: 'Log Out',
      icon: 'lucide-log-out',
      type: 'item',
      shortcut: '⇧⌘Q',
    },
  ],
])
</script>

<template>
  <DropdownRoot>
    <DropdownTrigger
      class="button"
    >
      Open
    </DropdownTrigger>
    <DropdownPortal>
      <DropdownContent
        class="content"
        :side-offset="5"
      >
        <DropdownLabel class="label">
          My Account
        </DropdownLabel>

        <DropdownSeparator class="separator" />

        <template v-for="(menu, index) in items" :key="index">
          <DropdownGroup :aria-key="index">
            <template
              v-for="item in menu"
              :key="item.value"
            >
              <DropdownItem
                v-if="item.type === 'item'"
                :value="item.value"
                :disabled="item.disabled || false"
                class="item"
              >
                <Icon v-if="item.icon" :name="item.icon" class="icon" />
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
          </DropdownGroup>
          <DropdownSeparator v-if="index < items.length - 1" class="separator" />
        </template>

        <DropdownArrow fill="white" />
      </DropdownContent>
    </DropdownPortal>
  </DropdownRoot>
</template>
