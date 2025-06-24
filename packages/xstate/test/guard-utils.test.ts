import { describe, expect, it, vi } from "vitest"
import { guards } from "../index"

const { or, not, and, stateIn } = guards

const context = {
  values: [],
  focusable: true,
  disabled: true,
}

const event = {
  type: "testing",
}

type Context = typeof context

const guardMap = {
  isEmpty: (ctx: Context) => ctx.values.length === 0,
  isDisabled: (ctx: Context) => !ctx.focusable && ctx.disabled,
}

const meta = { state: { matches: () => true } }

describe("guard helpers - strings", () => {
  it("or", () => {
    const getResult = or("isEmpty", "isDisabled").predicate(guardMap)
    expect(getResult(context, event, meta)).toBeTruthy()
  })

  it("not", () => {
    const getResult = not("isEmpty").predicate(guardMap)
    expect(getResult(context, event, meta)).toBeFalsy()
  })

  it("and", () => {
    const getResult = and("isEmpty", "isDisabled").predicate(guardMap)
    expect(getResult(context, event, meta)).toBeFalsy()
  })

  it("combinations", () => {
    const getResult = and("isEmpty", not("isDisabled")).predicate(guardMap)
    expect(getResult(context, event, meta)).toBeTruthy()

    const getResult2 = not(and("isEmpty", "isDisabled")).predicate(guardMap)
    expect(getResult2(context, event, meta)).toBeTruthy()
  })
})

describe("guard helpers - inline functions", () => {
  it("or", () => {
    const getResult = or(guardMap.isEmpty, guardMap.isDisabled).predicate(guardMap)
    expect(getResult(context, event, meta)).toBeTruthy()
  })
})

describe("guard helpers - advanced combinations", () => {
  it("should handle complex nested conditions", () => {
    const complexContext = {
      user: { role: "admin", active: true },
      permissions: ["read", "write"],
      quota: 100
    }

    const complexGuardMap = {
      isAdmin: (ctx: any) => ctx.user.role === "admin",
      isActive: (ctx: any) => ctx.user.active,
      hasWritePermission: (ctx: any) => ctx.permissions.includes("write"),
      hasQuota: (ctx: any) => ctx.quota > 0
    }

    const getResult = and(
      or("isAdmin", "hasWritePermission"),
      "isActive",
      not("hasQuota")
    ).predicate(complexGuardMap)

    expect(getResult(complexContext, event, meta)).toBeFalsy()
  })

  it("should handle deeply nested guard combinations", () => {
    const deepContext = { a: true, b: false, c: true, d: false }
    const deepGuardMap = {
      a: (ctx: any) => ctx.a,
      b: (ctx: any) => ctx.b,
      c: (ctx: any) => ctx.c,
      d: (ctx: any) => ctx.d
    }

    const getResult = or(
      and("a", "b"),
      and(
        or("c", "d"),
        not("b")
      )
    ).predicate(deepGuardMap)

    expect(getResult(deepContext, event, meta)).toBeTruthy()
  })
})

describe("guard helpers - edge cases", () => {
  it("should handle empty guard arrays in or", () => {
    const getResult = or().predicate(guardMap)
    expect(getResult(context, event, meta)).toBeFalsy()
  })

  it("should handle empty guard arrays in and", () => {
    const getResult = and().predicate(guardMap)
    expect(getResult(context, event, meta)).toBeTruthy()
  })

  it("should handle single guard in or", () => {
    const getResult = or("isEmpty").predicate(guardMap)
    expect(getResult(context, event, meta)).toBeTruthy()
  })

  it("should handle single guard in and", () => {
    const getResult = and("isEmpty").predicate(guardMap)
    expect(getResult(context, event, meta)).toBeTruthy()
  })

  it("should handle undefined guard functions", () => {
    const emptyGuardMap = {}
    const getResult = or("nonExistent").predicate(emptyGuardMap)
    expect(getResult(context, event, meta)).toBeFalsy()
  })

  it("should handle null context", () => {
    const nullSafeGuardMap = {
      checkNull: (ctx: any) => ctx !== null && ctx !== undefined
    }
    const getResult = and("checkNull").predicate(nullSafeGuardMap)
    expect(getResult(null as any, event, meta)).toBeFalsy()
  })
})

