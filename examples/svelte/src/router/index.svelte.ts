import AspectRatio from '../pages/aspect-ratio.svelte'
import HomePage from '../pages/index.svelte'

export const router = [
  { path: '/', component: HomePage },
  { path: '/aspect-ratio', component: AspectRatio },
]
