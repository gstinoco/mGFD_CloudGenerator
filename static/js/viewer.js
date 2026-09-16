/**
 * CloudViewer — Core functionality for CloudViewer
 * 
 * Overview:
 *     This module provides functionality related to the CloudViewer tool.
 *     Handles file upload and visualization for point clouds, implementing drag-and-drop.
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

                // Auto-trigger visualization
                setTimeout(visualizeData, 800);                                                                                         // Execute sequential statement instruction block
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

    // Reset visualization result if needed
    const resultSection = document.getElementById('resultSection');                                                                     // Initialize immutable variable state reference
    const uploadCard = document.querySelector('.upload-card');                                                                          // Initialize immutable variable state reference

    if (resultSection && !resultSection.classList.contains('hidden')) {                                                                 // Evaluate boolean condition check logic
        resultSection.classList.add('hidden');                                                                                          // Modify element class list collection
        uploadCard.classList.remove('hidden');                                                                                          // Modify element class list collection
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// --- Interactive Canvas State ---
let canvasData = {                                                                                                                      // Initialize mutable variable state reference
    points: [],                                                                                                                         // Execute sequential evaluation stream node
    regions: [],                                                                                                                        // Execute sequential evaluation stream node
    classifications: [],                                                                                                                // Execute sequential evaluation stream node
    scale: 1,                                                                                                                           // Execute sequential evaluation stream node
    offsetX: 0,                                                                                                                         // Execute sequential evaluation stream node
    offsetY: 0,                                                                                                                         // Execute sequential evaluation stream node
    minX: 0, maxX: 0, minY: 0, maxY: 0,                                                                                                 // Execute sequential evaluation stream node
    currentTool: 'pan',                                                                                                                 // 'pan', 'move', 'delete', 'add'
    selectedPointIdx: -1,                                                                                                               // Execute sequential evaluation stream node
    isDragging: false,                                                                                                                  // Execute sequential evaluation stream node
    lastMouseX: 0,                                                                                                                      // Execute sequential evaluation stream node
    lastMouseY: 0,                                                                                                                      // Execute sequential evaluation stream node

    // Advanced features
    history: [],                                                                                                                        // Execute sequential evaluation stream node
    historyIndex: -1,                                                                                                                   // Execute sequential evaluation stream node
    printMode: false,                                                                                                                   // Execute sequential evaluation stream node
    colorRegions: false,                                                                                                                // Execute sequential evaluation stream node
    pointMoved: false                                                                                                                   // Execute sequential evaluation stream node
};                                                                                                                                      // Terminate block scope execution context

// Helper for displaying very small numbers properly
function formatSci(val) {                                                                                                               // Declare function scope logic
    if (val === 0) return "0.000";                                                                                                      // Evaluate boolean condition check logic
    if (Math.abs(val) < 0.01 || Math.abs(val) >= 10000) {                                                                               // Evaluate boolean condition check logic
        return val.toExponential(3);                                                                                                    // Return execution stream payload data
    }                                                                                                                                   // Terminate block scope execution context
    return val.toFixed(4);                                                                                                              // Return execution stream payload data
}                                                                                                                                       // Terminate block scope execution context

function calculateDensityMetrics() {                                                                                                    // Declare function scope logic
    if (canvasData.points.length < 2) {                                                                                                 // Evaluate boolean condition check logic
        document.getElementById('minDistDisplay').innerText = '0.000';                                                                  // Query document element node reference
        document.getElementById('avgDistDisplay').innerText = '0.000';                                                                  // Query document element node reference
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    let minDist = Infinity;                                                                                                             // Initialize mutable variable state reference
    let sumDist = 0;                                                                                                                    // Initialize mutable variable state reference

    // Calculate nearest neighbor for each point
    for (let i = 0; i < canvasData.points.length; i++) {                                                                                // Iterate sequence stream loop control
        let minLocalDist = Infinity;                                                                                                    // Initialize mutable variable state reference
        const p1 = canvasData.points[i];                                                                                                // Initialize immutable variable state reference

        for (let j = 0; j < canvasData.points.length; j++) {                                                                            // Iterate sequence stream loop control
            if (i === j) continue;                                                                                                      // Evaluate boolean condition check logic
            const p2 = canvasData.points[j];                                                                                            // Initialize immutable variable state reference
            const dx = p1[0] - p2[0];                                                                                                   // Initialize immutable variable state reference
            const dy = p1[1] - p2[1];                                                                                                   // Initialize immutable variable state reference
            const distSq = dx * dx + dy * dy;                                                                                           // Initialize immutable variable state reference
            if (distSq < minLocalDist) {                                                                                                // Evaluate boolean condition check logic
                minLocalDist = distSq;                                                                                                  // Assign variable property value reference
            }                                                                                                                           // Terminate block scope execution context
        }                                                                                                                               // Terminate block scope execution context

        const dist = Math.sqrt(minLocalDist);                                                                                           // Initialize immutable variable state reference
        if (dist < minDist) minDist = dist;                                                                                             // Evaluate boolean condition check logic
        sumDist += dist;                                                                                                                // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    const avgDist = sumDist / canvasData.points.length;                                                                                 // Initialize immutable variable state reference

    document.getElementById('minDistDisplay').innerText = formatSci(minDist);                                                           // Query document element node reference
    document.getElementById('avgDistDisplay').innerText = formatSci(avgDist);                                                           // Query document element node reference
}                                                                                                                                       // Terminate block scope execution context

function updateUndoRedoButtons() {                                                                                                      // Declare function scope logic
    document.getElementById('btnUndo').disabled = canvasData.historyIndex <= 0;                                                         // Query document element node reference
    document.getElementById('btnRedo').disabled = canvasData.historyIndex >= canvasData.history.length - 1;                             // Query document element node reference
}                                                                                                                                       // Terminate block scope execution context

function saveState() {                                                                                                                  // Declare function scope logic
    // Truncate history if we are not at the end
    if (canvasData.historyIndex < canvasData.history.length - 1) {                                                                      // Evaluate boolean condition check logic
        canvasData.history = canvasData.history.slice(0, canvasData.historyIndex + 1);                                                  // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    // Copy state
    const pointsCopy = canvasData.points.map(p => [...p]);                                                                              // Initialize immutable variable state reference
    const regionsCopy = [...canvasData.regions];                                                                                        // Initialize immutable variable state reference
    const classCopy = [...canvasData.classifications];                                                                                  // Initialize immutable variable state reference

    canvasData.history.push({                                                                                                           // Execute sequential evaluation stream node
        points: pointsCopy,                                                                                                             // Execute sequential evaluation stream node
        regions: regionsCopy,                                                                                                           // Execute sequential evaluation stream node
        classifications: classCopy                                                                                                      // Execute sequential evaluation stream node
    });                                                                                                                                 // Terminate block scope execution context

    // Limit history size to 20 to prevent memory issues
    if (canvasData.history.length > 20) {                                                                                               // Evaluate boolean condition check logic
        canvasData.history.shift();                                                                                                     // Execute sequential statement instruction block
    } else {                                                                                                                            // Terminate block scope execution context
        canvasData.historyIndex++;                                                                                                      // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    updateUndoRedoButtons();                                                                                                            // Execute sequential statement instruction block
    calculateDensityMetrics();                                                                                                          // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

const REGION_COLORS = [                                                                                                                 // Initialize immutable variable state reference
    '#3399FF', '#4DE64D', '#FFB333', '#CC4DFF',                                                                                         // Execute sequential evaluation stream node
    '#E69933', '#FF80CC', '#B3B3B3'                                                                                                     // Execute sequential evaluation stream node
];                                                                                                                                      // Execute sequential statement instruction block

function visualizeData() {                                                                                                              // Declare function scope logic
    if (!currentFile) return;                                                                                                           // Evaluate boolean condition check logic

    const loadingSection = document.getElementById('loadingSection');                                                                   // Initialize immutable variable state reference
    const resultSection = document.getElementById('resultSection');                                                                     // Initialize immutable variable state reference
    const uploadCard = document.querySelector('.upload-card');                                                                          // Initialize immutable variable state reference

    uploadCard.classList.add('hidden');                                                                                                 // Modify element class list collection
    loadingSection.classList.remove('hidden');                                                                                          // Modify element class list collection
    resultSection.classList.add('hidden');                                                                                              // Modify element class list collection

    const formData = new FormData();                                                                                                    // Initialize immutable variable state reference
    formData.append('file', currentFile);                                                                                               // Execute sequential statement instruction block

    fetch(`${BASE_URL}/upload_viewer`, {                                                                                                // Dispatch asynchronous network payload stream
        method: 'POST',                                                                                                                 // Execute sequential evaluation stream node
        body: formData                                                                                                                  // Execute sequential evaluation stream node
    })                                                                                                                                  // Terminate block scope execution context
        .then(response => response.json())                                                                                              // Chain asynchronous promise resolution sequence
        .then(data => {                                                                                                                 // Chain asynchronous promise resolution sequence
            loadingSection.classList.add('hidden');                                                                                     // Modify element class list collection

            if (data.success) {                                                                                                         // Evaluate boolean condition check logic
                resultSection.classList.remove('hidden');                                                                               // Modify element class list collection

                // Initialize canvas data
                canvasData.points = data.points;                                                                                        // Execute sequential statement instruction block
                canvasData.regions = data.regions;                                                                                      // Execute sequential statement instruction block
                canvasData.classifications = data.classifications;                                                                      // Execute sequential statement instruction block

                canvasData.history = [];                                                                                                // Execute sequential statement instruction block
                canvasData.historyIndex = -1;                                                                                           // Execute sequential statement instruction block
                saveState();                                                                                                            // Execute sequential statement instruction block

                initCanvas();                                                                                                           // Execute sequential statement instruction block

                resultSection.scrollIntoView({ behavior: 'smooth' });                                                                   // Execute sequential statement instruction block
            } else {                                                                                                                    // Terminate block scope execution context
                uploadCard.classList.remove('hidden');                                                                                  // Modify element class list collection
                Utils.showUploadError(uploadZone, uploadContent, 'Visualization Error', data.error || 'An error occurred during visualization.'); // Execute sequential statement instruction block
            }                                                                                                                           // Terminate block scope execution context
        })                                                                                                                              // Terminate block scope execution context
        .catch(error => {                                                                                                               // Catch asynchronous promise exception payload
            loadingSection.classList.add('hidden');                                                                                     // Modify element class list collection
            uploadCard.classList.remove('hidden');                                                                                      // Modify element class list collection
            Utils.showUploadError(uploadZone, uploadContent, 'Network Error', error.message);                                           // Execute sequential statement instruction block
        });                                                                                                                             // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function initCanvas() {                                                                                                                 // Declare function scope logic
    const canvas = document.getElementById('cloudCanvas');                                                                              // Initialize immutable variable state reference
    const ctx = canvas.getContext('2d');                                                                                                // Initialize immutable variable state reference
    const wrapper = document.querySelector('.canvas-wrapper');                                                                          // Initialize immutable variable state reference

    // Set actual canvas resolution to match display size
    canvas.width = wrapper.clientWidth;                                                                                                 // Execute sequential statement instruction block
    canvas.height = wrapper.clientHeight;                                                                                               // Execute sequential statement instruction block

    // Calculate bounds
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
    setupToolbarEvents();                                                                                                               // Execute sequential statement instruction block

    document.getElementById('downloadModifiedCsv').addEventListener('click', exportCsv);                                                // Bind event listener DOM state
    document.getElementById('downloadCanvasPng').addEventListener('click', exportPng);                                                  // Bind event listener DOM state
}                                                                                                                                       // Terminate block scope execution context

function resetView() {                                                                                                                  // Declare function scope logic
    const canvas = document.getElementById('cloudCanvas');                                                                              // Initialize immutable variable state reference
    const padding = 40;                                                                                                                 // Initialize immutable variable state reference
    const dataWidth = canvasData.maxX - canvasData.minX || 1;                                                                           // Initialize immutable variable state reference
    const dataHeight = canvasData.maxY - canvasData.minY || 1;                                                                          // Initialize immutable variable state reference

    const scaleX = (canvas.width - padding * 2) / dataWidth;                                                                            // Initialize immutable variable state reference
    const scaleY = (canvas.height - padding * 2) / dataHeight;                                                                          // Initialize immutable variable state reference
    canvasData.scale = Math.min(scaleX, scaleY);                                                                                        // Execute sequential statement instruction block

    const cx = (canvasData.minX + canvasData.maxX) / 2;                                                                                 // Initialize immutable variable state reference
    const cy = (canvasData.minY + canvasData.maxY) / 2;                                                                                 // Initialize immutable variable state reference

    canvasData.offsetX = canvas.width / 2 - cx * canvasData.scale;                                                                      // Execute sequential statement instruction block
    canvasData.offsetY = canvas.height / 2 + cy * canvasData.scale;                                                                     // + because Y is flipped in math vs screen

    drawCanvas();                                                                                                                       // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

function drawCanvas() {                                                                                                                 // Declare function scope logic
    const canvas = document.getElementById('cloudCanvas');                                                                              // Initialize immutable variable state reference
    const ctx = canvas.getContext('2d');                                                                                                // Initialize immutable variable state reference

    ctx.clearRect(0, 0, canvas.width, canvas.height);                                                                                   // Execute sequential statement instruction block

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';                                                                                      // Execute sequential statement instruction block
    ctx.lineWidth = 1;                                                                                                                  // Execute sequential statement instruction block
    ctx.beginPath();                                                                                                                    // Execute sequential statement instruction block
    for (let x = canvasData.offsetX % 50; x < canvas.width; x += 50) {                                                                  // Iterate sequence stream loop control
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);                                                                                 // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
    for (let y = canvasData.offsetY % 50; y < canvas.height; y += 50) {                                                                 // Iterate sequence stream loop control
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);                                                                                  // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
    ctx.stroke();                                                                                                                       // Execute sequential statement instruction block

    // Draw Points
    const r = 3;                                                                                                                        // Initialize immutable variable state reference

    for (let i = 0; i < canvasData.points.length; i++) {                                                                                // Iterate sequence stream loop control
        const pt = canvasData.points[i];                                                                                                // Initialize immutable variable state reference
        const screenX = pt[0] * canvasData.scale + canvasData.offsetX;                                                                  // Initialize immutable variable state reference
        const screenY = -pt[1] * canvasData.scale + canvasData.offsetY;                                                                 // Initialize immutable variable state reference

        // Skip if outside viewport for performance
        if (screenX < -10 || screenX > canvas.width + 10 || screenY < -10 || screenY > canvas.height + 10) continue;                    // Evaluate boolean condition check logic

        const regionId = canvasData.regions[i];                                                                                         // Initialize immutable variable state reference
        const isBoundary = canvasData.classifications[i] === 'boundary';                                                                // Initialize immutable variable state reference

        let fillColor;                                                                                                                  // Initialize mutable variable state reference
        let strokeColor = 'rgba(0,0,0,0.5)';                                                                                            // Initialize mutable variable state reference

        if (canvasData.printMode) {                                                                                                     // Evaluate boolean condition check logic
            // White background: boundaries black, interiors colored or grey
            if (canvasData.colorRegions) {                                                                                              // Evaluate boolean condition check logic
                fillColor = isBoundary ? '#000000' : (REGION_COLORS[(regionId - 1) % REGION_COLORS.length] || '#718096');               // Assign variable property value reference
            } else {                                                                                                                    // Terminate block scope execution context
                fillColor = isBoundary ? '#000000' : '#4299E1';                                                                         // Assign variable property value reference
            }                                                                                                                           // Terminate block scope execution context
            if (i === canvasData.selectedPointIdx) {                                                                                    // Evaluate boolean condition check logic
                fillColor = '#FF0000';                                                                                                  // Assign variable property value reference
                strokeColor = '#000000';                                                                                                // Assign variable property value reference
            } else if (isBoundary) {                                                                                                    // Terminate block scope execution context
                strokeColor = '#000000';                                                                                                // Assign variable property value reference
            }                                                                                                                           // Terminate block scope execution context
        } else {                                                                                                                        // Terminate block scope execution context
            // Dark background: boundaries white, interiors colored or grey
            if (canvasData.colorRegions) {                                                                                              // Evaluate boolean condition check logic
                fillColor = isBoundary ? '#FFFFFF' : (REGION_COLORS[(regionId - 1) % REGION_COLORS.length] || '#A0AEC0');               // Assign variable property value reference
            } else {                                                                                                                    // Terminate block scope execution context
                fillColor = isBoundary ? '#FFFFFF' : '#4299E1';                                                                         // Assign variable property value reference
            }                                                                                                                           // Terminate block scope execution context
            if (i === canvasData.selectedPointIdx) {                                                                                    // Evaluate boolean condition check logic
                fillColor = '#FF3366';                                                                                                  // Assign variable property value reference
                strokeColor = '#FFFFFF';                                                                                                // Assign variable property value reference
            } else if (isBoundary) {                                                                                                    // Terminate block scope execution context
                strokeColor = 'rgba(0,0,0,0.5)';                                                                                        // Assign variable property value reference
            }                                                                                                                           // Terminate block scope execution context
        }                                                                                                                               // Terminate block scope execution context

        ctx.beginPath();                                                                                                                // Execute sequential statement instruction block
        ctx.arc(screenX, screenY, i === canvasData.selectedPointIdx ? r * 2 : r, 0, 2 * Math.PI);                                       // Execute sequential statement instruction block
        ctx.fillStyle = fillColor;                                                                                                      // Execute sequential statement instruction block
        ctx.fill();                                                                                                                     // Execute sequential statement instruction block

        if (i === canvasData.selectedPointIdx || isBoundary) {                                                                          // Evaluate boolean condition check logic
            ctx.strokeStyle = strokeColor;                                                                                              // Execute sequential statement instruction block
            ctx.lineWidth = i === canvasData.selectedPointIdx ? 2 : 1;                                                                  // Execute sequential statement instruction block
            ctx.stroke();                                                                                                               // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    }                                                                                                                                   // Terminate block scope execution context

    // Update Stats
    document.getElementById('pointCountDisplay').innerText = canvasData.points.length;                                                  // Query document element node reference
}                                                                                                                                       // Terminate block scope execution context

function getPointAt(screenX, screenY) {                                                                                                 // Declare function scope logic
    const threshold = 6;                                                                                                                // Hit radius
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
        const x = e.clientX - rect.left;                                                                                                // Initialize immutable variable state reference
        const y = e.clientY - rect.top;                                                                                                 // Initialize immutable variable state reference

        canvasData.lastMouseX = x;                                                                                                      // Execute sequential statement instruction block
        canvasData.lastMouseY = y;                                                                                                      // Execute sequential statement instruction block
        canvasData.isDragging = true;                                                                                                   // Execute sequential statement instruction block

        const clickedIdx = getPointAt(x, y);                                                                                            // Initialize immutable variable state reference

        if (canvasData.currentTool === 'delete') {                                                                                      // Evaluate boolean condition check logic
            if (clickedIdx !== -1) {                                                                                                    // Evaluate boolean condition check logic
                canvasData.points.splice(clickedIdx, 1);                                                                                // Execute sequential statement instruction block
                canvasData.regions.splice(clickedIdx, 1);                                                                               // Execute sequential statement instruction block
                canvasData.classifications.splice(clickedIdx, 1);                                                                       // Execute sequential statement instruction block
                canvasData.selectedPointIdx = -1;                                                                                       // Execute sequential statement instruction block
                saveState();                                                                                                            // Execute sequential statement instruction block
                drawCanvas();                                                                                                           // Execute sequential statement instruction block
            }                                                                                                                           // Terminate block scope execution context
        } else if (canvasData.currentTool === 'move') {                                                                                 // Terminate block scope execution context
            canvasData.selectedPointIdx = clickedIdx;                                                                                   // Execute sequential statement instruction block
            canvasData.pointMoved = false;                                                                                              // Reset movement tracker
            drawCanvas();                                                                                                               // Execute sequential statement instruction block
        } else if (canvasData.currentTool === 'add') {                                                                                  // Terminate block scope execution context
            const mathX = (x - canvasData.offsetX) / canvasData.scale;                                                                  // Initialize immutable variable state reference
            const mathY = -(y - canvasData.offsetY) / canvasData.scale;                                                                 // Initialize immutable variable state reference

            // Find nearest neighbor region
            let nearestRegion = 1;                                                                                                      // Default
            let minDist = Infinity;                                                                                                     // Initialize mutable variable state reference
            for (let i = 0; i < canvasData.points.length; i++) {                                                                        // Iterate sequence stream loop control
                const pt = canvasData.points[i];                                                                                        // Initialize immutable variable state reference
                const dx = pt[0] - mathX;                                                                                               // Initialize immutable variable state reference
                const dy = pt[1] - mathY;                                                                                               // Initialize immutable variable state reference
                const d = dx * dx + dy * dy;                                                                                            // Initialize immutable variable state reference
                if (d < minDist) {                                                                                                      // Evaluate boolean condition check logic
                    minDist = d;                                                                                                        // Assign variable property value reference
                    nearestRegion = canvasData.regions[i];                                                                              // Assign variable property value reference
                }                                                                                                                       // Terminate block scope execution context
            }                                                                                                                           // Terminate block scope execution context

            canvasData.points.push([mathX, mathY]);                                                                                     // Execute sequential statement instruction block
            canvasData.regions.push(nearestRegion);                                                                                     // Execute sequential statement instruction block
            canvasData.classifications.push('interior');                                                                                // Execute sequential statement instruction block
            saveState();                                                                                                                // Execute sequential statement instruction block
            drawCanvas();                                                                                                               // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context

    canvas.addEventListener('mousemove', (e) => {                                                                                       // Bind event listener DOM state
        const rect = canvas.getBoundingClientRect();                                                                                    // Initialize immutable variable state reference
        const x = e.clientX - rect.left;                                                                                                // Initialize immutable variable state reference
        const y = e.clientY - rect.top;                                                                                                 // Initialize immutable variable state reference

        const dx = x - canvasData.lastMouseX;                                                                                           // Initialize immutable variable state reference
        const dy = y - canvasData.lastMouseY;                                                                                           // Initialize immutable variable state reference

        // Tooltip updates
        const hoverIdx = getPointAt(x, y);                                                                                              // Initialize immutable variable state reference
        const tooltip = document.getElementById('nodeTooltip');                                                                         // Initialize immutable variable state reference
        if (hoverIdx !== -1 && canvasData.currentTool !== 'pan') {                                                                      // Evaluate boolean condition check logic
            const pt = canvasData.points[hoverIdx];                                                                                     // Initialize immutable variable state reference
            tooltip.innerText = `ID: ${hoverIdx}\nX: ${formatSci(pt[0])}, Y: ${formatSci(pt[1])}\nReg: ${canvasData.regions[hoverIdx]}`; // Execute sequential statement instruction block
            tooltip.style.left = (e.clientX + 10) + 'px';                                                                               // Modify element visual style property
            tooltip.style.top = (e.clientY + 10) + 'px';                                                                                // Modify element visual style property
            tooltip.classList.remove('hidden');                                                                                         // Modify element class list collection
            canvas.style.cursor = 'pointer';                                                                                            // Modify element visual style property
        } else {                                                                                                                        // Terminate block scope execution context
            tooltip.classList.add('hidden');                                                                                            // Modify element class list collection
            canvas.style.cursor = canvasData.currentTool === 'pan' ? (canvasData.isDragging ? 'grabbing' : 'grab') : 'crosshair';       // Modify element visual style property
        }                                                                                                                               // Terminate block scope execution context

        // Coordinate display
        const mathX = (x - canvasData.offsetX) / canvasData.scale;                                                                      // Initialize immutable variable state reference
        const mathY = -(y - canvasData.offsetY) / canvasData.scale;                                                                     // Initialize immutable variable state reference
        document.getElementById('coordinatesDisplay').innerText = `X: ${formatSci(mathX)}, Y: ${formatSci(mathY)}`;                     // Query document element node reference

        if (!canvasData.isDragging) return;                                                                                             // Evaluate boolean condition check logic

        if (canvasData.currentTool === 'pan') {                                                                                         // Evaluate boolean condition check logic
            canvasData.offsetX += dx;                                                                                                   // Execute sequential statement instruction block
            canvasData.offsetY += dy;                                                                                                   // Execute sequential statement instruction block
            drawCanvas();                                                                                                               // Execute sequential statement instruction block
        } else if (canvasData.currentTool === 'move' && canvasData.selectedPointIdx !== -1) {                                           // Terminate block scope execution context
            canvasData.points[canvasData.selectedPointIdx][0] = mathX;                                                                  // Execute sequential statement instruction block
            canvasData.points[canvasData.selectedPointIdx][1] = mathY;                                                                  // Execute sequential statement instruction block
            canvasData.pointMoved = true;                                                                                               // Execute sequential statement instruction block
            drawCanvas();                                                                                                               // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context

        canvasData.lastMouseX = x;                                                                                                      // Execute sequential statement instruction block
        canvasData.lastMouseY = y;                                                                                                      // Execute sequential statement instruction block
    });                                                                                                                                 // Terminate block scope execution context

    window.addEventListener('mouseup', () => {                                                                                          // Bind event listener DOM state
        if (canvasData.isDragging && canvasData.currentTool === 'move' && canvasData.pointMoved) {                                      // Evaluate boolean condition check logic
            saveState();                                                                                                                // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
        canvasData.isDragging = false;                                                                                                  // Execute sequential statement instruction block
        canvasData.selectedPointIdx = -1;                                                                                               // Execute sequential statement instruction block
        canvasData.pointMoved = false;                                                                                                  // Execute sequential statement instruction block
        drawCanvas();                                                                                                                   // Execute sequential statement instruction block
    });                                                                                                                                 // Terminate block scope execution context

    canvas.addEventListener('wheel', (e) => {                                                                                           // Bind event listener DOM state
        e.preventDefault();                                                                                                             // Execute sequential statement instruction block
        const rect = canvas.getBoundingClientRect();                                                                                    // Initialize immutable variable state reference
        const x = e.clientX - rect.left;                                                                                                // Initialize immutable variable state reference
        const y = e.clientY - rect.top;                                                                                                 // Initialize immutable variable state reference

        const zoomIntensity = 0.1;                                                                                                      // Initialize immutable variable state reference
        const wheel = e.deltaY < 0 ? 1 : -1;                                                                                            // Initialize immutable variable state reference
        const zoomFactor = Math.exp(wheel * zoomIntensity);                                                                             // Initialize immutable variable state reference

        // Adjust offset so zoom is centered on mouse
        canvasData.offsetX = x - (x - canvasData.offsetX) * zoomFactor;                                                                 // Execute sequential statement instruction block
        canvasData.offsetY = y - (y - canvasData.offsetY) * zoomFactor;                                                                 // Execute sequential statement instruction block
        canvasData.scale *= zoomFactor;                                                                                                 // Execute sequential statement instruction block

        drawCanvas();                                                                                                                   // Execute sequential statement instruction block
    });                                                                                                                                 // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function setupToolbarEvents() {                                                                                                         // Declare function scope logic
    const btnPan = document.getElementById('toolPan');                                                                                  // Initialize immutable variable state reference
    const btnMove = document.getElementById('toolMove');                                                                                // Initialize immutable variable state reference
    const btnDelete = document.getElementById('toolDelete');                                                                            // Initialize immutable variable state reference
    const btnReset = document.getElementById('btnResetView');                                                                           // Initialize immutable variable state reference

    const btnAdd = document.getElementById('toolAdd');                                                                                  // Initialize immutable variable state reference
    const btnUndo = document.getElementById('btnUndo');                                                                                 // Initialize immutable variable state reference
    const btnRedo = document.getElementById('btnRedo');                                                                                 // Initialize immutable variable state reference
    const togglePrintMode = document.getElementById('togglePrintMode');                                                                 // Initialize immutable variable state reference
    const toggleColorRegions = document.getElementById('toggleColorRegions');                                                           // Initialize immutable variable state reference
    const printModeBtn = document.getElementById('printModeBtn');                                                                       // Initialize immutable variable state reference
    const colorModeBtn = document.getElementById('colorModeBtn');                                                                       // Initialize immutable variable state reference

    const setTool = (tool, activeBtn) => {                                                                                              // Initialize immutable variable state reference
        canvasData.currentTool = tool;                                                                                                  // Execute sequential statement instruction block
        [btnPan, btnMove, btnDelete, btnAdd].forEach(b => b.classList.remove('active'));                                                // Modify element class list collection
        activeBtn.classList.add('active');                                                                                              // Modify element class list collection
        document.getElementById('cloudCanvas').style.cursor = tool === 'pan' ? 'grab' : 'crosshair';                                    // Query document element node reference
    };                                                                                                                                  // Terminate block scope execution context

    btnPan.addEventListener('click', () => setTool('pan', btnPan));                                                                     // Bind event listener DOM state
    btnMove.addEventListener('click', () => setTool('move', btnMove));                                                                  // Bind event listener DOM state
    btnDelete.addEventListener('click', () => setTool('delete', btnDelete));                                                            // Bind event listener DOM state
    btnAdd.addEventListener('click', () => setTool('add', btnAdd));                                                                     // Bind event listener DOM state
    btnReset.addEventListener('click', resetView);                                                                                      // Bind event listener DOM state

    // Undo/Redo logic
    btnUndo.addEventListener('click', () => {                                                                                           // Bind event listener DOM state
        if (canvasData.historyIndex > 0) {                                                                                              // Evaluate boolean condition check logic
            canvasData.historyIndex--;                                                                                                  // Execute sequential statement instruction block
            const state = canvasData.history[canvasData.historyIndex];                                                                  // Initialize immutable variable state reference
            canvasData.points = state.points.map(p => [...p]);                                                                          // Execute sequential statement instruction block
            canvasData.regions = [...state.regions];                                                                                    // Execute sequential statement instruction block
            canvasData.classifications = [...state.classifications];                                                                    // Execute sequential statement instruction block
            updateUndoRedoButtons();                                                                                                    // Execute sequential statement instruction block
            calculateDensityMetrics();                                                                                                  // Execute sequential statement instruction block
            drawCanvas();                                                                                                               // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context

    btnRedo.addEventListener('click', () => {                                                                                           // Bind event listener DOM state
        if (canvasData.historyIndex < canvasData.history.length - 1) {                                                                  // Evaluate boolean condition check logic
            canvasData.historyIndex++;                                                                                                  // Execute sequential statement instruction block
            const state = canvasData.history[canvasData.historyIndex];                                                                  // Initialize immutable variable state reference
            canvasData.points = state.points.map(p => [...p]);                                                                          // Execute sequential statement instruction block
            canvasData.regions = [...state.regions];                                                                                    // Execute sequential statement instruction block
            canvasData.classifications = [...state.classifications];                                                                    // Execute sequential statement instruction block
            updateUndoRedoButtons();                                                                                                    // Execute sequential statement instruction block
            calculateDensityMetrics();                                                                                                  // Execute sequential statement instruction block
            drawCanvas();                                                                                                               // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context

    // Toggles logic
    togglePrintMode.addEventListener('change', (e) => {                                                                                 // Bind event listener DOM state
        canvasData.printMode = e.target.checked;                                                                                        // Execute sequential statement instruction block
        const wrapper = document.querySelector('.canvas-wrapper');                                                                      // Initialize immutable variable state reference
        if (canvasData.printMode) {                                                                                                     // Evaluate boolean condition check logic
            wrapper.style.background = '#ffffff';                                                                                       // Modify element visual style property
            printModeBtn.style.background = '#e2e8f0';                                                                                  // Modify element visual style property
        } else {                                                                                                                        // Terminate block scope execution context
            wrapper.style.background = '#1a1f24';                                                                                       // Modify element visual style property
            printModeBtn.style.background = 'white';                                                                                    // Modify element visual style property
        }                                                                                                                               // Terminate block scope execution context
        drawCanvas();                                                                                                                   // Execute sequential statement instruction block
    });                                                                                                                                 // Terminate block scope execution context

    toggleColorRegions.addEventListener('change', (e) => {                                                                              // Bind event listener DOM state
        canvasData.colorRegions = e.target.checked;                                                                                     // Execute sequential statement instruction block
        if (canvasData.colorRegions) {                                                                                                  // Evaluate boolean condition check logic
            colorModeBtn.classList.add('active');                                                                                       // Modify element class list collection
        } else {                                                                                                                        // Terminate block scope execution context
            colorModeBtn.classList.remove('active');                                                                                    // Modify element class list collection
        }                                                                                                                               // Terminate block scope execution context
        drawCanvas();                                                                                                                   // Execute sequential statement instruction block
    });                                                                                                                                 // Terminate block scope execution context

    // Keyboard shortcuts for Undo/Redo
    document.addEventListener('keydown', (e) => {                                                                                       // Bind event listener DOM state
        if (e.ctrlKey || e.metaKey) {                                                                                                   // Evaluate boolean condition check logic
            if (e.key === 'z') {                                                                                                        // Evaluate boolean condition check logic
                e.preventDefault();                                                                                                     // Execute sequential statement instruction block
                btnUndo.click();                                                                                                        // Execute sequential statement instruction block
            } else if (e.key === 'y') {                                                                                                 // Terminate block scope execution context
                e.preventDefault();                                                                                                     // Execute sequential statement instruction block
                btnRedo.click();                                                                                                        // Execute sequential statement instruction block
            }                                                                                                                           // Terminate block scope execution context
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function exportCsv(e) {                                                                                                                 // Declare function scope logic
    e.preventDefault();                                                                                                                 // Execute sequential statement instruction block
    if (canvasData.points.length === 0) return;                                                                                         // Evaluate boolean condition check logic

    let csvContent = "x,y,classification,region\n";                                                                                     // Initialize mutable variable state reference
    for (let i = 0; i < canvasData.points.length; i++) {                                                                                // Iterate sequence stream loop control
        const pt = canvasData.points[i];                                                                                                // Initialize immutable variable state reference
        csvContent += `${pt[0]},${pt[1]},${canvasData.classifications[i]},${canvasData.regions[i]}\n`;                                  // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });                                                           // Initialize immutable variable state reference
    const url = URL.createObjectURL(blob);                                                                                              // Initialize immutable variable state reference

    const link = document.createElement("a");                                                                                           // Initialize immutable variable state reference
    link.setAttribute("href", url);                                                                                                     // Assign element attribute property data
    link.setAttribute("download", `modified_cloud_${Date.now()}.csv`);                                                                  // Assign element attribute property data
    document.body.appendChild(link);                                                                                                    // Execute sequential statement instruction block
    link.click();                                                                                                                       // Execute sequential statement instruction block
    document.body.removeChild(link);                                                                                                    // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

function exportPng(e) {                                                                                                                 // Declare function scope logic
    e.preventDefault();                                                                                                                 // Execute sequential statement instruction block
    const canvas = document.getElementById('cloudCanvas');                                                                              // Initialize immutable variable state reference
    const url = canvas.toDataURL('image/png');                                                                                          // Initialize immutable variable state reference

    const link = document.createElement("a");                                                                                           // Initialize immutable variable state reference
    link.setAttribute("href", url);                                                                                                     // Assign element attribute property data
    link.setAttribute("download", `cloud_snapshot_${Date.now()}.png`);                                                                  // Assign element attribute property data
    document.body.appendChild(link);                                                                                                    // Execute sequential statement instruction block
    link.click();                                                                                                                       // Execute sequential statement instruction block
    document.body.removeChild(link);                                                                                                    // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// Expose functions to global scope for onclick handlers
window.resetUpload = resetUpload;                                                                                                       // Execute sequential statement instruction block
window.clearUpload = resetUpload;                                                                                                       // Execute sequential statement instruction block
