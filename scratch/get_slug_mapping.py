import urllib.request
import json
import urllib.parse
import sys

sys.stdout.reconfigure(encoding='utf-8')

movies = [
    {"id": "1", "title": "Dune: Phần Hai", "query": "Dune: Part Two"},
    {"id": "2", "title": "Oppenheimer", "query": "Oppenheimer"},
    {"id": "3", "title": "Guardians of the Galaxy Vol. 3", "query": "Guardians of the Galaxy Vol. 3"},
    {"id": "4", "title": "One Piece Film: Red", "query": "One Piece Film: Red"},
    {"id": "5", "title": "The Batman", "query": "The Batman"},
    {"id": "6", "title": "Trò Chơi Con Mực", "query": "Squid Game"},
    {"id": "7", "title": "Ký Sinh Trùng", "query": "Parasite"},
    {"id": "8", "title": "Attack on Titan — Phần Cuối", "query": "Shingeki no Kyojin"},
    {"id": "9", "title": "Demon Slayer: Làng Thợ Rèn", "query": "Kimetsu no Yaiba"},
    {"id": "10", "title": "Avengers: Endgame", "query": "Avengers: Endgame"},
    {"id": "11", "title": "Inside Out 2", "query": "Inside Out 2"},
    {"id": "12", "title": "Deadpool & Wolverine", "query": "Deadpool & Wolverine"},
    {"id": "13", "title": "Alien: Romulus", "query": "Alien: Romulus"},
    {"id": "14", "title": "Hành Tinh Vượn: Vương Quốc Mới", "query": "Kingdom of the Planet of the Apes"},
    {"id": "15", "title": "Jujutsu Kaisen Season 2", "query": "Jujutsu Kaisen"},
    {"id": "16", "title": "Mắt Biếc", "query": "Mắt Biếc"},
    {"id": "17", "title": "Spider-Man: Across the Spider-Verse", "query": "Spider-Man: Across the Spider-Verse"},
    {"id": "18", "title": "Hương Mật Tựa Khói Sương", "query": "Ashes of Love"},
    {"id": "19", "title": "Nàng Dâu Order", "query": "My Liberation Notes"},
    {"id": "20", "title": "Interstellar", "query": "Interstellar"}
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

mapping = {}

for m in movies:
    # Try searching
    url = f"https://ophim1.com/v1/api/tim-kiem?keyword={urllib.parse.quote(m['query'])}"
    print(f"Searching for '{m['title']}' ({m['query']})...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            items = data.get("data", {}).get("items", [])
            if items:
                # Find the closest match or first item
                best_match = items[0]
                # Try to find an item with matching name/origin_name
                for item in items:
                    if m['title'].lower() in item.get('name', '').lower() or m['query'].lower() in item.get('origin_name', '').lower():
                        best_match = item
                        break
                mapping[m['id']] = best_match.get("slug")
                print(f"  -> Match: {best_match.get('name')} | Slug: {best_match.get('slug')}")
            else:
                # Retry with title
                url_title = f"https://ophim1.com/v1/api/tim-kiem?keyword={urllib.parse.quote(m['title'])}"
                req_title = urllib.request.Request(url_title, headers=headers)
                with urllib.request.urlopen(req_title, timeout=10) as response_title:
                    data_title = json.loads(response_title.read().decode('utf-8'))
                    items_title = data_title.get("data", {}).get("items", [])
                    if items_title:
                        best_match = items_title[0]
                        mapping[m['id']] = best_match.get("slug")
                        print(f"  -> Match (by title): {best_match.get('name')} | Slug: {best_match.get('slug')}")
                    else:
                        print("  -> No match found!")
    except Exception as e:
        print(f"  -> Error: {e}")
    print()

print("Resulting Mapping:")
print(json.dumps(mapping, indent=2, ensure_ascii=False))

with open("slug_mapping.json", "w", encoding="utf-8") as f:
    json.dump(mapping, f, ensure_ascii=False, indent=2)
