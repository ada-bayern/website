/**
 * Sliding Cards with Sticky Behavior
 * Cards will stick to the top of the screen when they reach a threshold
 * and continue to be fixed until the last card is processed
 * Supports reverse scrolling and incremental thresholds
 */

class SlidingCards {
    constructor(options = {}) {
        this.cardsSelector = options.cardsSelector || '.card';
        this.containerSelector = options.containerSelector || '.cards-container';
        this.threshold = options.threshold || 100; // pixels from top (global threshold)
        this.cardThreshold = options.cardThreshold || 10; // additional threshold per card
        this.offset = options.offset || 10; // spacing between stacked cards
        this.duration = options.duration || 300; // animation duration in ms
        
        this.cards = [];
        this.container = null;
        this.isSticky = false;
        this.stickyCards = [];
        this.lastScrollY = 0;
        this.scrollDirection = 'down';
        
        this.init();
    }
    
    init() {
        this.container = document.querySelector(this.containerSelector);
        if (!this.container) {
            console.warn('Cards container not found');
            return;
        }
        
        this.cards = Array.from(document.querySelectorAll(this.cardsSelector));
        if (this.cards.length === 0) {
            console.warn('No cards found');
            return;
        }
        
        this.setupCards();
        this.bindEvents();
        this.handleScroll(); // Initial check
    }
    
    setupCards() {
        // Store the original container height before any cards become sticky
        const containerRect = this.container.getBoundingClientRect();
        this.originalContainerHeight = containerRect.height;
        this.container.dataset.originalHeight = this.originalContainerHeight;
        
        // Add necessary CSS classes and data attributes
        this.cards.forEach((card, index) => {
            card.classList.add('sliding-card');
            card.setAttribute('data-card-index', index);
            
            // Store original position more reliably
            const rect = card.getBoundingClientRect();
            const scrollY = window.scrollY;
            card.dataset.originalTop = rect.top + scrollY;
            
            // Store original width including borders and padding (full visual width)
            const computedStyle = window.getComputedStyle(card);
            const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
            const borderRight = parseFloat(computedStyle.borderRightWidth) || 0;
            const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
            const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
            
            // Use getBoundingClientRect for the most accurate visual width
            const fullWidth = rect.width;
            card.dataset.originalWidth = fullWidth;
            
            console.log(`Card ${index}: Original width = ${fullWidth}px`);
        });
        
        // CSS styles should be included separately as sliding-cards.css
    }
    
