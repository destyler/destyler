<script setup lang="ts">
import * as navigationMenu from '@destyler/navigation-menu'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import './style.css'

const [state, send] = useMachine(navigationMenu.machine({ id: useId() }))

const api = computed(() => navigationMenu.connect(state.value, send, normalizeProps))
</script>

<template>
  <nav v-bind="api.getRootProps()">
    <ul v-bind="api.getListProps()">
      <li v-bind="api.getItemProps({ value: 'getting-started' })">
        <button v-bind="api.getTriggerProps({ value: 'getting-started' })">
          Getting started
        </button>
      </li>
      <li v-bind="api.getItemProps({ value: 'components' })">
        <button v-bind="api.getTriggerProps({ value: 'components' })">
          Components
        </button>
      </li>
      <li v-bind="api.getItemProps({ value: 'docs' })">
        <a v-bind="api.getLinkProps({ value: 'docs' })" href="#">
          Documentation
        </a>
      </li>
    </ul>

    <div v-bind="api.getViewportPositionerProps()">
      <div v-if="api.open" v-bind="api.getViewportProps()">
        <div v-bind="api.getContentProps({ value: 'getting-started' })">
          <ul class="grid grid-cols-1 gap-1.5 ml-0! p-0 m-0 mt-0! list-none w-full">
            <li class="mt-0!">
              <a v-bind="api.getLinkProps({ value: 'intro' })" href="#">
                <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Introduction</div>
                <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Framework-agnostic UI component library.</p>
              </a>
            </li>
            <li class="mt-0!">
              <a v-bind="api.getLinkProps({ value: 'install' })" href="#">
                <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Installation</div>
                <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">How to install and set up the library.</p>
              </a>
            </li>
            <li class="mt-0!">
              <a v-bind="api.getLinkProps({ value: 'styling' })" href="#">
                <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Styling</div>
                <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Style components with CSS or Tailwind.</p>
              </a>
            </li>
          </ul>
        </div>

        <div v-bind="api.getContentProps({ value: 'components' })">
          <ul class="grid grid-cols-2 gap-1.5 ml-0! p-0 m-0 mt-0! list-none w-full">
            <li class="mt-0!">
              <a v-bind="api.getLinkProps({ value: 'dialog' })" href="#">
                <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Dialog</div>
                <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">A modal dialog component.</p>
              </a>
            </li>
            <li class="mt-0!">
              <a v-bind="api.getLinkProps({ value: 'popover' })" href="#">
                <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Popover</div>
                <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Floating content anchored to trigger.</p>
              </a>
            </li>
            <li class="mt-0!">
              <a v-bind="api.getLinkProps({ value: 'tabs' })" href="#">
                <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Tabs</div>
                <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Organize content into tabs.</p>
              </a>
            </li>
            <li class="mt-0!">
              <a v-bind="api.getLinkProps({ value: 'tooltip' })" href="#">
                <div class="text-13px font-medium text-foreground mb-0.5 leading-tight mt-0!">Tooltip</div>
                <p class="text-12px text-muted-foreground leading-relaxed m-0 mt-0!">Display info on hover or focus.</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
