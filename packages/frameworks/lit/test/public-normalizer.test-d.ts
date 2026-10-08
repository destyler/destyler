import type { NormalizeProps, PropTypes } from '@destyler/types'
import { normalizeProps } from '@destyler/lit'

// Resolve the actual published declaration through the package export, not a
// source alias. The shared input contract must remain typed rather than any.
const normalizer: NormalizeProps<PropTypes> = normalizeProps
const normalized: Record<string, unknown> = normalizer.button({
  'type': 'button',
  'disabled': true,
  'aria-label': 'Open',
  onClick(event) {
    const clientX: number = event.clientX
    event.currentTarget.disabled = true
    // @ts-expect-error MouseEvent has no such member; contextual typing is real.
    event.missingEventMember()
    void clientX
  },
})
void normalized

normalizeProps.label({ htmlFor: 'name' })
normalizeProps.input({ name: 'name', disabled: false })
normalizeProps.textarea({ rows: 2 })
normalizeProps.img({ src: '/image.png', alt: 'Example' })
normalizeProps.output({ htmlFor: 'name' })
normalizeProps.element({ 'data-state': 'open', 'role': 'dialog' })
normalizeProps.select({ multiple: true })
normalizeProps.rect({ x: 1, y: 2, width: 3, height: 4 })
normalizeProps.circle({ cx: 1, cy: 2, r: 3 })
normalizeProps.svg({ viewBox: '0 0 24 24' })
normalizeProps.path({ d: 'M0 0L1 1' })

// @ts-expect-error Disabled accepts a boolean, not an arbitrary string.
normalizeProps.button({ disabled: 'disabled' })
// @ts-expect-error A keyboard-only listener cannot handle a mouse click.
normalizeProps.button({ onClick: (_event: KeyboardEvent) => {} })
