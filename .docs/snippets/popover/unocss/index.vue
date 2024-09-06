<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import { Label } from '@destyler/label'
import {
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '@destyler/popover'

const forms = ref([
  {
    label: 'Width',
    value: '100%',
  },
  {
    label: 'Max. width',
    value: '100px',
  },
  {
    label: 'Height',
    value: '25px',
  },
  {
    label: 'Max. height',
    value: 'none',
  },
])
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger
      inline="flex"
      items="center"
      justify="center"
      whitespace="nowrap"
      rounded="md"
      text="sm primary-foreground"
      font="medium"
      transition="colors"
      shadow="sm"
      h="9"
      p="x-4 y-2"
      focus-visible="outline-none ring-1"
      bg="primary hover:primary/90"
      op="disabled:50"
      pointer-events="disabled:none"
    >
      Open popover
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="5"
        z="50"
        w="80"
        rounded="md"
        border=" ~ border"
        bg="popover"
        p="4"
        text="popover-foreground"
        shadow="md"
        outline="none"
        class="
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95
        data-[state=open]:zoom-in-95
        data-[side=bottom]:slide-in-from-top-2
        data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2
        data-[side=top]:slide-in-from-bottom-2
        "
      >
        <div
          grid="~"
          gap="4"
        >
          <div
            space="y-2"
          >
            <h4
              font="medium"
              leading="none"
            >
              Dimensions
            </h4>
            <p
              text="sm muted-foreground"
            >
              Set the dimensions for the layer.
            </p>
          </div>
          <div
            grid="~"
            gap="2"
          >
            <div
              v-for="form in forms"
              :key="form.label"
              grid="~ cols-3"
              items="center"
              gap="4"
            >
              <Label
                for="width"
                text="sm black dark:white"
                font="medium"
                leading="none"
                cursor="peer-disabled:not-allowed"
                op="peer-disabled:70"
              >
                {{ form.label }}
              </Label>
              <input
                v-model="form.value"
                flex="~"
                col-span="2"
                h="8"
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
        </div>
        <PopoverClose
          inline="flex"
          items="center"
          justify="center"
          whitespace="nowrap"
          rounded="full"
          text="sm hover:accent-foreground"
          font="medium"
          transition="colors"
          outline="focus-visible:none"
          ring="focus-visible:1 focus-visible:ring"
          pointer-events="disabled:none"
          op="disabled:50"
          border="~ input"
          bg="background hover:accent"
          shadow="md"
          h="25px"
          w="25px"
          cursor="pointer"
          absolute="~"
          top="10px"
          right="10px"
        >
          <Icon name="carbon:close-large" />
        </PopoverClose>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
