/*
toast.js — Global Toast Notification System

Overview:
    Displays non-blocking floating alerts to the user.

Public API:
    showToast()

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
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
                                                                                                                                       // Tailwind styling for container: fixed top-right, z-50, space between toasts
        container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
    }
});

/*
showToast
Displays a floating non-blocking notification on the screen.

Input:
    title       string          The title of the toast message.
    message     string          The detailed message content.
    type        string          The severity type (e.g., 'success', 'error', 'info'). Default 'info'.

Output:
    None
*/
window.showToast = function (title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    
                                                                                                                                       // Tailwind base classes for toast: glassmorphism, rounded, shadow, transform for animation
    toast.className = 'pointer-events-auto flex items-start gap-3 w-80 p-4 rounded-2xl border border-white/10 bg-[#111]/90 backdrop-blur-xl shadow-2xl transform transition-all duration-300 translate-x-full opacity-0';

    let iconClass = 'fa-info-circle text-blue-400';
    let bgIcon = 'bg-blue-500/10 border-blue-500/20';
    if (type === 'success') {
        iconClass = 'fa-check-circle text-teal-400';
        bgIcon = 'bg-teal-500/10 border-teal-500/20';
    }
    if (type === 'error') {
        iconClass = 'fa-exclamation-circle text-red-400';
        bgIcon = 'bg-red-500/10 border-red-500/20';
    }

    toast.innerHTML = `
        <div class="h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center ${bgIcon}">
            <i class="fas ${iconClass} text-lg"></i>
        </div>
        <div class="flex-1 pt-1">
            <h4 class="text-sm font-bold text-white mb-0.5">${title}</h4>
            <p class="text-sm text-gray-400 leading-snug">${message}</p>
        </div>
        <button class="shrink-0 text-gray-500 hover:text-white transition-colors" onclick="this.closest('div.pointer-events-auto').style.opacity='0'; setTimeout(() => this.closest('div.pointer-events-auto').remove(), 300)">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

                                                                                                                                       // Trigger animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        });
    });

                                                                                                                                       // Auto remove
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};
