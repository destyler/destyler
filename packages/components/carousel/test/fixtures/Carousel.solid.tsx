/** @jsxImportSource solid-js */

import { carouselControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as carousel from '../../index'

export function Carousel() {
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
      >
        <div {...api().getItemGroupProps()}>
          {items.map((image, index) => (
            <div
              {...api().getItemProps({ index })}
            >
              <img src={image} alt="" />
            </div>
          ))}
        </div>
        <button onClick={() => api().scrollToIndex(1)}>Scroll to 1</button>
        <div
          {...api().getControlProps()}
        >
          <button {...api().getAutoplayTriggerProps()}>{api().isPlaying ? 'Stop' : 'Play'}</button>
          <button
            {...api().getPrevTriggerProps()}
          />
          <div {...api().getIndicatorGroupProps()}>
            {Array.from({ length: api().pageSnapPoints.length }).map((_, index) => (
              <button
                {...api().getIndicatorProps({ index })}
              />
            ))}
          </div>
          <button
            {...api().getNextTriggerProps()}
          />
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
