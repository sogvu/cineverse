import re

# Database of TMDB URLs we fetched
real_images = {
    "1": {
        "poster": "https://media.themoviedb.org/t/p/w500/heM4XKC0jA8fTSNe8F7oUkcJV7Z.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg"
    },
    "2": {
        "poster": "https://media.themoviedb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg"
    },
    "3": {
        "poster": "https://media.themoviedb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg"
    },
    "4": {
        "poster": "https://media.themoviedb.org/t/p/w500/8ibfhe4P7rhmn3lrPhOZzIJHA2B.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/wghKvEjM7UzQzQcKnGbDjOyQO13.jpg"
    },
    "5": {
        "poster": "https://media.themoviedb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/IYUD7rAIXzBM91TT3Z5fILUS7n.jpg"
    },
    "6": {
        "poster": "https://media.themoviedb.org/t/p/w500/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/2meX1nMdScFOoV4370rqHWKmXhY.jpg"
    },
    "7": {
        "poster": "https://media.themoviedb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/wCuUKiRaz0wEESsYqmQy005xvTE.jpg"
    },
    "8": {
        "poster": "https://media.themoviedb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg"
    },
    "9": {
        "poster": "https://media.themoviedb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg"
    },
    "10": {
        "poster": "https://media.themoviedb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"
    },
    "11": {
        "poster": "https://media.themoviedb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg"
    },
    "12": {
        "poster": "https://media.themoviedb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/cOoVcVQ3i1m5b2xtqKBtoTSbxC1.jpg"
    },
    "13": {
        "poster": "https://media.themoviedb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/iYqSQaWDttQIQzsxg9xHyg0bttG.jpg"
    },
    "14": {
        "poster": "https://media.themoviedb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/fypydCipcWDKDTTCoPucBsdGYXW.jpg"
    },
    "15": {
        "poster": "https://media.themoviedb.org/t/p/w500/hzhiAK9fLl9yMCQ2fkMTdqKeuM.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/i8RqJMlroRdFNDHCYhzhGSgbD6R.jpg"
    },
    "16": {
        "poster": "https://media.themoviedb.org/t/p/w500/1oOyJsdcJnnE7cl9bZdUQvBjKNH.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/zs1I3ZFUDEWa5rFyph7OrMH1aJ9.jpg"
    },
    "17": {
        "poster": "https://media.themoviedb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/9xfDWXAUbFXQK585JvByT5pEAhe.jpg"
    },
    "18": {
        "poster": "https://media.themoviedb.org/t/p/w500/rndLKwZDPFpRe1J3FZuWqnW9qqc.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/rM6NNe8f7XoCJRsOmkNGC7q.jpg"
    },
    "19": {
        "poster": "https://media.themoviedb.org/t/p/w500/uJBCIn4WlEKzrAVUQ68UJW5xaVX.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/rKWecqbtCqpsdROPiO0q9v4YUZB.jpg"
    },
    "20": {
        "poster": "https://media.themoviedb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
        "backdrop": "https://image.tmdb.org/t/p/original/2ssWTSVklAEc98frZUQhgtGHx7s.jpg"
    }
}

file_path = "../data/mockMovies.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We can find blocks like { id: 'X', ... }
# Since we want to be 100% correct, let's parse using regex to find the blocks
# and replace inside them.
# The movie object starts with a { and ends with }, and has id: 'X'.
# We can find each block by matching:
# { followed by non-closing-brace characters until we find id: 'X', and then the rest of the block.
# Actually, we can split by "{", find the id, replace poster and backdrop, and join back.

blocks = content.split("  {\n    id: '")
new_content_parts = [blocks[0]]

for block in blocks[1:]:
    # The first few chars are the id up to the closing quote
    movie_id_match = re.match(r'^([^"\']+)', block)
    if movie_id_match:
        movie_id = movie_id_match.group(1)
        if movie_id in real_images:
            real = real_images[movie_id]
            # Replace poster
            block = re.sub(
                r'poster:\s*PLACEHOLDER\([^)]+\)',
                f"poster: '{real['poster']}'",
                block
            )
            # Replace backdrop
            block = re.sub(
                r'backdrop:\s*PLACEHOLDER\([^)]+\)',
                f"backdrop: '{real['backdrop']}'",
                block
            )
            print(f"Replaced images for movie ID {movie_id}")
    new_content_parts.append(block)

final_content = "  {\n    id: '".join(new_content_parts)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(final_content)

print("Replacement complete!")
