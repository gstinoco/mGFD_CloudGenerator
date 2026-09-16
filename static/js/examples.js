/**
 * Examples — Core functionality for Examples
 * 
 * Overview:
 *     This module provides functionality related to the Examples page.
 *     Handles interactive features including image lightboxes for example galleries.
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

document.addEventListener('DOMContentLoaded', function () {                                                                             // Wait for DOM parsing finish
    let lightbox = document.getElementById('lightbox');                                                                                 // Locate existing lightbox UI

    if (!lightbox) {                                                                                                                    // Check if creation is required
        lightbox = document.createElement('div');                                                                                       // Instantiate block element
        lightbox.id = 'lightbox';                                                                                                       // Assign DOM unique identifier
        lightbox.className = 'lightbox';                                                                                                // Assign CSS styling class

        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close">&times;</button>
                <img class="lightbox-image" src="" alt="Full size view">
                <div class="lightbox-caption"></div>
            </div>
        `;                                                                                                                              // Set internal string HTML template

        document.body.appendChild(lightbox);                                                                                            // Append instance to root body
    }                                                                                                                                   // End condition creation block

    const lightboxImg = lightbox.querySelector('.lightbox-image');                                                                      // Cache child image target reference
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');                                                                // Cache child caption target reference
    const closeBtn = lightbox.querySelector('.lightbox-close');                                                                         // Cache child button target reference

    function openLightbox(imgElement) {                                                                                                 // Define open function execution sequence
        if (!imgElement.src) {                                                                                                          // Validate URL path exists
            console.error('Image has no source');                                                                                       // Log error condition status
            return;                                                                                                                     // Abort processing string failure
        }                                                                                                                               // End validation closure

        lightboxImg.src = imgElement.src;                                                                                               // Load source mapping parameter link
        lightboxImg.alt = imgElement.alt || 'Full size view';                                                                           // Resolve alternative description text

        let captionText = '';                                                                                                           // Initialize string buffer parameter
        try {                                                                                                                           // Wrap extraction tree query search
            const card = imgElement.closest('.example-card');                                                                           // Locate relative parent structure DOM
            const title = card ? card.querySelector('.example-title').innerText : '';                                                   // Locate and extract title contents
            let label = '';                                                                                                             // Set fallback string text definition
            const container = imgElement.closest('.example-image-container');                                                           // Target sub parent container DOM lookup
            if (container) {                                                                                                            // Query parent availability status property
                const labelEl = container.querySelector('.image-label');                                                                // Search local relative tree children
                if (labelEl) label = labelEl.innerText;                                                                                 // If found extract string label text
            }                                                                                                                           // End container query test sequence

            captionText = title ? `${title} - ${label}` : label;                                                                        // Resolve formatted caption output
        } catch (e) {                                                                                                                   // Capture potential DOM missing references
            console.warn('Could not extract caption', e);                                                                               // Emit safe warning text string message
        }                                                                                                                               // Terminate test wrapper block logic
        lightboxCaption.textContent = captionText;                                                                                      // Inject textual property value

        lightbox.style.display = 'flex';                                                                                                // Enable display render CSS block

        void lightbox.offsetWidth;                                                                                                      // Force UI layout browser rendering cycle

        lightbox.classList.add('active');                                                                                               // Apply active class interaction visual state

        document.body.style.overflow = 'hidden';                                                                                        // Restrict document Y axis scrolling mapping
    }                                                                                                                                   // End function UI declaration syntax

    function closeLightbox() {                                                                                                          // Define close functionality execution handler
        lightbox.classList.remove('active');                                                                                            // Detach interaction CSS styling trigger

        document.body.style.overflow = '';                                                                                              // Restore body bounding overflow scroll state

        setTimeout(() => {                                                                                                              // Defer cleanup until animation finishes execution
            if (!lightbox.classList.contains('active')) {                                                                               // Confirm no race condition event activated
                lightbox.style.display = 'none';                                                                                        // Finalize CSS rendering map visibility hide
                lightboxImg.src = '';                                                                                                   // Clear buffer source string object data
            }                                                                                                                           // End race condition test validation check
        }, 300);                                                                                                                        // Hard limit standard interaction timer configuration
    }                                                                                                                                   // End cleanup loop structure mapping execution

    document.addEventListener('click', function (e) {                                                                                   // Monitor global clicks application window
        const container = e.target.closest('.example-image-container');                                                                 // Determine local interaction target match

        if (container) {                                                                                                                // Confirm valid structural target parameter map
            const img = container.querySelector('img');                                                                                 // Find target image link asset property tag
            if (img) {                                                                                                                  // Validate presence property link text condition
                e.preventDefault();                                                                                                     // Block normal routing interaction process cycle
                e.stopPropagation();                                                                                                    // Stop bubbling tree interaction map function
                openLightbox(img);                                                                                                      // Invoke visual interface display process handler
                return;                                                                                                                 // End handler logic trigger execution map
            }                                                                                                                           // Terminate valid test parameter condition logic
        }                                                                                                                               // Terminate parameter container check logic block

        if (e.target.matches('.lightbox-close') || e.target.closest('.lightbox-close')) {                                               // Determine manual exit handler configuration trigger
            e.preventDefault();                                                                                                         // Inhibit baseline action system handling processing
            closeLightbox();                                                                                                            // Route manual interaction tear down logic function
        }                                                                                                                               // Terminate specific UI exit logic trigger event

        if (e.target === lightbox) {                                                                                                    // Monitor outside boundary interaction click system
            closeLightbox();                                                                                                            // Clean visual layout UI structure mapping condition
        }                                                                                                                               // End background event handler sequence listener map
    });                                                                                                                                 // Close DOM observer object instance structure function

    document.addEventListener('keydown', function (e) {                                                                                 // Monitor standard keyboard inputs array system logic
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {                                                              // Condition keyboard hotkey trigger visibility string
            closeLightbox();                                                                                                            // Dispatch interface teardown routing structure logic
        }                                                                                                                               // End trigger array sequence structure logic configuration
    });                                                                                                                                 // Close DOM mapping global observation listener array
});                                                                                                                                     // End complete module instantiation structure pattern
