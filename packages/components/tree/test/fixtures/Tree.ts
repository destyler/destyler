import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as tree from '../../index'

export class Tree extends Component<tree.Context, tree.Api> {
  initService(context: tree.Context) {
    return tree.machine(context)
  }

  initApi() {
    return tree.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createTree(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'tree'
    root.textContent = 'Tree Component'
    resolve(root)
  })
}
