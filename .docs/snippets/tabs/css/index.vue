<script setup lang="ts">
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@destyler/tabs'
import { Label } from '@destyler/label'
import { Button } from '@destyler/button'
</script>

<template>
  <TabsRoot
    default-value="account"
    class="tabs-root"
  >
    <TabsList
      class="tabs-list"
    >
      <TabsIndicator
        class="tabs-indicator"
      />
      <TabsTrigger
        class="tabs-trigger"
        value="account"
      >
        Account
      </TabsTrigger>
      <TabsTrigger
        class="tabs-trigger"
        value="password"
      >
        Password
      </TabsTrigger>
    </TabsList>
    <TabsContent
      class="tabs-content"
      value="account"
    >
      <div
        class="card"
      >
        <div class="heading">
          <h3 class="title">
            Account
          </h3>
          <p class="subtitle">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
        <div class="item-box">
          <div class="space-y-1">
            <Label
              class="label"
              for="name"
            >
              Name
            </Label>
            <input
              id="name"
              class="input"
              value="Elone Hoo"
            >
          </div>
          <div class="space-y-1">
            <Label
              class="label"
              for="username"
            >
              Username
            </Label>
            <input
              id="name"
              class="input"
              value="@elonehoo"
            >
          </div>
        </div>
        <div class="action">
          <Button
            class="button"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </TabsContent>
    <TabsContent
      class="tabs-content"
      value="password"
    >
      <div class="card">
        <div class="heading">
          <h3 class="title">
            Password
          </h3>
          <p class="subtitle">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
        <div class="item-box">
          <div class="space-y-1">
            <Label
              class="label"
              for="current-password"
            >
              Current password
            </Label>
            <input
              id="name"
              class="input"
            >
          </div>
          <div class="space-y-1">
            <Label
              class="label"
              for="new-password"
            >
              New password
            </Label>
            <input
              id="name"
              class="input"
            >
          </div>
        </div>
        <div class="action">
          <Button
            class="button"
          >
            Save Password
          </Button>
        </div>
      </div>
    </TabsContent>
  </TabsRoot>
</template>
