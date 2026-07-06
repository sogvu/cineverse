import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

slugs = {
    "1": "hanh-tinh-cat-phan-hai",
    "2": "oppenheimer",
    "3": "ve-binh-dai-ngan-ha-3",
    "4": "one-piece-film-red",
    "5": "the-batman",  # Let's test "the-batman" or "nguoi-doi"
    "6": "tro-choi-con-muc",  # Let's test "tro-choi-con-muc"
    "7": "ky-sinh-trung",
    "8": "dai-chien-titan-phan-4",  # Let's test
    "9": "thanh-guom-diet-quy-lang-tho-ren",  # Let's test
    "10": "avengers-hoi-ket",
    "11": "nhung-manh-ghep-cam-xuc-2",
    "12": "deadpool-va-wolverine",
    "13": "quai-vat-khong-gian-romulus",
    "14": "hanh-tinh-khi-vuong-quoc-moi",
    "15": "chu-thuat-hoi-chien-phan-2",  # Let's test
    "16": "mat-biec",
    "17": "nguoi-nhen-du-hanh-vu-tru-nhen",
    "18": "huong-mat-tua-khoi-suong",
    "19": "nhat-ky-tu-do-cua-toi",
    "20": "ho-den-tu-than"
}

alt_slugs = {
    "5": ["nguoi-doi", "the-batman-2022"],
    "6": ["tro-choi-con-muc-phan-1", "thu-thach-tro-choi-con-muc"],
    "8": ["dai-chien-titan-phan-cuoi", "dai-chien-titan-phan-cuoi-phan-2", "dai-chien-titan-viet-sub"],
    "9": ["thanh-guom-diet-quy-duong-den-lang-ren", "thanh-guom-diet-quy-phan-3-chuong-lang-ren"],
    "15": ["chu-thuat-hoi-chien-2", "jujutsu-kaisen-season-2"]
}

final_slugs = {}

for movie_id, slug in slugs.items():
    candidates = [slug] + alt_slugs.get(movie_id, [])
    found = False
    for candidate in candidates:
        url = f"https://ophim1.com/phim/{candidate}"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode('utf-8'))
                if data.get("status") == True or "movie" in data:
                    print(f"ID {movie_id} -> SUCCESS with '{candidate}': {data['movie'].get('name')}")
                    final_slugs[movie_id] = candidate
                    found = True
                    break
        except Exception:
            pass
    if not found:
        print(f"ID {movie_id} -> FAILED all candidates: {candidates}")

print("\nFinal verified mapping:")
print(json.dumps(final_slugs, indent=2, ensure_ascii=False))
