import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createMachine, MachineStatus } from '@destyler/xstate'
import ts from 'typescript'
import { describe, expect, it, vi } from 'vitest'
import { MachineController } from '../src/controllers/machine-controller'

class Host implements ReactiveControllerHost {
  controllers = new Set<ReactiveController>()
  requestUpdate = vi.fn<ReactiveControllerHost['requestUpdate']>()
  updateComplete = Promise.resolve(true)

  addController(controller: ReactiveController) {
    this.controllers.add(controller)
  }

  removeController(controller: ReactiveController) {
    this.controllers.delete(controller)
  }
}

function createService<TContext extends Record<string, unknown>>(context: TContext, created?: (context: TContext) => void) {
  return createMachine<TContext>({
    id: 'lit.context-discriminator',
    initial: 'idle',
    context,
    created,
    states: { idle: {} },
  })
}

function createSource(count = 1) {
  const listeners = new Set<(context: { count: number }) => void>()
  const cleanup = vi.fn()
  const get = vi.fn(function (this: unknown) {
    expect(this).toBeDefined()
    return Object.freeze({ count })
  })
  const subscribe = vi.fn(function (this: unknown, listener: (context: { count: number }) => void) {
    expect(this).toBeDefined()
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
      cleanup()
    }
  })
  const source = Object.freeze({ get, subscribe })
  return {
    source,
    listeners,
    cleanup,
    emit(next: number) {
      count = next
      listeners.forEach(listener => listener(Object.freeze({ count })))
    },
  }
}

