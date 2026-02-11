# Anime Clash ⚡

> **Guess which anime character is more popular — head-to-head, one pair at a time.**

A fast-paced browser game where you compare anime characters by their MyAnimeList favorites count. Pick the right answer, build your streak, and climb the leaderboard.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)

**Live:** [anime-clash.netlify.app](https://anime-clash.netlify.app)

---

## Game Modes

| Mode | Description |
|------|-------------|
| **Classic** | One wrong answer and you're out. How far can you go? |
| **Endless** | Keep playing — no game over, just vibes and stats. |
| **Time Attack** | 60 seconds on the clock. Score as many as you can. |
| **Daily Challenge** | One pair per day for everyone. Resets at 00:00 UTC. |

## Features

- **400+ anime characters** with real MAL favorites data
- **Achievements system** — unlock milestones as you play
- **Streak tracking** and combo multipliers
- **Sound effects** with adjustable volume
- **Keyboard shortcuts** — `W`/`↑` for Higher, `S`/`↓` for Lower
- **Mobile-first** responsive design
- **Server-side score persistence** via Netlify Functions + Blobs
- **Daily challenge** with re-play prevention and live countdown timer
- **Share your score** with friends via native share or clipboard

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (single `index.html`, fully self-contained)
- **Backend:** Netlify Serverless Functions (Node.js)
- **Storage:** Netlify Blobs (user scores, daily challenge state)
- **Data:** Static JSON dataset of anime characters from MyAnimeList

## Project Structure

```
.
├── index.html                  # Full app (HTML + inline CSS + JS)
├── anime_characters.json       # Character dataset (400+ entries)
├── netlify.toml                # Netlify deployment config
├── package.json                # Node dependencies
├── netlify/
│   └── functions/
│       ├── daily-pair.mjs      # GET /api/daily-pair
│       ├── daily-submit.mjs    # POST /api/daily-submit
│       └── save-score.mjs      # GET|POST /api/save-score
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/daily-pair` | `GET` | Returns today's daily character pair + play status |
| `/api/daily-submit` | `POST` | Records daily challenge result, prevents re-play |
| `/api/save-score` | `GET/POST` | Fetch or persist user scores and achievements |

All endpoints use `X-User-Id` header for user identification.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)

### Local Development

```bash
# Install dependencies
npm install

# Install Netlify CLI (if not already)
npm install -g netlify-cli

# Run locally with serverless functions
netlify dev
```

### Deploy

```bash
# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod
```

## How the Daily Challenge Works

1. A **seeded PRNG** generates a deterministic character pair from the UTC date
2. Every user gets the **same pair** on the same day
3. Results are stored server-side — **one attempt per user per day**
4. Client-side localStorage acts as a fast first check; server-side Blobs is the source of truth
5. A live countdown shows time remaining until the next daily at **00:00 UTC**

---

Built with caffeine and anime. ⚡
