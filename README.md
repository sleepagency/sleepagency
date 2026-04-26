# Sleep Agency Trip Planner (Rebuild)

This is a clean-room rebuild inspired by:
`https://trip-planner-v2-eosin.vercel.app/app?role=view`

## Is this private?

- This project is local code in this repository until you publish/deploy it.
- If you run it locally (`http://localhost`), only you can see it on your machine.
- It becomes public only if you push to a public repo or deploy to a public URL.

## How to see what it looks like

```bash
python -m http.server 4173
# Open http://localhost:4173 in your browser
```

## What was recreated

- Single-page trip planning flow.
- Role-aware UX (`?role=view` / `?role=edit`).
- Date-driven itinerary cards and editable activity entries.
- Budget breakdown card with totals.
- Logistics cards (flight/hotel summary).
- Packing checklist card with localStorage persistence.

## Important parity note

I could not fully inspect every route/page of the external Vercel app from this environment due network restrictions, so this is a functional rebuild of the core planner experience rather than guaranteed 1:1 parity of every hidden page/card/interaction.
