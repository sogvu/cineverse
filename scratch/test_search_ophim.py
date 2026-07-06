import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

queries = ["Lật Mặt", "Tây Du Ký", "Conan"]

for q in queries:
    url = f"https://ophim1.com/v1/api/tim-kiem?keyword={urllib.parse.quote(q)}"
    print(f"Searching for '{q}'...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            items = data.get("data", {}).get("items", [])
            print(f"Found {len(items)} items:")
            for item in items[:5]:
                print(f"  - {item.get('name')} -> Slug: {item.get('slug')}")
    except Exception as e:
        print(f"  Error: {e}")
    print()
