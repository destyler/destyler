import AspectRatio from '../pages/aspect-ratio.svelte'
import Breadcrumbs from '../pages/breadcrumbs.svelte'
import Calendar from '../pages/calendar.svelte'
import HomePage from '../pages/index.svelte'

export const router = [
  { path: '/', component: HomePage },
  { path: '/aspect-ratio', component: AspectRatio },
  { path: '/breadcrumbs', component: Breadcrumbs },
  { path: '/calendar', component: Calendar },
]
