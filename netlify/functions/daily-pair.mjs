import { getStore } from "@netlify/blobs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (9301 * s + 49297) % 233280;
    return s / 233280;
  };
}

function getTodayKey() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

function generateDailyPair(characters, dateKey) {
  const dateParts = dateKey.split("-").map(Number);
  const seed = dateParts[0] * 10000 + dateParts[1] * 100 + dateParts[2];
  const rng = seededRandom(seed);

  const valid = characters.filter(
    (c) =>
      c &&
      typeof c.favorites === "number" &&
      !isNaN(c.favorites) &&
      c.favorites >= 100 &&
      c.image &&
      !c.image.includes("questionmark") &&
      !c.image.includes("placeholder") &&
      c.name &&
      c.anime
  );

  if (valid.length < 2) return null;

  let attempts = 0;
  while (attempts < 50) {
    const idxA = Math.floor(rng() * valid.length);
    let idxB = Math.floor(rng() * valid.length);
    if (idxA === idxB) {
      idxB = (idxB + 1) % valid.length;
    }

    const charA = valid[idxA];
    const charB = valid[idxB];
    const diff = Math.abs(charA.favorites - charB.favorites);
    const pct = (diff / Math.max(charA.favorites, charB.favorites)) * 100;

    if (pct >= 10 && pct <= 60) {
      return { charA, charB, dateKey };
    }
    attempts++;
  }

  const idxA = Math.floor(rng() * valid.length);
  let idxB = (idxA + 1) % valid.length;
  return { charA: valid[idxA], charB: valid[idxB], dateKey };
}

let cachedCharacters = null;

function loadCharacters() {
  if (cachedCharacters) return cachedCharacters;
  const possiblePaths = [
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../anime_characters.json"),
    path.resolve(process.cwd(), "anime_characters.json"),
    path.resolve("/var/task", "anime_characters.json"),
  ];
  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        cachedCharacters = JSON.parse(raw);
        console.log("Loaded characters from:", filePath);
        return cachedCharacters;
      }
    } catch (e) {
      console.warn("Failed to load from", filePath, e.message);
    }
  }
  console.error("Could not find anime_characters.json in any expected path");
  return null;
}

export default async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  try {
    const characters = loadCharacters();
    if (!characters) {
      return new Response(
        JSON.stringify({ error: "Characters data not available" }),
        { status: 500, headers }
      );
    }

    const url = new URL(req.url);
    const clientDateKey = url.searchParams.get("dateKey");
    const dateKey = clientDateKey && /^\d{4}-\d{2}-\d{2}$/.test(clientDateKey) ? clientDateKey : getTodayKey();
    const pair = generateDailyPair(characters, dateKey);

    if (!pair) {
      return new Response(
        JSON.stringify({ error: "Could not generate pair" }),
        { status: 500, headers }
      );
    }

    const userId = req.headers.get("x-user-id");
    let alreadyPlayed = false;

    if (userId) {
      try {
        const store = getStore("daily-plays");
        const record = await store.get(`${dateKey}:${userId}`);
        if (record) {
          alreadyPlayed = true;
        }
      } catch (e) {
        console.warn("Blob store read error:", e);
      }
    }

    // nextResetMs is now calculated client-side based on local timezone
    const msUntilReset = 0;

    return new Response(
      JSON.stringify({
        charA: pair.charA,
        charB: pair.charB,
        dateKey: pair.dateKey,
        alreadyPlayed,
        nextResetMs: msUntilReset,
      }),
      { status: 200, headers }
    );
  } catch (e) {
    console.error("daily-pair error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

export const config = {
  path: "/api/daily-pair",
};
