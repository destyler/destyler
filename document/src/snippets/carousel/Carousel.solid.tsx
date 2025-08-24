/** @jsxImportSource solid-js */
import type { Component } from 'solid-js'
import * as carousel from '@destyler/carousel'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

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
        class="flex items-center justify-center flex-col gap-4 w-100 relative"
      >
        <div {...api().getItemGroupProps()} class="rounded-xl">
          {items.map((image, index) => (
            <div
              {...api().getItemProps({ index })}
              class='mt-0!'
            >
              <img src={image} alt="" class="rounded-xl mt-0!" />
            </div>
          ))}
        </div>
        <div
          {...api().getControlProps()}
          class="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center bg-dark rounded-md px-2 py-1 mt-0!"
        >
          <button
            {...api().getPrevTriggerProps()}
            class="w-4 h-4 text-light i-carbon:caret-left"
          />
          <div {...api().getIndicatorGroupProps()} class="flex gap-2 mx-2  mt-0!">
            {Array.from({ length: api().pageSnapPoints.length }).map((_, index) => (
              <button
                {...api().getIndicatorProps({ index })}
                class="w-2 h-2 bg-gray rounded-full data-[current]:bg-green mt-0!"
              />
            ))}
          </div>
          <button
            {...api().getNextTriggerProps()}
            class="w-4 h-4 text-light i-carbon:caret-right mt-0!"
          />
        </div>
      </div>
    </>
  )
}

export default Carousel
