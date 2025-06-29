import type { Component } from 'solid-js'
import * as carousel from '@destyler/carousel'
import { carouselControls } from '@destyler/shared-private'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'

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
        class="flex items-center justify-center flex-col gap-4 w-100 relative"
      >
        <div {...api().getItemGroupProps()} class="rounded-xl">
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
          class="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center bg-dark rounded-md px-2 py-1"
        >
          <button {...api().getAutoplayTriggerProps()}>{api().isPlaying ? 'Stop' : 'Play'}</button>
          <button
            {...api().getPrevTriggerProps()}
            class="w-4 h-4 text-light i-carbon:caret-left"
          />
          <div {...api().getIndicatorGroupProps()} class="flex gap-2 mx-2">
            {Array.from({ length: api().pageSnapPoints.length }).map((_, index) => (
              <button
                {...api().getIndicatorProps({ index })}
                class="w-2 h-2 bg-gray rounded-full data-[current]:bg-green"
              />
            ))}
          </div>
          <button
            {...api().getNextTriggerProps()}
            class="w-4 h-4 text-light i-carbon:caret-right"
          />
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default CarouselDemo
