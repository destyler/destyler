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
    class="w-400px"
  >
    <TabsList
      class="
      h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-2
      "
    >
      <TabsIndicator
        class="
        z-1 absolute left-0 h-8 my-1 bg-background
        w-[--destyler-tabs-indicator-size]
        translate-x-[--destyler-tabs-indicator-position]
        rounded-md transition-[width,transform] duration-300
        "
      />
      <TabsTrigger
        class="
        inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5
        text-sm font-medium ring-offset-background transition-all focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50 z-10
        data-[state=active]:text-foreground data-[state=active]:shadow-sm
        "
        value="account"
      >
        Account
      </TabsTrigger>
      <TabsTrigger
        class="
        inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5
        text-sm font-medium ring-offset-background transition-all focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 z-10
        data-[state=active]:text-foreground data-[state=active]:shadow-sm
        "
        value="password"
      >
        Password
      </TabsTrigger>
    </TabsList>
    <TabsContent
      class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-dark dark:text-light"
      value="account"
    >
      <div
        class="rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="text-2xl font-semibold leading-none tracking-tight text-dark dark:text-light">
            Account
          </h3>
          <p class="text-sm text-muted-foreground">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
        <div class="p-6 pt-0 space-y-2">
          <div class="space-y-1">
            <Label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="name"
            >
              Name
            </Label>
            <input
              id="name"
              class="
              flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
              ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
              placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed
              disabled:opacity-50
              "
              value="Elone Hoo"
            >
          </div>
          <div class="space-y-1">
            <Label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="username"
            >
              Username
            </Label>
            <input
              id="name"
              class="
              flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
              ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
              placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed
              disabled:opacity-50
              "
              value="@elonehoo"
            >
          </div>
        </div>
        <div class="flex items-center p-6 pt-0">
          <Button
            class="
            inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
            ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none
            disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2
            "
          >
            Save Changes
          </Button>
        </div>
      </div>
    </TabsContent>
    <TabsContent
      class="
      mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-ring focus-visible:ring-offset-2 text-dark dark:text-light
      "
      value="password"
    >
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="text-2xl font-semibold leading-none tracking-tight text-dark dark:text-light">
            Password
          </h3>
          <p class="text-sm text-muted-foreground">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
        <div class="p-6 pt-0 space-y-2">
          <div class="space-y-1">
            <Label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="current-password"
            >
              Current password
            </Label>
            <input
              id="name"
              class="
              flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
              ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
              placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed
              disabled:opacity-50
              "
            >
          </div>
          <div class="space-y-1">
            <Label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="new-password"
            >
              New password
            </Label>
            <input
              id="name"
              class="
              flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
              ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
              placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed
              disabled:opacity-50
              "
            >
          </div>
        </div>
        <div class="flex items-center p-6 pt-0">
          <Button
            class="
            inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
            ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none
            disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2
            "
          >
            Save Password
          </Button>
        </div>
      </div>
    </TabsContent>
  </TabsRoot>
</template>
