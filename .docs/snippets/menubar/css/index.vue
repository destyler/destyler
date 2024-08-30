<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { CheckboxIndicator, CheckboxRoot } from '@destyler/checkbox'
import { Label } from '@destyler/label'
import './style.css'
</script>

<template>
  <div class="box">
    <CheckboxRoot class="checkboxRoot">
      <CheckboxIndicator class="checkboxIndicator">
        <Icon name="carbon:checkmark" class="icon" />
      </CheckboxIndicator>
    </CheckboxRoot>
    <Label class="label">
      Accept terms and conditions
    </Label>
  </div>
</template>
