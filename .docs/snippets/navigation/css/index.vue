<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import {
  NavigationContent,
  NavigationItem,
  NavigationLink,
  NavigationList,
  NavigationRoot,
  NavigationTrigger,
  NavigationViewport,
} from '@destyler/navigation'
import ListItem from './ListItem.vue'
import './style.css'

const components = ref<{ title: string, description: string }[]>(
  [
    {
      title: 'Modal',
      description:
      'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
      title: 'Hover Card',
      description:
      'For sighted users to preview content available behind a link.',
    },
    {
      title: 'Progress',
      description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    },
    {
      title: 'Scroll-area',
      description: 'Visually or semantically separates content.',
    },
    {
      title: 'Tabs',
      description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    },
    {
      title: 'Tooltip',
      description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    },
  ],
)
</script>

<template>
  <NavigationRoot class="navigation-root">
    <NavigationList class="navigation-list">
      <NavigationItem>
        <NavigationTrigger
          class="navigation-trigger"
        >
          Getting started
          <Icon
            name="carbon:chevron-down"
            class="chevron-down-icon"
            aria-hidden="true"
          />
        </NavigationTrigger>

        <NavigationContent
          class="navigation-content"
        >
          <ul class="content-ul">
            <li class="row-span-3">
              <NavigationLink class="navigation-link" href="/">
                <Logo
                  class="logo"
                />
                <div class="title-typography">
                  destyler
                </div>
                <p class="desc-typography">
                  unstyled component for vue.
                </p>
              </NavigationLink>
            </li>
            <ListItem href="/docs" title="Introduction">
              Re-usable components built using Destyler UI and CSS.
            </ListItem>
            <ListItem href="/docs/installation" title="Installation">
              How to install dependencies and structure your app.
            </ListItem>
            <ListItem href="/" title="Colors">
              Beautiful, thought-out palettes with auto dark mode.
            </ListItem>
          </ul>
        </NavigationContent>
      </NavigationItem>
      <NavigationItem>
        <NavigationTrigger
          class="navigation-trigger"
        >
          Components
          <Icon
            name="carbon:chevron-down"
            class="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </NavigationTrigger>
        <NavigationContent
          class="navigation-content"
        >
          <ul class="content-ul">
            <ListItem v-for="component in components" :key="component.title" :title="component.title">
              {{ component.description }}
            </ListItem>
          </ul>
        </NavigationContent>
      </NavigationItem>
      <NavigationItem>
        <NavigationLink
          class="navigation-trigger"
        >
          Documentation
        </NavigationLink>
      </NavigationItem>
    </NavigationList>
    <div class="viewport-position">
      <NavigationViewport
        class="navigation-viewport"
      />
    </div>
  </NavigationRoot>
</template>
