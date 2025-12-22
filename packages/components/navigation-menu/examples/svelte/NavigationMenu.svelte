<script lang="ts">
  import * as navigationMenu from "../../index"
  import { navigationMenuControls } from "@destyler/shared-private"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(navigationMenuControls)

  const id = $props.id()

  const [snapshot, send] = useMachine(navigationMenu.machine({ id }), {
    context: controls.context,
  })

  const api = $derived(navigationMenu.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main>
    <nav {...api.getRootProps()}>
      <ul {...api.getListProps()}>
        <li {...api.getItemProps({ value: 'getting-started' })}>
          <button {...api.getTriggerProps({ value: 'getting-started' })}>
            Getting started
          </button>
        </li>
        <li {...api.getItemProps({ value: 'components' })}>
          <button {...api.getTriggerProps({ value: 'components' })}>
            Components
          </button>
        </li>
        <li {...api.getItemProps({ value: 'docs' })}>
          <a {...api.getLinkProps({ value: 'docs' })} href="#">
            Documentation
          </a>
        </li>
      </ul>

      <div {...api.getViewportPositionerProps()}>
        {#if api.open}
          <div {...api.getViewportProps()}>
            <div {...api.getContentProps({ value: 'getting-started' })}>
              <ul class="nav-content-list">
                <li class="nav-content-item-featured">
                  <a {...api.getLinkProps({ value: 'radix' })} href="#" class="nav-featured-link">
                    <div class="nav-featured-icon">🎨</div>
                    <div class="nav-featured-title">shadcn/ui</div>
                    <p class="nav-featured-desc">
                      Beautifully designed components built with Radix UI and Tailwind CSS.
                    </p>
                  </a>
                </li>
                <li>
                  <a {...api.getLinkProps({ value: 'intro' })} href="#" class="nav-link-item">
                    <div class="nav-link-title">Introduction</div>
                    <p class="nav-link-desc">Re-usable components built using Radix UI and Tailwind CSS.</p>
                  </a>
                </li>
                <li>
                  <a {...api.getLinkProps({ value: 'install' })} href="#" class="nav-link-item">
                    <div class="nav-link-title">Installation</div>
                    <p class="nav-link-desc">How to install dependencies and structure your app.</p>
                  </a>
                </li>
                <li>
                  <a {...api.getLinkProps({ value: 'typography' })} href="#" class="nav-link-item">
                    <div class="nav-link-title">Typography</div>
                    <p class="nav-link-desc">Styles for headings, paragraphs, lists...etc</p>
                  </a>
                </li>
              </ul>
            </div>

            <div {...api.getContentProps({ value: 'components' })}>
              <ul class="nav-content-grid">
                <li>
                  <a {...api.getLinkProps({ value: 'alert-dialog' })} href="#" class="nav-link-item">
                    <div class="nav-link-title">Alert Dialog</div>
                    <p class="nav-link-desc">A modal dialog that interrupts the user.</p>
                  </a>
                </li>
                <li>
                  <a {...api.getLinkProps({ value: 'hover-card' })} href="#" class="nav-link-item">
                    <div class="nav-link-title">Hover Card</div>
                    <p class="nav-link-desc">For sighted users to preview content.</p>
                  </a>
                </li>
                <li>
                  <a {...api.getLinkProps({ value: 'progress' })} href="#" class="nav-link-item">
                    <div class="nav-link-title">Progress</div>
                    <p class="nav-link-desc">Displays an indicator of progress.</p>
                  </a>
                </li>
                <li>
                  <a {...api.getLinkProps({ value: 'scroll-area' })} href="#" class="nav-link-item">
                    <div class="nav-link-title">Scroll-area</div>
                    <p class="nav-link-desc">Visually or semantically separates content.</p>
                  </a>
                </li>
                <li>
                  <a {...api.getLinkProps({ value: 'tabs' })} href="#" class="nav-link-item">
                    <div class="nav-link-title">Tabs</div>
                    <p class="nav-link-desc">A set of layered sections of content.</p>
                  </a>
                </li>
                <li>
                  <a {...api.getLinkProps({ value: 'tooltip' })} href="#" class="nav-link-item">
                    <div class="nav-link-title">Tooltip</div>
                    <p class="nav-link-desc">A popup that displays information.</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        {/if}
      </div>
    </nav>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>

</Layout>
