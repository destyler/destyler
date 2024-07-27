<script setup lang="ts">
import {
  CollapseContent,
  CollapseHeader,
  CollapseItem,
  CollapseRoot,
  CollapseTrigger,
} from '../'
</script>

<template>
  <Story
    title="Collapse/Viewport"
    :layout="{ type: 'grid', width: '50%' }"
    auto-props-disabled
  >
    <Variant title="OutsideViewport">
      <p>Scroll down to see tabs</p>
      <div :style="{ height: '150vh' }" />
      <p>
        When collapse buttons are focused and the user is navigating via
        keyboard, the page should not scroll unless the next tab is entering the
        viewport.
      </p>
      <CollapseRoot type="single">
        <CollapseItem class="collapse-item" value="one">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              One
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
        <CollapseItem class="collapse-item" value="two">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Two
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
        <CollapseItem class="collapse-item" value="three" disabled>
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Three (disabled)
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
        <CollapseItem class="collapse-item" value="four">
          <CollapseHeader class="flex">
            <CollapseTrigger class="collapse-trigger">
              Four
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
      <div :style="{ height: '150vh' }" />
    </Variant>
  </Story>
</template>
