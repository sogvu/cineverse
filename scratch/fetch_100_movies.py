import urllib.request
import urllib.parse
import json
import re
import sys
import random

sys.stdout.reconfigure(encoding='utf-8')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

VALID_GENRES = {
    'Hành động', 'Tình cảm', 'Hài hước', 'Kinh dị', 'Khoa học viễn tưởng',
    'Hoạt hình', 'Phiêu lưu', 'Tâm lý', 'Tội phạm', 'Chiến tranh',
    'Thể thao', 'Lịch sử', 'Âm nhạc', 'Gia đình'
}

GENRE_MAP = {
    "hành động": "Hành động", "hài hước": "Hài hước", "hài": "Hài hước",
    "tình cảm": "Tình cảm", "cổ trang": "Tình cảm", "chính kịch": "Tình cảm",
    "khoa học": "Khoa học viễn tưởng", "viễn tưởng": "Khoa học viễn tưởng",
    "kinh dị": "Kinh dị", "phiêu lưu": "Phiêu lưu", "tâm lý": "Tâm lý",
    "hình sự": "Tội phạm", "tội phạm": "Tội phạm", "chiến tranh": "Chiến tranh",
    "hoạt hình": "Hoạt hình", "gia đình": "Gia đình", "thể thao": "Thể thao",
    "lịch sử": "Lịch sử", "âm nhạc": "Âm nhạc", "nhạc": "Âm nhạc",
    "bí ẩn": "Tâm lý", "kinh điển": "Lịch sử", "võ thuật": "Hành động",
    "thần thoại": "Khoa học viễn tưởng", "lãng mạn": "Tình cảm",
}

COUNTRY_MAP = {
    "mỹ": "Mỹ", "âu mỹ": "Mỹ", "anh - mỹ": "Mỹ",
    "hàn quốc": "Hàn Quốc", "nhật bản": "Nhật Bản",
    "trung quốc": "Trung Quốc", "anh": "Anh", "pháp": "Pháp",
    "thái lan": "Thái Lan", "việt nam": "Việt Nam",
    "hồng kông": "Khác", "đài loan": "Khác", "quốc gia khác": "Khác",
    "ấn độ": "Khác", "tây ban nha": "Khác", "đức": "Khác",
    "italy": "Khác", "nga": "Khác", "australia": "Khác",
}

def map_genre(name):
    low = name.lower()
    if low in GENRE_MAP:
        return GENRE_MAP[low]
    for k, v in GENRE_MAP.items():
        if k in low:
            return v
    return None

def map_country(name):
    low = name.lower()
    if low in COUNTRY_MAP:
        return COUNTRY_MAP[low]
    for k, v in COUNTRY_MAP.items():
        if k in low:
            return v
    return "Khác"

def clean_html(raw):
    if not raw:
        return ""
    text = re.sub(r'<.*?>', '', raw)
    text = text.replace('"', '\\"').replace('\n', ' ').strip()
    return text

def parse_duration(s):
    if not s:
        return 120
    m = re.search(r'(\d+)', s)
    return int(m.group(1)) if m else 120

def fetch_json(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=12) as r:
        return json.loads(r.read().decode('utf-8'))

# ── Collect slugs from listing pages ──────────────────────────────────────────
print("=== Collecting movie slugs from OPhim listing APIs ===\n")

# Categories to scrape: phim-le (type=single), phim-bo (type=series)
# OPhim API endpoint: https://ophim1.com/v1/api/danh-sach/{type}?page={n}
categories = [
    ("danh-sach/phim-le", "movie"),
    ("danh-sach/phim-bo", "series"),
    ("danh-sach/hoat-hinh", "series"),
]

all_slugs_seen = set()
slug_list = []  # [(slug, category)]

for cat_path, cat_type in categories:
    for page in range(1, 6):  # pages 1–5 per category
        try:
            url = f"https://ophim1.com/v1/api/{cat_path}?page={page}&limit=20"
            data = fetch_json(url)
            items = data.get("data", {}).get("items", [])
            print(f"  {cat_path} page {page}: {len(items)} items")
            for item in items:
                slug = item.get("slug", "")
                if slug and slug not in all_slugs_seen:
                    all_slugs_seen.add(slug)
                    slug_list.append((slug, cat_path))
            if not items:
                break
        except Exception as e:
            print(f"  Error {cat_path} p{page}: {e}")
            break

print(f"\nTotal unique slugs collected: {len(slug_list)}\n")

# ── Fetch full movie details ───────────────────────────────────────────────────
print("=== Fetching full movie details ===\n")
movie_objects = []

# Shuffle to get a diverse mix of movie types/categories
random.seed(42)
random.shuffle(slug_list)

# Limit to 100 movies
target_slugs = slug_list[:100]

