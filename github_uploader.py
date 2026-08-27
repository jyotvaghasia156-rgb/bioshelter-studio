#!/usr/bin/env python3
"""
BioShelter Studio - GitHub API Direct Publisher
Uploads repository files directly to GitHub using the GitHub REST API.
"""

import os
import sys
import json
import base64
import urllib.request
import urllib.error

GITHUB_USER = "jyotvaghasia156-rgb"
REPO_NAME = "bioshelter-studio"
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

def get_files_to_upload():
    ignore_dirs = {'.git', '__pycache__', 'tools'}
    ignore_files = {'bioshelter-studio.zip'}
    files_list = []
    
    for root, dirs, files in os.walk(PROJECT_DIR):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for f in files:
            if f in ignore_files or f.endswith('.pyc'):
                continue
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, PROJECT_DIR).replace('\\', '/')
            files_list.append((rel_path, full_path))
            
    return files_list

def create_or_update_file(token, rel_path, full_path):
    with open(full_path, 'rb') as f:
        content_bytes = f.read()
    content_b64 = base64.b64encode(content_bytes).decode('utf-8')
    
    url = f"https://api.github.com/repos/{GITHUB_USER}/{REPO_NAME}/contents/{rel_path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "BioShelter-Publisher"
    }
    
    # Check if file exists to obtain sha
    sha = None
    try:
        req = urllib.request.Request(url, headers=headers, method="GET")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            sha = data.get("sha")
    except urllib.error.HTTPError as e:
        if e.code != 404:
            pass

    payload = {
        "message": f"Add {rel_path} - BioShelter Studio Suite",
        "content": content_b64,
        "branch": "main"
    }
    if sha:
        payload["sha"] = sha
        
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method="PUT")
    try:
        with urllib.request.urlopen(req) as resp:
            return True, None
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8', errors='ignore')
        return False, err_msg
    except Exception as e:
        return False, str(e)

def main():
    print("=" * 70)
    print(f"  BioShelter Studio &bull; Direct GitHub API Publisher")
    print(f"  Target Repository: https://github.com/{GITHUB_USER}/{REPO_NAME}")
    print("=" * 70)
    
    token = ""
    if len(sys.argv) > 1:
        token = sys.argv[1].strip()
    else:
        print("\nEnter your GitHub Personal Access Token (from https://github.com/settings/tokens):")
        token = input("GitHub Token: ").strip()
        
    if not token:
        print("Error: GitHub Token is required.")
        return

    files = get_files_to_upload()
    print(f"\nFound {len(files)} files to upload to {GITHUB_USER}/{REPO_NAME}...")
    
    success_count = 0
    for rel_path, full_path in files:
        print(f"  Uploading: {rel_path}...", end="", flush=True)
        ok, err = create_or_update_file(token, rel_path, full_path)
        if ok:
            print(" [OK]")
            success_count += 1
        else:
            print(f" [FAILED: {err}]")
            
    print("\n" + "=" * 70)
    print(f"  Upload Complete: {success_count}/{len(files)} files published!")
    print(f"  View online: https://github.com/{GITHUB_USER}/{REPO_NAME}")
    print("=" * 70)

if __name__ == '__main__':
    main()
