<script setup lang="ts">
import ScrollAreaStory from './components/ScrollAreaStory.vue'
import ScrollAreaCopy from './components/ScrollAreaCopy.vue'
</script>

<template>
  <Story
    title="Scroll Area/Chromatic/Horizontal"
    :layout="{ type: 'grid', width: '50%' }"
  >
    <Variant auto-props-disabled title="Horizontal (Auto with overflow)">
      <ScrollAreaStory type="auto" :vertical="false" horizontal>
        <ScrollAreaCopy v-for="i in 10" :key="i" />
      </ScrollAreaStory>
    </Variant>

    <Variant auto-props-disabled title="Horizontal (Auto without overflow)">
      <ScrollAreaStory type="auto" :vertical="false" horizontal>
        <ScrollAreaCopy class="overflow-hidden !w-[50px]" />
      </ScrollAreaStory>
    </Variant>

    <Variant auto-props-disabled title="Horizontal (Always with overflow)">
      <ScrollAreaStory type="always" :vertical="false" horizontal>
        <ScrollAreaCopy v-for="i in 10" :key="i" />
      </ScrollAreaStory>
    </Variant>

    <Variant />

    <Variant auto-props-disabled title="Horizontal (Scroll with overflow)">
      <ScrollAreaStory type="scroll" :vertical="false" horizontal>
        <ScrollAreaCopy v-for="i in 10" :key="i" />
      </ScrollAreaStory>
    </Variant>

    <Variant auto-props-disabled title="Horizontal (Scroll without overflow)">
      <ScrollAreaStory type="scroll" :vertical="false" horizontal>
        <ScrollAreaCopy class="overflow-hidden !w-[50px]" />
      </ScrollAreaStory>
    </Variant>

    <Variant auto-props-disabled title="Horizontal (Hover with overflow)">
      <ScrollAreaStory type="hover" :vertical="false" horizontal>
        <ScrollAreaCopy v-for="i in 10" :key="i" />
      </ScrollAreaStory>
    </Variant>

    <Variant auto-props-disabled title="Horizontal (Hover without overflow)">
      <ScrollAreaStory type="hover" :vertical="false" horizontal>
        <ScrollAreaCopy class="overflow-hidden !w-[50px]" />
      </ScrollAreaStory>
    </Variant>
  </Story>
</template>
