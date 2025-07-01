import type { ReactElement } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { carouselControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as carousel from '../../index'

export function Carousel(): ReactElement {
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
      >
        <div {...api.getItemGroupProps()}>
          {items.map((image, index) => (
            <div
              key={index}
              {...api.getItemProps({ index })}
            >
              <img src={image} alt="" />
            </div>
          ))}
        </div>
        <button onClick={() => api.scrollToIndex(1)}>Scroll to 1</button>
        <div
          {...api.getControlProps()}
        >
          <button {...api.getAutoplayTriggerProps()}>{api.isPlaying ? 'Stop' : 'Play'}</button>
          <button
            {...api.getPrevTriggerProps()}
          />
          <div {...api.getIndicatorGroupProps()}>
            {Array.from({ length: api.pageSnapPoints.length }).map((_, index) => (
              <button
                key={index}
                {...api.getIndicatorProps({ index }) as any}
              />
            ))}
          </div>
          <button
            {...api.getNextTriggerProps()}
          />
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
