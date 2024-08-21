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
      Open
    </DropdownTrigger>
    <DropdownPortal>
      <DropdownContent
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
        data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        :side-offset="5"
      >
        <DropdownLabel
          p="x-2 y-1.5"
          text="sm primary"
          font="semibold"
        >
          My Account
        </DropdownLabel>

        <DropdownSeparator
          m="x--1 y-1"
          h="px"
          bg="muted"
        />

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
                <Icon
                  v-if="item.icon"
                  :name="item.icon"
                  m="r-2"
                  h="4"
                  w="4"
                />
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
                  <Icon
                    name="lucide-check"
                    h="4"
                    w="4"
                  />
                </DropdownItemIndicator>
                {{ item.label }}
                <Shortcut v-if="item.shortcut">
                  {{ item.shortcut }}
                </Shortcut>
              </DropdownCheckboxItem>
              <Sub v-if="item.type === 'sub'" :items="item" />
            </template>
          </DropdownGroup>
          <DropdownSeparator
            v-if="index < items.length - 1"
            m="x--1 y-1"
            h="px"
            bg="muted"
          />
        </template>

        <DropdownArrow class="fill-white" />
      </DropdownContent>
    </DropdownPortal>
  </DropdownRoot>
</template>
