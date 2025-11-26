import type {
  CommonProperties,
  Direction,
  DirectionProperty,
  EventKey,
  EventKeyMap,
  LocaleProperties,
  MaybeElement,
  MaybeFn,
  NonNullable,
  Nullable,
  Orientation,
  OrientationProperty,
  Point,
  Required,
  RequiredBy,
  Style,
} from '../index'
import { assertType, describe, expectTypeOf, test } from 'vitest'

describe('utility types', () => {
  describe('RequiredBy', () => {
    test('should make specific keys required', () => {
      interface TestInterface {
        a?: string
        b?: number
        c?: boolean
      }

      type Result = RequiredBy<TestInterface, 'a' | 'b'>

      // 'a' and 'b' should be required
      expectTypeOf<Result>().toExtend<{ a: string, b: number }>()

      // Valid assignment
      const valid: Result = { a: 'test', b: 123 }
      assertType<Result>(valid)

      // Optional properties should remain optional (c)
      const withOptional: Result = { a: 'test', b: 123, c: true }
      assertType<Result>(withOptional)
    })
  })

  describe('Nullable', () => {
    test('should allow null values', () => {
      type StringOrNull = Nullable<string>

      expectTypeOf<StringOrNull>().toEqualTypeOf<string | null>()

      const value1: StringOrNull = 'test'
      const value2: StringOrNull = null

      assertType<StringOrNull>(value1)
      assertType<StringOrNull>(value2)
    })

    test('should work with complex types', () => {
      interface User {
        name: string
        age: number
      }

      type NullableUser = Nullable<User>

      expectTypeOf<NullableUser>().toEqualTypeOf<User | null>()

      const user1: NullableUser = { name: 'John', age: 30 }
      const user2: NullableUser = null

      assertType<NullableUser>(user1)
      assertType<NullableUser>(user2)
    })
  })

  describe('NonNullable', () => {
    test('should exclude null and undefined', () => {
      type StringOrNullOrUndefined = string | null | undefined
      type Result = NonNullable<StringOrNullOrUndefined>

      expectTypeOf<Result>().toEqualTypeOf<string>()

      const value: Result = 'test'
      assertType<Result>(value)
    })

    test('should preserve non-nullable types', () => {
      type Result = NonNullable<number>

      expectTypeOf<Result>().toEqualTypeOf<number>()
    })

    test('should return never for null only', () => {
      type Result = NonNullable<null>

      expectTypeOf<Result>().toEqualTypeOf<never>()
    })

    test('should return never for undefined only', () => {
      type Result = NonNullable<undefined>

      expectTypeOf<Result>().toEqualTypeOf<never>()
    })
  })

  describe('Required', () => {
    test('should make all properties required and non-nullable', () => {
      interface TestInterface {
        a?: string | null
        b?: number | undefined
        c: boolean | null
      }

      type Result = Required<TestInterface>

      // All properties should be required and non-nullable
      expectTypeOf<Result>().toExtend<{
        a: string
        b: number
        c: boolean
      }>()
    })
  })

  describe('Direction', () => {
    test('should only allow ltr or rtl', () => {
      expectTypeOf<Direction>().toEqualTypeOf<'ltr' | 'rtl'>()

      const ltr: Direction = 'ltr'
      const rtl: Direction = 'rtl'

      assertType<Direction>(ltr)
      assertType<Direction>(rtl)
    })
  })

  describe('Orientation', () => {
    test('should only allow horizontal or vertical', () => {
      expectTypeOf<Orientation>().toEqualTypeOf<'horizontal' | 'vertical'>()

      const horizontal: Orientation = 'horizontal'
      const vertical: Orientation = 'vertical'

      assertType<Orientation>(horizontal)
      assertType<Orientation>(vertical)
    })
  })

  describe('MaybeFn', () => {
    test('should accept value or function returning value', () => {
      type StringOrFn = MaybeFn<string>

      const value1: StringOrFn = 'test'
      const value2: StringOrFn = () => 'test'

      assertType<StringOrFn>(value1)
      assertType<StringOrFn>(value2)
    })

    test('should work with complex types', () => {
      interface Config {
        enabled: boolean
        count: number
      }

      type ConfigOrFn = MaybeFn<Config>

      const value1: ConfigOrFn = { enabled: true, count: 5 }
      const value2: ConfigOrFn = () => ({ enabled: false, count: 10 })

      assertType<ConfigOrFn>(value1)
      assertType<ConfigOrFn>(value2)
    })
  })

  describe('MaybeElement', () => {
    test('should be nullable HTMLElement by default', () => {
      type Result = MaybeElement

      expectTypeOf<Result>().toEqualTypeOf<HTMLElement | null>()

      const el1: Result = document.createElement('div')
      const el2: Result = null

      assertType<Result>(el1)
      assertType<Result>(el2)
    })

    test('should work with specific element types', () => {
      type ButtonElement = MaybeElement<HTMLButtonElement>

      expectTypeOf<ButtonElement>().toEqualTypeOf<HTMLButtonElement | null>()

      const btn1: ButtonElement = document.createElement('button')
      const btn2: ButtonElement = null

      assertType<ButtonElement>(btn1)
      assertType<ButtonElement>(btn2)
    })
  })

  describe('EventKey', () => {
    test('should include all predefined keys and allow custom strings', () => {
      const arrowDown: EventKey = 'ArrowDown'
      const arrowUp: EventKey = 'ArrowUp'
      const arrowLeft: EventKey = 'ArrowLeft'
      const arrowRight: EventKey = 'ArrowRight'
      const space: EventKey = 'Space'
      const enter: EventKey = 'Enter'
      const comma: EventKey = 'Comma'
      const escape: EventKey = 'Escape'
      const backspace: EventKey = 'Backspace'
      const deleteKey: EventKey = 'Delete'
      const home: EventKey = 'Home'
      const end: EventKey = 'End'
      const tab: EventKey = 'Tab'
      const pageUp: EventKey = 'PageUp'
      const pageDown: EventKey = 'PageDown'

      assertType<EventKey>(arrowDown)
      assertType<EventKey>(arrowUp)
      assertType<EventKey>(arrowLeft)
      assertType<EventKey>(arrowRight)
      assertType<EventKey>(space)
      assertType<EventKey>(enter)
      assertType<EventKey>(comma)
      assertType<EventKey>(escape)
      assertType<EventKey>(backspace)
      assertType<EventKey>(deleteKey)
      assertType<EventKey>(home)
      assertType<EventKey>(end)
      assertType<EventKey>(tab)
      assertType<EventKey>(pageUp)
      assertType<EventKey>(pageDown)

      // Custom string should also work
      const customKey: EventKey = 'CustomKey'
      assertType<EventKey>(customKey)
    })
  })

  describe('EventKeyMap', () => {
    test('should map event keys to handlers', () => {
      const keyMap: EventKeyMap = {
        ArrowDown: (event) => {
          expectTypeOf(event.key).toBeString()
        },
        Enter: (event) => {
          expectTypeOf(event.preventDefault).toBeFunction()
        },
      }

      assertType<EventKeyMap>(keyMap)
    })

    test('should work with specific element types', () => {
      const keyMap: EventKeyMap<HTMLInputElement> = {
        Escape: (event) => {
          expectTypeOf(event.currentTarget).toExtend<HTMLInputElement>()
        },
      }

      assertType<EventKeyMap<HTMLInputElement>>(keyMap)
    })
  })

  describe('Point', () => {
    test('should have x and y coordinates', () => {
      const point: Point = { x: 10, y: 20 }

      expectTypeOf(point.x).toBeNumber()
      expectTypeOf(point.y).toBeNumber()
      assertType<Point>(point)
    })
  })

  describe('Style', () => {
    test('should be a CSSProperties alias', () => {
      const style: Style = {
        color: 'red',
        fontSize: '16px',
        display: 'flex',
      }

      assertType<Style>(style)
    })
  })
})

