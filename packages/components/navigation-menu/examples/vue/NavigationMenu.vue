<script setup lang="ts">
import { navigationMenuControls } from '@destyler/shared-private'
import { Controls, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import * as navigationMenu from '../../index'
import '../style.css'

const controls = useControls(navigationMenuControls)

const [state, send] = useMachine(navigationMenu.machine({
  id: useId(),
}), {
  context: controls.context,
})

const api = computed(() => navigationMenu.connect(state.value, send, normalizeProps))
</script>

<template>
  <Layout>
    <main>
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
              <ul class="nav-content-list">
                <li class="nav-content-item-featured">
                  <a v-bind="api.getLinkProps({ value: 'radix' })" href="#" class="nav-featured-link">
                    <div class="nav-featured-icon">🎨</div>
                    <div class="nav-featured-title">shadcn/ui</div>
                    <p class="nav-featured-desc">
                      Beautifully designed components built with Radix UI and Tailwind CSS.
                    </p>
                  </a>
                </li>
                <li>
                  <a v-bind="api.getLinkProps({ value: 'intro' })" href="#" class="nav-link-item">
                    <div class="nav-link-title">Introduction</div>
                    <p class="nav-link-desc">Re-usable components built using Radix UI and Tailwind CSS.</p>
                  </a>
                </li>
                <li>
                  <a v-bind="api.getLinkProps({ value: 'install' })" href="#" class="nav-link-item">
                    <div class="nav-link-title">Installation</div>
                    <p class="nav-link-desc">How to install dependencies and structure your app.</p>
                  </a>
                </li>
                <li>
                  <a v-bind="api.getLinkProps({ value: 'typography' })" href="#" class="nav-link-item">
                    <div class="nav-link-title">Typography</div>
                    <p class="nav-link-desc">Styles for headings, paragraphs, lists...etc</p>
                  </a>
                </li>
              </ul>
            </div>

            <div v-bind="api.getContentProps({ value: 'components' })">
              <ul class="nav-content-grid">
                <li>
                  <a v-bind="api.getLinkProps({ value: 'alert-dialog' })" href="#" class="nav-link-item">
                    <div class="nav-link-title">Alert Dialog</div>
                    <p class="nav-link-desc">A modal dialog that interrupts the user.</p>
                  </a>
                </li>
                <li>
                  <a v-bind="api.getLinkProps({ value: 'hover-card' })" href="#" class="nav-link-item">
                    <div class="nav-link-title">Hover Card</div>
                    <p class="nav-link-desc">For sighted users to preview content.</p>
                  </a>
                </li>
                <li>
                  <a v-bind="api.getLinkProps({ value: 'progress' })" href="#" class="nav-link-item">
                    <div class="nav-link-title">Progress</div>
                    <p class="nav-link-desc">Displays an indicator of progress.</p>
                  </a>
                </li>
                <li>
                  <a v-bind="api.getLinkProps({ value: 'scroll-area' })" href="#" class="nav-link-item">
                    <div class="nav-link-title">Scroll-area</div>
                    <p class="nav-link-desc">Visually or semantically separates content.</p>
                  </a>
                </li>
                <li>
                  <a v-bind="api.getLinkProps({ value: 'tabs' })" href="#" class="nav-link-item">
                    <div class="nav-link-title">Tabs</div>
                    <p class="nav-link-desc">A set of layered sections of content.</p>
                  </a>
                </li>
                <li>
                  <a v-bind="api.getLinkProps({ value: 'tooltip' })" href="#" class="nav-link-item">
                    <div class="nav-link-title">Tooltip</div>
                    <p class="nav-link-desc">A popup that displays information.</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </main>

    <Toolbar>
      <StateVisualizer :state="state" />
      <template #controls>
        <Controls :control="controls" />
      </template>
    </Toolbar>
  </Layout>
</template>
