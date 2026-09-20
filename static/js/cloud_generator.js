/*
CloudGenerator — Core functionality for CloudGenerator

Overview:
    This module provides comprehensive functionality for generating and visualizing point clouds
    from CSV coordinate data. It implements multiple point generation algorithms with real-time
    visualization, statistical analysis, and export capabilities.

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

let currentFilename = null;                                                                                                            // Initialize mutable variable state reference

                                                                                                                                       // Global variables for optimized drag and drop
let uploadZone = null;                                                                                                                 // Initialize mutable variable state reference
let fileInput = null;                                                                                                                  // Initialize mutable variable state reference
let uploadContent = null;                                                                                                              // Initialize mutable variable state reference
let uploadIcon = null;                                                                                                                 // Initialize mutable variable state reference
let uploadTitle = null;                                                                                                                // Initialize mutable variable state reference
let uploadSubtitle = null;                                                                                                             // Initialize mutable variable state reference
let dragCounter = 0;

                                                                                                                                       // Initialize I18N from HTML data
window.I18N = window.I18N || {};
document.addEventListener('DOMContentLoaded', () => {
    const i18nDataElement = document.getElementById('i18n-data');
    if (i18nDataElement) {
        try {
            window.I18N = JSON.parse(i18nDataElement.textContent);
        } catch (e) {
            console.error('Error parsing I18N data:', e);
        }
    }
});
                                                                                                                                       // Initialize mutable variable state reference

                                                                                                                                       // Supported file formats
const SUPPORTED_FORMATS = {                                                                                                            // Initialize immutable variable state reference
    'text/csv': 'CSV',                                                                                                                 // Execute sequential evaluation stream node
    'application/vnd.ms-excel': 'CSV'                                                                                                  // Execute sequential evaluation stream node
};                                                                                                                                     // Terminate block scope execution context

                                                                                                                                       // Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;                                                                                                // Initialize immutable variable state reference

/*
 Configure Enhanced Drag and Drop CSV Upload System
 
 Sets up a comprehensive drag-and-drop interface specifically for CSV file uploads
 with visual feedback, progress tracking, and error handling. Configures all DOM
 elements and event listeners required for the CSV file upload workflow.
 
 Features Configured:
 - CSV-specific drag and drop zone with visual feedback
 - File input integration with click-to-browse functionality
 - Progress indicators with real-time upload status
 - Error handling with detailed CSV validation messages
 - File format validation for CSV files only
 - Clear/reset functionality for uploaded files
 
 DOM Elements Initialized:
 - Upload zone container with CSV-specific drag event handlers
 - CSV file input element with change event listener
 - Progress display elements for upload feedback
 - Icon and text elements for dynamic content updates
 - Clear button for resetting the upload state
 
 Event Handlers Registered:
 - dragenter: Visual feedback when CSV file enters drop zone
 - dragover: Continuous feedback during CSV file hover
 - dragleave: Reset visual state when CSV file leaves zone
 - drop: Process dropped CSV files and initiate upload
 - change: Handle CSV files selected via file browser
 - click: Trigger file browser when upload zone is clicked
 
 Error Handling:
 - Validates presence of required DOM elements
 - Logs errors for missing elements to console
 - Graceful degradation if elements are not found
 - Prevents event registration on missing elements
 
 @function setupDragAndDrop
 @since 2025-05-01
 @lastModified 2026-01-21
 @see {@link handleDragEnter} CSV drag enter event handler
 @see {@link handleDragOver} CSV drag over event handler
 @see {@link handleDragLeave} CSV drag leave event handler
 @see {@link handleDrop} CSV file drop event handler
 @see {@link handleFileSelect} CSV file selection handler
 
 // Supported file formats: CSV only
 // Maximum file size: 10MB
 // Required DOM elements: uploadZone, csvFileInput, uploadContent, etc.
 */
