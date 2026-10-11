// @vitest-environment happy-dom
import { expect, it } from 'vitest'
import { createConsumer } from './fixtures/nullable-consumer.mts'

it('executes the built public package with both branches of a strict nullable consumer', () => {
  const consumer = createConsumer()
  consumer.service.start()
  try {
    consumer.api().setValue('a')
    expect(consumer.api().value).toBe('a')
    consumer.api().clearValue()
    expect(consumer.api().value).toBe(null)
    consumer.api().clearValue()
    expect(consumer.branches).toEqual(['A', 'cleared'])
  }
  finally {
    consumer.service.stop()
  }
})
