# Product

Japan Trip Map: a private trip companion for one couple's 16-day trip through Japan (20 Oct – 4 Nov 2026).

## Platform

web (installable PWA). Android Chrome only, on a phone and a tablet.

## Stack

Plain static HTML, CSS and ES modules with no build step. MapLibre GL JS renders local PMTiles extracts from the Protomaps basemap (OpenStreetMap data). A service worker handles offline. Hosted on GitHub Pages.

## Users

Two travellers.
- They review the whole route beforehand on the tablet.
- During the trip they open the app on a phone each morning, and on the move. That might be on a train platform, on a mountain trail with no signal, or at a ryokan in the evening.

## Product Purpose

To see the whole trip geographically, and to know at a glance what today involves:
- where you sleep;
- the travel legs;
- anything at a fixed time;
- the activities;
- notes, including the gaps still to confirm.

## Positioning

A personal itinerary turned into a place you can scroll through. It is not a booking app or a guidebook.

## Operating Context

The app is often used in bright daylight outdoors, with one hand, on a phone, and frequently offline. The two jobs are a glance-and-go check in the morning and leisurely planning on the tablet beforehand.

## Capabilities and Constraints

- All content comes from `data/trip.json`.
- There are no runtime requests to third parties; fonts must be self-hosted or from the system.
- The map's detail is limited to the extract areas.
- The user's home address must never appear.

## Brand Commitments

No look has been pinned. The user had no anti-preferences, and the theme follows the phone's light or dark setting.

## Evidence on Hand

- The approved card layout: https://claude.ai/artifact/VTU1uFaHtmEGWECrompBT8. The layout and content are approved; the look is a placeholder.
- The spec: `docs/superpowers/specs/2026-10-11-japan-trip-map-design.md`.

## Product Principles

- Today first.
- Unknowns are visible ("To confirm"), never disguised.
- It works with no signal.

## Accessibility & Inclusion

- Text must be readable in daylight: at least 4.5:1 contrast, with a 16px base.
- Tap targets of 44px or more.
- Honour reduced motion.
