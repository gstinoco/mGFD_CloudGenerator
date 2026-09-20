/*
Navbar — Core functionality for Navbar

Overview:
    This module provides functionality related to the Navigation Bar Interactive Component System.
    It handles mobile menu toggle, dropdowns, and responsive behaviors.

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
/*
 Initialize Navigation Bar Interactive System
 
 Main initialization function that sets up all navigation functionality when
 the DOM is fully loaded. Configures mobile menu interactions, dropdown
 behaviors, scroll effects, and accessibility features for the navigation bar.
 
 Initialized Components:
 - Mobile hamburger menu toggle with animation
 - Responsive dropdown menu system
 - Automatic menu closure on navigation
 - Outside click detection for menu closure
 - Window resize handling for responsive behavior
 - Scroll-based navbar styling effects
 - Smooth scrolling for anchor links
 - CTA button interaction feedback
 
 DOM Elements Configured:
 - .nav-toggle: Hamburger menu button
 - .nav-menu: Main navigation menu container
 - .dropdown-toggle: Dropdown menu triggers
 - .navbar: Main navigation bar container
 - .nav-link: Individual navigation links
 - .nav-cta, .btn-primary: Call-to-action buttons
 
 Event Listeners Registered:
 - click: Menu toggle, dropdown, and link interactions
 - resize: Responsive behavior adjustments
 - scroll: Navbar styling and visibility effects
 - DOMContentLoaded: Initial setup and configuration
 
 @function
 @since 2025-05-01
 @lastModified 2026-01-21
 @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event} DOMContentLoaded Event
 @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList} Element.classList API
 @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth} Window.innerWidth Property
 
 */
