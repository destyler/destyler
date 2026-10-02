# Diagnostic only: do not merge

This comparison contains exact baseline OTP Input source snapshots and a provisional combined experimental snapshot. Production source remains unchanged in the diagnostic PR. It measures separate proposals; it is not an implementation-ready bundled fix.

Baseline commit and byte hashes are recorded in snapshots.json. The candidate changes only accepted-DOM restoration, event-index routing and bounded deferred-work ownership. Those three proposals require separate production drafts and compatibility review after native evidence. Existing nullable/optional source typing limitations are preserved.

The baseline expectations intentionally characterize observed defects. They must not become permanent desired-behavior tests. Native tests record before/after-input, request and post-frame values, focus and caret so a passing aggregate cannot hide first-frame differences. Synthetic nonfocused input is labeled separately from trusted clipboard cases. Stopping inside an already executing value callback can still run subsequent hidden-input dispatch; generation ownership prevents old queued work, not arbitrary interruption inside consumer callbacks.
