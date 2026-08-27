/**
 * BioShelter Studio - Shared Theme Manager
 * Provides unified, instantaneous Dark & Light mode toggling across all standalone pages,
 * persists user preference in localStorage, and synchronizes chart/canvas themes.
 */

export class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('bioshelter_theme_mode') || 'dark';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateIcons();

        // Bind theme buttons if present
        const btnToggle = document.getElementById('btn-theme-toggle');
        if (btnToggle) {
            btnToggle.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('bioshelter_theme_mode', this.theme);
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateIcons();

        // Dispatch custom event for charts or 3D canvases to react
        window.dispatchEvent(new CustomEvent('bioshelter-theme-changed', {
            detail: { theme: this.theme, isDark: this.theme === 'dark' }
        }));
    }

    updateIcons() {
        const sun = document.getElementById('theme-icon-sun');
        const moon = document.getElementById('theme-icon-moon');
        if (sun && moon) {
            if (this.theme === 'light') {
                sun.style.display = 'block';
                moon.style.display = 'none';
            } else {
                sun.style.display = 'none';
                moon.style.display = 'block';
            }
        }
    }

    isDark() {
        return this.theme === 'dark';
    }
}

export const themeManager = new ThemeManager();
