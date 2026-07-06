import urllib.request
import json
import re
import sys
import random

sys.stdout.reconfigure(encoding='utf-8')

slugs = [
    "ke-trom-mat-trang-4",
    "cuu-long-thanh-trai-vay-thanh",
    "vung-dat-cam-lang-ngay-mot",
    "nhung-manh-ghep-cam-xuc-2",
    "ma-da",
    "deadpool-va-wolverine",
    "bo-gia",
    "cau-chuyen-do-choi",
    "gia-dinh-minh-vui-bat-thinh-linh",
    "tro-choi-con-muc",
    "mat-biec",
    "nguoi-nhen-du-hanh-vu-tru-nhen",
    "huong-mat-tua-khoi-suong",
    "nhat-ky-tu-do-cua-toi",
    "ho-den-tu-than",
    "avengers-hoi-ket",
    "doraemon-nobita-va-ban-giao-huong-dia-cau",
    "vua-hai-kich",
    "lat-mat-6-tam-ve-dinh-menh",
    "tay-du-ky"
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

# Strict TS mappings
VALID_GENRES = {
    'Hành động', 'Tình cảm', 'Hài hước', 'Kinh dị', 'Khoa học viễn tưởng', 
    'Hoạt hình', 'Phiêu lưu', 'Tâm lý', 'Tội phạm', 'Chiến tranh', 
    'Thể thao', 'Lịch sử', 'Âm nhạc', 'Gia đình'
}

GENRE_MAP = {
    "hành động": "Hành động",
    "hài hước": "Hài hước",
    "hài": "Hài hước",
    "tình cảm": "Tình cảm",
    "cổ trang": "Tình cảm",
    "chính kịch": "Tình cảm",
    "khoa học": "Khoa học viễn tưởng",
    "viễn tưởng": "Khoa học viễn tưởng",
    "kinh dị": "Kinh dị",
    "phiêu lưu": "Phiêu lưu",
    "tâm lý": "Tâm lý",
    "hình sự": "Tội phạm",
    "tội phạm": "Tội phạm",
    "chiến tranh": "Chiến tranh",
    "hoạt hình": "Hoạt hình",
    "gia đình": "Gia đình",
    "thể thao": "Thể thao",
    "lịch sử": "Lịch sử",
    "âm nhạc": "Âm nhạc"
}

VALID_COUNTRIES = {'Mỹ', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Anh', 'Pháp', 'Thái Lan', 'Việt Nam', 'Khác'}

COUNTRY_MAP = {
    "mỹ": "Mỹ",
    "âu mỹ": "Mỹ",
    "hàn quốc": "Hàn Quốc",
    "nhật bản": "Nhật Bản",
    "trung quốc": "Trung Quốc",
    "anh": "Anh",
    "pháp": "Pháp",
    "thái lan": "Thái Lan",
    "việt nam": "Việt Nam",
    "hồng kông": "Khác",
    "đài loan": "Khác",
    "quốc gia khác": "Khác"
}

movie_objects = []

def map_genre(g_name):
    g_lower = g_name.lower()
    if g_lower in GENRE_MAP:
        return GENRE_MAP[g_lower]
    # Check substring match
    for k, v in GENRE_MAP.items():
        if k in g_lower:
            return v
    return None

def map_country(c_name):
    c_lower = c_name.lower()
    if c_lower in COUNTRY_MAP:
        return COUNTRY_MAP[c_lower]
    for k, v in COUNTRY_MAP.items():
        if k in c_lower:
            return v
    return "Khác"

def clean_html(raw_html):
    if not raw_html:
        return ""
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext.replace('"', '\\"').replace('\n', ' ').strip()

def parse_duration(time_str):
    if not time_str:
        return 120
    match = re.search(r'(\d+)', time_str)
    if match:
        return int(match.group(1))
    return 120

for idx, slug in enumerate(slugs):
    url = f"https://ophim1.com/phim/{slug}"
    print(f"Fetching movie metadata {idx+1}/20: {slug}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            if "movie" in data:
                m = data["movie"]
                
                # Poster & Backdrop
                poster = m.get("poster_url", "")
                if not poster.startswith("http"):
                    poster = f"https://img.ophim.live/uploads/movies/{poster}"
                
                backdrop = m.get("thumb_url", "")
                if not backdrop.startswith("http"):
                    backdrop = f"https://img.ophim.live/uploads/movies/{backdrop}"
                
                # Type & Episodes
                m_type = "series" if m.get("type") == "series" else "movie"
                total_ep = 1
                try:
                    total_ep = int(m.get("episode_total", "1"))
                except ValueError:
                    total_ep = 12 if m_type == "series" else 1
                
                # Genres mapping
                genres_mapped = []
                for g in m.get("category", []):
                    mapped = map_genre(g.get("name", ""))
                    if mapped and mapped not in genres_mapped:
                        genres_mapped.append(mapped)
                if not genres_mapped:
                    genres_mapped = ["Hành động"]
                
                # Country mapping
                country_name = "Mỹ"
                countries = m.get("country", [])
                if countries:
                    country_name = map_country(countries[0].get("name", ""))
                
                # Ratings
                imdb = round(random.uniform(7.0, 9.2), 1)
                cv = round(random.uniform(8.0, 9.6), 1)
                total_ratings = random.randint(1000, 150000)
                total_views = random.randint(50000, 12000000)
                
                # Create mapped object
                movie_obj = {
                    "id": str(idx + 1),
                    "title": m.get("name", "").replace("'", "\\'"),
                    "originalTitle": m.get("origin_name", "").replace("'", "\\'"),
                    "slug": slug,
                    "type": m_type,
                    "status": "completed" if m.get("status") == "completed" else "ongoing",
                    "poster": poster,
                    "backdrop": backdrop,
                    "trailer": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", # default trailer
                    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    "description": clean_html(m.get("content", "")).replace("'", "\\'"),
                    "genres": genres_mapped,
                    "country": country_name,
                    "year": int(m.get("year", 2024)),
                    "duration": parse_duration(m.get("time", "")),
                    "director": (m.get("director", [""])[0] if m.get("director") else "Đang cập nhật").replace("'", "\\'"),
                    "cast": [c.replace("'", "\\'") for c in m.get("actor", [])[:5]] if m.get("actor") else ["Đang cập nhật"],
                    "imdbRating": imdb,
                    "cvRating": cv,
                    "totalRatings": total_ratings,
                    "totalViews": total_views,
                    "quality": ["1080p", "720p"],
                    "subtitles": ["Vietsub"],
                    "tags": genres_mapped + [country_name],
                    "isFeatured": True if idx < 5 else False,
                    "isHot": True if idx < 10 else False,
                    "isNew": True if idx >= 15 else False,
                    "createdAt": "2024-01-01",
                    "updatedAt": "2024-01-01"
                }
                
                if m_type == "series":
                    movie_obj["totalEpisodes"] = total_ep
                    movie_obj["currentEpisode"] = total_ep
                
                movie_objects.append(movie_obj)
                print(f"  -> Added: {movie_obj['title']} (Genres: {genres_mapped}, Country: {country_name})")
    except Exception as e:
        print(f"  -> Error: {e}")
    print()

# Write TS content
ts_content = """import { Movie } from '@/types';

// Helper function to simulate image placeholders (fallback)
export const PLACEHOLDER = (w: number, h: number, seed: number) => 
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const mockMovies: Movie[] = [
"""

for m in movie_objects:
    ts_content += "  {\n"
    for k, v in m.items():
        if isinstance(v, str):
            ts_content += f"    {k}: '{v}',\n"
        elif isinstance(v, bool):
            ts_content += f"    {k}: {str(v).lower()},\n"
        elif isinstance(v, list):
            items_str = ", ".join([f"'{x}'" for x in v])
            ts_content += f"    {k}: [{items_str}],\n"
        else:
            ts_content += f"    {k}: {v},\n"
    ts_content += "  },\n"

ts_content += """];

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
    f.write(ts_content)

print(f"Database generation complete! Wrote {len(movie_objects)} movies to mockMovies.ts.")
