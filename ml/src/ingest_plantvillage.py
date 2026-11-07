"""
AgroGuard-AI: PlantVillage Multi-Crop Ingestion & Standardizer
Extracts and normalizes Tomato, Potato, Corn, Chilli/Pepper, and other crops
from PlantVillage (emmarex/plantdisease or abdallahalidev/plantvillage-dataset)
directly alongside Paddy Doctor into ml/raw_data/.
"""

import os
import sys
import zipfile
import shutil
import argparse
from pathlib import Path

# Mapping PlantVillage directory names to AgroGuard standardized taxonomy
PLANTVILLAGE_CLASS_MAP = {
    # Tomato
    "Tomato___Early_blight": "tomato_early_blight",
    "Tomato___Late_blight": "tomato_late_blight",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "tomato_yellow_leaf_curl_virus",
    "Tomato___Bacterial_spot": "tomato_bacterial_spot",
    "Tomato___Leaf_Mold": "tomato_mold",
    "Tomato___Septoria_leaf_spot": "tomato_septoria_leaf_spot",
    "Tomato___healthy": "tomato_healthy",
    # Potato
    "Potato___Early_blight": "potato_early_blight",
    "Potato___Late_blight": "potato_late_blight",
    "Potato___healthy": "potato_healthy",
    # Corn / Maize
    "Corn_(maize)___Common_rust_": "corn_rust",
    "Corn_(maize)___Northern_Leaf_Blight": "corn_northern_leaf_blight",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": "corn_gray_leaf_spot",
    "Corn_(maize)___healthy": "corn_healthy",
    # Chilli / Pepper
    "Pepper__bell___Bacterial_spot": "chilli_anthracnose",
    "Pepper__bell___healthy": "chilli_healthy",
}

def find_zip_file(search_paths):
    possible_names = [
        "plantdisease.zip",
        "plantvillage.zip",
        "plantvillage-dataset.zip",
        "PlantVillage.zip",
        "Plant_leave_diseases_dataset_without_augmentation.zip",
        "archive.zip",
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

def extract_and_ingest_plantvillage(zip_path_str=None, dest_dir="ml/raw_data", max_per_class=0):
    dest_path = Path(dest_dir)
    dest_path.mkdir(parents=True, exist_ok=True)

    print("================ AgroGuard-AI PlantVillage Ingestion ================")

    zip_file = None
    if zip_path_str:
        candidate = Path(zip_path_str).expanduser()
        if candidate.is_file():
            zip_file = candidate

    if not zip_file:
        search_dirs = [
            Path("ml"),
            Path("."),
            Path.home() / "Downloads",
            Path.home() / "Desktop",
        ]
        zip_file = find_zip_file(search_dirs)

    if not zip_file:
        print("[!] Could not automatically find 'plantdisease.zip' or 'plantvillage.zip'.")
        print("    Download PlantVillage from:")
        print("      https://www.kaggle.com/datasets/emmarex/plantdisease")
        print("      or run: kaggle datasets download -d emmarex/plantdisease -p ml/")
        print("    Then run:")
        print("      python ml/src/ingest_plantvillage.py --zip-path <path/to/plantdisease.zip>")
        return False

    print(f"[*] Found PlantVillage Archive: {zip_file.resolve()} ({zip_file.stat().st_size / (1024*1024):.1f} MB)")
    print(f"[*] Ingesting into Target     : {dest_path.resolve()}")
    print("-" * 72)

    temp_extract = dest_path.parent / "_temp_plantvillage_extract"
    temp_extract.mkdir(parents=True, exist_ok=True)

    try:
        with zipfile.ZipFile(zip_file, "r") as zf:
            print("[*] Unzipping PlantVillage archive...")
            zf.extractall(temp_extract)

        # Locate the subfolder containing tomato/potato directories
        source_dir = None
        for p in temp_extract.rglob("Tomato*"):
            if p.is_dir() and "early" in p.name.lower():
                source_dir = p.parent
                break

        if not source_dir:
            for p in temp_extract.rglob("PlantVillage*"):
                if p.is_dir():
                    source_dir = p
                    break

        if not source_dir:
            source_dir = temp_extract

        print(f"[*] Extracting classes from: {source_dir}")
        total_migrated = 0

        for raw_class, target_class in PLANTVILLAGE_CLASS_MAP.items():
            # Find matching folder flexibly
            matching_dirs = [
                d for d in source_dir.rglob("*")
                if d.is_dir() and d.name.lower() == raw_class.lower()
            ]

            if not matching_dirs:
                # Fuzzy match
                clean_raw = raw_class.replace("_", "").replace(" ", "").lower()
                matching_dirs = [
                    d for d in source_dir.rglob("*")
                    if d.is_dir() and d.name.replace("_", "").replace(" ", "").lower() == clean_raw
                ]

            if not matching_dirs:
                continue

            src_class_dir = matching_dirs[0]
            target_class_dir = dest_path / target_class
            target_class_dir.mkdir(parents=True, exist_ok=True)

            images = list(src_class_dir.glob("*.jpg")) + list(src_class_dir.glob("*.JPG")) + list(src_class_dir.glob("*.png"))
            if max_per_class > 0:
                images = images[:max_per_class]

            for img in images:
                shutil.copy2(img, target_class_dir / img.name)
                total_migrated += 1

            print(f"  ✓ {raw_class:<45} -> {target_class:<30} ({len(images):,} images)")

        print("-" * 72)
        print(f"[+] PlantVillage Ingestion Complete: {total_migrated:,} images merged into {dest_path}")
        return True

    finally:
        if temp_extract.exists():
            shutil.rmtree(temp_extract, ignore_errors=True)

def main():
    parser = argparse.ArgumentParser(description="Ingest PlantVillage dataset into AgroGuard")
    parser.add_argument("--zip-path", type=str, default=None, help="Path to PlantVillage zip file")
    parser.add_argument("--dest-dir", type=str, default="ml/raw_data", help="Target folder for raw images")
    parser.add_argument("--max-per-class", type=int, default=0, help="Max images per class (0 = all)")
    args = parser.parse_args()

    extract_and_ingest_plantvillage(args.zip_path, args.dest_dir, args.max_per_class)

if __name__ == "__main__":
    main()
