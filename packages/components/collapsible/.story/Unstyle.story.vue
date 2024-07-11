<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '../src'

const rootOpen = ref(false)
const rootDisabled = ref(false)
</script>

<template>
  <Story title="Collapsible/Unstyle">
    <Variant title="unstyle">
      <CollapsibleRoot
        v-model:open="rootOpen"
        :disabled="rootDisabled"
      >
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <span>
            The best framework
          </span>
          <CollapsibleTrigger>
            <Icon
              v-if="rootOpen"
              name="radix-icons:cross-2"
            />
            <Icon v-else name="radix-icons:row-spacing" />
          </CollapsibleTrigger>
        </div>

        <div>
          <span>destyler</span>
        </div>

        <CollapsibleContent>
          <div>
            <span>vue</span>
          </div>
          <div>
            <span>nuxt</span>
          </div>
        </CollapsibleContent>
      </CollapsibleRoot>
    </Variant>
  </Story>
</template>
