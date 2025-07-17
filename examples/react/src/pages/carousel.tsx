import * as carousel from '@destyler/carousel'
import { normalizeProps, useMachine } from '@destyler/react'
import { carouselControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/carousel.css'

export default function CarouselDemo() {
  const items = [
    'https://elonehoo.me/coffee/01.jpeg',
    'https://elonehoo.me/coffee/02.jpeg',
  ]

  const controls = useControls(carouselControls)

  const [state, send] = useMachine(
    carousel.machine({
      id: useId(),
      slideCount: items.length,
      spacing: '20px',
      slidesPerPage: 1,
      autoplay: false,
    }),
    {
      context: controls.context,
    },
  )

  const api = carousel.connect(state, send, normalizeProps)

  return (
    <>
      <div
        {...api.getRootProps()}
        className="carousel-root"
      >
        <div {...api.getItemGroupProps()} className="carousel-item-group">
          {items.map((image, index) => (
            <div
              key={index}
              {...api.getItemProps({ index })}
            >
              <img src={image} alt="" />
            </div>
          ))}
        </div>
        <div
          {...api.getControlProps()}
          className="carousel-control"
        >
          <button
            {...api.getPrevTriggerProps()}
            className="carousel-trigger"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="m20 24l-10-8l10-8z" /></svg>
          </button>
          <div {...api.getIndicatorGroupProps()} className="carousel-indicator-group">
            {Array.from({ length: api.pageSnapPoints.length }).map((_, index) => (
              <button
                key={index}
                {...api.getIndicatorProps({ index }) as any}
                className="carousel-indicator"
              />
            ))}
          </div>
          <button
            {...api.getNextTriggerProps()}
            className="carousel-trigger"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="m12 8l10 8l-10 8z" /></svg>
          </button>
        </div>
      </div>
      <div className="carousel-other-controls">
        <button className="button" onClick={() => api.scrollToIndex(1)}>
          Scroll to 1
        </button>
        <button {...api.getAutoplayTriggerProps()} className="button">
          { api.isPlaying ? 'Stop' : 'Play' }
        </button>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
