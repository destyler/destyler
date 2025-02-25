import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { MachineApi, Send, State } from './types'
import { dataAttr } from '@zag-js/dom-query'
import { parts } from './anatomy'
import { dom } from './dom'

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>): MachineApi<T> {
  const copied = state.matches('copied')

  return {
    copied,
    value: state.context.value,
    setValue(value) {
      send({ type: 'VALUE.SET', value })
    },
    copy() {
      send({ type: 'COPY' })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'data-copied': dataAttr(copied),
        'id': dom.getRootId(state.context),
      })
    },

    getLabelProps() {
      return normalize.label({
        ...parts.label.attrs,
        'htmlFor': dom.getInputId(state.context),
        'data-copied': dataAttr(copied),
        'id': dom.getLabelId(state.context),
      })
    },

    getControlProps() {
      return normalize.element({
        ...parts.control.attrs,
        'data-copied': dataAttr(copied),
      })
    },

    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'defaultValue': state.context.value,
        'data-copied': dataAttr(copied),
        'readOnly': true,
        'data-readonly': 'true',
        'id': dom.getInputId(state.context),
        onFocus(event) {
          event.currentTarget.select()
        },
        onCopy() {
          send({ type: 'INPUT.COPY' })
        },
      })
    },

    getTriggerProps() {
      return normalize.button({
        ...parts.trigger.attrs,
        'type': 'button',
        'aria-label': copied ? 'Copied to clipboard' : 'Copy to clipboard',
        'data-copied': dataAttr(copied),
        onClick() {
          send({ type: 'COPY' })
        },
      })
    },

    getIndicatorProps(props) {
      return normalize.element({
        ...parts.indicator.attrs,
        hidden: props.copied !== copied,
      })
    },
  }
}
