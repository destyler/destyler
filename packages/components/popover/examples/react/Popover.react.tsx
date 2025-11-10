import { normalizeProps, Portal, useMachine } from '@destyler/react'
import { popoverControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { Fragment, useId } from 'react'
import * as popover from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(popoverControls)

  const [state, send] = useMachine(
    popover.machine({
      id: useId(),
    }),
    {
      context: controls.context,
    },
  )

  const api = popover.connect(state, send, normalizeProps)

  const Wrapper = api.portalled ? Portal : Fragment

  return (
    <Layout>
      <main className="popover">
        <div data-part="root">
          <button data-testid="button-before">Button :before</button>

          <button data-testid="popover-trigger" {...api.getTriggerProps()}>
            Click me
            <div {...api.getIndicatorProps()}>{'>'}</div>
          </button>

          <div {...api.getAnchorProps()}>anchor</div>

          <Wrapper>
            <div {...api.getPositionerProps()}>
              <div data-testid="popover-content" className="popover-content" {...api.getContentProps()}>
                <div {...api.getArrowProps()}>
                  <div {...api.getArrowTipProps()} />
                </div>
                <div data-testid="popover-title" {...api.getTitleProps()}>
                  Popover Title
                </div>
                <div data-part="body" data-testid="popover-body">
                  <a>Non-focusable Link</a>
                  <a href="#" data-testid="focusable-link">
                    Focusable Link
                  </a>
                  <input data-testid="input" placeholder="input" />
                  <button data-testid="popover-close-button" {...api.getCloseTriggerProps()}>
                    X
                  </button>
                </div>
              </div>
            </div>
          </Wrapper>
          <span data-testid="plain-text">I am just text</span>
          <button data-testid="button-after">Button :after</button>
        </div>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
