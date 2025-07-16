import requests
import json

all_characters = []

for page in range(1, 21):  # 20 pages × 25 = 500 characters
    print(f"Fetching page {page}...")
    response = requests.get(f"https://api.jikan.moe/v4/top/characters?page={page}")
    data = response.json().get("data", [])
    
    for char in data:
        character = {
            "name": char["name"],
            "favorites": char["favorites"],
            "anime": char["anime"][0]["name"] if "anime" in char and char["anime"] else "Unknown",
            "image": char["images"]["jpg"]["image_url"]
        }
        all_characters.append(character)

with open("anime_characters.json", "w", encoding="utf-8") as f:
    json.dump(all_characters, f, indent=2, ensure_ascii=False)

print("✅ Done! File saved as anime_characters.json")
