import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from 'playwright/test'

async function prepareHomeKeyboardScroll(pre) {
  return pre.evaluateHandle((element) => {
    const controller = new AbortController()
    const state = { resetComplete: element.scrollTop === 0, keyStartTop: null, keyReleased: false, moved: false, completed: false }
    const observe = (event) => {
      if (event.target !== element || !event.isTrusted)
        return
      if (event.type === 'keydown' && event.key === 'ArrowDown' && state.resetComplete && state.keyStartTop === null) {
        state.keyStartTop = element.scrollTop
      }
      else if (event.type === 'keyup' && event.key === 'ArrowDown' && state.keyStartTop !== null) {
        state.keyReleased = true
      }
      else if (event.type === 'scroll' && state.keyStartTop !== null && element.scrollTop > state.keyStartTop) {
        state.moved = true
      }
      else if (event.type === 'scrollend') {
        if (state.keyStartTop === null && element.scrollTop === 0)
          state.resetComplete = true
        else if (state.keyReleased && state.moved && element.scrollTop > state.keyStartTop)
          state.completed = true
      }
    }
    try {
      // A changed reset must finish before its scrollend can be confused with the key.
      for (const type of ['keydown', 'keyup', 'scroll', 'scrollend'])
        element.addEventListener(type, observe, { capture: true, passive: true, signal: controller.signal })
      globalThis.__nativeControl.record('reset-before')
      element.scrollTop = 0
      globalThis.__nativeControl.record('reset-after')
      return { state, stop: () => controller.abort() }
    }
    catch (error) {
      try {
        controller.abort()
      }
      catch {}
      throw error
    }
  })
}

const fixture = `<!doctype html><meta charset="utf-8"><style>
html{font-size:16px}body{margin:0}.home-code{width:min(638px,calc(100vw - 34px));margin:850px auto 600px}.header{height:38px}
pre{margin:0;display:flex;max-height:35rem;overflow:auto}code{flex:none;white-space:pre;width:670px;height:945px;line-height:21px}
@media(max-width:600px){.home-code{margin-top:1750px}}
</style><section class="home-code"><header class="header">Synthetic code</header><pre tabindex="0" role="region" aria-label="Synthetic code"><code>${'native keyboard scrolling fixture\n'.repeat(45)}</code></pre></section>`

