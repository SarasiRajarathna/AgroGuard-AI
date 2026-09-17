# AgroGuard-AI: Dataset Provenance & Methodology (`DATASETS.md`)

This document records the exact provenance, licensing, structure, and integration methodology of all datasets used in **AgroGuard-AI**.

---

## 1. Primary Training & Evaluation Dataset: `hansaka01/crophelth`

* **Repository:** [Hugging Face: `hansaka01/crophelth`](https://huggingface.co/datasets/hansaka01/crophelth)
* **Author / Maintainer:** Hansaka Rasanjana (SLIIT — Sri Lanka Institute of Information Technology)
* **Date Accessed:** September 2026
* **Modalities:** Color RGB leaf photography (`.jpg`)
* **Total Volume:** ~125,000 images across 109 foliar pathology and healthy baseline classes
* **Crops Covered (26):** Apple, Banana, Blueberry, Cauliflower, Cherry, Chilli, Coffee, Corn/Maize, Grape, Lemon/Citrus, Orange, Peach, Peanut/Groundnut, Pepper, Potato, Radish, Raspberry, Rice (reserved manifest), Soybean, Squash, Strawberry, Tea, Tomato, etc.
* **Underlying Source Provenance:**
  * **PlantVillage Subset** (Mendeley `tywbtsjrjv`): ~52,000 images covering Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato (CC-BY 4.0 / Open Access).
  * **BananaLSD** (Mendeley `9tb7k297ff`): Original field captures of Sigatoka, Cordana, Pestalotiopsis, and Healthy bananas.
  * **teaLeafBD & Tea Sickness** (Mendeley `744vznw5k2` & `j32xdt2ff5`): 11 distinct tea pathology classes including Algal Leaf Spot, Anthracnose, Bird's Eye Spot, Brown Blight, Gray Blight, Green Mirid, Helopeltis, Red Leaf Spot, Red Spider, and White Spot.
  * **Multi-Crop Disease** (Mendeley `6243z8r6t6` via Roboflow): Chilli, Cauliflower, Peanut, Radish.
  * **BDLemonLeaf & Large-Scale Citrus** (Mendeley `643f5bbc2t` & `8d9fv6kpt3`): 18 lemon & citrus foliar pathology classes including Citrus Canker, Greening (HLB), Melanose, and Sooty Mold.
  * **RoCoLe** (Mendeley `c5yvn32dzg`): Robusta Coffee healthy/unhealthy.
  * **Bananas TZ** (Harvard Dataverse `LQUWXW`): ~15,000 high-resolution field photos of Banana Fusarium Wilt, Black Sigatoka, and healthy leaves.
  * **PlantDoc** (GitHub `pratikkayal/PlantDoc-Dataset`): 28 in-field classes.

---

## 2. Supplementary Benchmark Dataset: `mohanty/PlantVillage`

* **Repository:** [Hugging Face: `mohanty/PlantVillage`](https://huggingface.co/datasets/mohanty/PlantVillage) & [Mendeley Data](https://data.mendeley.com/datasets/tywbtsjrjv/1)
* **Citation:** Mohanty, S. P., Hughes, D. P., & Salathé, M. (2016). *Using deep learning for image-based plant disease detection.* Frontiers in Plant Science, 7, 1419.
* **Total Volume:** 54,306 images across 14 crops and 26 diseases + 12 healthy categories.
* **Configurations:** `color` (default 256x256 RGB), `grayscale`, `segmented`.
* **Grouping & Data Leakage Prevention:** Uses `leaf_id` metadata to group images belonging to the same physical leaf specimen during train/validation/test splitting, preventing optimistic evaluation leakage.
* **Role in AgroGuard-AI:** Used as a standard laboratory-condition benchmark for cross-validation against the broader `crophelth` dataset.

---

## 3. Dataset Mapping to AgroGuard Knowledge Base

AgroGuard-AI maintains a strict, verified mapping between dataset classes and the application's plant pathology knowledge base. We **do not** artificially rename unrelated classes to inflate numbers.

| Dataset Class Code | Human Readable Label | Crop | AgroGuard Disease Mapping | Compatibility Status | Diagnostic Routing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tomato_early_blight` | Tomato - Early Blight | Tomato | Early Blight (*Alternaria solani*) | **Exact Match** | ML Classifier + Gemini Vision |
| `tomato_late_blight` | Tomato - Late Blight | Tomato | Late Blight (*Phytophthora infestans*) | **Exact Match** | ML Classifier + Gemini Vision |
| `tomato_yellow_leaf_curl_virus` | Tomato - Yellow Leaf Curl Virus | Tomato | Leaf Curl Virus | **Exact Match** | ML Classifier + Gemini Vision |
| `tomato_bacterial_spot` | Tomato - Bacterial Spot | Tomato | Bacterial Spot (*Xanthomonas*) | **Exact Match** | ML Classifier + Gemini Vision |
| `potato_early_blight` | Potato - Early Blight | Potato | Early Blight (*Alternaria solani*) | **Exact Match** | ML Classifier + Gemini Vision |
| `potato_late_blight` | Potato - Late Blight | Potato | Late Blight (*Phytophthora infestans*) | **Exact Match** | ML Classifier + Gemini Vision |
| `chilli_anthracnose` | Chilli - Anthracnose | Chilli | Anthracnose (*Colletotrichum*) | **Exact Match** | ML Classifier + Gemini Vision |
| `chilli_leafcurl` | Chilli - Leaf Curl | Chilli | Leaf Curl Virus (*ChiLCV*) | **Exact Match** | ML Classifier + Gemini Vision |
| `corn_northern_leaf_blight` | Corn - Northern Leaf Blight | Corn/Maize | Northern Leaf Blight | **Exact Match** | ML Classifier + Gemini Vision |
| `corn_rust` | Corn - Common Rust | Corn/Maize | Rust (*Puccinia sorghi*) | **Exact Match** | ML Classifier + Gemini Vision |
| `tea_brown_blight` / `tea_gray_blight` | Tea - Brown / Gray Blight | Tea | Tea Blight (*Colletotrichum / Pestalotiopsis*) | **Exact Match** | ML Classifier + Gemini Vision |
| `tea_anthracnose` | Tea - Anthracnose | Tea | Anthracnose | **Exact Match** | ML Classifier + Gemini Vision |
| `tea_red_spider` / `tea_green_mirid` | Tea - Red Spider / Mirid Bug | Tea | Tea Foliar Pest Damage | **Exact Match** | ML Classifier + Gemini Vision |
| `banana_fusarium_wilt` / `panama` | Banana - Fusarium Wilt | Banana | Panama Disease (*Fusarium oxysporum*) | **Exact Match** | ML Classifier + Gemini Vision |
| `banana_sigatoka` | Banana - Sigatoka | Banana | Black Sigatoka | **Exact Match** | ML Classifier + Gemini Vision |
| `*_healthy` (14+ crops) | Healthy Foliage Baseline | Multiple | Healthy Foliage (No Disease) | **Exact Match** | ML Classifier + Gemini Vision |
| **Not in Dataset** | Paddy Blast Disease | Paddy/Rice | Blast Disease (*Magnaporthe oryzae*) | **Unavailable in image set** | Gemini Multimodal Vision + Agronomic Rules |
| **Not in Dataset** | Paddy Sheath Blight | Paddy/Rice | Sheath Blight (*Rhizoctonia solani*) | **Unavailable in image set** | Gemini Multimodal Vision + Agronomic Rules |
| **Not in Dataset** | Weligama Coconut Leaf Wilt | Coconut | Weligama Leaf Wilt (*Phytoplasma*) | **Unavailable in image set** | Gemini Multimodal Vision + Low-Confidence Officer Escalation |
| **Not in Dataset** | Fall Armyworm Infestation | Corn/Maize | Fall Armyworm (*Spodoptera frugiperda*) | **Unavailable in image set** (Insect chew/whorl damage) | Gemini Multimodal Vision + Agronomic Rules |
| **Not in Dataset** | Tea Blister Blight (*Exobasidium vexans*) | Tea | Tea Blister Blight | **Partial / Related** (Tea foliar blights present, *E. vexans* specific class absent) | Gemini Multimodal Vision + Expert Rules |

---

## 4. Honest Architectural Accounting

1. **No Synthetic Training Data:** `database/seed.sql` contains exclusively mock relational records for demonstration of farmer accounts, agricultural officer profiles, geospatial farm locations, and historical case records. It was **never** used for model training.
2. **Provenance Distinction:** The `crophelth` dataset aggregates multiple international and regional open datasets (PlantVillage, PlantDoc, Mendeley research archives). While curated by a Sri Lankan researcher, it is an international foliar dataset and not exclusively Sri Lankan field telemetry.
3. **Dual-Engine Fusion:** For crops/diseases present in the ML class taxonomy, AgroGuard-AI executes both the PyTorch MobileNetV3 classifier and the Google Gemini Multimodal Vision model, calculating an agreement score. For endemic diseases outside the image training classes, the system transparently routes predictions through Gemini Vision + expert agronomic rules and flags uncertain cases for Agricultural Extension Officer verification.
