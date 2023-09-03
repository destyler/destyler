import { DestylerAccordionResolver } from './resolver'
import DestylerAccordionRoot from './AccordionRoot.vue'
import DestylerAccordionItem from './AccordionItem.vue'
import { selected, useAccordionSelected } from './composition'
import destylerAccordionPresets from './presets'

export * from './props'

export {
  selected,
  DestylerAccordionRoot,
  DestylerAccordionItem,
  DestylerAccordionResolver,
  useAccordionSelected,
  destylerAccordionPresets,
}
