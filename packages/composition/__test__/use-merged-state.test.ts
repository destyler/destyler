import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { useMergedState } from '../src'

describe('useMergedState', () => {
  it('basic', async () => {
    const uncontrolledRef = ref(1)
    const controlledRef = ref<number | undefined>(undefined)
    const mergedRef = useMergedState(controlledRef, uncontrolledRef)
    expect(mergedRef.value).toEqual(1)
    controlledRef.value = 2
    expect(mergedRef.value).toEqual(2)
    await nextTick()
    expect(uncontrolledRef.value).toEqual(2)
    controlledRef.value = undefined
    expect(mergedRef.value).toEqual(2)
    await nextTick()
    expect(uncontrolledRef.value).toEqual(2)
  })
})
