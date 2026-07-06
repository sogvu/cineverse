import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
}

url = "https://rophims.co.uk/trang-chu"
print(f"Fetching {url}...")
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8')
        print(f"HTML Length: {len(html)}")
        
        # Search for form elements
        forms = re.findall(r'<form[^>]*>.*?</form>', html, re.DOTALL | re.IGNORECASE)
        print(f"Found {len(forms)} form elements:")
        for idx, form in enumerate(forms):
            print(f"Form #{idx+1}:")
            print(form)
            print("-" * 40)
            
        # Also look for any search inputs or buttons
        inputs = re.findall(r'<input[^>]*>', html, re.IGNORECASE)
        print(f"Found {len(inputs)} input elements:")
        for inp in inputs:
            print(f"  {inp}")
            
except Exception as e:
    print(f"Error: {e}")
