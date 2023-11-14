import type { PropType } from 'vue'
import { computed, createTextVNode, defineComponent, h, ref } from 'vue'
import type { Locale } from 'date-fns'
import enUS from 'date-fns/esm/locale/en-US'
import { format, formatDistanceStrict, fromUnixTime } from 'date-fns/esm'
import formatInTimeZone from 'date-fns-tz/formatInTimeZone'

export const destylerTimeProps = {
  time: {
    type: [Number, Date] as PropType<number | Date>,
    default: undefined, // For unix or non unix mode, it should be different default value
  },
  type: {
    type: String as PropType<'relative' | 'date' | 'datetime'>,
    default: 'datetime',
  },
  to: {
    type: [Number, Date] as PropType<number | Date>,
    default: undefined, // the same as `time` prop
  },
  unix: {
    type: Boolean as PropType<boolean>,
  },
  lang: {
    type: Object as PropType<Locale>,
    default: enUS,
  },
  format: {
    type: String as PropType<string>,
  },
  text: {
    type: Boolean as PropType<boolean>,
  },
  timeZone: {
    type: String as PropType<string>,
  },
}

const DestylerTime = defineComponent({
  name: 'DestylerTime',
  props: destylerTimeProps,
  setup(props) {
    const now = Date.now()
    const locale = ref({
      dateFormat: 'yyyy-MM-dd',
      dateTimeFormat: 'yyyy-MM-dd HH:mm:ss',
    })
    const dateLocale = computed(() => {
      return {
        name: 'en-US',
        locale: props.lang,
      }
    })
    const mergedFormat = computed(() => {
      const { timeZone } = props
      if (timeZone) {
        return (
          time: number | Date,
          _format: string,
          options: { locale: Locale },
        ) => {
          return formatInTimeZone(time, timeZone, _format, options)
        }
      }
      return format
    })
    const dateFnsOptions = computed(() => {
      return {
        locale: dateLocale.value.locale,
      }
    })
    const mergedTime = computed(() => {
      const { time } = props
      if (props.unix) {
        if (time === undefined)
          return now
        return fromUnixTime(typeof time === 'number' ? time : time.valueOf())
      }
      return time ?? now
    })
    const mergedTo = computed(() => {
      const { to } = props
      if (props.unix) {
        if (to === undefined)
          return now
        return fromUnixTime(typeof to === 'number' ? to : to.valueOf())
      }
      return to ?? now
    })
    const renderedTime = computed(() => {
      if (props.format) {
        return mergedFormat.value(
          mergedTime.value,
          props.format,
          dateFnsOptions.value,
        )
      }
      else if (props.type === 'date') {
        return mergedFormat.value(
          mergedTime.value,
          locale.value.dateFormat,
          dateFnsOptions.value,
        )
      }
      else if (props.type === 'datetime') {
        return mergedFormat.value(
          mergedTime.value,
          locale.value.dateTimeFormat,
          dateFnsOptions.value,
        )
      }
      else {
        return formatDistanceStrict(mergedTime.value, mergedTo.value, {
          addSuffix: true,
          locale: dateLocale.value.locale,
        })
      }
    })
    return {
      renderedTime,
    }
  },
  render() {
    return this.text
      ? createTextVNode(this.renderedTime)
      : h('time', {
        destyler: 'time',
      }, [this.renderedTime])
  },
})

export {
  DestylerTime,
}
