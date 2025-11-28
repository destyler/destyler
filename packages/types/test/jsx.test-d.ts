import type {
  AbstractView,
  AllHTMLAttributes,
  AnchorHTMLAttributes,
  AnimationEventHandler,
  AriaAttributes,
  BaseSyntheticEvent,
  ButtonHTMLAttributes,
  ChangeEventHandler,
  ClipboardEventHandler,
  CompositionEventHandler,
  CSSProperties,
  DOMAttributes,
  DragEventHandler,
  FocusEventHandler,
  FormEventHandler,
  HTMLAttributes,
  HTMLProps,
  InputHTMLAttributes,
  IntrinsicElements,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  SelectHTMLAttributes,
  SVGAttributes,
  SyntheticAnimationEvent,
  SyntheticChangeEvent,
  SyntheticClipboardEvent,
  SyntheticCompositionEvent,
  SyntheticDragEvent,
  SyntheticEvent,
  SyntheticFocusEvent,
  SyntheticFormEvent,
  SyntheticInvalidEvent,
  SyntheticKeyboardEvent,
  SyntheticMouseEvent,
  SyntheticPointerEvent,
  SyntheticTouchEvent,
  SyntheticTransitionEvent,
  SyntheticUIEvent,
  SyntheticWheelEvent,
  TextareaHTMLAttributes,
  TouchEventHandler,
  TransitionEventHandler,
  UIEventHandler,
  WheelEventHandler,
} from '../index'
import { assertType, describe, expectTypeOf, test } from 'vitest'

