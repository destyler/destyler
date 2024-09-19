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
    w="400px"
  >
    <TabsList
      h="10"
      items="center"
      justify="center"
      rounded="md"
      bg="muted"
      p="1"
      text="muted-foreground"
      grid="~ cols-2"
      w="full"
    >
      <TabsIndicator
        z="1"
        absolute="~"
        left="0"
        h="8"
        m="y-1"
        bg="background"
        w="[--destyler-tabs-indicator-size]"
        translate="x-[--destyler-tabs-indicator-position]"
        rounded="md"
        transition="width,transform"
        duration="300"
      />
      <TabsTrigger
        inline="flex"
        items="center"
        justify="center"
        whitespace="nowrap"
        rounded="sm"
        p="x-3 y-1.5"
        text="sm data-[state=active]:foreground"
        font="medium"
        ring-offset="background"
        transition="all"
        focus-visible="outline-none ring-2 ring-ring ring-offset-2"
        pointer-events="disabled:none"
        op="disabled:50"
        z="10"
        shadow="data-[state=active]:sm"
        value="account"
      >
        Account
      </TabsTrigger>
      <TabsTrigger
        inline="flex"
        items="center"
        justify="center"
        whitespace="nowrap"
        rounded="sm"
        p="x-3 y-1.5"
        text="sm data-[state=active]:foreground"
        font="medium"
        ring-offset="background"
        transition="all"
        focus-visible="outline-none ring-2 ring-ring ring-offset-2"
        pointer-events="disabled:none"
        op="disabled:50"
        z="10"
        shadow="data-[state=active]:sm"
        value="password"
      >
        Password
      </TabsTrigger>
    </TabsList>
    <TabsContent
      m="t-2"
      ring-offset="background"
      focus-visible="outline-none ring-2 ring-ring ring-offset-2"
      text="dark dark:light"
      value="account"
    >
      <div
        rounded="lg"
        border="~"
        bg="card"
        text="card-foreground"
        shadow="sm"
      >
        <div
          flex="~ col"
          space="y-1.5"
          p="6"
        >
          <h3
            text="2xl dark dark:light"
            font="semibold"
            leading="none"
            tracking="tight"
          >
            Account
          </h3>
          <p text="sm muted-foreground">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
        <div p="6 t-0" space="y-2">
          <div space="y-1">
            <Label
              text="sm"
              font="medium"
              leading="none"
              cursor="peer-disabled:not-allowed"
              op="peer-disabled:70"
              for="name"
            >
              Name
            </Label>
            <input
              id="name"
              flex="~"
              h="10"
              w="full"
              rounded="md"
              border="~ input file:0"
              bg="background file:transparent"
              p="x-3 y-2"
              text="sm file:sm placeholder:muted-foreground"
              ring-offset="background"
              font="file:medium"
              focus-visible="outline-none ring-2 ring-ring ring-offset-2"
              cursor="disabled:not-allowed"
              op="disabled:50"
              value="Elone Hoo"
            >
          </div>
          <div space="y-1">
            <Label
              text="sm"
              font="medium"
              leading="none"
              cursor="peer-disabled:not-allowed"
              op="peer-disabled:70"
              for="username"
            >
              Username
            </Label>
            <input
              id="username"
              flex="~"
              h="10"
              w="full"
              rounded="md"
              border="~ input file:0"
              bg="background file:transparent"
              p="x-3 y-2"
              text="sm file:sm placeholder:muted-foreground"
              ring-offset="background"
              font="file:medium"
              focus-visible="outline-none ring-2 ring-ring ring-offset-2"
              cursor="disabled:not-allowed"
              op="disabled:50"
              value="@elonehoo"
            >
          </div>
        </div>
        <div flex="~" items="center" p="6 t-0">
          <Button
            inline="flex"
            items="center"
            justify="center"
            whitespace="nowrap"
            rounded="md"
            text="sm primary-foreground"
            font="medium"
            ring-offset="background"
            transition="colors"
            focus-visible="outline-none ring-2 ring-ring ring-offset-2"
            pointer-events="disabled:pointer-events-none"
            op="disabled:50"
            bg="primary hover:primary/90"
            h="10"
            p="x-4 y-2"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </TabsContent>
    <TabsContent
      m="t-2"
      ring-offset="background"
      focus-visible="outline-none ring-2 ring-ring ring-offset-2"
      text="dark dark:light"
      value="password"
    >
      <div
        rounded="lg"
        border="~"
        bg="card"
        text="card-foreground"
        shadow="sm"
      >
        <div
          flex="~ col"
          space="y-1.5"
          p="6"
        >
          <h3
            text="2xl dark dark:light"
            font="semibold"
            leading="none"
            tracking="tight"
          >
            Password
          </h3>
          <p
            text="sm muted-foreground"
          >
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
        <div
          p="6 t-0"
          space="y-2"
        >
          <div
            space="y-1"
          >
            <Label
              text="sm"
              font="medium"
              leading="none"
              cursor="peer-disabled:not-allowed"
              op="peer-disabled:70"
              for="current-password"
            >
              Current password
            </Label>
            <input
              id="name"
              flex="~"
              h="10"
              w="full"
              rounded="md"
              border="~ input file:0"
              bg="background file:transparent"
              p="x-3 y-2"
              text="sm file:sm placeholder:muted-foreground"
              ring-offset="background"
              font="file:medium"
              focus-visible="outline-none ring-2 ring-ring ring-offset-2"
              cursor="disabled:not-allowed"
              op="disabled:50"
            >
          </div>
          <div space="y-1">
            <Label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="new-password"
            >
              New password
            </Label>
            <input
              id="name"
              flex="~"
              h="10"
              w="full"
              rounded="md"
              border="~ input file:0"
              bg="background file:transparent"
              p="x-3 y-2"
              text="sm file:sm placeholder:muted-foreground"
              ring-offset="background"
              font="file:medium"
              focus-visible="outline-none ring-2 ring-ring ring-offset-2"
              cursor="disabled:not-allowed"
              op="disabled:50"
            >
          </div>
        </div>
        <div
          flex="~"
          items="center"
          p="6 t-0"
        >
          <Button
            inline="flex"
            items="center"
            justify="center"
            whitespace="nowrap"
            rounded="md"
            text="sm primary-foreground"
            font="medium"
            ring-offset="background"
            transition="colors"
            focus-visible="outline-none ring-2 ring-ring ring-offset-2"
            pointer-events="disabled:pointer-events-none"
            op="disabled:50"
            bg="primary hover:primary/90"
            h="10"
            p="x-4 y-2"
          >
            Save Password
          </Button>
        </div>
      </div>
    </TabsContent>
  </TabsRoot>
</template>
