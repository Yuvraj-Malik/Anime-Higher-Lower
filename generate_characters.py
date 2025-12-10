import requests
import json
import time

all_characters = []

print("Fetching character data from Jikan API v4...")
print("This will take a few minutes due to rate limiting...")

for page in range(1, 21):  # 20 pages × 25 = 500 characters
    print(f"Fetching page {page}/20...")
    
    try:
        response = requests.get(f"https://api.jikan.moe/v4/top/characters?page={page}")
        
        # Check if request was successful
        if response.status_code == 200:
            data = response.json().get("data", [])
            
            for char in data:
                # Get the first anime from the anime list
                anime_name = "Unknown"
                if "anime" in char and char["anime"] and len(char["anime"]) > 0:
                    anime_name = char["anime"][0].get("anime", {}).get("title", "Unknown")
                
                character = {
                    "name": char.get("name", "Unknown"),
                    "favorites": char.get("favorites", 0),
                    "anime": anime_name,
                    "image": char.get("images", {}).get("jpg", {}).get("image_url", "")
                }
                all_characters.append(character)
                
            print(f"✓ Page {page} fetched successfully ({len(data)} characters)")
            
        elif response.status_code == 429:
            print(f"⚠ Rate limited on page {page}. Waiting 60 seconds...")
            time.sleep(60)
            continue
        else:
            print(f"✗ Error on page {page}: Status {response.status_code}")
            
        # Be respectful to the API - wait 1 second between requests
        time.sleep(1)
        
    except Exception as e:
        print(f"✗ Exception on page {page}: {str(e)}")
        continue

# Save to file
with open("anime_characters.json", "w", encoding="utf-8") as f:
    json.dump(all_characters, f, indent=2, ensure_ascii=False)

print(f"\n✅ Done! Saved {len(all_characters)} characters to anime_characters.json")
print("\nNote: The Jikan API v4 structure has changed.")
print("Anime titles are now nested: char['anime'][0]['anime']['title']")