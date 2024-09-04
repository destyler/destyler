---
layout: docs
component: navigation
---

# Navigation

> A collection of links for navigating websites.

<Preview name="navigation" />

## Features

<Features :lists="[
  'Can be controlled or uncontrolled.',
  'Flexible layout structure with managed tab focus.',
  'Supports submenus.',
  'Optional active item indicator.',
  'Full keyboard navigation.',
  'Exposes CSS variables for advanced animation.',
  'Supports custom timings.',
]" />

## Install

<CodeGroupPackage name="@destyler/navigation" />

## Import

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue twoslash
// @noErrors
<script setup lang="ts">
import {
  NavigationContent,
  NavigationIndicator,
  NavigationItem,
  NavigationLink,
  NavigationList,
  NavigationRoot,
  NavigationSub,
  NavigationTrigger,
  NavigationViewport,
} from '@destyler/navigation'
</script>

<template>
  <NavigationRoot>
    <NavigationList>
      <NavigationItem>
        <NavigationTrigger />
        <NavigationContent>
          <NavigationLink />
        </NavigationContent>
      </NavigationItem>

      <NavigationItem>
        <NavigationLink />
      </NavigationItem>

      <NavigationItem>
        <NavigationTrigger />
        <NavigationContent>
          <NavigationSub>
            <NavigationList />
            <NavigationViewport />
          </NavigationSub>
        </NavigationContent>
      </NavigationItem>

      <NavigationIndicator />
    </NavigationList>

    <NavigationViewport />
  </NavigationRoot>
</template>
```

</template>

</CodePreview>

## API

### Root

<!--@include: ../../packages/components/navigation/.docs/root.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    }
  ]"
/>

### List

<!--@include: ../../packages/components/navigation/.docs/list.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    }
  ]"
/>

### Item

<!--@include: ../../packages/components/navigation/.docs/item.md-->

### Trigger

<!--@include: ../../packages/components/navigation/.docs/trigger.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    },
    {
      name: '[data-disabled]',
      value:`Present when disabled`
    }
  ]"
/>

### Content

<!--@include: ../../packages/components/navigation/.docs/content.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'open\' | \'closed\'`
    },
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
    {
      name: '[data-motion]',
      value:`\'to-start\' | \'to-end\' | \'from-start\' | \'from-end\'`
    }
  ]"
/>

### Link

<!--@include: ../../packages/components/navigation/.docs/link.md-->

<Attribute
  :value="[
    {
      name: '[data-active]',
      value:`Present when active`
    },
  ]"
/>

### Sub

<!--@include: ../../packages/components/navigation/.docs/sub.md-->

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    }
  ]"
/>

### Viewport

<!--@include: ../../packages/components/navigation/.docs/viewport.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'visible\' | \'hidden\'`
    },
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>

<Variable
  :value="[
    {
      name: '--destyler-navigation-viewport-width',
      description:`The width of the viewport when visible/hidden, computed from the active content`
    },
    {
      name: '--destyler-navigation-viewport-height',
      description:`The height of the viewport when visible/hidden, computed from the active content`
    },
  ]"
/>

### Indicator

<!--@include: ../../packages/components/navigation/.docs/indicator.md-->

<Attribute
  :value="[
    {
      name: '[data-state]',
      value:`\'visible\' | \'hidden\'`
    },
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>
