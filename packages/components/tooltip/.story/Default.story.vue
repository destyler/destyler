<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { ref } from 'vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from '../src'

const toggleState = ref(false)
const disableTooltip = ref(false)
</script>

<template>
  <Story title="Tooltip/Default" :layout="{ type: 'single', iframe: true }">
    <Variant title="default">
      <div class="py-20">
        <TooltipProvider :disabled="disableTooltip">
          <TooltipRoot v-model:open="toggleState">
            <TooltipTrigger
              class="text-green11 shadow-blackA7 hover:bg-green3 inline-flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
            >
              <Icon name="radix-icons:plus" />
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                :side-offset="5"
                class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-green11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
              >
                Add to library
                <TooltipArrow class="fill-white" />
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </TooltipProvider>
      </div>
    </Variant>
  </Story>
</template>
