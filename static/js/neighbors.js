/**
 * NeighborsCalculator — Core functionality for NeighborsCalculator
 * 
 * Overview:
 *     This module provides functionality related to the NeighborsCalculator tool.
 *     Handles file upload and neighbor calculation, and implements drag-and-drop.
 * 
 * Public API:
 *     None (Event-driven DOM interactions)
 * 
 * Credits:
 *     All the codes presented below were developed by:
 *         Dr. Gerardo Tinoco-Guerrero
 *         Dr. Francisco Javier Domínguez-Mota
 *         Dr. José Alberto Guzmán-Torres
 *         Universidad Michoacana de San Nicolás de Hidalgo
 *         gerardo.tinoco@umich.mx
 * 
 *     With the funding of:
 *         Secretary of Science, Humanities, Technology and Innovation, SECIHTI (Secretaria de Ciencia, Humanidades, Tecnología e Innovación). México.
 *         Coordination of Scientific Research, CIC-UMSNH (Coordinación de la Investigación Científica de la Universidad Michoacana de San Nicolás de Hidalgo, CIC-UMSNH). México.
 *         Aula CIMNE-Morelia. México.
 *         SIIIA-MATH: Soluciones de Ingeniería. México.
 * 
 * Date:
 *     March, 2026.
 * Last Modification:
 *     September, 2026.
 */

// --- Canvas State ---
let canvasData = {                                                                                                                      // Initialize mutable variable state reference
    points: [],                                                                                                                         // Execute sequential evaluation stream node
    neighbors: [],                                                                                                                      // Execute sequential evaluation stream node
    regions: [],                                                                                                                        // Execute sequential evaluation stream node
    classifications: [],                                                                                                                // Execute sequential evaluation stream node
    scale: 1,                                                                                                                           // Execute sequential evaluation stream node
    offsetX: 0,                                                                                                                         // Execute sequential evaluation stream node
    offsetY: 0,                                                                                                                         // Execute sequential evaluation stream node
    minX: 0, maxX: 0, minY: 0, maxY: 0,                                                                                                 // Execute sequential evaluation stream node
    hoverIdx: -1,                                                                                                                       // Execute sequential evaluation stream node
    isDragging: false,                                                                                                                  // Execute sequential evaluation stream node
    lastMouseX: 0,                                                                                                                      // Execute sequential evaluation stream node
    lastMouseY: 0                                                                                                                       // Execute sequential evaluation stream node
};                                                                                                                                      // Terminate block scope execution context

function formatSci(val) {                                                                                                               // Declare function scope logic
    if (val === 0) return "0.000";                                                                                                      // Evaluate boolean condition check logic
    if (Math.abs(val) < 0.01 || Math.abs(val) >= 10000) {                                                                               // Evaluate boolean condition check logic
        return val.toExponential(3);                                                                                                    // Return execution stream payload data
    }                                                                                                                                   // Terminate block scope execution context
    return val.toFixed(4);                                                                                                              // Return execution stream payload data
}                                                                                                                                       // Terminate block scope execution context

const REGION_COLORS = [                                                                                                                 // Initialize immutable variable state reference
    '#3399FF', '#4DE64D', '#FFB333', '#CC4DFF',                                                                                         // Execute sequential evaluation stream node
    '#E69933', '#FF80CC', '#B3B3B3'                                                                                                     // Execute sequential evaluation stream node
];                                                                                                                                      // Execute sequential statement instruction block

let uploadZone = null;                                                                                                                  // Initialize mutable variable state reference
let fileInput = null;                                                                                                                   // Initialize mutable variable state reference
let uploadContent = null;                                                                                                               // Initialize mutable variable state reference
let uploadTitle = null;                                                                                                                 // Initialize mutable variable state reference
let uploadSubtitle = null;                                                                                                              // Initialize mutable variable state reference
let dragCounter = 0;                                                                                                                    // Initialize mutable variable state reference
let currentFile = null;                                                                                                                 // Initialize mutable variable state reference

const MAX_FILE_SIZE = 10 * 1024 * 1024;                                                                                                 // 10MB

document.addEventListener('DOMContentLoaded', () => {                                                                                   // Bind event listener DOM state
    setupDragAndDrop();                                                                                                                 // Execute sequential statement instruction block

});                                                                                                                                     // Terminate block scope execution context

