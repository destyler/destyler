<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { ref } from 'vue'
import {
  NavigationContent,
  NavigationIndicator,
  NavigationItem,
  NavigationLink,
  NavigationList,
  NavigationRoot,
  NavigationSub,
  NavigationTrigger,
  NavigationViewport,
} from '../src'
import LinkGroup from './components/LinkGroup.vue'
import StoryFrame from './components/StoryFrame.vue'

const currentTrigger = ref('')
</script>

<template>
  <Story title="Navigation/Submenus">
    <Variant title="Default">
      <StoryFrame>
        <NavigationRoot
          v-model="currentTrigger"
          class="relative z-[1] flex w-full justify-center"
        >
          <NavigationList
            class="center shadow-blackA7 m-0 flex list-none rounded-[6px] bg-white p-1 shadow-[0_2px_10px]"
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
                class="absolute top-0 left-0 bg-white rounded-xl w-full sm:w-auto"
              >
                <NavigationSub
                  default-value="extensibility"
                  class="w-full grid max-w-[800px] gap-4 justify-center"
                >
                  <NavigationList
                    class="center shadow-blackA7 m-0 flex list-none rounded-[6px] bg-white p-1 shadow-[0_2px_10px]"
                  >
                    <NavigationItem value="extensibility">
                      <NavigationTrigger
                        class="text-grass11 hover:bg-green3 focus:shadow-green7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                      >
                        Extensibility
                        <Icon
                          name="radix-icons:caret-down"
                          class="text-green10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                          aria-hidden
                        />
                      </NavigationTrigger>

                      <NavigationContent
                        class="absolute top-10 contents left-0 bg-white rounded-xl w-full sm:w-auto"
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

                    <NavigationItem value="security">
                      <NavigationTrigger
                        class="text-grass11 hover:bg-green3 focus:shadow-green7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                      >
                        Security
                        <Icon
                          name="radix-icons:caret-down"
                          class="text-green10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                          aria-hidden
                        />
                      </NavigationTrigger>
                      <NavigationContent
                        class="absolute top-10 contents left-0 bg-white rounded-xl w-full sm:w-auto"
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

                    <NavigationItem value="authentication">
                      <NavigationTrigger
                        class="text-grass11 hover:bg-green3 focus:shadow-green7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                      >
                        Authentication
                        <Icon
                          name="radix-icons:caret-down"
                          class="text-green10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                          aria-hidden
                        />
                      </NavigationTrigger>
                      <NavigationContent
                        class="absolute top-10 contents left-0 bg-white rounded-xl w-full sm:w-auto"
                      >
                        <LinkGroup
                          :items="['Aliquam porttitor', 'Pellentesque']"
                        />
                      </NavigationContent>
                    </NavigationItem>

                    <NavigationIndicator
                      class="data-[state=hidden]:opacity-0 duration-200 data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[all,transform_250ms_ease]"
                    >
                      <div
                        class="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-white"
                      />
                    </NavigationIndicator>
                  </NavigationList>

                  <NavigationViewport class="w-full" />
                </NavigationSub>
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
                class="absolute top-0 left-0 bg-white rounded-xl w-full sm:w-auto"
              >
                <NavigationSub
                  default-value="customers"
                  orientation="vertical"
                  class="w-full grid max-w-[800px] gap-4"
                  :style="{ 'grid-template-columns': '0.3fr 1fr' }"
                >
                  <NavigationList
                    class="center shadow-blackA7 m-0 flex flex-col h-full list-none rounded-[6px] bg-white p-1 shadow-[0_2px_10px]"
                  >
                    <NavigationItem value="customers">
                      <NavigationTrigger
                        class="text-grass11 hover:bg-green3 focus:shadow-green7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                      >
                        Customers
                        <Icon
                          name="radix-icons:caret-down"
                          class="text-green10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                          aria-hidden
                        />
                      </NavigationTrigger>

                      <NavigationContent
                        class="absolute top-10 contents left-0 bg-white rounded-xl w-full sm:w-auto"
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

                    <NavigationItem value="security">
                      <NavigationTrigger
                        class="text-grass11 hover:bg-green3 focus:shadow-green7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                      >
                        Security
                        <Icon
                          name="radix-icons:caret-down"
                          class="text-green10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                          aria-hidden
                        />
                      </NavigationTrigger>
                      <NavigationContent
                        class="absolute top-10 contents left-0 bg-white rounded-xl w-full sm:w-auto"
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

                    <NavigationItem value="authentication">
                      <NavigationTrigger
                        class="text-grass11 hover:bg-green3 focus:shadow-green7 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2 text-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                      >
                        Authentication
                        <Icon
                          name="radix-icons:caret-down"
                          class="text-green10 relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                          aria-hidden
                        />
                      </NavigationTrigger>
                      <NavigationContent
                        class="absolute top-10 contents left-0 bg-white rounded-xl w-full sm:w-auto"
                      >
                        <LinkGroup
                          :items="['Aliquam porttitor', 'Pellentesque']"
                        />
                      </NavigationContent>
                    </NavigationItem>

                    <NavigationIndicator
                      class="data-[state=hidden]:opacity-0 duration-200 data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[all,transform_250ms_ease]"
                    >
                      <div
                        class="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-white"
                      />
                    </NavigationIndicator>
                  </NavigationList>

                  <NavigationViewport class="w-full" />
                </NavigationSub>
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

            <NavigationIndicator
              class="data-[state=hidden]:opacity-0 duration-200 data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full z-[1] flex h-[10px] items-end justify-center overflow-hidden transition-[all,transform_250ms_ease]"
            >
              <div
                class="relative top-[70%] h-[10px] w-[10px] rotate-[45deg] rounded-tl-[2px] bg-white"
              />
            </NavigationIndicator>
          </NavigationList>

          <NavigationViewport
            class="absolute top-full border-t origin-[top_center] mt-[10px] w-[var(--destyler-navigation-menu-viewport-width)] bg-white h-[var(--destyler-navigation-menu-viewport-height)] transition-[height] overflow-hidden shadow-xl"
          />
        </NavigationRoot>
      </StoryFrame>
    </Variant>
  </Story>
</template>
