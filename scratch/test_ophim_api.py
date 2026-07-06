import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

slug = "hanh-tinh-cat-phan-hai"
url = f"https://ophim1.com/phim/{slug}"
print(f"Fetching OPhim data from {url}...")
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as response:
        data = json.loads(response.read().decode('utf-8'))
        print("Success! Keys in response:", data.keys())
        if "movie" in data:
            m = data["movie"]
            print(f"Movie Title: {m.get('name')}")
            print(f"Original Title: {m.get('origin_name')}")
            print(f"Slug: {m.get('slug')}")
        if "episodes" in data:
            eps = data["episodes"]
            print(f"Found {len(eps)} episode groups.")
            for g in eps:
                print(f"Group: {g.get('server_name')}")
                server_data = g.get('server_data', [])
                print(f"  Total episodes: {len(server_data)}")
                for idx, ep in enumerate(server_data[:2]):
                    print(f"  Ep {ep.get('name')}:")
                    print(f"    Embed: {ep.get('link_embed')}")
                    print(f"    M3U8: {ep.get('link_m3u8')}")
except Exception as e:
    print(f"Error: {e}")
