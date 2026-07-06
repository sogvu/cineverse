import urllib.request
import urllib.parse
import json
import re
import sys
import random

sys.stdout.reconfigure(encoding='utf-8')

slugs = [
  "xin-chao-ban-trai-cua-toi",
  "se-duyen-dia-dai",
  "tieng-yeu-nay-anh-dich-duoc-khong",
  "chu-thuat-hoi-chien",
  "phi-vu-dong-troi-2",
  "iron-chef-brazil",
  "tieng-goi-con-tim",
  "lau-roi-chua-yeu",
  "cong-to-vien-lach-luat",
  "thuc-cam-nhan-gia",
  "pha-ken",
  "co-ay-chang-qua-khong-muon-thua",
  "marvel-zombies",
  "arcane",
  "phu-thuy-mayfair",
  "phu-nhan-dai-quan-the-ky-21",
  "cho-san-cong-ly",
  "biet-doi-sieu-kho",
  "nguyet-lan-y-ky",
  "fresh",
  "sieu-nhi-karate",
  "tham-tu-lung-danh-conan-con-ac-mong-den-toi",
  "dam-lay-chet-choc",
  "ki-niem-10-nam-loi-hoi-dap-1988",
  "bi-mat-noi-goc-toi",
  "bach-nguyet-phan-tinh",
  "dien-thoai-den",
  "nui-te-vong",
  "hay-de-toi-toa-sang",
  "ba-cau-chuyen-tinh",
  "violet-evergarden-hoi-uc-khong-quen",
  "ten-cau-la-gi",
  "khuyen-da-xoa",
  "ke-ngoai-lai-o-hoc-vien-ma-vuong",
  "nguoi-vo-ca-vang",
  "ngay-thay-doi-tu-menh",
  "mua-he-cua-ho-ly-ban-thai",
  "denied-love",
  "boys-in-love-khai-giang-trai-tim-hoc-cach-yeu",
  "bit-mat-bat-nai",
  "ba-hoang-luon-leo",
  "ma-phap-su-thuoc-tinh-nuoc",
  "nang-bup-be-thu-do-cua-toi-biet-yeu",
  "blue-lock-the-movie-episode-nagi",
  "tham-tu-lung-danh-conan-am-muu-tren-bien",
  "thu-linh-the-bai-sakura-the-bai-trong-suot",
  "gia-dinh-addams",
  "duoc-su-tu-su",
  "dai-chien-nguoi-khong-lo-phan-cuoi",
  "tieu-diem-giai-mua-dong-vuot-qua-nguong-cua",
  "quai-thu-vo-hinh-sat-thu-diet-sat-thu",
  "the-gioi-ky-ao-cua-gumball",
  "tom-and-jerry-in-new-york",
  "tham-tu-lung-danh-conan-con-tau-bien-mat-giua-troi-xanh",
  "dai-chien-titan-khon-cung",
  "mua-he-cua-luca",
  "the-cursed-2018",
  "ngoi-nha-mo-uoc",
  "thiet-quyen-vuong",
  "sex-and-the-emperor",
  "chuyen-tau-sinh-tu",
  "qua-nhanh-qua-nguy-hiem-7",
  "ke-di-giao",
  "lang-an-thit-nguoi"
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

GENRE_MAP = {
    "hành động": "Hành động", "hài hước": "Hài hước", "hài": "Hài hước",
    "tình cảm": "Tình cảm", "cổ trang": "Tình cảm", "chính kịch": "Tình cảm",
    "khoa học": "Khoa học viễn tưởng", "viễn tưởng": "Khoa học viễn tưởng",
    "kinh dị": "Kinh dị", "phiêu lưu": "Phiêu lưu", "tâm lý": "Tâm lý",
    "hình sự": "Tội phạm", "tội phạm": "Tội phạm", "chiến tranh": "Chiến tranh",
    "hoạt hình": "Hoạt hình", "gia đình": "Gia đình", "thể thao": "Thể thao",
    "lịch sử": "Lịch sử", "âm nhạc": "Âm nhạc", "nhạc": "Âm nhạc",
    "bí ẩn": "Tâm lý", "kinh diễn": "Lịch sử", "kinh điển": "Lịch sử", 
    "võ thuật": "Hành động", "thần thoại": "Khoa học viễn tưởng", 
    "lãng mạn": "Tình cảm",
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

def search_ophim_slug(original_slug):
    query = original_slug.replace('-', ' ')
    url = f"https://ophim1.com/v1/api/tim-kiem?keyword={urllib.parse.quote(query)}"
    try:
        data = fetch_json(url)
        items = data.get("data", {}).get("items", [])
        if items:
            return items[0].get("slug")
    except Exception as e:
        print(f"\nError searching for {query}: {e}")
    return None

print("=== Fetching full movie details for RoPhims slugs ===\n")
movie_objects = []

for idx, orig_slug in enumerate(slugs):
    slug = orig_slug
    url = f"https://ophim1.com/phim/{slug}"
    sys.stdout.write(f"\r  [{idx+1}/{len(slugs)}] {orig_slug[:45]:<45}")
    sys.stdout.flush()
    
    data = None
    try:
        data = fetch_json(url)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            resolved_slug = search_ophim_slug(orig_slug)
            if resolved_slug:
                slug = resolved_slug
                url = f"https://ophim1.com/phim/{slug}"
                try:
                    data = fetch_json(url)
                except Exception:
                    pass
    except Exception:
        pass

    if not data or not data.get("movie"):
        print(f"\n  -> [404/Error] Skipped: {orig_slug}")
        continue

    m = data.get("movie")
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
    category_slugs = [g.get("slug", "") for g in m.get("category", [])]
    
    genres_mapped = []
    for g in genres_raw:
        mg = map_genre(g)
        if mg and mg not in genres_mapped:
            genres_mapped.append(mg)
            
    # Check for cartoon indicators
    is_cartoon = False
    if "hoat-hinh" in category_slugs or "anime" in category_slugs:
        is_cartoon = True
    elif any(k in orig_slug for k in ["doraemon", "conan", "sakura", "blue-lock", "arcane", "gumball", "tom-and-jerry", "luca", "titan"]):
        is_cartoon = True

    if is_cartoon and "Hoạt hình" not in genres_mapped:
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
        "id": str(len(movie_objects) + 1),
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
        "isFeatured": False,
        "isHot": False,
        "isNew": False,
        "createdAt": "2024-01-01",
        "updatedAt": "2024-01-01",
    }
    if m_type == "series":
        movie_obj["totalEpisodes"] = total_ep
        movie_obj["currentEpisode"] = total_ep

    movie_objects.append(movie_obj)

num_movies = len(movie_objects)
print(f"\n\nSuccessfully fetched {num_movies} movies from OPhim backend")

for idx, m in enumerate(movie_objects):
    if idx < 6:
        m["isFeatured"] = True
    if idx < 20:
        m["isHot"] = True
    if idx >= num_movies - 20:
        m["isNew"] = True

# Generate TypeScript
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