describe('synthetic events', () => {
  describe('BaseSyntheticEvent', () => {
    test('should have all base properties', () => {
      const event: BaseSyntheticEvent = {
        nativeEvent: {},
        currentTarget: null,
        target: null,
        bubbles: true,
        cancelable: true,
        defaultPrevented: false,
        eventPhase: 2,
        isTrusted: true,
        preventDefault: () => {},
        isDefaultPrevented: () => false,
        stopPropagation: () => {},
        isPropagationStopped: () => false,
        persist: () => {},
        timeStamp: Date.now(),
        type: 'click',
      }

      expectTypeOf(event.bubbles).toBeBoolean()
      expectTypeOf(event.cancelable).toBeBoolean()
      expectTypeOf(event.defaultPrevented).toBeBoolean()
      expectTypeOf(event.eventPhase).toBeNumber()
      expectTypeOf(event.isTrusted).toBeBoolean()
      expectTypeOf(event.preventDefault).toBeFunction()
      expectTypeOf(event.isDefaultPrevented).toBeFunction()
      expectTypeOf(event.stopPropagation).toBeFunction()
      expectTypeOf(event.isPropagationStopped).toBeFunction()
      expectTypeOf(event.persist).toBeFunction()
      expectTypeOf(event.timeStamp).toBeNumber()
      expectTypeOf(event.type).toBeString()

      assertType<BaseSyntheticEvent>(event)
    })
  })

  describe('SyntheticEvent', () => {
    test('should extend BaseSyntheticEvent', () => {
      expectTypeOf<SyntheticEvent>().toMatchTypeOf<BaseSyntheticEvent>()
    })

    test('should work with element type parameter', () => {
      type DivEvent = SyntheticEvent<HTMLDivElement>

      // Should be assignable
      const handler = (_event: DivEvent) => {}
      assertType<(event: DivEvent) => void>(handler)
    })
  })

  describe('SyntheticClipboardEvent', () => {
    test('should have clipboardData property', () => {
      type ClipboardEvent = SyntheticClipboardEvent<HTMLInputElement>

      // Check that clipboardData is of type DataTransfer
      expectTypeOf<ClipboardEvent['clipboardData']>().toEqualTypeOf<DataTransfer>()
    })

    test('should extend SyntheticEvent', () => {
      expectTypeOf<SyntheticClipboardEvent>().toMatchTypeOf<SyntheticEvent>()
    })
  })

  describe('SyntheticCompositionEvent', () => {
    test('should have data property', () => {
      type CompositionEvent = SyntheticCompositionEvent<HTMLInputElement>

      expectTypeOf<CompositionEvent['data']>().toBeString()
    })
  })

  describe('SyntheticKeyboardEvent', () => {
    test('should have keyboard-specific properties', () => {
      type KeyEvent = SyntheticKeyboardEvent<HTMLInputElement>

      expectTypeOf<KeyEvent['altKey']>().toBeBoolean()
      expectTypeOf<KeyEvent['ctrlKey']>().toBeBoolean()
      expectTypeOf<KeyEvent['metaKey']>().toBeBoolean()
      expectTypeOf<KeyEvent['shiftKey']>().toBeBoolean()
      expectTypeOf<KeyEvent['key']>().toBeString()
      expectTypeOf<KeyEvent['code']>().toBeString()
      expectTypeOf<KeyEvent['locale']>().toBeString()
      expectTypeOf<KeyEvent['location']>().toBeNumber()
      expectTypeOf<KeyEvent['repeat']>().toBeBoolean()
    })

    test('should have getModifierState method', () => {
      type KeyEvent = SyntheticKeyboardEvent<HTMLInputElement>

      expectTypeOf<KeyEvent['getModifierState']>().toEqualTypeOf<(key: string) => boolean>()
    })

    test('should have deprecated properties', () => {
      type KeyEvent = SyntheticKeyboardEvent<HTMLInputElement>

      // These are deprecated but should still exist
      expectTypeOf<KeyEvent['charCode']>().toBeNumber()
      expectTypeOf<KeyEvent['keyCode']>().toBeNumber()
      expectTypeOf<KeyEvent['which']>().toBeNumber()
    })
  })

  describe('SyntheticMouseEvent', () => {
    test('should have mouse-specific properties', () => {
      type MouseEvent = SyntheticMouseEvent<HTMLButtonElement>

      expectTypeOf<MouseEvent['altKey']>().toBeBoolean()
      expectTypeOf<MouseEvent['button']>().toBeNumber()
      expectTypeOf<MouseEvent['buttons']>().toBeNumber()
      expectTypeOf<MouseEvent['clientX']>().toBeNumber()
      expectTypeOf<MouseEvent['clientY']>().toBeNumber()
      expectTypeOf<MouseEvent['ctrlKey']>().toBeBoolean()
      expectTypeOf<MouseEvent['metaKey']>().toBeBoolean()
      expectTypeOf<MouseEvent['movementX']>().toBeNumber()
      expectTypeOf<MouseEvent['movementY']>().toBeNumber()
      expectTypeOf<MouseEvent['pageX']>().toBeNumber()
      expectTypeOf<MouseEvent['pageY']>().toBeNumber()
      expectTypeOf<MouseEvent['screenX']>().toBeNumber()
      expectTypeOf<MouseEvent['screenY']>().toBeNumber()
      expectTypeOf<MouseEvent['shiftKey']>().toBeBoolean()
    })
  })

  describe('SyntheticFocusEvent', () => {
    test('should have relatedTarget property', () => {
      type FocusEvent = SyntheticFocusEvent<HTMLInputElement>

      expectTypeOf<FocusEvent['relatedTarget']>().toEqualTypeOf<(EventTarget & Element) | null>()
    })

    test('should allow custom RelatedTarget type', () => {
      type CustomFocusEvent = SyntheticFocusEvent<HTMLInputElement, HTMLButtonElement>

      expectTypeOf<CustomFocusEvent['relatedTarget']>().toEqualTypeOf<(EventTarget & HTMLButtonElement) | null>()
    })
  })

  describe('SyntheticDragEvent', () => {
    test('should have dataTransfer property', () => {
      type DragEvent = SyntheticDragEvent<HTMLDivElement>

      expectTypeOf<DragEvent['dataTransfer']>().toEqualTypeOf<DataTransfer>()
    })

    test('should extend SyntheticMouseEvent', () => {
      expectTypeOf<SyntheticDragEvent>().toMatchTypeOf<SyntheticMouseEvent>()
    })
  })

  describe('SyntheticPointerEvent', () => {
    test('should have pointer-specific properties', () => {
      type PointerEvent = SyntheticPointerEvent<HTMLDivElement>

      expectTypeOf<PointerEvent['pointerId']>().toBeNumber()
      expectTypeOf<PointerEvent['pressure']>().toBeNumber()
      expectTypeOf<PointerEvent['tangentialPressure']>().toBeNumber()
      expectTypeOf<PointerEvent['tiltX']>().toBeNumber()
      expectTypeOf<PointerEvent['tiltY']>().toBeNumber()
      expectTypeOf<PointerEvent['twist']>().toBeNumber()
      expectTypeOf<PointerEvent['width']>().toBeNumber()
      expectTypeOf<PointerEvent['height']>().toBeNumber()
      expectTypeOf<PointerEvent['isPrimary']>().toBeBoolean()
    })

    test('should have pointerType property with union type', () => {
      type PointerEvent = SyntheticPointerEvent<HTMLDivElement>

      expectTypeOf<PointerEvent['pointerType']>().toEqualTypeOf<'mouse' | 'pen' | 'touch'>()
    })

    test('should extend SyntheticMouseEvent', () => {
      expectTypeOf<SyntheticPointerEvent>().toMatchTypeOf<SyntheticMouseEvent>()
    })
  })

  describe('SyntheticTouchEvent', () => {
    test('should have touch-specific properties', () => {
      type TouchEvent = SyntheticTouchEvent<HTMLDivElement>

      expectTypeOf<TouchEvent['altKey']>().toBeBoolean()
      expectTypeOf<TouchEvent['ctrlKey']>().toBeBoolean()
      expectTypeOf<TouchEvent['metaKey']>().toBeBoolean()
      expectTypeOf<TouchEvent['shiftKey']>().toBeBoolean()
      expectTypeOf<TouchEvent['changedTouches']>().toEqualTypeOf<TouchList>()
      expectTypeOf<TouchEvent['targetTouches']>().toEqualTypeOf<TouchList>()
      expectTypeOf<TouchEvent['touches']>().toEqualTypeOf<TouchList>()
    })
  })

  describe('SyntheticUIEvent', () => {
    test('should have UI-specific properties', () => {
      type UIEvent = SyntheticUIEvent<HTMLDivElement>

      expectTypeOf<UIEvent['detail']>().toBeNumber()
    })

    test('should have view property of AbstractView type', () => {
      type UIEvent = SyntheticUIEvent<HTMLDivElement>

      expectTypeOf<UIEvent['view']>().toMatchTypeOf<AbstractView>()
    })
  })

  describe('SyntheticWheelEvent', () => {
    test('should have wheel-specific properties', () => {
      type WheelEvent = SyntheticWheelEvent<HTMLDivElement>

      expectTypeOf<WheelEvent['deltaMode']>().toBeNumber()
      expectTypeOf<WheelEvent['deltaX']>().toBeNumber()
      expectTypeOf<WheelEvent['deltaY']>().toBeNumber()
      expectTypeOf<WheelEvent['deltaZ']>().toBeNumber()
    })

    test('should extend SyntheticMouseEvent', () => {
      expectTypeOf<SyntheticWheelEvent>().toMatchTypeOf<SyntheticMouseEvent>()
    })
  })

  describe('SyntheticAnimationEvent', () => {
    test('should have animation-specific properties', () => {
      type AnimationEvent = SyntheticAnimationEvent<HTMLDivElement>

      expectTypeOf<AnimationEvent['animationName']>().toBeString()
      expectTypeOf<AnimationEvent['elapsedTime']>().toBeNumber()
      expectTypeOf<AnimationEvent['pseudoElement']>().toBeString()
    })
  })

  describe('SyntheticTransitionEvent', () => {
    test('should have transition-specific properties', () => {
      type TransitionEvent = SyntheticTransitionEvent<HTMLDivElement>

      expectTypeOf<TransitionEvent['elapsedTime']>().toBeNumber()
      expectTypeOf<TransitionEvent['propertyName']>().toBeString()
      expectTypeOf<TransitionEvent['pseudoElement']>().toBeString()
    })
  })

  describe('SyntheticFormEvent', () => {
    test('should extend SyntheticEvent', () => {
      expectTypeOf<SyntheticFormEvent>().toMatchTypeOf<SyntheticEvent>()
    })
  })

  describe('SyntheticInvalidEvent', () => {
    test('should have typed target', () => {
      type InvalidEvent = SyntheticInvalidEvent<HTMLInputElement>

      expectTypeOf<InvalidEvent['target']>().toMatchTypeOf<EventTarget & HTMLInputElement>()
    })
  })

  describe('SyntheticChangeEvent', () => {
    test('should have typed target', () => {
      type ChangeEvent = SyntheticChangeEvent<HTMLInputElement>

      expectTypeOf<ChangeEvent['target']>().toMatchTypeOf<EventTarget & HTMLInputElement>()
    })
  })
})

