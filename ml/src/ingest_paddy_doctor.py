"""
AgroGuard-AI: Paddy Doctor Dataset Ingestion & Auto-Extractor
Extracts and maps all 10,407 Paddy Doctor field photos from Kaggle into ml/raw_data/
with AgroGuard standardized taxonomy.
"""

import os
import sys
import zipfile
import shutil
import argparse
from pathlib import Path

# Mapping Kaggle class folder names to AgroGuard standardized taxonomy
PADDY_DOCTOR_CLASS_MAP = {
    "blast": "paddy_blast",
    "normal": "paddy_healthy",
    "bacterial_leaf_blight": "paddy_bacterial_leaf_blight",
    "bacterial_leaf_streak": "paddy_bacterial_leaf_streak",
    "bacterial_panicle_blight": "paddy_bacterial_panicle_blight",
    "brown_spot": "paddy_brown_spot",
    "dead_heart": "paddy_dead_heart",
    "downy_mildew": "paddy_downy_mildew",
    "hispa": "paddy_hispa",
    "tungro": "paddy_tungro",
}

def find_zip_file(search_paths):
    """
    Searches common locations for the downloaded Paddy Doctor zip file.
    """
    possible_names = [
        "paddy-disease-classification.zip",
        "train_images.zip",
        "paddy-disease-classification",
    ]
    for sp in search_paths:
        p = Path(sp).expanduser()
        if not p.exists():
            continue
        for name in possible_names:
            candidate = p / name
            if candidate.is_file():
                return candidate
    return None

def extract_and_ingest_paddy_doctor(zip_path_str=None, dest_dir="ml/raw_data"):
    dest_path = Path(dest_dir)
    dest_path.mkdir(parents=True, exist_ok=True)

    print("================ AgroGuard-AI Paddy Doctor Ingestion ================")

    zip_file = None
    if zip_path_str:
        candidate = Path(zip_path_str).expanduser()
        if candidate.is_file():
            zip_file = candidate

    if not zip_file:
        # Search in ml/, current directory, and user Downloads
        search_dirs = [
            Path("ml"),
            Path("."),
            Path.home() / "Downloads",
            Path.home() / "Desktop",
        ]
        zip_file = find_zip_file(search_dirs)

    if not zip_file:
        print("[!] Could not automatically locate 'paddy-disease-classification.zip'.")
        print("    Please provide the path using: python ml/src/ingest_paddy_doctor.py --zip-path <path/to/zip>")
        print("    Example: python ml/src/ingest_paddy_doctor.py --zip-path C:/Users/.../Downloads/paddy-disease-classification.zip")
        return False

    print(f"[*] Found Paddy Doctor Archive : {zip_file.resolve()} ({zip_file.stat().st_size / (1024*1024):.1f} MB)")
    print(f"[*] Extracting into Target Dir  : {dest_path.resolve()}")
    print("-" * 72)

    temp_extract = dest_path.parent / "_temp_paddy_extract"
    temp_extract.mkdir(parents=True, exist_ok=True)

    try:
        with zipfile.ZipFile(zip_file, "r") as zf:
            print("[*] Unzipping archive contents...")
            zf.extractall(temp_extract)

        # Handle nested zip if the competition zip contains train_images.zip
        nested_train_zip = temp_extract / "train_images.zip"
        if nested_train_zip.exists():
            print("[*] Unpacking nested train_images.zip...")
            with zipfile.ZipFile(nested_train_zip, "r") as nz:
                nz.extractall(temp_extract / "train_images")

        # Locate train_images directory
        source_dir = None
        for candidate in [
            temp_extract / "train_images",
            temp_extract / "paddy-disease-classification" / "train_images",
            temp_extract,
        ]:
            if candidate.exists() and any((candidate / k).exists() for k in PADDY_DOCTOR_CLASS_MAP.keys()):
                source_dir = candidate
                break

        if not source_dir:
            # Fallback: search for blast folder
            for p in temp_extract.rglob("blast"):
                if p.is_dir():
                    source_dir = p.parent
                    break

        if not source_dir:
            print("[!] Could not find class subfolders inside the zip archive.")
            return False

        print(f"[*] Ingesting images from: {source_dir}")
        total_migrated = 0

        for raw_class, target_class in PADDY_DOCTOR_CLASS_MAP.items():
            src_class_dir = source_dir / raw_class
            if not src_class_dir.is_dir():
                continue

            target_class_dir = dest_path / target_class
            target_class_dir.mkdir(parents=True, exist_ok=True)

            images = list(src_class_dir.glob("*.jpg")) + list(src_class_dir.glob("*.png")) + list(src_class_dir.glob("*.jpeg"))
            for img in images:
                shutil.copy2(img, target_class_dir / img.name)
                total_migrated += 1

            print(f"  ✓ {raw_class:<25} -> {target_class:<30} ({len(images):,} images)")

        print("-" * 72)
        print(f"[+] Paddy Doctor Ingestion Complete: {total_migrated:,} images ready in {dest_path}")
        return True

    finally:
        # Clean up temporary extracted directory
        if temp_extract.exists():
            shutil.rmtree(temp_extract, ignore_errors=True)

def main():
    parser = argparse.ArgumentParser(description="Ingest Paddy Doctor Kaggle dataset")
    parser.add_argument("--zip-path", type=str, default=None, help="Path to paddy-disease-classification.zip")
    parser.add_argument("--dest-dir", type=str, default="ml/raw_data", help="Destination folder for raw images")
    args = parser.parse_args()

    extract_and_ingest_paddy_doctor(args.zip_path, args.dest_dir)

if __name__ == "__main__":
    main()
