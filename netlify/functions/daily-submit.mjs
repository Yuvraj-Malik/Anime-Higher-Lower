import { getStore } from "@netlify/blobs";

function getTodayKey() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

export default async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response("", { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing user ID" }),
        { status: 400, headers }
      );
    }

    const body = await req.json();
    const { correct, score } = body;
    const dateKey = getTodayKey();
    const store = getStore("daily-plays");

    const existing = await store.get(`${dateKey}:${userId}`);
    if (existing) {
      return new Response(
        JSON.stringify({
          error: "Already played today",
          alreadyPlayed: true,
          result: JSON.parse(existing),
        }),
        { status: 409, headers }
      );
    }

    const result = {
      userId,
      dateKey,
      correct: !!correct,
      score: score || 0,
      playedAt: new Date().toISOString(),
    };

    await store.set(`${dateKey}:${userId}`, JSON.stringify(result));

    return new Response(
      JSON.stringify({ success: true, result }),
      { status: 200, headers }
    );
  } catch (e) {
    console.error("daily-submit error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

export const config = {
  path: "/api/daily-submit",
};
