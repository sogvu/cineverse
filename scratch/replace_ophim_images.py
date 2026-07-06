import re

# OPhim image mappings we fetched
ophim_images = {
  "1": {
    "poster": "https://img.ophim.live/uploads/movies/hanh-tinh-cat-phan-hai-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/hanh-tinh-cat-phan-hai-thumb.jpg"
  },
  "2": {
    "poster": "https://img.ophim.live/uploads/movies/oppenheimer-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/oppenheimer-thumb.jpg"
  },
  "3": {
    "poster": "https://img.ophim.live/uploads/movies/ve-binh-dai-ngan-ha-3-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/ve-binh-dai-ngan-ha-3-thumb.jpg"
  },
  "4": {
    "poster": "https://img.ophim.live/uploads/movies/one-piece-film-red-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/one-piece-film-red-thumb.jpg"
  },
  "5": {
    "poster": "https://img.ophim.live/uploads/movies/nguoi-doi-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/nguoi-doi-thumb.jpg"
  },
  "6": {
    "poster": "https://img.ophim.live/uploads/movies/tro-choi-con-muc-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/tro-choi-con-muc-thumb.jpg"
  },
  "7": {
    "poster": "https://img.ophim.live/uploads/movies/ky-sinh-trung-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/ky-sinh-trung-thumb.jpg"
  },
  "8": {
    "poster": "https://img.ophim.live/uploads/movies/dai-chien-titan-phan-4-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/dai-chien-titan-phan-4-thumb.jpg"
  },
  "9": {
    "poster": "https://img.ophim.live/uploads/movies/thanh-guom-diet-quy-lang-tho-ren-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/thanh-guom-diet-quy-lang-tho-ren-thumb.jpg"
  },
  "10": {
    "poster": "https://img.ophim.live/uploads/movies/avengers-hoi-ket-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/avengers-hoi-ket-thumb.jpg"
  },
  "11": {
    "poster": "https://img.ophim.live/uploads/movies/nhung-manh-ghep-cam-xuc-2-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/nhung-manh-ghep-cam-xuc-2-thumb.jpg"
  },
  "12": {
    "poster": "https://img.ophim.live/uploads/movies/deadpool-va-wolverine-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/deadpool-va-wolverine-thumb.jpg"
  },
  "13": {
    "poster": "https://img.ophim.live/uploads/movies/quai-vat-khong-gian-romulus-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/quai-vat-khong-gian-romulus-thumb.jpg"
  },
  "14": {
    "poster": "https://img.ophim.live/uploads/movies/hanh-tinh-khi-vuong-quoc-moi-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/hanh-tinh-khi-vuong-quoc-moi-thumb.jpg"
  },
  "15": {
    "poster": "https://img.ophim.live/uploads/movies/chu-thuat-hoi-chien-2-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/chu-thuat-hoi-chien-2-thumb.jpg"
  },
  "16": {
    "poster": "https://img.ophim.live/uploads/movies/mat-biec-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/mat-biec-thumb.jpg"
  },
  "17": {
    "poster": "https://img.ophim.live/uploads/movies/nguoi-nhen-du-hanh-vu-tru-nhen-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/nguoi-nhen-du-hanh-vu-tru-nhen-thumb.jpg"
  },
  "18": {
    "poster": "https://img.ophim.live/uploads/movies/huong-mat-tua-khoi-suong-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/huong-mat-tua-khoi-suong-thumb.jpg"
  },
  "19": {
    "poster": "https://img.ophim.live/uploads/movies/nhat-ky-tu-do-cua-toi-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/nhat-ky-tu-do-cua-toi-thumb.jpg"
  },
  "20": {
    "poster": "https://img.ophim.live/uploads/movies/ho-den-tu-than-poster.jpg",
    "backdrop": "https://img.ophim.live/uploads/movies/ho-den-tu-than-thumb.jpg"
  }
}

file_path = "../data/mockMovies.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Split by "{ id: 'X'" or similar to replace poster and backdrop inside each block
blocks = content.split("  {\n    id: '")
new_content_parts = [blocks[0]]

for block in blocks[1:]:
    movie_id_match = re.match(r'^([^"\']+)', block)
    if movie_id_match:
        movie_id = movie_id_match.group(1)
        if movie_id in ophim_images:
            images = ophim_images[movie_id]
            # Replace poster
            # Matches poster: '...'
            block = re.sub(
                r"poster:\s*'[^']+'",
                f"poster: '{images['poster']}'",
                block
            )
            # Replace backdrop
            block = re.sub(
                r"backdrop:\s*'[^']+'",
                f"backdrop: '{images['backdrop']}'",
                block
            )
            print(f"Replaced OPhim images for movie ID {movie_id}")
    new_content_parts.append(block)

final_content = "  {\n    id: '".join(new_content_parts)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(final_content)

print("Replacement complete!")
