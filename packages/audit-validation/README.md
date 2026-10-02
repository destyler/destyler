# Native form diagnostics: validation only, do not merge

This temporary test-only branch keeps production source at baseline `346dfee0a6c2c243900ffcabf0648a1d58b6f4a6` and runs correct-behavior assertions in real Chromium. Baseline failures are expected and remain visible; no `skip`, `fails`, or weakened wrong-behavior expectations are used.

The cases distinguish:

- Bare native platform controls for reset ordering/cancellation, fieldset successful values, first-legend exemption and Event trust
- Component accepted-state versus native checkedness/form values, with uncontrolled and synchronous controlled-acceptance controls
- Checkbox indeterminate initialization, synthetic-click feedback and reset callbacks/defaults
- Shared reset cancellation and ancestor-fieldset tracking

`HTMLInputElement.click()` exercises native activation for the component cases; those cases do not claim trusted pointer or keyboard input, adapter rendering, layout, or assistive-technology coverage. The separate reset-button ordering/cancellation probes use the real-browser locator click and assert that the button click is trusted. They distinguish scripted reset dispatch from native event-loop microtask checkpoints; no component-wide trusted-input claim is added. Form controls are mounted through their real machine/connector input handlers. The file lives outside a workspace package to avoid counting pnpm alias discoveries as unique cases.

The DOM emulator fails some bare-platform sentinels, so emulated results alone are not native evidence. The Chromium run is the purpose of this draft. Existing press-lifecycle fixes in PR #158 are separate and are not duplicated here.

Keep this validation draft open until cleanup is explicitly authorized. Do not merge it or treat expected baseline-red CI as a production-fix failure or readiness signal. No production code, dependencies, lockfiles, release versions, or repository test configuration changes are included.

The expanded fixture has 30 canonical cases. Its first 26 were verified at commit `5d68e0049a4d781316b68055547b93830cde6ae1`: 12 expected baseline library failures and 14 passes on Node 20/22/24 in Chromium. Four later reset-button/order probes require their own exact-head native evidence; their results must not be inferred from the earlier run.