async function keyOutcome(page, pre, probe, readAfterNativeEnd = false) {
  await page.keyboard.press('ArrowDown')
  const deadline = performance.now() + 5000
  const movement = expect.poll(() => pre.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
  let observedEndBeforeStateRead = false
  const completion = (async () => {
    if (readAfterNativeEnd) {
      const eventBudget = deadline - performance.now()
      assert.ok(eventBudget > 0, 'Native end must remain inside the original 5000ms window')
      await page.waitForFunction(() => globalThis.__nativeControl.events.some(event => event.type === 'scrollend' && event.pre && event.trusted && event.top > 0), null, { timeout: eventBudget })
      observedEndBeforeStateRead = true
    }
    const remaining = deadline - performance.now()
    assert.ok(remaining > 0, 'Completion must remain inside the original 5000ms window')
    await expect.poll(() => probe.evaluate(({ state }) => ({ keyStartTop: state.keyStartTop, keyReleased: state.keyReleased, moved: state.moved, completed: state.completed })), { timeout: remaining }).toEqual({ keyStartTop: 0, keyReleased: true, moved: true, completed: true })
  })()
  return { outcomes: await Promise.allSettled([movement, completion]), observedEndBeforeStateRead }
}

async function withProbe(pre, action) {
  const probe = await prepareHomeKeyboardScroll(pre)
  const cleanupErrors = []
  let result
  try {
    await expect.poll(() => probe.evaluate(({ state }) => state.resetComplete)).toBe(true)
    result = await action(probe)
  }
  finally {
    try {
      await probe.evaluate(scroll => scroll.stop())
    }
    catch (error) {
      cleanupErrors.push(error)
    }
    try {
      await probe.dispose()
    }
    catch (error) {
      cleanupErrors.push(error)
    }
  }
  if (cleanupErrors.length)
    throw cleanupErrors[0]
  return result
}

function isExpectedPollTimeout(error, matcher, exactTimeout) {
  const result = error?.matcherResult
  const timeout = String(result?.message || '').match(/Timeout (\d+(?:\.\d+)?)ms exceeded while waiting on the predicate/)
  const milliseconds = timeout ? Number(timeout[1]) : 0
  return result?.name === matcher && result.pass === false && milliseconds > 0 && milliseconds <= 5000 && (exactTimeout === undefined || milliseconds === exactTimeout)
}

function describeOutcomes(outcomes) {
  return outcomes.map(outcome => outcome.status === 'rejected' ? { status: outcome.status, error: outcome.reason.stack || String(outcome.reason) } : { status: outcome.status })
}

function assertSuccessfulKey(outcomes) {
  for (const outcome of outcomes) {
    if (outcome.status === 'rejected')
      throw outcome.reason
  }
}

export async function runNativeHomeScrollControls(browser) {
  const results = []
  const browserVersion = browser.version()
  assert.equal(browserVersion, '156.0.8078.4', 'Bind this one-off experiment to the original CI browser')
  async function runCase(name, arm, action) {
    let context
    let page
    const result = { name, arm, status: 'failed', phase: 'fixture-setup', pageErrors: [] }
    try {
      context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
      context.setDefaultTimeout(5000)
      page = await context.newPage()
      page.on('pageerror', error => result.pageErrors.push(error.stack || String(error)))
      await page.setContent(fixture)
      await page.evaluate(() => {
        const pre = document.querySelector('pre')
        const events = []
        let dropped = 0
        const record = (type, event) => {
          events.push({ at: performance.now(), type, pre: event ? event.target === pre : true, top: pre.scrollTop, key: event?.key, trusted: event?.isTrusted, defaultPreventedAtCapture: event?.defaultPrevented, event, focused: document.activeElement === pre, viewport: { width: innerWidth, height: innerHeight }, pageY: scrollY })
          if (events.length > 256) {
            events.shift()
            dropped++
          }
        }
        for (const type of ['keydown', 'keyup', 'scroll', 'scrollend', 'focusin', 'focusout', 'resize'])
          window.addEventListener(type, event => record(type, event), { capture: true, passive: true })
        globalThis.__nativeControl = {
          events,
          record,
          snapshot: () => ({
            events: events.map(({ event, ...entry }) => ({ ...entry, defaultPreventedAtFinish: event?.defaultPrevented })),
            dropped,
            final: { top: pre.scrollTop, height: pre.scrollHeight, clientHeight: pre.clientHeight, width: pre.scrollWidth, clientWidth: pre.clientWidth, bounds: pre.getBoundingClientRect().toJSON(), focused: document.activeElement === pre },
          }),
        }
      })
      result.phase = 'control-body'
      result.detail = await action(page, page.locator('pre'), page.locator('.home-code'), result)
      result.status = 'passed'
    }
    catch (error) {
      result.error = error.stack || String(error)
      result.errorClass = arm === 'original' && result.phase === 'positive-scroll-assertion' && isExpectedPollTimeout(error, 'toBeGreaterThan', 5000) ? 'original-positive-scroll-timeout' : 'unexpected'
    }
    finally {
      if (page) {
        try {
          result.trace = await page.evaluate(() => globalThis.__nativeControl.snapshot())
        }
        catch (error) {
          result.traceError = String(error)
          result.status = 'failed'
        }
      }
      try {
        await context?.close()
      }
      catch (error) {
        result.cleanupError = String(error)
        result.status = 'failed'
      }
      if (result.pageErrors.length)
        result.status = 'failed'
      results.push(result)
      console.log(JSON.stringify({ nativeHomeScrollControl: result }))
    }
  }

  for (let pair = 1; pair <= 4; pair++) {
    for (const arm of ['original', 'synchronized']) {
      if (!browser.isConnected())
        break
      await runCase(`pair-${pair}-${arm}`, arm, async (page, pre, snippet, result) => {
        const completedViewports = []
        const keyboardAttempts = []
        result.detail = { completedViewports, keyboardAttempts }
        for (const viewport of [{ width: 1600, height: 900 }, { width: 390, height: 844 }]) {
          result.currentViewport = viewport
          result.phase = 'viewport-layout-preconditions'
          await page.setViewportSize(viewport)
          const layout = await pre.evaluate((element) => {
            const style = getComputedStyle(element)
            return { maxHeight: Number.parseFloat(style.maxHeight), expectedMaxHeight: Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 35, overflowY: style.overflowY, height: element.getBoundingClientRect().height, scrollHeight: element.scrollHeight, clientHeight: element.clientHeight }
          })
          assert.equal(layout.maxHeight, layout.expectedMaxHeight)
          assert.equal(layout.overflowY, 'auto')
          assert.ok(layout.height <= layout.maxHeight + 1)
          assert.ok(layout.scrollHeight > layout.clientHeight)
          await expect(pre).toHaveAttribute('tabindex', '0')
          await expect(pre).toHaveAttribute('role', 'region')
          if (arm === 'original') {
            result.phase = 'reset'
            await pre.evaluate((element) => {
              globalThis.__nativeControl.record('reset-before')
              element.scrollTop = 0
              globalThis.__nativeControl.record('reset-after')
            })
            result.phase = 'focus'
            await pre.focus()
            await expect(pre).toBeFocused()
            const headerY = (await snippet.locator('.header').boundingBox()).y
            result.phase = 'keypress'
            await page.keyboard.press('ArrowDown')
            result.phase = 'positive-scroll-assertion'
            await expect.poll(() => pre.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
            result.phase = 'header-assertion'
            assert.equal((await snippet.locator('.header').boundingBox()).y, headerY)
          }
          else {
            result.phase = 'synchronized-viewport'
            await withProbe(pre, async (probe) => {
              await pre.focus()
              await expect(pre).toBeFocused()
              const headerY = (await snippet.locator('.header').boundingBox()).y
              const { outcomes } = await keyOutcome(page, pre, probe)
              keyboardAttempts.push({ viewport, outcomes: describeOutcomes(outcomes) })
              assertSuccessfulKey(outcomes)
              assert.equal((await snippet.locator('.header').boundingBox()).y, headerY)
            })
          }
          result.phase = 'viewport-complete'
          completedViewports.push(viewport)
        }
        return { completedViewports, keyboardAttempts }
      })
    }
  }

  if (browser.isConnected()) {
    await runCase('reset-end-cannot-complete-canceled-key', 'negative-control', async (page, pre, _snippet, caseResult) => {
      await pre.evaluate((element) => {
        element.scrollTop = 40
        element.addEventListener('keydown', event => event.key === 'ArrowDown' && event.preventDefault(), { capture: true })
      })
      await page.waitForFunction(() => globalThis.__nativeControl.events.some(event => event.type === 'scrollend' && event.pre && event.trusted && event.top === 40), null, { timeout: 5000 })
      return withProbe(pre, async (probe) => {
        await pre.focus()
        await expect(pre).toBeFocused()
        const { outcomes } = await keyOutcome(page, pre, probe)
        caseResult.detail = { outcomes: describeOutcomes(outcomes) }
        const state = await probe.evaluate(({ state }) => state)
        caseResult.detail.state = state
        assert.deepEqual(outcomes.map(outcome => outcome.status), ['rejected', 'rejected'])
        assert.ok(isExpectedPollTimeout(outcomes[0].reason, 'toBeGreaterThan', 5000), 'Require the intended positive-scroll predicate timeout')
        assert.ok(isExpectedPollTimeout(outcomes[1].reason, 'toEqual'), 'Require the intended completion predicate timeout')
        assert.equal(state.resetComplete, true)
        assert.equal(state.keyStartTop, 0)
        assert.equal(state.keyReleased, true)
        const keys = await page.evaluate(() => globalThis.__nativeControl.snapshot().events.filter(event => event.type === 'keydown' && event.key === 'ArrowDown'))
        assert.equal(keys.length, 1)
        assert.ok(keys[0].pre && keys[0].trusted && keys[0].defaultPreventedAtFinish, 'The one trusted PRE key must have been canceled')
        assert.equal(state.moved, false)
        assert.equal(state.completed, false)
        return { intentionallyCanceledKey: true, expectedRejections: outcomes.map(outcome => outcome.reason.stack || String(outcome.reason)), state }
      })
    })
    await runCase('nonzero-key-baseline-is-rejected', 'negative-control', async (page, pre, _snippet, caseResult) => withProbe(pre, async (probe) => {
      await pre.focus()
      await expect(pre).toBeFocused()
      await pre.evaluate(element => element.scrollTop = 13)
      await page.waitForFunction(() => globalThis.__nativeControl.events.some(event => event.type === 'scrollend' && event.pre && event.trusted && event.top === 13), null, { timeout: 5000 })
      const { outcomes } = await keyOutcome(page, pre, probe)
      caseResult.detail = { outcomes: describeOutcomes(outcomes) }
      const state = await probe.evaluate(({ state }) => state)
      caseResult.detail.state = state
      assert.equal(outcomes[0].status, 'fulfilled')
      assert.equal(outcomes[1].status, 'rejected')
      assert.ok(isExpectedPollTimeout(outcomes[1].reason, 'toEqual'), 'Require the intended nonzero-baseline predicate timeout')
      assert.deepEqual(state, { resetComplete: true, keyStartTop: 13, keyReleased: true, moved: true, completed: true })
      return { state, expectedCompletionRejection: outcomes[1].reason.stack || String(outcomes[1].reason) }
    }))
    await runCase('native-end-before-node-state-read', 'positive-control', async (page, pre, _snippet, caseResult) => withProbe(pre, async (probe) => {
      await pre.focus()
      await expect(pre).toBeFocused()
      const result = await keyOutcome(page, pre, probe, true)
      caseResult.detail = { outcomes: describeOutcomes(result.outcomes), observedEndBeforeStateRead: result.observedEndBeforeStateRead }
      assertSuccessfulKey(result.outcomes)
      assert.equal(result.observedEndBeforeStateRead, true)
      return { observedEndBeforeStateRead: true, state: await probe.evaluate(({ state }) => state) }
    }))
  }
  const incompleteTraces = results.filter(result => !result.trace || result.trace.dropped !== 0).map(result => result.name)
  const isOriginalAssertionTimeout = result => result.arm === 'original' && result.errorClass === 'original-positive-scroll-timeout' && result.trace?.final.top === 0 && result.trace.dropped === 0 && !result.traceError && !result.cleanupError && result.pageErrors.length === 0
  const unexpectedFailures = results.filter(result => result.status !== 'passed' && !isOriginalAssertionTimeout(result)).map(result => result.name)
  const summary = { browserVersion, prescribedCases: 11, attemptedCases: results.length, originalAssertionTimeouts: results.filter(isOriginalAssertionTimeout).map(result => result.name), unexpectedFailures, incompleteTraces, allSynchronizationControlsPassed: results.length === 11 && unexpectedFailures.length === 0 && incompleteTraces.length === 0, scope: 'Four fresh native-PRE pairs plus three controls; no reruns; no real-docs repetition; only classified positive-scroll timeouts are nonfatal original-arm observations, not proof of cause' }
  console.log(JSON.stringify({ nativeHomeScrollControlSummary: summary }))
  return summary
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const browser = await chromium.launch()
  try {
    const summary = await runNativeHomeScrollControls(browser)
    assert.equal(summary.allSynchronizationControlsPassed, true, 'Native synchronization controls must all pass')
  }
  finally {
    await browser.close()
  }
}
