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
  <NavigationRoot
    relative="~"
    z="10"
    flex="~ 1"
    max-w="max"
    items="center"
    justify="center"
  >
    <NavigationList
      group="~"
      flex="~ 1"
      list="none"
      items="center"
      justify="center"
      space="x-1"
    >
      <NavigationItem>
        <NavigationTrigger
          group="~"
          inline="flex"
          h="10"
          w="max"
          items="center"
          justify="center"
          rounded="md"
          bg="#F8F8F8 dark:#1C1C1C hover:accent focus:accent data-[active]:accent/50 data-[state=open]:accent/50"
          p="x-4 y-2"
          text="sm accent-foreground"
          font="medium"
          transition="colors"
          outline="focus:none"
          pointer-events="disabled:none"
          op="disabled:50"
        >
          Getting started
          <Icon
            name="carbon:chevron-down"
            relative="~"
            top="1px"
            m="l-1"
            h="3"
            w="3"
            transition="~"
            duration="200"
            rotate="group-data-[state=open]:180"
            aria-hidden="true"
          />
        </NavigationTrigger>

        <NavigationContent
          left="0"
          top="0"
          w="full"
          md="absolute w-auto"
          class="
          data-[motion^=from-]:animate-in
          data-[motion^=to-]:animate-out
          data-[motion^=from-]:fade-in
          data-[motion^=to-]:fade-out
          data-[motion=from-end]:slide-in-from-right-52
          data-[motion=from-start]:slide-in-from-left-52
          data-[motion=to-end]:slide-out-to-right-52
          data-[motion=to-start]:slide-out-to-left-52
          "
        >
          <ul
            grid="~"
            w="400px"
            gap="3"
            p="4"
            md="w-500px grid-cols-2"
            lg="w-600px"
          >
            <li
              row-span="3"
            >
              <NavigationLink
                flex="~ col"
                h="full"
                w="full"
                select="none"
                justify="end"
                rounded="md"
                p="6"
                no-underline="~"
                outline="none"
                focus="shadow-md"
                class="bg-gradient-to-b from-muted/50 to-muted"
                href="/"
              >
                <Logo
                  h="12"
                  w="12"
                  src="https://github.com/destyler.png"
                />
                <div
                  m="b-2 t-4"
                  text="lg"
                  font="medium"
                >
                  destyler
                </div>
                <p
                  text="sm muted-foreground"
                  leading="tight"
                >
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
          group="~"
          inline="flex"
          h="10"
          w="max"
          items="center"
          justify="center"
          rounded="md"
          bg="#F8F8F8 dark:#1C1C1C hover:accent focus:accent data-[active]:accent/50 data-[state=open]:accent/50"
          p="x-4 y-2"
          text="sm accent-foreground"
          font="medium"
          transition="colors"
          outline="focus:none"
          pointer-events="disabled:none"
          op="disabled:50"
        >
          Components
          <Icon
            name="carbon:chevron-down"
            relative="~"
            top="1px"
            m="l-1"
            h="3"
            w="3"
            transition="~"
            duration="200"
            rotate="group-data-[state=open]:180"
            aria-hidden="true"
          />
        </NavigationTrigger>
        <NavigationContent
          left="0"
          top="0"
          w="full"
          md="absolute w-auto"
          class="
          data-[motion^=from-]:animate-in
          data-[motion^=to-]:animate-out
          data-[motion^=from-]:fade-in
          data-[motion^=to-]:fade-out
          data-[motion=from-end]:slide-in-from-right-52
          data-[motion=from-start]:slide-in-from-left-52
          data-[motion=to-end]:slide-out-to-right-52
          data-[motion=to-start]:slide-out-to-left-52
          "
        >
          <ul
            grid="~"
            w="400px"
            gap="3"
            p="4"
            md="w-500px grid-cols-2"
            lg="w-600px"
          >
            <ListItem v-for="component in components" :key="component.title" :title="component.title">
              {{ component.description }}
            </ListItem>
          </ul>
        </NavigationContent>
      </NavigationItem>
      <NavigationItem>
        <NavigationLink
          group="~"
          inline="flex"
          h="10"
          w="max"
          items="center"
          justify="center"
          rounded="md"
          bg="#F8F8F8 dark:#1C1C1C hover:accent focus:accent data-[active]:accent/50 data-[state=open]:accent/50"
          p="x-4 y-2"
          text="sm accent-foreground"
          font="medium"
          transition="colors"
          outline="focus:none"
          pointer-events="disabled:none"
          op="disabled:50"
        >
          Documentation
        </NavigationLink>
      </NavigationItem>
    </NavigationList>
    <div class="absolute left-0 top-full flex justify-center">
      <NavigationViewport
        relative="~"
        m="t-1.5"
        w="full md:[var(--destyler-navigation-viewport-width)]"
        h="[var(--destyler-navigation-viewport-height)]"
        overflow="hidden"
        rounded="md"
        border="~"
        bg="popover"
        text="popover-foreground"
        shadow="lg"
        class="
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=closed]:zoom-out-95
        data-[state=open]:zoom-in-90
        "
      />
    </div>
  </NavigationRoot>
</template>
