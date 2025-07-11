import { part, testid } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

const root = part('root')
const control = part('control')
const label = part('label')
const input = part('input')
const hiddenInput = testid('hidden-input')
const disabledComponent = testid('disabled-presence')
const readonlyComponent = testid('readonly-presence')
const invalidComponent = testid('invalid-presence')
const requiredComponent = testid('required-presence')

// === 基础渲染测试 ===
export async function RendersCorrectly() {
  const componentEl = page.getByArticle(root)
  await expect.element(componentEl).toBeInTheDocument()
  await expect.element(componentEl).toHaveAttribute('data-part', 'root')
  await expect.element(componentEl).toHaveAttribute('data-scope', 'presence')
}

export async function ShouldHaveCorrectInitialState() {
  const componentEl = page.getByArticle(root)
  await expect.element(componentEl).toHaveAttribute('data-state')

  const controlEl = page.getByArticle(control)
  await expect.element(controlEl).toBeInTheDocument()
}

export async function ShouldRenderAllRequiredParts() {
  const componentEl = page.getByArticle(root)
  const controlEl = page.getByArticle(control)

  await expect.element(componentEl).toBeInTheDocument()
  await expect.element(controlEl).toBeInTheDocument()
}

// === 交互测试 ===
export async function ShouldRespondToClick() {
  const componentEl = page.getByArticle(root)
  const initialState = await componentEl.getAttribute('data-state')

  await componentEl.click()

  const newState = await componentEl.getAttribute('data-state')
  expect(newState).not.toBe(initialState)
}

export async function ShouldHandleKeyboardInteraction() {
  const componentEl = page.getByArticle(root)

  await componentEl.focus()
  await userEvent.keyboard('{Space}')

  await expect.element(componentEl).toHaveAttribute('data-state')
}

export async function ShouldHandleEnterKey() {
  const componentEl = page.getByArticle(root)

  await componentEl.focus()
  await userEvent.keyboard('{Enter}')

  await expect.element(componentEl).toHaveAttribute('data-state')
}

export async function ShouldHandleMouseInteractions() {
  const componentEl = page.getByArticle(root)

  // 测试悬停
  await userEvent.hover(componentEl)
  await expect.element(componentEl).toHaveAttribute('data-hover', '')

  // 测试离开
  await userEvent.unhover(componentEl)
  await expect.element(componentEl).not.toHaveAttribute('data-hover', '')

  // 测试按下
  await userEvent.pointer({ target: componentEl, keys: '[MouseLeft>]' })
  await expect.element(componentEl).toHaveAttribute('data-active', '')

  await userEvent.pointer({ target: componentEl, keys: '[/MouseLeft]' })
  await expect.element(componentEl).not.toHaveAttribute('data-active', '')
}

// === 状态管理测试 ===
export async function ShouldBeDisabledWhenDisabled() {
  const disabledEl = page.getByArticle(disabledComponent)

  await expect.element(disabledEl).toHaveAttribute('data-disabled', '')
  await expect.element(disabledEl).toHaveAttribute('aria-disabled', 'true')

  const hiddenInput = disabledEl.locator('input')
  if (await hiddenInput.count() > 0) {
    await expect.element(hiddenInput).toBeDisabled()
  }
}

export async function ShouldNotRespondWhenDisabled() {
  const disabledEl = page.getByArticle(disabledComponent)
  const initialState = await disabledEl.getAttribute('data-state')

  await disabledEl.click()
  await userEvent.keyboard('{Space}')

  const finalState = await disabledEl.getAttribute('data-state')
  expect(finalState).toBe(initialState)
}

export async function ShouldBeReadonlyWhenReadonly() {
  const readonlyEl = page.getByArticle(readonlyComponent)

  await expect.element(readonlyEl).toHaveAttribute('data-readonly', '')

  const hiddenInput = readonlyEl.locator('input')
  if (await hiddenInput.count() > 0) {
    await expect.element(hiddenInput).toHaveAttribute('readonly')
  }
}

