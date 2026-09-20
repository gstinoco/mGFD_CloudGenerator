/*
NeighborsCalculator — Core functionality for NeighborsCalculator

Overview:
    This module provides functionality related to the NeighborsCalculator tool.
    Handles file upload and neighbor calculation, and implements drag-and-drop.

Public API:
    None (Event-driven DOM interactions)

Credits:
    All the codes presented below were developed by:
        Dr. Gerardo Tinoco-Guerrero
        Dr. Francisco Javier Domínguez-Mota
        Dr. José Alberto Guzmán-Torres
        Universidad Michoacana de San Nicolás de Hidalgo
        gerardo.tinoco@umich.mx

    With the funding of:
        Secretary of Science, Humanities, Technology and Innovation, SECIHTI (Secretaria de Ciencia, Humanidades, Tecnología e Innovación). México.
        Coordination of Scientific Research, CIC-UMSNH (Coordinación de la Investigación Científica de la Universidad Michoacana de San Nicolás de Hidalgo, CIC-UMSNH). México.
        Aula CIMNE-Morelia. México.
        SIIIA-MATH: Soluciones de Ingeniería. México.

Date:
    August, 2025.
Last Modification:
    September, 2026.
*/

                                                                                                                                       // --- Canvas State ---
let canvasData = {                                                                                                                     // Initialize mutable variable state reference
    points: [],                                                                                                                        // Execute sequential evaluation stream node
    neighbors: [],                                                                                                                     // Execute sequential evaluation stream node
    regions: [],                                                                                                                       // Execute sequential evaluation stream node
    classifications: [],                                                                                                               // Execute sequential evaluation stream node
    scale: 1,                                                                                                                          // Execute sequential evaluation stream node
    offsetX: 0,                                                                                                                        // Execute sequential evaluation stream node
    offsetY: 0,                                                                                                                        // Execute sequential evaluation stream node
    minX: 0, maxX: 0, minY: 0, maxY: 0,                                                                                                // Execute sequential evaluation stream node
    hoverIdx: -1,                                                                                                                      // Execute sequential evaluation stream node
    isDragging: false,                                                                                                                 // Execute sequential evaluation stream node
    lastMouseX: 0,                                                                                                                     // Execute sequential evaluation stream node
    lastMouseY: 0                                                                                                                      // Execute sequential evaluation stream node
};                                                                                                                                     // Terminate block scope execution context

function formatSci(val) {                                                                                                              // Declare function scope logic
    if (val === 0) return "0.000";                                                                                                     // Evaluate boolean condition check logic
    if (Math.abs(val) < 0.01 || Math.abs(val) >= 10000) {                                                                              // Evaluate boolean condition check logic
        return val.toExponential(3);                                                                                                   // Return execution stream payload data
    }                                                                                                                                  // Terminate block scope execution context
    return val.toFixed(4);                                                                                                             // Return execution stream payload data
}                                                                                                                                      // Terminate block scope execution context

const REGION_COLORS = [                                                                                                                // Initialize immutable variable state reference
    '#3399FF', '#4DE64D', '#FFB333', '#CC4DFF',                                                                                        // Execute sequential evaluation stream node
    '#E69933', '#FF80CC', '#B3B3B3'                                                                                                    // Execute sequential evaluation stream node
];                                                                                                                                     // Execute sequential statement instruction block

let uploadZone = null;                                                                                                                 // Initialize mutable variable state reference
let fileInput = null;                                                                                                                  // Initialize mutable variable state reference
let uploadContent = null;                                                                                                              // Initialize mutable variable state reference
let uploadTitle = null;                                                                                                                // Initialize mutable variable state reference
let uploadSubtitle = null;                                                                                                             // Initialize mutable variable state reference
let dragCounter = 0;                                                                                                                   // Initialize mutable variable state reference
let currentFile = null;                                                                                                                // Initialize mutable variable state reference

const MAX_FILE_SIZE = 10 * 1024 * 1024;                                                                                                // 10MB

document.addEventListener('DOMContentLoaded', () => {                                                                                  // Bind event listener DOM state
    setupDragAndDrop();                                                                                                                // Execute sequential statement instruction block

});                                                                                                                                    // Terminate block scope execution context

