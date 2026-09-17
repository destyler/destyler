import { describe, expect, it } from 'vitest'
import {
  hasControllableProp,
  isControlledByFlag,
  resolveControllableOpen,
  resolveControllableProp,
} from '../src/controllable'

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

  it('treats controlledFlag as Phase 1 ownership signal', () => {
    expect(resolveControllableProp({
      value: false,
      controlledFlag: true,
      fallback: false,
    })).toEqual({ initial: false, isControlled: true })

    expect(resolveControllableProp({
      value: true,
      controlledFlag: false,
      fallback: false,
    })).toEqual({ initial: true, isControlled: false })
  })

  it('does not treat value presence alone as controlled (Phase 1)', () => {
    expect(resolveControllableProp({
      value: true,
      fallback: false,
    }).isControlled).toBe(false)
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
  it('detects own-key presence (Phase 2 candidate)', () => {
    expect(hasControllableProp({ open: false }, 'open')).toBe(true)
    expect(hasControllableProp({}, 'open')).toBe(false)
  })
})

describe('resolveControllableOpen()', () => {
  it('resolves defaultOpen ?? open ?? false', () => {
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

  it('honors open.controlled for Phase 1', () => {
    expect(resolveControllableOpen({
      'open': false,
      'open.controlled': true,
    })).toEqual({
      initialOpen: false,
      isOpenControlled: true,
    })
  })

  it('prefers defaultOpen over legacy open seed', () => {
    expect(resolveControllableOpen({
      defaultOpen: true,
      open: false,
    }).initialOpen).toBe(true)
  })
})