describe('event handlers', () => {
  describe('ClipboardEventHandler', () => {
    test('should accept SyntheticClipboardEvent', () => {
      const handler: ClipboardEventHandler<HTMLInputElement> = (_event) => {}

      assertType<ClipboardEventHandler<HTMLInputElement>>(handler)
    })
  })

  describe('CompositionEventHandler', () => {
    test('should accept SyntheticCompositionEvent', () => {
      const handler: CompositionEventHandler<HTMLInputElement> = (_event) => {}

      assertType<CompositionEventHandler<HTMLInputElement>>(handler)
    })
  })

  describe('DragEventHandler', () => {
    test('should accept SyntheticDragEvent', () => {
      const handler: DragEventHandler<HTMLDivElement> = (_event) => {}

      assertType<DragEventHandler<HTMLDivElement>>(handler)
    })
  })

  describe('FocusEventHandler', () => {
    test('should accept SyntheticFocusEvent', () => {
      const handler: FocusEventHandler<HTMLInputElement> = (_event) => {}

      assertType<FocusEventHandler<HTMLInputElement>>(handler)
    })
  })

  describe('FormEventHandler', () => {
    test('should accept SyntheticFormEvent', () => {
      const handler: FormEventHandler<HTMLFormElement> = (_event) => {}

      assertType<FormEventHandler<HTMLFormElement>>(handler)
    })
  })

  describe('ChangeEventHandler', () => {
    test('should accept SyntheticChangeEvent', () => {
      const handler: ChangeEventHandler<HTMLInputElement> = (_event) => {}

      assertType<ChangeEventHandler<HTMLInputElement>>(handler)
    })
  })

  describe('KeyboardEventHandler', () => {
    test('should accept SyntheticKeyboardEvent', () => {
      const handler: KeyboardEventHandler<HTMLInputElement> = (_event) => {}

      assertType<KeyboardEventHandler<HTMLInputElement>>(handler)
    })
  })

  describe('MouseEventHandler', () => {
    test('should accept SyntheticMouseEvent', () => {
      const handler: MouseEventHandler<HTMLButtonElement> = (_event) => {}

      assertType<MouseEventHandler<HTMLButtonElement>>(handler)
    })
  })

  describe('TouchEventHandler', () => {
    test('should accept SyntheticTouchEvent', () => {
      const handler: TouchEventHandler<HTMLDivElement> = (_event) => {}

      assertType<TouchEventHandler<HTMLDivElement>>(handler)
    })
  })

  describe('PointerEventHandler', () => {
    test('should accept SyntheticPointerEvent', () => {
      const handler: PointerEventHandler<HTMLDivElement> = (_event) => {}

      assertType<PointerEventHandler<HTMLDivElement>>(handler)
    })
  })

  describe('UIEventHandler', () => {
    test('should accept SyntheticUIEvent', () => {
      const handler: UIEventHandler<HTMLDivElement> = (_event) => {}

      assertType<UIEventHandler<HTMLDivElement>>(handler)
    })
  })

  describe('WheelEventHandler', () => {
    test('should accept SyntheticWheelEvent', () => {
      const handler: WheelEventHandler<HTMLDivElement> = (_event) => {}

      assertType<WheelEventHandler<HTMLDivElement>>(handler)
    })
  })

  describe('AnimationEventHandler', () => {
    test('should accept SyntheticAnimationEvent', () => {
      const handler: AnimationEventHandler<HTMLDivElement> = (_event) => {}

      assertType<AnimationEventHandler<HTMLDivElement>>(handler)
    })
  })

  describe('TransitionEventHandler', () => {
    test('should accept SyntheticTransitionEvent', () => {
      const handler: TransitionEventHandler<HTMLDivElement> = (_event) => {}

      assertType<TransitionEventHandler<HTMLDivElement>>(handler)
    })
  })
})