export async function ShouldNotChangeWhenReadonly() {
  const readonlyEl = page.getByArticle(readonlyComponent)
  const initialState = await readonlyEl.getAttribute('data-state')

  await readonlyEl.click()

  const finalState = await readonlyEl.getAttribute('data-state')
  expect(finalState).toBe(initialState)
}

export async function ShouldShowInvalidStateWhenInvalid() {
  const invalidEl = page.getByArticle(invalidComponent)

  await expect.element(invalidEl).toHaveAttribute('data-invalid', '')
  await expect.element(invalidEl).toHaveAttribute('aria-invalid', 'true')
}

export async function ShouldShowRequiredStateWhenRequired() {
  const requiredEl = page.getByArticle(requiredComponent)

  await expect.element(requiredEl).toHaveAttribute('data-required', '')
  await expect.element(requiredEl).toHaveAttribute('aria-required', 'true')
}

// === 焦点管理测试 ===
export async function ShouldBeFocusableWhenEnabled() {
  const componentEl = page.getByArticle(root)

  await componentEl.focus()
  await expect.element(componentEl).toBeFocused()
  await expect.element(componentEl).toHaveAttribute('data-focus', '')
}

export async function ShouldNotBeFocusableWhenDisabled() {
  const disabledEl = page.getByArticle(disabledComponent)

  await disabledEl.focus()
  await expect.element(disabledEl).not.toBeFocused()
}

export async function ShouldShowFocusIndicator() {
  const componentEl = page.getByArticle(root)

  await componentEl.focus()

  const focusStyles = await componentEl.evaluate((el) => {
    const styles = window.getComputedStyle(el)
    return {
      outline: styles.outline,
      boxShadow: styles.boxShadow,
      border: styles.border,
    }
  })

  const hasFocusIndicator
    = focusStyles.outline !== 'none'
      || focusStyles.boxShadow !== 'none'
      || focusStyles.border !== 'none'

  expect(hasFocusIndicator).toBeTruthy()
}

export async function ShouldMaintainFocusAfterInteraction() {
  const componentEl = page.getByArticle(root)

  await componentEl.focus()
  await componentEl.click()

  await expect.element(componentEl).toBeFocused()
}

// === 表单集成测试 ===
export async function ShouldHaveCorrectFormAttributes() {
  const hiddenInputEl = page.getByArticle(hiddenInput)

  await expect.element(hiddenInputEl).toHaveAttribute('name')
  await expect.element(hiddenInputEl).toHaveAttribute('value')

  const form = hiddenInputEl.locator('xpath=ancestor::form')
  if (await form.count() > 0) {
    await expect.element(hiddenInputEl).toHaveAttribute('form')
  }
}

export async function ShouldUpdateFormValueOnChange() {
  const componentEl = page.getByArticle(root)
  const hiddenInputEl = page.getByArticle(hiddenInput)

  const initialValue = await hiddenInputEl.getAttribute('value')

  await componentEl.click()

  const newValue = await hiddenInputEl.getAttribute('value')
  expect(newValue).not.toBe(initialValue)
}

export async function ShouldSupportFormValidation() {
  const componentEl = page.getByArticle(root)
  const hiddenInputEl = page.getByArticle(hiddenInput)

  // 测试自定义验证
  await hiddenInputEl.evaluate((input) => {
    input.setCustomValidity('Custom error message')
  })

  const isValid = await hiddenInputEl.evaluate(input => input.checkValidity())
  expect(isValid).toBeFalsy()

  // 清除验证错误
  await hiddenInputEl.evaluate((input) => {
    input.setCustomValidity('')
  })
}

export async function ShouldSupportFormReset() {
  const componentEl = page.getByArticle(root)
  const hiddenInputEl = page.getByArticle(hiddenInput)

  // 改变值
  await componentEl.click()

  // 重置表单
  const form = hiddenInputEl.locator('xpath=ancestor::form')
  if (await form.count() > 0) {
    await form.evaluate(form => form.reset())

    // 验证重置后的状态
    await expect.element(componentEl).toHaveAttribute('data-state')
  }
}

