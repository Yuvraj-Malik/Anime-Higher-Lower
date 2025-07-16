# 🎮 Anime Higher Lower Game

A fun and addictive web game where you guess which anime character is **more popular** based on MyAnimeList favorites! Inspired by [TheHigherLowerGame.com](https://www.higherlowergame.com), this version puts your anime knowledge to the test.

---

## 📌 Features

- 🧠 Compares **anime characters** based on MyAnimeList **favorites**
- 🔁 **Endless gameplay** until you guess wrong
- 🎯 **Score tracking** and local **high score saving**
- 🎨 Flip animation on card reveal
- 💾 Offline-ready with preloaded JSON data
- ⚡ Optimized for both desktop and mobile browsers

---

## 🚀 How to Play

1. You’ll see two anime characters.
2. One character's **popularity stat** (favorites) is shown.
3. Guess whether the second character is **Higher** 🔼 or **Lower** 🔽 in favorites.
4. Keep going as long as you guess correctly!
5. Game over? Try again and beat your high score!

---

## 🛠️ Tech Stack

- HTML + CSS + JavaScript
- [Jikan API](https://jikan.moe) for character data (via MyAnimeList)
- Flip animations & transitions using vanilla CSS
- LocalStorage for high score persistence

---

## 🧩 Data Source

Character popularity data is sourced from **MyAnimeList.net**, accessed via the open-source [Jikan API](https://jikan.moe/).

---

## 📦 Setup (for developers)

```bash
git clone https://github.com/yourusername/anime-higher-lower.git
cd anime-higher-lower
# Open index.html in Live Server or any browser
```

> ⚠️ For local development, use a **local server** (like VS Code Live Server) to avoid fetch() issues with `anime_characters.json`.

---


## 🙏 Credits

- [Jikan API](https://jikan.moe) for anime character data
- MyAnimeList.net for original data
- Inspired by the original [HigherLowerGame](https://www.higherlowergame.com)

---


