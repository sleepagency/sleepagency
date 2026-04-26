# Sleep Agency Trip Planner (Rebuild)

This is a clean-room rebuild of the trip planner experience from:
`https://trip-planner-v2-eosin.vercel.app/app?role=view`

## What was broken down from the reference

- **Single-page planner flow:** inputs on the left, generated trip output on the right.
- **Role-based UX:** support for `view` and `edit` behaviors from URL/query state.
- **Itinerary generation:** transform dates into day cards and suggested activity lists.
- **Budget summary:** split a total trip budget into meaningful categories.

## What this rebuild includes

- Pure HTML/CSS/JS app (no framework required).
- URL-driven role mode (`?role=view` / `?role=edit`).
- Trip form with destination, date range, traveler count, and total budget.
- Auto-generated daily itinerary cards.
- Budget category breakdown + per-day/per-traveler estimates.
- Lightweight responsive styling.

## Run locally

Open `index.html` in a browser.

For a local HTTP server:

```bash
python -m http.server 4173
# then open http://localhost:4173
```
