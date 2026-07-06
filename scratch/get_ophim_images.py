import urllib.request
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

slugs = {
  "1": "hanh-tinh-cat-phan-hai",
  "2": "oppenheimer",
  "3": "ve-binh-dai-ngan-ha-3",
  "4": "one-piece-film-red",
  "5": "nguoi-doi",
  "6": "tro-choi-con-muc",
  "7": "ky-sinh-trung",
  "8": "dai-chien-titan-phan-4",
  "9": "thanh-guom-diet-quy-lang-tho-ren",
  "10": "avengers-hoi-ket",
  "11": "nhung-manh-ghep-cam-xuc-2",
  "12": "deadpool-va-wolverine",
  "13": "quai-vat-khong-gian-romulus",
  "14": "hanh-tinh-khi-vuong-quoc-moi",
  "15": "chu-thuat-hoi-chien-2",
  "16": "mat-biec",
  "17": "nguoi-nhen-du-hanh-vu-tru-nhen",
  "18": "huong-mat-tua-khoi-suong",
  "19": "nhat-ky-tu-do-cua-toi",
  "20": "ho-den-tu-than"
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

image_mapping = {}

for movie_id, slug in slugs.items():
    url = f"https://ophim1.com/phim/{slug}"
    print(f"Fetching images for movie ID {movie_id} (slug: {slug})...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            if "movie" in data:
                m = data["movie"]
                poster = m.get("poster_url", "")
                thumb = m.get("thumb_url", "")
                
                # Check if absolute
                if not poster.startswith("http"):
                    poster = f"https://img.ophim.live/uploads/movies/{poster}"
                if not thumb.startswith("http"):
                    thumb = f"https://img.ophim.live/uploads/movies/{thumb}"
                
                image_mapping[movie_id] = {
                    "poster": poster,
                    "backdrop": thumb
                }
                print(f"  -> Poster: {poster}")
                print(f"  -> Backdrop: {thumb}")
    except Exception as e:
        print(f"  -> Error: {e}")
    print()

print("Final Image Mapping:")
print(json.dumps(image_mapping, indent=2, ensure_ascii=False))

with open("ophim_images.json", "w", encoding="utf-8") as f:
    json.dump(image_mapping, f, ensure_ascii=False, indent=2)
