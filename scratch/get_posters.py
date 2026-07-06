import urllib.request
import re
import json
import sys

# Ensure UTF-8 output on Windows console
sys.stdout.reconfigure(encoding='utf-8')

movies = [
    {"id": "693134", "type": "movie", "title": "Dune: Phần Hai"},
    {"id": "872585", "type": "movie", "title": "Oppenheimer"},
    {"id": "447365", "type": "movie", "title": "Guardians of the Galaxy Vol. 3"},
    {"id": "900667", "type": "movie", "title": "One Piece Film: Red"},
    {"id": "414906", "type": "movie", "title": "The Batman"},
    {"id": "93405", "type": "tv", "title": "Trò Chơi Con Mực"},
    {"id": "496243", "type": "movie", "title": "Ký Sinh Trùng"},
    {"id": "1429", "type": "tv", "title": "Attack on Titan — Phần Cuối"},
    {"id": "85937", "type": "tv", "title": "Demon Slayer: Làng Thợ Rèn"},
    {"id": "299534", "type": "movie", "title": "Avengers: Endgame"},
    {"id": "1022789", "type": "movie", "title": "Inside Out 2"},
    {"id": "533535", "type": "movie", "title": "Deadpool & Wolverine"},
    {"id": "945961", "type": "movie", "title": "Alien: Romulus"},
    {"id": "653346", "type": "movie", "title": "Hành Tinh Vượn: Vương Quốc Mới"},
    {"id": "95595", "type": "tv", "title": "Jujutsu Kaisen Season 2"},
    {"id": "632617", "type": "movie", "title": "Mắt Biếc"},
    {"id": "569094", "type": "movie", "title": "Spider-Man: Across the Spider-Verse"},
    {"id": "82445", "type": "tv", "title": "Hương Mật Tựa Khói Sương"},
    {"id": "197085", "type": "tv", "title": "Nàng Dâu Order"},
    {"id": "157336", "type": "movie", "title": "Interstellar"}
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
}

results = {}

for m in movies:
    url = f"https://www.themoviedb.org/{m['type']}/{m['id']}"
    print(f"Fetching {m['title']} from {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            
            # Find poster path (og:image)
            poster_match = re.search(r'property="og:image"\s+content="([^"]+)"', html)
            if not poster_match:
                poster_match = re.search(r'content="([^"]+)"\s+property="og:image"', html)
            
            poster_url = poster_match.group(1) if poster_match else ""
            
            # Find backdrop path
            backdrop_match = re.search(r'class="backdrop"[^>]+style="background-image:\s*url\(([^)]+)\)', html)
            if not backdrop_match:
                paths = re.findall(r'/t/p/[^/]+/([^"\')\s]+)', html)
                backdrops = [p for p in paths if not p.endswith(('.png', '.svg')) and p not in poster_url]
                backdrop_path = backdrops[0] if backdrops else ""
                backdrop_url = f"https://image.tmdb.org/t/p/original/{backdrop_path}" if backdrop_path else ""
            else:
                backdrop_url = backdrop_match.group(1)
                
            if poster_url and poster_url.startswith('//'):
                poster_url = 'https:' + poster_url
            if backdrop_url and backdrop_url.startswith('//'):
                backdrop_url = 'https:' + backdrop_url
            
            if poster_url:
                poster_url = re.sub(r'/t/p/w\d+/', '/t/p/w500/', poster_url)
            if backdrop_url:
                backdrop_url = re.sub(r'/t/p/w\d+(_and_h\d+_[a-z_]+)?/', '/t/p/original/', backdrop_url)
            
            results[m['title']] = {
                "poster": poster_url,
                "backdrop": backdrop_url
            }
            print(f"-> Poster: {poster_url}\n-> Backdrop: {backdrop_url}\n")
    except Exception as e:
        print(f"Error fetching {m['title']}: {e}")

# Save results
with open("posters.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("Done!")