describe('DOM attributes', () => {
  describe('DOMAttributes', () => {
    test('should have children property', () => {
      const attrs: DOMAttributes<HTMLDivElement> = {
        children: 'Hello',
      }

      expectTypeOf(attrs.children).toEqualTypeOf<string | undefined>()
      assertType<DOMAttributes<HTMLDivElement>>(attrs)
    })

    test('should have clipboard event handlers', () => {
      const attrs: DOMAttributes<HTMLDivElement> = {
        onCopy: (_e) => {},
        onCut: (_e) => {},
        onPaste: (_e) => {},
      }

      assertType<DOMAttributes<HTMLDivElement>>(attrs)
    })

    test('should have focus event handlers', () => {
      const attrs: DOMAttributes<HTMLInputElement> = {
        onFocus: (_e) => {},
        onBlur: (_e) => {},
      }

      assertType<DOMAttributes<HTMLInputElement>>(attrs)
    })

    test('should have keyboard event handlers', () => {
      const attrs: DOMAttributes<HTMLInputElement> = {
        onKeyDown: (_e) => {},
        onKeyUp: (_e) => {},
      }

      assertType<DOMAttributes<HTMLInputElement>>(attrs)
    })

    test('should have mouse event handlers', () => {
      const attrs: DOMAttributes<HTMLButtonElement> = {
        onClick: (_e) => {},
        onDoubleClick: (_e) => {},
        onMouseDown: (_e) => {},
        onMouseUp: (_e) => {},
        onMouseEnter: (_e) => {},
        onMouseLeave: (_e) => {},
        onMouseMove: (_e) => {},
        onMouseOver: (_e) => {},
        onMouseOut: (_e) => {},
        onContextMenu: (_e) => {},
        onAuxClick: (_e) => {},
      }

      assertType<DOMAttributes<HTMLButtonElement>>(attrs)
    })

    test('should have drag event handlers', () => {
      const attrs: DOMAttributes<HTMLDivElement> = {
        onDrag: (_e) => {},
        onDragEnd: (_e) => {},
        onDragEnter: (_e) => {},
        onDragExit: (_e) => {},
        onDragLeave: (_e) => {},
        onDragOver: (_e) => {},
        onDragStart: (_e) => {},
        onDrop: (_e) => {},
      }

      assertType<DOMAttributes<HTMLDivElement>>(attrs)
    })

    test('should have touch event handlers', () => {
      const attrs: DOMAttributes<HTMLDivElement> = {
        onTouchCancel: (_e) => {},
        onTouchEnd: (_e) => {},
        onTouchMove: (_e) => {},
        onTouchStart: (_e) => {},
      }

      assertType<DOMAttributes<HTMLDivElement>>(attrs)
    })

    test('should have pointer event handlers', () => {
      const attrs: DOMAttributes<HTMLDivElement> = {
        onPointerDown: (_e) => {},
        onPointerMove: (_e) => {},
        onPointerUp: (_e) => {},
        onPointerCancel: (_e) => {},
        onPointerEnter: (_e) => {},
        onPointerLeave: (_e) => {},
        onPointerOver: (_e) => {},
        onPointerOut: (_e) => {},
      }

      assertType<DOMAttributes<HTMLDivElement>>(attrs)
    })

    test('should have wheel event handler', () => {
      const attrs: DOMAttributes<HTMLDivElement> = {
        onWheel: (_e) => {},
      }

      assertType<DOMAttributes<HTMLDivElement>>(attrs)
    })

    test('should have animation event handlers', () => {
      const attrs: DOMAttributes<HTMLDivElement> = {
        onAnimationStart: (_e) => {},
        onAnimationEnd: (_e) => {},
        onAnimationIteration: (_e) => {},
      }

      assertType<DOMAttributes<HTMLDivElement>>(attrs)
    })

    test('should have transition event handler', () => {
      const attrs: DOMAttributes<HTMLDivElement> = {
        onTransitionEnd: (_e) => {},
      }

      assertType<DOMAttributes<HTMLDivElement>>(attrs)
    })
  })

  describe('CSSProperties', () => {
    test('should accept standard CSS properties', () => {
      const style: CSSProperties = {
        color: 'red',
        backgroundColor: 'blue',
        fontSize: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: '10px',
      }

      assertType<CSSProperties>(style)
    })

    test('should accept custom CSS properties', () => {
      const style: CSSProperties = {
        '--custom-color': 'red',
        '--spacing': '10px',
      }

      assertType<CSSProperties>(style)
    })

    test('should accept number values for numeric properties', () => {
      const style: CSSProperties = {
        zIndex: 100,
        opacity: 0.5,
        flexGrow: 1,
        order: 2,
      }

      assertType<CSSProperties>(style)
    })
  })

  describe('AriaAttributes', () => {
    test('should have all aria properties', () => {
      const aria: AriaAttributes = {
        'aria-activedescendant': 'element-id',
        'aria-atomic': true,
        'aria-autocomplete': 'list',
        'aria-busy': false,
        'aria-checked': 'mixed',
        'aria-colcount': 5,
        'aria-colindex': 1,
        'aria-colspan': 2,
        'aria-controls': 'controlled-id',
        'aria-current': 'page',
        'aria-describedby': 'description-id',
        'aria-details': 'details-id',
        'aria-disabled': true,
        'aria-errormessage': 'error-id',
        'aria-expanded': true,
        'aria-flowto': 'next-id',
        'aria-haspopup': 'menu',
        'aria-hidden': true,
        'aria-invalid': 'grammar',
        'aria-keyshortcuts': 'Alt+S',
        'aria-label': 'Label text',
        'aria-labelledby': 'label-id',
        'aria-level': 2,
        'aria-live': 'polite',
        'aria-modal': true,
        'aria-multiline': false,
        'aria-multiselectable': true,
        'aria-orientation': 'horizontal',
        'aria-owns': 'owned-id',
        'aria-placeholder': 'Enter value',
        'aria-posinset': 1,
        'aria-pressed': true,
        'aria-readonly': false,
        'aria-relevant': 'additions text',
        'aria-required': true,
        'aria-roledescription': 'Custom role',
        'aria-rowcount': 10,
        'aria-rowindex': 5,
        'aria-rowspan': 1,
        'aria-selected': true,
        'aria-setsize': 20,
        'aria-sort': 'ascending',
        'aria-valuemax': 100,
        'aria-valuemin': 0,
        'aria-valuenow': 50,
        'aria-valuetext': '50%',
      }

      assertType<AriaAttributes>(aria)
    })
  })

  describe('HTMLAttributes', () => {
    test('should extend AriaAttributes and DOMAttributes', () => {
      expectTypeOf<HTMLAttributes<HTMLElement>>().toMatchTypeOf<AriaAttributes>()
      expectTypeOf<HTMLAttributes<HTMLElement>>().toMatchTypeOf<DOMAttributes<HTMLElement>>()
    })

    test('should have standard HTML attributes', () => {
      const attrs: HTMLAttributes<HTMLDivElement> = {
        id: 'my-id',
        className: 'my-class',
        style: { color: 'red' },
        title: 'My Title',
        tabIndex: 0,
        hidden: true,
        lang: 'en',
        dir: 'ltr',
        draggable: true,
        contentEditable: true,
        spellCheck: false,
        translate: 'yes',
        accessKey: 's',
        slot: 'my-slot',
        role: 'button',
      }

      assertType<HTMLAttributes<HTMLDivElement>>(attrs)
    })

    test('should have input mode attribute', () => {
      const attrs: HTMLAttributes<HTMLInputElement> = {
        inputMode: 'numeric',
      }

      assertType<HTMLAttributes<HTMLInputElement>>(attrs)
    })
  })

  describe('HTMLProps', () => {
    test('should extend AllHTMLAttributes', () => {
      expectTypeOf<HTMLProps<HTMLElement>>().toMatchTypeOf<AllHTMLAttributes<HTMLElement>>()
    })
  })
})