    bindEvents() {
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 100));
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Determine scroll direction (keep for debug info only)
        this.scrollDirection = scrollY > this.lastScrollY ? 'down' : 'up';
        this.lastScrollY = scrollY;
        
        const containerRect = this.container.getBoundingClientRect();
        const containerTop = containerRect.top + scrollY;
        const containerBottom = containerTop + containerRect.height;
        
        // Check if all cards should be in final stacked position
        const allCardsPassedThreshold = this.cards.every((card, index) => {
            const originalTop = parseFloat(card.dataset.originalTop);
            const cardStickyThreshold = this.threshold + (index * this.cardThreshold);
            return originalTop <= scrollY + cardStickyThreshold;
        });
        
        // Process cards in order for proper stacking
        this.cards.forEach((card, index) => {
            // Get the original position of the card (without any transforms)
            const originalTop = parseFloat(card.dataset.originalTop) || (card.getBoundingClientRect().top + scrollY);
            if (!card.dataset.originalTop) {
                card.dataset.originalTop = originalTop;
            }
            
            // Calculate incremental threshold for this card to become sticky
            const cardStickyThreshold = this.threshold + (index * this.cardThreshold);
            
            // Check if card fits in viewport
            const cardHeight = card.offsetHeight;
            const computedStyle = window.getComputedStyle(card);
            const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
            const totalCardHeight = cardHeight + marginBottom;
            const viewportHeight = window.innerHeight;
            const availableSpace = viewportHeight - cardStickyThreshold;
            
            let shouldBeSticky;
            
            if (totalCardHeight <= availableSpace) {
                // Card fits completely in viewport - use normal sticky logic
                shouldBeSticky = originalTop <= scrollY + cardStickyThreshold;
            } else {
                // Card doesn't fit - only stick when bottom is visible
                const cardBottom = originalTop + totalCardHeight;
                shouldBeSticky = cardBottom <= scrollY + viewportHeight;
            }
            
            // Check if we've scrolled past the container bottom
            const pastContainer = scrollY > containerBottom - this.getStackedCardsHeight();
            
            if (shouldBeSticky && pastContainer) {
                // Card should be in final stacked position (absolute)
                this.makeCardFinalStacked(card, index);
            } else if (shouldBeSticky && !pastContainer) {
                // Card should be sticky (fixed)
                this.makeCardSticky(card, index);
            } else {
                // Card should be normal
                this.makeCardNormal(card, index);
            }
        });
        
        this.updateStackedPositions();
    }
    
    cleanupSpacers() {
        // Remove spacers for cards that are no longer sticky, in reverse order (bottom first)
        const spacers = Array.from(document.querySelectorAll('.cards-spacer'));
        const normalCards = this.cards.filter((card, index) => 
            !card.classList.contains('sticky') && !card.classList.contains('final-stacked')
        );
        
        // Remove spacers for normal cards in reverse order
        normalCards.reverse().forEach(card => {
            const spacer = card.nextElementSibling;
            if (spacer && spacer.classList.contains('cards-spacer')) {
                spacer.remove();
            }
        });
    }
    
    makeCardSticky(card, index) {
        if (!card.classList.contains('sticky')) {
            // Use the pre-stored original width from setup
            const originalWidth = parseFloat(card.dataset.originalWidth);
            
            // Remove final-stacked class if transitioning from final-stacked to sticky
            card.classList.remove('final-stacked');
            card.classList.add('sticky');
            
            // Reset any absolute positioning from final-stacked state
            card.style.position = 'fixed';
            card.style.bottom = '';
            card.style.left = '';
            
            // Create spacer to maintain layout and prevent page jumps
            if (!card.nextElementSibling?.classList.contains('cards-spacer')) {
                const spacer = document.createElement('div');
                spacer.classList.add('cards-spacer');
                const computedStyle = window.getComputedStyle(card);
                const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
                
                // Calculate how much extra scroll distance was needed for large cards
                const cardHeight = card.offsetHeight;
                const totalCardHeight = cardHeight + marginBottom;
                const viewportHeight = window.innerHeight;
                const cardStickyThreshold = this.threshold + (index * this.cardThreshold);
                const availableSpace = viewportHeight - cardStickyThreshold;
                
                let spacerHeight = cardHeight + marginBottom;
                
                if (totalCardHeight > availableSpace) {
                    // Card didn't fit - add extra scroll distance to spacer
                    const extraScrollDistance = totalCardHeight - availableSpace;
                    spacerHeight += extraScrollDistance;
                }
                
                spacer.style.height = spacerHeight + 'px';
                spacer.style.width = '100%';
                spacer.style.visibility = 'hidden'; // Keep space but invisible
                card.parentNode.insertBefore(spacer, card.nextElementSibling);
            }
            
            // Force the original width immediately
            card.style.width = originalWidth + 'px';
            card.style.minWidth = originalWidth + 'px';
            card.style.maxWidth = originalWidth + 'px';
            
            // Ensure container maintains its original height
            this.maintainContainerHeight();
        }
        
        if (!this.stickyCards.includes(index)) {
            this.stickyCards.push(index);
        }
    }
    
    makeCardFinalStacked(card, index) {
        if (!card.classList.contains('final-stacked')) {
            // Remove sticky class and add final-stacked
            card.classList.remove('sticky');
            card.classList.add('final-stacked');
            
            // Use the pre-stored original width
            const originalWidth = parseFloat(card.dataset.originalWidth);
            
            // Calculate position from bottom with reverse stacking
            const reversedIndex = this.cards.length - 1 - index;
            const bottomOffset = reversedIndex * this.offset;
            
            // Position absolutely within the container
            card.style.position = 'absolute';
            card.style.top = 'auto';
            card.style.bottom = bottomOffset + 'px';
           
            card.style.width = originalWidth + 'px';
            card.style.minWidth = originalWidth + 'px';
            card.style.maxWidth = originalWidth + 'px';
            card.style.zIndex = 500 + index;
            
            // Remove spacer as card is now in document flow
            const spacer = card.parentNode.querySelector('.cards-spacer');
            if (spacer) {
                spacer.remove();
            }
            
            console.log(`Card ${index} final stacked at bottom: ${bottomOffset}px`);
        }
        
        if (!this.stickyCards.includes(index)) {
            this.stickyCards.push(index);
        }
    }
    
    makeCardNormal(card, index) {
        if (card.classList.contains('sticky') || card.classList.contains('final-stacked')) {
            card.classList.remove('sticky', 'final-stacked');
            card.style.position = '';
            card.style.width = '';
            card.style.minWidth = '';
            card.style.maxWidth = '';
            card.style.top = '';
            card.style.bottom = '';
            card.style.transform = ''; // Reset transform (scale)
            card.style.zIndex = ''; // Reset z-index to default
            card.style.setProperty('--stack-offset', '0px');
            
            // Don't remove spacer here - let the cleanup happen in proper order
            
            // Maintain container height when cards return to normal
            this.maintainContainerHeight();
        }
        
        const stickyIndex = this.stickyCards.indexOf(index);
        if (stickyIndex > -1) {
            this.stickyCards.splice(stickyIndex, 1);
        }
        
        // Remove spacers in proper order after all cards are processed
        this.cleanupSpacers();
    }
    
    updateStackedPositions() {
        // Sort sticky cards by their original index
        this.stickyCards.sort((a, b) => a - b);
        
        this.stickyCards.forEach((cardIndex, stackIndex) => {
            const card = this.cards[cardIndex];
            
            // Skip if card is in final stacked position
            if (card.classList.contains('final-stacked')) {
                return;
            }
            
            // Each card sticks at its own trigger position + stack offset
            const cardStickyThreshold = this.threshold + (cardIndex * this.cardThreshold);
            const stackOffset = stackIndex * this.offset;
            const finalPosition = cardStickyThreshold + stackOffset;
            
            card.style.top = finalPosition + 'px';
            card.style.setProperty('--stack-offset', stackOffset + 'px');
            
            // Calculate dynamic scale: first card smallest, last card scale 1
            const totalCards = this.cards.length;
            const scaleIncrement = 0.02 ;
            const baseScale = 1 - ((totalCards - 1) * scaleIncrement); // Starting scale for first card
            const cardScale = baseScale + (cardIndex * scaleIncrement);
            card.style.transform = `scale(${cardScale})`;
            
            // Higher index cards (bottom elements) should have higher z-index (appear on top)
            card.style.zIndex = 500 + cardIndex;
        });
    }
    
    getStackedCardsHeight() {
        // Calculate total height needed for all stacked cards
        const totalCards = this.cards.length;
        const lastCardThreshold = this.threshold + ((totalCards - 1) * this.cardThreshold);
        const stackHeight = (totalCards - 1) * this.offset;
        return lastCardThreshold + stackHeight + 100; // Add buffer
    }
    
    maintainContainerHeight() {
        // Ensure the container always maintains its original height
        const originalHeight = parseFloat(this.container.dataset.originalHeight);
        if (originalHeight) {
            // Add the last card's height to ensure proper container height
            const lastCard = this.cards[this.cards.length - 1];
            const lastCardHeight = lastCard ? lastCard.offsetHeight : 0;
            this.container.style.minHeight = (originalHeight + lastCardHeight) + 'px';
        }
    }
    
    handleResize() {
        // Recalculate positions on resize
        this.cards.forEach(card => {
            if (card.classList.contains('sticky')) {
                card.classList.remove('sticky');
                card.style.width = '';
                card.style.top = '';
                card.style.zIndex = '';
            }
            
            // Recalculate original positions and widths
            const rect = card.getBoundingClientRect();
            const scrollY = window.scrollY;
            card.dataset.originalTop = rect.top + scrollY;
            card.dataset.originalWidth = card.offsetWidth;
        });
        
        this.stickyCards = [];
        
        // Remove spacers
        document.querySelectorAll('.cards-spacer').forEach(spacer => spacer.remove());
        
        // Recalculate
        setTimeout(() => {
            this.handleScroll();
        }, 100);
    }
    
    // Utility function to throttle scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Public methods
    destroy() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        // Reset container height
        this.container.style.minHeight = '';
        delete this.container.dataset.originalHeight;
        
        this.cards.forEach(card => {
            card.classList.remove('sliding-card', 'sticky', 'final-stacked');
            card.style.position = '';
            card.style.width = '';
            card.style.minWidth = '';
            card.style.maxWidth = '';
            card.style.top = '';
            card.style.bottom = '';
            card.style.transform = ''; // Reset transform (scale)
            card.style.zIndex = '';
            card.style.setProperty('--stack-offset', '0px');
            delete card.dataset.originalWidth;
            delete card.dataset.originalTop;
        });
        
        document.querySelectorAll('.cards-spacer').forEach(spacer => spacer.remove());
    }
    
    updateThreshold(newThreshold) {
        this.threshold = newThreshold;
        this.handleScroll();
    }
    
    updateCardThreshold(newCardThreshold) {
        this.cardThreshold = newCardThreshold;
        this.handleScroll();
    }
    
    updateOffset(newOffset) {
        this.offset = newOffset;
        this.updateStackedPositions();
    }
}

// Auto-initialize if DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with default settings
    window.slidingCards = new SlidingCards({
        cardsSelector: '.card',
        containerSelector: '.cards',
        threshold: 60,         // Global threshold
        cardThreshold: 0,      // Additional threshold per card
        offset: 0,
        duration: 300
    });
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SlidingCards;
}
