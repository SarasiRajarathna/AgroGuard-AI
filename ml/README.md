# AgroGuard-AI Machine Learning Module (`ml/`)

This directory contains the Python machine learning subsystem for **AgroGuard-AI**, integrating **PlantVillage** benchmark pathology and the Sri Lankan **Paddy Doctor** dataset.

---

## 1. Directory Structure

```
ml/
 ├── data/
 │   ├── classes.json              # Full pathology classes list & metadata
 │   ├── class_mapping.json        # Dataset code to AgroGuard pathology mappings (including Paddy Doctor)
 │   └── dataset_report.json       # Empirical statistical EDA, RGB mean/std, and distribution report
 ├── dataset/                      # Standard PyTorch ImageFolder hierarchy
 │   ├── train/<class_code>/       # 70% stratified training partition
 │   ├── val/<class_code>/         # 15% validation partition
 │   └── test/<class_code>/        # 15% held-out test partition
 ├── notebooks/
 │   └── 01_crophelth_eda_and_training.ipynb # Exploratory data analysis & experiments
 ├── src/
 │   ├── download_dataset.py       # Downloads PlantVillage & Paddy Doctor, or builds authentic local starter sets
 │   ├── build_dataset_splits.py   # Stratified ImageFolder builder (70/15/15)
 │   ├── verify_dataset.py         # Image integrity verification, dHash duplicate detection, and RGB mean/std profiler
 │   ├── train.py                  # PyTorch transfer learning (MobileNetV3) with AdamW and cosine annealing
 │   ├── evaluate.py               # Macro-F1, Top-1/Top-3, and confusion matrix reporting
 │   ├── predict.py                # Standalone inference CLI
 │   └── export_real_onnx.py       # Exports PyTorch backbone to production binary ONNX graph
 ├── models/
 │   ├── model_metadata.json       # Architecture parameters, input shape, 27 target classes
 │   ├── agroguard_mobilenetv3.pt  # PyTorch model weights
 │   └── agroguard_disease_classifier.onnx # Deployable ONNX runtime graph
 ├── requirements.txt              # ML dependencies
 └── README.md
```

---

## 2. Dataset Pipeline Instructions (Step 02)

### Step 2.1: Ingest Raw Benchmark Data
Downloads PlantVillage & Paddy Doctor data from Hugging Face or generates realistic local starter specimens:
```bash
python ml/src/download_dataset.py --samples-per-class 50
```

### Step 2.2: Build Stratified ImageFolder Splits (70% / 15% / 15%)
Organizes raw images into standard PyTorch directory structure:
```bash
python ml/src/build_dataset_splits.py --raw-dir ml/raw_data --output-dir ml/dataset
```

### Step 2.3: Verify Image Integrity & Profile Empirical RGB Statistics
Checks for corrupt files, detects near-duplicates using difference hashing (dHash), and calculates true dataset normalization mean and std:
```bash
python ml/src/verify_dataset.py --dataset-dir ml/dataset
```

---

## 3. Training & Evaluation Pipeline (Step 03)

### Step 3.1: Train PyTorch MobileNetV3
```bash
python ml/src/train.py --model mobilenet_v3_small --epochs 10 --batch-size 32 --lr 0.001
```

### Step 3.2: Export to Production ONNX
```bash
python ml/src/export_real_onnx.py
```

### Step 3.3: Evaluate on Held-Out Test Set
```bash
python ml/src/evaluate.py --models-dir ml/models --data-dir ml/data
```
