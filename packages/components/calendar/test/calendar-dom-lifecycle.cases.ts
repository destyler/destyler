import type { CalendarFixture } from './calendar-dom-lifecycle.fixture'
import assert from 'node:assert/strict'
import { CalendarDate } from '@internationalized/date'
import { CalendarHarness, checkpoint, dates } from './calendar-dom-lifecycle.fixture'

function regression(name: string, body: (harness: CalendarHarness) => Promise<void>) {
  return {
    name,
    async run() {
      const harness = new CalendarHarness()
      const errors: unknown[] = []
      try {
        await body(harness)
      }
      catch (error) { errors.push(error) }
      try {
        await harness.dispose()
      }
      catch (error) { errors.push(error) }
      if (errors.length === 1)
        throw errors[0]
      if (errors.length)
        throw new AggregateError(errors, name)
    },
  }
}

// These bodies also run directly in Node when the caller installs a DOM first.
// No test-runner APIs, action-map overrides, or fabricated watchers are used.
export const calendarDomLifecycleCases = [
  ...[true, false].map(sameId => regression(`${sameId ? 'same' : 'different'}-ID remount is untouched after Component.destroy`, async (h) => {
    const old = h.mount('old', { defaultOpen: true })
    await old.selectRange()
    old.remove()
    const pending = [...h.frames.keys()]
    const replacement = h.mount(sameId ? 'old' : 'replacement')
    await checkpoint()
    assert.deepEqual([...h.frames.keys()], pending, 'Idle remount must not schedule new frames')
    const sentinel = h.outsideFocus()
    replacement.assertEmptyClosed()
    const mark = h.calls.length
    h.flushFrame()
    await checkpoint()
    assert.equal(document.activeElement === sentinel, true)
    assert.equal(h.calls.slice(mark).filter(call => call.fixture === replacement).length, 0)
    replacement.assertEmptyClosed()
  })),

  regression('live range close retains input synchronization and focus', async (h) => {
    const live = h.mount('live', { defaultOpen: true })
    await live.selectRange()
    assert.deepEqual(live.values, ['', ''])
    const mark = h.calls.length
    h.flushFrame()
    await checkpoint()
    assert.deepEqual(live.values, live.formatted)
    assert.equal(document.activeElement === live.inputs[0], true)
    assert.equal(h.calls.slice(mark).some(call => call.kind === 'selection'), true)
    assert.equal(live.content.hidden, true)
  }),

  regression('destroying one owner preserves another owner’s pending work', async (h) => {
    const old = h.mount('old', { defaultOpen: true })
    await old.selectRange()
    const live = h.mount('live', { defaultOpen: true })
    await live.selectRange()
    old.remove()
    h.flushFrame()
    await checkpoint()
    assert.deepEqual(live.values, live.formatted)
    assert.equal(document.activeElement === live.inputs[0], true)
  }),

  ...[false, true].map(restart => regression(`root resolution stops${restart ? ' and restarts' : ''} before clear focus`, async (h) => {
    let armed = false
    let stops = 0
    const fixture: CalendarFixture = h.mount('root', {
      getRootNode() {
        if (armed) {
          armed = false
          stops++
          fixture.actor.stop()
          assert.equal(fixture.actor.status, 'Stopped')
          if (restart)
            fixture.actor.start()
        }
        return document
      },
    })
    fixture.calendar.clearValue()
    await checkpoint()
    assert.ok(h.frames.size > 0)
    const sentinel = h.outsideFocus()
    const mark = h.calls.length
    armed = true
    h.flushFrame()
    await checkpoint()
    assert.equal(stops, 1)
    assert.equal(fixture.actor.status, restart ? 'Running' : 'Stopped')
    assert.equal(document.activeElement === sentinel, true)
    assert.equal(h.calls.slice(mark).filter(call => call.kind === 'focus').length, 0)
  })),

  regression('focus event stop cancels selection and later work in the same frame', async (h) => {
    const live = h.mount('focus-stop', { defaultOpen: true })
    await live.selectRange()
    live.inputs[0].addEventListener('focus', () => live.actor.stop(), { once: true })
    const mark = h.calls.length
    h.flushFrame()
    await checkpoint()
    assert.equal(live.actor.status, 'Stopped')
    assert.equal(h.calls.slice(mark).filter(call => call.kind === 'focus').length, 1)
    assert.equal(h.calls.slice(mark).filter(call => call.kind === 'selection' || call.kind === 'input').length, 0)
    assert.deepEqual(live.values, ['', ''])
  }),

  ...[false, true].map(stop => regression(`pre-start clear work is ${stop ? 'retired by stop' : 'adopted by first start'}`, async (h) => {
    const live = h.mount('pre-start', {}, (service) => {
      assert.equal(service.status, 'Not Started')
      service.send('VALUE.CLEAR')
      if (stop)
        service.stop()
    })
    const sentinel = h.outsideFocus()
    await checkpoint()
    const mark = h.calls.length
    h.flushFrame()
    await checkpoint()
    assert.equal(document.activeElement === (stop ? sentinel : live.inputs[0]), true)
    assert.equal(h.calls.slice(mark).filter(call => call.kind === 'focus').length, stop ? 0 : 1)
  })),

  regression('live input microtask synchronizes the latest value', async (h) => {
    const live = h.mount('microtask-live')
    for (const value of ['111', '222']) {
      live.inputs[0].value = value
      live.inputs[0].dispatchEvent(new window.Event('input', { bubbles: true }))
    }
    live.inputs[0].value = ''
    await checkpoint()
    assert.equal(live.inputs[0].value, '222')
    assert.equal(h.frames.size, 0)
  }),

  regression('queued input microtask cannot write into a same-ID remount', async (h) => {
    const old = h.mount('microtask')
    old.inputs[0].value = '123'
    old.inputs[0].dispatchEvent(new window.Event('input', { bubbles: true }))
    let mark = -1
    let sentinel: HTMLElement
    // The real watcher is already queued. It schedules its DOM microtask
    // before this public teardown, and that DOM microtask executes afterward.
    const replacement = await new Promise<CalendarFixture>((resolve, reject) => {
      queueMicrotask(() => {
        try {
          old.remove()
          const next = h.mount('microtask')
          sentinel = h.outsideFocus()
          mark = h.calls.length
          resolve(next)
        }
        catch (error) { reject(error) }
      })
    })
    await checkpoint()
    assert.equal(document.activeElement === sentinel!, true)
    replacement.assertEmptyClosed()
    assert.equal(h.calls.slice(mark).filter(call => call.fixture === replacement && call.kind === 'input').length, 0)
  }),

  regression('stopping after the first input write prevents the second write', async (h) => {
    const live = h.mount('write-stop', { defaultOpen: true })
    await live.selectRange()
    h.afterInputWrite.set(live.inputs[0], () => {
      h.afterInputWrite.delete(live.inputs[0])
      live.actor.stop()
    })
    h.flushFrame()
    await checkpoint()
    assert.equal(live.actor.status, 'Stopped')
    assert.deepEqual(live.values, ['01/10/2024', ''])
  }),

  ...[false, true].map(restart => regression(`late formatting stops${restart ? ' and restarts' : ''} before any input write`, async (h) => {
    let armed = false
    let calls = 0
    const live: CalendarFixture = h.mount('format', {
      format(value) {
        if (armed) {
          armed = false
          calls++
          live.actor.stop()
          if (restart)
            live.actor.start()
        }
        return value.toString()
      },
    })
    live.calendar.setValue(dates)
    await checkpoint()
    assert.deepEqual(live.values, ['', ''])
    const mark = h.calls.length
    armed = true
    h.flushFrame()
    await checkpoint()
    assert.equal(calls, 1)
    assert.equal(live.actor.status, restart ? 'Running' : 'Stopped')
    assert.deepEqual(live.values, ['', ''])
    assert.equal(h.calls.slice(mark).filter(call => call.kind === 'input').length, 0)
  })),

  ...[null, 1, 2].flatMap(stopAt => (stopAt === null ? [false] : [false, true]).map(restart => regression(
    stopAt === null ? 'live focused-value watch synchronizes month then year without RAF' : `${stopAt === 1 ? 'month' : 'year'} resolver stops${restart ? ' and restarts' : ''} before its write`,
    async (h) => {
      let armed = false
      let resolutions = 0
      let stops = 0
      let stoppedAt = -1
      let beforeStop: string[] = []
      const fixture: CalendarFixture = h.mount('select', {
        getRootNode() {
          if (armed && ++resolutions === stopAt) {
            armed = false
            stops++
            beforeStop = [fixture.month.value, fixture.year.value]
            fixture.actor.stop()
            assert.equal(fixture.actor.status, 'Stopped')
            stoppedAt = h.calls.length
            if (restart)
              fixture.actor.start()
          }
          return document
        },
      })
      await checkpoint()
      assert.deepEqual([fixture.month.value, fixture.year.value], ['1', '2024'])
      assert.equal(fixture.month.id, 'calendar:select:month-select')
      assert.equal(fixture.year.id, 'calendar:select:year-select')
      const mark = h.calls.length
      armed = true
      fixture.calendar.setFocusedValue(new CalendarDate(2025, 2, 10))
      assert.equal(fixture.actor.getState().context.focusedValue.toString(), '2025-02-10')
      assert.deepEqual([fixture.month.value, fixture.year.value], ['1', '2024'])
      assert.equal(resolutions, 0)
      assert.equal(h.calls.length, mark)
      await checkpoint()
      armed = false
      assert.equal(h.frames.size, 0, 'Select synchronization must not require an animation frame')
      if (stopAt === null) {
        assert.equal(resolutions, 2)
        assert.deepEqual([fixture.month.value, fixture.year.value], ['2', '2025'])
        assert.deepEqual(h.calls.slice(mark).map(({ kind, before, value, status }) => ({ kind, before, value, status })), [
          { kind: 'month', before: '1', value: '2', status: 'Running' },
          { kind: 'year', before: '2024', value: '2025', status: 'Running' },
        ])
      }
      else {
        assert.equal(stops, 1)
        assert.equal(resolutions, stopAt)
        assert.deepEqual(beforeStop, [stopAt === 1 ? '1' : '2', '2024'])
        assert.equal(fixture.actor.status, restart ? 'Running' : 'Stopped')
        assert.equal(h.calls.slice(stoppedAt).length, 0, 'No select write may follow resolver stop')
        assert.deepEqual([fixture.month.value, fixture.year.value], beforeStop)
      }
    },
  ))),
]
