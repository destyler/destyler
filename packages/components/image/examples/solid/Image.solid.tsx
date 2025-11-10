/** @jsxImportSource solid-js */
import { imagesData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createSignal, createUniqueId } from 'solid-js'
import * as avatar from '../../index'
import '../style.css'

const images = imagesData.full
const getRandomImage = () => images[Math.floor(Math.random() * images.length)]

export default function Page() {
  const [state, send] = useMachine(avatar.machine({ id: createUniqueId() }))
  const [src, setSrc] = createSignal(images[0])
  const [showImage, setShowImage] = createSignal(true)

  const api = createMemo(() => avatar.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main class="image">
        <div {...api().getRootProps()}>
          <span {...api().getFallbackProps()}>PA</span>
          {showImage() && <img alt="" referrerPolicy="no-referrer" src={src()} {...api().getImageProps()} />}
        </div>

        <div class="controls">
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
