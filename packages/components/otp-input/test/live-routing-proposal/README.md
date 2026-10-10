# OTP paste-origin diagnostic

This test-only comparison examines a proposed paste-routing contract. It imports
live OTP code through the existing paste fixture and changes no production code.
It is not intended to merge into the normal passing test suite while the routing
policy remains undecided.

The proposed contract anchors a paste to the input receiving the event. The
current implementation reads the focused input during deferred paste work.
A disagreement with the proposed expectation is a behavior comparison, not
proof that the existing public contract is defective.

Two ordinary assertions cover these separate routes:

1. Trusted clipboard paste of `987` at input 0, starting from `123`, with the
   existing `afterInput` hook moving focus to input 2 before deferred work.
2. A synthetic input event at nonfocused input 0 while input 2 has focus. This
   is explicitly untrusted and does not represent real clipboard coverage.

Both cases wait for two real animation frames and compare the complete change
request with `987`. Trigger-validity assertions check input type, trust, target,
focus and whether any request was delivered before the focus observation.
There are no frame stubs, skipped assertions or expected-failure inversions.

The `OTP_LIVE_ROUTING_PROPOSAL_20261010` record preserves input events, request
values, accepted model, visible values, focus, carets and the last reached stage
when an ordinary assertion fails. Setup, import, clipboard, timeout or reporter
failures do not establish a routing difference. Preserve the full runner output
and any built-in retry attempts when interpreting results.

The fixture wires selected DOM properties and event listeners directly. These
cases do not cover every framework binding, controlled accept/veto behavior,
sparse slots, paste capacity or truncation policy. They neither replace the
older frozen-source comparison nor recover its missing refresh observations.

Prepared against source commit `d486a66428d51f5901b494349f552436b17669cf`.
These two cases have not run. A final implementation SHA and its build and
browser configuration must accompany any later execution results.
