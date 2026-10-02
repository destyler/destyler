# Native form diagnostics: validation only, do not merge

This temporary test-only branch keeps production source at baseline `346dfee0a6c2c243900ffcabf0648a1d58b6f4a6` and runs correct-behavior assertions in real Chromium. Baseline failures are expected and remain visible; no `skip`, `fails`, or weakened wrong-behavior expectations are used.

The cases distinguish:

- Bare native platform controls for reset ordering/cancellation, fieldset successful values, first-legend exemption and Event trust
- Component accepted-state versus native checkedness/form values, with uncontrolled and synchronous controlled-acceptance controls
- Checkbox indeterminate initialization, synthetic-click feedback and reset callbacks/defaults
- Shared reset cancellation and ancestor-fieldset tracking

`HTMLInputElement.click()` exercises native activation in the browser; these cases do not claim trusted pointer or keyboard input, adapter rendering, layout, or assistive-technology coverage. Form controls are mounted through their real machine/connector input handlers. The file lives outside a workspace package to avoid counting pnpm alias discoveries as unique cases.

The DOM emulator fails some bare-platform sentinels, so emulated results alone are not native evidence. The Chromium run is the purpose of this draft. Existing press-lifecycle fixes in PR #158 are separate and are not duplicated here.

Keep this validation draft open until cleanup is explicitly authorized. Do not merge it or treat expected baseline-red CI as a production-fix failure or readiness signal. No production code, dependencies, lockfiles, release versions, or repository test configuration changes are included.
