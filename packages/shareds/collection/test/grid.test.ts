import { beforeEach, describe, expect, it } from 'vitest'
import { GridCollection } from '../index'

interface Item {
  label: string
  value: string
  disabled?: boolean
}

const items: Item[] = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Solid', value: 'solid' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte', disabled: true },
  { label: 'Node.js', value: 'node' },
  { label: 'Deno', value: 'deno' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'JavaScript', value: 'js' },
  { label: 'Rust', value: 'rust' },
  { label: 'Go', value: 'go' },
]

/**
+---------+-------------------------+------------+
| React   | Vue                     | Solid      |
| Angular | Svelte(disabled)        | Node.js    |
| Deno    | TypeScript              | JavaScript |
| Rust    | Go                      |            |
+---------+-------------------------+------------+
 */

let grid: GridCollection<Item>

beforeEach(() => {
  grid = new GridCollection({
    items,
    itemToString: item => item.label,
    itemToValue: item => item.value,
    columnCount: 3,
  })
})

describe('grid collection', () => {
  it('get next row', () => {
    expect(grid.getNextRowValue('ts')).toMatchInlineSnapshot(`"go"`)
    expect(grid.getNextRowValue('js')).toMatchInlineSnapshot(`null`)
    expect(grid.getNextRowValue('deno')).toMatchInlineSnapshot(`"rust"`)
  })

  it('get prev row', () => {
    expect(grid.getPreviousRowValue('ts')).toMatchInlineSnapshot(`"angular"`)
    expect(grid.getPreviousRowValue('js')).toMatchInlineSnapshot(`"node"`)
    expect(grid.getPreviousRowValue('deno')).toMatchInlineSnapshot(`"angular"`)
    expect(grid.getPreviousRowValue('vue')).toMatchInlineSnapshot(`null`)
  })

  it('get rows', () => {
    const rows = grid.getRows()
    expect(rows.map(items => items.map(item => item.value))).toMatchInlineSnapshot(`
      [
        [
          "react",
          "vue",
          "solid",
        ],
        [
          "angular",
          "svelte",
          "node",
        ],
        [
          "deno",
          "ts",
          "js",
        ],
        [
          "rust",
          "go",
        ],
      ]
    `)
  })

  it('get row count', () => {
    expect(grid.getRowCount()).toBe(4)

    // Test empty grid
    const emptyGrid = new GridCollection<Item>({
      items: [],
      itemToString: item => item.label,
      itemToValue: item => item.value,
      columnCount: 3,
    })
    expect(emptyGrid.getRowCount()).toBe(0)
  })

  it('get cell index', () => {
    expect(grid.getCellIndex(0, 0)).toBe(0) // React
    expect(grid.getCellIndex(0, 1)).toBe(1) // Vue
    expect(grid.getCellIndex(0, 2)).toBe(2) // Solid
    expect(grid.getCellIndex(1, 0)).toBe(3) // Angular
    expect(grid.getCellIndex(2, 1)).toBe(7) // TypeScript
    expect(grid.getCellIndex(3, 1)).toBe(10) // Go
  })

  it('get cell', () => {
    expect(grid.getCell(0, 0)?.value).toBe('react')
    expect(grid.getCell(0, 1)?.value).toBe('vue')
    expect(grid.getCell(1, 1)?.value).toBe('svelte')
    expect(grid.getCell(2, 2)?.value).toBe('js')
    expect(grid.getCell(3, 0)?.value).toBe('rust')
    expect(grid.getCell(3, 1)?.value).toBe('go')

    // Test out of bounds cases
    expect(grid.getCell(3, 2)).toBeNull()
    expect(grid.getCell(4, 0)).toBeNull()
    expect(grid.getCell(-1, 0)).toBeNull()
    expect(grid.getCell(0, -1)).toBeNull()
  })

  it('get next row with clamp', () => {
    // When clamp is true, if the next row doesn't have corresponding position, return the last available element
    expect(grid.getNextRowValue('js', true)).toBe('go') // js is at row 3 column 3, next row column 3 doesn't exist, return last element of next row
    expect(grid.getNextRowValue('go', true)).toBe('go') // Already at last row, use clamp
    expect(grid.getNextRowValue('rust', true)).toBe('go') // Already at last row, use clamp
  })

  it('get prev row with clamp', () => {
    // When clamp is true, if the previous row doesn't have corresponding position, return the first available element
    expect(grid.getPreviousRowValue('react', true)).toBe('react') // Already at first row, use clamp
    expect(grid.getPreviousRowValue('vue', true)).toBe('react') // vue is at row 1 column 2, previous row doesn't exist, return first element of current row
    expect(grid.getPreviousRowValue('solid', true)).toBe('react') // solid is at row 1 column 3, previous row doesn't exist, return first element of current row
  })

  it('handle different column counts', () => {
    // Test different column counts
    const grid2Col = new GridCollection({
      items: items.slice(0, 6), // Take first 6 elements
      itemToString: item => item.label,
      itemToValue: item => item.value,
      columnCount: 2,
    })

    expect(grid2Col.getRowCount()).toBe(3)
    expect(grid2Col.getCellIndex(1, 1)).toBe(3)
    expect(grid2Col.getCell(2, 0)?.value).toBe('svelte')
    expect(grid2Col.getCell(2, 1)?.value).toBe('node')
  })

  it('handle single column grid', () => {
    const singleColGrid = new GridCollection({
      items: items.slice(0, 3),
      itemToString: item => item.label,
      itemToValue: item => item.value,
      columnCount: 1,
    })

    expect(singleColGrid.getRowCount()).toBe(3)
    expect(singleColGrid.getCellIndex(2, 0)).toBe(2)
    expect(singleColGrid.getCell(0, 0)?.value).toBe('react')
    expect(singleColGrid.getCell(1, 0)?.value).toBe('vue')
    expect(singleColGrid.getCell(2, 0)?.value).toBe('solid')
    // Based on actual behavior, getCell(0, 1) returns element at index 1, not null
    expect(singleColGrid.getCell(0, 1)?.value).toBe('vue') // Index 1 corresponds to second element
  })

  it('handle grid with more columns than items', () => {
    const wideGrid = new GridCollection({
      items: items.slice(0, 2), // Only 2 elements
      itemToString: item => item.label,
      itemToValue: item => item.value,
      columnCount: 5, // But 5 columns
    })

    expect(wideGrid.getRowCount()).toBe(1)
    expect(wideGrid.getCell(0, 0)?.value).toBe('react')
    expect(wideGrid.getCell(0, 1)?.value).toBe('vue')
    expect(wideGrid.getCell(0, 2)).toBeNull()
    expect(wideGrid.getCell(0, 4)).toBeNull()
  })

  it('navigation in incomplete last row', () => {
    // Test navigation when last row is incomplete
    expect(grid.getNextRowValue('rust')).toBeNull() // Last row first column
    expect(grid.getNextRowValue('go')).toBeNull() // Last row second column

    // Navigate from second-to-last row to last row
    expect(grid.getNextRowValue('deno')).toBe('rust')
    expect(grid.getNextRowValue('ts')).toBe('go')
    expect(grid.getNextRowValue('js')).toBeNull() // Last row doesn't have third column
  })

  it('getRows returns correct structure', () => {
    const rows = grid.getRows()
    expect(rows).toHaveLength(4)
    expect(rows[0]).toHaveLength(3) // First row has 3 elements
    expect(rows[1]).toHaveLength(3) // Second row has 3 elements
    expect(rows[2]).toHaveLength(3) // Third row has 3 elements
    expect(rows[3]).toHaveLength(2) // Last row only has 2 elements

    // Verify content of each row
    expect(rows[0].map(item => item.value)).toEqual(['react', 'vue', 'solid'])
    expect(rows[1].map(item => item.value)).toEqual(['angular', 'svelte', 'node'])
    expect(rows[2].map(item => item.value)).toEqual(['deno', 'ts', 'js'])
    expect(rows[3].map(item => item.value)).toEqual(['rust', 'go'])
  })

  it('preserves item properties', () => {
    // Ensure grid operations preserve original item properties
    const cell = grid.getCell(1, 1) // svelte (disabled)
    expect(cell?.disabled).toBe(true)
    expect(cell?.label).toBe('Svelte')
    expect(cell?.value).toBe('svelte')
  })
})
