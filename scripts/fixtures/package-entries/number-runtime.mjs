import assert from 'node:assert/strict'

export function assertNumberRuntime({ machine }) {
  const plain = machine({ id: 'plain', defaultValue: '12suffix' }).contextSnapshot
  assert.ok(plain.formatter instanceof Intl.NumberFormat)
  assert.equal(plain.valueAsNumber, 12)
  assert.equal(plain.formattedValue, '12')
  const invalid = machine({ id: 'invalid', defaultValue: '' }).contextSnapshot
  assert.ok(Number.isNaN(invalid.valueAsNumber))
  assert.equal(invalid.formattedValue, '')
  const localized = machine({ id: 'localized', locale: 'de-DE', defaultValue: '1.234,5', formatOptions: {} }).contextSnapshot
  const native = new Intl.NumberFormat('de-DE')
  assert.ok(localized.formatter instanceof Intl.NumberFormat)
  assert.equal(localized.valueAsNumber, 1234.5)
  assert.equal(localized.formattedValue, native.format(1234.5))
  assert.deepEqual(localized.formatter.formatToParts(-1234.5), native.formatToParts(-1234.5))
  assert.equal(localized.formatter.formatRange(1, 2), native.formatRange(1, 2))
  assert.deepEqual(localized.formatter.formatRangeToParts(1, 2), native.formatRangeToParts(1, 2))
  assert.deepEqual(localized.formatter.resolvedOptions(), native.resolvedOptions())
  assert.equal(localized.parser.parse('1.234,5'), 1234.5)
  assert.equal(localized.parser.isValidPartialNumber('-'), true)
  assert.equal(localized.parser.isValidPartialNumber('-', 0), false)
  assert.equal(localized.parser.getNumberingSystem('123'), 'latn')
}
