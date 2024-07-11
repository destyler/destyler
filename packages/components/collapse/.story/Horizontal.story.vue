<script setup lang="ts">
import {
  CollapseContent,
  CollapseHeader,
  CollapseItem,
  CollapseRoot,
  CollapseTrigger,
} from '../src'
</script>

<template>
  <Story
    title="Collapse/Horizontal"
    auto-props-disabled
  >
    <Variant title="horizontal orientation">
      <CollapseRoot
        class="w-[300px] rounded-md bg-[--line-color] shadow-lg"
        type="single"
        orientation="horizontal"
      >
        <CollapseItem class="collapse-item" value="item-1">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Item 1
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent class="collapse-content">
            It was the best of times, it was the worst of times, it was the age of wisdom,
            it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity,
            it was the season of Light, it was the season of Darkness, it was the spring of hope,
            it was the winter of despair, we had everything before us, we had nothing before us,
            we were all going direct to Heaven, we were all going direct the other way – in short,
            the period was so far like the present period,
            that some of its noisiest authorities insisted on its being received,
            for good or for evil, in the superlative degree of comparison only.
          </CollapseContent>
        </CollapseItem>

        <CollapseItem class="collapse-item" value="item-2">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Item 2
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent class="collapse-content">
            It was the best of <a href="#">times</a>, it was the worst of times, it was the age of wisdom,
            it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity,
            it was the season of Light, it was the season of Darkness, it was the spring of hope,
            it was the winter of despair, we had everything before us, we had nothing before us,
            we were all going direct to Heaven, we were all going direct the other way – in short,
            the period was so far like the present period,
            that some of its noisiest authorities insisted on its being received,
            for good or for evil, in the superlative degree of comparison <button>only</button>.
          </CollapseContent>
        </CollapseItem>

        <CollapseItem class="collapse-item" value="item-3" disabled>
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Item 3 (disabled)
            </CollapseTrigger>
          </CollapseHeader>
          <CollapseContent class="collapse-content">
            It was the best of <a href="#">times</a>, it was the worst of times, it was the age of wisdom,
            it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity,
            it was the season of Light, it was the season of Darkness, it was the spring of hope,
            it was the winter of despair, we had everything before us, we had nothing before us,
            we were all going direct to Heaven, we were all going direct the other way – in short,
            the period was so far like the present period,
            that some of its noisiest authorities insisted on its being received,
            for good or for evil, in the superlative degree of comparison <button>only</button>.
          </CollapseContent>
        </CollapseItem>
      </CollapseRoot>
    </Variant>
  </Story>
</template>
