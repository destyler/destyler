/** @jsxImportSource solid-js */
import type { Component } from 'solid-js'
import { carouselControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as carousel from '../../index'
import '../style.css'

const CarouselDemo: Component = () => {
  const items = [
    'https://images.unsplash.com/photo-1620315808304-66597517f188?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1620837953336-8274c0623a3c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1606318005254-bdb2bcd14d34?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1619806629131-959b8fdc50a1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1617982324703-442ecdc0fbab?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ]

  const controls = useControls(carouselControls)

  const [state, send] = useMachine(
    carousel.machine({
      id: createUniqueId(),
      slideCount: items.length,
      spacing: '20px',
      slidesPerPage: 1,
      autoplay: false,
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => carousel.connect(state, send, normalizeProps))

  return (
    <Layout>
      <div {...api().getRootProps()}>
        <div {...api().getItemGroupProps()}>
          {items.map((image, index) => (
            <div {...api().getItemProps({ index })}>
              <img src={image} alt="" />
            </div>
          ))}
        </div>
        <div {...api().getControlProps()}>
          <button {...api().getPrevTriggerProps()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="m20 24l-10-8l10-8z" /></svg>
          </button>
          <div {...api().getIndicatorGroupProps()} class="carousel-indicator-group">
            {Array.from({ length: api().pageSnapPoints.length }).map((_, index) => (
              <button {...api().getIndicatorProps({ index })} />
            ))}
          </div>
          <button {...api().getNextTriggerProps()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="m12 8l10 8l-10 8z" /></svg>
          </button>
        </div>
      </div>
      <div class="carousel-spacer">
        <button class="button" onclick={() => api().scrollToIndex(1)}>
          Scroll to 1
        </button>
        <button {...api().getAutoplayTriggerProps()} class="button">
          { api().isPlaying ? 'Stop' : 'Play' }
        </button>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}

export default CarouselDemo