document.addEventListener('DOMContentLoaded', function () {                                                                            // Bind event listener DOM state
    const navToggle = document.querySelector('.nav-toggle');                                                                           // Initialize immutable variable state reference
    const navMenu = document.querySelector('.nav-menu');                                                                               // Initialize immutable variable state reference
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');                                                             // Initialize immutable variable state reference
    const navbar = document.querySelector('.navbar');                                                                                  // Initialize immutable variable state reference

    /*
     Mobile Menu Toggle Functionality
     
     Configures the hamburger menu button to show/hide the mobile navigation
     menu with proper state management and body scroll prevention.
     
     Features:
     - Toggle active state for menu button and menu container
     - Prevent body scrolling when mobile menu is open
     - Restore body scrolling when mobile menu is closed
     - Visual feedback with CSS class toggles
     
     @since 2025-05-01
     @lastModified 2026-01-21
     */
    if (navToggle && navMenu) {                                                                                                        // Evaluate boolean condition check logic
        navToggle.addEventListener('click', function () {                                                                              // Bind event listener DOM state
            navToggle.classList.toggle('active');                                                                                      // Modify element class list collection
            navMenu.classList.toggle('active');                                                                                        // Modify element class list collection

                                                                                                                                       // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {                                                                                // Evaluate boolean condition check logic
                document.body.style.overflow = 'hidden';                                                                               // Modify element visual style property
            } else {                                                                                                                   // Terminate block scope execution context
                document.body.style.overflow = '';                                                                                     // Modify element visual style property
            }                                                                                                                          // Terminate block scope execution context
        });                                                                                                                            // Terminate block scope execution context
    }                                                                                                                                  // Terminate block scope execution context

    /*
     Automatic Mobile Menu Closure on Navigation
     
     Automatically closes the mobile menu when users click on navigation links,
     providing a smooth user experience and preventing menu overlap with content.
     
     Features:
     - Detects clicks on navigation links (excluding dropdown toggles)
     - Closes mobile menu only on mobile devices (≤1280px width)
     - Restores body scrolling after menu closure
     - Maintains desktop navigation behavior unchanged
     
     @since 2025-05-01
     @lastModified 2026-01-21
     */
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');                                                     // Initialize immutable variable state reference
    navLinks.forEach(link => {                                                                                                         // Execute sequential evaluation stream node
        link.addEventListener('click', function () {                                                                                   // Bind event listener DOM state
            if (window.innerWidth <= 1280) {                                                                                            // Evaluate boolean condition check logic
                navToggle.classList.remove('active');                                                                                  // Modify element class list collection
                navMenu.classList.remove('active');                                                                                    // Modify element class list collection
                document.body.style.overflow = '';                                                                                     // Modify element visual style property
            }                                                                                                                          // Terminate block scope execution context
        });                                                                                                                            // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context

    /*
     Mobile Dropdown Menu Functionality
     
     Handles dropdown menu interactions specifically for mobile devices,
     preventing default link behavior and toggling dropdown visibility.
     
     Features:
     - Prevents default link navigation on mobile
     - Toggles dropdown active state for mobile display
     - Maintains standard dropdown behavior on desktop
     - Touch-friendly interaction for mobile devices
     
     @since 2025-05-01
     @lastModified 2026-01-21
     */
    dropdownToggles.forEach(toggle => {                                                                                                // Execute sequential evaluation stream node
        toggle.addEventListener('click', function (e) {                                                                                // Bind event listener DOM state
            if (window.innerWidth <= 1280) {                                                                                            // Evaluate boolean condition check logic
                e.preventDefault();                                                                                                    // Execute sequential statement instruction block
                const dropdown = this.closest('.dropdown');                                                                            // Initialize immutable variable state reference
                dropdown.classList.toggle('active');                                                                                   // Modify element class list collection
            }                                                                                                                          // Terminate block scope execution context
        });                                                                                                                            // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context

    /*
     Outside Click Detection for Mobile Menu Closure
     
     Closes the mobile menu when users click outside the navigation area,
     providing intuitive interaction behavior and improved user experience.
     
     Features:
     - Detects clicks outside the navbar container
     - Closes mobile menu only when it's currently active
     - Restores body scrolling after menu closure
     - Mobile-specific behavior (≤1280px width)
     
     @since 2025-05-01
     @lastModified 2026-01-21
     */
    document.addEventListener('click', function (e) {                                                                                  // Bind event listener DOM state
        if (window.innerWidth <= 1280) {                                                                                                // Evaluate boolean condition check logic
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {                                                  // Evaluate boolean condition check logic
                navToggle.classList.remove('active');                                                                                  // Modify element class list collection
                navMenu.classList.remove('active');                                                                                    // Modify element class list collection
                document.body.style.overflow = '';                                                                                     // Modify element visual style property
            }                                                                                                                          // Terminate block scope execution context
        }                                                                                                                              // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context

    /*
     Responsive Window Resize Handler
     
     Manages navigation state changes when the browser window is resized,
     ensuring proper behavior transitions between mobile and desktop modes.
     
     Features:
     - Automatically closes mobile menu when switching to desktop view
     - Resets all dropdown states on desktop transition
     - Restores body scrolling when exiting mobile mode
     - Prevents mobile menu artifacts on desktop
     
     @since 2025-05-01
     @lastModified 2026-01-21
     */
    window.addEventListener('resize', function () {                                                                                    // Bind event listener DOM state
        if (window.innerWidth > 1280) {                                                                                                 // Evaluate boolean condition check logic
            if (navToggle) navToggle.classList.remove('active');                                                                       // Modify element class list collection
            if (navMenu) navMenu.classList.remove('active');                                                                           // Modify element class list collection
            document.body.style.overflow = '';                                                                                         // Modify element visual style property

                                                                                                                                       // Remove active class from dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {                                                               // Query document selector node reference
                dropdown.classList.remove('active');                                                                                   // Modify element class list collection
            });                                                                                                                        // Terminate block scope execution context
        }                                                                                                                              // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context

    /*
     Dynamic Navbar Scroll Effects
     
     Applies visual styling changes to the navigation bar based on scroll position,
     providing enhanced visual feedback and improved user interface aesthetics.
     
     Features:
     - Adds 'scrolled' class when user scrolls past 50px
     - Removes 'scrolled' class when returning to top
     - Tracks scroll position for potential future enhancements
     - Smooth visual transitions via CSS classes
     
     @since 2025-05-01
     @lastModified 2026-01-21
     */
    window.addEventListener('scroll', function () {                                                                                    // Bind event listener DOM state
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;                                                    // Initialize immutable variable state reference

                                                                                                                                       // Add scrolled class for styling
        if (navbar) {                                                                                                                  // Evaluate boolean condition check logic
            if (scrollTop > 50) {                                                                                                      // Evaluate boolean condition check logic
                navbar.classList.add('scrolled');                                                                                      // Modify element class list collection
            } else {                                                                                                                   // Terminate block scope execution context
                navbar.classList.remove('scrolled');                                                                                   // Modify element class list collection
            }                                                                                                                          // Terminate block scope execution context
        }                                                                                                                              // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context

    /*
     Smooth Scrolling for Anchor Links
     
     Implements smooth scrolling behavior for internal anchor links,
     providing enhanced user experience and professional navigation feel.
     
     Features:
     - Smooth scrolling animation for anchor links
     - Accounts for fixed navbar height (80px offset)
     - Automatically closes mobile menu after navigation
     - Prevents default browser jump behavior
     - Cross-browser compatible smooth scrolling
     
     @since 2025-05-01
     @lastModified 2026-01-21
     */
    const anchorLinks = document.querySelectorAll('a[href^="#"]');                                                                     // Initialize immutable variable state reference
    anchorLinks.forEach(link => {                                                                                                      // Execute sequential evaluation stream node
        link.addEventListener('click', function (e) {                                                                                  // Bind event listener DOM state
            const href = this.getAttribute('href');                                                                                    // Initialize immutable variable state reference
            if (href.startsWith('#') && href.length > 1) {                                                                             // Evaluate boolean condition check logic
                const target = document.querySelector(href);                                                                           // Initialize immutable variable state reference
                if (target) {                                                                                                          // Evaluate boolean condition check logic
                    e.preventDefault();                                                                                                // Execute sequential statement instruction block
                    const offsetTop = target.offsetTop - 80;                                                                           // Account for fixed navbar

                    window.scrollTo({                                                                                                  // Execute sequential evaluation stream node
                        top: offsetTop,                                                                                                // Execute sequential evaluation stream node
                        behavior: 'smooth'                                                                                             // Execute sequential evaluation stream node
                    });                                                                                                                // Terminate block scope execution context

                                                                                                                                       // Close mobile menu if open
                    if (window.innerWidth <= 1280 && navMenu.classList.contains('active')) {                                            // Evaluate boolean condition check logic
                        navToggle.classList.remove('active');                                                                          // Modify element class list collection
                        navMenu.classList.remove('active');                                                                            // Modify element class list collection
                        document.body.style.overflow = '';                                                                             // Modify element visual style property
                    }                                                                                                                  // Terminate block scope execution context
                }                                                                                                                      // Terminate block scope execution context
            }                                                                                                                          // Terminate block scope execution context
        });                                                                                                                            // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context

    /*
     CTA Button Interaction Feedback
     
     Provides subtle visual feedback for call-to-action button interactions,
     enhancing user experience with responsive button animations.
     
     Features:
     - Subtle scale animation on button click
     - 150ms animation duration for smooth feedback
     - Applies to .nav-cta and .btn-primary elements
     - Non-intrusive visual enhancement
     
     @since 2025-05-01
     @lastModified 2026-01-21
     */
    const ctaButtons = document.querySelectorAll('.nav-cta, .btn-primary');                                                            // Initialize immutable variable state reference
    ctaButtons.forEach(button => {                                                                                                     // Execute sequential evaluation stream node
        button.addEventListener('click', function () {                                                                                 // Bind event listener DOM state
                                                                                                                                       // Add a subtle loading effect
            this.style.transform = 'scale(0.98)';                                                                                      // Modify element visual style property
            setTimeout(() => {                                                                                                         // Execute sequential evaluation stream node
                this.style.transform = '';                                                                                             // Modify element visual style property
            }, 150);                                                                                                                   // Terminate block scope execution context
        });                                                                                                                            // Terminate block scope execution context
    });                                                                                                                                // Terminate block scope execution context
});                                                                                                                                    // Terminate block scope execution context