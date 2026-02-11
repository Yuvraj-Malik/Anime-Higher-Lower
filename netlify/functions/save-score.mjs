import { getStore } from "@netlify/blobs";

export default async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Missing user ID" }),
      { status: 400, headers }
    );
  }

  const store = getStore("user-scores");

  try {
    if (req.method === "GET") {
      const data = await store.get(userId);
      if (!data) {
        return new Response(
          JSON.stringify({
            highScore: 0,
            maxStreak: 0,
            totalGames: 0,
            achievements: [],
          }),
          { status: 200, headers }
        );
      }
      return new Response(data, { status: 200, headers });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { highScore, maxStreak, totalGames, achievements, lastScore } = body;

      let existing = {
        highScore: 0,
        maxStreak: 0,
        totalGames: 0,
        achievements: [],
      };

      try {
        const raw = await store.get(userId);
        if (raw) existing = JSON.parse(raw);
      } catch (e) {
        // first time user
      }

      const updated = {
        highScore: Math.max(existing.highScore || 0, highScore || 0),
        maxStreak: Math.max(existing.maxStreak || 0, maxStreak || 0),
        totalGames: (existing.totalGames || 0) + 1,
        achievements: achievements || existing.achievements || [],
        lastScore: lastScore || 0,
        lastPlayed: new Date().toISOString(),
      };

      await store.set(userId, JSON.stringify(updated));

      return new Response(
        JSON.stringify({ success: true, data: updated }),
        { status: 200, headers }
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  } catch (e) {
    console.error("save-score error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

export const config = {
  path: "/api/save-score",
};
