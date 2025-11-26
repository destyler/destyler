import type { CSSProperties, HTMLAttributes } from '../src/jsx'
import type { NormalizeProps, PropTypes } from '../src/prop-types'
import { assertType, describe, expectTypeOf, test } from 'vitest'
import { createNormalizer } from '../index'

describe('PropTypes', () => {
  describe('basic structure', () => {
    test('should have all required element keys', () => {
      type TestPropTypes = PropTypes

      // Check that all required keys exist
      expectTypeOf<TestPropTypes>().toHaveProperty('button')
      expectTypeOf<TestPropTypes>().toHaveProperty('label')
      expectTypeOf<TestPropTypes>().toHaveProperty('input')
      expectTypeOf<TestPropTypes>().toHaveProperty('textarea')
      expectTypeOf<TestPropTypes>().toHaveProperty('img')
      expectTypeOf<TestPropTypes>().toHaveProperty('output')
      expectTypeOf<TestPropTypes>().toHaveProperty('element')
      expectTypeOf<TestPropTypes>().toHaveProperty('select')
      expectTypeOf<TestPropTypes>().toHaveProperty('rect')
      expectTypeOf<TestPropTypes>().toHaveProperty('style')
      expectTypeOf<TestPropTypes>().toHaveProperty('circle')
      expectTypeOf<TestPropTypes>().toHaveProperty('svg')
      expectTypeOf<TestPropTypes>().toHaveProperty('path')
    })

    test('should use Dict type by default', () => {
      type DefaultPropTypes = PropTypes

      // Default generic should be Dict (Record<string, any>)
      expectTypeOf<DefaultPropTypes['button']>().toEqualTypeOf<Record<string, any>>()
    })

    test('should accept custom type parameter', () => {
      interface CustomProps {
        className: string
        style: CSSProperties
      }

      type CustomPropTypes = PropTypes<CustomProps>

      expectTypeOf<CustomPropTypes['button']>().toEqualTypeOf<CustomProps>()
      expectTypeOf<CustomPropTypes['input']>().toEqualTypeOf<CustomProps>()
      expectTypeOf<CustomPropTypes['element']>().toEqualTypeOf<CustomProps>()
    })
  })

  describe('element type coverage', () => {
    test('should include HTML form elements', () => {
      type FormElements = Pick<PropTypes, 'button' | 'input' | 'textarea' | 'select' | 'label' | 'output'>

      assertType<FormElements>({
        button: {},
        input: {},
        textarea: {},
        select: {},
        label: {},
        output: {},
      })
    })

    test('should include SVG elements', () => {
      type SVGElements = Pick<PropTypes, 'svg' | 'rect' | 'circle' | 'path'>

      assertType<SVGElements>({
        svg: {},
        rect: {},
        circle: {},
        path: {},
      })
    })

    test('should include media elements', () => {
      type MediaElements = Pick<PropTypes, 'img'>

      assertType<MediaElements>({
        img: {},
      })
    })

    test('should include generic element', () => {
      type GenericElements = Pick<PropTypes, 'element'>

      assertType<GenericElements>({
        element: {},
      })
    })

    test('should include style element', () => {
      type StyleElements = Pick<PropTypes, 'style'>

      assertType<StyleElements>({
        style: {},
      })
    })
  })
})

