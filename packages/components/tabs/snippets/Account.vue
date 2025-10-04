<script setup lang="ts">

</script>

<template>
  <div
    class="rounded-lg border border-border bg-card text-card-foreground shadow-sm"
  >
    <div class="flex flex-col space-y-1.5 p-6">
      <h3 class="text-2xl font-semibold leading-none tracking-tight text-dark dark:text-light">
        Account
      </h3>
      <p class="text-sm text-muted-foreground">
        Make changes to your account here. Click save when you're done.
      </p>
    </div>
    <div class="p-6 pt-0 space-y-2 mt-0!">
      <div class="space-y-1">
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          for="name"
        >
          Name
        </label>
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
        <label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          for="username"
        >
          Username
        </label>
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
    <div class="flex items-center p-6 pt-0 mt-0!">
      <button
        class="
            inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
            ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none
            disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2
            "
      >
        Save Changes
      </button>
    </div>
  </div>
</template>
