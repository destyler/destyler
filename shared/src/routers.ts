export interface RouteData {
  path: `/${string}`
  label: string
}

export const routes: RouteData[] = [
  {
    path: '/aspect-ratio',
    label: 'Aspect Ratio',
  },
  {
    path: '/breadcrumbs',
    label: 'Breadcrumbs',
  },
  {
    path: '/calendar',
    label: 'Calendar',
  },
  {
    path: '/carousel',
    label: 'Carousel',
  },
]
