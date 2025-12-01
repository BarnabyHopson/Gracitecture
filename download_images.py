#!/usr/bin/env python3
"""
Download building images from Wikimedia Commons
"""
import json
import requests
import time
from pathlib import Path
from urllib.parse import quote

def get_commons_image_url(building_name):
    """Search Wikimedia Commons and get high-res image URL"""
    
    # Search for the building on Commons
    search_url = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "list": "search",
        "srsearch": building_name,
        "srnamespace": "6",  # File namespace
        "srlimit": "1"
    }
    
    headers = {
        "User-Agent": "GracitectureApp/1.0 (Educational architecture app; barnaby@example.com)"
    }
    
    try:
        response = requests.get(search_url, params=params, headers=headers, timeout=10)
        data = response.json()
        
        if not data.get("query", {}).get("search"):
            print(f"  ❌ No results found for: {building_name}")
            return None
        
        # Get the first result's filename
        filename = data["query"]["search"][0]["title"]
        
        # Get image info to find the actual URL
        info_params = {
            "action": "query",
            "format": "json",
            "titles": filename,
            "prop": "imageinfo",
            "iiprop": "url|size",
            "iiurlwidth": "2000"  # Request 2000px wide version
        }
        
        response = requests.get(search_url, params=info_params, headers=headers, timeout=10)
        data = response.json()
        
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            imageinfo = page.get("imageinfo", [])
            if imageinfo:
                # Try to get the thumburl (scaled version), fallback to full url
                image_url = imageinfo[0].get("thumburl") or imageinfo[0].get("url")
                return image_url
        
        print(f"  ❌ No image URL found for: {building_name}")
        return None
        
    except Exception as e:
        print(f"  ❌ Error fetching {building_name}: {str(e)}")
        return None

def download_image(url, output_path):
    """Download image from URL to file"""
    headers = {
        "User-Agent": "GracitectureApp/1.0 (Educational architecture app; barnaby@example.com)"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30, stream=True)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return True
    except Exception as e:
        print(f"  ❌ Download failed: {str(e)}")
        return False

def main():
    # Load buildings.json
    data_path = Path(__file__).parent / "data" / "buildings.json"
    output_dir = Path(__file__).parent / "public" / "images"
    
    with open(data_path, 'r') as f:
        buildings = json.load(f)
    
    print(f"Found {len(buildings)} buildings to download")
    print(f"Output directory: {output_dir}\n")
    
    successful = 0
    failed = 0
    
    for i, building in enumerate(buildings, 1):
        building_name = building["name"]
        building_id = building["id"]
        output_file = output_dir / f"{building_id}.jpg"
        
        print(f"[{i}/{len(buildings)}] {building_name}")
        
        # Skip if already exists
        if output_file.exists():
            print(f"  ✓ Already exists, skipping")
            successful += 1
            continue
        
        # Search and get image URL
        image_url = get_commons_image_url(building_name)
        
        if not image_url:
            failed += 1
            time.sleep(2)  # Be polite even on failure
            continue
        
        print(f"  📥 Downloading...")
        
        # Download the image
        if download_image(image_url, output_file):
            print(f"  ✓ Saved to {building_id}.jpg")
            successful += 1
        else:
            failed += 1
        
        # Be polite - wait 2 seconds between requests
        if i < len(buildings):
            time.sleep(2)
    
    print(f"\n{'='*50}")
    print(f"Download complete!")
    print(f"Successful: {successful}/{len(buildings)}")
    print(f"Failed: {failed}/{len(buildings)}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
