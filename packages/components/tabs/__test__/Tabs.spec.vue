<script setup lang="ts">
import { ref } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '../src'

const defaultValue = ref('1')
</script>

<template>
  <TabsRoot
    :default-value="defaultValue"
  >
    <TabsList
      aria-label="Manage your account"
    >
      <TabsTrigger
        value="1"
      >
        Account
      </TabsTrigger>
      <TabsTrigger
        value="tab2"
      >
        Password
      </TabsTrigger>
    </TabsList>
    <TabsContent
      value="1"
    >
      <p>
        Make changes to your account here. Click save when you're done.
      </p>
    </TabsContent>
    <TabsContent
      value="tab2"
    >
      <p>
        Change your password here. After saving, you'll be logged out.
      </p>
    </TabsContent>
  </TabsRoot>
</template>
