import * as carousel from '@destyler/carousel'
import { normalizeProps, useMachine } from '@destyler/react'
import { carouselControls } from '@destyler/shared'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

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
        className="flex items-center justify-center flex-col gap-4 w-100 relative"
      >
        <div {...api.getItemGroupProps()} className="rounded-xl">
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
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center bg-dark rounded-md px-2 py-1"
        >
          <button
            {...api.getPrevTriggerProps()}
            className="w-4 h-4 text-light i-carbon:caret-left"
          />
          <div {...api.getIndicatorGroupProps()} className="flex gap-2 mx-2">
            {Array.from({ length: api.pageSnapPoints.length }).map((_, index) => (
              <button
                key={index}
                {...api.getIndicatorProps({ index }) as any}
                className="w-2 h-2 bg-gray rounded-full data-[current]:bg-green"
              />
            ))}
          </div>
          <button
            {...api.getNextTriggerProps()}
            className="w-4 h-4 text-light i-carbon:caret-right"
          />
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
