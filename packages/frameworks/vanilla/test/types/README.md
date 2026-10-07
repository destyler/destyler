# Vanilla public declaration consumer

The root `test:types` command compiles this consumer in strict Bundler and NodeNext
modes after package build. It imports the public `@destyler/vanilla` and
`@destyler/xstate` entrypoints, resolving their emitted declarations rather than
relative source files. `skipLibCheck` is deliberately false.

The subclass separates user context from machine context and inspects the inherited
protected `onTransition` parameter. Positive checks require the internal machine
context, state and event types. Negative checks reject wrong internal-property
types, unknown fields and unsupported events, so replacing the declaration with
`any` cannot make the test pass.

This is a built-package declaration contract within the pnpm workspace. It does
not by itself establish tarball file inclusion or JavaScript runtime behavior.