function setupDragAndDrop() {                                                                                                           // Declare function scope logic
    uploadZone = document.getElementById('uploadZone');                                                                                 // Query document element node reference
    fileInput = document.getElementById('csvFileInput');                                                                                // Query document element node reference
    uploadContent = document.getElementById('uploadContent');                                                                           // Query document element node reference
    uploadTitle = document.getElementById('uploadTitle');                                                                               // Query document element node reference
    uploadSubtitle = document.getElementById('uploadSubtitle');                                                                         // Query document element node reference

    if (!uploadZone || !fileInput) return;                                                                                              // Evaluate boolean condition check logic

    // Drag and drop events
    uploadZone.addEventListener('dragenter', handleDragEnter);                                                                          // Bind event listener DOM state
    uploadZone.addEventListener('dragover', handleDragOver);                                                                            // Bind event listener DOM state
    uploadZone.addEventListener('dragleave', handleDragLeave);                                                                          // Bind event listener DOM state
    uploadZone.addEventListener('drop', handleDrop);                                                                                    // Bind event listener DOM state

    // Click to upload
    uploadZone.addEventListener('click', (e) => {                                                                                       // Bind event listener DOM state
        // Prevent click if clicking on buttons inside
        if (e.target.closest('button')) return;                                                                                         // Evaluate boolean condition check logic

        if (!uploadZone.classList.contains('uploading')) {                                                                              // Evaluate boolean condition check logic
            fileInput.click();                                                                                                          // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context

    // File input change
    fileInput.addEventListener('change', handleFileSelect);                                                                             // Bind event listener DOM state

    // Prevent default drag behaviors
    document.addEventListener('dragover', (e) => e.preventDefault());                                                                   // Bind event listener DOM state
    document.addEventListener('drop', (e) => e.preventDefault());                                                                       // Bind event listener DOM state
}                                                                                                                                       // Terminate block scope execution context

function handleDragEnter(e) {                                                                                                           // Declare function scope logic
    e.preventDefault();                                                                                                                 // Execute sequential statement instruction block
    dragCounter++;                                                                                                                      // Execute sequential statement instruction block

    if (dragCounter === 1) {                                                                                                            // Evaluate boolean condition check logic
        uploadZone.classList.add('drag-over');                                                                                          // Modify element class list collection
        updateUploadContent('drag-over');                                                                                               // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function handleDragOver(e) {                                                                                                            // Declare function scope logic
    e.preventDefault();                                                                                                                 // Execute sequential statement instruction block
    e.dataTransfer.dropEffect = 'copy';                                                                                                 // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

function handleDragLeave(e) {                                                                                                           // Declare function scope logic
    e.preventDefault();                                                                                                                 // Execute sequential statement instruction block
    dragCounter--;                                                                                                                      // Execute sequential statement instruction block

    if (dragCounter === 0) {                                                                                                            // Evaluate boolean condition check logic
        uploadZone.classList.remove('drag-over');                                                                                       // Modify element class list collection
        updateUploadContent('default');                                                                                                 // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function handleDrop(e) {                                                                                                                // Declare function scope logic
    e.preventDefault();                                                                                                                 // Execute sequential statement instruction block
    dragCounter = 0;                                                                                                                    // Assign variable property value reference
    uploadZone.classList.remove('drag-over');                                                                                           // Modify element class list collection

    const files = e.dataTransfer.files;                                                                                                 // Initialize immutable variable state reference
    if (files.length > 0) {                                                                                                             // Evaluate boolean condition check logic
        processFile(files[0]);                                                                                                          // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function handleFileSelect(e) {                                                                                                          // Declare function scope logic
    const files = e.target.files;                                                                                                       // Initialize immutable variable state reference
    if (files.length > 0) {                                                                                                             // Evaluate boolean condition check logic
        processFile(files[0]);                                                                                                          // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function updateUploadContent(state) {                                                                                                   // Declare function scope logic
    // If elements don't exist (e.g. during upload progress), return
    const title = document.getElementById('uploadTitle');                                                                               // Initialize immutable variable state reference
    const subtitle = document.getElementById('uploadSubtitle');                                                                         // Initialize immutable variable state reference

    if (!title || !subtitle) return;                                                                                                    // Evaluate boolean condition check logic

    switch (state) {                                                                                                                    // Evaluate switch condition check flow
        case 'drag-over':                                                                                                               // Define switch case branch logic
            title.textContent = 'Drop your CSV file here!';                                                                             // Execute sequential statement instruction block
            subtitle.textContent = 'We will process your file immediately';                                                             // Execute sequential statement instruction block
            break;                                                                                                                      // Terminate current loop block context
        case 'default':                                                                                                                 // Define switch case branch logic
        default:                                                                                                                        // Execute sequential evaluation stream node
            title.textContent = 'Drop your CSV file here';                                                                              // Execute sequential statement instruction block
            subtitle.textContent = 'or click to browse files';                                                                          // Execute sequential statement instruction block
            break;                                                                                                                      // Terminate current loop block context
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function processFile(file) {                                                                                                            // Declare function scope logic
    // Validation
    if (!file.name.toLowerCase().endsWith('.csv')) {                                                                                    // Evaluate boolean condition check logic
        Utils.showUploadError(uploadZone, uploadContent, 'Invalid File', 'Please select a CSV file.');                                  // Execute sequential statement instruction block
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
    if (file.size > MAX_FILE_SIZE) {                                                                                                    // Evaluate boolean condition check logic
        Utils.showUploadError(uploadZone, uploadContent, 'File too large', `File must be smaller than ${Utils.formatFileSize(MAX_FILE_SIZE)}.`); // Execute sequential statement instruction block
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    currentFile = file;                                                                                                                 // Assign variable property value reference
    simulateUpload(file);                                                                                                               // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

function simulateUpload(file) {                                                                                                         // Declare function scope logic
    // Add uploading class to zone
    uploadZone.classList.add('uploading');                                                                                              // Modify element class list collection
    uploadZone.classList.remove('success', 'error');                                                                                    // Modify element class list collection

    // Inject progress HTML structure matching CloudGenerator
    uploadContent.innerHTML = `
        <div class="upload-progress">
            <div class="progress-circle">
                <svg class="progress-ring" width="80" height="80">
                    <circle class="progress-ring-circle"
                            stroke="#3b82f6"
                            stroke-width="4"
                            fill="transparent"
                            r="36"
                            cx="40"
                            cy="40"/>
                </svg>
                <div class="progress-text">0%</div>
            </div>
            <p class="progress-message">Uploading ${file.name}...</p>
        </div>
    `;                                                                                                                                  // Execute sequential statement instruction block

    const progressText = uploadContent.querySelector('.progress-text');                                                                 // Initialize immutable variable state reference
    const progressCircle = uploadContent.querySelector('.progress-ring-circle');                                                        // Initialize immutable variable state reference

    // Setup circle animation
    const radius = 36;                                                                                                                  // Initialize immutable variable state reference
    const circumference = 2 * Math.PI * radius;                                                                                         // Initialize immutable variable state reference
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;                                                         // Modify element visual style property
    progressCircle.style.strokeDashoffset = circumference;                                                                              // Modify element visual style property

    let progress = 0;                                                                                                                   // Initialize mutable variable state reference
    const interval = setInterval(() => {                                                                                                // Initialize immutable variable state reference
        progress += 5;                                                                                                                  // Execute sequential statement instruction block
        if (progress > 100) progress = 100;                                                                                             // Evaluate boolean condition check logic

        progressText.textContent = `${progress}%`;                                                                                      // Execute sequential statement instruction block
        const offset = circumference - (progress / 100) * circumference;                                                                // Initialize immutable variable state reference
        progressCircle.style.strokeDashoffset = offset;                                                                                 // Modify element visual style property

        if (progress === 100) {                                                                                                         // Evaluate boolean condition check logic
            clearInterval(interval);                                                                                                    // Execute sequential statement instruction block
            setTimeout(() => {                                                                                                          // Execute sequential evaluation stream node
                showUploadSuccess(file);                                                                                                // Execute sequential statement instruction block

                // Auto-trigger calculation
                setTimeout(calculateNeighbors, 800);                                                                                    // Execute sequential statement instruction block
            }, 500);                                                                                                                    // Terminate block scope execution context
        }                                                                                                                               // Terminate block scope execution context
    }, 30);                                                                                                                             // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function showUploadSuccess(file) {                                                                                                      // Declare function scope logic
    uploadZone.classList.remove('uploading');                                                                                           // Modify element class list collection
    uploadZone.classList.add('success');                                                                                                // Modify element class list collection

    // Inject success HTML structure matching CloudGenerator
    uploadContent.innerHTML = `
        <div class="upload-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h4>Upload Successful!</h4>
            <p>${file.name}</p>
            <div class="file-details">
                <span class="file-size">${Utils.formatFileSize(file.size)}</span>
            </div>
        </div>
    `;                                                                                                                                  // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

function resetUpload() {                                                                                                                // Declare function scope logic
    // Reset zone classes
    uploadZone.classList.remove('uploading', 'success', 'error', 'drag-over');                                                          // Modify element class list collection

    // Restore original HTML structure
    uploadContent.innerHTML = `
        <div class="upload-icon-container">
            <i class="fas fa-file-csv upload-icon" id="uploadIcon"></i>
            <div class="upload-animation">
                <div class="upload-pulse"></div>
                <div class="upload-pulse"></div>
                <div class="upload-pulse"></div>
            </div>
        </div>
        <h4 class="upload-title" id="uploadTitle">Drop your CSV file here</h4>
        <p class="upload-subtitle" id="uploadSubtitle">or click to browse files</p>
        <div class="upload-formats">
            <span class="format-badge">CSV</span>
        </div>
        <div class="upload-size-limit">
            <i class="fas fa-info-circle"></i>
            <span>Maximum file size: 10MB</span>
        </div>
        <div class="upload-button">
            <i class="fas fa-folder-open"></i>
            <span>Browse Files</span>
        </div>
    `;                                                                                                                                  // Execute sequential statement instruction block

    // Re-bind references if needed (though we use getElementById usually)
    uploadTitle = document.getElementById('uploadTitle');                                                                               // Query document element node reference
    uploadSubtitle = document.getElementById('uploadSubtitle');                                                                         // Query document element node reference

    // Clear file input
    if (fileInput) fileInput.value = '';                                                                                                // Evaluate boolean condition check logic

    currentFile = null;                                                                                                                 // Assign variable property value reference
    dragCounter = 0;                                                                                                                    // Assign variable property value reference

    // Reset result if needed
    const resultSection = document.getElementById('resultSection');                                                                     // Initialize immutable variable state reference
    const uploadCard = document.querySelector('.upload-card');                                                                          // Initialize immutable variable state reference

    if (resultSection && !resultSection.classList.contains('hidden')) {                                                                 // Evaluate boolean condition check logic
        resultSection.classList.add('hidden');                                                                                          // Modify element class list collection
        uploadCard.classList.remove('hidden');                                                                                          // Modify element class list collection
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function calculateNeighbors() {                                                                                                         // Declare function scope logic
    if (!currentFile) return;                                                                                                           // Evaluate boolean condition check logic

    const loadingSection = document.getElementById('loadingSection');                                                                   // Initialize immutable variable state reference
    const resultSection = document.getElementById('resultSection');                                                                     // Initialize immutable variable state reference
    const uploadCard = document.querySelector('.upload-card');                                                                          // Initialize immutable variable state reference

    // Show loading state
    uploadCard.classList.add('hidden');                                                                                                 // Modify element class list collection
    loadingSection.classList.remove('hidden');                                                                                          // Modify element class list collection
    resultSection.classList.add('hidden');                                                                                              // Modify element class list collection

    const formData = new FormData();                                                                                                    // Initialize immutable variable state reference
    formData.append('file', currentFile);                                                                                               // Execute sequential statement instruction block

    const numNeighborsInput = document.getElementById('numNeighbors');                                                                  // Initialize immutable variable state reference
    if (numNeighborsInput) {                                                                                                            // Evaluate boolean condition check logic
        formData.append('nvec', numNeighborsInput.value);                                                                               // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    fetch(`${BASE_URL}/upload_neighbors`, {                                                                                             // Dispatch asynchronous network payload stream
        method: 'POST',                                                                                                                 // Execute sequential evaluation stream node
        body: formData                                                                                                                  // Execute sequential evaluation stream node
    })                                                                                                                                  // Terminate block scope execution context
        .then(response => response.json())                                                                                              // Chain asynchronous promise resolution sequence
        .then(data => {                                                                                                                 // Chain asynchronous promise resolution sequence
            // Hide loading
            loadingSection.classList.add('hidden');                                                                                     // Modify element class list collection

            if (data.success) {                                                                                                         // Evaluate boolean condition check logic
                // Show result section
                resultSection.classList.remove('hidden');                                                                               // Modify element class list collection

                // Display statistics
                const statsContainer = document.getElementById('statsContainer');                                                       // Initialize immutable variable state reference
                if (statsContainer && data.stats) {                                                                                     // Evaluate boolean condition check logic
                    statsContainer.innerHTML = `
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-layer-group"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value count-up" data-target="${data.stats.total_points}">0</span>
                            <span class="stat-label">Total Points</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-map-marked-alt"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value count-up" data-target="${data.stats.total_regions}">0</span>
                            <span class="stat-label">Regions</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-network-wired"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value count-up" data-target="${data.stats.avg_neighbors}" data-decimals="2">0</span>
                            <span class="stat-label">Avg Neighbors</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value count-up" data-target="${data.stats.max_neighbors}">0</span>
                            <span class="stat-label">Max Neighbors (k)</span>
                        </div>
                    </div>
                `;                                                                                                                      // Execute sequential statement instruction block

                    // Trigger count up animation
                    setTimeout(animateNumbers, 100);                                                                                    // Execute sequential statement instruction block
                }                                                                                                                       // Terminate block scope execution context

                // Initialize canvas
                if (data.points && data.neighbors_indices) {                                                                            // Evaluate boolean condition check logic
                    canvasData.points = data.points;                                                                                    // Execute sequential statement instruction block
                    canvasData.neighbors = data.neighbors_indices;                                                                      // Execute sequential statement instruction block
                    canvasData.regions = data.regions || [];                                                                            // Execute sequential statement instruction block
                    canvasData.classifications = data.classifications || [];                                                            // Execute sequential statement instruction block
                    initCanvas();                                                                                                       // Execute sequential statement instruction block
                }                                                                                                                       // Terminate block scope execution context

                // Setup download button
                const downloadBtn = document.getElementById('downloadNeighbors');                                                       // Initialize immutable variable state reference
                if (downloadBtn) {                                                                                                      // Evaluate boolean condition check logic
                    downloadBtn.href = data.neighbors_csv_url;                                                                          // Execute sequential statement instruction block
                    // Update filename for download attribute if possible, or let server handle it
                    downloadBtn.setAttribute('download', 'neighbors.csv');                                                              // Assign element attribute property data
                }                                                                                                                       // Terminate block scope execution context

                // Scroll to result
                resultSection.scrollIntoView({ behavior: 'smooth' });                                                                   // Execute sequential statement instruction block
            } else {                                                                                                                    // Terminate block scope execution context
                // Show error in upload zone
                uploadCard.classList.remove('hidden');                                                                                  // Modify element class list collection
                Utils.showUploadError(uploadZone, uploadContent, 'Calculation Error', data.error || 'An error occurred during neighbor calculation.'); // Execute sequential statement instruction block
            }                                                                                                                           // Terminate block scope execution context
        })                                                                                                                              // Terminate block scope execution context
        .catch(error => {                                                                                                               // Catch asynchronous promise exception payload
            loadingSection.classList.add('hidden');                                                                                     // Modify element class list collection
            uploadCard.classList.remove('hidden');                                                                                      // Modify element class list collection
            Utils.showUploadError(uploadZone, uploadContent, 'Network Error', error.message);                                           // Execute sequential statement instruction block
        });                                                                                                                             // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function animateNumbers() {                                                                                                             // Declare function scope logic
    const counters = document.querySelectorAll('.count-up');                                                                            // Initialize immutable variable state reference

    counters.forEach(counter => {                                                                                                       // Execute sequential evaluation stream node
        const target = parseFloat(counter.getAttribute('data-target'));                                                                 // Initialize immutable variable state reference
        const decimals = parseInt(counter.getAttribute('data-decimals') || 0);                                                          // Initialize immutable variable state reference
        const duration = 1500;                                                                                                          // ms
        const frameDuration = 1000 / 60;                                                                                                // 60fps
        const totalFrames = Math.round(duration / frameDuration);                                                                       // Initialize immutable variable state reference

        let frame = 0;                                                                                                                  // Initialize mutable variable state reference

        const easeOutQuad = t => t * (2 - t);                                                                                           // Initialize immutable variable state reference

        const updateCounter = () => {                                                                                                   // Initialize immutable variable state reference
            frame++;                                                                                                                    // Execute sequential statement instruction block
            const progress = easeOutQuad(frame / totalFrames);                                                                          // Initialize immutable variable state reference
            const current = target * progress;                                                                                          // Initialize immutable variable state reference

            if (frame < totalFrames) {                                                                                                  // Evaluate boolean condition check logic
                if (decimals > 0) {                                                                                                     // Evaluate boolean condition check logic
                    counter.innerText = current.toFixed(decimals);                                                                      // Execute sequential statement instruction block
                } else {                                                                                                                // Terminate block scope execution context
                    counter.innerText = Math.round(current).toLocaleString();                                                           // Execute sequential statement instruction block
                }                                                                                                                       // Terminate block scope execution context
                requestAnimationFrame(updateCounter);                                                                                   // Execute sequential statement instruction block
            } else {                                                                                                                    // Terminate block scope execution context
                if (decimals > 0) {                                                                                                     // Evaluate boolean condition check logic
                    counter.innerText = target.toFixed(decimals);                                                                       // Execute sequential statement instruction block
                } else {                                                                                                                // Terminate block scope execution context
                    counter.innerText = Math.round(target).toLocaleString();                                                            // Execute sequential statement instruction block
                }                                                                                                                       // Terminate block scope execution context
            }                                                                                                                           // Terminate block scope execution context
        };                                                                                                                              // Terminate block scope execution context

        updateCounter();                                                                                                                // Execute sequential statement instruction block
    });                                                                                                                                 // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Expose functions to global scope for onclick handlers
window.resetUpload = resetUpload;                                                                                                       // Execute sequential statement instruction block
window.clearUpload = resetUpload;                                                                                                       // Execute sequential statement instruction block

// --- Canvas Logic ---
function initCanvas() {                                                                                                                 // Declare function scope logic
    const canvas = document.getElementById('cloudCanvas');                                                                              // Initialize immutable variable state reference
    if (!canvas) return;                                                                                                                // Evaluate boolean condition check logic

    const wrapper = document.querySelector('.canvas-wrapper');                                                                          // Initialize immutable variable state reference
    canvas.width = wrapper.clientWidth;                                                                                                 // Execute sequential statement instruction block
    canvas.height = wrapper.clientHeight;                                                                                               // Execute sequential statement instruction block

    if (canvasData.points.length > 0) {                                                                                                 // Evaluate boolean condition check logic
        let xs = canvasData.points.map(p => p[0]);                                                                                      // Initialize mutable variable state reference
        let ys = canvasData.points.map(p => p[1]);                                                                                      // Initialize mutable variable state reference
        canvasData.minX = Math.min(...xs);                                                                                              // Execute sequential statement instruction block
        canvasData.maxX = Math.max(...xs);                                                                                              // Execute sequential statement instruction block
        canvasData.minY = Math.min(...ys);                                                                                              // Execute sequential statement instruction block
        canvasData.maxY = Math.max(...ys);                                                                                              // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    resetView();                                                                                                                        // Execute sequential statement instruction block
    setupCanvasEvents(canvas);                                                                                                          // Execute sequential statement instruction block

    const btnReset = document.getElementById('btnResetView');                                                                           // Initialize immutable variable state reference
    if (btnReset) btnReset.addEventListener('click', resetView);                                                                        // Evaluate boolean condition check logic
}                                                                                                                                       // Terminate block scope execution context

function resetView() {                                                                                                                  // Declare function scope logic
    const canvas = document.getElementById('cloudCanvas');                                                                              // Initialize immutable variable state reference
    if (!canvas || canvasData.points.length === 0) return;                                                                              // Evaluate boolean condition check logic

    const padding = 40;                                                                                                                 // Initialize immutable variable state reference
    const dataWidth = canvasData.maxX - canvasData.minX || 1;                                                                           // Initialize immutable variable state reference
    const dataHeight = canvasData.maxY - canvasData.minY || 1;                                                                          // Initialize immutable variable state reference

    const scaleX = (canvas.width - padding * 2) / dataWidth;                                                                            // Initialize immutable variable state reference
    const scaleY = (canvas.height - padding * 2) / dataHeight;                                                                          // Initialize immutable variable state reference
    canvasData.scale = Math.min(scaleX, scaleY);                                                                                        // Execute sequential statement instruction block

    const cx = (canvasData.minX + canvasData.maxX) / 2;                                                                                 // Initialize immutable variable state reference
    const cy = (canvasData.minY + canvasData.maxY) / 2;                                                                                 // Initialize immutable variable state reference

    canvasData.offsetX = canvas.width / 2 - cx * canvasData.scale;                                                                      // Execute sequential statement instruction block
    canvasData.offsetY = canvas.height / 2 + cy * canvasData.scale;                                                                     // Execute sequential statement instruction block

    drawCanvas();                                                                                                                       // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

function drawCanvas() {                                                                                                                 // Declare function scope logic
    const canvas = document.getElementById('cloudCanvas');                                                                              // Initialize immutable variable state reference
    if (!canvas) return;                                                                                                                // Evaluate boolean condition check logic
    const ctx = canvas.getContext('2d');                                                                                                // Initialize immutable variable state reference

    ctx.clearRect(0, 0, canvas.width, canvas.height);                                                                                   // Execute sequential statement instruction block

    const r = 3;                                                                                                                        // Initialize immutable variable state reference
    const hIdx = canvasData.hoverIdx;                                                                                                   // Initialize immutable variable state reference

    // Determine neighbors to highlight
    let activeNeighbors = [];                                                                                                           // Initialize mutable variable state reference
    if (hIdx !== -1) {                                                                                                                  // Evaluate boolean condition check logic
        const row = canvasData.neighbors[hIdx];                                                                                         // Initialize immutable variable state reference
        if (row) {                                                                                                                      // Evaluate boolean condition check logic
            activeNeighbors = row.filter(n => n !== -1);                                                                                // Assign variable property value reference
        }                                                                                                                               // Terminate block scope execution context
    }                                                                                                                                   // Terminate block scope execution context

    // Draw lines first so they are under points
    if (hIdx !== -1 && activeNeighbors.length > 0) {                                                                                    // Evaluate boolean condition check logic
        const centerPt = canvasData.points[hIdx];                                                                                       // Initialize immutable variable state reference
        const cx = centerPt[0] * canvasData.scale + canvasData.offsetX;                                                                 // Initialize immutable variable state reference
        const cy = -centerPt[1] * canvasData.scale + canvasData.offsetY;                                                                // Initialize immutable variable state reference

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';                                                                                    // Green lines
        ctx.lineWidth = 1.5;                                                                                                            // Execute sequential statement instruction block

        activeNeighbors.forEach(nIdx => {                                                                                               // Execute sequential evaluation stream node
            const nPt = canvasData.points[nIdx];                                                                                        // Initialize immutable variable state reference
            const nx = nPt[0] * canvasData.scale + canvasData.offsetX;                                                                  // Initialize immutable variable state reference
            const ny = -nPt[1] * canvasData.scale + canvasData.offsetY;                                                                 // Initialize immutable variable state reference

            ctx.beginPath();                                                                                                            // Execute sequential statement instruction block
            ctx.moveTo(cx, cy);                                                                                                         // Execute sequential statement instruction block
            ctx.lineTo(nx, ny);                                                                                                         // Execute sequential statement instruction block
            ctx.stroke();                                                                                                               // Execute sequential statement instruction block
        });                                                                                                                             // Terminate block scope execution context
    }                                                                                                                                   // Terminate block scope execution context

    // Draw points
    for (let i = 0; i < canvasData.points.length; i++) {                                                                                // Iterate sequence stream loop control
        const pt = canvasData.points[i];                                                                                                // Initialize immutable variable state reference
        const screenX = pt[0] * canvasData.scale + canvasData.offsetX;                                                                  // Initialize immutable variable state reference
        const screenY = -pt[1] * canvasData.scale + canvasData.offsetY;                                                                 // Initialize immutable variable state reference

        if (screenX < -10 || screenX > canvas.width + 10 || screenY < -10 || screenY > canvas.height + 10) continue;                    // Evaluate boolean condition check logic

        let fillColor = 'rgba(255, 255, 255, 0.3)';                                                                                     // Initialize mutable variable state reference
        let strokeColor = 'rgba(255, 255, 255, 0.1)';                                                                                   // Initialize mutable variable state reference
        let size = r;                                                                                                                   // Initialize mutable variable state reference

        if (i === hIdx) {                                                                                                               // Evaluate boolean condition check logic
            fillColor = '#ef4444';                                                                                                      // Red center
            strokeColor = '#fff';                                                                                                       // Assign variable property value reference
            size = r * 2;                                                                                                               // Assign variable property value reference
        } else if (activeNeighbors.includes(i)) {                                                                                       // Terminate block scope execution context
            fillColor = '#10b981';                                                                                                      // Green neighbor
            strokeColor = '#fff';                                                                                                       // Assign variable property value reference
            size = r * 1.5;                                                                                                             // Assign variable property value reference
        }                                                                                                                               // Terminate block scope execution context

        ctx.beginPath();                                                                                                                // Execute sequential statement instruction block
        ctx.arc(screenX, screenY, size, 0, 2 * Math.PI);                                                                                // Execute sequential statement instruction block
        ctx.fillStyle = fillColor;                                                                                                      // Execute sequential statement instruction block
        ctx.fill();                                                                                                                     // Execute sequential statement instruction block
        ctx.strokeStyle = strokeColor;                                                                                                  // Execute sequential statement instruction block
        ctx.lineWidth = 1;                                                                                                              // Execute sequential statement instruction block
        ctx.stroke();                                                                                                                   // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    // Update Stats Display
    if (hIdx !== -1) {                                                                                                                  // Evaluate boolean condition check logic
        document.getElementById('centerIdDisplay').innerText = hIdx;                                                                    // Query document element node reference
        document.getElementById('regionDisplay').innerText = canvasData.regions[hIdx] || '-';                                           // Query document element node reference
        document.getElementById('neighborsFoundDisplay').innerText = activeNeighbors.length;                                            // Query document element node reference
    } else {                                                                                                                            // Terminate block scope execution context
        document.getElementById('centerIdDisplay').innerText = 'None';                                                                  // Query document element node reference
        document.getElementById('regionDisplay').innerText = '-';                                                                       // Query document element node reference
        document.getElementById('neighborsFoundDisplay').innerText = '0';                                                               // Query document element node reference
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function getPointAt(screenX, screenY) {                                                                                                 // Declare function scope logic
    const threshold = 10;                                                                                                               // Initialize immutable variable state reference
    for (let i = 0; i < canvasData.points.length; i++) {                                                                                // Iterate sequence stream loop control
        const pt = canvasData.points[i];                                                                                                // Initialize immutable variable state reference
        const px = pt[0] * canvasData.scale + canvasData.offsetX;                                                                       // Initialize immutable variable state reference
        const py = -pt[1] * canvasData.scale + canvasData.offsetY;                                                                      // Initialize immutable variable state reference

        const dx = px - screenX;                                                                                                        // Initialize immutable variable state reference
        const dy = py - screenY;                                                                                                        // Initialize immutable variable state reference
        if (dx * dx + dy * dy <= threshold * threshold) {                                                                               // Evaluate boolean condition check logic
            return i;                                                                                                                   // Return execution stream payload data
        }                                                                                                                               // Terminate block scope execution context
    }                                                                                                                                   // Terminate block scope execution context
    return -1;                                                                                                                          // Return execution stream payload data
}                                                                                                                                       // Terminate block scope execution context

function setupCanvasEvents(canvas) {                                                                                                    // Declare function scope logic
    canvas.addEventListener('mousedown', (e) => {                                                                                       // Bind event listener DOM state
        const rect = canvas.getBoundingClientRect();                                                                                    // Initialize immutable variable state reference
        canvasData.lastMouseX = e.clientX - rect.left;                                                                                  // Execute sequential statement instruction block
        canvasData.lastMouseY = e.clientY - rect.top;                                                                                   // Execute sequential statement instruction block
        canvasData.isDragging = true;                                                                                                   // Execute sequential statement instruction block
    });                                                                                                                                 // Terminate block scope execution context

    canvas.addEventListener('mousemove', (e) => {                                                                                       // Bind event listener DOM state
        const rect = canvas.getBoundingClientRect();                                                                                    // Initialize immutable variable state reference
        const x = e.clientX - rect.left;                                                                                                // Initialize immutable variable state reference
        const y = e.clientY - rect.top;                                                                                                 // Initialize immutable variable state reference

        // Coordinates display
        const mathX = (x - canvasData.offsetX) / canvasData.scale;                                                                      // Initialize immutable variable state reference
        const mathY = -(y - canvasData.offsetY) / canvasData.scale;                                                                     // Initialize immutable variable state reference
        const coordDisplay = document.getElementById('coordinatesDisplay');                                                             // Initialize immutable variable state reference
        if (coordDisplay) {                                                                                                             // Evaluate boolean condition check logic
            coordDisplay.innerText = `X: ${formatSci(mathX)}, Y: ${formatSci(mathY)}`;                                                  // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context

        if (canvasData.isDragging) {                                                                                                    // Evaluate boolean condition check logic
            canvasData.offsetX += (x - canvasData.lastMouseX);                                                                          // Execute sequential statement instruction block
            canvasData.offsetY += (y - canvasData.lastMouseY);                                                                          // Execute sequential statement instruction block
            canvasData.lastMouseX = x;                                                                                                  // Execute sequential statement instruction block
            canvasData.lastMouseY = y;                                                                                                  // Execute sequential statement instruction block
            requestAnimationFrame(() => drawCanvas());                                                                                  // Execute sequential statement instruction block
        } else {                                                                                                                        // Terminate block scope execution context
            // Hover logic
            const hovered = getPointAt(x, y);                                                                                           // Initialize immutable variable state reference
            if (hovered !== canvasData.hoverIdx) {                                                                                      // Evaluate boolean condition check logic
                canvasData.hoverIdx = hovered;                                                                                          // Execute sequential statement instruction block
                requestAnimationFrame(() => drawCanvas());                                                                              // Execute sequential statement instruction block
            }                                                                                                                           // Terminate block scope execution context
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context

    window.addEventListener('mouseup', () => {                                                                                          // Bind event listener DOM state
        canvasData.isDragging = false;                                                                                                  // Execute sequential statement instruction block
    });                                                                                                                                 // Terminate block scope execution context

    canvas.addEventListener('wheel', (e) => {                                                                                           // Bind event listener DOM state
        e.preventDefault();                                                                                                             // Execute sequential statement instruction block
        const rect = canvas.getBoundingClientRect();                                                                                    // Initialize immutable variable state reference
        const x = e.clientX - rect.left;                                                                                                // Initialize immutable variable state reference
        const y = e.clientY - rect.top;                                                                                                 // Initialize immutable variable state reference

        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;                                                                                    // Initialize immutable variable state reference

        canvasData.offsetX = x - (x - canvasData.offsetX) * zoomFactor;                                                                 // Execute sequential statement instruction block
        canvasData.offsetY = y - (y - canvasData.offsetY) * zoomFactor;                                                                 // Execute sequential statement instruction block
        canvasData.scale *= zoomFactor;                                                                                                 // Execute sequential statement instruction block

        requestAnimationFrame(() => drawCanvas());                                                                                      // Execute sequential statement instruction block
    });                                                                                                                                 // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context
