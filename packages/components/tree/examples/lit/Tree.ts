import type { ContextFrom } from '@destyler/lit'
import type { FileNode } from '../data'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { treeControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as tree from '../../index'
import { createFileTreeCollection, defaultExpandedBranches } from '../data'
import styles from '../style.css?inline'

type TreeMachineContext = ContextFrom<typeof tree.machine>

function createCollection() {
  return createFileTreeCollection()
}

@customElement('destyler-tree')
export class TreeElement extends LitElement {
  private controls = new ControlsController(treeControls)
  private collection = createCollection()

  private mapControlsContext(ctx: { dir: 'ltr' | 'rtl', selectionMode: 'single' | 'multiple', openOnClick: boolean }) {
    return {
      dir: ctx.dir,
      selectionMode: ctx.selectionMode,
      expandOnClick: ctx.openOnClick,
    }
  }

  private machine = new MachineController(
    this,
    tree.machine({
      id: 'tree:lit',
      collection: this.collection,
      expandedValue: defaultExpandedBranches,
    }),
    {
      context: {
        get: () => ({
          ...(this.mapControlsContext(this.controls.context) as Partial<TreeMachineContext>),
          collection: this.collection,
        }),
        subscribe: (fn: (ctx: Partial<TreeMachineContext>) => void) =>
          this.controls.subscribe((ctx) => {
            fn({
              ...this.mapControlsContext(ctx),
              collection: this.collection,
            })
          }),
      },
    },
  )

  private renderNode(node: FileNode, indexPath: number[], api: tree.Api): ReturnType<typeof html> {
    const nodeProps = { node, indexPath }
    const nodeState = api.getNodeState(nodeProps)

    if (nodeState.isBranch) {
      const items = node.children ?? []
      return html`
        <div ${spread(api.getBranchProps(nodeProps))}>
          <div ${spread(api.getBranchControlProps(nodeProps))}>
            <span ${spread(api.getBranchIndicatorProps(nodeProps))}></span>
            <span ${spread(api.getBranchTextProps(nodeProps))}>${node.name}</span>
            <span class="tree-example__meta">${items.length} items</span>
          </div>
          ${nodeState.expanded
            ? html`
                <div ${spread(api.getBranchContentProps(nodeProps))}>
                  <div ${spread(api.getBranchIndentGuideProps(nodeProps))}></div>
                  ${items.map((child, childIndex) => this.renderNode(child, [...indexPath, childIndex], api))}
                </div>
              `
            : null}
        </div>
      `
    }

    return html`
      <div ${spread(api.getItemProps(nodeProps))}>
        <span ${spread(api.getItemIndicatorProps(nodeProps))}></span>
        <span ${spread(api.getItemTextProps(nodeProps))}>${node.name}</span>
      </div>
    `
  }

  render() {
    const api = tree.connect(this.machine.state, this.machine.send, normalizeProps)
    const rootChildren = api.collection.rootNode.children ?? []
    const { selectionMode } = this.controls.context

    return html`
      <destyler-layout>
        <main class="tree-example">
          <section class="tree-example__card">
            <div class="tree-example__header">
              <h3 ${spread(api.getLabelProps())}>Project files</h3>
              <div class="tree-example__meta-group">
                <span class="tree-example__meta">${api.expandedValue.length} open folders</span>
                <span class="tree-example__meta">Mode: ${selectionMode}</span>
              </div>
            </div>

            <div class="tree-example__actions">
              <button type="button" @click=${() => api.expand()}>Expand all</button>
              <button type="button" @click=${() => api.collapse()}>Collapse all</button>
              <button type="button" @click=${() => api.select()}>Select all</button>
              <button type="button" @click=${() => api.deselect()}>Clear selection</button>
            </div>

            <div ${spread(api.getRootProps())}>
              <div ${spread(api.getTreeProps())}>
                ${rootChildren.map((node: FileNode, index: number) => this.renderNode(node, [index], api))}
              </div>
            </div>
          </section>
        </main>

        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer .state=${this.machine.state} .omit=${['collection']}>
          </destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-tree': TreeElement
  }
}
