import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as fileUpload from '../../index'

export class FileUpload extends Component<fileUpload.Context, fileUpload.Api> {
  initService(context: fileUpload.Context) {
    return fileUpload.machine(context)
  }

  initApi() {
    return fileUpload.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))
  }
}

export function createFileUpload(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'file-upload'
    root.textContent = 'FileUpload Component'
    resolve(root)
  })
}
