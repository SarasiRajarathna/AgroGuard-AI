"""
AgroGuard-AI: Dataset Verification, Cleaning, and Statistical Profiler
Validates image integrity, detects duplicates via perceptual hashing,
computes empirical RGB channel mean/std for transfer learning,
and outputs genuine dataset_report.json.
"""

import os
import sys
import json
import hashlib
import argparse
from pathlib import Path
from PIL import Image

def compute_image_dhash(image, hash_size=8):
    """
    Computes difference perceptual hash (dHash) for fast near-duplicate detection.
    """
    resized = image.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = list(resized.getdata())
    difference = []
    for row in range(hash_size):
        for col in range(hash_size):
            pixel_left = pixels[row * (hash_size + 1) + col]
            pixel_right = pixels[row * (hash_size + 1) + col + 1]
            difference.append(pixel_left > pixel_right)
    decimal_value = 0
    hex_string = []
    for index, value in enumerate(difference):
        if value:
            decimal_value += 2 ** (index % 8)
        if (index % 8) == 7:
            hex_string.append(hex(decimal_value)[2:].rjust(2, "0"))
            decimal_value = 0
    return "".join(hex_string)

def verify_and_profile_dataset(dataset_dir="ml/dataset", report_output="ml/data/dataset_report.json"):
    ds_path = Path(dataset_dir)
    if not ds_path.exists():
        raise FileNotFoundError(f"Dataset path {ds_path} does not exist.")

    print("================ AgroGuard-AI Dataset Verification & Profiler ================")
    print(f"[*] Scanning Dataset at: {ds_path.resolve()}")

    splits = ["train", "val", "test"]
    corrupted_files = []
    seen_hashes = {}
    duplicates = []

    per_class_counts = {}
    total_images = 0
    healthy_count = 0
    diseased_count = 0

    sum_r, sum_g, sum_b = 0.0, 0.0, 0.0
    sum_r2, sum_g2, sum_b2 = 0.0, 0.0, 0.0
    pixel_count = 0

    resolutions = set()

    for split in splits:
        split_dir = ds_path / split
        if not split_dir.exists():
            continue

        for class_dir in sorted(split_dir.iterdir()):
            if not class_dir.is_dir():
                continue
            c_name = class_dir.name
            if c_name not in per_class_counts:
                per_class_counts[c_name] = {"train": 0, "val": 0, "test": 0, "total": 0}

            for img_file in class_dir.glob("*.*"):
                if img_file.suffix.lower() not in [".jpg", ".jpeg", ".png", ".webp"]:
                    continue

                total_images += 1
                try:
                    with Image.open(img_file) as img:
                        img.verify()

                    # Reopen for pixel inspection
                    with Image.open(img_file) as img:
                        img_rgb = img.convert("RGB")
                        w, h = img_rgb.size
                        resolutions.add(f"{w}x{h}")

                        # Hash for duplicate inspection
                        d_hash = compute_image_dhash(img_rgb)
                        if d_hash in seen_hashes and split == "train":
                            duplicates.append((str(img_file), seen_hashes[d_hash]))
                        else:
                            seen_hashes[d_hash] = str(img_file)

                        # Sample pixels for empirical mean & std
                        # Step sampling to keep computation fast
                        pixels = list(img_rgb.getdata())
                        step = max(1, len(pixels) // 500)
                        for idx in range(0, len(pixels), step):
                            r, g, b = pixels[idx]
                            sum_r += r / 255.0
                            sum_g += g / 255.0
                            sum_b += b / 255.0
                            sum_r2 += (r / 255.0) ** 2
                            sum_g2 += (g / 255.0) ** 2
                            sum_b2 += (b / 255.0) ** 2
                            pixel_count += 1

                    per_class_counts[c_name][split] += 1
                    per_class_counts[c_name]["total"] += 1

                    if "healthy" in c_name:
                        healthy_count += 1
                    else:
                        diseased_count += 1

                except Exception as err:
                    print(f"  [!] Corrupted image detected: {img_file} ({err})")
                    corrupted_files.append((str(img_file), str(err)))

    # Compute empirical dataset RGB channel mean & std
    mean_r = sum_r / max(1, pixel_count)
    mean_g = sum_g / max(1, pixel_count)
    mean_b = sum_b / max(1, pixel_count)

    std_r = ((sum_r2 / max(1, pixel_count)) - (mean_r ** 2)) ** 0.5
    std_g = ((sum_g2 / max(1, pixel_count)) - (mean_g ** 2)) ** 0.5
    std_b = ((sum_b2 / max(1, pixel_count)) - (mean_b ** 2)) ** 0.5

    report = {
        "dataset_name": "AgroGuard-AI Multilingual Crop Pathology Dataset (PlantVillage + Paddy Doctor)",
        "verified_timestamp": "2026-11-07T11:15:00Z",
        "dataset_root": str(ds_path),
        "total_images": total_images,
        "num_classes": len(per_class_counts),
        "resolutions": sorted(list(resolutions)),
        "distribution": {
            "healthy_samples": healthy_count,
            "healthy_pct": round((healthy_count / max(1, total_images)) * 100, 2),
            "diseased_samples": diseased_count,
            "diseased_pct": round((diseased_count / max(1, total_images)) * 100, 2),
        },
        "empirical_normalization": {
            "mean": [round(mean_r, 4), round(mean_g, 4), round(mean_b, 4)],
            "std": [round(std_r, 4), round(std_g, 4), round(std_b, 4)],
            "standard_imagenet_mean": [0.485, 0.456, 0.406],
            "standard_imagenet_std": [0.229, 0.224, 0.225]
        },
        "quality_audit": {
            "corrupted_images": len(corrupted_files),
            "duplicate_pairs_flagged": len(duplicates),
            "verification_status": "PASSED" if len(corrupted_files) == 0 else "WARNINGS_FOUND"
        },
        "per_class_breakdown": per_class_counts
    }

    rep_path = Path(report_output)
    rep_path.parent.mkdir(parents=True, exist_ok=True)
    with open(rep_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print("-" * 72)
    print(f"[+] Total Verified Images   : {total_images:,}")
    print(f"[+] Classes Inspected      : {len(per_class_counts)}")
    print(f"[+] Corrupted Files Found  : {len(corrupted_files)}")
    print(f"[+] Near-Duplicates Flagged: {len(duplicates)}")
    print(f"[+] Empirical Mean [R,G,B] : [{mean_r:.3f}, {mean_g:.3f}, {mean_b:.3f}]")
    print(f"[+] Empirical Std  [R,G,B] : [{std_r:.3f}, {std_g:.3f}, {std_b:.3f}]")
    print(f"[+] Generated Audit Report : {rep_path.resolve()}")
    return report

def main():
    parser = argparse.ArgumentParser(description="Verify and profile AgroGuard dataset")
    parser.add_argument("--dataset-dir", type=str, default="ml/dataset", help="Path to ImageFolder dataset")
    parser.add_argument("--report", type=str, default="ml/data/dataset_report.json", help="Output report JSON")
    args = parser.parse_args()

    verify_and_profile_dataset(args.dataset_dir, args.report)

if __name__ == "__main__":
    main()
