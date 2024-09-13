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

### Incremental adoption

Each primitive can be installed individually so you can adopt them incrementally.

<CodeGroupPackage name="@destyler/button" />

## Components

A collection of components that can be used to build your own design system.

## Acknowledgment

> Destyler would not have been possible without the prior art done by other meaningful projects from the frontend community including:
