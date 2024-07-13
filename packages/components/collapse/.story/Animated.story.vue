<script setup lang="ts">
import { ref } from 'vue'
import { CollapseContent, CollapseHeader, CollapseItem, CollapseRoot, CollapseTrigger } from '../src'

const hasDynamicContent = ref('')

const values = ['One', 'Two', 'Three', 'Four']
const count = ref(1)

const selectedValue = ref(['One', 'Two', 'Three', 'Four'])
</script>

<template>
  <Story
    title="Collapse/Animated"
    :layout="{ type: 'grid', width: '50%' }"
  >
    <Variant title="close by default">
      <template #controls>
        modelValue: <input v-model="hasDynamicContent">
      </template>
      <div class="flex min-h-[350px] w-full justify-center p-10 items-center">
        <CollapseRoot
          class="w-[300px] rounded-md bg-[--line-color] shadow-lg"
          type="single"
        >
          <CollapseItem
            v-for="value in values"
            :key="value"
            class="collapse-item"
            :value="value"
          >
            <CollapseHeader class="flex">
              <CollapseTrigger class="collapse-trigger">
                {{ value }}
              </CollapseTrigger>
            </CollapseHeader>
            <CollapseContent
              v-for="i in count"
              :key="i"
              class="collapse-animated-content data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp"
            >
              <div class="px-5 py-4">
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

    <Variant title="open by default">
      <template #controls>
        modelValue: <input v-model="hasDynamicContent" type="checkbox">
      </template>

      <CollapseRoot
        class="w-[300px] rounded-md bg-[--line-color] shadow-lg"
        type="single"
        default-value="One"
      >
        <CollapseItem
          v-for="value in values"
          :key="value"
          class="collapse-item"
          :value="value"
        >
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              {{ value }}
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent
            v-for="i in count"
            :key="i"
            class="collapse-animated-content data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp"
          >
            <div class="px-5 py-4">
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
    </Variant>

    <Variant title="animated 2D">
      <CollapseRoot
        class="w-[300px] rounded-md bg-[--line-color] shadow-lg"
        type="single"
      >
        <CollapseItem
          v-for="value in values"
          :key="value"
          class="collapse-item"
          :value="value"
        >
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              {{ value }}
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent
            class="collapse-animated-content overflow-hidden data-[state=open]:animate-open2D data-[state=closed]:animate-close2D"
          >
            <div class="px-5 py-4 overflow-hidden">
              <div :style="{ width: 'calc(20em - 20px)', height: 100 }">
                It was the best of times, it was the worst of times, it was the age of wisdom,
                it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity,
                it was the season of Light, it was the season of Darkness, it was the spring of hope,
                it was the winter of despair, we had everything before us, we had nothing before us,
                we were all going direct to Heaven, we were all going direct the other way – in short,
                the period was so far like the present period,
                that some of its noisiest authorities insisted on its being received,
                for good or for evil, in the superlative degree of comparison only.
              </div>
            </div>
          </CollapseContent>
        </CollapseItem>
      </CollapseRoot>
    </Variant>

    <Variant title="animated controlled">
      <CollapseRoot
        v-model="selectedValue"
        class="w-[300px] rounded-md bg-[--line-color] shadow-lg"
      >
        <CollapseItem class="collapse-item" value="One">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              one
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent
            class="collapse-animated-content data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp"
          >
            <div class="px-5 py-4">
              Yes. It adheres to the WAI-ARIA design pattern.
            </div>
          </CollapseContent>
        </CollapseItem>

        <CollapseItem class="collapse-item" value="Two">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Two
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent
            class="collapse-animated-content data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp"
          >
            <div class="px-5 py-4">
              Yes. It's unstyled by default, giving you freedom over the look
              and feel.
            </div>
          </CollapseContent>
        </CollapseItem>

        <CollapseItem class="collapse-item" value="Three">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Three
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent
            class="collapse-animated-content data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp"
          >
            <div class="px-5 py-4">
              Yes! You can use the transition prop to configure the animation.
            </div>
          </CollapseContent>
        </CollapseItem>

        <CollapseItem class="collapse-item" value="Four">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Four
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent
            class="collapse-animated-content data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp"
          >
            <div class="px-5 py-4">
              Yes! You can use the transition prop to configure the animation.
            </div>
          </CollapseContent>
        </CollapseItem>
      </CollapseRoot>
    </Variant>
  </Story>
</template>
