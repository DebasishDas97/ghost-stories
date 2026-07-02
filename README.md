# 👻 From the Other Side

A platform for sharing and reading paranormal sightings — built with **vanilla Node.js** (zero framework, zero Express). The server handles static file serving, a REST API, and a real-time Server-Sent Events (SSE) news feed, all using only the built-in `node:http` module.

---

## ✨ Features

- **Read Sightings** — Browse a collection of ghost stories rendered as expandable cards
- **Upload Sightings** — Submit your own paranormal encounters via a styled form
- **Live News Feed** — Real-time SSE stream that pushes random spooky headlines every 3 seconds
- **Input Sanitization** — All user submissions are sanitized with `sanitize-html` to prevent XSS
- **Event-Driven Alerts** — New sightings emit events via Node.js `EventEmitter`, logging alerts to the console
- **Custom 404 Page** — A themed "You've been ghosted 👻" page for unknown routes
- **Fully Static File Server** — Serves HTML, CSS, JS, and images with correct MIME types

---

## 🛠️ Tech Stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------ |
| Runtime    | Node.js (ES Modules)                             |
| Server     | `node:http` — no Express or other frameworks     |
| Data       | JSON file (`data/data.json`) — flat-file storage |
| Sanitizer  | `sanitize-html`                                  |
| IDs        | `uuid` (v4)                                      |
| Real-time  | Server-Sent Events (SSE)                         |
| Fonts      | Google Fonts (Frijole, Poppins)                   |
| Dev Server | `nodemon` (auto-restart on changes)              |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+ (uses `import.meta.dirname`)

### Installation

```bash
# Clone the repository
git clone https://github.com/DebasishDas97/ghost-stories.git
cd ghost-stories

# Install dependencies
npm install
```

### Running

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

The app will be available at **http://localhost:8000**.

---

## 📁 Project Structure

```
ghost-stories/
├── server.js                  # Entry point — creates the HTTP server & routes
├── package.json
│
├── data/
│   ├── data.json              # Persistent sighting records (flat-file DB)
│   └── stories.js             # Array of news headline strings for SSE feed
│
├── handlers/
│   └── routeHandlers.js       # Route logic: GET /api, POST /api, GET /api/news
│
├── events/
│   └── sightingEvents.js      # EventEmitter — emits alerts on new sightings
│
├── utils/
│   ├── addNewSighting.js      # Appends a new sighting (with UUID) to data.json
│   ├── createAlert.js         # Listener — logs alert for ghost hunters
│   ├── getData.js             # Reads & parses data.json
│   ├── getContentType.js      # Maps file extensions to MIME types
│   ├── handleRouteError.js    # Returns 404 JSON for unknown API routes
│   ├── parseJSONBody.js       # Streams & parses incoming JSON request body
│   ├── sanitizeInput.js       # Strips dangerous HTML from all string fields
│   ├── sendResponse.js        # Helper to set status, headers, and end response
│   └── serveStatic.js         # Serves static files from /public with 404 fallback
│
└── public/                    # Front-end assets (served as static files)
    ├── index.html             # Home page
    ├── sightings.html         # Sightings listing page
    ├── upload-sighting.html   # Sighting submission form
    ├── news.html              # Live SSE news feed page
    ├── 404.html               # Custom "You've been ghosted" 404 page
    ├── index.css              # Global stylesheet
    ├── index.js               # Fetches sightings & renders expandable cards
    ├── upload-sighting.js     # Form submission logic with validation
    ├── news.js                # EventSource client for live news stream
    └── images/
        ├── candle-logo.png    # Site logo
        └── ghostbg.jpg        # Background image
```

---

## 🔌 API Reference

### `GET /api`

Returns all sightings.

**Response** — `200 OK`

```json
[
  {
    "uuid": "a9f1c6e5-9383-4d12-b28d-734c9370f861",
    "location": "Exeter, UK",
    "timeStamp": "7 Jan 2025 at 09:30",
    "title": "The Phantom Warning",
    "text": "I was drifting through town..."
  }
]
```

---

### `POST /api`

Submit a new sighting. A UUID is auto-generated server-side.

**Request Body** — `application/json`

```json
{
  "location": "Edinburgh, UK",
  "timeStamp": "20 March 2024 at 11:30",
  "title": "The Pianist's Lament",
  "text": "We wandered into the skeleton of an abandoned theater..."
}
```

**Response** — `201 Created` (returns the sanitized sighting)

---

### `GET /api/news`

Opens a **Server-Sent Events** stream. The server pushes a random paranormal news headline every 3 seconds.

**Response** — `text/event-stream`

```
data: {"event":"news-update","story":"BBC: London Underground ghost sighting scares party-goers"}
```

---

## ⚙️ How It Works

### Server & Routing

[server.js](server.js) creates a raw `http.createServer` and routes requests manually:

| Method | Path          | Handler                                   |
| ------ | ------------- | ----------------------------------------- |
| GET    | `/api`        | Returns all sightings as JSON             |
| POST   | `/api`        | Accepts & stores a new sighting           |
| GET    | `/api/news`   | Opens an SSE stream with live headlines   |
| *      | `/api/*`      | Returns `404` JSON error                  |
| *      | Everything else | Serves static files from `public/`      |

### Data Flow (New Sighting)

```
Client POST /api
  → parseJSONBody()      — streams & parses the request body
  → sanitizeInput()      — strips dangerous HTML tags
  → addNewSighting()     — assigns UUID, appends to data.json
  → sightingEvents.emit  — fires 'sighting-added' event
  → createAlert()        — logs "Send alert to Ghost Hunters in {location}"
  → 201 response
```

### Event System

The app uses Node.js `EventEmitter` to decouple sighting creation from side-effects. When a new sighting is posted, the `sighting-added` event fires, which triggers `createAlert()` — a pattern that makes it easy to add more listeners (e.g., email notifications, webhooks) without touching the route handler.

### Security

All user-submitted strings are sanitized through `sanitize-html`, which strips all HTML tags except `<b>`, preventing stored XSS attacks.

