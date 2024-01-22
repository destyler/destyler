import type { Component, PropType, VNodeChild } from 'vue'
import { defineComponent, h, mergeProps, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'

export interface CountdownTimeInfo {
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export interface CountdownInst {
  reset: () => void
}

export const destylerCountdownProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'template',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  duration: {
    type: Number as PropType<number>,
    default: 0,
  },
  active: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  precision: {
    type: Number as PropType<0 | 1 | 2 | 3>,
    default: 0,
  },
  render: {
    type: Function as PropType<(props: CountdownTimeInfo) => VNodeChild>,
  },
  onFinish: {
    type: Function as PropType<() => void>,
  },
}

const DestylerCountdown = defineComponent({
  name: 'DestylerCountdown',
  inheritAttrs: false,
  props: destylerCountdownProps,
  setup(props) {
    let timerId: number | null = null
    let elapsed = 0
    let finished = false

    // in ms
    const distanceRef = ref<number>(0)
    watchEffect(() => {
      distanceRef.value = props.duration
    })

    let pnow = -1

    function getDistance(time: DOMHighResTimeStamp): number {
      return props.duration - elapsed + pnow - time
    }
    function getTimeInfo(distance: number): CountdownTimeInfo {
      const hours = Math.floor(distance / 3600000)
      const minutes = Math.floor((distance % 3600000) / 60000)
      const seconds = Math.floor((distance % 60000) / 1000)
      const milliseconds = Math.floor(distance % 1000)
      return {
        hours,
        minutes,
        seconds,
        milliseconds,
      }
    }
    function getDisplayValue(info: CountdownTimeInfo): string {
      const { hours, minutes, seconds, milliseconds } = info
      const { precision } = props
      switch (precision) {
        case 0:
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        default:
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(Math.floor(milliseconds / (precision === 1 ? 100 : precision === 2 ? 10 : 1))).padStart(precision, '0')}`
      }
    }
    const stopTimer = (): void => {
      if (timerId !== null) {
        window.clearTimeout(timerId)
        timerId = null
      }
    }
    const frame = (): void => {
      const { precision } = props
      const distance = getDistance(performance.now())
      if (distance <= 0) {
        distanceRef.value = 0
        stopTimer()
        if (!finished) {
          finished = true
          props.onFinish?.()
        }
        return
      }
      let leftTime: number
      switch (precision) {
        case 3:
        case 2:
          // about 30 fps
          leftTime = distance % 34
          break
        case 1:
          leftTime = distance % 100
          break
        default:
          leftTime = distance % 1000
      }
      distanceRef.value = distance
      timerId = window.setTimeout(() => {
        frame()
      }, leftTime)
    }
    onMounted(() => {
      watchEffect(() => {
        if (props.active) {
          pnow = performance.now()
          frame()
        }
        else {
          const now = performance.now()
          if (pnow !== -1)
            elapsed += now - pnow

          stopTimer()
        }
      })
    })
    onBeforeUnmount(() => {
      stopTimer()
    })

    function reset(): void {
      distanceRef.value = props.duration
      elapsed = 0
      pnow = performance.now()
      if (props.active && finished)
        frame()

      finished = false
    }

    const countdownExposedMethod: CountdownInst = {
      reset,
    }
    return Object.assign(countdownExposedMethod, {
      distance: distanceRef,
      getTimeInfo,
      getDisplayValue,
    })
  },
  render() {
    let timeInfo: CountdownTimeInfo
    switch (this.$props.precision) {
      case 0:
        timeInfo = this.getTimeInfo(this.distance + 999)
        timeInfo.milliseconds = 0
        break
      case 1:
        timeInfo = this.getTimeInfo(this.distance + 99)
        timeInfo.milliseconds = Math.floor(timeInfo.milliseconds / 100) * 100
        break
      case 2:
        timeInfo = this.getTimeInfo(this.distance + 9)
        timeInfo.milliseconds = Math.floor(timeInfo.milliseconds / 10) * 10
        break
      case 3:
        timeInfo = this.getTimeInfo(this.distance)
    }
    return h(DestylerPrimitive, mergeProps(this.$attrs, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }), [
      this.render ? this.render(timeInfo) : this.getDisplayValue(timeInfo),
    ])
  },
})

export {
  DestylerCountdown,
}