for idx, item in enumerate(target_slugs):
    slug, cat_path = item
    url = f"https://ophim1.com/phim/{slug}"
    sys.stdout.write(f"\r  [{idx+1}/{len(target_slugs)}] {slug[:45]:<45}")
    sys.stdout.flush()
    try:
        data = fetch_json(url)
        m = data.get("movie")
        if not m:
            continue

        poster = m.get("poster_url", "")
        if not poster.startswith("http"):
            poster = f"https://img.ophim.live/uploads/movies/{poster}"

        backdrop = m.get("thumb_url", "")
        if not backdrop.startswith("http"):
            backdrop = f"https://img.ophim.live/uploads/movies/{backdrop}"

        m_type = "series" if m.get("type") == "series" else "movie"
        total_ep = 1
        try:
            total_ep = int(m.get("episode_total", "1"))
        except:
            total_ep = 12 if m_type == "series" else 1

        genres_raw = [g.get("name", "") for g in m.get("category", [])]
        genres_mapped = []
        for g in genres_raw:
            mg = map_genre(g)
            if mg and mg not in genres_mapped:
                genres_mapped.append(mg)
        
        if "hoat-hinh" in cat_path:
            if "Hoạt hình" not in genres_mapped:
                genres_mapped.append("Hoạt hình")

        if not genres_mapped:
            genres_mapped = ["Hành động"]

        countries = m.get("country", [])
        country = map_country(countries[0].get("name", "")) if countries else "Khác"

        actors = [a.replace("'", "\\'") for a in (m.get("actor") or [])[:5]]
        if not actors:
            actors = ["Đang cập nhật"]

        dirs = m.get("director") or []
        director = (dirs[0] if dirs else "Đang cập nhật").replace("'", "\\'")

        desc = clean_html(m.get("content", "")).replace("'", "\\'")
        title = m.get("name", "").replace("'", "\\'")
        orig_title = m.get("origin_name", "").replace("'", "\\'")

        movie_obj = {
            "id": str(idx + 1),
            "title": title,
            "originalTitle": orig_title,
            "slug": slug,
            "type": m_type,
            "status": "completed" if m.get("status") == "completed" else "ongoing",
            "poster": poster,
            "backdrop": backdrop,
            "trailer": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            "description": desc,
            "genres": genres_mapped,
            "country": country,
            "year": int(m.get("year", 2024)),
            "duration": parse_duration(m.get("time", "")),
            "director": director,
            "cast": actors,
            "imdbRating": round(random.uniform(6.5, 9.2), 1),
            "cvRating": round(random.uniform(7.5, 9.8), 1),
            "totalRatings": random.randint(500, 200000),
            "totalViews": random.randint(10000, 15000000),
            "quality": ["1080p", "720p"],
            "subtitles": ["Vietsub"],
            "tags": genres_mapped + [country],
            "isFeatured": True if idx < 5 else False,
            "isHot": True if idx < 20 else False,
            "isNew": True if idx >= 80 else False,
            "createdAt": "2024-01-01",
            "updatedAt": "2024-01-01",
        }
        if m_type == "series":
            movie_obj["totalEpisodes"] = total_ep
            movie_obj["currentEpisode"] = total_ep

        movie_objects.append(movie_obj)
    except Exception as e:
        pass

print(f"\n\nSuccessfully fetched {len(movie_objects)} movies\n")

# ── Generate TypeScript ────────────────────────────────────────────────────────
ts = """import { Movie } from '@/types';

export const PLACEHOLDER = (w: number, h: number, seed: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const mockMovies: Movie[] = [
"""

for m in movie_objects:
    ts += "  {\n"
    for k, v in m.items():
        if isinstance(v, bool):
            ts += f"    {k}: {str(v).lower()},\n"
        elif isinstance(v, str):
            ts += f"    {k}: '{v}',\n"
        elif isinstance(v, list):
            items_str = ", ".join(f"'{x}'" for x in v)
            ts += f"    {k}: [{items_str}],\n"
        else:
            ts += f"    {k}: {v},\n"
    ts += "  },\n"

ts += """];

export function getMovieById(id: string): Movie | undefined {
  return mockMovies.find(m => m.id === id);
}
export function getMovieBySlug(slug: string): Movie | undefined {
  return mockMovies.find(m => m.slug === slug);
}
export function getFeaturedMovies(): Movie[] {
  return mockMovies.filter(m => m.isFeatured);
}
export function getHotMovies(): Movie[] {
  return mockMovies.filter(m => m.isHot);
}
export function getNewMovies(): Movie[] {
  return mockMovies.filter(m => m.isNew);
}
export function getSeriesMovies(): Movie[] {
  return mockMovies.filter(m => m.type === 'series');
}
export function getSingleMovies(): Movie[] {
  return mockMovies.filter(m => m.type === 'movie');
}
export function getAnimationMovies(): Movie[] {
  return mockMovies.filter(m => m.genres.includes('Hoạt hình'));
}
export function getKoreanMovies(): Movie[] {
  return mockMovies.filter(m => m.country === 'Hàn Quốc');
}
export function searchMovies(query: string): Movie[] {
  const q = query.toLowerCase();
  return mockMovies.filter(m =>
    m.title.toLowerCase().includes(q) ||
    (m.originalTitle?.toLowerCase() || '').includes(q) ||
    m.genres.some(g => g.toLowerCase().includes(q))
  );
}
"""

with open("../data/mockMovies.ts", "w", encoding="utf-8") as f:
    f.write(ts)

print(f"✅ Done! Wrote {len(movie_objects)} movies to data/mockMovies.ts")

# Print summary
counts = {}
for m in movie_objects:
    c = m["country"]
    counts[c] = counts.get(c, 0) + 1
print("\nMovies by country:")
for c, n in sorted(counts.items(), key=lambda x: -x[1]):
    print(f"  {c}: {n}")

type_counts = {}
for m in movie_objects:
    t = m["type"]
    type_counts[t] = type_counts.get(t, 0) + 1
print("\nMovies by type:")
for t, n in type_counts.items():
    print(f"  {t}: {n}")
