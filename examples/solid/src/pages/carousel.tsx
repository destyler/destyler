/** @jsxImportSource solid-js */
import type { Component } from 'solid-js'
import * as carousel from '@destyler/carousel'
import { carouselControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/carousel.css'

const CarouselDemo: Component = () => {
  const items = [
    'https://elonehoo.me/coffee/01.jpeg',
    'https://elonehoo.me/coffee/02.jpeg',
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
    <>
      <div
        {...api().getRootProps()}
        class="carousel-root"
      >
        <div {...api().getItemGroupProps()} class="carousel-item-group">
          {items.map((image, index) => (
            <div
              {...api().getItemProps({ index })}
            >
              <img src={image} alt="" />
            </div>
          ))}
        </div>
        <div
          {...api().getControlProps()}
          class="carousel-control"
        >
          <button
            {...api().getPrevTriggerProps()}
            class="carousel-trigger"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="m20 24l-10-8l10-8z" /></svg>
          </button>
          <div {...api().getIndicatorGroupProps()} class="carousel-indicator-group">
            {Array.from({ length: api().pageSnapPoints.length }).map((_, index) => (
              <button
                {...api().getIndicatorProps({ index })}
                class="carousel-indicator"
              />
            ))}
          </div>
          <button
            {...api().getNextTriggerProps()}
            class="carousel-trigger"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="m12 8l10 8l-10 8z" /></svg>
          </button>
        </div>
      </div>
      <div class="carousel-other-controls">
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
    </>
  )
}

export default CarouselDemo
