/*
theme.js — Theme toggle and persistence logic

Overview:
    Handles dark/light mode switching and saves user preference to localStorage.

Public API:
    initTheme()
    toggleTheme()

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

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');                                                                       // Get toggle button element.
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');                                                       // Check OS preference.

    const currentTheme = localStorage.getItem('theme');                                                                                // Retrieve saved theme preference.
    
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {                                                     // Check if dark mode is active.
        document.documentElement.setAttribute('data-theme', 'dark');                                                                   // Apply dark theme attribute.
        document.documentElement.classList.add('dark');                                                                                // Apply Tailwind dark class.
        updateIcon('dark');                                                                                                            // Update icon UI.
    } else {
        document.documentElement.setAttribute('data-theme', 'light');                                                                  // Apply light theme attribute.
        document.documentElement.classList.remove('dark');                                                                             // Remove Tailwind dark class.
        updateIcon('light');                                                                                                           // Update icon UI.
    }

    if (themeToggle) {                                                                                                                 // Ensure toggle element exists.
        themeToggle.addEventListener('click', () => {                                                                                  // Attach click listener.
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';                                             // Check current state.
            const newTheme = isDark ? 'light' : 'dark';                                                                                // Toggle logic.
            
            document.documentElement.setAttribute('data-theme', newTheme);                                                             // Update DOM attribute.
            if (newTheme === 'dark') {                                                                                                 // Evaluate boolean condition check logic
                document.documentElement.classList.add('dark');                                                                        // Apply Tailwind dark class.
            } else {                                                                                                                   // Terminate block scope execution context
                document.documentElement.classList.remove('dark');                                                                     // Remove Tailwind dark class.
            }                                                                                                                          // Terminate block scope execution context
            localStorage.setItem('theme', newTheme);                                                                                   // Save new preference.
            updateIcon(newTheme);                                                                                                      // Update icon visually.
        });
    }

    /*
    updateIcon
    Updates the theme toggle icon.
    
    Input:
        theme       string          The theme to set ('dark' or 'light').
    
    Output:
        None
    */
    function updateIcon(theme) {
        if (!themeToggle) return;                                                                                                      // Safety check.
        const icon = themeToggle.querySelector('i');                                                                                   // Find icon element.
        if (theme === 'dark') {                                                                                                        // Handle dark mode.
            icon.classList.remove('fa-moon');                                                                                          // Remove moon icon.
            icon.classList.add('fa-sun');                                                                                              // Add sun icon.
        } else {                                                                                                                       // Handle light mode.
            icon.classList.remove('fa-sun');                                                                                           // Remove sun icon.
            icon.classList.add('fa-moon');                                                                                             // Add moon icon.
        }
    }
});
