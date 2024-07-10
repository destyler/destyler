<script setup lang="ts">
import { ref } from 'vue'
import { CollapseContent, CollapseHeader, CollapseItem, CollapseRoot, CollapseTrigger } from '../src'

const selectedValue = ref('item-2')
</script>

<template>
  <Story title="Collapse/Single">
    <Variant title="uncontrolled">
      <CollapseRoot
        v-model="selectedValue"
        type="single"
        class="w-[300px] rounded-md bg-[--line-color] shadow-lg"
      >
        <CollapseItem class="collapse-item" value="item-1">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Is it accessible?
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent class="collapse-content">
            Yes. It adheres to the WAI-ARIA design pattern.
          </CollapseContent>
        </CollapseItem>

        <CollapseItem class="collapse-item" value="item-2">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Is it unstyled?
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent class="collapse-content">
            Yes. It's unstyled by default, giving you freedom over the look and
            feel.
          </CollapseContent>
        </CollapseItem>

        <CollapseItem class="collapse-item" value="item-3">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Can it be animated?
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent class="collapse-content">
            Yes! You can use the transition prop to configure the animation.
          </CollapseContent>
        </CollapseItem>
      </CollapseRoot>
    </Variant>
  </Story>
</template>
