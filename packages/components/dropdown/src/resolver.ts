import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const dropdownComponentName = [
  'DropdownArrow',
  'DropdownCheckboxItem',
  'DropdownContent',
  'DropdownGroup',
  'DropdownItem',
  'DropdownItemIndicator',
  'DropdownLabel',
  'DropdownPortal',
  'DropdownRadioGroup',
  'DropdownRadioItem',
  'DropdownRoot',
  'DropdownSeparator',
  'DropdownSub',
  'DropdownSubContent',
  'DropdownSubTrigger',
  'DropdownTrigger',
]

export function DropdownResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (dropdownComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