describe("guard helpers - mixed types", () => {
  it("should handle mix of string and function guards in or", () => {
    const mixedGuard = or(
      "isEmpty",
      (ctx: Context) => ctx.focusable,
      "isDisabled"
    )
    const getResult = mixedGuard.predicate(guardMap)
    expect(getResult(context, event, meta)).toBeTruthy()
  })

  it("should handle mix of string and function guards in and", () => {
    const mixedGuard = and(
      "isEmpty",
      (ctx: Context) => ctx.focusable,
      not("isDisabled")
    )
    const getResult = mixedGuard.predicate(guardMap)
    expect(getResult(context, event, meta)).toBeTruthy()
  })

  it("should handle nested mixed type guards", () => {
    const nestedMixedGuard = or(
      and("isEmpty", (ctx: Context) => !ctx.focusable),
      and((ctx: Context) => ctx.focusable, not("isDisabled"))
    )
    const getResult = nestedMixedGuard.predicate(guardMap)
    expect(getResult(context, event, meta)).toBeTruthy()
  })
})

describe("stateIn guard", () => {
  it("should match single state", () => {
    const mockMeta = {
      state: {
        matches: vi.fn().mockReturnValue(true)
      }
    }
    const getResult = stateIn("active")
    expect(getResult(context, event, mockMeta as any)).toBeTruthy()
    expect(mockMeta.state.matches).toHaveBeenCalledWith("active")
  })

  it("should match multiple states", () => {
    const mockMeta = {
      state: {
        matches: vi.fn().mockReturnValue(false)
      }
    }
    const getResult = stateIn("active", "idle", "loading")
    expect(getResult(context, event, mockMeta as any)).toBeFalsy()
    expect(mockMeta.state.matches).toHaveBeenCalledWith("active", "idle", "loading")
  })

  it("should work with guard combinations", () => {
    const mockMeta = {
      state: {
        matches: vi.fn().mockReturnValue(true)
      }
    }
    const combinedGuard = and(
      stateIn("active"),
      "isEmpty"
    )
    const getResult = combinedGuard.predicate(guardMap)
    expect(getResult(context, event, mockMeta as any)).toBeTruthy()
  })
})

describe("guard helpers - error handling", () => {
  it("should handle guards that throw errors", () => {
    const errorGuardMap = {
      throwsError: () => {
        throw new Error("Test error")
      },
      alwaysTrue: () => true
    }

    expect(() => {
      const getResult = or("throwsError", "alwaysTrue").predicate(errorGuardMap)
      getResult(context, event, meta)
    }).toThrow("Test error")
  })

  it("should handle guards returning non-boolean values", () => {
    const nonBooleanGuardMap = {
      returnsString: () => "truthy",
      returnsNumber: () => 0,
      returnsObject: () => ({}),
      returnsNull: () => null
    }

    const stringResult = or("returnsString").predicate(nonBooleanGuardMap)
    expect(stringResult(context, event, meta)).toBeTruthy()

    const numberResult = or("returnsNumber").predicate(nonBooleanGuardMap)
    expect(numberResult(context, event, meta)).toBeFalsy()

    const objectResult = or("returnsObject").predicate(nonBooleanGuardMap)
    expect(objectResult(context, event, meta)).toBeTruthy()

    const nullResult = or("returnsNull").predicate(nonBooleanGuardMap)
    expect(nullResult(context, event, meta)).toBeFalsy()
  })
})

describe("guard helpers - performance", () => {
  it("should short-circuit in or when first condition is true", () => {
    const callOrder: number[] = []
    const shortCircuitGuardMap = {
      first: () => {
        callOrder.push(1)
        return true
      },
      second: () => {
        callOrder.push(2)
        return false
      },
      third: () => {
        callOrder.push(3)
        return true
      }
    }

    const getResult = or("first", "second", "third").predicate(shortCircuitGuardMap)
    getResult(context, event, meta)

    expect(callOrder).toEqual([1])
  })

  it("should short-circuit in and when first condition is false", () => {
    const callOrder: number[] = []
    const shortCircuitGuardMap = {
      first: () => {
        callOrder.push(1)
        return false
      },
      second: () => {
        callOrder.push(2)
        return true
      },
      third: () => {
        callOrder.push(3)
        return true
      }
    }

    const getResult = and("first", "second", "third").predicate(shortCircuitGuardMap)
    getResult(context, event, meta)

    expect(callOrder).toEqual([1])
  })

  it("should evaluate all conditions when needed", () => {
    const callOrder: number[] = []
    const allEvalGuardMap = {
      first: () => {
        callOrder.push(1)
        return false
      },
      second: () => {
        callOrder.push(2)
        return false
      },
      third: () => {
        callOrder.push(3)
        return true
      }
    }

    const getResult = or("first", "second", "third").predicate(allEvalGuardMap)
    getResult(context, event, meta)

    expect(callOrder).toEqual([1, 2, 3])
  })
})

