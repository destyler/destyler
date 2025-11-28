import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as TreeState } from '../../src/types'
import type { FileNode } from '../data'
import { treeControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as tree from '../../index'
import { createFileTreeCollection, defaultExpandedBranches } from '../data'
import '../style.css'

type TreeMachineContext = ContextFrom<typeof tree.machine>

class TreeExample extends Component<
  tree.Context,
  tree.Api,
  TreeMachineContext,
  MachineState
> {
  private collection = this.context.collection ?? createFileTreeCollection()

  private readonly rootNode: HTMLElement | null
  private readonly labelEl: HTMLElement | null
  private readonly metaEl: HTMLElement | null
  private readonly treeEl: HTMLElement | null
  private readonly expandAllBtn: HTMLButtonElement | null
  private readonly collapseAllBtn: HTMLButtonElement | null
  private readonly selectAllBtn: HTMLButtonElement | null
  private readonly clearSelectionBtn: HTMLButtonElement | null

  private readonly stateListeners = new Set<(state: TreeState) => void>()
  private nodeElements = new Map<string, HTMLElement>()

  constructor(rootEl: HTMLElement, context: tree.Context, options?: any) {
    super(rootEl, context, options)
    this.rootNode = rootEl.querySelector('[data-tree-root]')
    this.labelEl = rootEl.querySelector('[data-tree-label]')
    this.metaEl = rootEl.querySelector('[data-tree-meta]')
    this.treeEl = rootEl.querySelector('[data-tree-tree]')
    this.expandAllBtn = rootEl.querySelector('[data-tree-expand-all]')
    this.collapseAllBtn = rootEl.querySelector('[data-tree-collapse-all]')
    this.selectAllBtn = rootEl.querySelector('[data-tree-select-all]')
    this.clearSelectionBtn = rootEl.querySelector('[data-tree-clear-selection]')

    this.expandAllBtn?.addEventListener('click', () => this.api?.expand())
    this.collapseAllBtn?.addEventListener('click', () => this.api?.collapse())
    this.selectAllBtn?.addEventListener('click', () => this.api?.select())
    this.clearSelectionBtn?.addEventListener('click', () => this.api?.deselect())
  }

  initService(context: tree.Context) {
    return tree.machine({
      ...context,
      collection: this.collection,
      expandedValue: defaultExpandedBranches,
    }) as tree.Service
  }

  initApi() {
    return tree.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: TreeState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: TreeState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private renderNode(node: FileNode, indexPath: number[], container: HTMLElement): HTMLElement {
    const api = this.api
    const nodeProps = { node, indexPath }
    const nodeState = api.getNodeState(nodeProps)
    const nodeKey = node.id

    // Check if we have an existing element for this node
    const existingEl = this.nodeElements.get(nodeKey)

    if (nodeState.isBranch) {
      const childCount = node.children?.length ?? 0

      // Create or reuse branch element
      let branchEl: HTMLElement
      if (existingEl && existingEl.dataset.branch === nodeState.value) {
        branchEl = existingEl
      }
      else {
        branchEl = document.createElement('div')
        this.nodeElements.set(nodeKey, branchEl)
      }
      spreadProps(branchEl, api.getBranchProps(nodeProps))

      // Create or reuse control element
      let controlEl = branchEl.querySelector<HTMLElement>('[data-part="branch-control"]')
      if (!controlEl) {
        controlEl = document.createElement('div')
        branchEl.appendChild(controlEl)
      }
      spreadProps(controlEl, api.getBranchControlProps(nodeProps))

      // Create or reuse indicator element
      let indicatorEl = controlEl.querySelector<HTMLElement>('[data-part="branch-indicator"]')
      if (!indicatorEl) {
        indicatorEl = document.createElement('span')
        controlEl.appendChild(indicatorEl)
      }
      spreadProps(indicatorEl, api.getBranchIndicatorProps(nodeProps))

      // Create or reuse text element
      let textEl = controlEl.querySelector<HTMLElement>('[data-part="branch-text"]')
      if (!textEl) {
        textEl = document.createElement('span')
        textEl.textContent = node.name
        controlEl.appendChild(textEl)
      }
      spreadProps(textEl, api.getBranchTextProps(nodeProps))

      // Create or reuse meta element
      let metaEl = controlEl.querySelector<HTMLElement>('.tree-example__meta')
      if (!metaEl) {
        metaEl = document.createElement('span')
        metaEl.className = 'tree-example__meta'
        controlEl.appendChild(metaEl)
      }
      metaEl.textContent = `${childCount} items`

      // Handle branch content (expanded/collapsed state)
      let contentEl = branchEl.querySelector<HTMLElement>('[data-part="branch-content"]')

      if (nodeState.expanded) {
        if (!contentEl) {
          contentEl = document.createElement('div')
          branchEl.appendChild(contentEl)
        }
        spreadProps(contentEl, api.getBranchContentProps(nodeProps))

        // Create or reuse indent guide
        let indentGuideEl = contentEl.querySelector<HTMLElement>('[data-part="branch-indent-guide"]')
        if (!indentGuideEl) {
          indentGuideEl = document.createElement('div')
          contentEl.insertBefore(indentGuideEl, contentEl.firstChild)
        }
        spreadProps(indentGuideEl, api.getBranchIndentGuideProps(nodeProps))

        // Render children
        const existingChildren = Array.from(contentEl.querySelectorAll<HTMLElement>(':scope > [data-part="branch"], :scope > [data-part="item"]'))
        const childIds = new Set<string>()

        node.children?.forEach((childNode, childIndex) => {
          childIds.add(childNode.id)
          const childEl = this.renderNode(childNode, [...indexPath, childIndex], contentEl!)
          if (!childEl.parentElement) {
            contentEl!.appendChild(childEl)
          }
        })

        // Remove children that no longer exist
        existingChildren.forEach((child) => {
          const childValue = child.dataset.value
          if (childValue && !childIds.has(childValue)) {
            child.remove()
            this.nodeElements.delete(childValue)
          }
        })
      }
      else if (contentEl) {
        // Remove content when collapsed
        contentEl.remove()
      }

      if (!branchEl.parentElement) {
        container.appendChild(branchEl)
      }

      return branchEl
    }
    else {
      // Leaf node (item)
      let itemEl: HTMLElement
      if (existingEl && existingEl.dataset.part === 'item') {
        itemEl = existingEl
      }
      else {
        itemEl = document.createElement('div')
        this.nodeElements.set(nodeKey, itemEl)
      }
      spreadProps(itemEl, api.getItemProps(nodeProps))

      // Create or reuse indicator element
      let indicatorEl = itemEl.querySelector<HTMLElement>('[data-part="item-indicator"]')
      if (!indicatorEl) {
        indicatorEl = document.createElement('span')
        itemEl.appendChild(indicatorEl)
      }
      spreadProps(indicatorEl, api.getItemIndicatorProps(nodeProps))

      // Create or reuse text element
      let textEl = itemEl.querySelector<HTMLElement>('[data-part="item-text"]')
      if (!textEl) {
        textEl = document.createElement('span')
        textEl.textContent = node.name
        itemEl.appendChild(textEl)
      }
      spreadProps(textEl, api.getItemTextProps(nodeProps))

      if (!itemEl.parentElement) {
        container.appendChild(itemEl)
      }

      return itemEl
    }
  }

  private renderTree() {
    if (!this.treeEl)
      return

    const api = this.api
    const rootChildren = api.collection.rootNode.children as FileNode[] | undefined
    const childIds = new Set<string>()

    rootChildren?.forEach((node, index) => {
      childIds.add(node.id)
      this.renderNode(node, [index], this.treeEl!)
    })

    // Remove nodes that no longer exist at root level
    const existingRootChildren = Array.from(this.treeEl.querySelectorAll<HTMLElement>(':scope > [data-part="branch"], :scope > [data-part="item"]'))
    existingRootChildren.forEach((child) => {
      const childValue = child.dataset.value
      if (childValue && !childIds.has(childValue)) {
        child.remove()
        this.nodeElements.delete(childValue)
      }
    })
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    if (this.labelEl)
      spreadProps(this.labelEl, api.getLabelProps())

    if (this.metaEl)
      this.metaEl.textContent = `${api.expandedValue.length} open folders`

    if (this.treeEl)
      spreadProps(this.treeEl, api.getTreeProps())

    this.renderTree()
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(treeControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="tree-example">
      <section class="tree-example__card" data-tree-example>
        <div class="tree-example__header">
          <h3 data-tree-label>Project files</h3>
          <span class="tree-example__meta" data-tree-meta></span>
        </div>

        <div class="tree-example__actions">
          <button type="button" data-tree-expand-all>Expand all</button>
          <button type="button" data-tree-collapse-all>Collapse all</button>
          <button type="button" data-tree-select-all>Select all</button>
          <button type="button" data-tree-clear-selection>Clear selection</button>
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

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const collection = createFileTreeCollection()
  const contextSource = {
    get: () => {
      const ctx = controls.context
      return {
        dir: ctx.dir,
        selectionMode: ctx.selectionMode,
        expandOnClick: ctx.openOnClick,
        collection,
      }
    },
    subscribe: (fn: (ctx: Partial<TreeMachineContext>) => void) =>
      controls.subscribe((ctx: any) => {
        fn({
          dir: ctx.dir,
          selectionMode: ctx.selectionMode,
          expandOnClick: ctx.openOnClick,
          collection,
        })
      }),
  }

  const instance = new TreeExample(scope, { id: 'tree:vanilla', collection }, { context: contextSource })
  instance.init()

  const updateVisualizer = (state?: TreeState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state, omit: ['collection'] }))
  }

  updateVisualizer(instance.state as TreeState)
  instance.onStateChange(updateVisualizer)
}
