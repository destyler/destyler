import type { ContextFrom } from '@destyler/vanilla'
import type { State as TreeState } from '../../src/types'
import type { FileNode } from '../data'
import { treeControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as tree from '../../index'
import { createFileTreeCollection, defaultExpandedBranches } from '../data'
import '../style.css'

type TreeMachineContext = ContextFrom<typeof tree.machine>

type TreeMachineSnapshot = Parameters<typeof tree.connect>[0]

class TreeExample extends Component<any, tree.Api> {
  private collection = this.context.collection ?? createFileTreeCollection()

  private readonly labelEl = this.rootEl.querySelector<HTMLHeadingElement>('[data-tree-label]')
  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-tree-root]')
  private readonly treeNode = this.rootEl.querySelector<HTMLElement>('[data-tree-tree]')
  private readonly expandedMetaEl = this.rootEl.querySelector<HTMLElement>('[data-tree-meta]')

  private readonly expandButton = this.rootEl.querySelector<HTMLButtonElement>('[data-tree-expand]')
  private readonly collapseButton = this.rootEl.querySelector<HTMLButtonElement>('[data-tree-collapse]')
  private readonly selectButton = this.rootEl.querySelector<HTMLButtonElement>('[data-tree-select]')
  private readonly deselectButton = this.rootEl.querySelector<HTMLButtonElement>('[data-tree-deselect]')

  private readonly stateListeners = new Set<(state: TreeState) => void>()

  initService(context: tree.Context) {
    return tree.machine({
      ...context,
      collection: this.collection,
    }) as tree.Service
  }

  initApi() {
    return tree.connect(this.service.state as TreeMachineSnapshot, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: TreeState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: any) {
    this.stateListeners.forEach(listener => listener(state as TreeState))
  }

  private createBranchMeta(count: number) {
    const meta = document.createElement('span')
    meta.className = 'tree-example__meta'
    meta.textContent = `${count} items`
    return meta
  }

  private createNodeElement(node: FileNode, indexPath: number[], api: tree.Api): HTMLElement {
    const nodeProps = { node, indexPath }
    const nodeState = api.getNodeState(nodeProps)

    if (nodeState.isBranch) {
      const branch = document.createElement('div')
      spreadProps(branch, api.getBranchProps(nodeProps))

      const control = document.createElement('div')
      spreadProps(control, api.getBranchControlProps(nodeProps))

      const indicator = document.createElement('span')
      spreadProps(indicator, api.getBranchIndicatorProps(nodeProps))

      const text = document.createElement('span')
      text.textContent = node.name
      spreadProps(text, api.getBranchTextProps(nodeProps))

      const meta = this.createBranchMeta(node.children?.length ?? 0)

      control.append(indicator, text, meta)
      branch.appendChild(control)

      if (nodeState.expanded) {
        const content = document.createElement('div')
        spreadProps(content, api.getBranchContentProps(nodeProps))

        const indent = document.createElement('div')
        spreadProps(indent, api.getBranchIndentGuideProps(nodeProps))
        content.appendChild(indent)

        node.children?.forEach((child, childIndex) => {
          content.appendChild(this.createNodeElement(child, [...indexPath, childIndex], api))
        })

        branch.appendChild(content)
      }

      return branch
    }

    const item = document.createElement('div')
    spreadProps(item, api.getItemProps(nodeProps))

    const indicator = document.createElement('span')
    spreadProps(indicator, api.getItemIndicatorProps(nodeProps))

    const text = document.createElement('span')
    text.textContent = node.name
    spreadProps(text, api.getItemTextProps(nodeProps))

    item.append(indicator, text)
    return item
  }

  private renderTree(api: tree.Api) {
    if (!this.treeNode)
      return

    this.treeNode.innerHTML = ''
    const children = (api.collection.rootNode.children as FileNode[] | undefined) ?? []
    children.forEach((node, index) => {
      this.treeNode!.appendChild(this.createNodeElement(node, [index], api))
    })
  }

  render = () => {
    const api = this.api

    if (this.labelEl)
      spreadProps(this.labelEl, api.getLabelProps())
    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())
    if (this.treeNode)
      spreadProps(this.treeNode, api.getTreeProps())
    if (this.expandedMetaEl)
      this.expandedMetaEl.textContent = `${api.expandedValue.length} open folders`

    if (this.expandButton)
      this.expandButton.onclick = () => api.expand()
    if (this.collapseButton)
      this.collapseButton.onclick = () => api.collapse()
    if (this.selectButton)
      this.selectButton.onclick = () => api.select()
    if (this.deselectButton)
      this.deselectButton.onclick = () => api.deselect()

    this.renderTree(api)
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(treeControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="tree-example" data-tree-example>
      <section class="tree-example__card">
        <div class="tree-example__header">
          <h3 data-tree-label>Project files</h3>
          <div class="tree-example__meta-group">
            <span class="tree-example__meta" data-tree-meta>0 open folders</span>
            <span class="tree-example__meta" data-tree-mode>Mode: single</span>
          </div>
        </div>

        <div class="tree-example__actions">
          <button type="button" data-tree-expand>Expand all</button>
          <button type="button" data-tree-collapse>Collapse all</button>
          <button type="button" data-tree-select>Select all</button>
          <button type="button" data-tree-deselect>Clear selection</button>
        </div>

        <div data-tree-root>
          <div data-tree-tree></div>
        </div>
      </section>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-tree-example]')
  if (!scope)
    return

  const modeMetaEl = layout.main.querySelector<HTMLElement>('[data-tree-mode]')
  const setModeMeta = (mode: typeof controls.context.selectionMode) => {
    if (modeMetaEl)
      modeMetaEl.textContent = `Mode: ${mode}`
  }
  setModeMeta(controls.context.selectionMode)

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const collection = createFileTreeCollection()
  const mapControlsToContext = (ctx: typeof controls.context) => ({
    dir: ctx.dir,
    selectionMode: ctx.selectionMode,
    expandOnClick: ctx.openOnClick,
    collection,
  })

  const contextSource = {
    get: () => mapControlsToContext(controls.context),
    subscribe: (fn: (ctx: Partial<TreeMachineContext>) => void) =>
      controls.subscribe((ctx: typeof controls.context) => {
        setModeMeta(ctx.selectionMode)
        fn(mapControlsToContext(ctx))
      }),
  }

  const instance = new TreeExample(
    scope,
    {
      id: 'tree:vanilla',
      collection,
      expandedValue: defaultExpandedBranches,
    },
    { context: contextSource },
  )

  instance.init()

  const updateVisualizer = (state?: TreeState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state, omit: ['collection'] }))
  }

  updateVisualizer(instance.state as unknown as TreeState)
  instance.onStateChange(updateVisualizer)
}
