import type { EventKeyMap, NormalizeProps, PropTypes } from '@destyler/types'
import type { ContentProps, MachineApi, Send, State, TriggerProps } from './types'
import { dataAttr, getEventKey } from '@destyler/dom'
import { parts } from './anatomy'
import { dom } from './dom'

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>): MachineApi<T> {
  const open = state.hasTag('open')
  const value = state.context.value
  const previousValue = state.context.previousValue
  const orientation = state.context.orientation
  const isHorizontal = state.context.isHorizontal

  function getMotionAttribute(contentValue: string): 'from-start' | 'from-end' | 'to-start' | 'to-end' | undefined {
    const triggers = dom.getTriggerEls(state.context)
    if (triggers.length < 2)
      return undefined

    const values = triggers.map(el => el.getAttribute('data-value')).filter(Boolean) as string[]
    const currentIndex = values.indexOf(contentValue)
    const prevIndex = previousValue ? values.indexOf(previousValue) : -1

    if (value === contentValue) {
      // Content is opening
      if (prevIndex === -1)
        return 'from-start'
      return prevIndex < currentIndex ? 'from-end' : 'from-start'
    }
    else if (previousValue === contentValue) {
      // Content is closing
      const nextIndex = value ? values.indexOf(value) : -1
      if (nextIndex === -1)
        return 'to-start'
      return currentIndex < nextIndex ? 'to-start' : 'to-end'
    }

    return undefined
  }

  function getTriggerState(props: TriggerProps) {
    return {
      open: value === props.value,
      disabled: !!props.disabled,
    }
  }

  function getContentState(props: ContentProps) {
    const isOpen = value === props.value
    return {
      open: isOpen,
      motion: getMotionAttribute(props.value),
    }
  }

  return {
    value,
    previousValue,
    open,
    setValue(nextValue) {
      send({ type: 'VALUE.SET', value: nextValue })
    },
    getTriggerState,
    getContentState,

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(state.context),
        'dir': state.context.dir,
        'data-orientation': orientation,
      })
    },

    getListProps() {
      return normalize.element({
        ...parts.list.attrs,
        'id': dom.getListId(state.context),
        'dir': state.context.dir,
        'role': 'menubar',
        'data-orientation': orientation,
        onKeyDown(event) {
          if (event.defaultPrevented)
            return

          const target = event.currentTarget as HTMLElement
          const triggerId = target.querySelector('[data-part="trigger"]:focus')?.id

          const keyMap: EventKeyMap = {
            ArrowRight() {
              if (!isHorizontal)
                return
              send({ type: 'ARROW_NEXT', id: triggerId })
            },
            ArrowLeft() {
              if (!isHorizontal)
                return
              send({ type: 'ARROW_PREV', id: triggerId })
            },
            ArrowDown() {
              if (isHorizontal)
                return
              send({ type: 'ARROW_NEXT', id: triggerId })
            },
            ArrowUp() {
              if (isHorizontal)
                return
              send({ type: 'ARROW_PREV', id: triggerId })
            },
            Home() {
              send({ type: 'HOME' })
            },
            End() {
              send({ type: 'END' })
            },
          }

          const key = getEventKey(event, state.context)
          const exec = keyMap[key]

          if (exec) {
            exec(event)
            event.preventDefault()
          }
        },
      })
    },

    getItemProps(props) {
      const { value: itemValue } = props
      const isOpen = value === itemValue

      return normalize.element({
        ...parts.item.attrs,
        'id': dom.getItemId(state.context, itemValue),
        'dir': state.context.dir,
        'data-state': isOpen ? 'open' : 'closed',
        'data-value': itemValue,
      })
    },

    getTriggerProps(props) {
      const { value: triggerValue, disabled } = props
      const triggerState = getTriggerState(props)
      const contentId = dom.getContentId(state.context, triggerValue)

      return normalize.button({
        ...parts.trigger.attrs,
        'id': dom.getTriggerId(state.context, triggerValue),
        'type': 'button',
        'dir': state.context.dir,
        'disabled': disabled || undefined,
        'data-disabled': dataAttr(disabled),
        'data-state': triggerState.open ? 'open' : 'closed',
        'data-value': triggerValue,
        'aria-expanded': triggerState.open,
        'aria-controls': contentId,
        onPointerEnter(event) {
          if (event.pointerType !== 'mouse')
            return
          if (disabled)
            return
          send({ type: 'TRIGGER_ENTER', value: triggerValue })
        },
        onPointerLeave(event) {
          if (event.pointerType !== 'mouse')
            return
          if (disabled)
            return
          send({ type: 'TRIGGER_LEAVE', value: triggerValue })
        },
        onClick(event) {
          if (event.defaultPrevented)
            return
          if (disabled)
            return
          send({ type: 'TRIGGER_CLICK', value: triggerValue })
        },
        onKeyDown(event) {
          if (event.defaultPrevented)
            return
          if (disabled)
            return

          const keyMap: EventKeyMap = {
            Enter() {
              send({ type: 'TRIGGER_CLICK', value: triggerValue })
            },
            Space() {
              send({ type: 'TRIGGER_CLICK', value: triggerValue })
            },
            ArrowDown() {
              if (isHorizontal) {
                send({ type: 'TRIGGER_CLICK', value: triggerValue })
              }
            },
            ArrowUp() {
              if (!isHorizontal) {
                send({ type: 'TRIGGER_CLICK', value: triggerValue })
              }
            },
          }

          const key = getEventKey(event, state.context)
          const exec = keyMap[key]

          if (exec) {
            exec(event)
            event.preventDefault()
          }
        },
      })
    },

    getContentProps(props) {
      const { value: contentValue } = props
      const contentState = getContentState(props)

      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(state.context, contentValue),
        'dir': state.context.dir,
        'hidden': !contentState.open,
        'data-state': contentState.open ? 'open' : 'closed',
        'data-motion': contentState.motion,
        'data-value': contentValue,
        'data-orientation': orientation,
        onPointerEnter(event) {
          if (event.pointerType !== 'mouse')
            return
          send({ type: 'CONTENT_ENTER', value: contentValue })
        },
        onPointerLeave(event) {
          if (event.pointerType !== 'mouse')
            return
          send({ type: 'CONTENT_LEAVE', value: contentValue })
        },
      })
    },

    getLinkProps(props) {
      const { value: linkValue, active, onSelect } = props

      return normalize.element({
        ...parts.link.attrs,
        'id': dom.getLinkId(state.context, linkValue),
        'dir': state.context.dir,
        'data-active': dataAttr(active),
        'aria-current': active ? 'page' : undefined,
        onClick(event) {
          if (event.defaultPrevented)
            return
          onSelect?.()
          send({ type: 'CLOSE' })
        },
        onKeyDown(event) {
          if (event.defaultPrevented)
            return
          if (event.key === 'Enter' || event.key === ' ') {
            onSelect?.()
            send({ type: 'CLOSE' })
            event.preventDefault()
          }
        },
      })
    },

    getIndicatorProps() {
      return normalize.element({
        ...parts.indicator.attrs,
        'id': dom.getIndicatorId(state.context),
        'dir': state.context.dir,
        'data-state': open ? 'open' : 'closed',
        'data-orientation': orientation,
      })
    },

    getViewportPositionerProps() {
      return normalize.element({
        ...parts.viewportPositioner.attrs,
        'id': dom.getViewportPositionerId(state.context),
        'dir': state.context.dir,
        'data-state': open ? 'open' : 'closed',
        'data-orientation': orientation,
      })
    },

    getViewportProps() {
      return normalize.element({
        ...parts.viewport.attrs,
        'id': dom.getViewportId(state.context),
        'dir': state.context.dir,
        'data-state': open ? 'open' : 'closed',
        'data-orientation': orientation,
        onPointerEnter(event) {
          if (event.pointerType !== 'mouse')
            return
          send({ type: 'VIEWPORT_ENTER' })
        },
        onPointerLeave(event) {
          if (event.pointerType !== 'mouse')
            return
          send({ type: 'VIEWPORT_LEAVE' })
        },
      })
    },

    getArrowProps() {
      return normalize.element({
        ...parts.arrow.attrs,
        'dir': state.context.dir,
        'data-state': open ? 'open' : 'closed',
        'data-orientation': orientation,
      })
    },
  }
}
