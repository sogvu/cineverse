import urllib.request
import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
}

url = "https://rophims.co.uk/xem-phim/hanh-tinh-cat-phan-hai"
print(f"Fetching {url}...")
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8')
        print(f"HTML Length: {len(html)}")
        
        # Print any URL containing api, player, embed, m3u8, vidsrc, or stream
        urls = re.findall(r'"(https?://[^"]+)"', html)
        urls += re.findall(r"'(https?://[^']+)'", html)
        
        print("\nFound absolute URLs:")
        unique_urls = list(set(urls))
        for u in sorted(unique_urls):
            # Filter out generic tags
            if not any(x in u for x in ["google", "facebook", "w3.org", "schema.org", "react", "nextjs", "webpack"]):
                print(f"  - {u}")
                
        # Let's search for script tags containing variables or links
        scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL | re.IGNORECASE)
        print(f"\nFound {len(scripts)} script tags.")
        for idx, script in enumerate(scripts):
            if any(x in script.lower() for x in ["player", "video", "source", "m3u8", "hls", "embed"]):
                print(f"Script #{idx+1} contains player/video keyword (length: {len(script)}):")
                # Print first 300 chars of matching script
                print(script[:500])
                print("-" * 30)
                
except Exception as e:
    print(f"Error: {e}")