describe("guard helpers - complex real-world scenarios", () => {
  it("should handle user permission system", () => {
    const userContext = {
      user: {
        id: 1,
        role: "moderator",
        permissions: ["read", "write", "moderate"],
        isActive: true,
        subscription: { type: "premium", expiresAt: Date.now() + 86400000 }
      },
      resource: {
        type: "post",
        ownerId: 2,
        isPublic: false
      }
    }

    const permissionGuardMap = {
      isAdmin: (ctx: any) => ctx.user.role === "admin",
      isModerator: (ctx: any) => ctx.user.role === "moderator",
      isOwner: (ctx: any) => ctx.user.id === ctx.resource.ownerId,
      hasReadPermission: (ctx: any) => ctx.user.permissions.includes("read"),
      hasWritePermission: (ctx: any) => ctx.user.permissions.includes("write"),
      isResourcePublic: (ctx: any) => ctx.resource.isPublic,
      isUserActive: (ctx: any) => ctx.user.isActive,
      hasPremiumSubscription: (ctx: any) => ctx.user.subscription.type === "premium"
    }

    // Complex permission check: can edit if (admin or (moderator and active)) and (owner or public resource) and has write permission
    const canEditGuard = and(
      or(
        "isAdmin",
        and("isModerator", "isUserActive")
      ),
      or("isOwner", "isResourcePublic"),
      "hasWritePermission"
    )

    const canEdit = canEditGuard.predicate(permissionGuardMap)
    expect(canEdit(userContext, event, meta)).toBeFalsy() // Should be false because user is not owner and resource is not public
  })

  it("should handle e-commerce checkout flow", () => {
    const checkoutContext = {
      cart: { items: [{ id: 1, price: 100 }], total: 100 },
      user: { isLoggedIn: true, hasValidPayment: true, address: { isComplete: true } },
      promo: { code: "SAVE10", isValid: true, minAmount: 50 },
      inventory: { isAvailable: true }
    }

    const checkoutGuardMap = {
      hasItems: (ctx: any) => ctx.cart.items.length > 0,
      isLoggedIn: (ctx: any) => ctx.user.isLoggedIn,
      hasValidPayment: (ctx: any) => ctx.user.hasValidPayment,
      hasCompleteAddress: (ctx: any) => ctx.user.address.isComplete,
      hasValidPromo: (ctx: any) => ctx.promo.isValid && ctx.cart.total >= ctx.promo.minAmount,
      isInventoryAvailable: (ctx: any) => ctx.inventory.isAvailable
    }

    const canProceedToCheckout = and(
      "hasItems",
      "isLoggedIn",
      "hasValidPayment",
      "hasCompleteAddress",
      "isInventoryAvailable",
      or(
        not("hasValidPromo"), // No promo applied
        "hasValidPromo"       // Valid promo applied
      )
    )

    const canProceed = canProceedToCheckout.predicate(checkoutGuardMap)
    expect(canProceed(checkoutContext, event, meta)).toBeTruthy()
  })

  it("should handle form validation scenarios", () => {
    const formContext = {
      fields: {
        email: { value: "test@example.com", isValid: true },
        password: { value: "password123", isValid: true },
        confirmPassword: { value: "password123", isValid: true },
        terms: { value: true, isValid: true }
      },
      submission: { attempts: 0, isSubmitting: false },
      captcha: { isRequired: true, isVerified: false }
    }

    const formGuardMap = {
      isEmailValid: (ctx: any) => ctx.fields.email.isValid,
      isPasswordValid: (ctx: any) => ctx.fields.password.isValid,
      passwordsMatch: (ctx: any) => ctx.fields.password.value === ctx.fields.confirmPassword.value,
      termsAccepted: (ctx: any) => ctx.fields.terms.value === true,
      isNotSubmitting: (ctx: any) => !ctx.submission.isSubmitting,
      hasAttemptsLeft: (ctx: any) => ctx.submission.attempts < 3,
      isCaptchaVerified: (ctx: any) => !ctx.captcha.isRequired || ctx.captcha.isVerified
    }

    const canSubmitForm = and(
      "isEmailValid",
      "isPasswordValid",
      "passwordsMatch",
      "termsAccepted",
      "isNotSubmitting",
      "hasAttemptsLeft",
      "isCaptchaVerified"
    )

    const canSubmit = canSubmitForm.predicate(formGuardMap)
    expect(canSubmit(formContext, event, meta)).toBeFalsy() // Should be false because captcha is not verified
  })
})
