import { expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { dragFixture } from './drag-lifetime.cases'

it('uses real Chromium pointer capture for a trusted visible-thumb click', async () => {
  const { service, thumb } = dragFixture(false, true)
  const observations: { trusted: boolean, state: string | null, captured: boolean }[] = []
  thumb.addEventListener('pointerdown', (event) => {
    observations.push({
      trusted: event.isTrusted,
      state: service.getState().value,
      captured: thumb.hasPointerCapture(event.pointerId),
    })
  })
  await userEvent.click(page.getByTestId('lifetime-thumb'))
  expect(observations).toEqual([{ trusted: true, state: 'dragging', captured: true }])
  expect(service.getState().value).toBe('hovering')
  expect(service.getState().context.isDragging).toBe(false)
})

it.each(['open', 'closed'] as const)('proves the target listener is necessary after native %s-shadow retargeting', (mode) => {
  const { service, down, host, thumb, registrations } = dragFixture(false, false, mode)
  service.send('POINTER_ENTER')
  down()
  // Deliberately remove just the target listener: the document sees the host.
  // happy-dom does not reproduce this retargeting, so this control is browser-only.
  for (const item of registrations) {
    if (item.target === thumb && item.type === 'lostpointercapture')
      item.target.removeEventListener(item.type, item.listener, item.options)
  }
  const targets: (EventTarget | null)[] = []
  const observe = (event: Event) => targets.push(event.target)
  document.addEventListener('lostpointercapture', observe, true)
  try {
    thumb.dispatchEvent(new PointerEvent('lostpointercapture', { pointerId: 1, bubbles: true, composed: true }))
    expect(targets).toEqual([host])
    expect(service.getState().value).toBe('dragging')
  }
  finally {
    document.removeEventListener('lostpointercapture', observe, true)
  }
})
