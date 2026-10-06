# Event Registration System — Backend Events

Developer 4 — Backend: Events

Implements:
- [EVT-BE-01] Event model
- [EVT-BE-02] Get Events API
- [EVT-BE-03] Event search API
- [EVT-BE-04] Event capacity
- [EVT-BE-05] Event information validation

## Requirements

- Node.js 18+
- MongoDB

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and update `MONGODB_URI`.

Then:

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

## API

### Get all events
`GET /api/events`

Optional filters:
- `?page=1&limit=10`
- `?upcoming=true`

### Get one event
`GET /api/events/:id`

### Search events
`GET /api/events/search?q=music`

The search checks event title, description, location, and category.

### Health check
`GET /api/health`

## Event document

```json
{
  "title": "Bicol Music Festival",
  "description": "A local music event.",
  "date": "2026-11-20",
  "startTime": "18:00",
  "endTime": "21:00",
  "location": "Naga City",
  "category": "Music",
  "capacity": 100,
  "registeredCount": 0
}
```

`registeredCount` is included so the Registration backend can update the number of confirmed registrations. The Events module never allows it to become negative or greater than `capacity`.

## Notes for collaboration

This module owns the `Event` model and `/api/events` routes.

The Registration backend should use the same MongoDB database and update `registeredCount` when a registration is successfully created or cancelled. Do not create a second Event model in the registration module.