describe('NormalizeProps', () => {
  describe('function signatures', () => {
    test('should have normalizer functions for each element type', () => {
      interface CustomType { id: string }
      type TestNormalizer = NormalizeProps<PropTypes<CustomType>>

      // Each element type should have a function
      expectTypeOf<TestNormalizer['button']>().toBeFunction()
      expectTypeOf<TestNormalizer['input']>().toBeFunction()
      expectTypeOf<TestNormalizer['textarea']>().toBeFunction()
      expectTypeOf<TestNormalizer['select']>().toBeFunction()
      expectTypeOf<TestNormalizer['label']>().toBeFunction()
      expectTypeOf<TestNormalizer['output']>().toBeFunction()
      expectTypeOf<TestNormalizer['img']>().toBeFunction()
      expectTypeOf<TestNormalizer['svg']>().toBeFunction()
      expectTypeOf<TestNormalizer['rect']>().toBeFunction()
      expectTypeOf<TestNormalizer['circle']>().toBeFunction()
      expectTypeOf<TestNormalizer['path']>().toBeFunction()
    })

    test('should have element normalizer function', () => {
      interface CustomType { id: string }
      type TestNormalizer = NormalizeProps<PropTypes<CustomType>>

      expectTypeOf<TestNormalizer['element']>().toBeFunction()
    })

    test('should have style property as CSSProperties', () => {
      interface CustomType { id: string }
      type TestNormalizer = NormalizeProps<PropTypes<CustomType>>

      // style property should be compatible with CSSProperties
      expectTypeOf<TestNormalizer['style']>().toExtend<CSSProperties>()
    })
  })

  describe('element normalizer accepts data attributes', () => {
    test('element normalizer should accept HTMLAttributes with data attributes', () => {
      interface CustomType { id: string, className?: string }
      type TestNormalizer = NormalizeProps<PropTypes<CustomType>>

      // The element function should accept data attributes
      type ElementFn = TestNormalizer['element']

      // Element function parameter should accept data attributes and HTMLAttributes
      interface ExpectedParam extends HTMLAttributes<HTMLElement> {
        'data-selected'?: any
        'data-expanded'?: any
        'data-highlighted'?: any
        'data-readonly'?: any
        'data-indeterminate'?: any
        'data-invalid'?: any
        'data-hover'?: any
        'data-active'?: any
        'data-focus'?: any
        'data-focus-visible'?: any
        'data-disabled'?: any
        'data-open'?: any
        'data-checked'?: any
        'data-pressed'?: any
        'data-complete'?: any
        'data-side'?: any
        'data-align'?: any
        'data-empty'?: any
        'data-placeholder-shown'?: any
        'data-half'?: any
        'data-scope'?: string
        'data-uid'?: string
        'data-name'?: string
        'data-ownedby'?: string
        'data-type'?: string
        'data-valuetext'?: string
        'data-placement'?: string
        'data-controls'?: string
        'data-part'?: string
        'data-label'?: string
        'data-state'?: string | null
        'data-value'?: string | number
        'data-orientation'?: 'horizontal' | 'vertical'
        'data-count'?: number
        'data-index'?: number
        [key: string]: any
      }

      expectTypeOf<ElementFn>().toBeFunction()
      assertType<ElementFn>((_props: ExpectedParam) => ({ id: 'test' }))
    })
  })
})

describe('createNormalizer', () => {
  describe('basic functionality', () => {
    test('should create normalizer from function', () => {
      type CustomPropTypes = PropTypes<{ className: string }>

      const normalizer = createNormalizer<CustomPropTypes>((props) => {
        return { ...props, normalized: true }
      })

      assertType<NormalizeProps<CustomPropTypes>>(normalizer)
    })

    test('should return proxy-based normalizer', () => {
      type CustomPropTypes = PropTypes<{ id: string }>

      const normalizer = createNormalizer<CustomPropTypes>(props => props)

      // Normalizer should have all element methods
      expectTypeOf(normalizer.button).toBeFunction()
      expectTypeOf(normalizer.input).toBeFunction()
      expectTypeOf(normalizer.element).toBeFunction()
    })
  })

  describe('normalizer function behavior', () => {
    test('should transform props through normalizer function', () => {
      type CustomPropTypes = PropTypes<{ className: string, id: string }>

      const normalizer = createNormalizer<CustomPropTypes>((props) => {
        const result: Record<string, any> = {}
        for (const [key, value] of Object.entries(props)) {
          result[key] = value
        }
        return result
      })

      // All element accessors should return the same normalizer function
      assertType<NormalizeProps<CustomPropTypes>>(normalizer)
    })

    test('should accept Dict as input', () => {
      createNormalizer<PropTypes>((props: Record<string, any>) => {
        return props
      })
    })
  })

  describe('integration with PropTypes', () => {
    test('should work with default PropTypes', () => {
      const normalizer = createNormalizer<PropTypes>(props => props)

      expectTypeOf(normalizer).toMatchTypeOf<NormalizeProps<PropTypes>>()
    })

    test('should work with custom PropTypes', () => {
      interface ReactProps {
        className?: string
        style?: CSSProperties
        onClick?: () => void
      }

      type ReactPropTypes = PropTypes<ReactProps>

      const normalizer = createNormalizer<ReactPropTypes>(props => props)

      expectTypeOf(normalizer).toMatchTypeOf<NormalizeProps<ReactPropTypes>>()
    })
  })

  describe('style property', () => {
    test('should have style as CSSProperties', () => {
      // Note: normalizer.style is CSSProperties type directly
      expectTypeOf<NormalizeProps<PropTypes>['style']>().toExtend<CSSProperties>()
    })

    test('should accept CSS properties in style', () => {
      // CSSProperties should accept standard CSS properties
      const style: CSSProperties = {
        'color': 'red',
        'fontSize': '16px',
        'display': 'flex',
        '--custom-var': '10px',
      }

      assertType<CSSProperties>(style)
    })
  })
})
