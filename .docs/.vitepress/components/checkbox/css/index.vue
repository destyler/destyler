<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { CheckboxIndicator, CheckboxRoot } from '@destyler/checkbox'
import './styles.css'
</script>

<template>
  <div class="box">
    <CheckboxRoot class="checkboxRoot">
      <CheckboxIndicator class="checkboxIndicator">
        <Icon name="carbon:checkmark" class="icon" />
      </CheckboxIndicator>
    </CheckboxRoot>
    <label class="label">
      Accept terms and conditions
    </label>
  </div>
</template>
