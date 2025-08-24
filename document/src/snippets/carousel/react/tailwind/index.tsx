import * as carousel from '@destyler/carousel'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function Carousel() {
  const items = [
    'https://images.unsplash.com/photo-1620315808304-66597517f188?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1620837953336-8274c0623a3c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1606318005254-bdb2bcd14d34?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1619806629131-959b8fdc50a1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1617982324703-442ecdc0fbab?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ]


  const [state, send] = useMachine(
    carousel.machine({
      id: useId(),
      slideCount: items.length,
      spacing: '20px',
      slidesPerPage: 1,
    })
  )

  const api = carousel.connect(state, send, normalizeProps)

  return (
    <>
      <div
        {...api.getRootProps()}
        className="flex items-center justify-center flex-col gap-4 w-100 relative"
      >
        <div {...api.getItemGroupProps()} className="rounded-xl">
          {items.map((image, index) => (
            <div
              key={index}
              {...api.getItemProps({ index })}
              className='mt-0!'
            >
              <img src={image} alt="" className='mt-0!' />
            </div>
          ))}
        </div>
        <div
          {...api.getControlProps()}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center bg-dark rounded-md px-2 py-1 mt-0!"
        >
          <button
            {...api.getPrevTriggerProps()}
            className="w-4 h-4 text-light i-carbon:caret-left mt-0!"
          />
          <div {...api.getIndicatorGroupProps()} className="flex gap-2 mx-2 mt-0!">
            {Array.from({ length: api.pageSnapPoints.length }).map((_, index) => (
              <button
                key={index}
                {...api.getIndicatorProps({ index }) as any}
                className="w-2 h-2 bg-gray rounded-full data-[current]:bg-green mt-0!"
              />
            ))}
          </div>
          <button
            {...api.getNextTriggerProps()}
            className="w-4 h-4 text-light i-carbon:caret-right mt-0!"
          />
        </div>
      </div>
    </>
  )
}
