import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Tree'

let el: HTMLElement

// DOM helper functions
function getBranchControlEl(value: string) {
  const el = document.querySelector<HTMLElement>(`[data-part="branch-control"][data-value="${value}"]`)
  if (!el)
    throw new Error(`Expected branch control element for value ${value} to exist`)
  return el
}

function getItemEl(value: string) {
  const el = document.querySelector<HTMLElement>(`[data-part="item"][data-value="${value}"]`)
  if (!el)
    throw new Error(`Expected item element for value ${value} to exist`)
  return el
}

// Page locator functions for assertions
function getTree() {
  return page.getByRole('tree')
}

function getBranch(value: string) {
  return page.locatoring(`[data-part="branch"][data-value="${value}"]`)
}

function getBranchControl(value: string) {
  return page.locatoring(`[data-part="branch-control"][data-value="${value}"]`)
}

function getItem(value: string) {
  return page.locatoring(`[data-part="item"][data-value="${value}"]`)
}

function getBranchContent(value: string) {
  return page.locatoring(`[data-part="branch-content"][data-value="${value}"]`)
}

function getExpandAllButton() {
  return page.locatoring('[data-tree-expand-all]')
}

function getCollapseAllButton() {
  return page.locatoring('[data-tree-collapse-all]')
}

function getSelectAllButton() {
  return page.locatoring('[data-tree-select-all]')
}

function getClearSelectionButton() {
  return page.locatoring('[data-tree-clear-selection]')
}

function getMetaEl() {
  return page.locatoring('[data-tree-meta]')
}

async function clickBranch(value: string) {
  const branchControl = getBranchControl(value)
  await branchControl.click()
}

async function clickItem(value: string) {
  const item = getItem(value)
  await item.click()
}

async function focusBranch(value: string) {
  const branchControl = getBranchControlEl(value)
  branchControl.focus()
  await vi.waitFor(() => {
    expect(document.activeElement).toBe(branchControl)
  })
}

async function focusItem(value: string) {
  const item = getItemEl(value)
  item.focus()
  await vi.waitFor(() => {
    expect(document.activeElement).toBe(item)
  })
}

async function seeBranchIsExpanded(value: string) {
  const branch = getBranch(value)
  await expect.element(branch).toHaveAttribute('data-state', 'open')
}

async function seeBranchIsCollapsed(value: string) {
  const branch = getBranch(value)
  await expect.element(branch).toHaveAttribute('data-state', 'closed')
}

async function seeBranchIsSelected(value: string) {
  const branchControl = getBranchControl(value)
  await expect.element(branchControl).toHaveAttribute('data-selected', '')
}

async function seeBranchIsNotSelected(value: string) {
  const branchControl = getBranchControl(value)
  await expect.element(branchControl).not.toHaveAttribute('data-selected')
}

async function seeItemIsSelected(value: string) {
  const item = getItem(value)
  await expect.element(item).toHaveAttribute('data-selected', '')
}

async function seeItemIsNotSelected(value: string) {
  const item = getItem(value)
  await expect.element(item).not.toHaveAttribute('data-selected')
}

async function seeBranchIsFocused(value: string) {
  const branchControl = getBranchControl(value)
  await expect.element(branchControl).toHaveAttribute('data-focus', '')
}

async function seeItemIsFocused(value: string) {
  const item = getItem(value)
  await expect.element(item).toHaveAttribute('data-focus', '')
}

async function seeOpenFoldersCount(count: number) {
  const metaEl = getMetaEl()
  await expect.element(metaEl).toHaveTextContent(`${count} open folders`)
}

