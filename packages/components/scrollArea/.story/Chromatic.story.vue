<script setup lang="ts">
import ScrollAreaStory from './components/ScrollAreaStory.vue'
import ScrollAreaCopy from './components/ScrollAreaCopy.vue'
</script>

<template>
  <Story title="Scroll Area/Chromatic" :layout="{ type: 'grid', width: '50%' }">
    <Variant auto-props-disabled title="Min thumb size">
      <ScrollAreaStory type="always" vertical horizontal>
        <ScrollAreaCopy v-for="i in 100" :key="i" style="width: 10000px" />
      </ScrollAreaStory>
    </Variant>

    <Variant auto-props-disabled title="RTL (prop)">
      <ScrollAreaStory type="always" dir="rtl" vertical horizontal>
        <ScrollAreaCopy v-for="i in 10" :key="i" />
      </ScrollAreaStory>
    </Variant>

    <Variant auto-props-disabled title="RTL (inherited)">
      <ScrollAreaStory type="always" vertical horizontal>
        <ScrollAreaCopy v-for="i in 10" :key="i" />
      </ScrollAreaStory>
    </Variant>
    <Variant title="Ellipsis at viewport width">
      <ScrollAreaStory
        type="always"
        vertical
        :horizontal="false"
      >
        <ScrollAreaCopy
          v-for="i in 10"
          :key="i"
          class="w-full truncate"
        />
      </ScrollAreaStory>
    </Variant>

    <Variant title="Ellipsis at content width">
      <ScrollAreaStory
        type="always"
        vertical
        :horizontal="true"
      >
        <ScrollAreaCopy
          v-for="i in 10"
          :key="i"
          class="!w-[125px] truncate"
        />
      </ScrollAreaStory>
    </Variant>
  </Story>
</template>
