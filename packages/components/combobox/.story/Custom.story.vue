<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxLabel, ComboboxRoot, ComboboxTrigger, ComboboxViewport } from '../src'

const links = [
  {
    href: 'https://twitter.com/',
    children: 'Twitter',
    target: '_blank',
  },
  {
    href: 'https://www.github.com/destyler',
    children: 'GitHub',
    target: '_blank',
  },
  {
    href: 'https://www.instagram.com/',
    children: 'Instagram',
    target: '_blank',
  },
  { href: 'https://elonehoo.me', children: 'Elone Hoo' },
]
</script>

<template>
  <Story title="Combobox/Custom" :layout="{ type: 'grid', width: '50%' }">
    <Variant title="custom">
      <ComboboxRoot>
        <ComboboxAnchor class="min-w-[160px] inline-flex items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-grass11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-grass9 outline-none">
          <ComboboxInput auto-focus class="bg-transparent outline-none text-grass11 placeholder-gray-400" placeholder="Where to go?" />
          <ComboboxTrigger>
            <Icon name="radix-icons:chevron-down" class="h-4 w-4 text-grass11" />
          </ComboboxTrigger>
        </ComboboxAnchor>
        <ComboboxContent class="mt-2 min-w-[160px] bg-white overflow-hidden rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
          <ComboboxViewport class="p-[5px]">
            <ComboboxEmpty class="text-gray-400  text-xs font-medium text-center py-2" />

            <ComboboxGroup>
              <ComboboxLabel class="px-[25px] text-xs leading-[25px] text-mauve11">
                Links
              </ComboboxLabel>

              <ComboboxItem
                v-for="(option, index) in links" :key="index"
                class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-grass9 data-[highlighted]:text-grass1"
                :value="option.children"
                as-child
              >
                <a :href="option.href" target="_blank">
                  <ComboboxItemIndicator
                    class="absolute left-0 w-[25px] inline-flex items-center justify-center"
                  >
                    <Icon name="radix-icons:check" />
                  </ComboboxItemIndicator>
                  <span>
                    {{ option.children }}
                  </span>
                </a>
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxRoot>
    </Variant>
  </Story>
</template>