describe('lit context with a non-callable get member', () => {
  it.each(['ordinary-data', 0, false, null, undefined, { label: 'data' }])(
    'applies a non-callable subscribe field (%j) before created and when updating',
    (subscribe) => {
      const created = vi.fn()
      const machine = createService({ count: 0, subscribe, get: 'initial' }, created)
      const context = Object.freeze({ count: 9, subscribe, get: 'ordinary-data' })
      const options = Object.freeze({ context, sync: true })
      const controller = new MachineController(new Host(), machine, options)
      try {
        expect(created).toHaveBeenCalledOnce()
        expect(created.mock.calls[0][0]).toMatchObject(context)
        expect(controller.state.context).toMatchObject(context)
        controller.hostConnected()
        const replacement = Object.freeze({ count: 10, subscribe, get: 'updated-data' })
        controller.setOptions(Object.freeze({ context: replacement }))
        expect(controller.state.context).toMatchObject(replacement)
        expect(context).toEqual({ count: 9, subscribe, get: 'ordinary-data' })
        expect(options.context).toBe(context)
      }
      finally {
        controller.hostDisconnected()
      }
      expect(machine.status).toBe(MachineStatus.Stopped)
    },
  )

  // Broader source discrimination remains unresolved. Its four ordinary-data
  // requirements run separately in diagnostics/context-classification.repro.ts.

  it('keeps callable subscribe as ordinary data when get is non-callable', () => {
    const subscribe = vi.fn(() => 'ordinary-return-value')
    const created = vi.fn()
    const machine = createService({ count: 0, subscribe, get: 'initial' }, created)
    const context = Object.freeze({ count: 9, subscribe, get: 'ordinary-data' })
    const controller = new MachineController(new Host(), machine, { context, sync: true })
    try {
      expect(created.mock.calls[0][0]).toMatchObject(context)
      controller.hostConnected()
      controller.setOptions({ context: { count: 11, subscribe, get: 'updated-data' } })
      expect(controller.state.context).toMatchObject({ count: 11, subscribe, get: 'updated-data' })
      expect(subscribe).not.toHaveBeenCalled()
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('still accepts ordinary context without source-like fields', () => {
    const created = vi.fn()
    const controller = new MachineController(new Host(), createService({ count: 0 }, created), {
      context: Object.freeze({ count: 5 }),
      sync: true,
    })
    try {
      expect(created.mock.calls[0][0]).toMatchObject({ count: 5 })
      controller.hostConnected()
      controller.setOptions({ context: { count: 6 } })
      expect(controller.state.context.count).toBe(6)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('preserves source method receivers, initial context, updates, swaps and disconnect cleanup', () => {
    const first = createSource(1)
    const second = createSource(10)
    const created = vi.fn()
    const host = new Host()
    const machine = createService({ count: 0 }, created)
    const controller = new MachineController(host, () => machine, Object.freeze({ context: first.source, sync: true }))
    try {
      expect(host.controllers.has(controller)).toBe(true)
      expect(created.mock.calls[0][0]).toMatchObject({ count: 1 })
      expect(first.listeners.size).toBe(0)
      controller.hostConnected()
      expect(first.listeners.size).toBe(1)
      first.emit(2)
      expect(controller.state.context.count).toBe(2)
      expect(host.requestUpdate).toHaveBeenCalled()
      controller.setOptions(Object.freeze({ context: second.source }))
      expect(first.cleanup).toHaveBeenCalledOnce()
      expect(first.listeners.size).toBe(0)
      expect(second.listeners.size).toBe(1)
      expect(controller.state.context.count).toBe(10)
      first.emit(99)
      expect(controller.state.context.count).toBe(10)
      second.emit(11)
      expect(controller.state.context.count).toBe(11)
      controller.hostDisconnected()
      expect(second.listeners.size).toBe(0)
      expect(second.cleanup).toHaveBeenCalledOnce()
      expect(machine.status).toBe(MachineStatus.Stopped)
      // Do not require rereading get on reconnect: that is a separate lifecycle fix.
      controller.hostConnected()
      expect(second.listeners.size).toBe(1)
      second.emit(12)
      expect(controller.state.context.count).toBe(12)
    }
    finally {
      controller.hostDisconnected()
    }
    expect(second.listeners.size).toBe(0)
    expect(second.cleanup).toHaveBeenCalledTimes(2)
    for (const { source } of [first, second]) {
      expect(source.get.mock.contexts.every(receiver => receiver === source)).toBe(true)
      expect(source.subscribe.mock.contexts.every(receiver => receiver === source)).toBe(true)
    }
  })

  it('releases a source when replaced with callable ordinary context', () => {
    const source = createSource(1)
    const subscribe = vi.fn(() => 'ordinary-value')
    const machine = createService({ count: 0, subscribe, get: 'initial' })
    const controller = new MachineController(new Host(), machine, { context: source.source, sync: true })
    try {
      controller.hostConnected()
      controller.setOptions({ context: Object.freeze({ count: 8, subscribe, get: 'ordinary-data' }) })
      expect(source.cleanup).toHaveBeenCalledOnce()
      expect(source.listeners.size).toBe(0)
      expect(controller.state.context).toMatchObject({ count: 8, subscribe, get: 'ordinary-data' })
      source.emit(99)
      expect(controller.state.context.count).toBe(8)
      expect(subscribe).not.toHaveBeenCalled()
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it.each(['absent', 'undefined', 'null'] as const)('preserves subscribe-only JavaScript sources with %s get', (kind) => {
    const context = kind === 'absent' ? {} : { get: kind === 'null' ? null : undefined }
    const listeners = new Set<(context: { count: number }) => void>()
    const subscribe = vi.fn(function (this: unknown, listener: (context: { count: number }) => void) {
      expect(this).toBeDefined()
      listeners.add(listener)
      return () => listeners.delete(listener)
    })
    const jsSource = Object.freeze({ ...context, subscribe })
    const machine = createService({ count: 0 })
    // The explicit JavaScript boundary includes null, which the public TS type rejects.
    const controller: MachineController<{ count: number }, { value: string }> = Reflect.construct(
      MachineController,
      [new Host(), machine, { context: jsSource, sync: true }],
    )
    try {
      expect(machine.contextSnapshot.count).toBe(0)
      controller.hostConnected()
      expect(listeners.size).toBe(1)
      expect(subscribe.mock.contexts).toEqual([jsSource])
      listeners.forEach(listener => listener({ count: 7 }))
      expect(controller.state.context.count).toBe(7)
    }
    finally {
      controller.hostDisconnected()
    }
    expect(listeners.size).toBe(0)
  })

  it('still permits callable get returning undefined', () => {
    const source = createSource()
    const context = { get: () => undefined, subscribe: source.source.subscribe.bind(source.source) }
    const controller = new MachineController(new Host(), createService({ count: 0 }), { context, sync: true })
    try {
      expect(controller.state.context.count).toBe(0)
      controller.hostConnected()
      source.emit(4)
      expect(controller.state.context.count).toBe(4)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('keeps the existing source interpretation when all source-like data fields are callable', () => {
    const get = vi.fn(() => ({ count: 4 }))
    const subscribe = vi.fn(() => () => {})
    const context = Object.freeze({ count: 99, get, subscribe })
    const machine = createService({ count: 0, get: () => ({ count: 0 }), subscribe })
    const controller = new MachineController(new Host(), machine, { context, sync: true })
    try {
      expect(controller.state.context.count).toBe(4)
      // Structural source detection cannot infer whether callable fields were meant as data.
      expect(controller.state.context.get).not.toBe(context.get)
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('preserves the identity of errors thrown by source get', () => {
    const error = new Error('source get failed')
    const context = {
      get() { throw error },
      subscribe: () => () => {},
    }
    let caught: unknown
    try {
      const controller = new MachineController(new Host(), createService({ count: 0 }), { context })
      controller.hostDisconnected()
    }
    catch (value) {
      caught = value
    }
    expect(caught).toBe(error)
  })

  it('preserves source subscribe errors without swallowing or retrying', () => {
    const error = new Error('source subscribe failed')
    const subscribe = vi.fn(() => {
      throw error
    })
    const controller = new MachineController(new Host(), createService({ count: 0 }), { context: { subscribe } })
    try {
      let caught: unknown
      try {
        controller.hostConnected()
      }
      catch (value) {
        caught = value
      }
      expect(caught).toBe(error)
      expect(subscribe).toHaveBeenCalledOnce()
    }
    finally {
      controller.hostDisconnected()
    }
  })

  it('checks valid and invalid strict consumers through the public source entry point', () => {
    const root = fileURLToPath(new URL('../../../../', import.meta.url))
    const fixture = fileURLToPath(new URL('./fixtures/context-discriminator-consumer.ts', import.meta.url))
    const options: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      esModuleInterop: true,
      baseUrl: root,
      paths: {
        '@destyler/lit': ['packages/frameworks/lit/index.ts'],
        '@destyler/xstate': ['packages/xstate/index.ts'],
        '@destyler/store': ['packages/store/index.ts'],
        '@destyler/utils': ['packages/utils/index.ts'],
        '@destyler/types': ['packages/types/index.ts'],
      },
    }
    const checked = ts.createProgram([fixture], options)
    const diagnostics = ts.getPreEmitDiagnostics(checked)
    expect(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: name => name,
      getCurrentDirectory: () => root,
      getNewLine: () => '\n',
    })).toBe('')

    const host = ts.createCompilerHost(options)
    const getSourceFile = host.getSourceFile.bind(host)
    host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
      if (resolve(fileName) === resolve(fixture)) {
        const text = readFileSync(fixture, 'utf8').replace(/@ts-expect-error/g, 'invalid-consumer')
        return ts.createSourceFile(fileName, text, languageVersion, true)
      }
      return getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile)
    }
    const unchecked = ts.createProgram([fixture], options, host)
    const invalid = ts.getPreEmitDiagnostics(unchecked)
    expect(invalid).toHaveLength(6)
    expect(invalid.every(diagnostic => diagnostic.file?.fileName === fixture)).toBe(true)
  }, 30_000)
})
