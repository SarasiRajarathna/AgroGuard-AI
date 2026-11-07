"""
AgroGuard-AI: Standard PyTorch ImageFolder Split Builder
Creates structured train / val / test partitions for torchvision.datasets.ImageFolder
with deterministic stratified sampling and zero data leakage.
"""

import os
import shutil
import random
import argparse
from pathlib import Path

SEED = 42
random.seed(SEED)

def build_stratified_splits(
    raw_dir="ml/raw_data",
    output_dir="ml/dataset",
    train_ratio=0.70,
    val_ratio=0.15,
    test_ratio=0.15
):
    raw_path = Path(raw_dir)
    out_path = Path(output_dir)

    if not raw_path.exists():
        raise FileNotFoundError(f"Raw data directory does not exist: {raw_path}. Run download_dataset.py first.")

    class_dirs = [d for d in raw_path.iterdir() if d.is_dir()]
    if not class_dirs:
        raise ValueError(f"No class subdirectories found in {raw_path}")

    # Prepare output split directories
    splits = ["train", "val", "test"]
    for s in splits:
        (out_path / s).mkdir(parents=True, exist_ok=True)

    print("================ AgroGuard-AI Dataset Split Builder ================")
    print(f"[*] Raw Source Directory : {raw_path.resolve()}")
    print(f"[*] Target ImageFolder   : {out_path.resolve()}")
    print(f"[*] Split Ratios         : Train={int(train_ratio*100)}% | Val={int(val_ratio*100)}% | Test={int(test_ratio*100)}%")
    print(f"[*] Found Target Classes : {len(class_dirs)}")
    print("-" * 72)

    total_train = 0
    total_val = 0
    total_test = 0

    for c_dir in sorted(class_dirs):
        class_name = c_dir.name
        images = list(c_dir.glob("*.jpg")) + list(c_dir.glob("*.png")) + list(c_dir.glob("*.jpeg"))
        random.shuffle(images)

        n_total = len(images)
        if n_total == 0:
            continue

        n_train = max(1, int(n_total * train_ratio))
        n_val = max(1, int(n_total * val_ratio))
        n_test = n_total - n_train - n_val
        if n_test <= 0:
            n_test = 1
            if n_train > 2:
                n_train -= 1

        train_imgs = images[:n_train]
        val_imgs = images[n_train:n_train + n_val]
        test_imgs = images[n_train + n_val:]

        # Destination directories
        train_dest = out_path / "train" / class_name
        val_dest = out_path / "val" / class_name
        test_dest = out_path / "test" / class_name

        train_dest.mkdir(parents=True, exist_ok=True)
        val_dest.mkdir(parents=True, exist_ok=True)
        test_dest.mkdir(parents=True, exist_ok=True)

        for img in train_imgs:
            shutil.copy2(img, train_dest / img.name)
        for img in val_imgs:
            shutil.copy2(img, val_dest / img.name)
        for img in test_imgs:
            shutil.copy2(img, test_dest / img.name)

        total_train += len(train_imgs)
        total_val += len(val_imgs)
        total_test += len(test_imgs)

        print(f"  ✓ {class_name:<30} -> Train: {len(train_imgs):2d} | Val: {len(val_imgs):2d} | Test: {len(test_imgs):2d} (Total: {n_total})")

    print("-" * 72)
    print(f"[+] Total Dataset Summary:")
    print(f"    - Training Set   : {total_train:,} images ({out_path}/train)")
    print(f"    - Validation Set : {total_val:,} images ({out_path}/val)")
    print(f"    - Test Set       : {total_test:,} images ({out_path}/test)")
    print(f"    - Grand Total    : {total_train + total_val + total_test:,} images")
    print(f"[+] Ready for PyTorch torchvision.datasets.ImageFolder training!")
    return {
        "train": total_train,
        "val": total_val,
        "test": total_test,
        "classes": [d.name for d in class_dirs]
    }

def main():
    parser = argparse.ArgumentParser(description="Build PyTorch ImageFolder Splits")
    parser.add_argument("--raw-dir", type=str, default="ml/raw_data", help="Raw images directory")
    parser.add_argument("--output-dir", type=str, default="ml/dataset", help="Output PyTorch ImageFolder directory")
    args = parser.parse_args()

    build_stratified_splits(
        raw_dir=args.raw_dir,
        output_dir=args.output_dir
    )

if __name__ == "__main__":
    main()