function setupDragAndDrop() {                                                                                                          // Declare function scope logic
    uploadZone = document.getElementById('uploadZone');                                                                                // Query document element node reference
    fileInput = document.getElementById('csvFileInput');                                                                               // Query document element node reference
    uploadContent = document.getElementById('uploadContent');                                                                          // Query document element node reference
    uploadTitle = document.getElementById('uploadTitle');                                                                              // Query document element node reference
    uploadSubtitle = document.getElementById('uploadSubtitle');                                                                        // Query document element node reference

    if (!uploadZone || !fileInput) return;                                                                                             // Evaluate boolean condition check logic

                                                                                                                                       // Drag and drop events
    uploadZone.addEventListener('dragenter', handleDragEnter);                                                                         // Bind event listener DOM state
    uploadZone.addEventListener('dragover', handleDragOver);                                                                           // Bind event listener DOM state
    uploadZone.addEventListener('dragleave', handleDragLeave);                                                                         // Bind event listener DOM state
    uploadZone.addEventListener('drop', handleDrop);                                                                                   // Bind event listener DOM state

                                                                                                                                       // Click to upload
    uploadZone.addEventListener('click', (e) => {                                                                                      // Bind event listener DOM state
                                                                                                                                       // Prevent click if clicking on buttons inside
        if (e.target.closest('button')) return;                                                                                        // Evaluate boolean condition check logic

        if (!uploadZone.classList.contains('uploading')) {                                                                             // Evaluate boolean condition check logic
            fileInput.click();                                                                                                         // Execute sequential statement instruction block
        }                                                                                                                              // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context

                                                                                                                                       // File input change
    fileInput.addEventListener('change', handleFileSelect);                                                                            // Bind event listener DOM state

                                                                                                                                       // Prevent default drag behaviors
    document.addEventListener('dragover', (e) => e.preventDefault());                                                                  // Bind event listener DOM state
    document.addEventListener('drop', (e) => e.preventDefault());                                                                      // Bind event listener DOM state
}                                                                                                                                      // Terminate block scope execution context

function handleDragEnter(e) {                                                                                                          // Declare function scope logic
    e.preventDefault();                                                                                                                // Execute sequential statement instruction block
    dragCounter++;                                                                                                                     // Execute sequential statement instruction block

    if (dragCounter === 1) {                                                                                                           // Evaluate boolean condition check logic
        uploadZone.classList.add('drag-over');                                                                                         // Modify element class list collection
        updateUploadContent('drag-over');                                                                                              // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

function handleDragOver(e) {                                                                                                           // Declare function scope logic
    e.preventDefault();                                                                                                                // Execute sequential statement instruction block
    e.dataTransfer.dropEffect = 'copy';                                                                                                // Execute sequential statement instruction block
}                                                                                                                                      // Terminate block scope execution context

function handleDragLeave(e) {                                                                                                          // Declare function scope logic
    e.preventDefault();                                                                                                                // Execute sequential statement instruction block
    dragCounter--;                                                                                                                     // Execute sequential statement instruction block

    if (dragCounter === 0) {                                                                                                           // Evaluate boolean condition check logic
        uploadZone.classList.remove('drag-over');                                                                                      // Modify element class list collection
        updateUploadContent('default');                                                                                                // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

function handleDrop(e) {                                                                                                               // Declare function scope logic
    e.preventDefault();                                                                                                                // Execute sequential statement instruction block
    dragCounter = 0;                                                                                                                   // Assign variable property value reference
    uploadZone.classList.remove('drag-over');                                                                                          // Modify element class list collection

    const files = e.dataTransfer.files;                                                                                                // Initialize immutable variable state reference
    if (files.length > 0) {                                                                                                            // Evaluate boolean condition check logic
        processFile(files[0]);                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

function handleFileSelect(e) {                                                                                                         // Declare function scope logic
    const files = e.target.files;                                                                                                      // Initialize immutable variable state reference
    if (files.length > 0) {                                                                                                            // Evaluate boolean condition check logic
        processFile(files[0]);                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

function updateUploadContent(state) {                                                                                                  // Declare function scope logic
                                                                                                                                       // If elements don't exist (e.g. during upload progress), return
    const title = document.getElementById('uploadTitle');                                                                              // Initialize immutable variable state reference
    const subtitle = document.getElementById('uploadSubtitle');                                                                        // Initialize immutable variable state reference

    if (!title || !subtitle) return;                                                                                                   // Evaluate boolean condition check logic

    switch (state) {                                                                                                                   // Evaluate switch condition check flow
        case 'drag-over':                                                                                                              // Define switch case branch logic
            title.textContent = window.I18N && window.I18N.dropCsvHereHover ? window.I18N.dropCsvHereHover : 'Drop your CSV file here!';
            subtitle.textContent = window.I18N && window.I18N.processFileImmediately ? window.I18N.processFileImmediately : 'We will process your file immediately';
            break;                                                                                                                     // Terminate current loop block context
        case 'default':                                                                                                                // Define switch case branch logic
        default:                                                                                                                       // Execute sequential evaluation stream node
            title.textContent = window.I18N && window.I18N.dropCsvHere ? window.I18N.dropCsvHere : 'Drop your CSV file here';
            subtitle.textContent = window.I18N && window.I18N.clickToBrowse ? window.I18N.clickToBrowse : 'or click to browse files';
            break;                                                                                                                     // Terminate current loop block context
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

function processFile(file) {                                                                                                           // Declare function scope logic
                                                                                                                                       // Validation
    if (!file.name.toLowerCase().endsWith('.csv')) {                                                                                   // Evaluate boolean condition check logic
        const invTitle = window.I18N && window.I18N.invalidFile ? window.I18N.invalidFile : 'Invalid File';
        const invSub = window.I18N && window.I18N.selectCsvFile ? window.I18N.selectCsvFile : 'Please select a CSV file.';
        Utils.showUploadError(uploadZone, uploadContent, invTitle, invSub);
        return;                                                                                                                        // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context
    if (file.size > MAX_FILE_SIZE) {                                                                                                   // Evaluate boolean condition check logic
        const largeTitle = window.I18N && window.I18N.fileTooLarge ? window.I18N.fileTooLarge : 'File too large';
        const largeSub = window.I18N && window.I18N.fileMustBeSmaller ? window.I18N.fileMustBeSmaller(Utils.formatFileSize(MAX_FILE_SIZE)) : `File must be smaller than ${Utils.formatFileSize(MAX_FILE_SIZE)}.`;
        Utils.showUploadError(uploadZone, uploadContent, largeTitle, largeSub);
        return;                                                                                                                        // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

    currentFile = file;                                                                                                                // Assign variable property value reference
    simulateUpload(file);                                                                                                              // Execute sequential statement instruction block
}                                                                                                                                      // Terminate block scope execution context

function simulateUpload(file) {
                                                                                                                                       // Add uploading class to zone
    uploadZone.classList.add('uploading');
    uploadZone.classList.remove('success', 'error');
    
    uploadContent.classList.add('hidden');
    uploadContent.classList.remove('flex');
    const uploadProgress = document.getElementById('uploadProgress');
    if(uploadProgress) {
        uploadProgress.classList.remove('hidden');
        uploadProgress.classList.add('flex');
    }

    const progressText = document.getElementById('progressText');
    const progressMessage = document.getElementById('progressMessage');
    if(progressMessage) progressMessage.textContent = window.I18N && window.I18N.uploadingFile ? window.I18N.uploadingFile(file.name) : `Uploading ${file.name}...`;
    const progressCircle = document.querySelector('.progress-ring-circle');

                                                                                                                                       // Setup circle animation if it exists
    if(progressCircle) {
        const radius = 36;
        const circumference = 2 * Math.PI * radius;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;

        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (progress > 100) progress = 100;

            if(progressText) progressText.textContent = `${progress}%`;
            const offset = circumference - (progress / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    showUploadSuccess(file);
                                                                                                                                       // Auto-trigger calculation
                    setTimeout(calculateNeighbors, 800);
                }, 500);
            }
        }, 30);
    } else {
                                                                                                                                       // Fallback if no circle
        setTimeout(() => {
            showUploadSuccess(file);
            setTimeout(calculateNeighbors, 800);
        }, 600);
    }
}                                                                                                                                      // Terminate block scope execution context

function showUploadSuccess(file) {
    uploadZone.classList.remove('uploading');
    uploadZone.classList.add('success');
    
    const uploadProgress = document.getElementById('uploadProgress');
    if(uploadProgress) {
        uploadProgress.classList.add('hidden');
        uploadProgress.classList.remove('flex');
    }
    
    const uploadSuccess = document.getElementById('uploadSuccess');
    if(uploadSuccess) {
        uploadSuccess.classList.remove('hidden');
        uploadSuccess.classList.add('flex');
    }
    
    const successTitle = document.getElementById('successTitle');
    if(successTitle) successTitle.textContent = window.I18N && window.I18N.uploadSuccessful ? window.I18N.uploadSuccessful : 'Upload Successful!';
    
    const uploadedFileName = document.getElementById('uploadedFileName');
    if(uploadedFileName) uploadedFileName.textContent = file.name;
}                                                                                                                                      // Terminate block scope execution context

function resetUpload() {
    uploadZone.classList.remove('uploading', 'success', 'error', 'drag-over');

    const uploadProgress = document.getElementById('uploadProgress');
    const uploadSuccess = document.getElementById('uploadSuccess');
    const uploadError = document.getElementById('uploadError');
    if(uploadProgress) {
        uploadProgress.classList.add('hidden');
        uploadProgress.classList.remove('flex');
    }
    if(uploadSuccess) {
        uploadSuccess.classList.add('hidden');
        uploadSuccess.classList.remove('flex');
    }
    if(uploadError) {
        uploadError.classList.add('hidden');
        uploadError.classList.remove('flex');
    }
    
    if(uploadContent) {
        uploadContent.classList.remove('hidden');
        uploadContent.classList.add('flex');
    }

    if (fileInput) fileInput.value = '';
    currentFile = null;
    dragCounter = 0;

    const resultSection = document.getElementById('resultSection');
    if (resultSection && !resultSection.classList.contains('hidden')) {
        resultSection.classList.remove('opacity-100');
        resultSection.classList.add('opacity-0');
        setTimeout(() => resultSection.classList.add('hidden'), 700);
    }
}                                                                                                                                      // Terminate block scope execution context

function calculateNeighbors() {
    if (!currentFile) return;

    const resultSection = document.getElementById('resultSection');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadSuccess = document.getElementById('uploadSuccess');
    const uploadError = document.getElementById('uploadError');
    const errorMessage = document.getElementById('errorMessage');

                                                                                                                                       // Show calculating state inside dropzone
    if(uploadSuccess) {
        uploadSuccess.classList.add('hidden');
        uploadSuccess.classList.remove('flex');
    }
    if(uploadProgress) {
        uploadProgress.classList.remove('hidden');
        uploadProgress.classList.add('flex');
    }
    const progressMessage = document.getElementById('progressMessage');
    const progressText = document.getElementById('progressText');
    if(progressMessage) progressMessage.textContent = window.I18N && window.I18N.calculatingNeighbors ? window.I18N.calculatingNeighbors : 'Calculating Neighbors...';
    if(progressText) progressText.textContent = '';
    
                                                                                                                                       // Add continuous spinning class to circle
    const progressCircle = document.querySelector('.progress-ring-circle');
    if(progressCircle) {
        progressCircle.style.transition = "none";
        progressCircle.style.strokeDasharray = "80 200";
        progressCircle.style.strokeDashoffset = "0";
        progressCircle.classList.add('animate-spin');
    }

    const formData = new FormData();
    formData.append('file', currentFile);

    const numNeighborsInput = document.getElementById('numNeighbors');
    if (numNeighborsInput) {
        formData.append('nvec', numNeighborsInput.value);
    }

    fetch(`${BASE_URL}/upload_neighbors`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if(progressCircle) progressCircle.classList.remove('animate-spin');
            
            if (data.success) {
                if(uploadProgress) {
                    uploadProgress.classList.add('hidden');
                    uploadProgress.classList.remove('flex');
                }
                if(uploadSuccess) {
                    uploadSuccess.classList.remove('hidden');
                    uploadSuccess.classList.add('flex');
                }
                
                const successTitle = document.getElementById('successTitle');
                if(successTitle) successTitle.textContent = window.I18N && window.I18N.calculationComplete ? window.I18N.calculationComplete : 'Calculation Complete!';
                
                const uploadedFileName = document.getElementById('uploadedFileName');
                if(uploadedFileName) uploadedFileName.textContent = window.I18N && window.I18N.resultsGenerated ? window.I18N.resultsGenerated : 'Results generated successfully';
                
                                                                                                                                       // Show result section
                if(resultSection) {
                    resultSection.classList.remove('hidden');
                    setTimeout(() => {
                        resultSection.classList.remove('opacity-0');
                        resultSection.classList.add('opacity-100');
                        resultSection.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }

                                                                                                                                       // Display statistics
                const statsContainer = document.getElementById('statsContainer');
                if (statsContainer && data.stats) {
                    statsContainer.innerHTML = `
                    <div class="bg-[#111] rounded-xl p-5 border border-white/5 flex items-center justify-between min-w-[200px] flex-grow shadow-lg">
                        <div>
                            <h4 class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Total Points</h4>
                            <p class="text-2xl font-bold text-white font-mono count-up" data-target="${data.stats.total_points}">0</p>
                        </div>
                        <div class="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <i class="fas fa-layer-group"></i>
                        </div>
                    </div>
                    <div class="bg-[#111] rounded-xl p-5 border border-white/5 flex items-center justify-between min-w-[200px] flex-grow shadow-lg">
                        <div>
                            <h4 class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Regions</h4>
                            <p class="text-2xl font-bold text-white font-mono count-up" data-target="${data.stats.total_regions}">0</p>
                        </div>
                        <div class="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <i class="fas fa-map-marked-alt"></i>
                        </div>
                    </div>
                    <div class="bg-[#111] rounded-xl p-5 border border-white/5 flex items-center justify-between min-w-[200px] flex-grow shadow-lg">
                        <div>
                            <h4 class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Avg Neighbors</h4>
                            <p class="text-2xl font-bold text-white font-mono count-up" data-target="${data.stats.avg_neighbors}" data-decimals="2">0</p>
                        </div>
                        <div class="h-10 w-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
                            <i class="fas fa-network-wired"></i>
                        </div>
                    </div>
                    <div class="bg-[#111] rounded-xl p-5 border border-white/5 flex items-center justify-between min-w-[200px] flex-grow shadow-lg">
                        <div>
                            <h4 class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Max Neighbors</h4>
                            <p class="text-2xl font-bold text-white font-mono count-up" data-target="${data.stats.max_neighbors}">0</p>
                        </div>
                        <div class="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                    </div>
                `;
                                                                                                                                       // Trigger count up animation
                    setTimeout(animateNumbers, 100);
                }

                                                                                                                                       // Initialize canvas
                if (data.points && data.neighbors_indices) {
                    canvasData.points = data.points;
                    canvasData.neighbors = data.neighbors_indices;
                    canvasData.regions = data.regions || [];
                    canvasData.classifications = data.classifications || [];
                    initCanvas();
                }

                                                                                                                                       // Setup download button
                const downloadBtn = document.getElementById('downloadNeighbors');
                if (downloadBtn) {
                    downloadBtn.href = data.neighbors_csv_url;
                    downloadBtn.setAttribute('download', 'neighbors.csv');
                }
            } else {
                if(uploadProgress) {
                    uploadProgress.classList.add('hidden');
                    uploadProgress.classList.remove('flex');
                }
                if(uploadError) {
                    uploadError.classList.remove('hidden');
                    uploadError.classList.add('flex');
                }
                if (errorMessage) errorMessage.textContent = data.error || 'An error occurred during neighbor calculation.';
            }
        })
        .catch(error => {
            if(progressCircle) progressCircle.classList.remove('animate-spin');
            if(uploadProgress) {
                uploadProgress.classList.add('hidden');
                uploadProgress.classList.remove('flex');
            }
            if(uploadSuccess) {
                uploadSuccess.classList.add('hidden');
                uploadSuccess.classList.remove('flex');
            }
            if(uploadError) {
                uploadError.classList.remove('hidden');
                uploadError.classList.add('flex');
            }
            if (errorMessage) errorMessage.textContent = error.message || 'Network error.';
        });
}                                                                                                                                      // Terminate block scope execution context

function animateNumbers() {                                                                                                            // Declare function scope logic
    const counters = document.querySelectorAll('.count-up');                                                                           // Initialize immutable variable state reference

    counters.forEach(counter => {                                                                                                      // Execute sequential evaluation stream node
        const target = parseFloat(counter.getAttribute('data-target'));                                                                // Initialize immutable variable state reference
        const decimals = parseInt(counter.getAttribute('data-decimals') || 0);                                                         // Initialize immutable variable state reference
        const duration = 1500;                                                                                                         // ms
        const frameDuration = 1000 / 60;                                                                                               // 60fps
        const totalFrames = Math.round(duration / frameDuration);                                                                      // Initialize immutable variable state reference

        let frame = 0;                                                                                                                 // Initialize mutable variable state reference

        const easeOutQuad = t => t * (2 - t);                                                                                          // Initialize immutable variable state reference

        const updateCounter = () => {                                                                                                  // Initialize immutable variable state reference
            frame++;                                                                                                                   // Execute sequential statement instruction block
            const progress = easeOutQuad(frame / totalFrames);                                                                         // Initialize immutable variable state reference
            const current = target * progress;                                                                                         // Initialize immutable variable state reference

            if (frame < totalFrames) {                                                                                                 // Evaluate boolean condition check logic
                if (decimals > 0) {                                                                                                    // Evaluate boolean condition check logic
                    counter.innerText = current.toFixed(decimals);                                                                     // Execute sequential statement instruction block
                } else {                                                                                                               // Terminate block scope execution context
                    counter.innerText = Math.round(current).toLocaleString();                                                          // Execute sequential statement instruction block
                }                                                                                                                      // Terminate block scope execution context
                requestAnimationFrame(updateCounter);                                                                                  // Execute sequential statement instruction block
            } else {                                                                                                                   // Terminate block scope execution context
                if (decimals > 0) {                                                                                                    // Evaluate boolean condition check logic
                    counter.innerText = target.toFixed(decimals);                                                                      // Execute sequential statement instruction block
                } else {                                                                                                               // Terminate block scope execution context
                    counter.innerText = Math.round(target).toLocaleString();                                                           // Execute sequential statement instruction block
                }                                                                                                                      // Terminate block scope execution context
            }                                                                                                                          // Terminate block scope execution context
        };                                                                                                                             // Terminate block scope execution context

        updateCounter();                                                                                                               // Execute sequential statement instruction block
    });                                                                                                                                // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Expose functions to global scope for onclick handlers
window.resetUpload = resetUpload;                                                                                                      // Execute sequential statement instruction block
window.clearUpload = resetUpload;                                                                                                      // Execute sequential statement instruction block

                                                                                                                                       // --- Canvas Logic ---
function initCanvas() {                                                                                                                // Declare function scope logic
    const canvas = document.getElementById('cloudCanvas');                                                                             // Initialize immutable variable state reference
    if (!canvas) return;                                                                                                               // Evaluate boolean condition check logic

    const wrapper = document.getElementById('canvasContainer') || document.querySelector('.canvas-wrapper') || document.body;
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    if (canvasData.points.length > 0) {                                                                                                // Evaluate boolean condition check logic
        let xs = canvasData.points.map(p => p[0]);                                                                                     // Initialize mutable variable state reference
        let ys = canvasData.points.map(p => p[1]);                                                                                     // Initialize mutable variable state reference
        canvasData.minX = Math.min(...xs);                                                                                             // Execute sequential statement instruction block
        canvasData.maxX = Math.max(...xs);                                                                                             // Execute sequential statement instruction block
        canvasData.minY = Math.min(...ys);                                                                                             // Execute sequential statement instruction block
        canvasData.maxY = Math.max(...ys);                                                                                             // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

    resetView();                                                                                                                       // Execute sequential statement instruction block
    setupCanvasEvents(canvas);                                                                                                         // Execute sequential statement instruction block

    const btnReset = document.getElementById('btnResetView');                                                                          // Initialize immutable variable state reference
    if (btnReset) btnReset.addEventListener('click', resetView);                                                                       // Evaluate boolean condition check logic
}                                                                                                                                      // Terminate block scope execution context

function resetView() {                                                                                                                 // Declare function scope logic
    const canvas = document.getElementById('cloudCanvas');                                                                             // Initialize immutable variable state reference
    if (!canvas || canvasData.points.length === 0) return;                                                                             // Evaluate boolean condition check logic

    const padding = 40;                                                                                                                // Initialize immutable variable state reference
    const dataWidth = canvasData.maxX - canvasData.minX || 1;                                                                          // Initialize immutable variable state reference
    const dataHeight = canvasData.maxY - canvasData.minY || 1;                                                                         // Initialize immutable variable state reference

    const scaleX = (canvas.width - padding * 2) / dataWidth;                                                                           // Initialize immutable variable state reference
    const scaleY = (canvas.height - padding * 2) / dataHeight;                                                                         // Initialize immutable variable state reference
    canvasData.scale = Math.min(scaleX, scaleY);                                                                                       // Execute sequential statement instruction block

    const cx = (canvasData.minX + canvasData.maxX) / 2;                                                                                // Initialize immutable variable state reference
    const cy = (canvasData.minY + canvasData.maxY) / 2;                                                                                // Initialize immutable variable state reference

    canvasData.offsetX = canvas.width / 2 - cx * canvasData.scale;                                                                     // Execute sequential statement instruction block
    canvasData.offsetY = canvas.height / 2 + cy * canvasData.scale;                                                                    // Execute sequential statement instruction block

    drawCanvas();                                                                                                                      // Execute sequential statement instruction block
}                                                                                                                                      // Terminate block scope execution context

function drawCanvas() {                                                                                                                // Declare function scope logic
    const canvas = document.getElementById('cloudCanvas');                                                                             // Initialize immutable variable state reference
    if (!canvas) return;                                                                                                               // Evaluate boolean condition check logic
    const ctx = canvas.getContext('2d');                                                                                               // Initialize immutable variable state reference

    ctx.clearRect(0, 0, canvas.width, canvas.height);                                                                                  // Execute sequential statement instruction block

    const r = 3;                                                                                                                       // Initialize immutable variable state reference
    const hIdx = canvasData.hoverIdx;                                                                                                  // Initialize immutable variable state reference

                                                                                                                                       // Determine neighbors to highlight
    let activeNeighbors = [];                                                                                                          // Initialize mutable variable state reference
    if (hIdx !== -1) {                                                                                                                 // Evaluate boolean condition check logic
        const row = canvasData.neighbors[hIdx];                                                                                        // Initialize immutable variable state reference
        if (row) {                                                                                                                     // Evaluate boolean condition check logic
            activeNeighbors = row.filter(n => n !== -1);                                                                               // Assign variable property value reference
        }                                                                                                                              // Terminate block scope execution context
    }                                                                                                                                  // Terminate block scope execution context

                                                                                                                                       // Draw lines first so they are under points
    if (hIdx !== -1 && activeNeighbors.length > 0) {                                                                                   // Evaluate boolean condition check logic
        const centerPt = canvasData.points[hIdx];                                                                                      // Initialize immutable variable state reference
        const cx = centerPt[0] * canvasData.scale + canvasData.offsetX;                                                                // Initialize immutable variable state reference
        const cy = -centerPt[1] * canvasData.scale + canvasData.offsetY;                                                               // Initialize immutable variable state reference

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';                                                                                   // Green lines
        ctx.lineWidth = 1.5;                                                                                                           // Execute sequential statement instruction block

        activeNeighbors.forEach(nIdx => {                                                                                              // Execute sequential evaluation stream node
            const nPt = canvasData.points[nIdx];                                                                                       // Initialize immutable variable state reference
            const nx = nPt[0] * canvasData.scale + canvasData.offsetX;                                                                 // Initialize immutable variable state reference
            const ny = -nPt[1] * canvasData.scale + canvasData.offsetY;                                                                // Initialize immutable variable state reference

            ctx.beginPath();                                                                                                           // Execute sequential statement instruction block
            ctx.moveTo(cx, cy);                                                                                                        // Execute sequential statement instruction block
            ctx.lineTo(nx, ny);                                                                                                        // Execute sequential statement instruction block
            ctx.stroke();                                                                                                              // Execute sequential statement instruction block
        });                                                                                                                            // Terminate block scope execution context
    }                                                                                                                                  // Terminate block scope execution context

                                                                                                                                       // Draw points
    for (let i = 0; i < canvasData.points.length; i++) {                                                                               // Iterate sequence stream loop control
        const pt = canvasData.points[i];                                                                                               // Initialize immutable variable state reference
        const screenX = pt[0] * canvasData.scale + canvasData.offsetX;                                                                 // Initialize immutable variable state reference
        const screenY = -pt[1] * canvasData.scale + canvasData.offsetY;                                                                // Initialize immutable variable state reference

        if (screenX < -10 || screenX > canvas.width + 10 || screenY < -10 || screenY > canvas.height + 10) continue;                   // Evaluate boolean condition check logic

        let fillColor = 'rgba(255, 255, 255, 0.3)';                                                                                    // Initialize mutable variable state reference
        let strokeColor = 'rgba(255, 255, 255, 0.1)';                                                                                  // Initialize mutable variable state reference
        let size = r;                                                                                                                  // Initialize mutable variable state reference

        if (i === hIdx) {                                                                                                              // Evaluate boolean condition check logic
            fillColor = '#ef4444';                                                                                                     // Red center
            strokeColor = '#fff';                                                                                                      // Assign variable property value reference
            size = r * 2;                                                                                                              // Assign variable property value reference
        } else if (activeNeighbors.includes(i)) {                                                                                      // Terminate block scope execution context
            fillColor = '#10b981';                                                                                                     // Green neighbor
            strokeColor = '#fff';                                                                                                      // Assign variable property value reference
            size = r * 1.5;                                                                                                            // Assign variable property value reference
        }                                                                                                                              // Terminate block scope execution context

        ctx.beginPath();                                                                                                               // Execute sequential statement instruction block
        ctx.arc(screenX, screenY, size, 0, 2 * Math.PI);                                                                               // Execute sequential statement instruction block
        ctx.fillStyle = fillColor;                                                                                                     // Execute sequential statement instruction block
        ctx.fill();                                                                                                                    // Execute sequential statement instruction block
        ctx.strokeStyle = strokeColor;                                                                                                 // Execute sequential statement instruction block
        ctx.lineWidth = 1;                                                                                                             // Execute sequential statement instruction block
        ctx.stroke();                                                                                                                  // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

                                                                                                                                       // Update Stats Display
    if (hIdx !== -1) {                                                                                                                 // Evaluate boolean condition check logic
        document.getElementById('centerIdDisplay').innerText = hIdx;                                                                   // Query document element node reference
        document.getElementById('regionDisplay').innerText = canvasData.regions[hIdx] || '-';                                          // Query document element node reference
        document.getElementById('neighborsFoundDisplay').innerText = activeNeighbors.length;                                           // Query document element node reference
    } else {                                                                                                                           // Terminate block scope execution context
        document.getElementById('centerIdDisplay').innerText = 'None';                                                                 // Query document element node reference
        document.getElementById('regionDisplay').innerText = '-';                                                                      // Query document element node reference
        document.getElementById('neighborsFoundDisplay').innerText = '0';                                                              // Query document element node reference
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

function getPointAt(screenX, screenY) {                                                                                                // Declare function scope logic
    const threshold = 10;                                                                                                              // Initialize immutable variable state reference
    for (let i = 0; i < canvasData.points.length; i++) {                                                                               // Iterate sequence stream loop control
        const pt = canvasData.points[i];                                                                                               // Initialize immutable variable state reference
        const px = pt[0] * canvasData.scale + canvasData.offsetX;                                                                      // Initialize immutable variable state reference
        const py = -pt[1] * canvasData.scale + canvasData.offsetY;                                                                     // Initialize immutable variable state reference

        const dx = px - screenX;                                                                                                       // Initialize immutable variable state reference
        const dy = py - screenY;                                                                                                       // Initialize immutable variable state reference
        if (dx * dx + dy * dy <= threshold * threshold) {                                                                              // Evaluate boolean condition check logic
            return i;                                                                                                                  // Return execution stream payload data
        }                                                                                                                              // Terminate block scope execution context
    }                                                                                                                                  // Terminate block scope execution context
    return -1;                                                                                                                         // Return execution stream payload data
}                                                                                                                                      // Terminate block scope execution context

function setupCanvasEvents(canvas) {                                                                                                   // Declare function scope logic
    canvas.addEventListener('mousedown', (e) => {                                                                                      // Bind event listener DOM state
        const rect = canvas.getBoundingClientRect();                                                                                   // Initialize immutable variable state reference
        canvasData.lastMouseX = e.clientX - rect.left;                                                                                 // Execute sequential statement instruction block
        canvasData.lastMouseY = e.clientY - rect.top;                                                                                  // Execute sequential statement instruction block
        canvasData.isDragging = true;                                                                                                  // Execute sequential statement instruction block
    });                                                                                                                                // Terminate block scope execution context

    canvas.addEventListener('mousemove', (e) => {                                                                                      // Bind event listener DOM state
        const rect = canvas.getBoundingClientRect();                                                                                   // Initialize immutable variable state reference
        const x = e.clientX - rect.left;                                                                                               // Initialize immutable variable state reference
        const y = e.clientY - rect.top;                                                                                                // Initialize immutable variable state reference

                                                                                                                                       // Coordinates display
        const mathX = (x - canvasData.offsetX) / canvasData.scale;                                                                     // Initialize immutable variable state reference
        const mathY = -(y - canvasData.offsetY) / canvasData.scale;                                                                    // Initialize immutable variable state reference
        const coordDisplay = document.getElementById('coordinatesDisplay');                                                            // Initialize immutable variable state reference
        if (coordDisplay) {                                                                                                            // Evaluate boolean condition check logic
            coordDisplay.innerText = `X: ${formatSci(mathX)}, Y: ${formatSci(mathY)}`;                                                 // Execute sequential statement instruction block
        }                                                                                                                              // Terminate block scope execution context

        if (canvasData.isDragging) {                                                                                                   // Evaluate boolean condition check logic
            canvasData.offsetX += (x - canvasData.lastMouseX);                                                                         // Execute sequential statement instruction block
            canvasData.offsetY += (y - canvasData.lastMouseY);                                                                         // Execute sequential statement instruction block
            canvasData.lastMouseX = x;                                                                                                 // Execute sequential statement instruction block
            canvasData.lastMouseY = y;                                                                                                 // Execute sequential statement instruction block
            requestAnimationFrame(() => drawCanvas());                                                                                 // Execute sequential statement instruction block
        } else {                                                                                                                       // Terminate block scope execution context
                                                                                                                                       // Hover logic
            const hovered = getPointAt(x, y);                                                                                          // Initialize immutable variable state reference
            if (hovered !== canvasData.hoverIdx) {                                                                                     // Evaluate boolean condition check logic
                canvasData.hoverIdx = hovered;                                                                                         // Execute sequential statement instruction block
                requestAnimationFrame(() => drawCanvas());                                                                             // Execute sequential statement instruction block
            }                                                                                                                          // Terminate block scope execution context
        }                                                                                                                              // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context

    window.addEventListener('mouseup', () => {                                                                                         // Bind event listener DOM state
        canvasData.isDragging = false;                                                                                                 // Execute sequential statement instruction block
    });                                                                                                                                // Terminate block scope execution context

    canvas.addEventListener('wheel', (e) => {                                                                                          // Bind event listener DOM state
        e.preventDefault();                                                                                                            // Execute sequential statement instruction block
        const rect = canvas.getBoundingClientRect();                                                                                   // Initialize immutable variable state reference
        const x = e.clientX - rect.left;                                                                                               // Initialize immutable variable state reference
        const y = e.clientY - rect.top;                                                                                                // Initialize immutable variable state reference

        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;                                                                                   // Initialize immutable variable state reference

        canvasData.offsetX = x - (x - canvasData.offsetX) * zoomFactor;                                                                // Execute sequential statement instruction block
        canvasData.offsetY = y - (y - canvasData.offsetY) * zoomFactor;                                                                // Execute sequential statement instruction block
        canvasData.scale *= zoomFactor;                                                                                                // Execute sequential statement instruction block

        requestAnimationFrame(() => drawCanvas());                                                                                     // Execute sequential statement instruction block
    });                                                                                                                                // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context