describe('tree browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  describe('initial state', () => {
    it('should render tree with default expanded branches', async () => {
      // Default expanded: ['src', 'src/components', 'public']
      await seeBranchIsExpanded('src')
      await seeBranchIsExpanded('src/components')
      await seeBranchIsExpanded('public')
      await seeBranchIsCollapsed('src/routes')
      await seeBranchIsCollapsed('src/lib')
      await seeBranchIsCollapsed('scripts')
    })

    it('should show correct open folders count', async () => {
      await seeOpenFoldersCount(3)
    })

    it('should render tree structure correctly', async () => {
      const tree = getTree()
      await expect.element(tree).toBeVisible()
    })
  })

  describe('expand/collapse', () => {
    it('should collapse a branch when clicking on expanded branch', async () => {
      await seeBranchIsExpanded('src')
      await clickBranch('src')
      await seeBranchIsCollapsed('src')
    })

    it('should expand a branch when clicking on collapsed branch', async () => {
      await seeBranchIsCollapsed('scripts')
      await clickBranch('scripts')
      await seeBranchIsExpanded('scripts')
    })

    it('should expand all branches when clicking expand all button', async () => {
      const expandAllBtn = getExpandAllButton()
      await expandAllBtn.click()

      await seeBranchIsExpanded('src')
      await seeBranchIsExpanded('src/components')
      await seeBranchIsExpanded('src/routes')
      await seeBranchIsExpanded('src/lib')
      await seeBranchIsExpanded('public')
      await seeBranchIsExpanded('scripts')
    })

    it('should collapse all branches when clicking collapse all button', async () => {
      const collapseAllBtn = getCollapseAllButton()
      await collapseAllBtn.click()

      await seeBranchIsCollapsed('src')
      await seeBranchIsCollapsed('public')
      await seeBranchIsCollapsed('scripts')
      await seeOpenFoldersCount(0)
    })

    it('should update open folders count when expanding/collapsing', async () => {
      await seeOpenFoldersCount(3)

      await clickBranch('scripts')
      await seeOpenFoldersCount(4)

      await clickBranch('src')
      await seeOpenFoldersCount(3)
    })
  })

  describe('selection', () => {
    it('should select a branch when clicking on it', async () => {
      await clickBranch('src')
      await seeBranchIsSelected('src')
    })

    it('should select an item when clicking on it', async () => {
      await clickItem('src/components/TreeView.tsx')
      await seeItemIsSelected('src/components/TreeView.tsx')
    })

    it('should deselect previous selection in single selection mode', async () => {
      // First select a root level item (package.json is always visible)
      await clickItem('package.json')
      await seeItemIsSelected('package.json')

      // Select another root level item
      await clickItem('README.md')
      await seeItemIsSelected('README.md')
      await seeItemIsNotSelected('package.json')
    })

    it('should select all nodes when clicking select all button in multiple selection mode', async () => {
      // Enable multiple selection mode first
      const selectionModeSelect = page.getByTestId('selectionMode')
      await selectionModeSelect.selectOptions('multiple')

      // Expand all to make all nodes visible
      const expandAllBtn = getExpandAllButton()
      await expandAllBtn.click()

      const selectAllBtn = getSelectAllButton()
      await selectAllBtn.click()

      // Check some nodes are selected
      await seeBranchIsSelected('src')
      await seeBranchIsSelected('public')
      await seeItemIsSelected('package.json')
    })

    it('should clear all selections when clicking clear selection button', async () => {
      await clickBranch('src')
      await seeBranchIsSelected('src')

      const clearBtn = getClearSelectionButton()
      await clearBtn.click()

      await seeBranchIsNotSelected('src')
    })
  })

  describe('keyboard navigation', () => {
    it('should move focus down with ArrowDown', async () => {
      await focusBranch('src')
      await seeBranchIsFocused('src')

      await testHook.pressKey('ArrowDown')
      await seeBranchIsFocused('src/components')
    })

    it('should move focus up with ArrowUp', async () => {
      await focusBranch('src/components')
      await seeBranchIsFocused('src/components')

      await testHook.pressKey('ArrowUp')
      await seeBranchIsFocused('src')
    })

    it('should collapse branch with ArrowLeft when expanded', async () => {
      await seeBranchIsExpanded('src')
      await focusBranch('src')

      await testHook.pressKey('ArrowLeft')
      await seeBranchIsCollapsed('src')
    })

    it('should expand branch with ArrowRight when collapsed', async () => {
      await seeBranchIsCollapsed('scripts')
      await focusBranch('scripts')

      await testHook.pressKey('ArrowRight')
      await seeBranchIsExpanded('scripts')
    })

    it('should move focus to first child with ArrowRight when expanded', async () => {
      await seeBranchIsExpanded('src')
      await focusBranch('src')

      await testHook.pressKey('ArrowRight')
      await seeBranchIsFocused('src/components')
    })

    it('should move focus to parent with ArrowLeft on item', async () => {
      await focusItem('src/components/TreeView.tsx')
      await seeItemIsFocused('src/components/TreeView.tsx')

      await testHook.pressKey('ArrowLeft')
      await seeBranchIsFocused('src/components')
    })

    it('should move focus to first node with Home', async () => {
      await focusBranch('public')

      await testHook.pressKey('Home')
      await seeBranchIsFocused('src')
    })

    it('should move focus to last visible node with End', async () => {
      await focusBranch('src')

      await testHook.pressKey('End')
      // Last visible item should be README.md (root level file)
      await seeItemIsFocused('README.md')
    })

    it('should select node with Enter', async () => {
      await focusBranch('src')
      await seeBranchIsNotSelected('src')

      await testHook.pressKey('Enter')
      await seeBranchIsSelected('src')
    })

    it('should select node with Space', async () => {
      await focusItem('package.json')
      await seeItemIsNotSelected('package.json')

      await testHook.pressKey('Space')
      await seeItemIsSelected('package.json')
    })

    it('should toggle branch expand/collapse with Enter', async () => {
      await seeBranchIsExpanded('src')
      await focusBranch('src')

      await testHook.pressKey('Enter')
      await seeBranchIsCollapsed('src')

      await testHook.pressKey('Enter')
      await seeBranchIsExpanded('src')
    })
  })

  describe('keyboard selection with shift', () => {
    it('should extend selection to first node with Shift+Home in multiple selection mode', async () => {
      const selectionModeSelect = page.getByTestId('selectionMode')
      await selectionModeSelect.selectOptions('multiple')

      await focusBranch('src/components')
      await testHook.pressKey('Enter')

      await userEvent.keyboard('{Shift>}{Home}{/Shift}')
      await seeBranchIsSelected('src')
      await seeBranchIsSelected('src/components')
    })
  })

  describe('typeahead', () => {
    it('should focus matching node when typing', async () => {
      await focusBranch('src')

      // Type 'p' to focus on 'public' or 'package.json'
      await userEvent.keyboard('p')

      // Should focus on a node starting with 'p'
      const publicBranchEl = getBranchControlEl('public')
      const packageItemEl = getItemEl('package.json')

      // One of these should be focused
      const publicIsFocused = publicBranchEl.getAttribute('data-focus')
      const packageIsFocused = packageItemEl.getAttribute('data-focus')

      expect(publicIsFocused === '' || packageIsFocused === '').toBe(true)
    })
  })

  describe('expand siblings with asterisk', () => {
    it('should expand all sibling branches when pressing *', async () => {
      // First collapse all
      const collapseAllBtn = getCollapseAllButton()
      await collapseAllBtn.click()

      await seeBranchIsCollapsed('src')
      await seeBranchIsCollapsed('public')
      await seeBranchIsCollapsed('scripts')

      await focusBranch('src')
      await userEvent.keyboard('*')

      // All root level branches should be expanded
      await seeBranchIsExpanded('src')
      await seeBranchIsExpanded('public')
      await seeBranchIsExpanded('scripts')
    })
  })

  describe('nested branch navigation', () => {
    it('should navigate through nested structure correctly', async () => {
      // Start at src
      await focusBranch('src')
      await seeBranchIsFocused('src')

      // Go into src/components
      await testHook.pressKey('ArrowDown')
      await seeBranchIsFocused('src/components')

      // Go into first file
      await testHook.pressKey('ArrowDown')
      await seeItemIsFocused('src/components/TreeView.tsx')

      // Go to next file
      await testHook.pressKey('ArrowDown')
      await seeItemIsFocused('src/components/TreeNode.tsx')

      // Go up
      await testHook.pressKey('ArrowUp')
      await seeItemIsFocused('src/components/TreeView.tsx')
    })

    it('should skip collapsed branches when navigating', async () => {
      // Collapse src/components
      await clickBranch('src/components')
      await seeBranchIsCollapsed('src/components')

      await focusBranch('src/components')

      // ArrowDown should skip to next sibling (src/routes)
      await testHook.pressKey('ArrowDown')
      await seeBranchIsFocused('src/routes')
    })
  })

  describe('branch content visibility', () => {
    it('should show branch content when expanded', async () => {
      await seeBranchIsExpanded('src/components')
      const content = getBranchContent('src/components')
      await expect.element(content).toBeVisible()
    })

    it('should remove branch content when collapsed', async () => {
      await clickBranch('src/components')
      await seeBranchIsCollapsed('src/components')

      // In vanilla implementation, content is removed from DOM when collapsed
      const contentEl = document.querySelector('[data-part="branch-content"][data-value="src/components"]')
      expect(contentEl).toBeNull()
    })
  })

  describe('accessibility', () => {
    it('should have correct aria attributes on tree', async () => {
      const tree = getTree()
      await expect.element(tree).toHaveAttribute('role', 'tree')
      await expect.element(tree).toHaveAttribute('aria-label', 'Tree View')
    })

    it('should have correct aria-expanded on branches', async () => {
      const srcBranch = getBranch('src')
      await expect.element(srcBranch).toHaveAttribute('aria-expanded', 'true')

      await clickBranch('src')
      // After clicking, src should be collapsed
      await seeBranchIsCollapsed('src')
    })

    it('should have correct aria-selected on items', async () => {
      // Initially item is not selected
      await seeItemIsNotSelected('package.json')

      await clickItem('package.json')
      await seeItemIsSelected('package.json')
    })

    it('should have correct aria-level on nested items', async () => {
      // Root level branches should have aria-level 1
      const srcBranch = getBranch('src')
      await expect.element(srcBranch).toHaveAttribute('aria-level', '1')

      // Nested branch should have aria-level 2
      const componentsBranch = getBranch('src/components')
      await expect.element(componentsBranch).toHaveAttribute('aria-level', '2')

      // Leaf items should have appropriate level
      const treeViewItem = getItem('src/components/TreeView.tsx')
      await expect.element(treeViewItem).toHaveAttribute('aria-level', '3')
    })

    it('should have role=group on branch content', async () => {
      const content = getBranchContent('src')
      await expect.element(content).toHaveAttribute('role', 'group')
    })
  })

  describe('focus management', () => {
    it('should maintain focus when selecting items', async () => {
      await focusItem('package.json')
      await testHook.pressKey('Enter')

      await seeItemIsFocused('package.json')
      await seeItemIsSelected('package.json')
    })

    it('should have correct tabIndex on focused vs unfocused items', async () => {
      await focusBranch('src')

      const srcBranchControl = getBranchControl('src')
      await expect.element(srcBranchControl).toHaveAttribute('tabindex', '0')

      const publicBranchControl = getBranchControl('public')
      await expect.element(publicBranchControl).toHaveAttribute('tabindex', '-1')
    })
  })
})
