import { normalizeProps, useMachine } from '@destyler/react'
import { imagesData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId, useState } from 'react'
import * as avatar from '../../index'
import '../style.css'

const images = imagesData.full
const getRandomImage = () => images[Math.floor(Math.random() * images.length)]

export default function Page() {
  const [state, send] = useMachine(avatar.machine({ id: useId() }))
  const [src, setSrc] = useState(images[0])
  const [showImage, setShowImage] = useState(true)

  const api = avatar.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main className="image">
        <div {...api.getRootProps()}>
          <span {...api.getFallbackProps()}>PA</span>
          {showImage && <img alt="" referrerPolicy="no-referrer" src={src} {...api.getImageProps()} />}
        </div>

        <div className="controls">
          <button onClick={() => setSrc(getRandomImage())}>Change Image</button>
          <button onClick={() => setSrc(imagesData.broken)}>Broken Image</button>
          <button onClick={() => setShowImage(c => !c)}>Toggle Image</button>
        </div>
      </main>

      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
