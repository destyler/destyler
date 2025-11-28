import type { ReactNode } from 'react'
import { normalizeProps, Portal, useMachine } from '@destyler/react'
import { tourControls, tourData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId, useState } from 'react'
import { createPortal } from 'react-dom'
import * as tour from '../../index'
import '../style.css'

interface FrameProps {
  children: ReactNode
}

function InlineFrame({ children }: FrameProps) {
  const [frame, setFrame] = useState<HTMLIFrameElement | null>(null)
  const mountNode = frame?.contentDocument?.body
  const frameId = useId()

  return (
    <iframe
      ref={setFrame}
      title={`tour-frame-${frameId}`}
      className="tour__frame"
    >
      {mountNode ? createPortal(<div className="tour__frame-inner">{children}</div>, mountNode) : null}
    </iframe>
  )
}

export default function Page() {
  const controls = useControls(tourControls)

  const [state, send] = useMachine(
    tour.machine({
      id: useId(),
      steps: tourData,
    }),
    {
      context: controls.context,
    },
  )

  const api = tour.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main className="tour">
        <section>
          <button className="tour__start" onClick={() => api.start()}>
            Start Tour
          </button>

          <div className="steps__container">
            <h3 id="step-1">Step 1 · Welcome</h3>

            <div className="overflow__container">
              <div className="h-200px" />
              <h3 id="step-2">Step 2 · Scroll-aware</h3>
              <div className="h-100px" />
            </div>

            <InlineFrame>
              <h1 id="step-2a">Iframe Content</h1>
              <p>Guided tours can highlight elements rendered inside embedded contexts.</p>
              <p>We use Floating UI to keep the tooltip aligned even when the frame scrolls.</p>
            </InlineFrame>

            <h3 id="step-3">Step 3 · Normal flow</h3>
            <h3 id="step-4">Step 4 · Near the bottom</h3>
          </div>
        </section>

        {api.step && api.open && (
          <Portal>
            <div>
              {api.step.backdrop && <div {...api.getBackdropProps()} />}
              <div {...api.getSpotlightProps()} />
              <div {...api.getPositionerProps()}>
                <div {...api.getContentProps()}>
                  {api.step.arrow && (
                    <div {...api.getArrowProps()}>
                      <div {...api.getArrowTipProps()} />
                    </div>
                  )}

                  <p {...api.getTitleProps()}>{api.step.title}</p>
                  <div {...api.getDescriptionProps()}>{api.step.description}</div>
                  <div {...api.getProgressTextProps()}>{api.getProgressText()}</div>

                  {api.step.actions?.length
                    ? (
                        <div className="tour button__group">
                          {api.step.actions.map(action => (
                            <button key={action.label} {...api.getActionTriggerProps({ action })}>
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )
                    : null}

                  <button {...api.getCloseTriggerProps()}>
                    ×
                  </button>
                </div>
              </div>
            </div>
          </Portal>
        )}
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} omit={['steps']} />
      </Toolbar>
    </Layout>
  )
}
