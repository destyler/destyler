import type { PasteFixture } from '../paste.fixture'
import { afterEach, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { createPasteFixture } from '../paste.fixture'

// New, do-not-merge diagnostic proposal. These expectations do not approve a
// production routing contract. Use only in a separately approved disposable run.
const views: PasteFixture[] = []
afterEach(() => views.splice(0).reverse().forEach(view => view.cleanup()))

function snapshot(view: PasteFixture, phase: string) {
  return {
    phase,
    requested: view.changes.map(change => ({ value: Array.from(change.value), valueAsString: change.valueAsString })),
    acceptedModel: Array.from(view.api().value),
    visibleValues: view.inputs.map(input => input.value),
    focusedIndex: view.service.state.context.focusedIndex,
    activeInputIndex: view.inputs.findIndex(input => input === document.activeElement),
    caret: view.inputs.map(input => ({ start: input.selectionStart, end: input.selectionEnd, direction: input.selectionDirection })),
  }
}

function fixture() {
  // The fixture's default implementation imports ../src/machine and connect.
  // Do not pass a third implementation argument or import historical snapshots.
  const view = createPasteFixture('uncontrolled', { defaultValue: ['1', '2', '3'] })
  views.push(view)
  const checkpoints: ReturnType<typeof snapshot>[] = []
  const record = (phase: string) => {
    const row = snapshot(view, phase)
    checkpoints.push(row)
    return row
  }
  record('initial')
  return { view, checkpoints, record }
}

async function settle(record: (phase: string) => unknown) {
  // Real browser frames, as in the accepted native paste fixtures.
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  record('after-real-frame-1')
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  record('after-real-frame-2')
}

async function copy(view: PasteFixture) {
  const source = document.createElement('textarea')
  source.dataset.testid = `${view.root.id}-copy`
  view.root.append(source)
  const target = page.getByTestId(source.dataset.testid)
  await userEvent.fill(target, '987')
  await userEvent.tripleClick(target)
  await userEvent.copy()
}

function report(caseId: string, stage: string, subject: ReturnType<typeof fixture>) {
  subject.record('end-of-case')
  // eslint-disable-next-line no-console -- Retain observations even if an ordinary assertion throws.
  console.info('OTP_LIVE_ROUTING_PROPOSAL_20261010', JSON.stringify({
    caseId,
    stage,
    fixtureId: subject.view.root.id,
    ownership: 'uncontrolled',
    proposedRequest: { value: ['9', '8', '7'], valueAsString: '987' },
    inputEvents: subject.view.inputEvents.map(event => ({
      type: event.type,
      inputType: event.inputType,
      isTrusted: event.isTrusted,
      data: event.data,
      targetIndex: subject.view.inputs.findIndex(input => input === event.target),
    })),
    timeline: subject.view.timeline,
    checkpoints: subject.checkpoints,
  }))
}

it('proposed origin / trusted clipboard: input 0 survives afterInput focus move to 2', async () => {
  const subject = fixture()
  const { view, record } = subject
  let stage = 'setup'
  try {
    expect(view.api().value).toEqual(['1', '2', '3'])
    await copy(view)
    view.afterInput((index) => {
      record(`after-input-${index}-before-focus-move`)
      view.focus(2)
      record(`after-input-${index}-after-focus-move`)
    })
    view.focus(0)
    record('before-trusted-paste')
    stage = 'trusted-clipboard-trigger'
    await userEvent.paste()
    stage = 'real-frame-waits'
    await settle(record)
    stage = 'harness-assertions'
    expect(view.inputEvents).toHaveLength(1)
    expect(view.inputEvents[0].isTrusted).toBe(true)
    expect(view.inputEvents[0].inputType).toBe('insertFromPaste')
    expect(view.inputEvents[0].target).toBe(view.inputs[0])
    const moved = subject.checkpoints.find(row => row.phase === 'after-input-0-after-focus-move')
    expect(moved).toBeDefined()
    expect(moved?.requested).toEqual([])
    expect(moved?.focusedIndex).toBe(2)
    expect(moved?.activeInputIndex).toBe(2)
    stage = 'proposed-origin-assertion'
    expect(view.changes).toEqual([{ value: ['9', '8', '7'], valueAsString: '987' }])
    stage = 'complete'
  }
  finally {
    report('trusted-after-input-focus-move', stage, subject)
  }
})

it('proposed origin / synthetic nonfocused input: input 0 while input 2 has focus', async () => {
  const subject = fixture()
  const { view, record } = subject
  let stage = 'setup'
  try {
    expect(view.api().value).toEqual(['1', '2', '3'])
    view.focus(2)
    const before = record('before-synthetic-input')
    view.afterInput(index => record(`after-synthetic-input-${index}`))
    stage = 'synthetic-input-trigger'
    // This helper dispatches an untrusted InputEvent; it is not clipboard proof.
    view.paste(0, '987', false)
    stage = 'real-frame-waits'
    await settle(record)
    stage = 'harness-assertions'
    expect(before.focusedIndex).toBe(2)
    expect(before.activeInputIndex).toBe(2)
    expect(view.inputEvents).toHaveLength(1)
    expect(view.inputEvents[0].isTrusted).toBe(false)
    expect(view.inputEvents[0].inputType).toBe('insertFromPaste')
    expect(view.inputEvents[0].target).toBe(view.inputs[0])
    const delivered = subject.checkpoints.find(row => row.phase === 'after-synthetic-input-0')
    expect(delivered).toBeDefined()
    expect(delivered?.requested).toEqual([])
    expect(delivered?.focusedIndex).toBe(2)
    expect(delivered?.activeInputIndex).toBe(2)
    stage = 'proposed-origin-assertion'
    expect(view.changes).toEqual([{ value: ['9', '8', '7'], valueAsString: '987' }])
    stage = 'complete'
  }
  finally {
    report('synthetic-nonfocused-input', stage, subject)
  }
})
