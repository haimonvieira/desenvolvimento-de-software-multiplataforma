# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Modern TypeScript stack with Next.js deployed to Cloudflare Workers and Neon PostgreSQL for persistence. Integrations remain behind narrow interfaces so the application can move hosts or AI providers without changing product flows.

## Users

The primary user is a Fatec DSM student who alternates between daily study and organizing course materials after class. Visitors can browse, download, and study with the AI tutor without creating an account. An optional anonymous passkey profile synchronizes progress, favorites, notes, flashcards, and summaries explicitly saved by the student without requiring a name or email. Full tutor conversations remain on the device. Only the owner publishes or changes repository content.

## Product Purpose

DSM Atlas organizes the repository's semester and discipline hierarchy into a fast study interface. It should make it equally easy to resume studying and to upload a batch downloaded from Microsoft Teams, review AI-generated classification suggestions, and publish the approved files to GitHub.

## Positioning

The Git repository remains the source of truth while DSM Atlas turns its heterogeneous academic files into a navigable study catalog and a guided publishing workflow.

## Operating Context

- Existing repository hierarchy: `DSM1`, `DSM2`, and `DSM3`, with discipline folders beneath each semester.
- Materials include documents, presentations, PDFs, images, archives, source code, database exports, exercises, and complete projects.
- New Teams materials are initially downloaded manually and dragged into the portal as a batch. Direct Microsoft Teams synchronization is a planned later capability, not part of the first implementation slice.
- AI analyzes every owner upload and suggests semester, discipline, destination, material type, and title; the owner confirms or edits before publishing.
- Approved uploads become direct commits to the repository's main branch.

## Capabilities and Constraints

- Public reading, search, preview where supported, downloads, and a source-grounded AI study tutor.
- Visitors use the tutor without an account. They may create an anonymous passkey profile to synchronize study progress, favorites, notes, flashcards, and summaries they explicitly save; full tutor conversations are not synchronized.
- Owner-only write access uses a separate administrative identity and provider configuration; GitHub login is reserved for owner bootstrap and recovery.
- The public tutor and owner automation use separate AI provider credentials and independently enforced budgets.
- Public AI access uses a small sponsored allowance with hard per-visitor and global request/token ceilings. After the allowance, visitors may optionally use their own provider key; that key must remain on their device or in the active session and must never be stored by the server.
- The tutor is agentic only within a read-oriented study toolset: retrieve cited material excerpts, explain concepts, create exercises, and manage the visitor's notebook and flashcards. It cannot modify the repository or administrative data.
- GitHub's normal file storage is used with an explicit upload-size limit; Git LFS and external object storage are out of initial scope.
- Study progress and favorites are available locally before a profile exists and synchronize after an optional anonymous passkey is created.
- Automatic Microsoft Teams synchronization is planned after the core catalog, publishing, and study flows are stable.
- Neon PostgreSQL is the persistence target because its serverless autoscaling and scale-to-zero fit intermittent student traffic. Hosting must remain within a genuinely free allowance and the application must stay portable if provider limits change.
- The system must work on desktop and mobile.

## Brand Commitments

- Product name: DSM Atlas.
- Avoid corporate SaaS-dashboard aesthetics.
- Avoid childish school visuals and infantilized gamification.
- Motion may be expressive but must preserve study focus and support reduced-motion preferences.

## Evidence on Hand

- The repository contains real materials across three semesters and eighteen disciplines.
- `README.md` documents semester, discipline, and technology mappings.
- No testimonials, institutional endorsement, performance claims, or official Fatec branding assets are available; future interfaces must not invent them.

## Product Principles

- The repository is the durable source of truth.
- Suggest automatically; publish only after explicit owner review.
- Optimize equally for finding material and adding material.
- Prefer clear academic structure over generic dashboard conventions.
- Motion supports orientation and continuity, never distraction.
- Free student access and hard infrastructure cost ceilings take precedence over unlimited AI availability.
- Anonymous use is the default; creating an identity is optional and asks for no personal profile data.

## Accessibility & Inclusion

Keyboard navigation, visible focus, semantic structure, responsive layouts, sufficient contrast, and `prefers-reduced-motion` support are required.
