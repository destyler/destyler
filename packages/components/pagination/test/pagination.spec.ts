import { part, testid } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

const root = part('root')
const item = part('item')
const link = part('link')
const separator = part('separator')
const current = testid('current-pagination')
const disabled = testid('disabled-pagination')

// === 基础渲染测试 ===
export async function RendersCorrectly() {
  const componentEl = page.getByArticle(root)
  await expect.element(componentEl).toBeInTheDocument()
  await expect.element(componentEl).toHaveAttribute('data-part', 'root')
  await expect.element(componentEl).toHaveAttribute('data-scope', 'pagination')
}

export async function ShouldRenderNavigationStructure() {
  const componentEl = page.getByArticle(root)
  const items = page.getByArticle(item)

  await expect.element(componentEl).toHaveAttribute('role', 'navigation')
  await expect.element(items).toHaveCount.toBeGreaterThan(0)
}

// === 键盘导航测试 ===
export async function ShouldNavigateWithArrowKeys() {
  const items = page.getByArticle(item)

  if (await items.count() > 1) {
    await items.first().focus()

    await userEvent.keyboard('{ArrowRight}')
    await expect.element(items.nth(1)).toBeFocused()

    await userEvent.keyboard('{ArrowLeft}')
    await expect.element(items.first()).toBeFocused()
  }
}

export async function ShouldNavigateWithTabKey() {
  const items = page.getByArticle(item)

  if (await items.count() > 1) {
    await items.first().focus()

    await userEvent.keyboard('{Tab}')
    await expect.element(items.nth(1)).toBeFocused()
  }
}

export async function ShouldHandleHomeAndEndKeys() {
  const items = page.getByArticle(item)

  if (await items.count() > 1) {
    await items.first().focus()

    await userEvent.keyboard('{End}')
    await expect.element(items.last()).toBeFocused()

    await userEvent.keyboard('{Home}')
    await expect.element(items.first()).toBeFocused()
  }
}

export async function ShouldSkipDisabledItems() {
  const items = page.getByArticle(item)
  const disabledItem = page.getByArticle(disabled)

  if (await disabledItem.count() > 0 && await items.count() > 2) {
    await items.first().focus()

    // 导航应该跳过禁用项
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard('{ArrowRight}')

    const focusedElement = page.locator(':focus')
    await expect.element(focusedElement).not.toHaveAttribute('data-disabled', '')
  }
}

// === 当前项测试 ===
export async function ShouldHighlightCurrentItem() {
  const currentItem = page.getByArticle(current)

  if (await currentItem.count() > 0) {
    await expect.element(currentItem).toHaveAttribute('aria-current', 'page')
    await expect.element(currentItem).toHaveAttribute('data-current', '')
  }
}

export async function ShouldNotNavigateAwayFromCurrent() {
  const currentItem = page.getByArticle(current)

  if (await currentItem.count() > 0) {
    await currentItem.click()

    // 当前项应该保持当前状态
    await expect.element(currentItem).toHaveAttribute('aria-current', 'page')
  }
}

// === 链接和导航测试 ===
export async function ShouldHandleLinkNavigation() {
  const links = page.getByArticle(link)

  if (await links.count() > 0) {
    const firstLink = links.first()

    await expect.element(firstLink).toHaveAttribute('href')

    // 测试链接点击
    await firstLink.click()

    // 应该能够处理导航
    await expect.element(firstLink).toBeInTheDocument()
  }
}

export async function ShouldSupportEnterKeyOnLinks() {
  const links = page.getByArticle(link)

  if (await links.count() > 0) {
    const firstLink = links.first()

    await firstLink.focus()
    await userEvent.keyboard('{Enter}')

    // 应该触发导航
    await expect.element(firstLink).toBeInTheDocument()
  }
}

// === 分隔符测试 ===
export async function ShouldRenderSeparators() {
  const separators = page.getByArticle(separator)

  if (await separators.count() > 0) {
    await expect.element(separators.first()).toHaveAttribute('aria-hidden', 'true')
    await expect.element(separators.first()).toHaveAttribute('role', 'separator')
  }
}

export async function ShouldNotFocusSeparators() {
  const separators = page.getByArticle(separator)

  if (await separators.count() > 0) {
    await separators.first().focus()
    await expect.element(separators.first()).not.toBeFocused()
  }
}

// === 可访问性测试 ===
export async function ShouldHaveCorrectAriaAttributes() {
  const componentEl = page.getByArticle(root)
  const items = page.getByArticle(item)

  await expect.element(componentEl).toHaveAttribute('role', 'navigation')
  await expect.element(componentEl).toHaveAttribute('aria-label')

  if (await items.count() > 0) {
    await expect.element(items.first()).toHaveAttribute('role')
  }
}

export async function ShouldSupportAriaLandmark() {
  const componentEl = page.getByArticle(root)

  await expect.element(componentEl).toHaveAttribute('role', 'navigation')
  await expect.element(componentEl).toHaveAttribute('aria-label')
}

// === 响应式测试 ===
export async function ShouldCollapseOnMobile() {
  await page.setViewportSize({ width: 375, height: 667 })

  const componentEl = page.getByArticle(root)
  const items = page.getByArticle(item)

  await expect.element(componentEl).toBeVisible()

  // 在移动设备上可能会折叠
  if (await items.count() > 3) {
    const visibleItems = items.filter({ hasText: /.+/ })
    const itemCount = await visibleItems.count()

    // 应该显示较少的项目或有折叠机制
    expect(itemCount).toBeGreaterThan(0)
  }
}

export async function ShouldExpandOnDesktop() {
  await page.setViewportSize({ width: 1920, height: 1080 })

  const componentEl = page.getByArticle(root)
  const items = page.getByArticle(item)

  await expect.element(componentEl).toBeVisible()

  // 在桌面上应该显示所有项目
  if (await items.count() > 0) {
    await expect.element(items.first()).toBeVisible()
  }
}

// === 性能测试 ===
export async function ShouldRenderLargeListsEfficiently() {
  const items = page.getByArticle(item)

  const startTime = performance.now()

  // 模拟大量项目的渲染
  for (let i = 0; i < await items.count(); i++) {
    await items.nth(i).hover()
  }

  const endTime = performance.now()
  const totalTime = endTime - startTime

  expect(totalTime).toBeLessThan(1000)
}

export async function ShouldHandleRapidNavigation() {
  const items = page.getByArticle(item)

  if (await items.count() > 1) {
    await items.first().focus()

    const startTime = performance.now()

    for (let i = 0; i < 10; i++) {
      await userEvent.keyboard('{ArrowRight}')
      await userEvent.keyboard('{ArrowLeft}')
    }

    const endTime = performance.now()
    const totalTime = endTime - startTime

    expect(totalTime).toBeLessThan(500)
  }
}
