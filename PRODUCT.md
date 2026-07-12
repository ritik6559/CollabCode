# Product

## Register

product

## Platform

web

## Users

Students and friends learning together — practicing DSA problems, pairing on assignments, and sharing notes. They arrive in twos: one creates a room, the other joins with a shared ID. Sessions are casual and short-lived (an evening of problem-solving, a study session before an exam), usually on laptops, often while on a call with each other. They are comfortable with code but not with tooling ceremony — anything that takes longer than pasting a room ID loses them.

A secondary audience follows from the project's purpose: recruiters and engineers evaluating the codebase and the product as a demonstration of production-grade full-stack work. They probe edge cases, error states, and polish.

## Product Purpose

CollabCode gives two people a shared room where they can write code together with live CRDT-synced editing (named, colored cursors), run it instantly across 9+ languages via Judge0, or co-write rich-text docs — all with zero setup beyond an account and a room ID. Success is both: a genuinely usable tool that student pairs return to, and a portfolio project whose engineering quality (real-time sync, conflict resolution, security) impresses technical evaluators.

## Positioning

The fastest way for two people to code together and run it — create a room, share the ID, and you're typing in the same file with your names on your cursors.

## Brand Personality

Focused, calm, precise. The warm amber-on-charcoal palette carries approachability, but the interface itself stays quiet and tool-like: it gets out of the way when two people are concentrating on a problem. Microcopy is plain and direct — no exclamation-point enthusiasm, no jargon. Energy lives in the moments of connection (a partner joining, cursors appearing), not in the chrome.

## Anti-references

- Corporate IDE chrome — VS Code-like density, gray enterprise panels, toolbar sprawl. CollabCode is a focused room, not a workbench.
- Toy or gamified aesthetics — mascots, badges, confetti, XP bars. The users are doing real work; treating them like players undermines being taken seriously (by them and by evaluators).

## Design Principles

1. **Calm surface, warm accent.** The working canvas stays quiet and low-contrast; the amber warmth appears at points of identity and action (presence, primary buttons, brand moments), never spread across the whole surface.
2. **Two-person intimacy.** Every screen is designed for exactly two collaborators. Presence — who's here, where their cursor is, when they leave — is a first-class design element, not a status-bar afterthought.
3. **Zero-setup respect.** Users arrive mid-task with a friend waiting. Joining, running code, and downloading must each work in seconds without explanation; any flow that needs a tooltip has failed.
4. **Show the sync.** Real-time collaboration is the differentiator — make it visible (live cursors, save state, join/leave signals) but never noisy; a cursor label says more than a toast.
5. **Production-grade is the pitch.** Evaluators look at error states, empty states, and edge cases first. Those surfaces get the same design attention as the happy path, with specific, honest error messages.

## Accessibility & Inclusion

WCAG AA: body text at ≥4.5:1 contrast against its background, visible focus states on all interactive elements, and `prefers-reduced-motion` alternatives for every animation (partially in place in the landing-page CSS — extend to all surfaces). Collaborator colors must never be the sole carrier of identity; cursor labels always show the name.
