/** @jsxImportSource solid-js */
import type { Component } from 'solid-js'
import * as carousel from '@destyler/carousel'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

const Carousel: Component = () => {
  const items = [
    'https://images.unsplash.com/photo-1620315808304-66597517f188?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1620837953336-8274c0623a3c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1606318005254-bdb2bcd14d34?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1619806629131-959b8fdc50a1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1617982324703-442ecdc0fbab?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ]


  const [state, send] = useMachine(
    carousel.machine({
      id: createUniqueId(),
      slideCount: items.length,
      spacing: '20px',
    }))

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
              class='carousel-item'
            >
              <img src={image} alt="" class="carousel-image" />
            </div>
          ))}
        </div>
        <div
          {...api().getControlProps()}
          class="carousel-control"
        >
          <button
            {...api().getPrevTriggerProps()}
            class="carousel-prev-button"
          />
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
            class="carousel-next-button"
          />
        </div>
      </div>
    </>
  )
}

export default Carousel
