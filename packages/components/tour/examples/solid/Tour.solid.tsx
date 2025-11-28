/** @jsxImportSource solid-js */
import type { JSX, ParentProps } from 'solid-js'
import { tourControls, tourData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { children, createMemo, createSignal, createUniqueId, For, onCleanup, onMount, Show, splitProps } from 'solid-js'
import { Portal, render } from 'solid-js/web'
import * as tour from '../../index'
import '../style.css'

type FrameProps = ParentProps<JSX.IframeHTMLAttributes<HTMLIFrameElement>>

function InlineFrame(props: FrameProps) {
  const [local, frameProps] = splitProps(props, ['children'])
  const [ref, setRef] = createSignal<HTMLIFrameElement>()
  const resolved = children(() => local.children)

  onMount(() => {
    let timer: ReturnType<typeof setInterval> | undefined

    const mount = () => {
      const body = ref()?.contentDocument?.body
      if (!body)
        return

      if (body.childElementCount === 0)
        render(() => <div class="tour__frame-inner">{resolved()}</div>, body)

      if (timer) {
        clearInterval(timer)
        timer = undefined
      }
    }

    mount()

    if (!ref()?.contentDocument?.body)
      timer = setInterval(mount, 16)

    onCleanup(() => timer && clearInterval(timer))
  })

  return <iframe ref={setRef} title={createUniqueId()} class="tour__frame" {...frameProps} />
}

export default function Page() {
  const controls = useControls(tourControls)

  const [state, send] = useMachine(
    tour.machine({
      id: createUniqueId(),
      steps: tourData,
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => tour.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main class="tour">
        <section>
          <button class="tour__start" onClick={() => api().start()}>
            Start Tour
          </button>

          <div class="steps__container">
            <h3 id="step-1">Step 1 · Welcome</h3>

            <div class="overflow__container">
              <div class="h-200px" />
              <h3 id="step-2">Step 2 · Scroll-aware</h3>
              <div class="h-100px" />
            </div>

            <InlineFrame>
              <h1 id="step-2a">Iframe Content</h1>
              <p>Solid tours can highlight DOM living inside iframes.</p>
              <p>Floating UI keeps the tooltip aligned even when the frame scrolls.</p>
            </InlineFrame>

            <h3 id="step-3">Step 3 · Normal flow</h3>
            <h3 id="step-4">Step 4 · Near the bottom</h3>
          </div>
        </section>

        <Show when={api().step && api().open}>
          <Portal>
            <div>
              <Show when={api().step?.backdrop}>
                <div {...api().getBackdropProps()} />
              </Show>
              <div {...api().getSpotlightProps()} />
              <div {...api().getPositionerProps()}>
                <div {...api().getContentProps()}>
                  <Show when={api().step?.arrow}>
                    <div {...api().getArrowProps()}>
                      <div {...api().getArrowTipProps()} />
                    </div>
                  </Show>

                  <p {...api().getTitleProps()}>{api().step!.title}</p>
                  <div {...api().getDescriptionProps()}>{api().step!.description}</div>
                  <div {...api().getProgressTextProps()}>{api().getProgressText()}</div>

                  <Show when={api().step?.actions?.length}>
                    <div class="tour button__group">
                      <For each={api().step?.actions}>
                        {action => (
                          <button {...api().getActionTriggerProps({ action })}>
                            {action.label}
                          </button>
                        )}
                      </For>
                    </div>
                  </Show>

                  <button {...api().getCloseTriggerProps()}>
                    ×
                  </button>
                </div>
              </div>
            </div>
          </Portal>
        </Show>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} omit={['steps']} />
      </Toolbar>
    </Layout>
  )
}