describe('element-specific attributes', () => {
  describe('AnchorHTMLAttributes', () => {
    test('should have anchor-specific attributes', () => {
      const attrs: AnchorHTMLAttributes<HTMLAnchorElement> = {
        href: 'https://example.com',
        target: '_blank',
        rel: 'noopener noreferrer',
        download: 'file.pdf',
        hrefLang: 'en',
        media: 'print',
        ping: 'https://analytics.example.com',
        type: 'application/pdf',
        referrerPolicy: 'no-referrer',
      }

      assertType<AnchorHTMLAttributes<HTMLAnchorElement>>(attrs)
    })

    test('should extend HTMLAttributes', () => {
      expectTypeOf<AnchorHTMLAttributes<HTMLAnchorElement>>().toMatchTypeOf<HTMLAttributes<HTMLAnchorElement>>()
    })
  })

  describe('ButtonHTMLAttributes', () => {
    test('should have button-specific attributes', () => {
      const attrs: ButtonHTMLAttributes<HTMLButtonElement> = {
        type: 'submit',
        disabled: false,
        name: 'submit-btn',
        value: 'Submit',
        form: 'my-form',
        formAction: '/submit',
        formEncType: 'multipart/form-data',
        formMethod: 'post',
        formNoValidate: true,
        formTarget: '_blank',
      }

      assertType<ButtonHTMLAttributes<HTMLButtonElement>>(attrs)
    })
  })

  describe('InputHTMLAttributes', () => {
    test('should have input-specific attributes', () => {
      const attrs: InputHTMLAttributes<HTMLInputElement> = {
        type: 'text',
        name: 'username',
        value: '',
        defaultValue: 'default',
        placeholder: 'Enter username',
        disabled: false,
        readOnly: false,
        required: true,
        autoComplete: 'username',
        autoFocus: false,
        maxLength: 50,
        minLength: 3,
        pattern: '[A-Za-z]+',
        size: 20,
        list: 'datalist-id',
        multiple: false,
        accept: 'image/*',
        capture: 'environment',
        checked: false,
        defaultChecked: false,
        min: 0,
        max: 100,
        step: 1,
      }

      assertType<InputHTMLAttributes<HTMLInputElement>>(attrs)
    })
  })

  describe('TextareaHTMLAttributes', () => {
    test('should have textarea-specific attributes', () => {
      const attrs: TextareaHTMLAttributes<HTMLTextAreaElement> = {
        name: 'description',
        value: '',
        defaultValue: 'default text',
        placeholder: 'Enter description',
        disabled: false,
        readOnly: false,
        required: true,
        rows: 4,
        cols: 50,
        maxLength: 500,
        minLength: 10,
        wrap: 'soft',
        autoComplete: 'off',
        autoFocus: false,
      }

      assertType<TextareaHTMLAttributes<HTMLTextAreaElement>>(attrs)
    })
  })

  describe('SelectHTMLAttributes', () => {
    test('should have select-specific attributes', () => {
      const attrs: SelectHTMLAttributes<HTMLSelectElement> = {
        name: 'country',
        value: 'us',
        defaultValue: 'us',
        disabled: false,
        required: true,
        multiple: false,
        size: 1,
        autoComplete: 'country',
        autoFocus: false,
        form: 'my-form',
      }

      assertType<SelectHTMLAttributes<HTMLSelectElement>>(attrs)
    })
  })

  describe('SVGAttributes', () => {
    test('should have SVG-specific attributes', () => {
      const attrs: SVGAttributes<SVGElement> = {
        viewBox: '0 0 100 100',
        width: 100,
        height: 100,
        fill: 'currentColor',
        stroke: 'black',
        strokeWidth: 2,
        transform: 'rotate(45)',
        opacity: 0.8,
        className: 'icon',
      }

      assertType<SVGAttributes<SVGElement>>(attrs)
    })
  })
})

describe('IntrinsicElements', () => {
  test('should have div element', () => {
    expectTypeOf<IntrinsicElements['div']>().toMatchTypeOf<HTMLAttributes<HTMLDivElement>>()
  })

  test('should have button element', () => {
    expectTypeOf<IntrinsicElements['button']>().toMatchTypeOf<ButtonHTMLAttributes<HTMLButtonElement>>()
  })

  test('should have input element', () => {
    expectTypeOf<IntrinsicElements['input']>().toMatchTypeOf<InputHTMLAttributes<HTMLInputElement>>()
  })

  test('should have anchor element', () => {
    expectTypeOf<IntrinsicElements['a']>().toMatchTypeOf<AnchorHTMLAttributes<HTMLAnchorElement>>()
  })

  test('should have svg element', () => {
    expectTypeOf<IntrinsicElements['svg']>().toMatchTypeOf<SVGAttributes<SVGSVGElement>>()
  })
})

describe('AbstractView', () => {
  test('should have document and styleMedia properties', () => {
    expectTypeOf<AbstractView['document']>().toEqualTypeOf<Document>()
    expectTypeOf<AbstractView['styleMedia']>().toEqualTypeOf<StyleMedia>()
  })
})
