/**
 * ContourCreator — Core functionality for ContourCreator
 * 
 * Overview:
 *     This module provides comprehensive functionality for interactive contour detection and
 *     region segmentation from uploaded images. It implements multiple advanced segmentation
 *     algorithms with real-time canvas manipulation.
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

// ===== GLOBAL VARIABLES =====

// Canvas and image variables
let currentImage = null;                                                                                                                // Initialize mutable variable state reference
let currentFilename = null;                                                                                                             // Initialize mutable variable state reference
let canvas = null;                                                                                                                      // Initialize mutable variable state reference
let ctx = null;                                                                                                                         // Initialize mutable variable state reference
let detectedRegions = [];                                                                                                               // Array for multiple regions
let regionColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB'];      // Initialize mutable variable state reference
let currentRegionIndex = 0;                                                                                                             // Initialize mutable variable state reference
let tempRegion = null;                                                                                                                  // Temporary region before adding

// Variables for zoom and pan
let zoomLevel = 1;                                                                                                                      // Initialize mutable variable state reference
let panX = 0;                                                                                                                           // Initialize mutable variable state reference
let panY = 0;                                                                                                                           // Initialize mutable variable state reference
let isDragging = false;                                                                                                                 // Initialize mutable variable state reference
let hasDragged = false;                                                                                                                 // Track if mouse actually moved during drag
let lastMouseX = 0;                                                                                                                     // Initialize mutable variable state reference
let lastMouseY = 0;                                                                                                                     // Initialize mutable variable state reference
let minZoom = 1;                                                                                                                        // Initialize mutable variable state reference
let maxZoom = 5;                                                                                                                        // Initialize mutable variable state reference
let dragThreshold = 3;                                                                                                                  // Minimum pixels to consider as drag

// Upload variables
let uploadZone = null;                                                                                                                  // Initialize mutable variable state reference
let fileInput = null;                                                                                                                   // Initialize mutable variable state reference
let uploadContent = null;                                                                                                               // Initialize mutable variable state reference
let uploadIcon = null;                                                                                                                  // Initialize mutable variable state reference
let uploadTitle = null;                                                                                                                 // Initialize mutable variable state reference
let uploadSubtitle = null;                                                                                                              // Initialize mutable variable state reference
let clearButton = null;                                                                                                                 // Initialize mutable variable state reference
let dragCounter = 0;                                                                                                                    // Initialize mutable variable state reference

// Supported image formats
const SUPPORTED_FORMATS = {                                                                                                             // Initialize immutable variable state reference
    'image/jpeg': 'JPG',                                                                                                                // Execute sequential evaluation stream node
    'image/jpg': 'JPG',                                                                                                                 // Execute sequential evaluation stream node
    'image/png': 'PNG',                                                                                                                 // Execute sequential evaluation stream node
    'image/gif': 'GIF',                                                                                                                 // Execute sequential evaluation stream node
    'image/webp': 'WEBP',                                                                                                               // Execute sequential evaluation stream node
    'image/bmp': 'BMP'                                                                                                                  // Execute sequential evaluation stream node
};                                                                                                                                      // Terminate block scope execution context

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;                                                                                                 // Initialize immutable variable state reference

// ===== INITIALIZATION =====

/**
 * Application Initialization Handler
 * 
 * Initializes the contour creator application when the DOM content is fully loaded.
 * Sets up the canvas environment and drag-and-drop functionality for file uploads.
 * This is the main entry point for the application's initialization sequence.
 * 
 * @since 2025-05-01
 * @see {@link initCanvas} Canvas initialization
 * @see {@link setupEnhancedDragAndDrop} File upload setup
 */
document.addEventListener('DOMContentLoaded', function () {                                                                             // Bind event listener DOM state
    initCanvas();                                                                                                                       // Execute sequential statement instruction block
    setupEnhancedDragAndDrop();                                                                                                         // Execute sequential statement instruction block
});                                                                                                                                     // Terminate block scope execution context

/**
 * Initialize Canvas Environment and Event Handlers
 * 
 * Sets up the HTML5 canvas element and configures all necessary event listeners
 * for interactive image manipulation. Establishes the foundation for zoom, pan,
 * click detection, and brush refinement functionality.
 * 
 * Event Handlers Configured:
 * - Click events for region detection and seed point placement
 * - Mouse wheel events for zoom control with smooth scaling
 * - Mouse drag events for pan functionality with boundary constraints
 * - Brush refinement events for manual region editing
 * 
 * Canvas Configuration:
 * - 2D rendering context with optimized settings
 * - Event listener registration with appropriate options
 * - Integration with refinement mode functionality
 * - Coordinate transformation setup for image-canvas mapping
 * 
 * @function initCanvas
 * @since 2025-05-01
 * @lastModified 2026-01-21
 * @see {@link handleCanvasClick} Click event handler
 * @see {@link handleWheel} Zoom event handler
 * @see {@link handleMouseDown} Pan start handler
 * @see {@link initRefineEventListeners} Brush refinement setup
 * 
 */
