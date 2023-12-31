<script setup lang="ts">
import { DestylerCollapse } from '@destyler/collapse/src/collapse'
import { DestylerCollapseItem } from '@destyler/collapse/src/collapseItem'
</script>

<template>
  <DestylerCollapse :accordion="true">
    <DestylerCollapseItem title="Is it accessible?">
      Yes. It adheres to the WAI-ARIA design pattern.
    </DestylerCollapseItem>
    <DestylerCollapseItem title="Is it styled?">
      Yes. It comes with default styles that matches the other components' aesthetic.
    </DestylerCollapseItem>
    <DestylerCollapseItem title="Is it animated?">
      Yes. It's animated by default, but you can disable it if you prefer.
    </DestylerCollapseItem>
  </DestylerCollapse>
</template>

<style>
[destyler="collapse"]{
  width: 80%;
}
[destyler="collapse-item"]{
  border-bottom-width: 1px;
  border-color: #e4e4e7;
}
.dark [destyler="collapse-item"]{
  border-color: #2d2d30;
}
[destyler="collapse-item-header"]{
  display: flex;
  flex: 1 1 0%;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: .875rem;
  line-height: 1.25rem;
  font-weight: 500;
  cursor: pointer;
}
[destyler="collapse-item-header"]:hover{
  text-decoration-line: underline;
}
</style>