describe('interface types', () => {
  describe('OrientationProperty', () => {
    test('should have orientation property', () => {
      const props: OrientationProperty = {
        orientation: 'horizontal',
      }

      expectTypeOf(props.orientation).toEqualTypeOf<Orientation>()
      assertType<OrientationProperty>(props)
    })
  })

  describe('DirectionProperty', () => {
    test('should have optional dir property', () => {
      const props1: DirectionProperty = {}
      const props2: DirectionProperty = { dir: 'ltr' }
      const props3: DirectionProperty = { dir: 'rtl' }
      const props4: DirectionProperty = { dir: undefined }

      assertType<DirectionProperty>(props1)
      assertType<DirectionProperty>(props2)
      assertType<DirectionProperty>(props3)
      assertType<DirectionProperty>(props4)
    })
  })

  describe('LocaleProperties', () => {
    test('should extend DirectionProperty', () => {
      expectTypeOf<LocaleProperties>().toExtend<DirectionProperty>()
    })

    test('should have optional locale property', () => {
      const props1: LocaleProperties = {}
      const props2: LocaleProperties = { locale: 'en-US' }
      const props3: LocaleProperties = { dir: 'ltr', locale: 'zh-CN' }

      assertType<LocaleProperties>(props1)
      assertType<LocaleProperties>(props2)
      assertType<LocaleProperties>(props3)
    })
  })

  describe('CommonProperties', () => {
    test('should have required id property', () => {
      const props: CommonProperties = {
        id: 'test-id',
      }

      expectTypeOf(props.id).toBeString()
      assertType<CommonProperties>(props)
    })

    test('should have optional getRootNode function', () => {
      const props: CommonProperties = {
        id: 'test-id',
        getRootNode: () => document,
      }

      if (props.getRootNode) {
        expectTypeOf(props.getRootNode()).toExtend<ShadowRoot | Document | Node>()
      }

      assertType<CommonProperties>(props)
    })
  })
})
