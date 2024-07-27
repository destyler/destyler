<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { reactive, ref } from 'vue'
import {
  NavigationContent,
  NavigationItem,
  NavigationLink,
  NavigationList,
  NavigationRoot,
  NavigationTrigger,
} from '../src'
import LinkGroup from './components/LinkGroup.vue'
import StoryFrame from './components/StoryFrame.vue'

const currentTrigger = ref('destyler-2')
const state = reactive({
  delayDuration: 600,
  skipDelayDuration: 1000,
})
</script>

<template>
  <Story title="Navigation/Default">
    <Variant title="Default">
      <StoryFrame>
        <NavigationRoot
          v-model="currentTrigger"
          :delay-duration="state.delayDuration"
          :skip-delay-duration="state.skipDelayDuration"
          class="relative z-[1] flex w-full justify-center"
        >
          <NavigationList
            class="center m-0 flex list-none rounded-[6px] bg-white p-1"
          >
            <NavigationItem>
              <NavigationTrigger
                class="text-grass11 hover:bg-green3 focus:shadow-green7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
              >
                Products
                <Icon
                  name="radix-icons:caret-down"
                  class="text-green10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                  aria-hidden
                />
              </NavigationTrigger>

              <NavigationContent
                class="absolute top-10 left-0 bg-white rounded-xl w-full sm:w-auto"
              >
                <LinkGroup
                  :items="[
                    'Fusce pellentesque',
                    'Aliquam porttitor',
                    'Pellentesque',
                    'Fusce pellentesque',
                    'Aliquam porttitor',
                    'Pellentesque',
                  ]"
                />
              </NavigationContent>
            </NavigationItem>

            <NavigationItem>
              <NavigationTrigger
                class="text-grass11 hover:bg-green3 focus:shadow-green7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
              >
                Company
                <Icon
                  name="radix-icons:caret-down"
                  class="text-green10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                  aria-hidden
                />
              </NavigationTrigger>
              <NavigationContent
                class="absolute top-10 left-0 bg-white rounded-xl w-full sm:w-auto"
              >
                <LinkGroup
                  :items="[
                    'Fusce pellentesque',
                    'Aliquam porttitor',
                    'Pellentesque',
                  ]"
                />
              </NavigationContent>
            </NavigationItem>

            <NavigationItem>
              <NavigationTrigger
                class="text-grass11 hover:bg-green3 focus:shadow-green7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
              >
                Developers
                <Icon
                  name="radix-icons:caret-down"
                  class="text-green10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                  aria-hidden
                />
              </NavigationTrigger>
              <NavigationContent
                class="absolute top-10 left-0 bg-white rounded-xl w-full sm:w-auto"
              >
                <LinkGroup :items="['Aliquam porttitor', 'Pellentesque']" />
              </NavigationContent>
            </NavigationItem>

            <NavigationItem>
              <NavigationLink
                class="text-grass11 hover:bg-green3 focus:shadow-green7 block select-none rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none no-underline outline-none focus:shadow-[0_0_0_2px]"
                href="https://github.com/radix-ui"
              >
                Link
              </NavigationLink>
            </NavigationItem>
          </NavigationList>
        </NavigationRoot>
      </StoryFrame>

      <template #controls>
        <HstNumber v-model="state.delayDuration" title="Delay Duration" />
        <HstNumber
          v-model="state.skipDelayDuration"
          title="Skip Delay Duration"
        />
      </template>
    </Variant>
  </Story>
</template>
