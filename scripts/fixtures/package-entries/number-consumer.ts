import type { Service } from '@destyler/number-input'

type Formatter = Service['contextSnapshot']['formatter']
type Parser = Service['contextSnapshot']['parser']
declare const formatter: Formatter
declare const parser: Parser
const formatted: string = formatter.format(1)
const parts: Intl.NumberFormatPart[] = formatter.formatToParts(1)
const range: string = formatter.formatRange(1, 2)
const rangeParts: Array<Intl.NumberFormatPart & { source: 'startRange' | 'endRange' | 'shared' }> = formatter.formatRangeToParts(1, 2)
const options: Intl.ResolvedNumberFormatOptions = formatter.resolvedOptions()
const parsed: number = parser.parse('1')
const partial: boolean = parser.isValidPartialNumber('1', 0, 10)
const numbering: string = parser.getNumberingSystem('1')
void [formatted, parts, range, rangeParts, options, parsed, partial, numbering]

const customFormatter = {
  format: value => String(value),
  formatToParts: value => [{ type: 'integer', value: String(value) }],
  formatRange: (start, end) => `${start}-${end}`,
  formatRangeToParts: (start, end) => [
    { type: 'integer', value: String(start), source: 'startRange' },
    { type: 'integer', value: String(end), source: 'endRange' },
  ],
  resolvedOptions: () => new Intl.NumberFormat().resolvedOptions(),
} satisfies Formatter
const customParser = {
  parse: value => Number(value),
  isValidPartialNumber: (value, min = -Infinity, max = Infinity) => Number(value) >= min && Number(value) <= max,
  getNumberingSystem: () => 'latn',
} satisfies Parser
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Assert<T extends true> = T
interface RangePart extends Intl.NumberFormatPart {
  source: 'startRange' | 'endRange' | 'shared'
}
export type NumberInputSignatures = [
  Assert<Equal<Formatter['format'], (value: number) => string>>,
  Assert<Equal<Formatter['formatToParts'], (value: number) => Intl.NumberFormatPart[]>>,
  Assert<Equal<Formatter['formatRange'], (start: number, end: number) => string>>,
  Assert<Equal<Formatter['formatRangeToParts'], (start: number, end: number) => RangePart[]>>,
  Assert<Equal<Formatter['resolvedOptions'], () => Intl.ResolvedNumberFormatOptions>>,
  Assert<Equal<Parser['parse'], (value: string) => number>>,
  Assert<Equal<Parser['isValidPartialNumber'], (value: string, min?: number, max?: number) => boolean>>,
  Assert<Equal<Parser['getNumberingSystem'], (value: string) => string>>,
]
void [customFormatter, customParser]

// Method syntax historically accepted narrower custom implementations.
const narrowFormatter: Formatter = { ...customFormatter, format: (value: 1) => String(value) }
const narrowParser: Parser = { ...customParser, parse: (value: '1') => Number(value) }
void [narrowFormatter, narrowParser]
