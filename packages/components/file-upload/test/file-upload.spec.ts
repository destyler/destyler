import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/FileUpload'

let host: HTMLElement

function hiddenInput() {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]')
  if (!input)
    throw new Error('hidden file input not found')
  return input
}

function dropzoneEl() {
  const dropzone = document.querySelector<HTMLElement>(testHook.part('dropzone'))
  if (!dropzone)
    throw new Error('dropzone element not found')
  return dropzone
}

function createFile(name: string, type: string, size = 10) {
  const data = new Uint8Array(size).fill(1)
  return new File([data], name, { type })
}

function controlInput<T extends HTMLInputElement | HTMLSelectElement>(testId: string) {
  const input = document.querySelector<T>(`[data-testid="${testId}"]`)
  if (!input)
    throw new Error(`control ${testId} not found`)
  return input
}

function itemElements() {
  return Array.from(document.querySelectorAll<HTMLElement>(testHook.part('item')))
}

async function uploadThroughInput(files: File | File[]) {
  const fileList = Array.isArray(files) ? files : [files]
  await userEvent.upload(hiddenInput(), fileList)
}

function dispatchDrop(files: File | File[]) {
  const dropzone = dropzoneEl()
  const dataTransfer = new DataTransfer()
  const payload = Array.isArray(files) ? files : [files]
  payload.forEach(file => dataTransfer.items.add(file))

  dropzone.dispatchEvent(new DragEvent('dragover', {
    bubbles: true,
    dataTransfer,
  }))

  dropzone.dispatchEvent(new DragEvent('drop', {
    bubbles: true,
    dataTransfer,
  }))
}

async function setNumberControl(testId: string, value: number) {
  const input = controlInput<HTMLInputElement>(testId)
  input.value = String(value)
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
}

async function setStringControl(testId: string, value: string) {
  const input = controlInput<HTMLInputElement>(testId)
  input.value = value
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
}

async function toggleBooleanControl(testId: string) {
  const input = controlInput<HTMLInputElement>(testId)
  input.click()
}

describe('file-upload browser tests', () => {
  beforeEach(async () => {
    if (host)
      document.body.removeChild(host)

    host = document.createElement('div')
    document.body.appendChild(host)
    render(host)
  })

  it('adds files selected via the hidden input to the list', async () => {
    await uploadThroughInput(createFile('resume.pdf', 'application/pdf'))

    expect(itemElements()).toHaveLength(1)

    const itemName = page.getByArticle(testHook.part('item-name')).first()
    await expect.element(itemName).toHaveTextContent('resume.pdf')

    expect(hiddenInput().files?.item(0)?.name).toBe('resume.pdf')
  })

  it('removes an item when the delete trigger is clicked', async () => {
    await uploadThroughInput(createFile('contract.pdf', 'application/pdf'))

    const deleteTrigger = page.getByArticle(testHook.part('item-delete-trigger')).first()
    await deleteTrigger.click()

    expect(itemElements()).toHaveLength(0)
  })

  it('toggles dragging attributes and accepts files dropped onto the dropzone', async () => {
    const dropzone = page.getByArticle(testHook.part('dropzone'))
    const file = createFile('cover.png', 'image/png')

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)

    dropzoneEl().dispatchEvent(new DragEvent('dragover', {
      bubbles: true,
      dataTransfer,
    }))

    await expect.element(dropzone).toHaveAttribute('data-dragging', '')

    dropzoneEl().dispatchEvent(new DragEvent('drop', {
      bubbles: true,
      dataTransfer,
    }))

    dropzoneEl().dispatchEvent(new DragEvent('dragleave', {
      bubbles: true,
      dataTransfer,
      relatedTarget: document.body,
    }))

    await expect.element(dropzone).not.toHaveAttribute('data-dragging', '')

    const itemName = page.getByArticle(testHook.part('item-name')).first()
    await expect.element(itemName).toHaveTextContent('cover.png')
  })

  it('honors the maxFiles control and keeps the hidden input in multiple mode', async () => {
    await setNumberControl('maxFiles', 2)

    const first = createFile('photo-1.png', 'image/png')
    const second = createFile('photo-2.png', 'image/png')
    const extra = createFile('photo-3.png', 'image/png')

    await uploadThroughInput([first, second])
    expect(itemElements()).toHaveLength(2)
    expect(hiddenInput().multiple).toBe(true)

    await uploadThroughInput(extra)
    expect(itemElements()).toHaveLength(2)
  })

  it('applies the accept filter so only matching mime types are added', async () => {
    await setStringControl('accept', 'image/png')

    await uploadThroughInput(createFile('notes.txt', 'text/plain'))
    expect(itemElements()).toHaveLength(0)

    await uploadThroughInput(createFile('avatar.png', 'image/png'))
    const itemName = page.getByArticle(testHook.part('item-name')).first()
    await expect.element(itemName).toHaveTextContent('avatar.png')
  })

  it('disables interactions when the disabled control is toggled', async () => {
    await toggleBooleanControl('disabled')

    const dropzone = page.getByArticle(testHook.part('dropzone'))
    await expect.element(dropzone).toHaveAttribute('data-disabled', '')
    expect(hiddenInput().disabled).toBe(true)

    dispatchDrop(createFile('report.pdf', 'application/pdf'))
    expect(itemElements()).toHaveLength(0)
  })
})