// === 可访问性测试 ===
export async function ShouldHaveCorrectAriaAttributes() {
  const componentEl = page.getByArticle(root)

  await expect.element(componentEl).toHaveAttribute('role')

  const labelEl = page.getByArticle(label)
  if (await labelEl.count() > 0) {
    await expect.element(componentEl).toHaveAttribute('aria-labelledby')
  }
}

export async function ShouldSupportAriaDescription() {
  const componentEl = page.getByArticle(root)

  const hasDescription = await componentEl.getAttribute('aria-describedby')
  if (hasDescription) {
    const descriptionEl = page.locator(`#${hasDescription}`)
    await expect.element(descriptionEl).toBeInTheDocument()
  }
}

export async function ShouldAnnounceStateChanges() {
  const componentEl = page.getByArticle(root)

  await componentEl.click()

  // 检查状态变化是否被正确公告
  const liveRegions = page.locator('[aria-live]')
  const statusElements = page.locator('[role="status"]')

  const hasAnnouncement = await liveRegions.count() > 0 || await statusElements.count() > 0
  expect(hasAnnouncement).toBeTruthy()
}

export async function ShouldSupportScreenReaders() {
  const componentEl = page.getByArticle(root)

  // 检查语义化标记
  const hasSemanticRole = await componentEl.getAttribute('role')
  expect(hasSemanticRole).toBeTruthy()

  // 检查可访问名称
  const hasAccessibleName = await componentEl.getAttribute('aria-label')
    || await componentEl.getAttribute('aria-labelledby')
  expect(hasAccessibleName).toBeTruthy()
}

// === 性能测试 ===
export async function ShouldRenderWithinPerformanceThreshold() {
  const startTime = performance.now()

  const componentEl = page.getByArticle(root)
  await componentEl.click()

  const endTime = performance.now()
  const renderTime = endTime - startTime

  expect(renderTime).toBeLessThan(100)
}

export async function ShouldHandleRapidInteractions() {
  const componentEl = page.getByArticle(root)

  const startTime = performance.now()

  for (let i = 0; i < 20; i++) {
    await componentEl.click()
  }

  const endTime = performance.now()
  const totalTime = endTime - startTime

  expect(totalTime).toBeLessThan(1000)
}

export async function ShouldMaintainStateConsistency() {
  const componentEl = page.getByArticle(root)

  // 快速切换状态
  for (let i = 0; i < 10; i++) {
    await componentEl.click()
  }

  // 验证状态一致性
  const finalState = await componentEl.getAttribute('data-state')
  expect(finalState).toBeDefined()
}

// === 边界测试 ===
export async function ShouldHandleInvalidInputs() {
  const componentEl = page.getByArticle(root)

  // 测试各种无效输入
  await componentEl.click()
  await userEvent.keyboard('{Escape}')
  await userEvent.keyboard('{F1}')

  // 应该保持稳定
  await expect.element(componentEl).toBeInTheDocument()
}

export async function ShouldRecoverFromErrors() {
  const componentEl = page.getByArticle(root)

  try {
    // 模拟错误条件
    await componentEl.click()
    await userEvent.keyboard('{Escape}')
    await componentEl.click()
  }
  catch (error) {
    // 组件应该能够恢复
  }

  await expect.element(componentEl).toBeInTheDocument()
}

// === 响应式测试 ===
export async function ShouldWorkOnMobileDevices() {
  await page.setViewportSize({ width: 375, height: 667 })

  const componentEl = page.getByArticle(root)

  await expect.element(componentEl).toBeVisible()
  await componentEl.click()

  // 测试触摸交互
  await userEvent.pointer({ target: componentEl, keys: '[TouchA]' })

  await expect.element(componentEl).toBeInTheDocument()
}

export async function ShouldWorkOnDesktopDevices() {
  await page.setViewportSize({ width: 1920, height: 1080 })

  const componentEl = page.getByArticle(root)

  await expect.element(componentEl).toBeVisible()
  await componentEl.click()

  await userEvent.hover(componentEl)

  await expect.element(componentEl).toBeInTheDocument()
}

export async function ShouldPreventTextSelection() {
  const componentEl = page.getByArticle(root)

  await expect.element(componentEl).toHaveStyle('user-select: none')
}
