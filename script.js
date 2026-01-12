/**
 * PRESTIGE E-MAGAZINE
 * Professional Magazine Application
 * Features: Page Navigation, Audio Playback, Image Gallery
 */

class PrestigeMagazine {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 8;
        this.audioIsPlaying = false;
        this.init();
    }

    /**
     * Initialize the magazine application
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.updatePageDisplay();
        this.setupKeyboardNavigation();
        console.log('🎥 Prestige Magazine Initialized - Ready for premium experience');
    }

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        // Navigation elements
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentPageDisplay = document.getElementById('currentPage');
        this.totalPagesDisplay = document.getElementById('totalPages');

        // Audio elements
        this.audioPlayer = document.getElementById('audioPlayer');
        this.audioPlayBtn = document.getElementById('audioPlayBtn');

        // Magazine structure
        this.pageSpreads = document.querySelectorAll('.page-spread');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Navigation events
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());

        // Audio events
        this.audioPlayBtn.addEventListener('click', () => this.toggleAudio());
        this.audioPlayer.addEventListener('play', () => this.onAudioPlay());
        this.audioPlayer.addEventListener('pause', () => this.onAudioPause());
        this.audioPlayer.addEventListener('ended', () => this.onAudioEnd());
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.previousPage();
                    break;
                case 'ArrowRight':
                    this.nextPage();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleAudio();
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * Navigate to next page
     */
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePageDisplay();
            this.animatePageTransition();
            this.announcePageChange();
        } else {
            this.showNotification('You have reached the end of the magazine');
        }
    }

    /**
     * Navigate to previous page
     */
    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePageDisplay();
            this.animatePageTransition();
            this.announcePageChange();
        } else {
            this.showNotification('You are at the beginning of the magazine');
        }
    }

    /**
     * Update page counter display
     */
    updatePageDisplay() {
        this.currentPageDisplay.textContent = this.currentPage;
        this.updateNavigationState();
        this.scrollToCurrentPage();
    }

    /**
     * Update navigation button states
     */
    updateNavigationState() {
        this.prevBtn.disabled = this.currentPage === 1;
        this.nextBtn.disabled = this.currentPage === this.totalPages;

        // Update button opacity
        this.prevBtn.style.opacity = this.currentPage === 1 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentPage === this.totalPages ? '0.5' : '1';
    }

    /**
     * Scroll to current page
     */
    scrollToCurrentPage() {
        const spreadIndex = Math.ceil(this.currentPage / 2) - 1;
        const spread = this.pageSpreads[spreadIndex];

        if (spread) {
            spread.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Animate page transition
     */
    animatePageTransition() {
        const spreadIndex = Math.ceil(this.currentPage / 2) - 1;
        const spread = this.pageSpreads[spreadIndex];

        if (spread) {
            const pages = spread.querySelectorAll('.page');
            pages.forEach((page, index) => {
                page.style.animation = 'none';
                setTimeout(() => {
                    page.style.animation = `fadeIn 0.6s ease-out ${index * 0.1}s`;
                }, 10);
            });
        }
    }

    /**
     * Announce page change for accessibility
     */
    announcePageChange() {
        const message = `Page ${this.currentPage} of ${this.totalPages}`;
        this.announce(message);
    }

    /**
     * Announce message for screen readers
     */
    announce(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    /**
     * Toggle audio playback
     */
    toggleAudio() {
        if (this.audioIsPlaying) {
            this.audioPlayer.pause();
        } else {
            // Reset and play audio
            this.audioPlayer.currentTime = 0;
            const playPromise = this.audioPlayer.play();

            if (playPromise !== undefined) {
                playPromise
                    .catch(error => {
                        console.log('Audio playback error:', error);
                        this.showNotification('Unable to play audio');
                    });
            }
        }
    }

    /**
     * Handle audio play event
     */
    onAudioPlay() {
        this.audioIsPlaying = true;
        this.audioPlayBtn.classList.add('playing');
        this.audioPlayBtn.innerHTML = '<span class="play-icon">⏸</span>';
        this.announce('Audio playing');
        console.log('🔊 Audio playback started');
    }

    /**
     * Handle audio pause event
     */
    onAudioPause() {
        this.audioIsPlaying = false;
        this.audioPlayBtn.classList.remove('playing');
        this.audioPlayBtn.innerHTML = '<span class="play-icon">▶</span>';
        this.announce('Audio paused');
    }

    /**
     * Handle audio end event
     */
    onAudioEnd() {
        this.audioIsPlaying = false;
        this.audioPlayBtn.classList.remove('playing');
        this.audioPlayBtn.innerHTML = '<span class="play-icon">▶</span>';
        this.showNotification('Audio playback completed');
        console.log('✓ Audio playback finished');
    }

    /**
     * Show notification to user
     */
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #e94560, #d63852);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            font-size: 14px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Add animation keyframes if not already present
        if (!document.querySelector('style[data-notification]')) {
            const style = document.createElement('style');
            style.setAttribute('data-notification', 'true');
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Get current page spread information
     */
    getCurrentSpreadInfo() {
        return {
            page: this.currentPage,
            total: this.totalPages,
            isFirstPage: this.currentPage === 1,
            isLastPage: this.currentPage === this.totalPages,
            spreadIndex: Math.ceil(this.currentPage / 2)
        };
    }

    /**
     * Analytics - Track page views
     */
    trackPageView() {
        const info = this.getCurrentSpreadInfo();
        console.log(`📖 Page ${info.page}/${info.total} viewed at ${new Date().toLocaleTimeString()}`);
    }
}

// Global utility functions

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Format time in mm:ss format
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Initialize magazine when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PrestigeMagazine();
    });
} else {
    new PrestigeMagazine();
}

// Optional: Add service worker support for offline functionality
if ('serviceWorker' in navigator) {
    // Commented out as service worker file not provided
    // navigator.serviceWorker.register('sw.js')
    //     .then(reg => console.log('Service Worker registered'))
    //     .catch(err => console.log('Service Worker registration failed'));
}