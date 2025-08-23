---
description: AI rules derived by SpecStory from the project AI interaction history
globs: *
---

## HEADERS

## TECH STACK

## PROJECT DOCUMENTATION & CONTEXT SYSTEM

## FILE STRUCTURE

## CODING STYLE

### General

- ES2015 module syntax is preferred over namespaces. When converting from namespace syntax, directly export interfaces and types using modern ES2015 module syntax.

### Typescript

- When defining event interfaces in TypeScript, avoid naming conflicts with native DOM event interfaces. Add a `Synthetic` prefix to custom event interfaces (e.g., `SyntheticClipboardEvent`).
- When extending `HTMLAttributes` in TypeScript, ensure that `onChange` definitions are consistent. Remove `onChange` from `DOMAttributes` and allow specific HTML element interfaces to define their own `onChange` types to avoid type conflicts.

## TESTING

### General Testing Rules
- Write comprehensive tests that cover normal cases, boundary cases, and error cases.
- When tests fail, analyze the source code and test results to identify the root cause of the failure.
- Ensure test cases align with the actual implementation behavior to improve reliability and accuracy.

### Color Library Testing
- Ensure comprehensive parsing tests covering all supported color formats.
- Ensure accurate format conversion tests to validate conversions between different color spaces.
- Test color channel operations, including incrementing, decrementing, and range calculations.
- Verify the formatting of color values in formatting and localization tests.
- Ensure color comparison and copying functions work correctly in equality and cloning tests.
- Test color axis calculation and gradient generation.
- Handle transparency, hue wrapping, and error conditions in boundary case tests.
- Verify the consistency of the same color across different formats.
- When comparing colors of different formats, convert them to the same format before comparison to avoid precision issues.
- When testing for thrown errors, ensure that the tested code actually throws an error and that the error message matches the expected message.

### Date Assertion Testing

- When writing tests for date utility functions:
    - Cover normal cases, boundary cases, and error cases for each function.
    - Test boundary conditions such as minimum and maximum date constraints.
    - Verify that the tests cover different duration configurations (days, weeks, months, years).
    - Ensure that tests cover focus date adjustment functionality.
    - Validate row and section navigation functionalities.
- When testing date ranges, use the `minValue` and `maxValue` to test `isPreviousVisibleRangeInvalid` and `isNextVisibleRangeInvalid` functions. If the `startDate` is equal to `minValue`, `isPreviousVisibleRangeInvalid` should return `true`. Similarly, if the `endDate` is equal to `maxValue`, `isNextVisibleRangeInvalid` should return `true`.

## DEBUGGING

## WORKFLOW & RELEASE RULES

## VANILLA JS GUIDELINES

### General
- When converting Vue components and hooks to Vanilla JS:
    - Convert Vue components to Vanilla JS functions that return DOM elements.
    - Convert Vue hooks to Vanilla JS functions that manage state and provide functionality.
    - Ensure that the converted components and hooks do not depend on Vue or any other framework.
    - Use native DOM APIs to create and manipulate DOM elements.
    - Use plain JavaScript objects and arrays to manage state.
    - Use callbacks to handle events and state changes.

### Controls Component
- When creating the Vanilla JS Controls component:
    - Create a function that takes a control object as input and returns a DOM element.
    - Iterate over the keys in the control configuration and create a DOM element for each control.
    - Use appropriate DOM elements for each control type (e.g., checkbox for boolean, input for string and number, select for select).
    - Attach event listeners to the DOM elements to update the control state when the user interacts with them.
    - Implement a subscribe mechanism to update the DOM when the control state changes.
    - Ensure that the subscribe mechanism only registers once to prevent infinite loops.
    - In the subscribe callback, only update the control contents and avoid recursive calls to the Controls function.

### Carousel Component Integration
- When integrating the Vanilla JS Controls component with a Carousel component:
    - Listen for changes in the control state using the `control.subscribe` method.
    - When the control state changes, update the Carousel component's options or re-initialize the Carousel component.
    - If the Carousel component does not have an `updateOptions` method, implement one or re-initialize the Carousel component.

### Toolbar Component
- When converting the Toolbar component, remove the navigation buttons and switching logic, and render both the controls and visualizer slots simultaneously.

## STYLE GUIDELINES

- When migrating CSS from SFC (Single File Component) format to native CSS, ensure that the CSS is structured in a component-based manner. This means encapsulating the styles specific to each component within its own CSS file or style block, mimicking the modularity of SFCs.
- When converting from UnoCSS to native CSS, create semantic component-specific CSS classes, and consider using CSS custom properties for theming.

## CODE REVIEW GUIDELINES

## NAMING CONVENTIONS

- When synchronizing components across different frameworks (e.g., React, Solid, Svelte, and Vue), Vue serves as the standard. Ensure that elements and their structure in other frameworks align with the Vue component's structure. All class names, auxiliary elements, and structure must match the Vue SFC. Portal/Teleport logic should be determined using the `portalled` property. The Vue SFC file should not be modified.