function initCanvas() {                                                                                                                 // Declare function scope logic
    canvas = document.getElementById('imageCanvas');                                                                                    // Query document element node reference
    ctx = canvas.getContext('2d');                                                                                                      // Assign variable property value reference

    // Event listeners for clicks
    canvas.addEventListener('click', handleCanvasClick);                                                                                // Bind event listener DOM state

    // Event listeners for zoom with mouse wheel
    canvas.addEventListener('wheel', handleWheel, { passive: false });                                                                  // Bind event listener DOM state

    // Event listeners for pan (drag)
    canvas.addEventListener('mousedown', handleMouseDown);                                                                              // Bind event listener DOM state
    canvas.addEventListener('mousemove', handleMouseMove);                                                                              // Bind event listener DOM state
    canvas.addEventListener('mouseup', handleMouseUp);                                                                                  // Bind event listener DOM state
    canvas.addEventListener('mouseleave', handleMouseUp);                                                                               // Bind event listener DOM state

    // Initialize refine event listeners
    initRefineEventListeners();                                                                                                         // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// ===== FILE UPLOAD FUNCTIONALITY =====

/**
 * Configure Enhanced Drag and Drop File Upload System
 * 
 * Sets up a comprehensive drag-and-drop interface for image file uploads with
 * visual feedback, progress tracking, and error handling. Configures all DOM
 * elements and event listeners required for the file upload workflow.
 * 
 * Features Configured:
 * - Drag and drop zone with visual feedback and hover states
 * - File input integration with click-to-browse functionality
 * - Progress indicators with real-time upload status
 * - Error handling with user-friendly messages
 * - File format validation and size checking
 * - Clear/reset functionality for uploaded files
 * 
 * DOM Elements Initialized:
 * - Upload zone container with drag event handlers
 * - File input element with change event listener
 * - Progress display elements for upload feedback
 * - Icon and text elements for dynamic content updates
 * - Clear button for resetting the upload state
 * 
 * Event Handlers Registered:
 * - dragenter: Visual feedback when file enters drop zone
 * - dragover: Continuous feedback during file hover
 * - dragleave: Reset visual state when file leaves zone
 * - drop: Process dropped files and initiate upload
 * - change: Handle files selected via file browser
 * 
 * @function setupEnhancedDragAndDrop
 * @since 2025-05-01
 * @lastModified 2026-01-21
 * @see {@link handleDragEnter} Drag enter event handler
 * @see {@link handleDragOver} Drag over event handler
 * @see {@link handleDragLeave} Drag leave event handler
 * @see {@link handleDrop} File drop event handler
 * @see {@link handleFileSelect} File selection handler
 * 
 * // Supported file formats: PNG, JPG, JPEG, GIF, BMP, WEBP
 * // Maximum file size: 10MB
 */
function setupEnhancedDragAndDrop() {                                                                                                   // Declare function scope logic
    // Get DOM elements
    uploadZone = document.getElementById('uploadZone');                                                                                 // Query document element node reference
    fileInput = document.getElementById('fileInput');                                                                                   // Query document element node reference
    uploadContent = document.getElementById('uploadContent');                                                                           // Query document element node reference
    uploadIcon = document.getElementById('uploadIcon');                                                                                 // Query document element node reference
    uploadTitle = document.getElementById('uploadTitle');                                                                               // Query document element node reference
    uploadSubtitle = document.getElementById('uploadSubtitle');                                                                         // Query document element node reference
    clearButton = document.getElementById('clearButton');                                                                               // Query document element node reference

    if (!uploadZone || !fileInput) {                                                                                                    // Evaluate boolean condition check logic
        console.error('Upload elements not found');                                                                                     // Emit diagnostic error stream payload
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    // Event listeners for drag and drop
    uploadZone.addEventListener('dragenter', handleDragEnter);                                                                          // Bind event listener DOM state
    uploadZone.addEventListener('dragover', handleDragOver);                                                                            // Bind event listener DOM state
    uploadZone.addEventListener('dragleave', handleDragLeave);                                                                          // Bind event listener DOM state
    uploadZone.addEventListener('drop', handleDrop);                                                                                    // Bind event listener DOM state

    // Event listener for upload zone click
    uploadZone.addEventListener('click', () => {                                                                                        // Bind event listener DOM state
        if (!uploadZone.classList.contains('uploading')) {                                                                              // Evaluate boolean condition check logic
            fileInput.click();                                                                                                          // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context

    // Event listener for file selection
    fileInput.addEventListener('change', handleFileSelect);                                                                             // Bind event listener DOM state

    // Prevent default behavior on entire page
    document.addEventListener('dragover', (e) => e.preventDefault());                                                                   // Bind event listener DOM state
    document.addEventListener('drop', (e) => e.preventDefault());                                                                       // Bind event listener DOM state
}                                                                                                                                       // Terminate block scope execution context

/**
 * Handle Drag Enter Event for File Upload
 * 
 * Processes the drag enter event when a file is dragged into the upload zone.
 * Provides visual feedback by adding CSS classes and updating the upload content
 * display. Uses a drag counter to handle multiple drag enter/leave events correctly.
 * 
 * @function handleDragEnter
 * @param {DragEvent} e - The drag enter event object
 * @since 2025-05-01
 * @lastModified 2026-01-21
 * @see {@link updateUploadContent} Content update handler
 * 
 */
function handleDragEnter(e) {                                                                                                           // Declare function scope logic
    e.preventDefault();                                                                                                                 // Execute sequential statement instruction block
    dragCounter++;                                                                                                                      // Execute sequential statement instruction block

    if (dragCounter === 1) {                                                                                                            // Evaluate boolean condition check logic
        uploadZone.classList.add('drag-over');                                                                                          // Modify element class list collection
        updateUploadContent('drag-over');                                                                                               // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

/**
 * Handle Drag Over Event for File Upload
 * 
 * Processes the continuous drag over event while a file is being dragged
 * over the upload zone. Sets the appropriate drop effect to indicate
 * that the file can be dropped and copied.
 * 
 * @function handleDragOver
 * @param {DragEvent} e - The drag over event object
 * @since 2025-05-01
 * @lastModified 2026-01-21
 * 
 */
function handleDragOver(e) {                                                                                                            // Declare function scope logic
    e.preventDefault();                                                                                                                 // Execute sequential statement instruction block
    e.dataTransfer.dropEffect = 'copy';                                                                                                 // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

/**
 * Handle Drag Leave Event for File Upload
 * 
 * Processes the drag leave event when a file is dragged out of the upload zone.
 * Removes visual feedback by removing CSS classes and resetting the upload content
 * display. Uses a drag counter to handle nested elements correctly.
 * 
 * @function handleDragLeave
 * @param {DragEvent} e - The drag leave event object
 * @since 2025-05-01
 * @lastModified 2026-01-21
 * @see {@link updateUploadContent} Content update handler
 * 
 */
function handleDragLeave(e) {                                                                                                           // Declare function scope logic
    e.preventDefault();                                                                                                                 // Execute sequential statement instruction block
    dragCounter--;                                                                                                                      // Execute sequential statement instruction block

    if (dragCounter === 0) {                                                                                                            // Evaluate boolean condition check logic
        uploadZone.classList.remove('drag-over');                                                                                       // Modify element class list collection
        updateUploadContent('default');                                                                                                 // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

/**
 * Handle File Drop Event for Upload Processing
 * 
 * Processes the file drop event when a file is dropped onto the upload zone.
 * Extracts the first file from the drop event and initiates the file processing
 * workflow. Resets the drag counter and visual feedback states.
 * 
 * @function handleDrop
 * @param {DragEvent} e - The drop event object containing file data
 * @since 2025-05-01
 * @lastModified 2026-01-21
 * @see {@link processFile} File processing handler
 * 
 */
function handleDrop(e) {                                                                                                                // Declare function scope logic
    e.preventDefault();                                                                                                                 // Execute sequential statement instruction block
    dragCounter = 0;                                                                                                                    // Assign variable property value reference
    uploadZone.classList.remove('drag-over');                                                                                           // Modify element class list collection

    const files = e.dataTransfer.files;                                                                                                 // Initialize immutable variable state reference
    if (files.length > 0) {                                                                                                             // Evaluate boolean condition check logic
        processFile(files[0]);                                                                                                          // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

/**
 * Handle File Selection from Input Element
 * 
 * Processes file selection when a user chooses a file through the file input
 * element (click to browse functionality). Extracts the selected file and
 * initiates the same processing workflow as drag and drop.
 * 
 * @function handleFileSelect
 * @param {Event} e - The change event object from file input
 * @since 2025-05-01
 * @lastModified 2026-01-21
 * @see {@link processFile} File processing handler
 * 
 */
function handleFileSelect(e) {                                                                                                          // Declare function scope logic
    const files = e.target.files;                                                                                                       // Initialize immutable variable state reference
    if (files.length > 0) {                                                                                                             // Evaluate boolean condition check logic
        processFile(files[0]);                                                                                                          // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

/**
 * Process and Validate Uploaded File
 * 
 * Comprehensive file processing function that validates file type and size
 * before initiating the upload workflow. Performs format checking against
 * supported image types and enforces file size limits for optimal performance.
 * 
 * Validation Checks:
 * - File format validation against SUPPORTED_FORMATS
 * - File size validation against MAX_FILE_SIZE (10MB)
 * - Error handling with user-friendly messages
 * 
 * Supported Formats:
 * - JPEG/JPG: Standard compressed image format
 * - PNG: Lossless compression with transparency support
 * - GIF: Animated and static images with limited colors
 * - WEBP: Modern format with superior compression
 * - BMP: Uncompressed bitmap format
 * 
 * @function processFile
 * @param {File} file - The file object to process and validate
 * @since 2025-05-01
 * @lastModified 2026-01-21
 * @see {@link simulateUploadProgress} Upload progress handler
 * @see {@link showUploadError} Error display handler
 * @see {@link showUploadProgress} Progress display handler
 * @see {@link formatFileSize} File size formatting utility
 * 
 */
function processFile(file) {                                                                                                            // Declare function scope logic
    // Validate file type
    if (!SUPPORTED_FORMATS[file.type]) {                                                                                                // Evaluate boolean condition check logic
        Utils.showUploadError(uploadZone, uploadContent, 'Unsupported file format',                                                     // Execute sequential evaluation stream node
            `Please select a file: ${Object.values(SUPPORTED_FORMATS).join(', ')}`);                                                    // Execute sequential statement instruction block
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {                                                                                                    // Evaluate boolean condition check logic
        Utils.showUploadError(uploadZone, uploadContent, 'File too large',                                                              // Execute sequential evaluation stream node
            `File must be smaller than ${Utils.formatFileSize(MAX_FILE_SIZE)}`);                                                        // Execute sequential statement instruction block
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    // Show loading state
    showUploadProgress(file);                                                                                                           // Execute sequential statement instruction block

    // Simulate upload progress
    simulateUploadProgress(file);                                                                                                       // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

/**
 * Simulates file upload progress with visual feedback and automatic upload completion.
 * Creates a realistic progress animation that gradually increases from 0 to 100%,
 * then automatically triggers the file upload process and shows success feedback.
 * 
 * @function simulateUploadProgress
 * @param {File} file - The file object to be uploaded and processed
 * @since 2025-05-01
 * @lastModified 2026-01-21
 * @author Gerardo Tinoco-Guerrero
 * 
 * @description
 * This function provides a smooth user experience by:
 * - Animating progress from 0% to 100% with random increments
 * - Updating the progress display in real-time
 * - Automatically triggering file upload upon completion
 * - Showing success notification and enabling clear button
 * - Assigning the file to the input element for compatibility
 * 
 */
function simulateUploadProgress(file) {                                                                                                 // Declare function scope logic
    let progress = 0;                                                                                                                   // Initialize mutable variable state reference
    const progressInterval = setInterval(() => {                                                                                        // Initialize immutable variable state reference
        progress += Math.random() * 15;                                                                                                 // Execute sequential statement instruction block

        if (progress >= 100) {                                                                                                          // Evaluate boolean condition check logic
            progress = 100;                                                                                                             // Assign variable property value reference
            clearInterval(progressInterval);                                                                                            // Execute sequential statement instruction block

            // Small delay before showing success and auto-uploading
            setTimeout(() => {                                                                                                          // Execute sequential evaluation stream node
                showUploadSuccess(file);                                                                                                // Execute sequential statement instruction block
                // Assign file to input for compatibility
                const dt = new DataTransfer();                                                                                          // Initialize immutable variable state reference
                dt.items.add(file);                                                                                                     // Execute sequential statement instruction block
                fileInput.files = dt.files;                                                                                             // Execute sequential statement instruction block

                // Auto-upload the file immediately
                setTimeout(() => {                                                                                                      // Execute sequential evaluation stream node
                    if (typeof uploadFile === 'function') {                                                                             // Evaluate boolean condition check logic
                        uploadFile();                                                                                                   // Execute sequential statement instruction block
                    }                                                                                                                   // Terminate block scope execution context
                }, 1000);                                                                                                               // Terminate block scope execution context

                // Show clear button
                if (clearButton) {                                                                                                      // Evaluate boolean condition check logic
                    clearButton.style.display = 'inline-flex';                                                                          // Modify element visual style property
                }                                                                                                                       // Terminate block scope execution context
            }, 500);                                                                                                                    // Terminate block scope execution context
        }                                                                                                                               // Terminate block scope execution context

        updateProgressDisplay(progress);                                                                                                // Execute sequential statement instruction block
    }, 100);                                                                                                                            // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Update upload content based on state
/**
 * Updates the upload zone content based on the current drag-and-drop state.
 * Dynamically changes the title and subtitle text to provide appropriate
 * user feedback during different phases of the file upload interaction.
 * 
 * @function updateUploadContent
 * @param {string} state - The current upload state ('drag-over' or 'default')
 * @since 2025-05-01
 * @lastModified 2026-01-21
 * @author Gerardo Tinoco-Guerrero
 * 
 * @description
 * This function manages the upload zone UI states:
 * - 'drag-over': Shows encouraging message when file is being dragged over
 * - 'default': Shows standard upload instructions
 * 
 */
function updateUploadContent(state) {                                                                                                   // Declare function scope logic
    if (!uploadTitle || !uploadSubtitle) return;                                                                                        // Evaluate boolean condition check logic

    switch (state) {                                                                                                                    // Evaluate switch condition check flow
        case 'drag-over':                                                                                                               // Define switch case branch logic
            uploadTitle.textContent = 'Drop your image here!';                                                                          // Execute sequential statement instruction block
            uploadSubtitle.textContent = 'We will process your file immediately';                                                       // Execute sequential statement instruction block
            break;                                                                                                                      // Terminate current loop block context
        case 'default':                                                                                                                 // Define switch case branch logic
        default:                                                                                                                        // Execute sequential evaluation stream node
            uploadTitle.textContent = 'Drop your image here';                                                                           // Execute sequential statement instruction block
            uploadSubtitle.textContent = 'or click to browse files';                                                                    // Execute sequential statement instruction block
            break;                                                                                                                      // Terminate current loop block context
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Show upload progress
function showUploadProgress(file) {                                                                                                     // Declare function scope logic
    uploadZone.classList.add('uploading');                                                                                              // Modify element class list collection
    uploadZone.classList.remove('success', 'error');                                                                                    // Modify element class list collection

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
}                                                                                                                                       // Terminate block scope execution context

// Update progress display
function updateProgressDisplay(progress) {                                                                                              // Declare function scope logic
    const progressText = uploadContent.querySelector('.progress-text');                                                                 // Initialize immutable variable state reference
    const progressCircle = uploadContent.querySelector('.progress-ring-circle');                                                        // Initialize immutable variable state reference

    if (progressText) {                                                                                                                 // Evaluate boolean condition check logic
        progressText.textContent = `${Math.round(progress)}%`;                                                                          // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    if (progressCircle) {                                                                                                               // Evaluate boolean condition check logic
        const circumference = 2 * Math.PI * 36;                                                                                         // Initialize immutable variable state reference
        const offset = circumference - (progress / 100) * circumference;                                                                // Initialize immutable variable state reference
        progressCircle.style.strokeDashoffset = offset;                                                                                 // Modify element visual style property
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Show upload success
function showUploadSuccess(file) {                                                                                                      // Declare function scope logic
    uploadZone.classList.remove('uploading', 'error');                                                                                  // Modify element class list collection
    uploadZone.classList.add('success');                                                                                                // Modify element class list collection

    uploadContent.innerHTML = `
        <div class="upload-success">
            <i class="fas fa-check-circle success-icon"></i>
            <h4>File uploaded successfully!</h4>
            <p>${file.name} (${Utils.formatFileSize(file.size)})</p>
        </div>
    `;                                                                                                                                  // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context



// Reset upload
function resetUpload() {                                                                                                                // Declare function scope logic
    uploadZone.classList.remove('uploading', 'success', 'error', 'drag-over');                                                          // Modify element class list collection

    uploadContent.innerHTML = `
        <div class="upload-icon-container">
            <i class="fas fa-cloud-upload-alt upload-icon" id="uploadIcon"></i>
            <div class="upload-animation">
                <div class="upload-pulse"></div>
                <div class="upload-pulse"></div>
                <div class="upload-pulse"></div>
            </div>
        </div>
        <h4 class="upload-title" id="uploadTitle">Drop your image here</h4>
        <p class="upload-subtitle" id="uploadSubtitle">or click to browse files</p>
        <div class="upload-formats">
            <span class="format-badge">JPG</span>
            <span class="format-badge">PNG</span>
            <span class="format-badge">GIF</span>
            <span class="format-badge">WEBP</span>
            <span class="format-badge">BMP</span>
        </div>
        <div class="upload-size-limit">
            <i class="fas fa-info-circle"></i>
            <span>Maximum file size: 10MB</span>
        </div>
        <button class="upload-button" onclick="document.getElementById('fileInput').click()">
            <i class="fas fa-folder-open"></i>
            <span>Browse Files</span>
        </button>
    `;                                                                                                                                  // Execute sequential statement instruction block

    // Reset references
    uploadIcon = document.getElementById('uploadIcon');                                                                                 // Query document element node reference
    uploadTitle = document.getElementById('uploadTitle');                                                                               // Query document element node reference
    uploadSubtitle = document.getElementById('uploadSubtitle');                                                                         // Query document element node reference

    // Clear file input
    if (fileInput) {                                                                                                                    // Evaluate boolean condition check logic
        fileInput.value = '';                                                                                                           // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    // Hide clear button
    if (clearButton) {                                                                                                                  // Evaluate boolean condition check logic
        clearButton.style.display = 'none';                                                                                             // Modify element visual style property
    }                                                                                                                                   // Terminate block scope execution context

    dragCounter = 0;                                                                                                                    // Assign variable property value reference
}                                                                                                                                       // Terminate block scope execution context

// Clear upload
function clearUpload() {                                                                                                                // Declare function scope logic
    resetUpload();                                                                                                                      // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context



// Upload file
function uploadFile() {                                                                                                                 // Declare function scope logic
    const fileInput = document.getElementById('fileInput');                                                                             // Initialize immutable variable state reference
    const file = fileInput.files[0];                                                                                                    // Initialize immutable variable state reference

    if (!file) {                                                                                                                        // Evaluate boolean condition check logic
        showAlert('Please select a file', 'error');                                                                                     // Execute sequential statement instruction block
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    const formData = new FormData();                                                                                                    // Initialize immutable variable state reference
    formData.append('file', file);                                                                                                      // Execute sequential statement instruction block

    fetch(`${BASE_URL}/upload`, {                                                                                                       // Dispatch asynchronous network payload stream
        method: 'POST',                                                                                                                 // Execute sequential evaluation stream node
        body: formData                                                                                                                  // Execute sequential evaluation stream node
    })                                                                                                                                  // Terminate block scope execution context
        .then(response => response.json())                                                                                              // Chain asynchronous promise resolution sequence
        .then(data => {                                                                                                                 // Chain asynchronous promise resolution sequence
            if (data.success) {                                                                                                         // Evaluate boolean condition check logic
                currentFilename = data.filename;                                                                                        // Assign variable property value reference
                loadImage(data.url);                                                                                                    // Execute sequential statement instruction block
                showAlert('Image uploaded successfully', 'success');                                                                    // Execute sequential statement instruction block

                // Hide upload section after successful file load
                const uploadSection = document.getElementById('uploadSection');                                                         // Initialize immutable variable state reference
                if (uploadSection) {                                                                                                    // Evaluate boolean condition check logic
                    uploadSection.style.display = 'none';                                                                               // Modify element visual style property
                }                                                                                                                       // Terminate block scope execution context
            } else {                                                                                                                    // Terminate block scope execution context
                showFloatingNotification(data.error, 'error');                                                                          // Execute sequential statement instruction block
            }                                                                                                                           // Terminate block scope execution context
        })                                                                                                                              // Terminate block scope execution context
        .catch(error => {                                                                                                               // Catch asynchronous promise exception payload
            showAlert('Error uploading file: ' + error.message, 'error');                                                               // Execute sequential statement instruction block
        });                                                                                                                             // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// ===== IMAGE AND CANVAS FUNCTIONALITY =====

// Load image in canvas
function loadImage(url) {                                                                                                               // Declare function scope logic
    const img = new Image();                                                                                                            // Initialize immutable variable state reference
    img.onload = function () {                                                                                                          // Execute sequential evaluation stream node
        currentImage = img;                                                                                                             // Assign variable property value reference

        // Adjust canvas size
        const maxWidth = 800;                                                                                                           // Initialize immutable variable state reference
        const maxHeight = 600;                                                                                                          // Initialize immutable variable state reference
        let { width, height } = img;                                                                                                    // Initialize mutable variable state reference

        if (width > maxWidth || height > maxHeight) {                                                                                   // Evaluate boolean condition check logic
            const ratio = Math.min(maxWidth / width, maxHeight / height);                                                               // Initialize immutable variable state reference
            width *= ratio;                                                                                                             // Execute sequential statement instruction block
            height *= ratio;                                                                                                            // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context

        canvas.width = width;                                                                                                           // Execute sequential statement instruction block
        canvas.height = height;                                                                                                         // Execute sequential statement instruction block

        // Reset zoom and pan when loading new image
        zoomLevel = 1;                                                                                                                  // Assign variable property value reference
        centerImage();                                                                                                                  // Execute sequential statement instruction block
        updateZoomDisplay();                                                                                                            // Execute sequential statement instruction block

        redrawCanvas();                                                                                                                 // Execute sequential statement instruction block

        // Show image section
        document.getElementById('imageSection').classList.remove('hidden');                                                             // Query document element node reference
    };                                                                                                                                  // Terminate block scope execution context

    img.src = url;                                                                                                                      // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// ===== ZOOM AND PAN FUNCTIONALITY =====

// Handle zoom with mouse wheel
function handleWheel(event) {                                                                                                           // Declare function scope logic
    // Require Ctrl+Wheel for zoom in both normal and refine modes
    if (!event.ctrlKey) {                                                                                                               // Evaluate boolean condition check logic
        return;                                                                                                                         // Only zoom when Ctrl is pressed
    }                                                                                                                                   // Terminate block scope execution context

    event.preventDefault();                                                                                                             // Execute sequential statement instruction block

    const rect = canvas.getBoundingClientRect();                                                                                        // Initialize immutable variable state reference
    const mouseX = event.clientX - rect.left;                                                                                           // Initialize immutable variable state reference
    const mouseY = event.clientY - rect.top;                                                                                            // Initialize immutable variable state reference

    const wheel = event.deltaY < 0 ? 1 : -1;                                                                                            // Initialize immutable variable state reference
    const zoomIntensity = 0.1;                                                                                                          // Initialize immutable variable state reference
    const zoom = Math.exp(wheel * zoomIntensity);                                                                                       // Initialize immutable variable state reference

    const newZoom = zoomLevel * zoom;                                                                                                   // Initialize immutable variable state reference
    if (newZoom < minZoom || newZoom > maxZoom) return;                                                                                 // Evaluate boolean condition check logic

    // Adjust pan for mouse-centered zoom
    panX = mouseX - (mouseX - panX) * zoom;                                                                                             // Assign variable property value reference
    panY = mouseY - (mouseY - panY) * zoom;                                                                                             // Assign variable property value reference

    zoomLevel = newZoom;                                                                                                                // Assign variable property value reference

    // Apply pan limits to prevent white areas
    applyPanLimits();                                                                                                                   // Execute sequential statement instruction block

    updateZoomDisplay();                                                                                                                // Execute sequential statement instruction block
    redrawCanvas();                                                                                                                     // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// Handle start of drag
function handleMouseDown(event) {                                                                                                       // Declare function scope logic
    // Allow drag with Ctrl+Click in both normal and refine modes
    if (event.button === 0 && event.ctrlKey) {                                                                                          // Only left button + Ctrl
        isDragging = true;                                                                                                              // Assign variable property value reference
        hasDragged = false;                                                                                                             // Reset drag flag
        lastMouseX = event.clientX;                                                                                                     // Assign variable property value reference
        lastMouseY = event.clientY;                                                                                                     // Assign variable property value reference
        canvas.style.cursor = 'grabbing';                                                                                               // Modify element visual style property
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Handle mouse movement
function handleMouseMove(event) {                                                                                                       // Declare function scope logic
    if (isDragging) {                                                                                                                   // Evaluate boolean condition check logic
        const deltaX = event.clientX - lastMouseX;                                                                                      // Initialize immutable variable state reference
        const deltaY = event.clientY - lastMouseY;                                                                                      // Initialize immutable variable state reference

        // Check if movement exceeds threshold
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);                                                                  // Initialize immutable variable state reference
        if (distance > dragThreshold) {                                                                                                 // Evaluate boolean condition check logic
            hasDragged = true;                                                                                                          // Assign variable property value reference
        }                                                                                                                               // Terminate block scope execution context

        panX += deltaX;                                                                                                                 // Execute sequential statement instruction block
        panY += deltaY;                                                                                                                 // Execute sequential statement instruction block

        // Apply pan limits to prevent white areas
        applyPanLimits();                                                                                                               // Execute sequential statement instruction block

        lastMouseX = event.clientX;                                                                                                     // Assign variable property value reference
        lastMouseY = event.clientY;                                                                                                     // Assign variable property value reference

        redrawCanvas();                                                                                                                 // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Handle end of drag
function handleMouseUp(event) {                                                                                                         // Declare function scope logic
    if (isDragging) {                                                                                                                   // Evaluate boolean condition check logic
        isDragging = false;                                                                                                             // Assign variable property value reference
        canvas.style.cursor = isRefineMode ? 'crosshair' : 'crosshair';                                                                 // Modify element visual style property

        // Reset hasDragged after a short delay to prevent interference with legitimate clicks
        setTimeout(() => {                                                                                                              // Execute sequential evaluation stream node
            hasDragged = false;                                                                                                         // Assign variable property value reference
        }, 50);                                                                                                                         // Terminate block scope execution context
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Zoom functions
function zoomIn() {                                                                                                                     // Declare function scope logic
    const newZoom = zoomLevel * 1.2;                                                                                                    // Initialize immutable variable state reference
    if (newZoom <= maxZoom) {                                                                                                           // Evaluate boolean condition check logic
        zoomLevel = newZoom;                                                                                                            // Assign variable property value reference
        // If zoom reaches 1, center the image
        if (Math.abs(zoomLevel - 1) < 0.01) {                                                                                           // Evaluate boolean condition check logic
            centerImage();                                                                                                              // Execute sequential statement instruction block
        } else {                                                                                                                        // Terminate block scope execution context
            // Apply pan limits to prevent white areas
            applyPanLimits();                                                                                                           // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
        updateZoomDisplay();                                                                                                            // Execute sequential statement instruction block
        redrawCanvas();                                                                                                                 // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function zoomOut() {                                                                                                                    // Declare function scope logic
    const newZoom = zoomLevel / 1.2;                                                                                                    // Initialize immutable variable state reference
    if (newZoom >= minZoom) {                                                                                                           // Evaluate boolean condition check logic
        zoomLevel = newZoom;                                                                                                            // Assign variable property value reference
        // If zoom reaches 1, center the image
        if (Math.abs(zoomLevel - 1) < 0.01) {                                                                                           // Evaluate boolean condition check logic
            centerImage();                                                                                                              // Execute sequential statement instruction block
        } else {                                                                                                                        // Terminate block scope execution context
            // Apply pan limits to prevent white areas
            applyPanLimits();                                                                                                           // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
        updateZoomDisplay();                                                                                                            // Execute sequential statement instruction block
        redrawCanvas();                                                                                                                 // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function resetZoom() {                                                                                                                  // Declare function scope logic
    zoomLevel = 1;                                                                                                                      // Assign variable property value reference
    centerImage();                                                                                                                      // Execute sequential statement instruction block
    updateZoomDisplay();                                                                                                                // Execute sequential statement instruction block
    redrawCanvas();                                                                                                                     // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

function centerImage() {                                                                                                                // Declare function scope logic
    if (!currentImage) return;                                                                                                          // Evaluate boolean condition check logic

    // Calculate proper centering based on image and canvas dimensions
    const imageAspect = currentImage.width / currentImage.height;                                                                       // Initialize immutable variable state reference
    const canvasAspect = canvas.width / canvas.height;                                                                                  // Initialize immutable variable state reference

    let imageDisplayWidth, imageDisplayHeight;                                                                                          // Initialize mutable variable state reference

    if (imageAspect > canvasAspect) {                                                                                                   // Evaluate boolean condition check logic
        // Image is wider than canvas
        imageDisplayWidth = canvas.width;                                                                                               // Assign variable property value reference
        imageDisplayHeight = canvas.width / imageAspect;                                                                                // Assign variable property value reference
    } else {                                                                                                                            // Terminate block scope execution context
        // Image is taller than canvas
        imageDisplayHeight = canvas.height;                                                                                             // Assign variable property value reference
        imageDisplayWidth = canvas.height * imageAspect;                                                                                // Assign variable property value reference
    }                                                                                                                                   // Terminate block scope execution context

    // Center the image
    panX = (canvas.width - imageDisplayWidth * zoomLevel) / 2;                                                                          // Assign variable property value reference
    panY = (canvas.height - imageDisplayHeight * zoomLevel) / 2;                                                                        // Assign variable property value reference

    // Apply pan limits to prevent white areas
    applyPanLimits();                                                                                                                   // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

function updateZoomDisplay() {                                                                                                          // Declare function scope logic
    document.getElementById('zoomLevel').textContent = Math.round(zoomLevel * 100) + '%';                                               // Query document element node reference
}                                                                                                                                       // Terminate block scope execution context

// Apply pan limits to prevent white areas
function applyPanLimits() {                                                                                                             // Declare function scope logic
    if (!currentImage) return;                                                                                                          // Evaluate boolean condition check logic

    const imageAspect = currentImage.width / currentImage.height;                                                                       // Initialize immutable variable state reference
    const canvasAspect = canvas.width / canvas.height;                                                                                  // Initialize immutable variable state reference

    let imageDisplayWidth, imageDisplayHeight;                                                                                          // Initialize mutable variable state reference

    if (imageAspect > canvasAspect) {                                                                                                   // Evaluate boolean condition check logic
        imageDisplayWidth = canvas.width;                                                                                               // Assign variable property value reference
        imageDisplayHeight = canvas.width / imageAspect;                                                                                // Assign variable property value reference
    } else {                                                                                                                            // Terminate block scope execution context
        imageDisplayHeight = canvas.height;                                                                                             // Assign variable property value reference
        imageDisplayWidth = canvas.height * imageAspect;                                                                                // Assign variable property value reference
    }                                                                                                                                   // Terminate block scope execution context

    const scaledWidth = imageDisplayWidth * zoomLevel;                                                                                  // Initialize immutable variable state reference
    const scaledHeight = imageDisplayHeight * zoomLevel;                                                                                // Initialize immutable variable state reference

    // Calculate limits based on scaled image size
    let minPanX, maxPanX, minPanY, maxPanY;                                                                                             // Initialize mutable variable state reference

    if (scaledWidth <= canvas.width) {                                                                                                  // Evaluate boolean condition check logic
        // Image fits horizontally - center it
        const centerX = (canvas.width - scaledWidth) / 2;                                                                               // Initialize immutable variable state reference
        minPanX = maxPanX = centerX;                                                                                                    // Assign variable property value reference
    } else {                                                                                                                            // Terminate block scope execution context
        // Image is larger than canvas - allow panning within bounds
        maxPanX = 0;                                                                                                                    // Assign variable property value reference
        minPanX = canvas.width - scaledWidth;                                                                                           // Assign variable property value reference
    }                                                                                                                                   // Terminate block scope execution context

    if (scaledHeight <= canvas.height) {                                                                                                // Evaluate boolean condition check logic
        // Image fits vertically - center it
        const centerY = (canvas.height - scaledHeight) / 2;                                                                             // Initialize immutable variable state reference
        minPanY = maxPanY = centerY;                                                                                                    // Assign variable property value reference
    } else {                                                                                                                            // Terminate block scope execution context
        // Image is larger than canvas - allow panning within bounds
        maxPanY = 0;                                                                                                                    // Assign variable property value reference
        minPanY = canvas.height - scaledHeight;                                                                                         // Assign variable property value reference
    }                                                                                                                                   // Terminate block scope execution context

    // Apply limits
    panX = Math.max(minPanX, Math.min(maxPanX, panX));                                                                                  // Assign variable property value reference
    panY = Math.max(minPanY, Math.min(maxPanY, panY));                                                                                  // Assign variable property value reference
}                                                                                                                                       // Terminate block scope execution context

// ===== CANVAS DRAWING FUNCTIONALITY =====

// Redraw canvas with zoom and pan
function redrawCanvas() {                                                                                                               // Declare function scope logic
    if (!currentImage) return;                                                                                                          // Evaluate boolean condition check logic

    drawAllRegions();                                                                                                                   // Execute sequential statement instruction block

    // Redraw temporary region if it exists
    if (tempRegion) {                                                                                                                   // Evaluate boolean condition check logic
        drawTempRegion(tempRegion);                                                                                                     // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Draw all regions
function drawAllRegions() {                                                                                                             // Declare function scope logic
    if (!currentImage) return;                                                                                                          // Evaluate boolean condition check logic

    // Clear canvas and redraw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);                                                                                   // Execute sequential statement instruction block

    // Apply transformations
    ctx.save();                                                                                                                         // Execute sequential statement instruction block
    ctx.translate(panX, panY);                                                                                                          // Execute sequential statement instruction block
    ctx.scale(zoomLevel, zoomLevel);                                                                                                    // Execute sequential statement instruction block

    // Draw image
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);                                                                     // Execute sequential statement instruction block

    // Coordinates are normalized by width and height respectively in the backend
    const scaleX = canvas.width;                                                                                                        // Initialize immutable variable state reference
    const scaleY = canvas.height;                                                                                                       // Initialize immutable variable state reference

    // Draw all confirmed regions
    detectedRegions.forEach(region => {                                                                                                 // Execute sequential evaluation stream node
        if (!region.visible || !region.contour_points) return;                                                                          // Evaluate boolean condition check logic

        ctx.beginPath();                                                                                                                // Execute sequential statement instruction block
        ctx.strokeStyle = region.color;                                                                                                 // Execute sequential statement instruction block
        ctx.lineWidth = 2 / zoomLevel;                                                                                                  // Execute sequential statement instruction block

        let pointsToDraw = region.contour_points;                                                                                       // Initialize mutable variable state reference

        for (let i = 0; i < pointsToDraw.length; i++) {                                                                                 // Iterate sequence stream loop control
            const point = pointsToDraw[i];                                                                                              // Initialize immutable variable state reference
            // Coordinates come normalized by width and height respectively
            const x = point.x * scaleX;                                                                                                 // Initialize immutable variable state reference
            const y = point.y * scaleY;                                                                                                 // Initialize immutable variable state reference

            if (i === 0) {                                                                                                              // Evaluate boolean condition check logic
                ctx.moveTo(x, y);                                                                                                       // Execute sequential statement instruction block
            } else {                                                                                                                    // Terminate block scope execution context
                ctx.lineTo(x, y);                                                                                                       // Execute sequential statement instruction block
            }                                                                                                                           // Terminate block scope execution context
        }                                                                                                                               // Terminate block scope execution context

        ctx.closePath();                                                                                                                // Execute sequential statement instruction block
        ctx.stroke();                                                                                                                   // Execute sequential statement instruction block
    });                                                                                                                                 // Terminate block scope execution context

    ctx.restore();                                                                                                                      // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// Draw temporary region
function drawTempRegion(data) {                                                                                                         // Declare function scope logic
    if (!currentImage || !data || !data.contour_points) {                                                                               // Evaluate boolean condition check logic
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    // First redraw all confirmed regions
    drawAllRegions();                                                                                                                   // Execute sequential statement instruction block

    // Then draw the temporary region on top
    ctx.save();                                                                                                                         // Execute sequential statement instruction block
    ctx.translate(panX, panY);                                                                                                          // Execute sequential statement instruction block
    ctx.scale(zoomLevel, zoomLevel);                                                                                                    // Execute sequential statement instruction block

    // Use the same coordinate system as drawAllRegions for consistency
    const scaleX = canvas.width;                                                                                                        // Initialize immutable variable state reference
    const scaleY = canvas.height;                                                                                                       // Initialize immutable variable state reference

    // Draw temporary contour with dashed line
    ctx.beginPath();                                                                                                                    // Execute sequential statement instruction block
    ctx.strokeStyle = data.color;                                                                                                       // Execute sequential statement instruction block
    ctx.lineWidth = 3 / zoomLevel;                                                                                                      // Execute sequential statement instruction block
    ctx.setLineDash([5, 5]);                                                                                                            // Dashed line for temporary region

    let pointsToDraw = data.contour_points;                                                                                             // Initialize mutable variable state reference

    for (let i = 0; i < pointsToDraw.length; i++) {                                                                                     // Iterate sequence stream loop control
        const point = pointsToDraw[i];                                                                                                  // Initialize immutable variable state reference
        // Use the same coordinate normalization as drawAllRegions
        const x = point.x * scaleX;                                                                                                     // Initialize immutable variable state reference
        const y = point.y * scaleY;                                                                                                     // Initialize immutable variable state reference

        if (i === 0) {                                                                                                                  // Evaluate boolean condition check logic
            ctx.moveTo(x, y);                                                                                                           // Execute sequential statement instruction block
        } else {                                                                                                                        // Terminate block scope execution context
            ctx.lineTo(x, y);                                                                                                           // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    }                                                                                                                                   // Terminate block scope execution context

    ctx.closePath();                                                                                                                    // Execute sequential statement instruction block
    ctx.stroke();                                                                                                                       // Execute sequential statement instruction block
    ctx.setLineDash([]);                                                                                                                // Reset dashed line

    ctx.restore();                                                                                                                      // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// ===== REGION DETECTION AND MANAGEMENT =====

// Handle canvas click
function handleCanvasClick(event) {                                                                                                     // Declare function scope logic
    // Prevent region detection if we just finished dragging
    if (!currentImage || !currentFilename || isDragging || hasDragged) return;                                                          // Evaluate boolean condition check logic

    const rect = canvas.getBoundingClientRect();                                                                                        // Initialize immutable variable state reference

    // Convert canvas coordinates to original image coordinates
    const canvasX = event.clientX - rect.left;                                                                                          // Initialize immutable variable state reference
    const canvasY = event.clientY - rect.top;                                                                                           // Initialize immutable variable state reference

    // Adjust for zoom and pan
    const imageX = (canvasX - panX) / zoomLevel;                                                                                        // Initialize immutable variable state reference
    const imageY = (canvasY - panY) / zoomLevel;                                                                                        // Initialize immutable variable state reference

    // Convert to original image coordinates
    const scaleX = currentImage.width / canvas.width;                                                                                   // Initialize immutable variable state reference
    const scaleY = currentImage.height / canvas.height;                                                                                 // Initialize immutable variable state reference

    const x = Math.floor(imageX * scaleX);                                                                                              // Initialize immutable variable state reference
    const y = Math.floor(imageY * scaleY);                                                                                              // Initialize immutable variable state reference

    // Verify that coordinates are within the image
    if (x >= 0 && x < currentImage.width && y >= 0 && y < currentImage.height) {                                                        // Evaluate boolean condition check logic
        detectRegion(x, y);                                                                                                             // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Detect region
function detectRegion(x, y) {                                                                                                           // Declare function scope logic
    const tolerance = 30;                                                                                                               // Balanced tolerance for complete region detection

    // Show loading indicator
    showFloatingNotification(window.I18N.detectingRegions || 'Detecting regions...', 'info', 3000);                                     // Execute sequential statement instruction block

    fetch(`${BASE_URL}/detect_region`, {                                                                                                // Dispatch asynchronous network payload stream
        method: 'POST',                                                                                                                 // Execute sequential evaluation stream node
        headers: {                                                                                                                      // Execute sequential evaluation stream node
            'Content-Type': 'application/json'                                                                                          // Execute sequential evaluation stream node
        },                                                                                                                              // Terminate block scope execution context
        body: JSON.stringify({                                                                                                          // Execute sequential evaluation stream node
            filename: currentFilename,                                                                                                  // Execute sequential evaluation stream node
            x: x,                                                                                                                       // Execute sequential evaluation stream node
            y: y,                                                                                                                       // Execute sequential evaluation stream node
            tolerance: tolerance                                                                                                        // Execute sequential evaluation stream node
        })                                                                                                                              // Terminate block scope execution context
    })                                                                                                                                  // Terminate block scope execution context
        .then(response => response.json())                                                                                              // Chain asynchronous promise resolution sequence
        .then(data => {                                                                                                                 // Chain asynchronous promise resolution sequence
            if (data.success) {                                                                                                         // Evaluate boolean condition check logic
                tempRegion = data;                                                                                                      // Assign variable property value reference
                tempRegion.color = regionColors[currentRegionIndex % regionColors.length];                                              // Execute sequential statement instruction block
                tempRegion.id = Date.now();                                                                                             // Unique ID based on timestamp
                tempRegion.name = `${window.I18N.regionPrefix || 'Region'} ${currentRegionIndex + 1}`;                                  // Execute sequential statement instruction block

                tempRegion.targetPointsCount = tempRegion.contour_points.length;                                                        // Execute sequential statement instruction block
                tempRegion.smoothing = 100;                                                                                             // Execute sequential statement instruction block

                drawTempRegion(tempRegion);                                                                                             // Execute sequential statement instruction block
                displayTempRegion(tempRegion);                                                                                          // Execute sequential statement instruction block

                document.getElementById('addRegionBtn').disabled = false;                                                               // Query document element node reference
                showFloatingNotification(window.I18N.regionDetected || 'Region detected! Click \"Add Region\" to confirm.', 'success', 4000); // Execute sequential statement instruction block
            } else {                                                                                                                    // Terminate block scope execution context
                showFloatingNotification(data.error, 'error');                                                                          // Execute sequential statement instruction block
            }                                                                                                                           // Terminate block scope execution context
        })                                                                                                                              // Terminate block scope execution context
        .catch(error => {                                                                                                               // Catch asynchronous promise exception payload
            showFloatingNotification(`${window.I18N.errorDetecting || 'Error detecting region:'} ${error.message}`, 'error');           // Execute sequential statement instruction block
        });                                                                                                                             // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Show detected region information
function addRegion() {                                                                                                                  // Declare function scope logic
    if (!tempRegion) return;                                                                                                            // Evaluate boolean condition check logic

    tempRegion.visible = true;                                                                                                          // Execute sequential statement instruction block
    tempRegion.original_contour_points = [...tempRegion.contour_points];                                                                // Execute sequential statement instruction block
    tempRegion.smoothing = 100;                                                                                                         // 100% retention initially
    detectedRegions.push(tempRegion);                                                                                                   // Execute sequential statement instruction block
    currentRegionIndex++;                                                                                                               // Execute sequential statement instruction block

    updateRegionsList();                                                                                                                // Execute sequential statement instruction block
    redrawCanvas();                                                                                                                     // Execute sequential statement instruction block

    // Clear temporary region
    tempRegion = null;                                                                                                                  // Assign variable property value reference
    document.getElementById('addRegionBtn').disabled = true;                                                                            // Query document element node reference

    const hasRegions = detectedRegions.length > 0;                                                                                      // Initialize immutable variable state reference
    document.getElementById('saveBtn').disabled = !hasRegions;                                                                          // Query document element node reference

    const clearBtn = document.getElementById('clearBtn');                                                                               // Initialize immutable variable state reference
    if (clearBtn) clearBtn.disabled = !hasRegions;                                                                                      // Evaluate boolean condition check logic

    // Exit refinement mode automatically to allow detecting new regions
    if (isRefineMode) {                                                                                                                 // Evaluate boolean condition check logic
        exitRefineMode();                                                                                                               // Execute sequential statement instruction block
        showFloatingNotification((window.I18N.regionAddedExited || 'Region \"{name}\" added successfully! Exited refinement mode to detect new regions.').replace('{name}', detectedRegions[detectedRegions.length - 1].name), 'success'); // Execute sequential statement instruction block
    } else {                                                                                                                            // Terminate block scope execution context
        showFloatingNotification((window.I18N.regionAdded || 'Region \"{name}\" added successfully!').replace('{name}', detectedRegions[detectedRegions.length - 1].name), 'success'); // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function displayTempRegion(data) {                                                                                                      // Declare function scope logic
    if (!data || !data.contour_points) return;                                                                                          // Evaluate boolean condition check logic

    // Show temporary region info in floating notification
    showFloatingNotification(                                                                                                           // Execute sequential evaluation stream node
        (window.I18N.tempRegionDetected || 'Temporary region detected with {count} points. Click \"Add Region\" to confirm.').replace('{count}', data.contour_points.length), // Execute sequential evaluation stream node
        'info',                                                                                                                         // Execute sequential evaluation stream node
        5000                                                                                                                            // Execute sequential evaluation stream node
    );                                                                                                                                  // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

function updateRegionsList() {                                                                                                          // Declare function scope logic
    const regionsList = document.getElementById('regionsList');                                                                         // Initialize immutable variable state reference
    const regionsDisplay = document.getElementById('regionsDisplay');                                                                   // Initialize immutable variable state reference

    if (detectedRegions.length === 0) {                                                                                                 // Evaluate boolean condition check logic
        regionsDisplay.classList.add('hidden');                                                                                         // Modify element class list collection
        regionsList.innerHTML = `
            <div class="regions-empty">
                <i class="fas fa-bullseye"></i>
                <h4>${window.I18N.noRegionsTitle || 'No regions detected'}</h4>
                <p>${window.I18N.noRegionsDesc || 'Click on the image to detect and add contour regions'}</p>
            </div>
        `;                                                                                                                              // Execute sequential statement instruction block
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    regionsDisplay.classList.remove('hidden');                                                                                          // Modify element class list collection

    regionsList.innerHTML = detectedRegions.map((region, index) => {                                                                    // Execute sequential evaluation stream node
        const pointCount = region.contour_points ? region.contour_points.length : 0;                                                    // Initialize immutable variable state reference

        return `
            <div class="region-card" style="--rc: ${region.color}">
                <div class="rc-header">
                    <div class="rc-color-dot" style="background: ${region.color}; box-shadow: 0 0 10px ${region.color}80;"></div>
                    <h4 class="rc-title">${region.name}</h4>
                    <span class="rc-points">${pointCount} pts</span>
                </div>
                
                <div class="rc-body">
                    <div class="rc-retention">
                        <div class="rc-retention-header" style="margin-bottom: 8px;">
                            <span><i class="fas fa-compress-arrows-alt"></i> ${window.I18N.nodeRetention || 'Node Retention'}</span>
                            <span id="smoothing-val-${index}" class="rc-retention-val">${(region.smoothing !== undefined ? region.smoothing : 100).toFixed(2)}%</span>
                        </div>
                        
                        <div style="display: flex; gap: 8px; align-items: center; justify-content: space-between;">
                            <input type="range" id="regionDensity_${index}" class="rc-slider" style="flex: 1;"
                                min="1" max="100" step="0.01" value="${region.smoothing || 100}"
                                oninput="document.getElementById('smoothing-val-${index}').textContent = parseFloat(this.value).toFixed(2) + '%'"
                                onchange="applyRegionSmoothingPercentage(${index}, this.value)">
                            
                            <div style="display: flex; gap: 4px; align-items: center; background: #f8fafc; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);">
                                <input type="number" id="regionDensityExact_${index}" class="rc-exact-input"
                                    min="3" max="${region.original_contour_points ? region.original_contour_points.length : region.contour_points.length}"
                                    value="${region.targetPointsCount || region.contour_points.length}"
                                    onchange="applyRegionSmoothingExact(${index}, this.value)"
                                    style="width: 55px; text-align: center; border: none; background: transparent; color: #334155; font-family: inherit; font-size: 0.9em; outline: none; font-weight: 600;">
                                <span style="font-size: 0.75em; color: #64748b; font-weight: 500;">${window.I18N.nodesText || 'nodes'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="rc-actions">
                    <button class="rc-btn rc-toggle ${region.visible ? 'active' : ''}" onclick="toggleRegion(${index})" title="${region.visible ? 'Hide' : 'Show'} region">
                        <i class="fas ${region.visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                    </button>
                    <button class="rc-btn rc-export" onclick="exportSingleRegion(${index})" title="Export region">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="rc-btn rc-delete" onclick="deleteRegion(${index})" title="Delete region">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;                                                                                                                              // Execute sequential statement instruction block
    }).join('');                                                                                                                        // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function applyRegionSmoothingPercentage(index, percentage) {                                                                            // Declare function scope logic
    if (index < 0 || index >= detectedRegions.length) return;                                                                           // Evaluate boolean condition check logic

    const region = detectedRegions[index];                                                                                              // Initialize immutable variable state reference
    const targetPercentage = parseFloat(percentage);                                                                                    // Initialize immutable variable state reference

    region.smoothing = parseFloat(targetPercentage.toFixed(2));                                                                         // Execute sequential statement instruction block
    const maxPoints = region.original_contour_points ? region.original_contour_points.length : region.contour_points.length;            // Initialize immutable variable state reference
    region.targetPointsCount = Math.max(3, Math.floor(maxPoints * (targetPercentage / 100)));                                           // Execute sequential statement instruction block

    // Sync exact input field and text
    const exactInput = document.getElementById(`regionDensityExact_${index}`);                                                          // Initialize immutable variable state reference
    if (exactInput) exactInput.value = region.targetPointsCount;                                                                        // Evaluate boolean condition check logic
    const smoothingVal = document.getElementById(`smoothing-val-${index}`);                                                             // Initialize immutable variable state reference
    if (smoothingVal) smoothingVal.textContent = region.smoothing.toFixed(2) + '%';                                                     // Evaluate boolean condition check logic

    if (targetPercentage < 100) {                                                                                                       // Evaluate boolean condition check logic
        region.contour_points = simplifyRegionContour(region.original_contour_points, region.targetPointsCount);                        // Execute sequential statement instruction block
    } else {                                                                                                                            // Terminate block scope execution context
        region.contour_points = [...region.original_contour_points];                                                                    // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    // Update the UI
    updateRegionsList();                                                                                                                // Execute sequential statement instruction block
    redrawCanvas();                                                                                                                     // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

function applyRegionSmoothingExact(index, exactValue) {                                                                                 // Declare function scope logic
    if (index < 0 || index >= detectedRegions.length) return;                                                                           // Evaluate boolean condition check logic

    const region = detectedRegions[index];                                                                                              // Initialize immutable variable state reference
    const maxPoints = region.original_contour_points ? region.original_contour_points.length : region.contour_points.length;            // Initialize immutable variable state reference

    let targetPoints = parseInt(exactValue);                                                                                            // Initialize mutable variable state reference
    if (isNaN(targetPoints) || targetPoints < 3) targetPoints = 3;                                                                      // Evaluate boolean condition check logic
    if (targetPoints > maxPoints) targetPoints = maxPoints;                                                                             // Evaluate boolean condition check logic

    region.targetPointsCount = targetPoints;                                                                                            // Execute sequential statement instruction block
    region.smoothing = parseFloat(((targetPoints / maxPoints) * 100).toFixed(2));                                                       // Execute sequential statement instruction block

    // Sync percentage slider and text
    const sliderInput = document.getElementById(`regionDensity_${index}`);                                                              // Initialize immutable variable state reference
    if (sliderInput) sliderInput.value = region.smoothing;                                                                              // Evaluate boolean condition check logic
    const smoothingVal = document.getElementById(`smoothing-val-${index}`);                                                             // Initialize immutable variable state reference
    if (smoothingVal) smoothingVal.textContent = region.smoothing.toFixed(2) + '%';                                                     // Evaluate boolean condition check logic

    if (targetPoints < maxPoints) {                                                                                                     // Evaluate boolean condition check logic
        region.contour_points = simplifyRegionContour(region.original_contour_points, region.targetPointsCount);                        // Execute sequential statement instruction block
    } else {                                                                                                                            // Terminate block scope execution context
        region.contour_points = [...region.original_contour_points];                                                                    // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    // Update the UI
    updateRegionsList();                                                                                                                // Execute sequential statement instruction block
    redrawCanvas();                                                                                                                     // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

function toggleRegion(index) {                                                                                                          // Declare function scope logic
    if (index >= 0 && index < detectedRegions.length) {                                                                                 // Evaluate boolean condition check logic
        detectedRegions[index].visible = !detectedRegions[index].visible;                                                               // Execute sequential statement instruction block
        updateRegionsList();                                                                                                            // Execute sequential statement instruction block
        redrawCanvas();                                                                                                                 // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function deleteRegion(index) {                                                                                                          // Declare function scope logic
    if (index >= 0 && index < detectedRegions.length) {                                                                                 // Evaluate boolean condition check logic
        const regionName = detectedRegions[index].name;                                                                                 // Initialize immutable variable state reference
        detectedRegions.splice(index, 1);                                                                                               // Execute sequential statement instruction block
        updateRegionsList();                                                                                                            // Execute sequential statement instruction block
        redrawCanvas();                                                                                                                 // Execute sequential statement instruction block

        const hasRegions = detectedRegions.length > 0;                                                                                  // Initialize immutable variable state reference
        document.getElementById('saveBtn').disabled = !hasRegions;                                                                      // Query document element node reference
        const clearBtn = document.getElementById('clearBtn');                                                                           // Initialize immutable variable state reference
        if (clearBtn) clearBtn.disabled = !hasRegions;                                                                                  // Evaluate boolean condition check logic

        showFloatingNotification((window.I18N.regionDeleted || 'Region \"{name}\" deleted.').replace('{name}', regionName), 'info');    // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

function clearAllRegions() {                                                                                                            // Declare function scope logic
    detectedRegions = [];                                                                                                               // Assign variable property value reference
    tempRegion = null;                                                                                                                  // Assign variable property value reference
    currentRegionIndex = 0;                                                                                                             // Assign variable property value reference

    updateRegionsList();                                                                                                                // Execute sequential statement instruction block
    redrawCanvas();                                                                                                                     // Execute sequential statement instruction block

    document.getElementById('addRegionBtn').disabled = true;                                                                            // Query document element node reference
    document.getElementById('saveBtn').disabled = true;                                                                                 // Query document element node reference
    const clearBtn = document.getElementById('clearBtn');                                                                               // Initialize immutable variable state reference
    if (clearBtn) clearBtn.disabled = true;                                                                                             // Evaluate boolean condition check logic

    showFloatingNotification(window.I18N.allRegionsCleared || 'All regions have been cleared.', 'info');                                // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// ===== EXPORT FUNCTIONALITY =====

// Helper function to calculate region area
/**
 * calculateRegionArea
 * Calculates the area of a detected region using the shoelace formula.
 * 
 * Computes the area enclosed by the region's contour points using the
 * mathematical shoelace (surveyor's) formula for polygon area calculation.
 * 
 * Input:
 *     region       Object          The region object containing contour points.
 * 
 * Output:
 *     area         number          The calculated area in square pixels, or 0 if invalid region.
 */
function calculateRegionArea(region) {                                                                                                  // Define area calculation function block
    if (!region.contour_points || region.contour_points.length < 3) {                                                                   // Check minimum required polygon geometry count
        return 0;                                                                                                                       // Return zero area for malformed geometry shapes
    }                                                                                                                                   // End polygon validation conditional expression

    let area = 0;                                                                                                                       // Initialize zero accumulation variable area value
    const points = region.contour_points;                                                                                               // Store local reference array memory pointer
    const n = points.length;                                                                                                            // Store total geometry vertex point count value

    for (let i = 0; i < n; i++) {                                                                                                       // Begin iterative vertex summation loop process
        const j = (i + 1) % n;                                                                                                          // Determine circular wrapped array target index
        area += points[i].x * points[j].y;                                                                                              // Accumulate positive diagonal cross product sum
        area -= points[j].x * points[i].y;                                                                                              // Substract negative diagonal cross product sum
    }                                                                                                                                   // End vertex iteration shoelace loop evaluation

    return Math.abs(area) / 2;                                                                                                          // Calculate absolute halving value final result
}                                                                                                                                       // Terminate block scope execution context

// Export single region
function exportSingleRegion(index) {                                                                                                    // Declare function scope logic
    if (index < 0 || index >= detectedRegions.length) {                                                                                 // Evaluate boolean condition check logic
        showFloatingNotification(window.I18N.invalidRegion || 'Invalid region index', 'error');                                         // Execute sequential statement instruction block
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    const region = detectedRegions[index];                                                                                              // Initialize immutable variable state reference
    if (!region.contour_points || region.contour_points.length === 0) {                                                                 // Evaluate boolean condition check logic
        showFloatingNotification(window.I18N.noPointsExport || 'No contour points to export', 'error');                                 // Execute sequential statement instruction block
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    // Prepare data for export
    const normalizeSetting = getNormalizeSetting();                                                                                     // Initialize immutable variable state reference

    // Show loading notification
    showFloatingNotification(window.I18N.exportingRegion || 'Exporting region...', 'info', 2000);                                       // Execute sequential statement instruction block

    fetch(`${BASE_URL}/export_single_region`, {                                                                                         // Dispatch asynchronous network payload stream
        method: 'POST',                                                                                                                 // Execute sequential evaluation stream node
        headers: {                                                                                                                      // Execute sequential evaluation stream node
            'Content-Type': 'application/json'                                                                                          // Execute sequential evaluation stream node
        },                                                                                                                              // Terminate block scope execution context
        body: JSON.stringify({                                                                                                          // Execute sequential evaluation stream node
            contour_points: region.contour_points,                                                                                      // Execute sequential evaluation stream node
            region_name: region.name,                                                                                                   // Execute sequential evaluation stream node
            filename: currentFilename,                                                                                                  // Execute sequential evaluation stream node
            normalize: normalizeSetting                                                                                                 // Execute sequential evaluation stream node
        })                                                                                                                              // Terminate block scope execution context
    })                                                                                                                                  // Terminate block scope execution context
        .then(response => response.json())                                                                                              // Chain asynchronous promise resolution sequence
        .then(data => {                                                                                                                 // Chain asynchronous promise resolution sequence
            if (data.success) {                                                                                                         // Evaluate boolean condition check logic
                // Create download link
                const link = document.createElement('a');                                                                               // Initialize immutable variable state reference
                link.href = `${BASE_URL}/download/${data.filename}`;                                                                    // Execute sequential statement instruction block
                link.download = data.filename;                                                                                          // Execute sequential statement instruction block
                document.body.appendChild(link);                                                                                        // Execute sequential statement instruction block
                link.click();                                                                                                           // Execute sequential statement instruction block
                document.body.removeChild(link);                                                                                        // Execute sequential statement instruction block

                showFloatingNotification((window.I18N.regionExported || 'Region \"{name}\" exported successfully!').replace('{name}', region.name), 'success'); // Execute sequential statement instruction block
            } else {                                                                                                                    // Terminate block scope execution context
                showFloatingNotification(data.error, 'error');                                                                          // Execute sequential statement instruction block
            }                                                                                                                           // Terminate block scope execution context
        })                                                                                                                              // Terminate block scope execution context
        .catch(error => {                                                                                                               // Catch asynchronous promise exception payload
            showFloatingNotification(`${window.I18N.errorExporting || 'Error exporting region:'} ${error.message}`, 'error');           // Execute sequential statement instruction block
        });                                                                                                                             // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Save all coordinates
function saveAllCoordinates() {                                                                                                         // Declare function scope logic
    if (detectedRegions.length === 0) {                                                                                                 // Evaluate boolean condition check logic
        showFloatingNotification(window.I18N.noRegionsSave || 'No regions to save', 'error');                                           // Execute sequential statement instruction block
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    const normalizeSetting = getNormalizeSetting();                                                                                     // Initialize immutable variable state reference

    // Convert regions to required format
    const regionsData = detectedRegions.map(r => ({                                                                                     // Initialize immutable variable state reference
        region_name: r.name,                                                                                                            // Execute sequential evaluation stream node
        contour_points: r.contour_points                                                                                                // Execute sequential evaluation stream node
    }));                                                                                                                                // Terminate block scope execution context

    // Show loading notification
    showFloatingNotification(window.I18N.savingAll || 'Saving all regions...', 'info', 2000);                                           // Execute sequential statement instruction block

    fetch(`${BASE_URL}/save_all_coordinates`, {                                                                                         // Dispatch asynchronous network payload stream
        method: 'POST',                                                                                                                 // Execute sequential evaluation stream node
        headers: {                                                                                                                      // Execute sequential evaluation stream node
            'Content-Type': 'application/json'                                                                                          // Execute sequential evaluation stream node
        },                                                                                                                              // Terminate block scope execution context
        body: JSON.stringify({                                                                                                          // Execute sequential evaluation stream node
            regions: regionsData,                                                                                                       // Execute sequential evaluation stream node
            filename: currentFilename,                                                                                                  // Execute sequential evaluation stream node
            normalize: normalizeSetting                                                                                                 // Execute sequential evaluation stream node
        })                                                                                                                              // Terminate block scope execution context
    })                                                                                                                                  // Terminate block scope execution context
        .then(response => response.json())                                                                                              // Chain asynchronous promise resolution sequence
        .then(data => {                                                                                                                 // Chain asynchronous promise resolution sequence
            if (data.success) {                                                                                                         // Evaluate boolean condition check logic
                // Create download link
                const link = document.createElement('a');                                                                               // Initialize immutable variable state reference
                link.href = `${BASE_URL}/download/${data.filename}`;                                                                    // Execute sequential statement instruction block
                link.download = data.filename;                                                                                          // Execute sequential statement instruction block
                document.body.appendChild(link);                                                                                        // Execute sequential statement instruction block
                link.click();                                                                                                           // Execute sequential statement instruction block
                document.body.removeChild(link);                                                                                        // Execute sequential statement instruction block

                showFloatingNotification((window.I18N.allRegionsSaved || 'All regions saved successfully! ({count} regions)').replace('{count}', detectedRegions.length), 'success'); // Execute sequential statement instruction block
            } else {                                                                                                                    // Terminate block scope execution context
                showFloatingNotification(data.error, 'error');                                                                          // Execute sequential statement instruction block
            }                                                                                                                           // Terminate block scope execution context
        })                                                                                                                              // Terminate block scope execution context
        .catch(error => {                                                                                                               // Catch asynchronous promise exception payload
            showFloatingNotification(`${window.I18N.errorSaving || 'Error saving regions:'} ${error.message}`, 'error');                // Execute sequential statement instruction block
        });                                                                                                                             // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// ===== NOTIFICATION SYSTEM =====

// Show alert
function showAlert(message, type) {                                                                                                     // Declare function scope logic
    // Implementation depends on your alert system
}                                                                                                                                       // Terminate block scope execution context

// Show floating notification
function showFloatingNotification(message, type = 'info', duration = 5000) {                                                            // Declare function scope logic
    // Create notification element
    const notification = document.createElement('div');                                                                                 // Initialize immutable variable state reference
    notification.className = `floating-notification ${type}`;                                                                           // Execute sequential statement instruction block
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;                                                                                                                                  // Execute sequential statement instruction block

    // Add to container
    let container = document.getElementById('notificationContainer');                                                                   // Initialize mutable variable state reference
    if (!container) {                                                                                                                   // Evaluate boolean condition check logic
        container = document.createElement('div');                                                                                      // Assign variable property value reference
        container.id = 'notificationContainer';                                                                                         // Execute sequential statement instruction block
        container.className = 'floating-notifications';                                                                                 // Execute sequential statement instruction block
        document.body.appendChild(container);                                                                                           // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    container.appendChild(notification);                                                                                                // Execute sequential statement instruction block

    // Animate in
    setTimeout(() => {                                                                                                                  // Execute sequential evaluation stream node
        notification.classList.add('show');                                                                                             // Modify element class list collection
    }, 10);                                                                                                                             // Terminate block scope execution context

    // Auto remove after duration
    if (duration > 0) {                                                                                                                 // Evaluate boolean condition check logic
        setTimeout(() => {                                                                                                              // Execute sequential evaluation stream node
            removeNotification(notification);                                                                                           // Execute sequential statement instruction block
        }, duration);                                                                                                                   // Terminate block scope execution context
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Get notification icon based on type
function getNotificationIcon(type) {                                                                                                    // Declare function scope logic
    switch (type) {                                                                                                                     // Evaluate switch condition check flow
        case 'success': return 'fa-check-circle';                                                                                       // Define switch case branch logic
        case 'error': return 'fa-exclamation-circle';                                                                                   // Define switch case branch logic
        case 'warning': return 'fa-exclamation-triangle';                                                                               // Define switch case branch logic
        case 'info':                                                                                                                    // Define switch case branch logic
        default: return 'fa-info-circle';                                                                                               // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Close notification
function closeNotification(button) {                                                                                                    // Declare function scope logic
    const notification = button.closest('.floating-notification');                                                                      // Initialize immutable variable state reference
    removeNotification(notification);                                                                                                   // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// Remove notification
function removeNotification(notification) {                                                                                             // Declare function scope logic
    if (notification && notification.parentNode) {                                                                                      // Evaluate boolean condition check logic
        notification.classList.remove('show');                                                                                          // Modify element class list collection
        setTimeout(() => {                                                                                                              // Execute sequential evaluation stream node
            if (notification.parentNode) {                                                                                              // Evaluate boolean condition check logic
                notification.parentNode.removeChild(notification);                                                                      // Execute sequential statement instruction block
            }                                                                                                                           // Terminate block scope execution context
        }, 300);                                                                                                                        // Terminate block scope execution context
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// ===== INTERACTIVE SEGMENTATION FUNCTIONALITY =====

// Refine mode variables
let isRefineMode = false;                                                                                                               // Initialize mutable variable state reference
let brushSize = 20;                                                                                                                     // Initialize mutable variable state reference
let brushStrokes = [];                                                                                                                  // Initialize mutable variable state reference
let isDrawing = false;                                                                                                                  // Initialize mutable variable state reference
let currentStroke = null;                                                                                                               // Initialize mutable variable state reference
let currentBrushMode = 'add';                                                                                                           // 'add' or 'remove'

// Toggle refine mode
function toggleRefineMode() {                                                                                                           // Declare function scope logic
    isRefineMode = !isRefineMode;                                                                                                       // Assign variable property value reference
    const refineControls = document.getElementById('refineControls');                                                                   // Initialize immutable variable state reference
    const toggleBtn = document.getElementById('refineModeToggle');                                                                      // Initialize immutable variable state reference

    if (isRefineMode) {                                                                                                                 // Evaluate boolean condition check logic
        refineControls.style.display = 'flex';                                                                                          // Modify element visual style property
        toggleBtn.classList.add('active');                                                                                              // Modify element class list collection
        toggleBtn.innerHTML = `<i class=\"fas fa-edit\"></i><span>${window.I18N.exitRefinement || 'Exit Refinement'}</span>`;           // Execute sequential statement instruction block
        canvas.style.cursor = 'crosshair';                                                                                              // Modify element visual style property
        showFloatingNotification(window.I18N.refineActivated || 'Refinement mode activated. Click and drag to add/remove areas. Use Ctrl+Wheel for zoom and Ctrl+Drag to move the image.', 'info'); // Execute sequential statement instruction block

        // Update instructions to include information about zoom and pan
        const refineInstructions = document.querySelector('.refine-instructions .refine-text');                                         // Initialize immutable variable state reference
        if (refineInstructions) {                                                                                                       // Evaluate boolean condition check logic
            refineInstructions.innerHTML = `<i class=\"fas fa-info-circle\"></i> ${window.I18N.refineInstructions || 'Click to add areas (+) or hold Shift to remove (-). Use Ctrl+Wheel for zoom and Ctrl+Drag to move the image.'}`; // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    } else {                                                                                                                            // Terminate block scope execution context
        refineControls.style.display = 'none';                                                                                          // Modify element visual style property
        toggleBtn.classList.remove('active');                                                                                           // Modify element class list collection
        toggleBtn.innerHTML = `<i class=\"fas fa-edit\"></i><span>${window.I18N.refineSelection || 'Refine Selection'}</span>`;         // Execute sequential statement instruction block
        canvas.style.cursor = 'pointer';                                                                                                // Modify element visual style property
        resetRefineState();                                                                                                             // Execute sequential statement instruction block
        showFloatingNotification(window.I18N.refineDeactivated || 'Refinement mode deactivated.', 'info');                              // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Update brush size
function updateBrushSize(size) {                                                                                                        // Declare function scope logic
    brushSize = parseInt(size);                                                                                                         // Assign variable property value reference
    document.getElementById('brushSizeValue').textContent = size;                                                                       // Query document element node reference
}                                                                                                                                       // Terminate block scope execution context

// Undo last stroke
function undoLastStroke() {                                                                                                             // Declare function scope logic
    if (brushStrokes.length > 0) {                                                                                                      // Evaluate boolean condition check logic
        brushStrokes.pop();                                                                                                             // Remove the last stroke
        redrawCanvas();                                                                                                                 // Execute sequential statement instruction block
        updateRefineButtons();                                                                                                          // Execute sequential statement instruction block
        showFloatingNotification(window.I18N.lastStrokeUndone || 'Last stroke undone.', 'info');                                        // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Clear all refinements
function clearAllRefinements() {                                                                                                        // Declare function scope logic
    brushStrokes = [];                                                                                                                  // Assign variable property value reference
    redrawCanvas();                                                                                                                     // Execute sequential statement instruction block
    updateRefineButtons();                                                                                                              // Execute sequential statement instruction block
    showFloatingNotification(window.I18N.allRefinementsCleared || 'All refinements cleared.', 'info');                                  // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// Update refine buttons state
function updateRefineButtons() {                                                                                                        // Declare function scope logic
    const applyBtn = document.getElementById('applyRefineBtn');                                                                         // Initialize immutable variable state reference
    const undoLastBtn = document.getElementById('undoLastBtn');                                                                         // Initialize immutable variable state reference
    const hasStrokes = brushStrokes.length > 0;                                                                                         // Initialize immutable variable state reference

    if (applyBtn) {                                                                                                                     // Evaluate boolean condition check logic
        applyBtn.disabled = !hasStrokes;                                                                                                // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    if (undoLastBtn) {                                                                                                                  // Evaluate boolean condition check logic
        undoLastBtn.disabled = !hasStrokes;                                                                                             // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Handle refine canvas interaction
function handleRefineCanvasClick(event) {                                                                                               // Declare function scope logic
    if (!isRefineMode) return false;                                                                                                    // Evaluate boolean condition check logic

    // Determine brush mode based on mouse button or key modifier
    currentBrushMode = event.shiftKey ? 'remove' : 'add';                                                                               // Assign variable property value reference

    return true;                                                                                                                        // Prevent normal click handling
}                                                                                                                                       // Terminate block scope execution context

// Handle brush drawing start
function handleBrushStart(event) {                                                                                                      // Declare function scope logic
    if (!isRefineMode) return;                                                                                                          // Evaluate boolean condition check logic

    // Don't draw if Ctrl is pressed (for panning)
    if (event.ctrlKey) return;                                                                                                          // Evaluate boolean condition check logic

    event.preventDefault();                                                                                                             // Execute sequential statement instruction block
    isDrawing = true;                                                                                                                   // Assign variable property value reference

    // Determine brush mode based on Shift key
    currentBrushMode = event.shiftKey ? 'remove' : 'add';                                                                               // Assign variable property value reference

    const rect = canvas.getBoundingClientRect();                                                                                        // Initialize immutable variable state reference
    const x = (event.clientX - rect.left - panX) / zoomLevel;                                                                           // Initialize immutable variable state reference
    const y = (event.clientY - rect.top - panY) / zoomLevel;                                                                            // Initialize immutable variable state reference

    currentStroke = {                                                                                                                   // Assign variable property value reference
        points: [{ x: x / canvas.width, y: y / canvas.height }],                                                                        // Execute sequential evaluation stream node
        mode: currentBrushMode,                                                                                                         // Execute sequential evaluation stream node
        size: brushSize                                                                                                                 // Execute sequential evaluation stream node
    };                                                                                                                                  // Terminate block scope execution context

    // Update cursor and show immediate feedback
    canvas.style.cursor = currentBrushMode === 'add' ? 'crosshair' : 'not-allowed';                                                     // Modify element visual style property

    // Show immediate visual feedback
    redrawCanvas();                                                                                                                     // Execute sequential statement instruction block
    if (currentStroke) {                                                                                                                // Evaluate boolean condition check logic
        drawBrushStroke(currentStroke, true);                                                                                           // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Handle brush drawing move
function handleBrushMove(event) {                                                                                                       // Declare function scope logic
    if (!isRefineMode || !isDrawing) return;                                                                                            // Evaluate boolean condition check logic

    // Don't draw if Ctrl is pressed (for panning)
    if (event.ctrlKey) return;                                                                                                          // Evaluate boolean condition check logic

    event.preventDefault();                                                                                                             // Execute sequential statement instruction block

    const rect = canvas.getBoundingClientRect();                                                                                        // Initialize immutable variable state reference
    const x = (event.clientX - rect.left - panX) / zoomLevel;                                                                           // Initialize immutable variable state reference
    const y = (event.clientY - rect.top - panY) / zoomLevel;                                                                            // Initialize immutable variable state reference

    currentStroke.points.push({ x: x / canvas.width, y: y / canvas.height });                                                           // Execute sequential statement instruction block

    // Redraw with current stroke
    redrawCanvas();                                                                                                                     // Execute sequential statement instruction block
    if (currentStroke) {                                                                                                                // Evaluate boolean condition check logic
        drawBrushStroke(currentStroke, true);                                                                                           // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Handle brush drawing end
function handleBrushEnd(event) {                                                                                                        // Declare function scope logic
    if (!isRefineMode || !isDrawing) return;                                                                                            // Evaluate boolean condition check logic

    // Don't finalize stroke if Ctrl is pressed (for panning)
    if (event.ctrlKey) {                                                                                                                // Evaluate boolean condition check logic
        isDrawing = false;                                                                                                              // Assign variable property value reference
        currentStroke = null;                                                                                                           // Assign variable property value reference
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    event.preventDefault();                                                                                                             // Execute sequential statement instruction block
    isDrawing = false;                                                                                                                  // Assign variable property value reference

    if (currentStroke && currentStroke.points.length > 1) {                                                                             // Evaluate boolean condition check logic
        brushStrokes.push(currentStroke);                                                                                               // Execute sequential statement instruction block
        updateRefineButtons();                                                                                                          // Execute sequential statement instruction block
        showFloatingNotification(                                                                                                       // Execute sequential evaluation stream node
            currentBrushMode === 'add' ? (window.I18N.areaAdded || 'Area added.') : (window.I18N.areaRemoved || 'Area removed.'),       // Assign variable property value reference
            'success'                                                                                                                   // Execute sequential evaluation stream node
        );                                                                                                                              // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    currentStroke = null;                                                                                                               // Assign variable property value reference
    canvas.style.cursor = 'crosshair';                                                                                                  // Modify element visual style property
    redrawCanvas();                                                                                                                     // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// Draw brush stroke
function drawBrushStroke(stroke, isTemporary = false) {                                                                                 // Declare function scope logic
    const oldComposite = ctx.globalCompositeOperation;                                                                                  // Initialize immutable variable state reference
    const oldAlpha = ctx.globalAlpha;                                                                                                   // Initialize immutable variable state reference

    ctx.globalAlpha = isTemporary ? 0.8 : 0.6;                                                                                          // Execute sequential statement instruction block
    ctx.strokeStyle = stroke.mode === 'add' ? '#10b981' : '#ef4444';                                                                    // Execute sequential statement instruction block
    ctx.lineWidth = stroke.size * zoomLevel;                                                                                            // Execute sequential statement instruction block
    ctx.lineCap = 'round';                                                                                                              // Execute sequential statement instruction block
    ctx.lineJoin = 'round';                                                                                                             // Execute sequential statement instruction block

    if (stroke.points.length > 1) {                                                                                                     // Evaluate boolean condition check logic
        ctx.beginPath();                                                                                                                // Execute sequential statement instruction block
        const firstPoint = stroke.points[0];                                                                                            // Initialize immutable variable state reference
        const startX = (firstPoint.x * canvas.width * zoomLevel) + panX;                                                                // Initialize immutable variable state reference
        const startY = (firstPoint.y * canvas.height * zoomLevel) + panY;                                                               // Initialize immutable variable state reference
        ctx.moveTo(startX, startY);                                                                                                     // Execute sequential statement instruction block

        for (let i = 1; i < stroke.points.length; i++) {                                                                                // Iterate sequence stream loop control
            const point = stroke.points[i];                                                                                             // Initialize immutable variable state reference
            const x = (point.x * canvas.width * zoomLevel) + panX;                                                                      // Initialize immutable variable state reference
            const y = (point.y * canvas.height * zoomLevel) + panY;                                                                     // Initialize immutable variable state reference
            ctx.lineTo(x, y);                                                                                                           // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context

        ctx.stroke();                                                                                                                   // Execute sequential statement instruction block
    } else if (stroke.points.length === 1) {                                                                                            // Terminate block scope execution context
        // Draw a single point as a circle
        const point = stroke.points[0];                                                                                                 // Initialize immutable variable state reference
        const x = (point.x * canvas.width * zoomLevel) + panX;                                                                          // Initialize immutable variable state reference
        const y = (point.y * canvas.height * zoomLevel) + panY;                                                                         // Initialize immutable variable state reference

        ctx.beginPath();                                                                                                                // Execute sequential statement instruction block
        ctx.arc(x, y, stroke.size * zoomLevel / 2, 0, 2 * Math.PI);                                                                     // Execute sequential statement instruction block
        ctx.fillStyle = stroke.mode === 'add' ? '#10b981' : '#ef4444';                                                                  // Execute sequential statement instruction block
        ctx.fill();                                                                                                                     // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    ctx.globalCompositeOperation = oldComposite;                                                                                        // Execute sequential statement instruction block
    ctx.globalAlpha = oldAlpha;                                                                                                         // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// Apply refinements
async function applyRefinements() {                                                                                                     // Declare asynchronous execution wrapper context
    if (!currentFilename || brushStrokes.length === 0) {                                                                                // Evaluate boolean condition check logic
        showFloatingNotification(window.I18N.noRefinementsApply || 'No refinements to apply.', 'warning');                              // Execute sequential statement instruction block
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    const applyBtn = document.getElementById('applyRefineBtn');                                                                         // Initialize immutable variable state reference
    const originalContent = applyBtn.innerHTML;                                                                                         // Initialize immutable variable state reference
    applyBtn.disabled = true;                                                                                                           // Execute sequential statement instruction block
    applyBtn.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i>' + (window.I18N.applying || ' Applying...');                         // Execute sequential statement instruction block

    try {                                                                                                                               // Initialize safe execution try block
        const data = {                                                                                                                  // Initialize immutable variable state reference
            filename: currentFilename,                                                                                                  // Execute sequential evaluation stream node
            brush_strokes: brushStrokes,                                                                                                // Execute sequential evaluation stream node
            current_contour: tempRegion ? tempRegion.contour_points : [],                                                               // Execute sequential evaluation stream node
            tolerance: parseInt(document.getElementById('tolerance')?.value || 30)                                                      // Query document element node reference
        };                                                                                                                              // Terminate block scope execution context

        const response = await fetch(`${BASE_URL}/refine_with_brush`, {                                                                 // Initialize immutable variable state reference
            method: 'POST',                                                                                                             // Execute sequential evaluation stream node
            headers: {                                                                                                                  // Execute sequential evaluation stream node
                'Content-Type': 'application/json',                                                                                     // Execute sequential evaluation stream node
            },                                                                                                                          // Terminate block scope execution context
            body: JSON.stringify(data)                                                                                                  // Execute sequential evaluation stream node
        });                                                                                                                             // Terminate block scope execution context

        const result = await response.json();                                                                                           // Initialize immutable variable state reference

        if (result.success) {                                                                                                           // Evaluate boolean condition check logic
            // Update tempRegion with the refined result
            tempRegion.contour_points = result.contour_points;                                                                          // Execute sequential statement instruction block
            tempRegion.algorithm = 'Brush Refinement';                                                                                  // Execute sequential statement instruction block

            // Display the refined result
            displayTempRegion(tempRegion);                                                                                              // Execute sequential statement instruction block

            // Redraw canvas to show the updated contour immediately
            redrawCanvas();                                                                                                             // Execute sequential statement instruction block

            // Clear refinements after successful application
            brushStrokes = [];                                                                                                          // Assign variable property value reference
            updateRefineButtons();                                                                                                      // Execute sequential statement instruction block

            showFloatingNotification(window.I18N.refinementApplied || 'Refinement applied successfully.', 'success');                   // Execute sequential statement instruction block
        } else {                                                                                                                        // Terminate block scope execution context
            showFloatingNotification(`${window.I18N.errorApplying || 'Error applying refinement:'} ${result.error}`, 'error');          // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context

    } catch (error) {                                                                                                                   // Terminate block scope execution context
        console.error('Error applying refinements:', error);                                                                            // Emit diagnostic error stream payload
        showFloatingNotification(window.I18N.errorApplying || 'Error applying refinement.', 'error');                                   // Execute sequential statement instruction block
    } finally {                                                                                                                         // Terminate block scope execution context
        applyBtn.disabled = false;                                                                                                      // Execute sequential statement instruction block
        applyBtn.innerHTML = originalContent;                                                                                           // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Exit refine mode
function exitRefineMode() {                                                                                                             // Declare function scope logic
    resetRefineState();                                                                                                                 // Execute sequential statement instruction block
    toggleRefineMode();                                                                                                                 // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// Reset refine state
function resetRefineState() {                                                                                                           // Declare function scope logic
    brushStrokes = [];                                                                                                                  // Assign variable property value reference
    isDrawing = false;                                                                                                                  // Assign variable property value reference
    currentStroke = null;                                                                                                               // Assign variable property value reference
    currentBrushMode = 'add';                                                                                                           // Assign variable property value reference
    redrawCanvas();                                                                                                                     // Execute sequential statement instruction block
}                                                                                                                                       // Terminate block scope execution context

// Override the original handleCanvasClick to support refine mode
const originalHandleCanvasClick = handleCanvasClick;                                                                                    // Initialize immutable variable state reference
handleCanvasClick = function (event) {                                                                                                  // Assign variable property value reference
    // Check if refine mode handled the click
    if (handleRefineCanvasClick(event)) {                                                                                               // Evaluate boolean condition check logic
        return;                                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context

    // Otherwise, use original functionality
    originalHandleCanvasClick(event);                                                                                                   // Execute sequential statement instruction block
};                                                                                                                                      // Terminate block scope execution context

// Initialize refine event listeners
function initRefineEventListeners() {                                                                                                   // Declare function scope logic
    if (!canvas) return;                                                                                                                // Evaluate boolean condition check logic

    // Add brush event listeners for refine mode
    canvas.addEventListener('mousedown', function (event) {                                                                             // Bind event listener DOM state
        if (isRefineMode) {                                                                                                             // Evaluate boolean condition check logic
            handleBrushStart(event);                                                                                                    // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context

    canvas.addEventListener('mousemove', function (event) {                                                                             // Bind event listener DOM state
        if (isRefineMode) {                                                                                                             // Evaluate boolean condition check logic
            handleBrushMove(event);                                                                                                     // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context

    canvas.addEventListener('mouseup', function (event) {                                                                               // Bind event listener DOM state
        if (isRefineMode) {                                                                                                             // Evaluate boolean condition check logic
            handleBrushEnd(event);                                                                                                      // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context

    // Prevent context menu on right click in refine mode
    canvas.addEventListener('contextmenu', function (event) {                                                                           // Bind event listener DOM state
        if (isRefineMode) {                                                                                                             // Evaluate boolean condition check logic
            event.preventDefault();                                                                                                     // Execute sequential statement instruction block
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context

    // Add keyboard listeners for Shift key
    document.addEventListener('keydown', function (event) {                                                                             // Bind event listener DOM state
        if (isRefineMode && event.key === 'Shift') {                                                                                    // Evaluate boolean condition check logic
            canvas.style.cursor = 'not-allowed';                                                                                        // Modify element visual style property
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context

    document.addEventListener('keyup', function (event) {                                                                               // Bind event listener DOM state
        if (isRefineMode && event.key === 'Shift') {                                                                                    // Evaluate boolean condition check logic
            canvas.style.cursor = 'crosshair';                                                                                          // Modify element visual style property
        }                                                                                                                               // Terminate block scope execution context
    });                                                                                                                                 // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Override redrawCanvas to include refine elements
const originalRedrawCanvas = redrawCanvas;                                                                                              // Initialize immutable variable state reference
redrawCanvas = function () {                                                                                                            // Assign variable property value reference
    originalRedrawCanvas();                                                                                                             // Execute sequential statement instruction block

    if (isRefineMode) {                                                                                                                 // Evaluate boolean condition check logic
        drawRefineElements();                                                                                                           // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
};                                                                                                                                      // Terminate block scope execution context

// Draw refine elements (brush strokes)
function drawRefineElements() {                                                                                                         // Declare function scope logic
    // Draw all brush strokes
    brushStrokes.forEach(stroke => {                                                                                                    // Execute sequential evaluation stream node
        drawBrushStroke(stroke);                                                                                                        // Execute sequential statement instruction block
    });                                                                                                                                 // Terminate block scope execution context

    // Draw current stroke if drawing
    if (currentStroke) {                                                                                                                // Evaluate boolean condition check logic
        drawBrushStroke(currentStroke, true);                                                                                           // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
}                                                                                                                                       // Terminate block scope execution context

// Enable refine mode button when image is loaded
const originalLoadImage = loadImage;                                                                                                    // Initialize immutable variable state reference
loadImage = function (url) {                                                                                                            // Assign variable property value reference
    originalLoadImage(url);                                                                                                             // Execute sequential statement instruction block

    // Enable refine mode button
    const refineModeToggle = document.getElementById('refineModeToggle');                                                               // Initialize immutable variable state reference
    if (refineModeToggle) {                                                                                                             // Evaluate boolean condition check logic
        refineModeToggle.disabled = false;                                                                                              // Execute sequential statement instruction block
    }                                                                                                                                   // Terminate block scope execution context
};                                                                                                                                      // Terminate block scope execution context

// Update boundary reduction
function updateBoundaryReduction(value) {                                                                                               // Declare function scope logic
    document.getElementById('boundaryReductionValue').textContent = (value / 10).toFixed(1) + '%';                                      // Query document element node reference
    redrawCanvas();                                                                                                                     // Update canvas real-time when slider changes
}                                                                                                                                       // Terminate block scope execution context

// ===== CONTOUR SIMPLIFICATION (EQUIDISTANT SAMPLING) =====

/**
 * simplifyRegionContour
 * Simplifies a region contour using equidistant sampling.
 * 
 * Resamples the contour points to a target number of points by computing
 * the cumulative arc length and sampling at regular equidistant intervals.
 * 
 * Input:
 *     points               Array       The original array of contour points.
 *     targetPointsCount    number      The desired number of points after simplification.
 * 
 * Output:
 *     newPoints            Array       The simplified array of contour points.
 */
function simplifyRegionContour(points, targetPointsCount) {                                                                             // Define contour simplification function block
    if (targetPointsCount >= points.length || points.length <= 3) return points;                                                        // Early exit if target is larger or shape is basic

    let totalLength = 0;                                                                                                                // Initialize cumulative distance variable to zero
    const segmentLengths = [];                                                                                                          // Create array buffer for individual segment lengths
    for (let i = 0; i < points.length; i++) {                                                                                           // Iterate through each consecutive vertex pair
        const p1 = points[i];                                                                                                           // Assign first vertex of the geometric segment
        const p2 = points[(i + 1) % points.length];                                                                                     // Assign second vertex, wrapping back to origin
        const dx = p2.x - p1.x;                                                                                                         // Calculate horizontal delta vector component
        const dy = p2.y - p1.y;                                                                                                         // Calculate vertical delta vector component
        const len = Math.sqrt(dx * dx + dy * dy);                                                                                       // Calculate Euclidean geometric distance norm
        segmentLengths.push(len);                                                                                                       // Append computed segment length to array buffer
        totalLength += len;                                                                                                             // Accumulate continuous total path perimeter distance
    }                                                                                                                                   // End segment length calculation loop block

    if (totalLength === 0) return points;                                                                                               // Return original points if total length is zero

    const stepSize = totalLength / targetPointsCount;                                                                                   // Calculate target uniform resampling step length
    const newPoints = [];                                                                                                               // Initialize output array buffer for new coordinates

    let currentDist = 0;                                                                                                                // Initialize current distance tracker for sampling
    let nextTarget = 0;                                                                                                                 // Set initial target distance step boundary point

    for (let i = 0; i < points.length; i++) {                                                                                           // Iterate through original segments for mapping
        const p1 = points[i];                                                                                                           // Assign start coordinate for current geometry edge
        const p2 = points[(i + 1) % points.length];                                                                                     // Assign end coordinate for current geometry edge
        const segLen = segmentLengths[i];                                                                                               // Retrieve precalculated local edge distance value

        while (nextTarget <= currentDist + segLen && newPoints.length < targetPointsCount) {                                            // Process interpolation while target is in segment
            const t = segLen === 0 ? 0 : (nextTarget - currentDist) / segLen;                                                           // Calculate linear interpolation parameter coefficient
            newPoints.push({                                                                                                            // Push interpolated coordinate object into buffer
                x: p1.x + t * (p2.x - p1.x),                                                                                            // Compute interpolated X axis spatial coordinate
                y: p1.y + t * (p2.y - p1.y)                                                                                             // Compute interpolated Y axis spatial coordinate
            });                                                                                                                         // Close target point object constructor brackets
            nextTarget += stepSize;                                                                                                     // Advance target sampling distance by step offset
        }                                                                                                                               // End internal segment interpolation while loop
        currentDist += segLen;                                                                                                          // Advance current base distance tracker by length
    }                                                                                                                                   // End main geometric interpolation loop sequence

    return newPoints;                                                                                                                   // Return uniformly sampled simplified geometry path
}                                                                                                                                       // Terminate block scope execution context

function getNormalizeSetting() {                                                                                                        // Declare function scope logic
    const cb = document.getElementById('normalizeCoords');                                                                              // Initialize immutable variable state reference
    return cb ? cb.checked : true;                                                                                                      // Return execution stream payload data
}                                                                                                                                       // Terminate block scope execution context