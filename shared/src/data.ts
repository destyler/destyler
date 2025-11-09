import type { StepDetails } from '@destyler/tour'
import { countryList } from './country-list'

export const selectData = countryList.map(country => ({
  label: `${country.name} (${country.code})`,
  value: country.code,
}))

export const stepsData = [
  { value: 'first', title: 'First', description: 'Contact Info' },
  { value: 'second', title: 'Second', description: 'Date & Time' },
  { value: 'third', title: 'Third', description: 'Select Rooms' },
]

export const collapseData = [
  {
    id: 'watercraft',
    title: 'Watercraft',
    content: 'Experience the thrill of cutting-edge marine vessels, from luxury yachts to high-performance speedboats.',
  },
  {
    id: 'automobiles',
    title: 'Automobiles',
    content: 'Discover our premium selection of automobiles, featuring the latest in automotive technology and design.',
  },
  {
    id: 'aircraft',
    title: 'Aircraft',
    content: 'Explore our range of aircraft, from private jets to commercial airliners, all equipped with state-of-the-art technology.',
  },
]

export const radioData = [
  { id: 'apple', label: 'Apples' },
  { id: 'orange', label: 'Oranges' },
  { id: 'mango', label: 'Mangoes' },
  { id: 'grape', label: 'Grapes' },
]

export const imagesData = {
  full: [
    'https://images.unsplash.com/photo-1508791573065-57c595096106?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://plus.unsplash.com/premium_photo-1706838708757-90894d747ada?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    'https://images.unsplash.com/photo-1620837953336-8274c0623a3c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'https://images.unsplash.com/photo-1621237023000-6a628c285938?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  ],
  broken:
    'https://images.unsplash.com/photo-1589558928675-a09badc3a9fd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074',
}

export const listData = [
  { label: 'Zambia', code: 'ZA' },
  { label: 'Benin', code: 'BN' },
  { label: 'Canada', code: 'CA' },
  { label: 'United States', code: 'US' },
  { label: 'Japan', code: 'JP' },
  { label: 'Nigeria', code: 'NG' },
  { label: 'Albania', code: 'AL' },
  { label: 'Algeria', code: 'DZ' },
  { label: 'American Samoa', code: 'AS' },
  { label: 'Andorra', code: 'AD' },
  { label: 'Angola', code: 'AO' },
  { label: 'Anguilla', code: 'AI' },
  { label: 'Antarctica', code: 'AQ' },
  { label: 'Australia', code: 'AU' },
  { label: 'Austria', code: 'AT' },
  { label: 'Azerbaijan', code: 'AZ' },
  { label: 'Bahamas', code: 'BS' },
  { label: 'Bahrain', code: 'BH' },
  { label: 'Madagascar', code: 'MG' },
  { label: 'Malawi', code: 'MW' },
  { label: 'Malaysia', code: 'MY' },
  { label: 'Maldives', code: 'MV' },
  { label: 'Mali', code: 'ML' },
  { label: 'Malta', code: 'MT' },
  { label: 'Togo', code: 'TG' },
  { label: 'Tokelau', code: 'TK' },
  { label: 'Tonga', code: 'TO' },
  { label: 'Trinidad and Tobago', code: 'TT' },
  { label: 'Tunisia', code: 'TN' },
]

export const tourData: StepDetails[] = [
  {
    type: 'dialog',
    id: 'step-0',
    title: 'Centered tour (no target)',
    description: 'This is the center of the world. Ready to start the tour?',
    actions: [{ label: 'Next', action: 'next' }],
  },
  {
    type: 'tooltip',
    id: 'step-1',
    title: 'Step 1. Welcome',
    description: 'To the new world',
    target: () => document.querySelector<HTMLElement>('#step-1'),
    actions: [
      { label: 'Prev', action: 'prev' },
      { label: 'Next', action: 'next' },
    ],
    effect({ show, update }) {
      const abort = new AbortController()

      fetch('https://api.github.com/users/octocat', { signal: abort.signal })
        .then(res => res.json())
        .then((data) => {
          update({ title: data.name })
          show()
        })

      return () => {
        abort.abort()
      }
    },
  },
  {
    type: 'tooltip',
    id: 'step-2',
    title: 'Step 2. Inside a scrollable container',
    description: 'Using scrollIntoView(...) rocks!',
    target: () => document.querySelector<HTMLElement>('#step-2'),
    actions: [
      { label: 'Prev', action: 'prev' },
      { label: 'Next', action: 'next' },
    ],
  },
  {
    type: 'tooltip',
    id: 'step-2a',
    title: 'Step 2a. Inside an Iframe container',
    description: 'It calculates the offset rect correctly. Thanks to floating UI!',
    target: () => {
      const [frameEl] = Array.from(frames)
      return frameEl?.document.querySelector<HTMLElement>('#step-2a')
    },
    actions: [
      { label: 'Prev', action: 'prev' },
      { label: 'Next', action: 'next' },
    ],
  },
  {
    type: 'tooltip',
    id: 'step-3',
    title: 'Step 3. Normal scrolling',
    description: 'The new world is a great place',
    target: () => document.querySelector<HTMLElement>('#step-3'),
    actions: [
      { label: 'Prev', action: 'prev' },
      { label: 'Next', action: 'next' },
    ],
  },
  {
    type: 'tooltip',
    id: 'step-4',
    title: 'Step 4. Close to bottom',
    description: 'So nice to see the scrolling works!',
    target: () => document.querySelector<HTMLElement>('#step-4'),
    actions: [
      { label: 'Prev', action: 'prev' },
      { label: 'Next', action: 'next' },
    ],
  },
  {
    type: 'dialog',
    id: 'step-5',
    title: 'You\'re all sorted! (no target)',
    description: 'Thanks for trying out the tour. Enjoy the app!',
    actions: [{ label: 'Finish', action: 'dismiss' }],
  },
]
