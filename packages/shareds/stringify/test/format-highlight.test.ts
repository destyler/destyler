import { expect, it } from 'vitest'
import formatHighlight from '../src/format-highlight'

it('it works', () => {
  const out = formatHighlight({ a: '11' })
  expect(out).toBe('{\n  <span style="color:dimgray">"a":</span> <span style="word-wrap:break-word;white-space:pre-wrap;color:lightcoral">"11"</span>\n}')
})

it('it works with html tags in field values', () => {
  const out = formatHighlight({ a: 'this is <p>a paragraph</p>' })
  expect(out).toBe('{\n  <span style="color:dimgray">"a":</span> <span style="word-wrap:break-word;white-space:pre-wrap;color:lightcoral">"this is &lt;p&gt;a paragraph&lt;/p&gt;"</span>\n}')
})

it('it works with one double quote in field values', () => {
  const out = formatHighlight({ a: 'this is a "' })
  expect(out).toBe('{\n  <span style="color:dimgray">"a":</span> <span style="word-wrap:break-word;white-space:pre-wrap;color:lightcoral">"this is a \\&quot;"</span>\n}')
})

it('it works with two double quotes in field values', () => {
  const out = formatHighlight({ a: 'this is a "quote"' })
  expect(out).toBe('{\n  <span style="color:dimgray">"a":</span> <span style="word-wrap:break-word;white-space:pre-wrap;color:lightcoral">"this is a \\&quot;quote\\&quot;"</span>\n}')
})

it('it works with html tags and quotes in field values', () => {
  const out = formatHighlight({ a: 'this is <p>a "p"</p>' })
  expect(out).toBe('{\n  <span style="color:dimgray">"a":</span> <span style="word-wrap:break-word;white-space:pre-wrap;color:lightcoral">"this is &lt;p&gt;a \\&quot;p\\&quot;&lt;/p&gt;"</span>\n}')
})

it('it works with html tags and quotes and newlines in field values', () => {
  const out = formatHighlight({ a: 'this is <p>a "p"</p>\n\t\r' })
  expect(out).toBe('{\n  <span style="color:dimgray">"a":</span> <span style="word-wrap:break-word;white-space:pre-wrap;color:lightcoral">"this is &lt;p&gt;a \\&quot;p\\&quot;&lt;/p&gt;\\n\\t\\r"</span>\n}')
})

it('it works with value undefined', () => {
  const out = formatHighlight(undefined)
  expect(out).toBe('undefined')
})

it('it works with value null', () => {
  const out = formatHighlight(null)
  expect(out).toBe('<span style="color:cornflowerblue">null</span>')
})

it('it works with value false', () => {
  const out = formatHighlight(false)
  expect(out).toBe('<span style="color:#f66578">false</span>')
})

it('it works with value true', () => {
  const out = formatHighlight(true)
  expect(out).toBe('<span style="color:lightseagreen">true</span>')
})

it('it works with number value', () => {
  const out = formatHighlight(12345.678)
  expect(out).toBe('<span style="color:lightskyblue">12345.678</span>')
})

it('it works with empty string', () => {
  const out = formatHighlight('')
  expect(out).toBe('')
})

it('it works with not-empty string', () => {
  const out = formatHighlight('not empty')
  expect(out).toBe('not empty')
})

it('it works with function', () => {
  const out = formatHighlight(() => {})
  expect(out).toBe('function')
})

it('it works with Map', () => {
  const out = formatHighlight(new Map([[1, 'a']]))
  expect(out).toBe(
    `[
  [
    <span style="color:lightskyblue">1</span>,
    <span style="word-wrap:break-word;white-space:pre-wrap;color:lightcoral">"a"</span>
  ]
]`,
  )
})

it('it works with Symbol', () => {
  const out = formatHighlight(Symbol('Symbol label'))
  expect(out).toBe('symbol')
})
