// @vitest-environment happy-dom
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'
import { renderGroupedCombobox } from './grouped'

const cleanups: VoidFunction[] = []
afterEach(() => {
  for (const cleanup of cleanups.splice(0))
    cleanup()
})

describe.each([true, false])('combobox groups (composite=%s)', (composite) => {
  it('puts the group role and label reference on the option container', () => {
    const fixture = renderGroupedCombobox(composite)
    cleanups.push(fixture.cleanup)
    const { groupElements, listbox } = fixture

    expect(listbox.getAttribute('role')).toBe('listbox')
    expect(listbox.querySelectorAll('[role="group"]')).toHaveLength(2)
    groupElements.forEach(({ container, heading, options }) => {
      expect(container.getAttribute('role')).toBe('group')
      expect(container.getAttribute('aria-labelledby')).toBe(heading.id)
      expect(heading.hasAttribute('role')).toBe(false)
      expect(heading.textContent).not.toBe('')
      expect(Array.from(container.querySelectorAll('[role="option"]'))).toEqual(options)
      for (const option of options)
        expect(option.closest('[role="group"]')).toBe(container)
    })
  })

  it('preserves custom group ids, direction, and anatomy attributes', () => {
    const service = machine({
      id: 'custom-group',
      collection: collection.empty(),
      composite,
      dir: 'rtl',
      ids: {
        itemGroup: id => `custom-group-${id}`,
        itemGroupLabel: id => `custom-label-${id}`,
      },
    })
    service.start()
    cleanups.push(() => service.stop())
    const api = connect(service.getState(), service.send, createNormalizer(props => props))
    expect(api.getItemGroupProps({ id: '0' })).toMatchObject({
      'role': 'group',
      'id': 'custom-group-0',
      'aria-labelledby': 'custom-label-0',
      'dir': 'rtl',
      'data-scope': 'combobox',
      'data-part': 'item-group',
    })
    expect(api.getItemGroupLabelProps({ htmlFor: '0' })).toEqual({
      'id': 'custom-label-0',
      'dir': 'rtl',
      'data-scope': 'combobox',
      'data-part': 'item-group-label',
    })
  })

  it('keeps grouped listbox ownership valid when open', async () => {
    const fixture = renderGroupedCombobox(composite)
    cleanups.push(fixture.cleanup)
    fixture.api().setOpen(true)
    await expect.poll(() => fixture.content.hidden).toBe(false)
    const results = await axe(fixture.listbox, {
      runOnly: ['aria-required-children', 'aria-required-parent', 'aria-prohibited-attr'],
    })
    expect(results.violations).toEqual([])
  })
})
