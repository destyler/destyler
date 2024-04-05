<script setup lang="ts">
import Box from './components/Box.vue'
import CraftBox from './components/CraftBox.vue'
import AspectRatioDemo from '@destyler/demo/aspectRadio/demos/AspectRadio.unocss.demo.vue'
import BackTopDemo from '@destyler/demo/backTop/demos/BackTop.demo.vue'
import BreadcrumbsDemo from '@destyler/demo/breadcrumbs/demos/Breadcrumbs.demo.vue'
import ButtonDemo from '@destyler/demo/button/demos/Button.demo.vue'
import CheckboxDemo from '@destyler/demo/checkbox/demos/Checkbox.demo.vue'
import CollapseDemo from '@destyler/demo/collapse/demos/Collapse.demo.vue'
</script>

<template>
  <Box>
    <CraftBox>
      <AspectRatioDemo />
    </CraftBox>
    <CraftBox>
      <BackTopDemo />
    </CraftBox>
    <CraftBox>
      <BreadcrumbsDemo />
    </CraftBox>
    <CraftBox>
      <ButtonDemo />
    </CraftBox>
    <CraftBox >
      <CheckboxDemo />
    </CraftBox>
    <CraftBox>
      <CollapseDemo />
    </CraftBox>
  </Box>
</template>