function setupDragAndDrop() {                                                                                                          // Declare function scope logic
                                                                                                                                       // Get DOM elements
    uploadZone = document.getElementById('uploadZone');                                                                                // Query document element node reference
    fileInput = document.getElementById('csvFileInput');                                                                               // Query document element node reference
    uploadContent = document.getElementById('uploadContent');                                                                          // Query document element node reference
    uploadIcon = document.getElementById('uploadIcon');                                                                                // Query document element node reference
    uploadTitle = document.getElementById('uploadTitle');                                                                              // Query document element node reference
    uploadSubtitle = document.getElementById('uploadSubtitle');                                                                        // Query document element node reference

    if (!uploadZone || !fileInput) {                                                                                                   // Evaluate boolean condition check logic
        console.error('Upload elements not found');                                                                                    // Emit diagnostic error stream payload
        return;                                                                                                                        // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

                                                                                                                                       // Event listeners for drag and drop
    uploadZone.addEventListener('dragenter', handleDragEnter);                                                                         // Bind event listener DOM state
    uploadZone.addEventListener('dragover', handleDragOver);                                                                           // Bind event listener DOM state
    uploadZone.addEventListener('dragleave', handleDragLeave);                                                                         // Bind event listener DOM state
    uploadZone.addEventListener('drop', handleDrop);                                                                                   // Bind event listener DOM state

                                                                                                                                       // Event listener for click on upload zone
    uploadZone.addEventListener('click', () => {                                                                                       // Bind event listener DOM state
        if (!uploadZone.classList.contains('uploading')) {                                                                             // Evaluate boolean condition check logic
            fileInput.click();                                                                                                         // Execute sequential statement instruction block
        }                                                                                                                              // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context

                                                                                                                                       // Event listener for file selection
    fileInput.addEventListener('change', handleFileSelect);                                                                            // Bind event listener DOM state

                                                                                                                                       // Prevent default behavior on entire page
    document.addEventListener('dragover', (e) => e.preventDefault());                                                                  // Bind event listener DOM state
    document.addEventListener('drop', (e) => e.preventDefault());                                                                      // Bind event listener DOM state
}                                                                                                                                      // Terminate block scope execution context

/*
 Handle CSV File Drag Enter Event
 
 Manages the visual feedback when a CSV file is dragged into the upload zone.
 Uses a counter system to handle nested drag events and prevents flickering
 when dragging over child elements within the upload zone.
 
 @function handleDragEnter
 @param {DragEvent} e - The drag enter event object
 @since 2025-05-01
 @lastModified 2026-01-21
 @see {@link updateUploadContent} Updates visual state of upload zone
 @see {@link setupDragAndDrop} Event registration function
 
 */
function handleDragEnter(e) {                                                                                                          // Declare function scope logic
    e.preventDefault();                                                                                                                // Execute sequential statement instruction block
    dragCounter++;                                                                                                                     // Execute sequential statement instruction block

    if (dragCounter === 1) {                                                                                                           // Evaluate boolean condition check logic
        uploadZone.classList.add('drag-over');                                                                                         // Modify element class list collection
        updateUploadContent('drag-over');                                                                                              // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

/*
 Handle CSV File Drag Over Event
 
 Maintains the drag state while a CSV file is being dragged over the upload zone.
 Sets the drop effect to 'copy' to provide visual feedback to the user about
 the intended action when the file is dropped.
 
 @function handleDragOver
 @param {DragEvent} e - The drag over event object
 @since 2025-05-01
 @lastModified 2026-01-21
 @see {@link handleDragEnter} Initial drag enter handler
 @see {@link handleDrop} Final drop handler
 
 */
function handleDragOver(e) {                                                                                                           // Declare function scope logic
    e.preventDefault();                                                                                                                // Execute sequential statement instruction block
    e.dataTransfer.dropEffect = 'copy';                                                                                                // Execute sequential statement instruction block
}                                                                                                                                      // Terminate block scope execution context

/*
 Handle CSV File Drag Leave Event
 
 Manages the visual feedback when a CSV file is dragged out of the upload zone.
 Uses a counter system to properly handle nested elements and only resets
 the visual state when the file completely leaves the upload area.
 
 @function handleDragLeave
 @param {DragEvent} e - The drag leave event object
 @since 2025-05-01
 @lastModified 2026-01-21
 @see {@link updateUploadContent} Resets visual state of upload zone
 @see {@link handleDragEnter} Corresponding drag enter handler
 
 */
function handleDragLeave(e) {                                                                                                          // Declare function scope logic
    e.preventDefault();                                                                                                                // Execute sequential statement instruction block
    dragCounter--;                                                                                                                     // Execute sequential statement instruction block

    if (dragCounter === 0) {                                                                                                           // Evaluate boolean condition check logic
        uploadZone.classList.remove('drag-over');                                                                                      // Modify element class list collection
        updateUploadContent('default');                                                                                                // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

/*
 Handle CSV File Drop Event
 
 Processes CSV files dropped onto the upload zone. Resets the drag state,
 extracts the first file from the drop event, and initiates file processing
 with validation and upload procedures.
 
 @function handleDrop
 @param {DragEvent} e - The drop event object containing file data
 @since 2025-05-01
 @lastModified 2026-01-21
 @see {@link processFile} Validates and processes the dropped CSV file
 @see {@link updateUploadContent} Resets visual state after drop
 
 */
function handleDrop(e) {                                                                                                               // Declare function scope logic
    e.preventDefault();                                                                                                                // Execute sequential statement instruction block
    dragCounter = 0;                                                                                                                   // Assign variable property value reference
    uploadZone.classList.remove('drag-over');                                                                                          // Modify element class list collection

    const files = e.dataTransfer.files;                                                                                                // Initialize immutable variable state reference
    if (files.length > 0) {                                                                                                            // Evaluate boolean condition check logic
        processFile(files[0]);                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

/*
 Handle CSV File Selection via File Browser
 
 Processes CSV files selected through the traditional file input browser dialog.
 Extracts the first selected file and initiates the same processing workflow
 as drag-and-drop files for consistent handling.
 
 @function handleFileSelect
 @param {Event} e - The file input change event object
 @since 2025-05-01
 @lastModified 2026-01-21
 @see {@link processFile} Validates and processes the selected CSV file
 @see {@link setupDragAndDrop} Event registration function
 
 */
function handleFileSelect(e) {                                                                                                         // Declare function scope logic
    const files = e.target.files;                                                                                                      // Initialize immutable variable state reference
    if (files.length > 0) {                                                                                                            // Evaluate boolean condition check logic
        processFile(files[0]);                                                                                                         // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

/*
 Process and Validate Selected CSV File
 
 Comprehensive CSV file processing function that validates file type, size,
 and initiates the upload workflow. Performs client-side validation before
 sending the file to the server for cloud of points generation processing.
 
 Validation Checks:
 - File extension validation (must be .csv)
 - File size validation (maximum 10MB)
 - File format validation for CSV structure
 - Error handling with user-friendly messages
 
 Workflow Process:
 1. Validates file extension (.csv required)
 2. Checks file size against maximum limit
 3. Displays upload progress interface
 4. Initiates simulated upload progress
 5. Triggers server upload and processing
 
 @function processFile
 @param {File} file - The CSV file object to process and validate
 @since 2025-05-01
 @lastModified 2026-01-21
 @see {@link showUploadError} Displays validation error messages
 @see {@link showUploadProgress} Shows upload progress interface
 @see {@link simulateUploadProgress} Manages upload progress simulation
 @see {@link formatFileSize} Formats file size for error messages
 
 */
function processFile(file) {                                                                                                           // Declare function scope logic
                                                                                                                                       // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
        showLocalUploadError(window.I18N.uploadError || 'Upload Error', window.I18N.invalidFileType || 'Invalid file type. Please select a CSV file.');
        return;
    }

                                                                                                                                       // Validate file size
    if (file.size > MAX_FILE_SIZE) {
        showLocalUploadError(window.I18N.fileTooLargeTitle || 'File too large', 
            (window.I18N.fileTooLarge || 'File must be smaller than {size}.').replace('{size}', Utils.formatFileSize(MAX_FILE_SIZE)));
        return;
    }                                                                                                                                  // Terminate block scope execution context

                                                                                                                                       // Show progress and simulate loading
    showUploadProgress(file);                                                                                                          // Execute sequential statement instruction block
    simulateUploadProgress(file);                                                                                                      // Execute sequential statement instruction block
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Simulate loading progress and auto-upload
/*
 Simulates CSV file upload progress with visual feedback and automatic processing.
 Creates a realistic progress animation that gradually increases from 0 to 100%,
 then automatically triggers the CSV upload and processing workflow.
 
 @function simulateUploadProgress
 @param {File} file - The CSV file object to be uploaded and processed
 @since 2025-05-01
 @lastModified 2026-01-21
 @author Gerardo Tinoco-Guerrero
 
 @description
 This function provides a smooth user experience by:
 - Animating progress from 0% to 100% with random increments
 - Updating the progress display in real-time
 - Automatically triggering CSV upload upon completion
 - Showing success notification and file information
 - Assigning the file to the input element for compatibility
 
 */
function simulateUploadProgress(file) {
    Utils.simulateUploadProgress(file, (f) => {
        showUploadSuccess(f);
                                                                                                                                       // Assign file to input for compatibility
        const dt = new DataTransfer();
        dt.items.add(f);
        fileInput.files = dt.files;

                                                                                                                                       // Auto-upload the file immediately
        setTimeout(() => {
            uploadCSV();
        }, 1000);
    });
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Update upload content based on state
function updateUploadContent(state) {                                                                                                  // Declare function scope logic
    if (!uploadTitle || !uploadSubtitle) return;                                                                                       // Evaluate boolean condition check logic

    switch (state) {                                                                                                                   // Evaluate switch condition check flow
        case 'drag-over':                                                                                                              // Define switch case branch logic
            uploadTitle.textContent = window.I18N.dropFileHere || 'Drop your CSV file here!';
            uploadSubtitle.textContent = window.I18N.processImmediately || 'We will process your file immediately';
            break;                                                                                                                     // Terminate current loop block context
        case 'default':                                                                                                                // Define switch case branch logic
        default:                                                                                                                       // Execute sequential evaluation stream node
            uploadTitle.textContent = window.I18N.dropCsvHere || 'Drop your CSV file here';
            uploadSubtitle.textContent = window.I18N.clickToBrowse || 'or click to browse files';                                      // Execute sequential statement instruction block
            break;                                                                                                                     // Terminate current loop block context
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Show upload progress
function showUploadProgress(file) {
    uploadZone.classList.add('uploading');
    uploadZone.classList.remove('success', 'error');
    
    document.getElementById('uploadContent').classList.add('hidden');
    document.getElementById('uploadSuccess').classList.add('hidden');
    document.getElementById('uploadError').classList.add('hidden');
    
    const progressDiv = document.getElementById('uploadProgress');
    progressDiv.classList.remove('hidden');
    progressDiv.classList.add('flex');
    
    document.getElementById('progressText').textContent = '0%';
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Terminate block scope execution context

                                                                                                                                       // Show upload success
function showUploadSuccess(file) {
    uploadZone.classList.remove('uploading');
    uploadZone.classList.add('success');

    const contentEl = document.getElementById('uploadContent');
    if (contentEl) contentEl.classList.add('hidden');
    
    const progressEl = document.getElementById('uploadProgress');
    if (progressEl) {
        progressEl.classList.remove('flex');
        progressEl.classList.add('hidden');
    }
    
    const errorEl = document.getElementById('uploadError');
    if (errorEl) errorEl.classList.add('hidden');
    
    const successDiv = document.getElementById('uploadSuccess');
    if (successDiv) {
        successDiv.classList.remove('hidden');
        successDiv.classList.add('flex');
    }
    
    const fileNameEl = document.getElementById('uploadedFileName');
    if (fileNameEl) {
        fileNameEl.textContent = file.name;
    }
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Reset upload
function resetUpload() {
    uploadZone.classList.remove('uploading', 'success', 'error', 'drag-over');

    document.getElementById('uploadProgress').classList.remove('flex');
    document.getElementById('uploadProgress').classList.add('hidden');
    document.getElementById('uploadSuccess').classList.remove('flex');
    document.getElementById('uploadSuccess').classList.add('hidden');
    document.getElementById('uploadError').classList.remove('flex');
    document.getElementById('uploadError').classList.add('hidden');
    
    document.getElementById('uploadContent').classList.remove('hidden');
    
    updateUploadContent('default');

                                                                                                                                       // Clear file input
    if (fileInput) {                                                                                                                   // Evaluate boolean condition check logic
        fileInput.value = '';                                                                                                          // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

                                                                                                                                       // Clear button is now in file info section, no need to hide it here

    dragCounter = 0;                                                                                                                   // Assign variable property value reference
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Clear upload
function clearUpload() {
    resetUpload();

    const uploadContainer = document.getElementById('uploadSectionContainer');
    if (uploadContainer) {
        uploadContainer.classList.remove('hidden');
        uploadContainer.style.display = '';                                                                                            // Reset display style if set anywhere
    }

    const cloudSection = document.getElementById('cloudSection');
    if (cloudSection) {
        cloudSection.classList.add('hidden');
        cloudSection.classList.remove('animate-[fade-in-up_1s_ease-out_forwards]');
    }

    const configPanel = document.getElementById('configPanel');
    if (configPanel) {
        configPanel.classList.add('opacity-50', 'pointer-events-none');
    }

    const genPanel = document.getElementById('generationPanel');
    if (genPanel) {
        genPanel.classList.add('opacity-50', 'pointer-events-none');
    }

    const genBtn = document.getElementById('generateBtn');
    if (genBtn) {
        genBtn.disabled = true;
    }
    
                                                                                                                                       // Hide download buttons if they were visible
    const outputLinks = document.getElementById('outputLinks');
    if (outputLinks) {
        outputLinks.classList.add('hidden');
    }

                                                                                                                                       // Clear current filename
    currentFilename = null;
}                                                                                                                                      // Terminate block scope execution context



/*
 Uploads a CSV file to the server for processing and visualization.
 Validates the file format, sends it to the server endpoint, and handles
 the response to update the UI accordingly with success or error states.
 
 @function uploadCSV
 @since 2025-05-01
 @lastModified 2026-01-21
 @author Gerardo Tinoco-Guerrero
 
 @description
 This function:
 - Validates that a file is selected and has .csv extension
 - Creates FormData and sends file to /upload_csv endpoint
 - Updates upload zone visual states (uploading, success, error)
 - Displays file information and options on successful upload
 - Shows appropriate alerts and error messages
 - Sets the global currentFilename variable for further processing
 
 */
function uploadCSV() {                                                                                                                 // Declare function scope logic
    const fileInput = document.getElementById('csvFileInput');                                                                         // Initialize immutable variable state reference
    const file = fileInput.files[0];                                                                                                   // Initialize immutable variable state reference

    if (!file) {                                                                                                                       // Evaluate boolean condition check logic
        showAlert(window.I18N.pleaseSelectFile || 'Please select a CSV file', 'error');                                                // Execute sequential statement instruction block
        return;                                                                                                                        // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

    if (!file.name.toLowerCase().endsWith('.csv')) {                                                                                   // Evaluate boolean condition check logic
        showAlert(window.I18N.invalidFileType || 'Please select a valid CSV file', 'error');                                           // Execute sequential statement instruction block
        return;                                                                                                                        // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

    const formData = new FormData();                                                                                                   // Initialize immutable variable state reference
    formData.append('file', file);                                                                                                     // Execute sequential statement instruction block

                                                                                                                                       // Show uploading state in upload zone
    if (uploadZone) {                                                                                                                  // Evaluate boolean condition check logic
        uploadZone.classList.add('uploading');                                                                                         // Modify element class list collection
        updateUploadContent('uploading');                                                                                              // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

    fetch(`${BASE_URL}/upload_csv`, {                                                                                                  // Dispatch asynchronous network payload stream
        method: 'POST',                                                                                                                // Execute sequential evaluation stream node
        body: formData                                                                                                                 // Execute sequential evaluation stream node
    })                                                                                                                                 // Terminate block scope execution context
        .then(response => response.json())                                                                                             // Chain asynchronous promise resolution sequence
        .then(data => {                                                                                                                // Chain asynchronous promise resolution sequence
            if (data.success) {                                                                                                        // Evaluate boolean condition check logic
                currentFilename = data.filename;                                                                                       // Assign variable property value reference
                displayFileInfo(data);                                                                                                 // Execute sequential statement instruction block
                showFileOptions();                                                                                                     // Execute sequential statement instruction block
                showAlert(window.I18N.csvUploadedSuccessfully || 'CSV file loaded successfully', 'success');

                                                                                                                                       // Update upload zone to success state
                if (uploadZone) {                                                                                                      // Evaluate boolean condition check logic
                    uploadZone.classList.remove('uploading');                                                                          // Modify element class list collection
                    uploadZone.classList.add('success');                                                                               // Modify element class list collection
                    updateUploadContent('success');                                                                                    // Execute sequential statement instruction block
                }                                                                                                                      // Terminate block scope execution context
            } else {                                                                                                                   // Terminate block scope execution context
                showAlert(data.error, 'error');                                                                                        // Execute sequential statement instruction block
                showLocalUploadError('Upload Error', data.error);                                                                      // Execute sequential statement instruction block
            }                                                                                                                          // Terminate block scope execution context
        })                                                                                                                             // Terminate block scope execution context
        .catch(error => {                                                                                                              // Catch asynchronous promise exception payload
            showAlert((window.I18N.errorUploadingFile || 'Error uploading file: ') + error.message, 'error');                          // Execute sequential statement instruction block
            showLocalUploadError('Upload Error', 'Error uploading file: ' + error.message);                                            // Execute sequential statement instruction block
        });                                                                                                                            // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Display file information
function displayFileInfo(data) {                                                                                                       // Declare function scope logic
    const totalPointsEl = document.getElementById('totalPoints');                                                                      // Initialize immutable variable state reference
    const totalRegionsEl = document.getElementById('totalRegions');                                                                    // Initialize immutable variable state reference

    if (totalPointsEl) {                                                                                                               // Evaluate boolean condition check logic
        totalPointsEl.textContent = data.total_points;                                                                                 // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

    if (totalRegionsEl) {                                                                                                              // Evaluate boolean condition check logic
        totalRegionsEl.textContent = data.regions;                                                                                     // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

                                                                                                                                       // Create CSV graphical visualization
    fetch(data.url)                                                                                                                    // Dispatch asynchronous network payload stream
        .then(response => {                                                                                                            // Chain asynchronous promise resolution sequence
            if (!response.ok) {                                                                                                        // Evaluate boolean condition check logic
                throw new Error(`HTTP error! status: ${response.status}`);                                                             // Execute sequential statement instruction block
            }                                                                                                                          // Terminate block scope execution context
            return response.text();                                                                                                    // Return execution stream payload data
        })                                                                                                                             // Terminate block scope execution context
        .then(csvText => {                                                                                                             // Chain asynchronous promise resolution sequence
            createCSVVisualization(csvText, data.region_list);                                                                         // Execute sequential statement instruction block
        })                                                                                                                             // Terminate block scope execution context
        .catch(error => {                                                                                                              // Catch asynchronous promise exception payload
            console.error('Could not load CSV file for visualization:', error);                                                        // Emit diagnostic error stream payload
            console.error('Attempted URL:', data.url);                                                                                 // Emit diagnostic error stream payload
        });                                                                                                                            // Terminate block scope execution context

                                                                                                                                       // State transitions are now handled centrally in showFileOptions
                                                                                                                                       // fileInfoSection is already visible inside cloudSection                                                              // Query document element node reference
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Create CSV visualization
/*
 createCSVVisualization
 Parses CSV data and renders a scatter plot visualization.
 
 Reads coordinate and region data line-by-line from a CSV string,
 groups points by region, and configures a Chart.js dataset for rendering.
 
 Input:
     csvText      string          The raw CSV text content to be parsed.
     regionList   HTMLElement     DOM element to render the region list (optional).
 
 Output:
     None
 */
function createCSVVisualization(csvText, regionList) {                                                                                 // Define CSV parsing and charting function
    const lines = csvText.trim().split('\n');                                                                                          // Split text document into array of row strings
    const datasets = {};                                                                                                               // Initialize hash map for region group mapping

    const colors = [                                                                                                                   // Initialize predefined categorical palette list
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',                                                                                    // Define standard red blue yellow cyan values
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',                                                                                    // Define standard purple orange gray base colors
        '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56'                                                                                     // Define fallback looped repeating color indices
    ];                                                                                                                                 // Close global color configuration mapping array

    lines.forEach((line, index) => {                                                                                                   // Loop over string rows with enumeration map
        if (line.trim() === '' || index === 0) return;                                                                                 // Skip empty rows and the header column titles

        const parts = line.split(',');                                                                                                 // Segment string row by comma separator token
        if (parts.length >= 3) {                                                                                                       // Confirm minimum required geometry parameters
            const x = parseFloat(parts[0]);                                                                                            // Extract X Cartesian position float mapping
            const y = parseFloat(parts[1]);                                                                                            // Extract Y Cartesian position float mapping
            const region = parts[2].trim();                                                                                            // Extract region string label identifier ID

            if (!isNaN(x) && !isNaN(y)) {                                                                                              // Validate both coordinates as valid numbers
                if (!datasets[region]) {                                                                                               // Check if region group exists in mapping
                    const colorIndex = Object.keys(datasets).length % colors.length;                                                   // Calculate modular palette selection index
                    datasets[region] = {                                                                                               // Initialize new chart dataset property object
                        label: `Region ${Math.floor(parseFloat(region))}`,                                                             // Set human readable region numerical label
                        data: [],                                                                                                      // Initialize empty array for coordinate mapping
                        backgroundColor: colors[colorIndex],                                                                           // Assign categorical marker dot fill color
                        borderColor: colors[colorIndex],                                                                               // Assign categorical marker dot border color
                        pointRadius: 1,                                                                                                // Set base visualization node circle radius
                        pointHoverRadius: 2,                                                                                           // Set base visualization hover interaction size
                        pointStyle: 'circle',                                                                                          // Specify standard circle renderer representation
                        borderWidth: 0                                                                                                 // Disable edge borders for cleaner scatter plot
                    };                                                                                                                 // End region dataset definition configuration
                }                                                                                                                      // End region check logical conditional block
                datasets[region].data.push({ x: x, y: y });                                                                            // Push Cartesian vector into group collection
            } else {                                                                                                                   // Fallback for parsing geometry failure state
                console.log(`Line ${index}: invalid values - x: ${x}, y: ${y}`);                                                       // Log invalid parsed node coordinate values
            }                                                                                                                          // End parsing number validation conditional
        } else {                                                                                                                       // Fallback for missing geometry token strings
            console.log(`Line ${index}: incorrect format - ${parts.length} columns`);                                                  // Log missing required column dimension map
        }                                                                                                                              // End string length validation conditional block
    });                                                                                                                                // End line array processing mapping loop iteration

    const canvasElement = document.getElementById('previewChart');                                                                     // Obtain DOM reference to graphics context layer

    if (!canvasElement) {                                                                                                              // Check if rendering target exists in DOM tree
        console.error('Canvas element previewChart not found');                                                                        // Log fatal failure for graphics initialization
        return;                                                                                                                        // Terminate early due to missing visual element
    }                                                                                                                                  // End DOM validation safety check block logic

    const ctx = canvasElement.getContext('2d');                                                                                        // Request 2D graphics rendering hardware context

                                                                                                                                       // Destroy previous chart if it exists
    if (window.csvChart && typeof window.csvChart.destroy === 'function') {                                                            // Evaluate boolean condition check logic
        window.csvChart.destroy();                                                                                                     // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

    const datasetsArray = Object.values(datasets);                                                                                     // Initialize immutable variable state reference

    if (datasetsArray.length === 0) {                                                                                                  // Evaluate boolean condition check logic
        console.warn('No data to display in chart');                                                                                   // Execute sequential statement instruction block
        canvasElement.style.display = 'none';                                                                                          // Modify element visual style property
        return;                                                                                                                        // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

                                                                                                                                       // Calculate ranges to maintain aspect ratio
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;                                                          // Initialize mutable variable state reference
    datasetsArray.forEach(dataset => {                                                                                                 // Execute sequential evaluation stream node
        dataset.data.forEach(point => {                                                                                                // Execute sequential evaluation stream node
            minX = Math.min(minX, point.x);                                                                                            // Assign variable property value reference
            maxX = Math.max(maxX, point.x);                                                                                            // Assign variable property value reference
            minY = Math.min(minY, point.y);                                                                                            // Assign variable property value reference
            maxY = Math.max(maxY, point.y);                                                                                            // Assign variable property value reference
        });                                                                                                                            // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context

                                                                                                                                       // Set fixed scale limits from 0 to 1
    const scaleMin = 0;                                                                                                                // Initialize immutable variable state reference
    const scaleMax = 1;                                                                                                                // Initialize immutable variable state reference

    canvasElement.style.display = 'block';                                                                                             // Modify element visual style property

    try {                                                                                                                              // Initialize safe execution try block
                                                                                                                                       // Check if Chart.js is available
        if (typeof Chart === 'undefined') {                                                                                            // Evaluate boolean condition check logic
            throw new Error('Chart.js is not available');                                                                              // Execute sequential statement instruction block
        }                                                                                                                              // Terminate block scope execution context

        window.csvChart = new Chart(ctx, {                                                                                             // Execute sequential evaluation stream node
            type: 'scatter',                                                                                                           // Execute sequential evaluation stream node
            data: {                                                                                                                    // Execute sequential evaluation stream node
                datasets: datasetsArray                                                                                                // Execute sequential evaluation stream node
            },                                                                                                                         // Terminate block scope execution context
            options: {                                                                                                                 // Execute sequential evaluation stream node
                responsive: true,                                                                                                      // Execute sequential evaluation stream node
                maintainAspectRatio: true,                                                                                             // Execute sequential evaluation stream node
                aspectRatio: 1,                                                                                                        // Execute sequential evaluation stream node
                plugins: {                                                                                                             // Execute sequential evaluation stream node
                    title: {                                                                                                           // Execute sequential evaluation stream node
                        display: false,                                                                                                // Execute sequential evaluation stream node
                        text: 'Loaded Nodes'                                                                                           // Execute sequential evaluation stream node
                    },                                                                                                                 // Terminate block scope execution context
                    legend: {                                                                                                          // Execute sequential evaluation stream node
                        display: true,                                                                                                 // Execute sequential evaluation stream node
                        position: 'top'                                                                                                // Execute sequential evaluation stream node
                    }                                                                                                                  // Terminate block scope execution context
                },                                                                                                                     // Terminate block scope execution context
                scales: {                                                                                                              // Execute sequential evaluation stream node
                    x: {                                                                                                               // Execute sequential evaluation stream node
                        type: 'linear',                                                                                                // Execute sequential evaluation stream node
                        position: 'bottom',                                                                                            // Execute sequential evaluation stream node
                        min: 0,                                                                                                        // Execute sequential evaluation stream node
                        max: 1,                                                                                                        // Execute sequential evaluation stream node
                        title: {                                                                                                       // Execute sequential evaluation stream node
                            display: false,                                                                                            // Execute sequential evaluation stream node
                            text: 'X Coordinate'                                                                                       // Execute sequential evaluation stream node
                        }                                                                                                              // Terminate block scope execution context
                    },                                                                                                                 // Terminate block scope execution context
                    y: {                                                                                                               // Execute sequential evaluation stream node
                        min: 0,                                                                                                        // Execute sequential evaluation stream node
                        max: 1,                                                                                                        // Execute sequential evaluation stream node
                        title: {                                                                                                       // Execute sequential evaluation stream node
                            display: false,                                                                                            // Execute sequential evaluation stream node
                            text: 'Y Coordinate'                                                                                       // Execute sequential evaluation stream node
                        }                                                                                                              // Terminate block scope execution context
                    }                                                                                                                  // Terminate block scope execution context
                },                                                                                                                     // Terminate block scope execution context
                interaction: {                                                                                                         // Execute sequential evaluation stream node
                    intersect: false,                                                                                                  // Execute sequential evaluation stream node
                    mode: 'point'                                                                                                      // Execute sequential evaluation stream node
                }                                                                                                                      // Terminate block scope execution context
            }                                                                                                                          // Terminate block scope execution context
        });                                                                                                                            // Terminate block scope execution context

                                                                                                                                       // Hide fallback if chart was created correctly
        const fallback = document.getElementById('chartFallback');
        if (fallback) fallback.style.display = 'none';                                                                                 // Query document element node reference

    } catch (error) {                                                                                                                  // Catch asynchronous promise exception payload
        console.error('Error creating chart:', error);                                                                                 // Emit diagnostic error stream payload
        canvasElement.style.display = 'none';                                                                                          // Modify element visual style property

        const fallback = document.getElementById('chartFallback');
        if (fallback) fallback.style.display = 'block';                                                                                // Query document element node referencent node reference
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Show generation options
function showFileOptions() {
    const uploadContainer = document.getElementById('uploadSectionContainer');
    if (uploadContainer) {
        uploadContainer.classList.add('hidden');
    }

    const cloudSection = document.getElementById('cloudSection');
    if (cloudSection) {
        cloudSection.classList.remove('hidden');
                                                                                                                                       // Trigger fade-in animation
        cloudSection.classList.add('animate-[fade-in-up_1s_ease-out_forwards]');
    }

    const configPanel = document.getElementById('configPanel');
    if (configPanel) {
        configPanel.classList.remove('opacity-50', 'pointer-events-none');
    }

    const genPanel = document.getElementById('generationPanel');
    if (genPanel) {
        genPanel.classList.remove('opacity-50', 'pointer-events-none');
    }

    const genBtn = document.getElementById('generateBtn');
    if (genBtn) {
        genBtn.disabled = false;
    }
}                                                                                                                                      // Terminate block scope execution context

/*
 Generate Cloud of Points from Uploaded CSV Data
 
 Main function that orchestrates the cloud generation process using the
 uploaded CSV data and user-selected parameters. Supports multiple generation
 algorithms and provides real-time progress feedback during processing.
 
 Generation Methods:
 - Regular Distribution: Uniform point distribution algorithm
 - Natural Distribution: Organic, natural-looking point distribution
 
 Configuration Options:
 - Region filtering (inside/outside regions)
 - Point reduction with configurable multiplier
 - Generation method selection (regular/natural)
 - Progress tracking with visual feedback
 
 Workflow Process:
 1. Validates uploaded CSV file availability
 2. Extracts user configuration from form inputs
 3. Initializes progress tracking and UI updates
 4. Determines appropriate API endpoint based on method
 5. Sends POST request with configuration parameters
 6. Handles server response and displays results
 7. Manages error states and user feedback
 8. Restores UI state after completion
 
 API Endpoints:
 - /generate_cloud: Regular distribution algorithm
 - /generate_cloud_natural: Natural distribution algorithm
 
 @function generateCloud
 @since 2025-05-01
 @lastModified 2026-01-21
 @see {@link updateProgress} Progress tracking and visual feedback
 @see {@link displayResults} Results visualization and statistics
 @see {@link showAlert} Error message display
 @see {@link hideProgress} Progress section management
 
 @throws {Error} Shows alert if no CSV file is uploaded
 @throws {Error} Shows alert if server request fails
 @throws {Error} Shows alert if generation process encounters errors
 */
function generateCloud() {                                                                                                             // Declare function scope logic
    if (!currentFilename) {                                                                                                            // Evaluate boolean condition check logic
        showAlert(window.I18N.pleaseSelectFile || 'You must first upload a CSV file', 'error');
        return;                                                                                                                        // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

    const regionesInside = document.getElementById('regionesInsideOption').checked;
    
                                                                                                                                       // Read generation method from radio buttons
    const methodRadio = document.querySelector('input[name="generationMethodOption"]:checked');
    const generationMethod = methodRadio ? methodRadio.value : 'regular';
    
    const densityMultiplier = document.getElementById('densityMultiplierOption') ? parseFloat(document.getElementById('densityMultiplierOption').value) : 1.0;

                                                                                                                                       // Reset and initialize progress tracking
    progressStartTime = Date.now();                                                                                                    // Assign variable property value reference

                                                                                                                                       // Show progress (safely check existence for new UI layout)
    const progressSection = document.getElementById('progressSection');
    if (progressSection) progressSection.classList.remove('hidden');
    
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) resultsSection.classList.add('hidden');

                                                                                                                                       // Initialize progress
    updateProgress(0, 'Initializing generation...');                                                                                   // Execute sequential statement instruction block

                                                                                                                                       // Disable button
    document.getElementById('generateBtn').disabled = true;                                                                            // Query document element node reference
    document.getElementById('generateBtn').innerHTML = '<i class="fas fa-magic mr-2"></i> ' + (window.I18N.generatingCloud || 'Generating...');

                                                                                                                                       // Determine endpoint and progress messages based on method
    let endpoint = `${BASE_URL}/generate_cloud`;                                                                                       // Initialize mutable variable state reference
    let methodName = 'Regular Distribution';                                                                                           // Initialize mutable variable state reference

    if (generationMethod === 'natural') {                                                                                              // Evaluate boolean condition check logic
        endpoint = `${BASE_URL}/generate_cloud_natural`;                                                                               // Assign variable property value reference
        methodName = 'Natural Distribution';                                                                                           // Assign variable property value reference
    }                                                                                                                                  // Terminate block scope execution context

                                                                                                                                       // Simulate progress updates during processing
    updateProgress(25, 'Processing input data...');                                                                                    // Execute sequential statement instruction block
    setTimeout(() => updateProgress(50, 'Analyzing regions...'), 500);                                                                 // Execute sequential statement instruction block
    setTimeout(() => updateProgress(75, `Generating cloud with ${methodName}...`), 1000);                                              // Execute sequential statement instruction block

    fetch(endpoint, {                                                                                                                  // Dispatch asynchronous network payload stream
        method: 'POST',                                                                                                                // Execute sequential evaluation stream node
        headers: {                                                                                                                     // Execute sequential evaluation stream node
            'Content-Type': 'application/json'                                                                                         // Execute sequential evaluation stream node
        },                                                                                                                             // Terminate block scope execution context
        body: JSON.stringify({                                                                                                         // Execute sequential evaluation stream node
            csv_filename: currentFilename,                                                                                             // Execute sequential evaluation stream node
            regiones_inside: regionesInside,                                                                                           // Execute sequential evaluation stream node
            density_multiplier: densityMultiplier                                                                                      // Execute sequential evaluation stream node
        })                                                                                                                             // Terminate block scope execution context
    })                                                                                                                                 // Terminate block scope execution context
        .then(response => response.json())                                                                                             // Chain asynchronous promise resolution sequence
        .then(data => {                                                                                                                // Chain asynchronous promise resolution sequence
            if (data.success) {                                                                                                        // Evaluate boolean condition check logic
                updateProgress(100, `${methodName} generation completed successfully!`);                                               // Execute sequential statement instruction block
                displayResults(data);                                                                                                  // Execute sequential statement instruction block
            } else {                                                                                                                   // Terminate block scope execution context
                showAlert(data.error || `Error generating cloud with ${methodName}`, 'error');                                         // Execute sequential statement instruction block
                hideProgress();                                                                                                        // Execute sequential statement instruction block
            }                                                                                                                          // Terminate block scope execution context
        })                                                                                                                             // Terminate block scope execution context
        .catch(error => {                                                                                                              // Catch asynchronous promise exception payload
            showAlert(`Error generating cloud with ${methodName}: ` + error.message, 'error');                                         // Execute sequential statement instruction block
            hideProgress();                                                                                                            // Execute sequential statement instruction block
        })                                                                                                                             // Terminate block scope execution context
        .finally(() => {                                                                                                               // Execute sequential evaluation stream node
                                                                                                                                       // Re-enable button
            document.getElementById('generateBtn').disabled = false;                                                                   // Query document element node reference
            document.getElementById('generateBtn').innerHTML = '<i class="fas fa-magic mr-2"></i> ' + (window.I18N.generateComplete || 'Generate Cloud of Points');
        });                                                                                                                            // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context



                                                                                                                                       // Progress tracking
let progressStartTime = null;                                                                                                          // Initialize mutable variable state reference

                                                                                                                                       // Update progress
function updateProgress(percentage, message) {                                                                                         // Declare function scope logic
    const progressFill = document.getElementById('progressFill');                                                                      // Initialize immutable variable state reference
    const progressPercentage = document.getElementById('progressPercentage');                                                          // Initialize immutable variable state reference
    const progressText = document.getElementById('progressText');                                                                      // Initialize immutable variable state reference

    if (progressFill) {                                                                                                                // Evaluate boolean condition check logic
        progressFill.style.width = percentage + '%';                                                                                   // Modify element visual style property
    }                                                                                                                                  // Terminate block scope execution context

    if (progressPercentage) {                                                                                                          // Evaluate boolean condition check logic
        progressPercentage.textContent = percentage + '%';                                                                             // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

    if (progressText && message) {                                                                                                     // Evaluate boolean condition check logic
        progressText.textContent = message;                                                                                            // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

                                                                                                                                       // Update step indicators
    updateProgressSteps(percentage);                                                                                                   // Execute sequential statement instruction block
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Update progress step indicators
function updateProgressSteps(percentage) {                                                                                             // Declare function scope logic
    const step1 = document.getElementById('step1');                                                                                    // Initialize immutable variable state reference
    const step2 = document.getElementById('step2');                                                                                    // Initialize immutable variable state reference
    const step3 = document.getElementById('step3');                                                                                    // Initialize immutable variable state reference

                                                                                                                                       // Reset all steps
    [step1, step2, step3].forEach(step => {                                                                                            // Execute sequential evaluation stream node
        if (step) {                                                                                                                    // Evaluate boolean condition check logic
            step.classList.remove('active', 'completed');                                                                              // Modify element class list collection
        }                                                                                                                              // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context

    if (percentage >= 0 && step1) {                                                                                                    // Evaluate boolean condition check logic
        step1.classList.add('active');                                                                                                 // Modify element class list collection
    }                                                                                                                                  // Terminate block scope execution context
    if (percentage >= 25 && step1) {                                                                                                   // Evaluate boolean condition check logic
        step1.classList.remove('active');                                                                                              // Modify element class list collection
        step1.classList.add('completed');                                                                                              // Modify element class list collection
    }                                                                                                                                  // Terminate block scope execution context
    if (percentage >= 50 && step2) {                                                                                                   // Evaluate boolean condition check logic
        step2.classList.add('active');                                                                                                 // Modify element class list collection
    }                                                                                                                                  // Terminate block scope execution context
    if (percentage >= 75 && step2) {                                                                                                   // Evaluate boolean condition check logic
        step2.classList.remove('active');                                                                                              // Modify element class list collection
        step2.classList.add('completed');                                                                                              // Modify element class list collection
    }                                                                                                                                  // Terminate block scope execution context
    if (percentage >= 100 && step3) {                                                                                                  // Evaluate boolean condition check logic
        step3.classList.add('active');                                                                                                 // Modify element class list collection
        step3.classList.add('completed');                                                                                              // Modify element class list collection
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Hide progress
function hideProgress() {                                                                                                              // Declare function scope logic
                                                                                                                                       // Query document element node reference
    document.getElementById('generateBtn').disabled = false;                                                                           // Query document element node reference
    document.getElementById('generateBtn').innerHTML = '<i class="fas fa-magic mr-2"></i> ' + (window.I18N.generateComplete || 'Generate Cloud of Points');
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Display results
function displayResults(data) {                                                                                                        // Declare function scope logic
                                                                                                                                       // Update statistics in the summary section
    updateResultsStatistics(data);                                                                                                     // Execute sequential statement instruction block

                                                                                                                                       // Update visualization content
    const resultsContent = document.getElementById('downloadButtonsGrid');                                                             // Initialize immutable variable state reference

    let html = '';                                                                                                                     // Initialize mutable variable state reference

    if (data.files && data.files.length > 0) {                                                                                         // Evaluate boolean condition check logic
                                                                                                                                       // Separate files by type
        const csvFiles = data.files.filter(file => file.endsWith('.csv'));                                                             // Initialize immutable variable state reference
        const pngFiles = data.files.filter(file => file.endsWith('.png'));                                                             // Initialize immutable variable state reference
        const svgFiles = data.files.filter(file => file.endsWith('.svg'));                                                             // Initialize immutable variable state reference

                                                                                                                                       // Plot the generated cloud CSV into the existing Chart.js canvas
        if (csvFiles.length > 0) {
            fetch(`${BASE_URL}/download/${csvFiles[0]}`)
                .then(response => response.text())
                .then(csvText => {
                    createCSVVisualization(csvText);                                                                                   // Re-draw with the new points
                })
                .catch(error => {
                    console.error('Could not load generated CSV for visualization:', error);
                });
        }

        html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">';
        csvFiles.forEach(file => {
            const fileName = file.split('_').pop();
            html += `<a href="${BASE_URL}/download/${file}" class="inline-flex items-center justify-between gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <div class="flex items-center gap-3">
                    <i class="fas fa-file-csv text-blue-400 text-lg"></i>
                    <div class="flex flex-col text-left">
                        <span>CSV Data</span>
                        <span class="text-xs text-gray-400">${fileName}</span>
                    </div>
                </div>
                <i class="fas fa-download text-gray-400 group-hover:text-white transition-colors"></i>
            </a>`;
        });
        pngFiles.forEach(file => {
            const fileName = file.split('_').pop();
            html += `<a href="${BASE_URL}/download/${file}" class="inline-flex items-center justify-between gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <div class="flex items-center gap-3">
                    <i class="fas fa-image text-purple-400 text-lg"></i>
                    <div class="flex flex-col text-left">
                        <span>PNG Image</span>
                        <span class="text-xs text-gray-400">${fileName}</span>
                    </div>
                </div>
                <i class="fas fa-download text-gray-400 group-hover:text-white transition-colors"></i>
            </a>`;
        });
        svgFiles.forEach(file => {
            const fileName = file.split('_').pop();
            html += `<a href="${BASE_URL}/download/${file}" class="inline-flex items-center justify-between gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
                <div class="flex items-center gap-3">
                    <i class="fas fa-vector-square text-teal-400 text-lg"></i>
                    <div class="flex flex-col text-left">
                        <span>SVG Vector</span>
                        <span class="text-xs text-gray-400">${fileName}</span>
                    </div>
                </div>
                <i class="fas fa-download text-gray-400 group-hover:text-white transition-colors"></i>
            </a>`;
        });
        html += '</div>';                                                                                                               // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

    resultsContent.innerHTML = html;                                                                                                   // Execute sequential statement instruction block
    if(document.getElementById('outputLinks')) document.getElementById('outputLinks').classList.remove('hidden');                      // Query document element node reference
                                                                                                                                       // Query document element node reference
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Update results statistics
function updateResultsStatistics(data) {                                                                                               // Declare function scope logic
    const processingTimeEl = document.getElementById('processingTime');                                                                // Initialize immutable variable state reference
    const totalPointsEl = document.getElementById('totalPoints');                                                                      // Initialize immutable variable state reference
    const outputFilesEl = document.getElementById('outputFiles');                                                                      // Initialize immutable variable state reference

                                                                                                                                       // Calculate processing time
    if (processingTimeEl) {
        if (progressStartTime) {                                                                                                       // Evaluate boolean condition check logic
            const processingTime = ((Date.now() - progressStartTime) / 1000).toFixed(1);                                               // Initialize immutable variable state reference
            processingTimeEl.textContent = `${processingTime}s`;                                                                       // Execute sequential statement instruction block
        } else {                                                                                                                       // Terminate block scope execution context
            processingTimeEl.textContent = 'N/A';                                                                                      // Execute sequential statement instruction block
        }
    }                                                                                                                                  // Terminate block scope execution context

                                                                                                                                       // Count points generated by reading CSV file
    if (data.files) {                                                                                                                  // Evaluate boolean condition check logic
        const csvFiles = data.files.filter(file => file.endsWith('.csv'));                                                             // Initialize immutable variable state reference
        if (outputFilesEl) outputFilesEl.textContent = data.files.length.toString();                                                   // Execute sequential statement instruction block

        if (csvFiles.length > 0) {                                                                                                     // Evaluate boolean condition check logic
                                                                                                                                       // Fetch the CSV file to count actual rows
            fetch(`${BASE_URL}/download/${csvFiles[0]}`)                                                                               // Dispatch asynchronous network payload stream
                .then(response => response.text())                                                                                     // Chain asynchronous promise resolution sequence
                .then(csvText => {                                                                                                     // Chain asynchronous promise resolution sequence
                    const lines = csvText.trim().split('\n');                                                                          // Initialize immutable variable state reference
                                                                                                                                       // Subtract 1 to exclude header row
                    const pointCount = Math.max(0, lines.length - 1);                                                                  // Initialize immutable variable state reference
                    if (totalPointsEl) {                                                                                               // Evaluate boolean condition check logic
                        totalPointsEl.textContent = pointCount.toLocaleString();                                                       // Execute sequential statement instruction block
                                                                                                                                       // Add a subtle animation class to draw attention
                        totalPointsEl.classList.add('text-green-400', 'scale-110', 'transition-all', 'duration-500');                  // Modify element class list collection
                        setTimeout(() => totalPointsEl.classList.remove('text-green-400', 'scale-110'), 2000);                         // Execute sequential evaluation stream node
                    }                                                                                                                  // Terminate block scope execution context
                })                                                                                                                     // Terminate block scope execution context
                .catch(error => {                                                                                                      // Catch asynchronous promise exception payload
                    console.error('Error fetching CSV for stats:', error);                                                             // Emit diagnostic error stream payload
                    if (totalPointsEl) totalPointsEl.textContent = 'Error';                                                            // Execute sequential statement instruction block
                });                                                                                                                    // Terminate block scope execution context
        } else {
            if (totalPointsEl) totalPointsEl.textContent = 'N/A';
        }
    } else {
        if (totalPointsEl) totalPointsEl.textContent = '0';
        if (outputFilesEl) outputFilesEl.textContent = '0';
    }                                                                                                                                  // Terminate block scope execution context
}

function showAlert(message, type) {
    if (typeof window.showToast === 'function') {
        let title = '';
        const i18n = window.I18N || {};
        if (type === 'success') title = i18n.successTitle || i18n.success || 'Success';
        else if (type === 'error') title = i18n.errorTitle || i18n.error || 'Error';
        else title = i18n.infoTitle || i18n.info || 'Info';
        window.showToast(title, message, type);
    } else {
        console.log(`[${type}] ${message}`);
    }
}

                                                                                                                                       // Initialize when page loads
/*
 Copies the specified text to the system clipboard with fallback support.
 Uses a temporary textarea element for compatibility with older browsers
 and falls back to the modern Clipboard API when available.
 
 @function copyToClipboard
 @param {string} text - The text content to copy to the clipboard
 @since 2025-05-01
 @lastModified 2026-01-21
 @author Gerardo Tinoco-Guerrero
 
 @description
 This utility function:
 - Creates a temporary textarea element for text selection
 - Uses document.execCommand('copy') as primary method
 - Falls back to navigator.clipboard.writeText() for modern browsers
 - Provides visual feedback through showCopyFeedback()
 - Handles errors gracefully with console logging
 - Ensures cleanup of temporary DOM elements
 
 */
function copyToClipboard(text) {                                                                                                       // Declare function scope logic
                                                                                                                                       // Create temporary element to copy text
    const tempTextArea = document.createElement('textarea');                                                                           // Initialize immutable variable state reference
    tempTextArea.value = text;                                                                                                         // Execute sequential statement instruction block
    tempTextArea.style.position = 'fixed';                                                                                             // Modify element visual style property
    tempTextArea.style.left = '-999999px';                                                                                             // Modify element visual style property
    tempTextArea.style.top = '-999999px';                                                                                              // Modify element visual style property
    document.body.appendChild(tempTextArea);                                                                                           // Execute sequential statement instruction block

    try {                                                                                                                              // Initialize safe execution try block
                                                                                                                                       // Select and copy text
        tempTextArea.focus();                                                                                                          // Execute sequential statement instruction block
        tempTextArea.select();                                                                                                         // Execute sequential statement instruction block
        document.execCommand('copy');                                                                                                  // Execute sequential statement instruction block

                                                                                                                                       // Show visual feedback
        showCopyFeedback();                                                                                                            // Execute sequential statement instruction block
    } catch (err) {                                                                                                                    // Terminate block scope execution context
        console.error('Error copying to clipboard:', err);                                                                             // Emit diagnostic error stream payload
                                                                                                                                       // Fallback for modern browsers
        if (navigator.clipboard) {                                                                                                     // Evaluate boolean condition check logic
            navigator.clipboard.writeText(text).then(() => {                                                                           // Chain asynchronous promise resolution sequence
                showCopyFeedback();                                                                                                    // Execute sequential statement instruction block
            }).catch(err => {                                                                                                          // Catch asynchronous promise exception payload
                console.error('Error in clipboard fallback:', err);                                                                    // Emit diagnostic error stream payload
            });                                                                                                                        // Terminate block scope execution context
        }                                                                                                                              // Terminate block scope execution context
    } finally {                                                                                                                        // Terminate block scope execution context
                                                                                                                                       // Clean up temporary element
        document.body.removeChild(tempTextArea);                                                                                       // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

                                                                                                                                       // Function to show visual feedback when copying
/*
 Provides visual feedback when text is successfully copied to clipboard.
 Temporarily changes the copy button's icon and styling to indicate
 successful copy operation, then restores original appearance.
 
 @function showCopyFeedback
 @since 2025-05-01
 @lastModified 2026-01-21
 @author Gerardo Tinoco-Guerrero
 
 @description
 This feedback function:
 - Finds the closest copy button element from the event target
 - Changes the icon from copy to checkmark (fas fa-check)
 - Updates button styling to green background with white text
 - Automatically restores original styling after 2 seconds
 - Provides immediate visual confirmation of successful copy operation
 
 */
function showCopyFeedback() {
    showAlert(window.I18N?.copiedToClipboard || 'Copied to clipboard', 'info');
    const copyBtn = typeof event !== 'undefined' && event.target ? event.target.closest('.copy-btn') : null;
    if (copyBtn) {                                                                                                                     // Evaluate boolean condition check logic
        const originalIcon = copyBtn.querySelector('i');                                                                               // Initialize immutable variable state reference
        const originalClass = originalIcon.className;                                                                                  // Initialize immutable variable state reference

                                                                                                                                       // Change icon temporarily
        originalIcon.className = 'fas fa-check';                                                                                       // Execute sequential statement instruction block
        copyBtn.style.background = '#10b981';                                                                                          // Modify element visual style property
        copyBtn.style.color = 'white';                                                                                                 // Modify element visual style property

                                                                                                                                       // Restore after 2 seconds
        setTimeout(() => {                                                                                                             // Execute sequential evaluation stream node
            originalIcon.className = originalClass;                                                                                    // Execute sequential statement instruction block
            copyBtn.style.background = '';                                                                                             // Modify element visual style property
            copyBtn.style.color = '';                                                                                                  // Modify element visual style property
        }, 2000);                                                                                                                      // Terminate block scope execution context
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

/*
 Downloads the current data visualization chart as a PNG image file.
 Converts the canvas element to a data URL and triggers an automatic
 download with a timestamped filename for easy organization.
 
 @function downloadChart
 @since 2025-05-01
 @lastModified 2026-01-21
 @author Gerardo Tinoco-Guerrero
 
 @description
 This download function:
 - Validates that a chart exists (window.csvChart) before proceeding
 - Locates the canvas element containing the visualization
 - Generates a timestamped filename in format: data_points_visualization_YYYYMMDD_HHMMSS.png
 - Converts canvas to PNG data URL using toDataURL()
 - Creates temporary download link and triggers automatic download
 - Provides user feedback through success/error alerts
 - Handles errors gracefully with console logging
 
 */
function downloadChart() {                                                                                                             // Declare function scope logic
    if (!window.csvChart) {                                                                                                            // Evaluate boolean condition check logic
        console.error('No chart available for download');                                                                              // Emit diagnostic error stream payload
        showAlert(window.I18N.couldNotLoadChart || 'No chart available for download', 'error');
        return;                                                                                                                        // Execute sequential statement instruction block
    }                                                                                                                                  // Terminate block scope execution context

    try {                                                                                                                              // Initialize safe execution try block
                                                                                                                                       // Get the canvas element
        const canvas = document.getElementById('previewChart');                                                                        // Initialize immutable variable state reference
        if (!canvas) {                                                                                                                 // Evaluate boolean condition check logic
            throw new Error('Canvas element not found');                                                                               // Execute sequential statement instruction block
        }                                                                                                                              // Terminate block scope execution context

                                                                                                                                       // Create download link
        const link = document.createElement('a');                                                                                      // Initialize immutable variable state reference
        const now = new Date();                                                                                                        // Initialize immutable variable state reference
        const timestamp = now.getFullYear().toString() +                                                                               // Initialize immutable variable state reference
            (now.getMonth() + 1).toString().padStart(2, '0') +                                                                         // Execute sequential evaluation stream node
            now.getDate().toString().padStart(2, '0') + '_' +                                                                          // Execute sequential evaluation stream node
            now.getHours().toString().padStart(2, '0') +                                                                               // Execute sequential evaluation stream node
            now.getMinutes().toString().padStart(2, '0') +                                                                             // Execute sequential evaluation stream node
            now.getSeconds().toString().padStart(2, '0');                                                                              // Execute sequential statement instruction block
        link.download = `data_points_visualization_${timestamp}.png`;                                                                  // Execute sequential statement instruction block
        link.href = canvas.toDataURL('image/png');                                                                                     // Execute sequential statement instruction block

                                                                                                                                       // Trigger download
        document.body.appendChild(link);                                                                                               // Execute sequential statement instruction block
        link.click();                                                                                                                  // Execute sequential statement instruction block
        document.body.removeChild(link);                                                                                               // Execute sequential statement instruction block

        showAlert(window.I18N.chartDownloadedSuccessfully || 'Chart downloaded successfully', 'success');

    } catch (error) {                                                                                                                  // Terminate block scope execution context
        console.error('Error downloading chart:', error);                                                                              // Emit diagnostic error stream payload
        showAlert(window.I18N.errorDownloadingChart || 'Error downloading chart', 'error');
    }                                                                                                                                  // Terminate block scope execution context
}                                                                                                                                      // Terminate block scope execution context

document.addEventListener('DOMContentLoaded', function () {                                                                            // Bind event listener DOM state
    setupDragAndDrop();                                                                                                                // Execute sequential statement instruction block
});                                                                                                                                    // Terminate block scope execution context
function showLocalUploadError(title, message) {
    uploadZone.classList.remove('uploading', 'success');
    uploadZone.classList.add('error');

    document.getElementById('uploadContent').classList.add('hidden');
    document.getElementById('uploadProgress').classList.remove('flex');
    document.getElementById('uploadProgress').classList.add('hidden');
    document.getElementById('uploadSuccess').classList.remove('flex');
    document.getElementById('uploadSuccess').classList.add('hidden');
    
    const errDiv = document.getElementById('uploadError');
    errDiv.classList.remove('hidden');
    errDiv.classList.add('flex');
    
    errDiv.querySelector('h4').textContent = title;
    document.getElementById('errorMessage').textContent = message;
}
