import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

queries = ["Dune", "Oppenheimer", "Mắt Biếc"]

for q in queries:
    url = f"https://ophim1.com/v1/api/tim-kiem?keyword={urllib.parse.quote(q)}"
    print(f"Searching for '{q}' at {url}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            print("Success! Keys:", data.keys())
            if "data" in data:
                d = data["data"]
                print("Data keys:", d.keys())
                if "items" in d:
                    items = d["items"]
                    print(f"Found {len(items)} items:")
                    for item in items[:5]:
                        print(f"  - {item.get('name')} ({item.get('origin_name')}) -> Slug: {item.get('slug')}")
            print()
    except Exception as e:
        print(f"Error searching for '{q}': {e}\n")
