---
layout: docs
desc: unstyled component for vue.
---

# Introduction

> Destyler is a UI toolkit for building accessible web apps and design systems with [Vue](https://vuejs.org).
>
> It provides a set of low-level UI components and primitives which can be the foundation for your design system implementation.

## Features

### Accessible

Components adhere to the [WAI-ARIA design patterns](https://www.w3.org/WAI/ARIA/apg/) where possible. We handle many of the difficult implementation details related to accessibility, including aria and role attributes, focus management, and keyboard navigation. Learn more in our `accessibility` overview.

### Composable

Destyler provides granular access to each component parts, so you can wrap them and add your own event listeners, props, etc.

### Unstyled

Components are shipped with zero styles, allowing you to completely customize the look and feel. Bring your preferred styling solution (`vanilla CSS`, `Tailwind`, CSS-in-JS libraries, etc...).

### Opened

Destyler Components are designed to be customized to suit your needs. Our open component architecture provides you granular access to each component part, so you can wrap them and add your own `event listeners`, `props`, or `refs`.

### Uncontrolled

Where applicable, components are uncontrolled by default but can also be controlled, alternatively. All of the behavior wiring is handled internally, so you can get up and running as smoothly as possible, without needing to create any local states.

### Developer experience

One of our main goals is to provide the best possible developer experience. Destyler's components provides a fully-typed API. All components share a similar API, creating a consistent and predictable experience. We've also implemented an `asChild` prop, giving users full control over the rendered element.

### Incremental adoption

Each primitive can be installed individually so you can adopt them incrementally.

<CodeGroupPackage name="@destyler/button" />

Components are also versioned independently, to further facilitate incremental adoption.

## Acknowledgment

> Destyler would not have been possible without the prior art done by other meaningful projects from the frontend community including:

- Radix UI - https://github.com/radix-ui/primitives
- Radix Vue - https://github.com/radix-vue/radix-vue
- Naïve UI - https://github.com/tusen-ai/naive-ui
- Kobalte - https://github.com/kobaltedev/kobalte
- Oku UI - https://github.com/oku-ui/primitives
- Headless UI - https://github.com/tailwindlabs/headlessui
- Melt UI - https://github.com/melt-ui/melt-ui
- vueuse - https://github.com/vueuse/vueuse
- Anu - https://github.com/jd-solanki/anu
- Floating UI - https://github.com/floating-ui/floating-ui
- primevue - https://github.com/primefaces/primevue
- Shadcn UI - https://github.com/shadcn-ui/ui
- nuxt-ui - https://github.com/nuxt/ui
