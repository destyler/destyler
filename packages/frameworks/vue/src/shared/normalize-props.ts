import type * as Vue from 'vue'
import { createNormalizer } from '@destyler/types'

interface ReservedProps {
  key?: string | number | symbol
  ref?: NonNullable<Vue.VNodeProps['ref']>
}

type Attrs<T> = T & ReservedProps

export type PropTypes = Vue.NativeElements & {
  element: Attrs<Vue.HTMLAttributes>
  style: Vue.CSSProperties
}

type Dict = Record<string, string>

function toCase(txt: string) {
  return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
}

const propMap: Record<string, string> = {
  htmlFor: 'for',
  className: 'class',
  onDoubleClick: 'onDblclick',
  onChange: 'onInput',
  onFocus: 'onFocusin',
  onBlur: 'onFocusout',
  defaultValue: 'value',
  defaultChecked: 'checked',
}

// SVG attributes are case-sensitive. Map the React-style aliases accepted by
// @destyler/types to native SVG names without changing HTML normalization.
const svgAttributeMap = new Map(
  (`accent-height alignment-baseline arabic-form attributeName attributeType baseFrequency baseline-shift
baseProfile calcMode cap-height clipPathUnits clip-path clip-rule color-interpolation
color-interpolation-filters color-profile color-rendering contentScriptType contentStyleType diffuseConstant
dominant-baseline edgeMode enable-background fill-opacity fill-rule filterRes filterUnits flood-color
flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight
glyph-name glyph-orientation-horizontal glyph-orientation-vertical glyphRef gradientTransform gradientUnits
horiz-adv-x horiz-origin-x image-rendering kernelMatrix kernelUnitLength keyPoints keySplines keyTimes
lengthAdjust letter-spacing lighting-color limitingConeAngle marker-end marker-mid marker-start markerHeight
markerUnits markerWidth maskContentUnits maskUnits numOctaves overline-position overline-thickness panose-1
paint-order pathLength patternContentUnits patternTransform patternUnits pointer-events pointsAtX pointsAtY
pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits refX refY rendering-intent repeatCount repeatDur
requiredExtensions requiredFeatures shape-rendering specularConstant specularExponent spreadMethod startOffset
stdDeviation stitchTiles stop-color stop-opacity strikethrough-position strikethrough-thickness
stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity
stroke-width surfaceScale systemLanguage tableValues targetX targetY text-anchor text-decoration
text-rendering textLength underline-position underline-thickness unicode-bidi unicode-range units-per-em
v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y
viewBox viewTarget word-spacing writing-mode x-height xChannelSelector xlink:actuate xlink:arcrole xlink:href
xlink:role xlink:show xlink:title xlink:type xmlns:xlink xml:base xml:lang xml:space yChannelSelector
zoomAndPan allowReorder autoReverse externalResourcesRequired`)
    .split(/\s+/)
    .map(attribute => [attribute.replace(/[-:]([a-z0-9])/g, (_, char: string) => char.toUpperCase()), attribute]),
)

function toVueProp(prop: string) {
  if (prop in propMap)
    return propMap[prop]

  if (prop.startsWith('on')) {
    return `on${toCase(prop.substr(2))}`
  }

  return svgAttributeMap.get(prop) ?? prop.toLowerCase()
}

export const normalizeProps = createNormalizer<PropTypes>((props: Dict) => {
  const normalized: Dict = {}
  for (const key in props) {
    const value = props[key]
    if (key === 'children') {
      if (typeof value === 'string' || typeof value === 'number')
        normalized.textContent = String(value)
    }
    else {
      normalized[toVueProp(key)] = props[key]
    }
  }
  return normalized
})
