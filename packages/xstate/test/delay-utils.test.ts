import { describe, expect, test } from "vitest"
import { determineDelayFn } from "../src/delay-utils"

const context = {
  values: [],
  focusable: true,
  disabled: true,
}

const event = {
  type: "testing",
}

type Context = typeof context

const delaysMap = {
  t1: 200,
  t2: (ctx: Context) => (ctx.values.length === 0 ? 300 : 100),
  t4: 0,
  t5: (ctx: Context) => ctx.disabled ? 500 : 1000,
}

// 单独的 delaysMap 用于测试 null 值
const delaysMapWithNull: any = {
  ...delaysMap,
  t3: null,
}

describe("determineDelayFn", () => {
  describe("string delay (reference to delaysMap)", () => {
    test("should determine delay - t1", () => {
      const fn = determineDelayFn("t1", delaysMap)
      expect(fn(context, event)).toBe(200)
    })

    test("should determine delay - t2", () => {
      const fn = determineDelayFn("t2", delaysMap)
      expect(fn(context, event)).toBe(300)
    })

    test("should determine delay - t5 with different context", () => {
      const fn = determineDelayFn("t5", delaysMap)
      expect(fn(context, event)).toBe(500)
      expect(fn({ ...context, disabled: false }, event)).toBe(1000)
    })

    test("should handle zero delay", () => {
      const fn = determineDelayFn("t4", delaysMap)
      expect(fn(context, event)).toBe(0)
    })

    test("should throw if delay is set to null in delaysMap", () => {
      const fn = determineDelayFn("t3", delaysMapWithNull)
      expect(() => fn(context, event)).toThrow(
        "[@destyler/xstate > determine-delay] Cannot determine delay for `t3`. It is set to null in `options.delays`"
      )
    })

    test("should return undefined if delay not found in delaysMap", () => {
      const fn = determineDelayFn("nonexistent", delaysMap)
      expect(fn(context, event)).toBeUndefined()
    })

    test("should return undefined if delay not found and no delaysMap", () => {
      const fn = determineDelayFn("t1", undefined)
      expect(fn(context, event)).toBeUndefined()
    })
  })

  describe("string delay (numeric string)", () => {
    test("should parse valid numeric string", () => {
      const fn = determineDelayFn("250", delaysMap)
      expect(fn(context, event)).toBe(250)
    })

    test("should parse decimal numeric string", () => {
      const fn = determineDelayFn("150.5", delaysMap)
      expect(fn(context, event)).toBe(150.5)
    })

    test("should parse zero string", () => {
      const fn = determineDelayFn("0", delaysMap)
      expect(fn(context, event)).toBe(0)
    })

    test("should parse negative number string", () => {
      const fn = determineDelayFn("-100", delaysMap)
      expect(fn(context, event)).toBe(-100)
    })

    test("should fallback to delaysMap for invalid numeric string", () => {
      const fn = determineDelayFn("t1", delaysMap)
      expect(fn(context, event)).toBe(200)
    })

    test("should return undefined for invalid string without delaysMap", () => {
      const fn = determineDelayFn("invalid", undefined)
      expect(fn(context, event)).toBeUndefined()
    })

    test("should return undefined for empty string", () => {
      const fn = determineDelayFn("", delaysMap)
      expect(fn(context, event)).toBeUndefined()
    })

    test("should return undefined for whitespace string", () => {
      const fn = determineDelayFn("   ", delaysMap)
      expect(fn(context, event)).toBeUndefined()
    })
  })

  describe("number delay", () => {
    test("should return number delay directly", () => {
      const fn = determineDelayFn(500, delaysMap)
      expect(fn(context, event)).toBe(500)
    })

    test("should handle zero delay", () => {
      const fn = determineDelayFn(0, delaysMap)
      expect(fn(context, event)).toBe(0)
    })

    test("should handle negative delay", () => {
      const fn = determineDelayFn(-100, delaysMap)
      expect(fn(context, event)).toBe(-100)
    })

    test("should handle decimal delay", () => {
      const fn = determineDelayFn(123.45, delaysMap)
      expect(fn(context, event)).toBe(123.45)
    })

    test("should work without delaysMap", () => {
      const fn = determineDelayFn(300, undefined)
      expect(fn(context, event)).toBe(300)
    })
  })

  describe("function delay", () => {
    test("should execute function delay", () => {
      const delayFn = (ctx: Context) => ctx.values.length * 100
      const fn = determineDelayFn(delayFn, delaysMap)
      expect(fn(context, event)).toBe(0)
    })

    test("should execute function delay with different context", () => {
      const delayFn = (ctx: Context, evt: any) => ctx.focusable ? 200 : 400
      const fn = determineDelayFn(delayFn, delaysMap)
      expect(fn(context, event)).toBe(200)
      expect(fn({ ...context, focusable: false }, event)).toBe(400)
    })

    test("should pass both context and event to function", () => {
      const delayFn = (ctx: Context, evt: any) => {
        return evt.type === "testing" ? 100 : 200
      }
      const fn = determineDelayFn(delayFn, delaysMap)
      expect(fn(context, event)).toBe(100)
      expect(fn(context, { type: "other" })).toBe(200)
    })

    test("should work without delaysMap", () => {
      const delayFn = () => 150
      const fn = determineDelayFn(delayFn, undefined)
      expect(fn(context, event)).toBe(150)
    })
  })

  describe("undefined delay", () => {
    test("should return undefined for undefined delay", () => {
      const fn = determineDelayFn(undefined, delaysMap)
      expect(fn(context, event)).toBeUndefined()
    })

    test("should return undefined for undefined delay without delaysMap", () => {
      const fn = determineDelayFn(undefined, undefined)
      expect(fn(context, event)).toBeUndefined()
    })
  })

  describe("edge cases", () => {
    test("should handle complex context and event objects", () => {
      const complexContext = {
        ...context,
        nested: { deep: { value: 10 } },
        array: [1, 2, 3],
      }
      const complexEvent = {
        type: "complex",
        payload: { data: "test" },
        timestamp: Date.now(),
      }

      const delayFn = (ctx: any, evt: any) => {
        return ctx.nested.deep.value * evt.payload.data.length * 10
      }

      const fn = determineDelayFn(delayFn, delaysMap)
      expect(fn(complexContext, complexEvent)).toBe(400) // 10 * 4 * 10
    })

    test("should handle empty delaysMap", () => {
      const fn = determineDelayFn("t1", {})
      expect(fn(context, event)).toBeUndefined()
    })

    test("should handle function that returns zero", () => {
      const delayFn = () => 0
      const fn = determineDelayFn(delayFn, delaysMap)
      expect(fn(context, event)).toBe(0)
    })

    test("should handle function that returns negative value", () => {
      const delayFn = () => -50
      const fn = determineDelayFn(delayFn, delaysMap)
      expect(fn(context, event)).toBe(-50)
    })

    test("should handle very large numbers", () => {
      const fn = determineDelayFn(Number.MAX_SAFE_INTEGER, delaysMap)
      expect(fn(context, event)).toBe(Number.MAX_SAFE_INTEGER)
    })

    test("should handle Infinity", () => {
      const fn = determineDelayFn(Infinity, delaysMap)
      expect(fn(context, event)).toBe(Infinity)
    })
  })
})
