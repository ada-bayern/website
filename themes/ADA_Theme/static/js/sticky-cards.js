class StickyCardsEqualHeight {
    constructor() {
        this.cards = document.querySelectorAll('.sticky-cards .card');
        this.equalHeightEnabled = true;
        this.maxHeight = 0;

        console.log(`Found ${this.cards.length} cards`);

        this.init();
        this.setupControls();
       // this.setupIntersectionObserver();
    }

    init() {
        this.calculateMaxHeight();
        // applyEqualHeights is now called from within calculateMaxHeight
    }
 
    calculateMaxHeight() {
        // Temporarily remove equal heights to get natural heights
        this.cards.forEach(card => {
            card.style.height = '';
            card.classList.remove('equal-height');
        });

        // Use a small timeout to ensure DOM has updated
        setTimeout(() => {
            // Find the maximum height
            this.maxHeight = 0;
            this.cards.forEach(card => {
                const height = card.offsetHeight;
                if (height > this.maxHeight) {
                    this.maxHeight = height;
                }
            });

            console.log(`Maximum card height found: ${this.maxHeight}px`);
            if (this.maxHeight > window.innerHeight - 150) {
                this.equalHeightEnabled = false;
                this.removeEqualHeights();
            }
            // Apply equal heights if enabled
            if (this.equalHeightEnabled) {
                this.applyEqualHeights();
            }
        }, 10); // Small delay to ensure DOM has updated
    }

    applyEqualHeights() {
        if (!this.equalHeightEnabled || this.maxHeight === 0) return;

        this.cards.forEach((card, index) => {
            card.style.height = this.maxHeight + 'px';
            card.classList.add('equal-height');
            console.log(`Card ${index + 1}: Set to height = ${this.maxHeight}px`);
        });

        const heightStatus = document.getElementById('height-status');
        if (heightStatus) {
            heightStatus.textContent = 'Equal Heights Active';
        }
    }

    removeEqualHeights() {
        this.cards.forEach(card => {
            card.style.height = '';
            card.classList.remove('equal-height');
        });

        const heightStatus = document.getElementById('height-status');
        if (heightStatus) {
            heightStatus.textContent = 'Natural Heights';
        }
    }

    setupControls() {
        const thresholdSlider = document.getElementById('threshold');
        const incrementSlider = document.getElementById('increment');
        const thresholdValue = document.getElementById('threshold-value');
        const incrementValue = document.getElementById('increment-value');

        if (thresholdSlider && thresholdValue) {
            thresholdSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                document.documentElement.style.setProperty('--threshold', value + 'px');
                thresholdValue.textContent = value + 'px';
            });
        }

        if (incrementSlider && incrementValue) {
            incrementSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                document.documentElement.style.setProperty('--card-increment', value + 'px');
                incrementValue.textContent = value + 'px';
            });
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('sticky-active');
                } else {
                    entry.target.classList.remove('sticky-active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-60px 0px'
        });

        this.cards.forEach(card => observer.observe(card));
    }

    toggleEqualHeight() {
        this.equalHeightEnabled = !this.equalHeightEnabled;

        if (this.equalHeightEnabled) {
            this.calculateMaxHeight();
            // applyEqualHeights is now called from within calculateMaxHeight
        } else {
            this.removeEqualHeights();
        }
    }

    reset() {
        // Reset to default values
        document.documentElement.style.setProperty('--threshold', '60px');
        document.documentElement.style.setProperty('--card-increment', '20px');
        
        const thresholdSlider = document.getElementById('threshold');
        const incrementSlider = document.getElementById('increment');
        const thresholdValue = document.getElementById('threshold-value');
        const incrementValue = document.getElementById('increment-value');
        
        if (thresholdSlider) thresholdSlider.value = 60;
        if (incrementSlider) incrementSlider.value = 20;
        if (thresholdValue) thresholdValue.textContent = '60px';
        if (incrementValue) incrementValue.textContent = '20px';

        // Recalculate heights
        this.calculateMaxHeight();
        // applyEqualHeights is now called from within calculateMaxHeight
    }
}

// Global functions for buttons
function toggleEqualHeight() {
    window.stickyCards.toggleEqualHeight();
}

function resetCards() {
    window.stickyCards.reset();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.stickyCards = new StickyCardsEqualHeight();
});

// Handle window resize with debouncing
let resizeTimeout;
window.addEventListener('resize', function () {
    if (window.stickyCards) {
        console.log('Resize event triggered');
        // Clear previous timeout
        clearTimeout(resizeTimeout);
        
        // Set new timeout to debounce resize events
        resizeTimeout = setTimeout(() => {
            console.log('Executing resize handler after debounce');
            window.stickyCards.calculateMaxHeight();
            // applyEqualHeights is now called from within calculateMaxHeight
        }, 150); // Wait 150ms after resize stops
    }
});
