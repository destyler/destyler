import { createNormalizer } from '@destyler/types'
import { toStyleString } from './utils/style'

export interface AttrMap {
  [key: string]: string
}

export const propMap: AttrMap = {
  onFocus: 'onFocusin',
  onBlur: 'onFocusout',
  onChange: 'onInput',
  onDoubleClick: 'onDblclick',
  htmlFor: 'for',
  className: 'class',
}

const preserveCaseKeys = new Set(['defaultValue', 'defaultChecked'])

export const normalizeProps = createNormalizer((props: any) => {
  return Object.entries(props).reduce<any>((acc, [key, value]) => {
    if (value === undefined)
      return acc

    if (key in propMap)
      key = propMap[key]

    if (key === 'style' && typeof value === 'object') {
      acc.style = toStyleString(value)
      return acc
    }

    if (preserveCaseKeys.has(key)) {
      acc[key] = value
      return acc
    }

    acc[key.toLowerCase()] = value

    return acc
  }, {})
})
