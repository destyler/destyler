# Diagnostic only: do not merge

This comparison contains exact baseline OTP Input source snapshots and a provisional combined experimental snapshot. Production source remains unchanged in the diagnostic PR. It measures separate proposals; it is not an implementation-ready bundled fix.

Baseline commit and byte hashes are recorded in snapshots.json. The candidate changes only accepted-DOM restoration, event-index routing and bounded deferred-work ownership. Those three proposals require separate production drafts and compatibility review after native evidence. Existing nullable/optional source typing limitations are preserved.

The baseline expectations intentionally characterize observed defects. They must not become permanent desired-behavior tests. Native tests record before/after-input, request and post-frame values, focus and caret so a passing aggregate cannot hide first-frame differences. Synthetic nonfocused input is labeled separately from trusted clipboard cases. Stopping inside an already executing value callback can still run subsequent hidden-input dispatch; generation ownership prevents old queued work, not arbitrary interruption inside consumer callbacks.

## Additional comparisons

The original `baseline` and `candidate` source bytes stay immutable. `controlled-preframe` restores only controlled fields before the request frame, preserving uncontrolled text/caret behavior. `controlled-postframe` preserves pre-frame behavior in all modes, then reconciles only controlled fields against live accepted context after the request callback returns.

The post-request experiment explicitly depends on original input-index routing and generation ownership. It checks generation after `onValueChange` and again after resolving a caller-supplied root, immediately before writing the accepted field value. Reentrant stop/restart controls and missing-guard mutants verify that this cannot be silently treated as a standalone DOM-only fix. The comparison ends in a compatibility report, not a forced production paste correction.
