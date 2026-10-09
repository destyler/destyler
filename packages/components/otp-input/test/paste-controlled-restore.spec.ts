import type { PasteFixture } from './paste.fixture'
import { afterEach, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createPasteFixture } from './paste.fixture'
import './paste-controlled-restore.cases'

const nativeViews: PasteFixture[] = []
afterEach(() => nativeViews.splice(0).reverse().forEach(view => view.cleanup()))
async function settle() {
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
}
async function copy(view: PasteFixture, value: string) {
  const source = document.createElement('textarea')
  source.dataset.testid = `${view.root.id}-copy`
  view.root.append(source)
  const target = page.getByTestId(source.dataset.testid)
  await userEvent.fill(target, value)
  await userEvent.tripleClick(target)
  await userEvent.copy()
}
for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
  for (const empty of [false, true]) {
    it(`trusted ${ownership}, empty=${empty}: preserves pre-request text/caret and restores controlled accepted values`, async () => {
      const initial = empty ? ['', '', ''] : ['1', '2', '3']
      const view = createPasteFixture(ownership, ownership === 'uncontrolled' ? { defaultValue: initial } : { value: initial })
      nativeViews.push(view)
      await copy(view, '987')
      view.focus(0)
      await userEvent.paste()
      await settle()
      expect(view.inputEvents[0].isTrusted).toBe(true)
      expect(view.timeline.map(row => row.phase)).toEqual(['input-before', 'input-after', 'request'])
      expect(view.timeline[1].values).toEqual(['9', ...initial.slice(1)])
      expect(view.timeline[1].caret).toBe(1)
      expect(view.timeline[2].values).toEqual(['9', ...initial.slice(1)])
      expect(view.changes).toEqual([{ value: ['9', '8', '7'], valueAsString: '987' }])
      const accepted = ownership === 'veto' ? initial : ['9', '8', '7']
      expect(view.api().value).toEqual(accepted)
      expect(view.inputs.map(input => input.value)).toEqual(accepted)
    })
  }
}
for (const restart of [false, true]) {
  it(`trusted request callback stop with restart=${restart} preserves caller DOM`, async () => {
    const view = createPasteFixture('veto')
    nativeViews.push(view)
    view.service.setContext({ onValueChange(details) {
      view.changes.push(details)
      view.service.stop()
      if (restart)
        view.service.start()
      view.inputs[0].value = 'caller-owned'
    } })
    await copy(view, '987')
    view.focus(0)
    await userEvent.paste()
    await settle()
    expect(view.inputEvents[0].isTrusted).toBe(true)
    expect(view.changes).toHaveLength(1)
    expect(view.inputs[0].value).toBe('caller-owned')
  })
}
