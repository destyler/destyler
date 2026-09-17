import { describe, expect, it } from 'vitest'
import {
  collectUserProvidedProps,
  CONTROLLABLE_PROVIDED_KEY,
  getControllableProvided,
  hasControllableProp,
  isControlled,
  isControlledByFlag,
  isPropUserProvided,
  resolveControllableOpen,
  resolveControllableProp,
  resolveIsControlled,
  withControllableProvided,
} from '../src/controllable'
import { compact } from '../src/object'

describe('resolveIsControlled()', () => {
  it('flag true wins', () => {
    expect(resolveIsControlled(true, false)).toBe(true)
    expect(resolveIsControlled(true, undefined)).toBe(true)
  })

  it('flag false wins over presence', () => {
    expect(resolveIsControlled(false, true)).toBe(false)
  })

  it('flag absent uses valueProvided', () => {
    expect(resolveIsControlled(undefined, true)).toBe(true)
    expect(resolveIsControlled(undefined, false)).toBe(false)
    expect(resolveIsControlled(undefined, undefined)).toBe(false)
  })
})

describe('resolveControllableProp()', () => {
  it('prefers defaultValue over value for initial', () => {
    expect(resolveControllableProp({
      value: false,
      defaultValue: true,
      fallback: false,
    })).toEqual({ initial: true, isControlled: false })
  })

  it('falls back to value when defaultValue is absent', () => {
    expect(resolveControllableProp({
      value: true,
      fallback: false,
    })).toEqual({ initial: true, isControlled: false })
  })

  it('uses fallback when neither defaultValue nor value is set', () => {
    expect(resolveControllableProp({
      fallback: false,
    })).toEqual({ initial: false, isControlled: false })
  })

  it('treats controlledFlag true/false as ownership override', () => {
    expect(resolveControllableProp({
      value: false,
      controlledFlag: true,
      fallback: false,
    })).toEqual({ initial: false, isControlled: true })

    expect(resolveControllableProp({
      value: true,
      controlledFlag: false,
      valueProvided: true,
      fallback: false,
    })).toEqual({ initial: true, isControlled: false })
  })

  it('phase 2: valueProvided alone makes controlled when flag absent', () => {
    expect(resolveControllableProp({
      value: false,
      valueProvided: true,
      fallback: false,
    })).toEqual({ initial: false, isControlled: true })
  })

  it('defaultValue only (no valueProvided) stays uncontrolled', () => {
    expect(resolveControllableProp({
      defaultValue: true,
      valueProvided: false,
      fallback: false,
    })).toEqual({ initial: true, isControlled: false })
  })
})

describe('isControlledByFlag()', () => {
  it('reads prop.controlled from context', () => {
    expect(isControlledByFlag({ 'open.controlled': true }, 'open')).toBe(true)
    expect(isControlledByFlag({ 'open.controlled': false }, 'open')).toBe(false)
    expect(isControlledByFlag({}, 'open')).toBe(false)
  })
})

describe('hasControllableProp()', () => {
  it('detects own-key presence including undefined', () => {
    expect(hasControllableProp({ open: false }, 'open')).toBe(true)
    expect(hasControllableProp({ open: undefined }, 'open')).toBe(true)
    expect(hasControllableProp({}, 'open')).toBe(false)
  })
})

describe('collectUserProvidedProps / withControllableProvided', () => {
  it('collects own keys including undefined values', () => {
    expect(collectUserProvidedProps({ open: undefined, checked: true }, ['open', 'checked', 'value']))
      .toEqual(['open', 'checked'])
  })

  it('stamps side channel that survives compact', () => {
    const stamped = withControllableProvided(
      { open: undefined, id: 'x' } as Record<string, unknown>,
      ['open', 'checked'],
    )
    expect(stamped[CONTROLLABLE_PROVIDED_KEY]).toEqual(['open'])

    const compacted = compact(stamped) as Record<string, unknown>
    expect(hasControllableProp(compacted, 'open')).toBe(false)
    expect(getControllableProvided(compacted)).toEqual(['open'])
    expect(isPropUserProvided(compacted, 'open')).toBe(true)
    expect(isControlled(compacted, 'open')).toBe(true)
  })

  it('merges with existing stamped list', () => {
    const stamped = withControllableProvided(
      { checked: true, [CONTROLLABLE_PROVIDED_KEY]: ['open'] } as Record<string, unknown>,
      ['checked'],
    )
    expect([...stamped[CONTROLLABLE_PROVIDED_KEY]].sort()).toEqual(['checked', 'open'])
  })
})

describe('isControlled() dual-track', () => {
  it('flag true / false / absent + presence matrix', () => {
    expect(isControlled({ 'open.controlled': true }, 'open')).toBe(true)
    expect(isControlled({
      'open.controlled': false,
      [CONTROLLABLE_PROVIDED_KEY]: ['open'],
    }, 'open')).toBe(false)
    expect(isControlled({
      [CONTROLLABLE_PROVIDED_KEY]: ['open'],
    }, 'open')).toBe(true)
    expect(isControlled({}, 'open')).toBe(false)
    expect(isControlled({
      [CONTROLLABLE_PROVIDED_KEY]: ['checked'],
    }, 'open')).toBe(false)
  })
})

describe('resolveControllableOpen()', () => {
  it('resolves defaultOpen ?? open ?? false without stamp → uncontrolled', () => {
    expect(resolveControllableOpen({ defaultOpen: true })).toEqual({
      initialOpen: true,
      isOpenControlled: false,
    })
    expect(resolveControllableOpen({ open: true })).toEqual({
      initialOpen: true,
      isOpenControlled: false,
    })
    expect(resolveControllableOpen({})).toEqual({
      initialOpen: false,
      isOpenControlled: false,
    })
  })

  it('honors open.controlled dual-track', () => {
    expect(resolveControllableOpen({
      'open': false,
      'open.controlled': true,
    })).toEqual({
      initialOpen: false,
      isOpenControlled: true,
    })
    expect(resolveControllableOpen({
      'open': true,
      'open.controlled': false,
      [CONTROLLABLE_PROVIDED_KEY]: ['open'],
    })).toEqual({
      initialOpen: true,
      isOpenControlled: false,
    })
  })

  it('phase 2: stamped presence without flag is controlled', () => {
    expect(resolveControllableOpen({
      open: false,
      [CONTROLLABLE_PROVIDED_KEY]: ['open'],
    })).toEqual({
      initialOpen: false,
      isOpenControlled: true,
    })
  })

  it('prefers defaultOpen over legacy open seed for initial', () => {
    expect(resolveControllableOpen({
      defaultOpen: true,
      open: false,
    }).initialOpen).toBe(true)
  })

  it('defaultOpen only stays uncontrolled', () => {
    expect(resolveControllableOpen({ defaultOpen: true }).isOpenControlled).toBe(false)
  })
})
