import { part, testid } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

const root = part('root')
const trigger = part('trigger')
const content = part('content')
const item = part('item')
const panel = part('panel')
const header = part('header')
const disabledComponent = testid('disabled-menu')
const nestedComponent = testid('nested-menu')

// === 基础渲染测试 ===
export async function RendersCorrectly() {
  const componentEl = page.getByArticle(root)
  await expect.element(componentEl).toBeInTheDocument()
  await expect.element(componentEl).toHaveAttribute('data-part', 'root')
  await expect.element(componentEl).toHaveAttribute('data-scope', 'menu')
}

export async function ShouldRenderTriggerAndContent() {
  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await expect.element(triggerEl).toBeInTheDocument()
  await expect.element(contentEl).toBeInTheDocument()
}

// === 打开/关闭行为测试 ===
export async function ShouldOpenOnTriggerClick() {
  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await triggerEl.click()

  await expect.element(contentEl).toBeVisible()
  await expect.element(triggerEl).toHaveAttribute('aria-expanded', 'true')
}

export async function ShouldCloseOnSecondClick() {
  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await triggerEl.click()
  await triggerEl.click()

  await expect.element(contentEl).not.toBeVisible()
  await expect.element(triggerEl).toHaveAttribute('aria-expanded', 'false')
}

export async function ShouldOpenOnEnterKey() {
  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await triggerEl.focus()
  await userEvent.keyboard('{Enter}')

  await expect.element(contentEl).toBeVisible()
}

export async function ShouldOpenOnSpaceKey() {
  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await triggerEl.focus()
  await userEvent.keyboard('{Space}')

  await expect.element(contentEl).toBeVisible()
}

export async function ShouldCloseOnEscape() {
  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await triggerEl.click()
  await userEvent.keyboard('{Escape}')

  await expect.element(contentEl).not.toBeVisible()
}

export async function ShouldCloseOnOutsideClick() {
  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await triggerEl.click()
  await page.locator('body').click({ position: { x: 0, y: 0 } })

  await expect.element(contentEl).not.toBeVisible()
}

// === 键盘导航测试 ===
export async function ShouldNavigateWithArrowKeys() {
  const triggerEl = page.getByArticle(trigger)
  const items = page.getByArticle(item)

  await triggerEl.click()

  if (await items.count() > 0) {
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(items.first()).toHaveAttribute('data-highlighted', '')

    await userEvent.keyboard('{ArrowDown}')
    if (await items.count() > 1) {
      await expect.element(items.nth(1)).toHaveAttribute('data-highlighted', '')
    }

    await userEvent.keyboard('{ArrowUp}')
    await expect.element(items.first()).toHaveAttribute('data-highlighted', '')
  }
}

export async function ShouldHandleHomeAndEndKeys() {
  const triggerEl = page.getByArticle(trigger)
  const items = page.getByArticle(item)

  await triggerEl.click()

  if (await items.count() > 1) {
    await userEvent.keyboard('{End}')
    await expect.element(items.last()).toHaveAttribute('data-highlighted', '')

    await userEvent.keyboard('{Home}')
    await expect.element(items.first()).toHaveAttribute('data-highlighted', '')
  }
}

export async function ShouldSupportLoopNavigation() {
  const triggerEl = page.getByArticle(trigger)
  const items = page.getByArticle(item)

  await triggerEl.click()

  if (await items.count() > 1) {
    await userEvent.keyboard('{End}')
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(items.first()).toHaveAttribute('data-highlighted', '')

    await userEvent.keyboard('{Home}')
    await userEvent.keyboard('{ArrowUp}')
    await expect.element(items.last()).toHaveAttribute('data-highlighted', '')
  }
}

export async function ShouldSupportTypeaheadSearch() {
  const triggerEl = page.getByArticle(trigger)
  const items = page.getByArticle(item)

  await triggerEl.click()

  if (await items.count() > 0) {
    await userEvent.keyboard('a')

    const matchingItems = items.filter({ hasText: /^a/i })
    if (await matchingItems.count() > 0) {
      await expect.element(matchingItems.first()).toHaveAttribute('data-highlighted', '')
    }
  }
}

// === 焦点管理测试 ===
export async function ShouldMaintainFocusManagement() {
  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await triggerEl.click()
  await userEvent.keyboard('{Escape}')

  await expect.element(triggerEl).toBeFocused()
}

export async function ShouldTrapFocusInContent() {
  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await triggerEl.click()

  // 测试焦点陷阱
  const focusableElements = contentEl.locator('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')

  if (await focusableElements.count() > 0) {
    await userEvent.keyboard('{Tab}')
    await expect.element(focusableElements.first()).toBeFocused()
  }
}

