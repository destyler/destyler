<script setup lang="ts">
import { ref } from 'vue'
import { CollapseContent, CollapseHeader, CollapseItem, CollapseRoot, CollapseTrigger } from '../src'

const hasDynamicContent = ref('')

const values = ['One', 'Two', 'Three', 'Four']
const count = ref(1)
</script>

<template>
  <Story
    title="Collapse/Default"
    :layout="{ type: 'grid', width: '50%' }"
  >
    <Variant title="unstyle">
      <template #controls>
        modelValue: <input v-model="hasDynamicContent">
      </template>
      <div class="flex min-h-[350px] w-full justify-center p-10 items-center">
        <CollapseRoot
          type="single"
        >
          <CollapseItem
            v-for="value in values"
            :key="value"
            :value="value"
          >
            <CollapseHeader>
              <CollapseTrigger>
                {{ value }}
              </CollapseTrigger>
            </CollapseHeader>
            <CollapseContent
              v-for="i in count"
              :key="i"
            >
              <div>
                It was the best of times, it was the worst of times, it was the age of wisdom,
                it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity,
                it was the season of Light, it was the season of Darkness, it was the spring of hope,
                it was the winter of despair, we had everything before us, we had nothing before us,
                we were all going direct to Heaven, we were all going direct the other way – in short,
                the period was so far like the present period,
                that some of its noisiest authorities insisted on its being received,
                for good or for evil, in the superlative degree of comparison only.
              </div>
            </CollapseContent>
          </CollapseItem>
        </CollapseRoot>
      </div>
    </Variant>
  </Story>
</template>
