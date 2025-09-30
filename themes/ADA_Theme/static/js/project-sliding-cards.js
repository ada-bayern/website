/**
 * Integration script for ADA Theme sliding cards
 * This script integrates with the existing project.html template
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a project page with cards
    const projectContent = document.querySelector('.project-content');
    const leftSidebar = document.querySelector('.project-content .left');
    
    if (!projectContent || !leftSidebar) {
        return; // Not a project page
    }
    
    // Initialize sliding cards for the left sidebar
    const slidingCards = new SlidingCards({
        cardsSelector: '.project-content .left .card',
        containerSelector: '.project-content .left',
        threshold: 120,         // Account for any header
        cardThreshold: 50,      // Incremental threshold per card
        offset: 15,
        duration: 250
    });
    
    // Store reference for potential cleanup
    window.projectSlidingCards = slidingCards;
    
    // Optional: Add some custom styles for better integration
    const customStyles = `
        .project-content .left .card.sticky {
            left: 0;
            right: auto;
            max-width: 300px; /* Adjust based on your sidebar width */
        }
        
        .project-content .left .card {
            will-change: transform;
        }
        
        @media (max-width: 768px) {
            .project-content .left .card.sticky {
                position: relative !important;
                top: auto !important;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'ada-sliding-cards-styles';
    styleSheet.textContent = customStyles;
    document.head.appendChild(styleSheet);
});

// Cleanup when navigating away (for SPAs)
window.addEventListener('beforeunload', function() {
    if (window.projectSlidingCards) {
        window.projectSlidingCards.destroy();
    }
});
