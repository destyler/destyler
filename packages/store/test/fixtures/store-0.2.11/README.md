# Store 0.2.11 compatibility fixture

These three files are unchanged copies of `packages/store/src/{proxy,global,utils}.ts` from commit `346dfee0a6c2c243900ffcabf0648a1d58b6f4a6`. They retain the legacy module-local clocks and shared registry protocol so tests can exercise a baseline and an updated store loaded in the same realm. Do not modernize this fixture while changing production code.
