# mGFD CloudGenerator 2.3 :cloud:

<div align="center">

<img src="docs/logo/logo.png" alt="mGFD CloudGenerator logo" width="680" style="margin: 20px 0;">

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black.svg?style=for-the-badge&logo=github)](https://github.com/gstinoco/mGFD_CloudGenerator) [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Python](https://img.shields.io/badge/Python-3.9+-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/downloads/) [![Flask](https://img.shields.io/badge/Flask-3.1.3-000000.svg?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/) [![OpenCV](https://img.shields.io/badge/OpenCV-5.0.0-red.svg?style=for-the-badge&logo=opencv)](https://opencv.org/) [![NumPy](https://img.shields.io/badge/NumPy-2.5.3-013243.svg?style=for-the-badge&logo=numpy)](https://numpy.org/) [![SciPy](https://img.shields.io/badge/SciPy-1.18.1-8CAAE6.svg?style=for-the-badge&logo=scipy)](https://scipy.org/) [![mGFD](https://img.shields.io/badge/mGFD-0.12.1-8A2BE2.svg?style=for-the-badge)](https://pypi.org/project/mGFD/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Web platform for generating 2D unstructured point clouds for meshless mGFD workflows**

*From images to contours to classified point clouds — with visualization and neighbor analysis*

<!-- <img src="docs/logo/app_demo.gif" alt="mGFD CloudGenerator Demo" width="800" style="margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"> -->

> :tada: **New in v2.3**: Completely redesigned with a premium **Tailwind CSS** aesthetic, native **Light/Dark mode**, fully responsive UI, seamless **English/Spanish** localization (i18n), and fully **Dockerized** for instant deployment.

</div>

### :link: Quick Navigation

<div align="center">
  <a href="https://malla.umich.mx/CloudGenerator/"><img src="https://img.shields.io/badge/🌐_Live_Demo-brightgreen?style=for-the-badge" alt="Live Demo" style="margin: 4px;"></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/📝_Changelog-gray?style=for-the-badge" alt="Changelog" style="margin: 4px;"></a>
  <a href="#rocket-quick-start--usage-workflows"><img src="https://img.shields.io/badge/🚀_Quick_Start-green?style=for-the-badge" alt="Quick Start" style="margin: 4px;"></a>
  <a href="#package-installation--setup"><img src="https://img.shields.io/badge/📦_Install-blue?style=for-the-badge" alt="Install" style="margin: 4px;"></a>
  <a href="#open_file_folder-project-architecture--data-storage"><img src="https://img.shields.io/badge/🗂️_Architecture_&_Data-blue?style=for-the-badge" alt="Architecture" style="margin: 4px;"></a>
  <a href="#books-mathematical-model"><img src="https://img.shields.io/badge/🧮_Mathematical_Model-purple?style=for-the-badge" alt="Model" style="margin: 4px;"></a>
  <a href="#chart_with_upwards_trend-performance-benchmarks"><img src="https://img.shields.io/badge/📈_Benchmarks-purple?style=for-the-badge" alt="Benchmarks" style="margin: 4px;"></a>
  <a href="#movie_camera-visualizations"><img src="https://img.shields.io/badge/🎬_Visualizations-purple?style=for-the-badge" alt="Visualizations" style="margin: 4px;"></a>
</div>

---

## :clipboard: Table of Contents
- [Overview](#star2-overview)
- [Features](#sparkles-features)
- [Installation & Setup](#package-installation--setup)
- [Quick Start & Usage Workflows](#rocket-quick-start--usage-workflows)
- [Visualizations](#movie_camera-visualizations)
- [API Documentation](#gear-api-documentation)
- [Data Formats](#file_cabinet-data-formats)
- [Project Architecture & Data Storage](#open_file_folder-project-architecture--data-storage)
- [Mathematical Model](#books-mathematical-model)
- [Performance Benchmarks](#chart_with_upwards_trend-performance-benchmarks)
- [Contributing](#handshake-contributing)
- [Research Team](#scientist-research-team)
- [Institutional Partners & Acknowledgments](#handshake-institutional-partners--acknowledgments)
- [Scientific References](#books-scientific-references)
- [Citation & License](#memo-citation--license)
- [Contact & Support](#email-contact--support)
- [FAQ](#speech_balloon-faq)

---

## :star2: Overview

**mGFD CloudGenerator 2.3** is a Flask-based web platform that converts **images → contours → classified point clouds** designed for **meshless Generalized Finite Differences (mGFD)** workflows. Completely redesigned with a premium, modern minimalist **Tailwind CSS** aesthetic, it features full Native Light/Dark mode support, 100% English/Spanish localization, and robust tools for contour extraction, multi-region management, and cloud generation.

> :globe_with_meridians: **Try it now!** Live demo: **https://malla.umich.mx/CloudGenerator/**

### :wrench: Key Capabilities
- **:art: ContourCreator**: Single-click region detection (Flood Fill), interactive refinement, brush editing, and optional GrabCut.
- **:cloud: CloudGenerator**: Regular (grid-like) and Natural (Poisson disk sampling) distributions, optional contour reduction, multi-region support.
- **:eye: CloudViewer**: Upload a CSV (contours or clouds) and instantly generate PNG/SVG visualizations with smooth glassmorphic UI.
- **:users: NeighborsCalculator**: Compute k-nearest neighbors constrained by region boundaries (cKDTree-based).
- **:floppy_disk: Export & Reproducibility**: Standardized CSV formats + verification on export for integrity.
- **:nail_care: UI & UX**: Native Light/Dark Mode toggle, asynchronous Toast notifications, Cache-Busting mechanism, and global loading overlays.
- **:whale: Production-Ready**: Fully Dockerized to ensure consistent execution environments and bypass complex OS-level scientific dependencies.

### :microscope: Typical Applications

| Field | Application | Use Case |
|-------|-------------|----------|
| **Computational Fluid Dynamics** :ocean: | Irregular domains | Node generation for complex geometries |
| **Structural Engineering** :building_construction: | Stress analysis | Point sets for meshless discretization |
| **Heat Transfer** :fire: | Interface problems | Multi-region clouds with internal boundaries |
| **Environmental Modeling** :herb: | Geography-driven domains | Contour-driven discretization from maps |
| **Biomedical Engineering** :microscope: | Organ shapes | Point cloud generation from silhouettes |

---

## :sparkles: Features

### :art: ContourCreator
- **One-click region detection** based on `cv2.floodFill` (fast and interactive).
- **Adaptive tolerance** using local texture statistics for robust segmentation.
- **Positive/negative seed refinement** for add/subtract workflows.
- **Brush editing** to manually correct masks and boundaries.
- **Equidistant Contour Sampling**: advanced node retention algorithm ensuring mathematically uniform spacing along complex boundaries.
- **Export single or multi-region contours** as normalized CSV coordinates.

### :cloud: CloudGenerator
- **Regular Distribution**: uniform grid-style generation inside polygonal regions.
- **Natural Distribution**: Poisson disk sampling for organic point spacing.
- **Adaptive Density**: dynamic bounding-box scaling to guarantee appropriate grid spacing for narrow or intricate subregions.
- **Topological Fallbacks**: guaranteed interior node placement via representative points to prevent mathematically empty sub-domains.
- **Contour reduction** to simplify boundaries before generation (optional).
- **Multi-region support**: main region + interior regions (holes) handled explicitly.
- **Node classification** written to CSV (`boundary`, `interior`, and region-aware classes).

### :eye: CloudViewer
- **CSV upload** and automatic rendering to PNG and SVG.
- **Compatibility** with the standardized CSV formats described below.

### :users: NeighborsCalculator
- **Region-constrained neighbor search** (no cross-region connections).
- **Efficient KD-tree implementation** via `scipy.spatial.cKDTree`.

---

## :package: Installation & Setup

### :computer: System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Python** | 3.9+ | 3.10+ |
| **RAM** | 4 GB | 8 GB+ |
| **CPU** | 2 cores | 4+ cores |
| **Storage** | 1 GB | 5 GB+ (if generating large datasets) |
| **OS** | Windows/Linux/macOS | Linux (recommended for deployments) |

### :clipboard: Dependencies

```python
# Web framework
Flask==3.1.3
Werkzeug==3.1.8

# Computer vision / geometry
opencv-python-headless==5.0.0.93
shapely==2.1.1

# Scientific computing
numpy==2.5.3
scipy==1.18.1
matplotlib==3.11.2

# Mathematical algorithms for generating clouds
mGFD==0.12.1
```

### Quick Installation

```bash
# Method 1: Direct installation
git clone https://github.com/gstinoco/mGFD_CloudGenerator.git
cd mGFD_CloudGenerator
pip install -r requirements.txt

# Method 2: Virtual environment (recommended)
python -m venv cloudgen_env
source cloudgen_env/bin/activate  # On Windows: cloudgen_env\Scripts\activate
pip install -r requirements.txt
```

### 🐳 Docker Deployment (Production)

For a production-ready environment avoiding OS-level dependency conflicts (especially with OpenCV and PyVista/VTK), use Docker:

```bash
git clone https://github.com/gstinoco/mGFD_CloudGenerator.git
cd mGFD_CloudGenerator

# Build and start the container in detached mode
docker compose up -d --build

# The application will be available at http://localhost:8000
# To view logs: docker compose logs -f
# To stop the application: docker compose down
```

### :white_check_mark: Installation Verification

```bash
python -c "import flask, cv2, numpy, scipy, shapely, matplotlib; print(':white_check_mark: Installation successful!')"
python app.py
```

Local server default:
- `http://127.0.0.1:5000/`

---

## :rocket: Quick Start & Usage Workflows

<div align="center">

*Practical workflows for the mGFD CloudGenerator toolset.*

</div>

### :zap: Getting Started
1. **Run the server**: 
   - **Local**: `python app.py` (opens at `http://127.0.0.1:5000/`)
   - **Docker** :whale:: `docker compose up -d` (opens at `http://localhost:8000/`)
2. **General Workflow**: **ContourCreator** → export contours CSV → **CloudGenerator** → export cloud CSV + PNG/SVG → optional **NeighborsCalculator**.

### :art: ContourCreator (Image → Contours)
- **1) Upload**: Upload an image (PNG/JPG/JPEG/GIF/BMP). Max request size is **16 MB**.
- **2) Detect**: Click inside a region to extract it with Flood Fill (adaptive tolerance).
- **3) Refine**: Use positive/negative seeds and brush tools to add/remove pixels from the mask.
- **4) Export**: Export a **single region** or **all regions** to CSV with normalized coordinates.

### :cloud: CloudGenerator (Contours CSV → Classified Cloud)
- **1) Upload CSV**: Upload a contour CSV (`x,y,region` recommended for multi-region).
- **2) Choose method**: **Regular** (grid-like) or **Natural** (Poisson disk sampling).
- **3) Options**: Enable **contour reduction** and/or generate points inside interior regions (holes).
- **4) Outputs**: Download **CSV** (`x,y,region,classification`) and **Images** (`.png` and `.svg`).

### :eye: CloudViewer (CSV → Visualization)
- **1) Upload CSV**: Upload a contour or cloud CSV.
- **2) Inspect**: Get PNG/SVG renderings and point counts for fast validation.

### :users: NeighborsCalculator (Cloud CSV → Neighbors)
- **1) Upload Cloud CSV**: Upload a cloud CSV containing `x,y,region,classification`.
- **2) Set k**: Select the number of neighbors (`nvec`, default is 9).
- **3) Compute**: Neighbors are computed within each region only (no cross-region links).

---

## :movie_camera: Visualizations

### :framed_picture: Examples Gallery

The repository includes sample inputs and outputs under [static/examples/](static/examples/).

<div align="center">

<div align="center">
  <b>Balkhash</b><br/>
  <img src="static/examples/Balkhash.png" alt="Balkhash input" width="250" style="margin-right: 10px;">
  <img src="static/examples/Balkhash_cloud.png" alt="Balkhash cloud" width="250"><br/>
  <a href="static/examples/Balkhash_contours.csv"><code>Balkhash_contours.csv</code></a> • <a href="static/examples/Balkhash_cloud.csv"><code>Balkhash_cloud.csv</code></a>
  <br/><br/><br/>
  
  <b>Caspio</b><br/>
  <img src="static/examples/Caspio.png" alt="Caspio input" width="250" style="margin-right: 10px;">
  <img src="static/examples/Caspio_cloud.png" alt="Caspio cloud" width="250"><br/>
  <a href="static/examples/Caspio_contours.csv"><code>Caspio_contours.csv</code></a> • <a href="static/examples/Caspio_cloud.csv"><code>Caspio_cloud.csv</code></a>
  <br/><br/><br/>

  <b>Titicaca</b><br/>
  <img src="static/examples/Titicaca.png" alt="Titicaca input" width="250" style="margin-right: 10px;">
  <img src="static/examples/Titicaca_cloud.png" alt="Titicaca cloud" width="250"><br/>
  <a href="static/examples/Titicaca_contours.csv"><code>Titicaca_contours.csv</code></a> • <a href="static/examples/Titicaca_cloud.csv"><code>Titicaca_cloud.csv</code></a>
</div>

</div>

> Tip: Use these CSV files in CloudViewer/CloudGenerator to reproduce the example outputs.

---

## :gear: API Documentation

The application exposes REST endpoints used by the web UI. All endpoints return JSON (except file downloads).

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/upload` | POST | Upload an image for ContourCreator |
| `/detect_region` | POST | One-click region detection (Flood Fill) |
| `/interactive_segmentation` | POST | Multi-seed segmentation (add/subtract) |
| `/grabcut_segmentation` | POST | Optional GrabCut segmentation |
| `/refine_with_brush` | POST | Apply brush strokes to refine the mask |
| `/export_single_region` | POST | Export one region to CSV (`x,y,region`) |
| `/save_all_coordinates` | POST | Export multiple regions to a single CSV (`x,y,region`) |
| `/upload_csv` | POST | Upload contour CSV for CloudGenerator |
| `/generate_cloud` | POST | Generate cloud (Regular distribution) |
| `/generate_cloud_natural` | POST | Generate cloud (Natural distribution) |
| `/upload_viewer` | POST | Upload CSV for rendering in CloudViewer |
| `/upload_neighbors` | POST | Upload cloud CSV and compute neighbors |
| `/download/<filename>` | GET | Download generated files from the output folder |

---

## :file_cabinet: Data Formats

### :triangular_flag_on_post: Contours CSV (exported by ContourCreator)

Minimal format (single region):

```csv
x,y
0.1234,0.5678
0.1240,0.5681
...
```

Recommended format (multi-region / holes):

```csv
x,y,region
0.1234,0.5678,1
0.1240,0.5681,1
...
```

All coordinates are normalized to the `[0,1] × [0,1]` range (with Y-axis inversion from image coordinates to Cartesian coordinates).

### :cloud: Cloud CSV (exported by CloudGenerator)

```csv
x,y,region,classification
0.1234,0.5678,1,boundary
0.2222,0.3333,1,interior
...
```

---

## :open_file_folder: Project Architecture & Data Storage

```
:package: mGFD_CloudGenerator/
├── app.py                                  # Flask app + API routes
├── requirements.txt                        # Python dependencies
│
├── contour_modules/                        # ContourCreator (segmentation + contour extraction)
├── analysis_modules/                       # Post-processing tools (NeighborsCalculator)
│
├── templates/                              # Web UI (Jinja2)
├── static/                                 # Frontend assets + examples gallery
│
├── logs/                                   # local rotating logs
└── docs/                                   # Project branding + team images
```

### :open_file_folder: Runtime Directories (Local Mode)

The server automatically creates these folders to manage data during operation:
- `uploads/`: Temporary uploaded images and CSV files.
- `output/`: Generated CSV, PNG, and SVG artifacts.

**Typical Output Artifacts**:
- Contours: `<region_name>_<timestamp>.csv`
- Clouds: `<input>_cloud_<timestamp>.csv`

> **Note**: The server periodically runs automatic cleanup on `uploads/` and `output/` to prevent disk growth.

---

## :books: Mathematical Model

mGFD CloudGenerator is a preprocessing tool, but several steps are driven by simple, explicit mathematical mappings and geometric algorithms.

### :triangular_ruler: Coordinate System & Normalization

ContourCreator works in **normalized coordinates** and exports points to the Cartesian-like convention used by mGFD workflows.

| Concept | UI / Image Space | Exported Space |
|--------|-------------------|----------------|
| Range | $[0,1] \times [0,1]$ (normalized canvas) | $[0,1] \times [0,1]$ |
| Origin | top-left | bottom-left |
| Y axis | downwards | upwards (inverted) |

The export transformation applied to each point is:

$$x' = \mathrm{clip}(x \cdot s_x, 0, 1), \quad y' = \mathrm{clip}((1 - y) \cdot s_y, 0, 1)$$

Where $(s_x, s_y)$ are scaling factors derived from the source image size:

| Scaling method | $s_x$ | $s_y$ | Notes |
|---------------|------:|------:|------|
| preserve_aspect_ratio (default) | $w/\\max(w,h)$ | $h/\\max(w,h)$ | Preserves aspect ratio in a unit square |
| stretch | $1$ | $1$ | Stretches to fill the unit square |
| custom | user-defined | user-defined | Direct overrides |

### :cloud: Point-Cloud Generation (Regular vs Natural)

Given a set of polygonal contours (optionally multiple regions), CloudGenerator produces boundary and interior nodes:

| Method | Strategy | Typical use |
|--------|----------|-------------|
| Regular Distribution | grid-like sampling inside the polygon | structured clouds, fast generation |
| Natural Distribution | Poisson disk sampling (minimum-distance constraint) | more organic spacing, avoids grid artifacts |

Nodes are exported with metadata:
- `region`: integer region ID (Region 1 is the outer domain; Regions 2+ are interior holes when enabled).
- `classification`: `boundary` or `interior` (used by downstream mGFD pipelines).

### :compass: Neighbor Model (Region-Constrained kNN)

Neighbor computation is performed **per region** using a KD-tree search. This prevents cross-region connectivity that would be invalid for disconnected domains or holes.



## :chart_with_upwards_trend: Performance Benchmarks

The application is designed for interactive workloads and scales well for typical mGFD preprocessing sizes. Exact runtimes depend on hardware, point counts, and geometry complexity.

### :stopwatch: Scaling Overview

| Stage | Core operation | Typical scaling |
|-------|----------------|-----------------|
| Segmentation | Flood Fill / interactive refinement | ~ proportional to affected pixels |
| Cloud generation (Regular) | grid sampling + polygon checks | ~ proportional to generated points |
| Cloud generation (Natural) | Poisson disk sampling | ~ proportional to generated points (higher constant) |
| Neighbors | KD-tree kNN per region | ~ $O(n \log n)$ per region |
| Visualization/Export | CSV + PNG/SVG | ~ proportional to points |

---

## :handshake: Contributing

<div align="center">

### :star2: Contribute to the Project
*Bug reports, feature requests, and pull requests are welcome*

[![Issues](https://img.shields.io/github/issues/gstinoco/mGFD_CloudGenerator?style=flat-square)](https://github.com/gstinoco/mGFD_CloudGenerator/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/gstinoco/mGFD_CloudGenerator?style=flat-square)](https://github.com/gstinoco/mGFD_CloudGenerator/pulls)

</div>

### :bug: Bug Reports
1. **Search existing issues**: Check if the bug has already been reported
2. **Create a detailed report**: Include steps to reproduce and expected vs actual behavior
3. **Provide context**: Operating system, Python version, browser, and relevant parameters (image size, regions, method)

### :bulb: Feature Requests
1. **Describe the feature**: Clear and concise description of the proposed functionality
2. **Justify the need**: Explain how it benefits research, reproducibility, or usability
3. **Provide examples**: Use cases, expected inputs/outputs, and acceptance criteria

### :computer: Code Contributions

```bash
git clone https://github.com/gstinoco/mGFD_CloudGenerator.git
cd mGFD_CloudGenerator

python -m venv dev_env
source dev_env/bin/activate  # On Windows: dev_env\Scripts\activate
pip install -r requirements.txt

git checkout -b feature/your-feature-name
```

---

## :scientist: Research Team

<div align="center">

### :star2: Meet the Team
*Researchers, students, and collaborators advancing meshless computational methods*

<br>

</div>

### :busts_in_silhouette: Core Researchers

<table align="center" width="100%" cellspacing="0" cellpadding="8">
  <thead>
    <tr>
      <th align="center" width="140"></th>
      <th align="left">Researcher</th>
      <th align="left">Affiliation</th>
      <th align="left">Contact</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" width="140">
        <img src="docs/team/gtinoco.webp" alt="Dr. Gerardo Tinoco-Guerrero" width="100" height="100" style="border-radius: 50%; border: 3px solid #38B2AC;">
      </td>
      <td>
        <b>Dr. Gerardo Tinoco-Guerrero</b> :mexico:<br/>
        <sub>Ph.D. in Physical Engineering Sciences</sub>
      </td>
      <td>
        <a href="http://www.siiia.com.mx"><img alt="SIIIA MATH" src="https://img.shields.io/badge/🏢_SIIIA_MATH-0B1B3A?style=for-the-badge"></a><br/>
        <a href="http://www.umich.mx"><img alt="UMSNH" src="https://img.shields.io/badge/🎓_UMSNH-1A3A6B?style=for-the-badge"></a>
      </td>
      <td>
        <a href="mailto:gerardo.tinoco@umich.mx"><img alt="Email" src="https://img.shields.io/badge/📧_Email-blue?style=for-the-badge"></a><br/>
        <a href="https://orcid.org/0000-0003-3119-770X"><img alt="ORCID" src="https://img.shields.io/badge/ORCID-0000--0003--3119--770X-green?style=for-the-badge&logo=orcid"></a><br/>
        <a href="https://www.researchgate.net/profile/Gerardo-Tinoco-Guerrero"><img alt="ResearchGate" src="https://img.shields.io/badge/ResearchGate-teal?style=for-the-badge&logo=researchgate"></a>
      </td>
    </tr>
    <tr>
      <td align="center" width="140">
        <img src="docs/team/jagt.webp" alt="Dr. J. Alberto Guzmán-Torres" width="100" height="100" style="border-radius: 50%; border: 3px solid #38B2AC;">
      </td>
      <td>
        <b>Dr. J. Alberto Guzmán-Torres</b> :mexico:<br/>
        <sub>Ph.D. in Physical Engineering Sciences</sub>
      </td>
      <td>
        <a href="http://www.siiia.com.mx"><img alt="SIIIA MATH" src="https://img.shields.io/badge/🏢_SIIIA_MATH-0B1B3A?style=for-the-badge"></a><br/>
        <a href="http://www.umich.mx"><img alt="UMSNH" src="https://img.shields.io/badge/🎓_UMSNH-1A3A6B?style=for-the-badge"></a>
      </td>
      <td>
        <a href="mailto:jose.alberto.guzman@umich.mx"><img alt="Email" src="https://img.shields.io/badge/📧_Email-blue?style=for-the-badge"></a><br/>
        <a href="https://orcid.org/0000-0002-9309-9390"><img alt="ORCID" src="https://img.shields.io/badge/ORCID-0000--0002--9309--9390-green?style=for-the-badge&logo=orcid"></a><br/>
        <a href="https://www.researchgate.net/profile/Jose-Guzman-Torres"><img alt="ResearchGate" src="https://img.shields.io/badge/ResearchGate-teal?style=for-the-badge&logo=researchgate"></a>
      </td>
    </tr>
    <tr>
      <td align="center" width="140">
        <img src="docs/team/dmota.webp" alt="Dr. Francisco J. Domínguez-Mota" width="100" height="100" style="border-radius: 50%; border: 3px solid #38B2AC;">
      </td>
      <td>
        <b>Dr. Francisco J. Domínguez-Mota</b> :mexico:<br/>
        <sub>Ph.D. in Mathematical Sciences</sub>
      </td>
      <td>
        <a href="http://www.siiia.com.mx"><img alt="SIIIA MATH" src="https://img.shields.io/badge/🏢_SIIIA_MATH-0B1B3A?style=for-the-badge"></a><br/>
        <a href="http://www.umich.mx"><img alt="UMSNH" src="https://img.shields.io/badge/🎓_UMSNH-1A3A6B?style=for-the-badge"></a>
      </td>
      <td>
        <a href="mailto:francisco.mota@umich.mx"><img alt="Email" src="https://img.shields.io/badge/📧_Email-blue?style=for-the-badge"></a><br/>
        <a href="https://orcid.org/0000-0001-6837-172X"><img alt="ORCID" src="https://img.shields.io/badge/ORCID-0000--0001--6837--172X-green?style=for-the-badge&logo=orcid"></a><br/>
        <a href="https://www.researchgate.net/profile/Francisco-Dominguez-Mota"><img alt="ResearchGate" src="https://img.shields.io/badge/ResearchGate-teal?style=for-the-badge&logo=researchgate"></a>
      </td>
    </tr>
  </tbody>
</table>

### :handshake: Collaborators & Alumni

<table align="center" width="100%" cellspacing="0" cellpadding="8">
  <thead>
    <tr>
      <th align="center" width="140"></th>
      <th align="left">Researcher</th>
      <th align="left">Contact & Profiles</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" width="140">
        <img src="docs/team/harias.webp" alt="Dr. Heriberto Arias-Rojas" width="100" height="100" style="border-radius: 50%; border: 3px solid #CA6702;">
      </td>
      <td>
        <b>Dr. Heriberto Arias-Rojas</b> :mexico:<br/>
        <sub>Ph.D. in Physical Engineering Sciences</sub><br/>
        <br/>
        <img alt="Collaborator" src="https://img.shields.io/badge/🤝_Collaborator-CA6702?style=for-the-badge">
      </td>
      <td>
        <a href="mailto:heriberto.arias@umich.mx"><img alt="Email" src="https://img.shields.io/badge/📧_Email-blue?style=for-the-badge"></a><br/>
        <a href="https://orcid.org/0000-0002-7641-8310"><img alt="ORCID" src="https://img.shields.io/badge/ORCID-0000--0002--7641--8310-green?style=for-the-badge&logo=orcid"></a>
      </td>
    </tr>
    <tr>
      <td align="center" width="140">
        <img src="docs/team/gpj.webp" alt="Gabriela Pedraza-Jimenez" width="100" height="100" style="border-radius: 50%; border: 3px solid #2E8B57;">
      </td>
      <td>
        <b>Gabriela Pedraza-Jimenez</b><br/>
        <sub>Ph.D. in Physical Engineering Sciences</sub><br/>
        <br/>
        <img alt="Alumni" src="https://img.shields.io/badge/🎓_Alumni-2E8B57?style=for-the-badge">
      </td>
      <td>
        <a href="mailto:2220157h@umich.mx"><img alt="Email" src="https://img.shields.io/badge/📧_Email-blue?style=for-the-badge"></a>
      </td>
    </tr>
  </tbody>
</table>

### :mortar_board: Students

<table align="center" width="100%" cellspacing="0" cellpadding="8">
  <thead>
    <tr>
      <th align="center" width="120"></th>
      <th align="left">Student</th>
      <th align="left">Program</th>
      <th align="left">Contact</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" width="120">
        <img src="docs/team/eci.webp" alt="Eli Chagolla-Inzunza" width="80" height="80" style="border-radius: 50%; border: 2px solid #8CAAE6;">
      </td>
      <td><b>Eli Chagolla-Inzunza</b></td>
      <td><img alt="Ph.D. Candidate" src="https://img.shields.io/badge/Ph.D._Candidate-8CAAE6?style=for-the-badge"></td>
      <td><a href="mailto:1137626b@umich.mx"><img alt="Email" src="https://img.shields.io/badge/📧_Email-blue?style=for-the-badge"></a></td>
    </tr>
    <tr>
      <td align="center" width="120">
        <img src="docs/team/jlgf.webp" alt="Jorge L. González-Figueroa" width="80" height="80" style="border-radius: 50%; border: 2px solid #38B2AC;">
      </td>
      <td><b>Jorge L. González-Figueroa</b></td>
      <td><img alt="M.Sc. Student" src="https://img.shields.io/badge/M.Sc._Student-38B2AC?style=for-the-badge"></td>
      <td><a href="mailto:1718717h@umich.mx"><img alt="Email" src="https://img.shields.io/badge/📧_Email-blue?style=for-the-badge"></a></td>
    </tr>
    <tr>
      <td align="center" width="120">
        <img src="docs/team/cnmb.webp" alt="C. Nolan Magaña-Barocio" width="80" height="80" style="border-radius: 50%; border: 2px solid #38B2AC;">
      </td>
      <td><b>C. Nolan Magaña-Barocio</b></td>
      <td><img alt="M.Sc. Student" src="https://img.shields.io/badge/M.Sc._Student-38B2AC?style=for-the-badge"></td>
      <td><a href="mailto:1339846k@umich.mx"><img alt="Email" src="https://img.shields.io/badge/📧_Email-blue?style=for-the-badge"></a></td>
    </tr>
    <tr>
      <td align="center" width="120">
        <img src="docs/team/mgfl.webp" alt="Maria Goretti Fraga-Lopez" width="80" height="80" style="border-radius: 50%; border: 2px solid #2E8B57;">
      </td>
      <td><b>Maria Goretti Fraga-Lopez</b></td>
      <td><img alt="Undergraduate" src="https://img.shields.io/badge/Undergraduate-2E8B57?style=for-the-badge"></td>
      <td><a href="mailto:1702174b@umich.mx"><img alt="Email" src="https://img.shields.io/badge/📧_Email-blue?style=for-the-badge"></a></td>
    </tr>
  </tbody>
</table>

---

## :handshake: Institutional Partners & Acknowledgments

<div align="center">

*We extend our gratitude to the institutions, companies, and government entities supporting this research and open-source development.*

<br/>

<table align="center" width="100%" cellspacing="0" cellpadding="8">
  <thead>
    <tr>
      <th align="center" width="25%">Institution</th>
      <th align="left" width="25%">Type</th>
      <th align="left" width="50%">Key Support & Collaboration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="docs/partners/umsnh.webp" alt="UMSNH Logo" height="60"><br/>
        <br/>
        <a href="http://www.umich.mx"><img alt="Website" src="https://img.shields.io/badge/🌐_Website-darkred?style=for-the-badge"></a>
      </td>
      <td>
        <img alt="University" src="https://img.shields.io/badge/🎓_University-1A3A6B?style=for-the-badge"><br/>
        <br/>
        <sub>Michoacán, Mexico</sub>
      </td>
      <td>
        • Academic foundation and research infrastructure<br/>
        • Scientific training and graduate supervision
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="docs/partners/secihti.webp" alt="SECIHTI Logo" height="50"><br/>
        <br/>
        <a href="https://secihti.mx/"><img alt="Website" src="https://img.shields.io/badge/🌐_Website-darkgreen?style=for-the-badge"></a>
      </td>
      <td>
        <img alt="Government" src="https://img.shields.io/badge/🏛️_Government-2D6A4F?style=for-the-badge"><br/>
        <br/>
        <sub>Federal, Mexico</sub>
      </td>
      <td>
        • Support for science and technology initiatives<br/>
        • Research funding and innovation promotion
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="docs/partners/siiia_vertical.png" alt="SIIIA MATH Logo" height="60"><br/>
        <br/>
        <a href="http://www.siiia.com.mx"><img alt="Website" src="https://img.shields.io/badge/🌐_Website-blue?style=for-the-badge"></a>
      </td>
      <td>
        <img alt="Industry R&D" src="https://img.shields.io/badge/🏭_Industry_R&D-0B1B3A?style=for-the-badge"><br/>
        <br/>
        <sub>Morelia, Mexico</sub>
      </td>
      <td>
        • Mathematical modeling, AI/ML engineering<br/>
        • Technology transfer and applied R&D
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="docs/partners/cimne.webp" alt="CIMNE Logo" height="60"><br/>
        <br/>
        <a href="https://aulas.cimne.com/aula/aula-morelia/"><img alt="Website" src="https://img.shields.io/badge/🌐_Website-orange?style=for-the-badge"></a>
      </td>
      <td>
        <img alt="Research Center" src="https://img.shields.io/badge/🌿_Research_Center-EE9B00?style=for-the-badge"><br/>
        <br/>
        <sub>Spain / Mexico</sub>
      </td>
      <td>
        • International collaboration in numerical methods<br/>
        • Computational engineering research environment
      </td>
    </tr>
  </tbody>
</table>

</div>

---

## :books: Scientific References

### :books: Core Publications (GFD / mGFD Background)

1. **Tinoco-Guerrero, G.**, Domínguez-Mota, F. J., Guzmán-Torres, J. A., Pedraza-Jiménez, G., & Tinoco-Ruiz, J. G. (2025). *"mGFD: A meshless generalized finite difference method."* **Computers & Mathematics with Applications**.  
   :link: **[View on ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0898122125003232)**

2. Pedraza-Jiménez, G., **Tinoco-Guerrero, G.**, Domínguez-Mota, F. J., Guzmán-Torres, J. A., & Tinoco-Ruiz, J. G. (2025). *"mGFD: CloudGenerator."* **Software Impacts**.  
   :link: **[View on ScienceDirect](https://www.sciencedirect.com/science/article/pii/S266596382400109X)**

3. **Tinoco-Guerrero, G.**, Domínguez-Mota, F. J., Guzmán-Torres, J. A., & Tinoco-Ruiz, J. G. (2022). *"Numerical Solution of Diffusion Equation using a Method of Lines and Generalized Finite Differences."* **Revista Internacional de Métodos Numéricos para Cálculo y Diseño en Ingeniería**, 38(2).  
   :link: **[DOI: 10.23967/j.rimni.2022.06.003](http://dx.doi.org/10.23967/j.rimni.2022.06.003)**

### :trophy: Project Highlights

- **Contour-to-cloud pipeline**: interactive image-based contour extraction and multi-region management
- **Cloud generation methods**: Regular (grid-like) and Natural (Poisson disk sampling) distributions
- **Region-aware analysis**: neighbor computation constrained by region labels for disconnected domains and holes

---

## :memo: Citation & License

If you use this software in your research, please cite:

```bibtex
@software{tinoco2026mGFD_cloudgenerator,
  title={mGFD CloudGenerator 2.3: Web platform for generating 2D unstructured point clouds},
  author={Tinoco-Guerrero, Gerardo and 
          Domínguez-Mota, Francisco Javier and 
          Guzmán-Torres, José Alberto and
          Arias-Rojas, Heriberto},
  year={2026},
  institution={Universidad Michoacana de San Nicolás de Hidalgo},
  organization={SIIIA MATH: Soluciones en ingeniería},
  url={https://github.com/gstinoco/mGFD_CloudGenerator},
  version={2.3},
  note={Web-based preprocessing tool for meshless mGFD workflows: image-to-contour extraction, multi-region handling, point-cloud generation (regular/Poisson), node classification, and region-constrained neighbor analysis}
}
```

### :page_facing_up: License

This project is licensed under the **MIT License** - see the full license text below:

```
MIT License

Copyright (c) 2025 Gerardo Tinoco-Guerrero, Francisco Javier Domínguez-Mota, 
                   José Alberto Guzmán-Torres, Heriberto Árias Rojas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Academic Use:** This software is developed for research and educational purposes. Commercial use is permitted under the MIT License terms.

---

## :email: Contact & Support

<div align="center">

*Contact channels, technical support, and collaboration opportunities*

[![Issues](https://img.shields.io/badge/🧩-GitHub%20Issues-24292f?style=flat-square&logo=github)](https://github.com/gstinoco/mGFD_CloudGenerator/issues)
[![Email](https://img.shields.io/badge/📧-Email%20Support-blue?style=flat-square)](mailto:gerardo.tinoco@umich.mx)
[![Collaboration](https://img.shields.io/badge/🤝-Request%20Collaboration-2E8B57?style=flat-square)](mailto:gerardo.tinoco@umich.mx?subject=mGFD%20CloudGenerator%20Collaboration)

</div>

**Dr. Gerardo Tinoco Guerrero** (Primary Contact)  
*Morelia, Michoacán, México*

- **Bug Reports & Feature Requests**: Please use the [GitHub Issues](https://github.com/gstinoco/mGFD_CloudGenerator/issues) tab.
- **Technical Support & Questions**: Reach out via [email](mailto:gerardo.tinoco@umich.mx).
- **Research Collaboration**: We are open to partnerships in Meshless Methods, Computational Geometry, and Scientific Web Tools.

*Affiliations*: [SIIIA MATH](http://www.siiia.com.mx) • [UMSNH](http://www.umich.mx)

---

## :speech_balloon: FAQ

<details>
  <summary><b>Which image formats are supported?</b></summary>
  <br/>
  PNG, JPG/JPEG, GIF, and BMP. Maximum request size is <b>16 MB</b>.
</details>

<details>
  <summary><b>Where are outputs saved when running locally?</b></summary>
  <br/>
  Generated files are written to <code>output/</code>. Uploaded files are stored in <code>uploads/</code>. Both folders are created automatically on startup.
</details>

<details>
  <summary><b>What is the expected CSV format for CloudGenerator?</b></summary>
  <br/>
  Contours: <code>x,y,region</code> (region is optional, but recommended for multi-region). Clouds: <code>x,y,region,classification</code>.
</details>

<details>
  <summary><b>Can I use this in commercial projects?</b></summary>
  <br/>
  Yes. The project is released under the MIT License.
</details>

<details>
  <summary><b>How should I cite this work?</b></summary>
  <br/>
  Use the BibTeX entry in the Citation section and the referenced DOI in Scientific References.
</details>

---

<div align="center">

*Advancing meshless methods through open-source collaboration*

[![GitHub stars](https://img.shields.io/github/stars/gstinoco/mGFD_CloudGenerator?style=social)](https://github.com/gstinoco/mGFD_CloudGenerator/stargazers) [![GitHub forks](https://img.shields.io/github/forks/gstinoco/mGFD_CloudGenerator?style=social)](https://github.com/gstinoco/mGFD_CloudGenerator/network/members) [![GitHub watchers](https://img.shields.io/github/watchers/gstinoco/mGFD_CloudGenerator?style=social)](https://github.com/gstinoco/mGFD_CloudGenerator/watchers)

<br/>

<b>If this project helps your research, please consider giving it a star.</b>

</div>
