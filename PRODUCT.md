# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Next.js App Router on Vercel. One Edge route (`/api/status`) holds the xAI key server-side. No database, no VPS. The user will add `XAI_API_KEY` later in Vercel environment variables.

## Users

A person who wants a single, immediate answer: is Grok 4.7 available yet. They may leave the tab open and wait.

## Product Purpose

Show whether the Grok 4.7 model exists on xAI’s official model catalogue. Success is a correct yes/no in under a second, refreshing within ~15 seconds while the tab is visible.

## Positioning

A live lookup against xAI’s model ID (`GET /v1/models/grok-4.7` when a key is present; public docs page as fallback). Not a news recap, not a model comparison.

## Operating Context

Checked from a phone or laptop browser. Source of truth is xAI, not Cursor, not OpenRouter. SuperGrok chat tokens are never used. Catalogue requests do not consume inference credits.

## Capabilities and Constraints

- Display available / unavailable / loading / last-known-on-error.
- Poll every 15s only when the document is visible.
- Never call chat/completions or any inference endpoint.
- Never expose `XAI_API_KEY` to the client (`NEXT_PUBLIC_` forbidden).
- Without `XAI_API_KEY`, fall back to `https://docs.x.ai/developers/models/grok-4.7` (200 vs 404).
- Match `grok-4.7` and obvious variants in `id` and `aliases`.
- No dashboard, no model list, no marketing CTAs.
- Product name is not a registered brand; keep the page about the fact, not a coined identity.

## Brand Commitments

Ultra-basic, ultra-premium. One message. User-facing copy in French.

## Evidence on Hand

As of 18 Sep 2026, Grok 4.7 is not released: docs list `grok-4.6`; `https://docs.x.ai/developers/models/grok-4.7` returns 404. Do not invent launch dates, pricing, or parameter counts as product claims.

## Product Principles

- The answer is the product; everything else is noise.
- Official xAI signal beats faster unofficial sources.
- The secret stays on the server; the visitor only sees a boolean.
- Freshness without drama: quiet polling, last known status on failure.
- Premium through restraint, not decoration.

## Accessibility & Inclusion

A screen-reader user must hear the current availability, when it was checked, and error vs unavailable. Do not rely on color alone.
