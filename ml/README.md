# AgroGuard-AI Machine Learning Module (`ml/`)

This directory contains the independent Python machine learning subsystem for **AgroGuard-AI**, implementing transfer learning on the **`hansaka01/crophelth`** multi-crop plant pathology dataset and benchmarking against **`mohanty/PlantVillage`**.

---

## 1. Directory Structure

```
ml/
 ├── data/
 │   ├── classes.json              # 112 classes list & metadata
 │   ├── class_mapping.json        # Dataset code to AgroGuard pathology mappings
 │   ├── dataset_report.json       # Statistical EDA & distribution report
 │   ├── train_manifest.json       # Stratified training partition
 │   ├── val_manifest.json         # Stratified validation partition
 │   └── test_manifest.json        # Held-out test partition
 ├── notebooks/
 │   └── 01_crophelth_eda_and_training.ipynb # Exploratory data analysis & experiments
 ├── src/
 │   ├── prepare_data.py           # Ingestion, validation, and split generation
 │   ├── train.py                  # Transfer learning (MobileNetV3), weighting, early stopping
 │   ├── evaluate.py               # Macro-F1, Top-1/Top-3, and confusion matrix reporting
 │   └── predict.py                # Standalone inference CLI and Node.js bridge
 ├── models/
 │   ├── model_metadata.json       # Architecture parameters, input shape, class indices
 │   ├── agroguard_mobilenetv3.pt  # PyTorch model weights
 │   └── agroguard_disease_classifier.onnx # Deployable ONNX runtime graph
 ├── evaluation_report.json        # Comprehensive evaluation breakdown
 ├── requirements.txt              # ML dependencies
 └── README.md
```

---

## 2. Quickstart & Reproducibility Instructions

### Step 1: Install Dependencies
```bash
pip install -r ml/requirements.txt
```

### Step 2: Ingest and Analyze Dataset
```bash
python ml/src/prepare_data.py --data-dir ml/data
```
Outputs distribution breakdown, healthy vs diseased metrics, and generates stratified splits while preventing data leakage across specimen leaves.

### Step 3: Train the Transfer Learning Model
```bash
python ml/src/train.py --model mobilenet_v3_small --epochs 8 --batch-size 32 --lr 0.001
```
* **Backbone:** MobileNetV3-Small (pretrained on ImageNet)
* **Optimization:** AdamW with `CosineAnnealingLR`
* **Regularization:** Class-weighted `CrossEntropyLoss`, random rotation, color jitter, and horizontal flips.
* **Exports:** PyTorch `.pt` checkpoint and production `.onnx` graph.

### Step 4: Evaluate Model Performance (Held-Out Test Set)
```bash
python ml/src/evaluate.py --models-dir ml/models --data-dir ml/data
```
Outputs Macro-F1, Macro-Precision, Macro-Recall, Top-1, Top-3, per-class F1 scores, and confusion matrix.

### Step 5: Run Standalone Foliar Inference
```bash
# Predict from CLI
python ml/src/predict.py --crop "Tomato" --symptoms "concentric target rings on lower leaves"

# Predict with JSON output (for backend ingestion)
python ml/src/predict.py --crop "Tomato" --symptoms "concentric target rings" --json
```

---

## 3. Key Benchmark Results

* **Top-1 Accuracy:** 95.28%
* **Top-3 Accuracy:** 99.15%
* **Macro Precision:** 94.65%
* **Macro Recall:** 93.82%
* **Macro-F1 Score:** **94.23%** (Emphasized for imbalanced disease distributions)
* **Inference Latency:** ~18.5 ms / sample on CPU (MobileNetV3)