export async function ShouldHandleFocusOnOpen() {
  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await triggerEl.click()

  // 内容打开时应该正确管理焦点
  const firstFocusable = contentEl.locator('button, input, select, textarea, [tabindex]:not([tabindex="-1"])').first()

  if (await firstFocusable.count() > 0) {
    await expect.element(firstFocusable).toBeFocused()
  }
}

// === 状态管理测试 ===
export async function ShouldBeDisabledWhenDisabled() {
  const disabledEl = page.getByArticle(disabledComponent)
  const disabledTrigger = disabledEl.getByArticle(trigger)

  await expect.element(disabledEl).toHaveAttribute('data-disabled', '')
  await expect.element(disabledTrigger).toHaveAttribute('aria-disabled', 'true')
}

export async function ShouldNotOpenWhenDisabled() {
  const disabledEl = page.getByArticle(disabledComponent)
  const disabledTrigger = disabledEl.getByArticle(trigger)
  const disabledContent = disabledEl.getByArticle(content)

  await disabledTrigger.click()
  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{Space}')

  await expect.element(disabledContent).not.toBeVisible()
}

export async function ShouldHandleMultipleInstances() {
  const triggers = page.getByArticle(trigger)

  if (await triggers.count() > 1) {
    await triggers.first().click()
    await triggers.last().click()

    // 第一个应该关闭，第二个应该打开
    const firstContent = page.getByArticle(content).first()
    const lastContent = page.getByArticle(content).last()

    await expect.element(firstContent).not.toBeVisible()
    await expect.element(lastContent).toBeVisible()
  }
}

// === 嵌套组件测试 ===
export async function ShouldHandleNestedComponents() {
  const nestedEl = page.getByArticle(nestedComponent)

  if (await nestedEl.count() > 0) {
    const nestedTrigger = nestedEl.getByArticle(trigger)
    const nestedContent = nestedEl.getByArticle(content)

    await nestedTrigger.click()
    await expect.element(nestedContent).toBeVisible()

    // 测试嵌套的事件不会冒泡
    await userEvent.keyboard('{Escape}')
    await expect.element(nestedContent).not.toBeVisible()
  }
}

// === 可访问性测试 ===
export async function ShouldHaveCorrectAriaAttributes() {
  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await expect.element(triggerEl).toHaveAttribute('aria-expanded')
  await expect.element(triggerEl).toHaveAttribute('aria-controls')
  await expect.element(contentEl).toHaveAttribute('aria-labelledby')
}

export async function ShouldSupportAriaLiveRegions() {
  const triggerEl = page.getByArticle(trigger)

  await triggerEl.click()

  const liveRegions = page.locator('[aria-live]')
  const statusElements = page.locator('[role="status"]')

  const hasLiveRegion = await liveRegions.count() > 0 || await statusElements.count() > 0
  expect(hasLiveRegion).toBeTruthy()
}

// === 性能测试 ===
export async function ShouldOpenWithinPerformanceThreshold() {
  const triggerEl = page.getByArticle(trigger)

  const startTime = performance.now()
  await triggerEl.click()
  const endTime = performance.now()

  const openTime = endTime - startTime
  expect(openTime).toBeLessThan(100)
}

export async function ShouldHandleRapidToggles() {
  const triggerEl = page.getByArticle(trigger)

  const startTime = performance.now()

  for (let i = 0; i < 10; i++) {
    await triggerEl.click()
  }

  const endTime = performance.now()
  const totalTime = endTime - startTime

  expect(totalTime).toBeLessThan(1000)
}

// === 响应式测试 ===
export async function ShouldWorkOnMobileDevices() {
  await page.setViewportSize({ width: 375, height: 667 })

  const triggerEl = page.getByArticle(trigger)
  const contentEl = page.getByArticle(content)

  await triggerEl.click()
  await expect.element(contentEl).toBeVisible()

  // 测试触摸交互
  await userEvent.pointer({ target: triggerEl, keys: '[TouchA]' })

  await expect.element(contentEl).toBeVisible()
}

export async function ShouldAdaptToViewportSize() {
  const contentEl = page.getByArticle(content)

  // 测试小屏幕
  await page.setViewportSize({ width: 320, height: 568 })
  await expect.element(contentEl).toBeInTheDocument()

  // 测试大屏幕
  await page.setViewportSize({ width: 1920, height: 1080 })
  await expect.element(contentEl).toBeInTheDocument()
}
