/*
Utils — Core functionality for Utils

Overview:
    This module provides utility functions for mGFD CloudGenerator.
    Contains common helper functions used across different modules.

Public API:
    formatFileSize
    showUploadError

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

const Utils = {                                                                                                                        // Define global Utils object scope
    /*
     formatFileSize
     Formats a file size in bytes to a human-readable string with appropriate units.
     
     Converts bytes to the most appropriate unit (Bytes, KB, MB, GB) and formats
     the result with proper decimal precision for optimal readability.
     
     Input:
         bytes        number          The file size in bytes to be formatted.
     
     Output:
         formatted    string          The formatted file size string with appropriate unit.
     */
    formatFileSize: function (bytes) {                                                                                                 // Define formatFileSize function
        if (bytes === 0) return '0 Bytes';                                                                                             // Handle zero size edge case
        const k = 1024;                                                                                                                // Set kilobyte threshold mapping
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];                                                                               // Array of size string labels
        const i = Math.floor(Math.log(bytes) / Math.log(k));                                                                           // Calculate mathematical exponent factor
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];                                                       // Return formatted scaled text string
    },                                                                                                                                 // End formatFileSize block

    /*
     showUploadError
     Shows an error message in the upload zone.
     
     Standardizes the error display across different modules by replacing the
     upload zone content with a standardized error template.
     
     Input:
         zone         HTMLElement     The upload zone element.
         content      HTMLElement     The content element to update.
         title        string          The error title.
         message      string          The error message.
         resetFn      string          The name of the global function to call to reset (default: 'resetUpload').
     
     Output:
         None
     */
    showUploadError: function (zone, content, title, message, resetFn = 'resetUpload') {                                               // Define error UI display function
        if (!zone || !content) return;                                                                                                 // Guard against missing DOM elements

        zone.classList.remove('uploading', 'success');                                                                                 // Strip existing status class names
        zone.classList.add('error');                                                                                                   // Inject error state class identifier

        content.innerHTML = `
            <div class="upload-error">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h4>${title}</h4>
                <p>${message}</p>
                <button class="control-btn secondary small" onclick="${resetFn}()">
                    <i class="fas fa-redo"></i>
                    Try Again
                </button>
            </div>
        `;
    },

    /*
     simulateUploadProgress
     Simulates a file upload with a nice progress animation (used globally).
     
     Input:
         file                 File        The file being uploaded.
         onSuccessCallback    function    Callback triggered when animation hits 100%.
     */
    simulateUploadProgress: function (file, onSuccessCallback) {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                                                                                                                                       // Small delay before showing success state
                setTimeout(() => {
                    if (onSuccessCallback) {
                        onSuccessCallback(file);
                    }
                }, 500);
            }
            
                                                                                                                                       // Update UI
            const progressText = document.getElementById('progressText');
            const progressCircle = document.querySelector('.progress-ring-circle');
            
            if (progressText) {
                progressText.textContent = `${Math.round(progress)}%`;
            }
            if (progressCircle) {
                const circumference = 2 * Math.PI * 36;
                const offset = circumference - (progress / 100) * circumference;
                progressCircle.style.strokeDashoffset = offset;
            }
        }, 100);
    }
};                                                                                                                                     // End object scope closure

/*
 Show global loading overlay
 @param {string} text - Optional text to display below the spinner
 */
window.showGlobalLoading = function(text) {
    const loader = document.getElementById('global-loader');
    const textEl = document.getElementById('global-loader-text');
    if (loader) {
        if (textEl && text) textEl.textContent = text;
        loader.style.display = 'flex';
    }
};

/*
 Hide global loading overlay
 */
window.hideGlobalLoading = function() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.style.display = 'none';
    }
};
