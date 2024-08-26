// @noErrors
<script setup lang="ts">
import {
  HoverCardContent,
  HoverCardPortal,
  HoverCardRoot,
  HoverCardTrigger,
} from '@destyler/hover-card'
import { Icon } from '@destyler/icon'
import { Image, ImageFallback, ImageRoot } from '@destyler/image'
import './style.css'
</script>

<template>
  <HoverCardRoot>
    <HoverCardTrigger
      as="button"
      class="hover-card-trigger"
    >
      destyler ui
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        class="hover-card-content"
      >
        <div class="box">
          <ImageRoot class="image-root{">
            <Image
              class="image"
              src="https://github.com/destyler.png"
            />
            <ImageFallback class="image-fall-back">
              D
            </ImageFallback>
          </ImageRoot>
          <div class="space-y-1">
            <h4 class="h4">
              @destyler
            </h4>
            <p class="p">
              The Vue UI Framework – created and Build UI by @destyler.
            </p>
            <div class="footer">
              <Icon name="lucide-calendar-days" class="icon" />
              <span class="time">
                Joined June 2023
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
