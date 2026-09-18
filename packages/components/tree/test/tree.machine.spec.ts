import { afterEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const sampleCollection = collection({
  nodeToValue: (node: any) => node.id,
  nodeToString: (node: any) => node.name,
  rootNode: {
    id: 'ROOT',
    name: 'ROOT',
    children: [
      {
        id: 'node_modules',
        name: 'node_modules',
        children: [{ id: 'zag-js', name: 'zag-js' }],
      },
      { id: 'README.md', name: 'README.md' },
    ],
  },
})

function createTree(ctx: Record<string, unknown> = {}) {
  return machine({
    id: 'tree-test',
    collection: sampleCollection,
    ...ctx,
  } as any)
}

describe('tree controllable expanded/selected (Phase 3)', () => {
  const services: Array<ReturnType<typeof machine>> = []

  afterEach(() => {
    while (services.length) {
      const s = services.pop()
      try {
        s?.stop()
      }
      catch {
        // ignore
      }
    }
  })

  function start(ctx: Record<string, unknown> = {}) {
    const service = createTree(ctx)
    services.push(service)
    service.start()
    return service
  }

  it('uncontrolled: defaultExpandedValue seeds expandedValue', () => {
    const service = start({ defaultExpandedValue: ['node_modules'] })
    expect(service.state.context.expandedValue).toEqual(['node_modules'])
  })

  it('uncontrolled: legacy expandedValue seed (compat)', () => {
    const service = start({ expandedValue: ['node_modules'] })
    expect(service.state.context.expandedValue).toEqual(['node_modules'])
  })

  it('uncontrolled: neither starts empty arrays', () => {
    const service = start({})
    expect(service.state.context.expandedValue).toEqual([])
    expect(service.state.context.selectedValue).toEqual([])
  })

  it('uncontrolled: defaultExpandedValue preferred over expandedValue seed', () => {
    const service = start({
      defaultExpandedValue: ['node_modules'],
      expandedValue: ['README.md'],
    })
    expect(service.state.context.expandedValue).toEqual(['node_modules'])
  })

  it('uncontrolled: defaultSelectedValue seeds selectedValue', () => {
    const service = start({ defaultSelectedValue: ['README.md'] })
    expect(service.state.context.selectedValue).toEqual(['README.md'])
  })

  it('phase 3 presence: expandedValue alone defers until parent syncs', () => {
    const onExpandedChange = vi.fn()
    const service = start({ expandedValue: [], onExpandedChange })
    service.send({ type: 'EXPANDED.SET', value: ['node_modules'] })
    expect(service.state.context.expandedValue).toEqual([])
    expect(onExpandedChange).toHaveBeenCalledWith(
      expect.objectContaining({ expandedValue: ['node_modules'] }),
    )

    service.setContext({ expandedValue: ['node_modules'] })
    expect(service.state.context.expandedValue).toEqual(['node_modules'])
  })

  it('phase 3 presence: selectedValue alone defers until parent syncs', () => {
    const onSelectionChange = vi.fn()
    const service = start({ selectedValue: [], onSelectionChange })
    service.send({ type: 'SELECTED.SET', value: ['README.md'] })
    expect(service.state.context.selectedValue).toEqual([])
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ selectedValue: ['README.md'] }),
    )

    service.setContext({ selectedValue: ['README.md'] })
    expect(service.state.context.selectedValue).toEqual(['README.md'])
  })


  it('controlled: expandedValue presence defers until parent syncs', () => {
    const onExpandedChange = vi.fn()
    const service = start({
      'expandedValue': [],
      onExpandedChange,
    })
    service.send({ type: 'EXPANDED.SET', value: ['node_modules'] })
    expect(service.state.context.expandedValue).toEqual([])
    expect(onExpandedChange).toHaveBeenCalledWith(
      expect.objectContaining({ expandedValue: ['node_modules'] }),
    )
    service.setContext({ expandedValue: ['node_modules'] })
    expect(service.state.context.expandedValue).toEqual(['node_modules'])
  })

  it('controlled: selectedValue presence defers until parent syncs', () => {
    const onSelectionChange = vi.fn()
    const service = start({
      'selectedValue': [],
      onSelectionChange,
    })
    service.send({ type: 'SELECTED.SET', value: ['README.md'] })
    expect(service.state.context.selectedValue).toEqual([])
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ selectedValue: ['README.md'] }),
    )
    service.setContext({ selectedValue: ['README.md'] })
    expect(service.state.context.selectedValue).toEqual(['README.md'])
  })

  it('connect setExpandedValue still sends EXPANDED.SET', () => {
    const service = start({})
    const api = connect(service.getState(), service.send, ((x: any) => x) as any)
    api.setExpandedValue(['node_modules'])
    expect(service.state.context.expandedValue).toEqual(['node_modules'])
  })
})
