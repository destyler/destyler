<script setup lang="ts">
import { DestylerAlert } from '@destyler/alert/src/alert'
</script>

<template>
  <DestylerAlert title="Heads up!">
    You can add components to your app using the cli.
  </DestylerAlert>
</template>

<style>
[destyler="alert"]{
  position: relative;
  width: 80%;
  border-radius: 0.5rem;
  border-width: 1px;
  font-size: 0.875rem;
  line-height: 1.25rem;
  background-color: #ffffff;
  color: #09090b;
  border-color: #e4e4e7;
}
.dark [destyler="alert"]{
  background-color: #09090b;
  color: #fafafa;
  border-color: #1c1c1f;
}
[destyler="alert-body"]{
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
[destyler="alert-body-title"]{
  letter-spacing: -.025em;
  line-height: 1;
  margin-bottom: 0.25rem;
  font-weight: 500;
}
[destyler="alert-body-content"]{
  font-size: .875rem;
  line-height: 1.25rem;
}
</style>
