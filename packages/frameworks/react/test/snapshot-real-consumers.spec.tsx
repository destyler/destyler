import type { ReactNode } from 'react'
import { act, createElement, memo, StrictMode, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import * as otp from '../../../components/otp-input/index'
import * as signature from '../../../components/signature/index'
import { normalizeProps, useActor, useMachine, useSelector, useService } from '../index'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

function tree(node: ReactNode, strict: boolean) {
  return strict ? createElement(StrictMode, null, node) : node
}

function mountPoint() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  return { container, root: createRoot(container) }
}

describe.each([false, true])('real React snapshot consumers (StrictMode: %s)', (strict) => {
  it('keeps the OTP snippet connect memo and value effect stable on parent renders', async () => {
    const { container, root } = mountPoint()
    const service = otp.machine({ id: 'react-otp-stability', defaultValue: ['1', '2'] })
    let latest!: ReturnType<typeof otp.connect>
    let connects = 0
    let renders = 0
    let valueEffects = 0
    let childCommits = 0
    const Value = memo(({ value }: { value: readonly string[] }) => {
      useLayoutEffect(() => {
        childCommits++
      })
      return createElement('output', null, value.join(''))
    })
    function View({ label }: { label: string }) {
      if (++renders > 40)
        throw new Error('OTP structured-value effect did not settle')
      const [state, send] = useMachine(() => service)
      const api = useMemo(() => {
        connects++
        return otp.connect(state, send, normalizeProps)
      }, [state, send])
      latest = api
      const [mirrored, setMirrored] = useState<readonly string[]>([])
      useEffect(() => {
        valueEffects++
        setMirrored(api.value)
      }, [api.value])
      return createElement('div', api.getRootProps(), createElement('span', null, label), createElement(Value, { value: api.value }), createElement('small', null, mirrored.join('')), ...[0, 1].map(index => createElement('input', { key: index, ...api.getInputProps({ index }) })))
    }
    try {
      await act(async () => root.render(tree(createElement(View, { label: 'first' }), strict)))
      const value = latest.value
      const before = { connects, valueEffects, childCommits }
      await act(async () => root.render(tree(createElement(View, { label: 'second' }), strict)))
      expect(latest.value).toBe(value)
      expect({ connects, valueEffects, childCommits }).toEqual(before)
      // Focusing changes input props, not the accepted digit array.
      await act(async () => service.setContext({ focusedIndex: 1 }))
      expect(latest.value).toBe(value)
      expect(valueEffects).toBe(before.valueEffects)
      expect(childCommits).toBe(before.childCommits)
      await act(async () => latest.setValue(['3', '4']))
      expect(latest.value).toEqual(['3', '4'])
      expect(latest.value).not.toBe(value)
      expect(container.querySelector('output')!.textContent).toBe('34')
      expect(container.querySelector('small')!.textContent).toBe('34')
      await act(async () => latest.clearValue())
      expect(latest.value.join('')).toBe('')
      expect(container.querySelector('output')!.textContent).toBe('')
    }
    finally {
      await act(async () => root.unmount())
      container.remove()
    }
  })

  it('retains an equal structured OTP selection across inline selectors and state-setting effects', async () => {
    const { container, root } = mountPoint()
    const service = otp.machine({ id: 'react-otp-selection', defaultValue: ['1', '2'] })
    let renders = 0
    let effects = 0
    let childCommits = 0
    let latest!: { value: string[], disabled: boolean | undefined }
    const Value = memo(({ selection }: { selection: typeof latest }) => {
      useLayoutEffect(() => {
        childCommits++
      })
      return createElement('output', null, selection.value.join(''))
    })
    function View({ label }: { label: string }) {
      if (++renders > 40)
        throw new Error('Equal OTP selector result did not settle')
      const actor = useService(() => service)
      const selection = useSelector(actor, state => ({ value: state.context.value, disabled: state.context.disabled }), (previous, next) => previous.value === next.value && previous.disabled === next.disabled)
      latest = selection
      const [mirrored, setMirrored] = useState<typeof selection | null>(null)
      useEffect(() => {
        effects++
        setMirrored(selection)
      }, [selection])
      return createElement('div', null, createElement('span', null, label), createElement(Value, { selection }), createElement('small', null, mirrored?.value.join('')))
    }
    try {
      await act(async () => root.render(tree(createElement(View, { label: 'first' }), strict)))
      const first = latest
      const before = { effects, childCommits }
      await act(async () => root.render(tree(createElement(View, { label: 'second' }), strict)))
      expect(latest).toBe(first)
      expect({ effects, childCommits }).toEqual(before)
      await act(async () => service.setContext({ focusedIndex: 1 }))
      expect(latest).toBe(first)
      expect({ effects, childCommits }).toEqual(before)
      await act(async () => service.send({ type: 'VALUE.SET', value: ['3', '4'] }))
      expect(latest).not.toBe(first)
      expect(latest.value).toEqual(['3', '4'])
      expect(effects).toBe(before.effects + 1)
      expect(childCommits).toBe(before.childCommits + 1)
      expect(container.querySelector('output')!.textContent).toBe('34')
      expect(container.querySelector('small')!.textContent).toBe('34')
    }
    finally {
      await act(async () => root.unmount())
      container.remove()
    }
  })

  it('preserves controlled OTP rejection and later parent acceptance', async () => {
    const { container, root } = mountPoint()
    const onValueChange = vi.fn()
    const initial = ['1', '2']
    const service = otp.machine({ id: 'react-otp-controlled', value: initial, onValueChange })
    let api!: ReturnType<typeof otp.connect>
    function View({ value }: { value: string[] }) {
      const [state, send] = useMachine(() => service, { context: { value } })
      api = useMemo(() => otp.connect(state, send, normalizeProps), [state, send])
      return createElement('output', null, api.valueAsString)
    }
    try {
      await act(async () => root.render(tree(createElement(View, { value: initial }), strict)))
      await act(async () => api.setValue(['3', '4']))
      expect(onValueChange).toHaveBeenCalledWith({ value: ['3', '4'], valueAsString: '34' })
      expect(container.textContent).toBe('12')
      expect(service.getState().context.value).toEqual(initial)
      await act(async () => root.render(tree(createElement(View, { value: ['3', '4'] }), strict)))
      expect(container.textContent).toBe('34')
      await act(async () => api.clearValue())
      expect(container.textContent).toBe('34')
      await act(async () => root.render(tree(createElement(View, { value: ['', ''] }), strict)))
      expect(container.textContent).toBe('')
    }
    finally {
      await act(async () => root.unmount())
      container.remove()
    }
  })

  it('keeps Signature paths and drawing options stable while strokes still refresh', async () => {
    const { container, root } = mountPoint()
    const service = signature.machine({ id: 'react-signature-stability', drawing: { size: 4 } })
    let api!: ReturnType<typeof signature.connect>
    let drawing!: typeof service.state.context.drawing
    let connects = 0
    let effects = 0
    let renders = 0
    function View({ label }: { label: string }) {
      if (++renders > 40)
        throw new Error('Signature structured-value effect did not settle')
      const [state, send] = useMachine(() => service)
      api = useMemo(() => {
        connects++
        return signature.connect(state, send, normalizeProps)
      }, [state, send])
      drawing = state.context.drawing
      const [mirrored, setMirrored] = useState<readonly string[]>([])
      useEffect(() => {
        effects++
        setMirrored(api.paths)
      }, [api.paths])
      return createElement('div', api.getRootProps(), createElement('span', null, label), createElement('div', api.getControlProps(), createElement('svg', api.getSegmentProps(), ...api.paths.map((path, index) => createElement('path', { key: index, ...api.getSegmentPathProps({ path }) })), api.currentPath ? createElement('path', { 'data-current': '', ...api.getSegmentPathProps({ path: api.currentPath }) }) : null)), createElement('output', null, mirrored.length))
    }
    try {
      await act(async () => root.render(tree(createElement(View, { label: 'first' }), strict)))
      const initialPaths = api.paths
      const initialDrawing = drawing
      const before = { connects, effects }
      await act(async () => root.render(tree(createElement(View, { label: 'second' }), strict)))
      expect({ connects, effects }).toEqual(before)
      expect(api.paths).toBe(initialPaths)
      expect(drawing).toBe(initialDrawing)
      await act(async () => service.setContext({ readOnly: true }))
      expect(api.paths).toBe(initialPaths)
      expect(drawing).toBe(initialDrawing)
      expect(effects).toBe(before.effects)
      await act(async () => service.setContext({ readOnly: false }))
      await act(async () => service.send({ type: 'POINTER_DOWN', point: { x: 10, y: 10 }, pressure: 0.5 }))
      await act(async () => service.send({ type: 'POINTER_MOVE', point: { x: 50, y: 35 }, pressure: 0.7 }))
      expect(api.currentPath).toBeTruthy()
      const path = api.currentPath
      expect(api.paths).toBe(initialPaths)
      await act(async () => service.send({ type: 'POINTER_UP' }))
      expect(api.paths).toEqual([path])
      expect(api.paths).not.toBe(initialPaths)
      expect(container.querySelector('output')!.textContent).toBe('1')
      expect(drawing).toBe(initialDrawing)
      await act(async () => api.clear())
      expect(api.paths).toEqual([])
      expect(container.querySelector('output')!.textContent).toBe('0')
    }
    finally {
      await act(async () => root.unmount())
      container.remove()
    }
  })

  it('measures full-snapshot versus selected Signature consumers without claiming universal performance', async () => {
    const { container, root } = mountPoint()
    const service = signature.machine({ id: 'react-signature-selection', drawing: { size: 4 } })
    const commits = { snapshotPaths: 0, snapshotCurrent: 0, selectedPaths: 0, selectedCurrent: 0, record: 0 }
    let selectedRecord!: { paths: string[], drawing: typeof service.state.context.drawing }
    function SnapshotPaths() {
      const [state] = useActor(service)
      useLayoutEffect(() => {
        commits.snapshotPaths++
      })
      return createElement('output', { 'data-snapshot-paths': '' }, state.context.paths.length)
    }
    function SnapshotCurrent() {
      const [state] = useActor(service)
      useLayoutEffect(() => {
        commits.snapshotCurrent++
      })
      return createElement('output', { 'data-snapshot-current': '' }, state.context.currentPath)
    }
    function SelectedPaths() {
      const paths = useSelector(service, state => state.context.paths)
      useLayoutEffect(() => {
        commits.selectedPaths++
      })
      return createElement('output', { 'data-selected-paths': '' }, paths.length)
    }
    function SelectedCurrent() {
      const current = useSelector(service, state => state.context.currentPath)
      useLayoutEffect(() => {
        commits.selectedCurrent++
      })
      return createElement('output', { 'data-selected-current': '' }, current)
    }
    function SelectedRecord() {
      selectedRecord = useSelector(service, state => ({ paths: state.context.paths, drawing: state.context.drawing }), (previous, next) => previous.paths === next.paths && previous.drawing === next.drawing)
      useLayoutEffect(() => {
        commits.record++
      })
      return createElement('output', null, selectedRecord.paths.length)
    }
    function View() {
      useService(() => service)
      return createElement('div', null, createElement(SnapshotPaths), createElement(SnapshotCurrent), createElement(SelectedPaths), createElement(SelectedCurrent), createElement(SelectedRecord))
    }
    try {
      await act(async () => root.render(tree(createElement(View), strict)))
      const initial = { ...commits }
      const initialRecord = selectedRecord
      await act(async () => service.setContext({ disabled: true }))
      expect(commits.snapshotPaths).toBe(initial.snapshotPaths + 1)
      expect(commits.snapshotCurrent).toBe(initial.snapshotCurrent + 1)
      expect(commits.selectedPaths).toBe(initial.selectedPaths)
      expect(commits.selectedCurrent).toBe(initial.selectedCurrent)
      expect(commits.record).toBe(initial.record)
      expect(selectedRecord).toBe(initialRecord)
      await act(async () => service.setContext({ disabled: false }))
      await act(async () => service.send({ type: 'POINTER_DOWN', point: { x: 10, y: 10 }, pressure: 0.5 }))
      await act(async () => service.send({ type: 'POINTER_MOVE', point: { x: 50, y: 35 }, pressure: 0.7 }))
      expect(commits.selectedPaths).toBe(initial.selectedPaths)
      expect(commits.record).toBe(initial.record)
      expect(commits.selectedCurrent).toBeGreaterThan(initial.selectedCurrent)
      await act(async () => service.send({ type: 'POINTER_UP' }))
      expect(commits.selectedPaths).toBeGreaterThan(initial.selectedPaths)
      expect(selectedRecord.paths).toHaveLength(1)
      expect(selectedRecord).not.toBe(initialRecord)
      expect(container.querySelector('[data-selected-paths]')!.textContent).toBe('1')
      expect(container.querySelector('[data-snapshot-paths]')!.textContent).toBe('1')
      expect(container.querySelector('[data-selected-current]')!.textContent).toBe(container.querySelector('[data-snapshot-current]')!.textContent)
      const deltas = Object.fromEntries(Object.entries(commits).map(([key, value]) => [key, value - initial[key as keyof typeof commits]]))
      expect(deltas).toEqual({ snapshotPaths: 5, snapshotCurrent: 5, selectedPaths: 1, selectedCurrent: 3, record: 1 })
      // Counts are a bounded fixture measurement, not a wall-clock benchmark.
      // eslint-disable-next-line no-console -- Report bounded fixture measurements alongside correctness assertions.
      console.info('Signature subscriber commit deltas', { strict, ...deltas })
    }
    finally {
      await act(async () => root.unmount())
      container.remove()
    }
  })
})
