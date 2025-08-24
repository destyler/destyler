import * as carousel from '@destyler/carousel'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './index.css'

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
        className="carousel-root"
      >
        <div {...api.getItemGroupProps()} className="carousel-item-group">
          {items.map((image, index) => (
            <div
              key={index}
              {...api.getItemProps({ index })}
              className='carousel-item'
            >
              <img src={image} alt="" className='carousel-image' />
            </div>
          ))}
        </div>
        <div
          {...api.getControlProps()}
          className="carousel-control"
        >
          <button
            {...api.getPrevTriggerProps()}
            className="carousel-prev-button"
          />
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
            className="carousel-next-button"
          />
        </div>
      </div>
    </>
  )
}
