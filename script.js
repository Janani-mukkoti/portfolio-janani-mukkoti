// Portfolio JavaScript - Netflix-style Interactive Features

// Global variables
let currentlyExpandedCard = null;
let searchData = [];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

// Initialize all portfolio functionality
function initializePortfolio() {
    handleNavbarScroll();
    initializeSearch();
    initializeCards();
    initializeModal();
    smoothScrollForNavLinks();
    handleRowScrollButtons();
    populateSearchData();
    
    // Add loading animation removal after page load
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide navbar on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.querySelector('.search-icon');
    const searchContainer = document.querySelector('.search-container');
    
    // Create clear button
    const clearButton = document.createElement('button');
    clearButton.className = 'search-clear-btn';
    clearButton.innerHTML = '<i class="fas fa-times"></i>';
    clearButton.style.display = 'none';
    clearButton.style.cssText = `
        position: absolute;
        right: 45px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #b3b3b3;
        cursor: pointer;
        font-size: 14px;
        padding: 5px;
        border-radius: 50%;
        transition: color 0.3s ease;
        z-index: 10;
    `;
    
    // Add hover effect for clear button
    clearButton.addEventListener('mouseenter', () => {
        clearButton.style.color = '#E50914';
    });
    clearButton.addEventListener('mouseleave', () => {
        clearButton.style.color = '#b3b3b3';
    });
    
    searchContainer.appendChild(clearButton);
    
    // Search input events
    searchInput.addEventListener('input', (e) => {
        handleSearch();
        // Show/hide clear button based on input
        if (e.target.value.trim()) {
            clearButton.style.display = 'block';
        } else {
            clearButton.style.display = 'none';
        }
    });
    
    searchInput.addEventListener('focus', () => {
        searchIcon.style.color = '#E50914';
        searchContainer.style.transform = 'scale(1.02)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchIcon.style.color = '#b3b3b3';
        searchContainer.style.transform = 'scale(1)';
    });
    
    // Clear button functionality
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        handleSearch();
        searchInput.focus();
    });
    
    // Keyboard shortcuts
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            clearButton.style.display = 'none';
            handleSearch();
            searchInput.blur();
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            // Focus first visible card if search has results
            const firstVisibleCard = document.querySelector('.card[style*="opacity: 1"], .card:not([style*="opacity"])');
            if (firstVisibleCard) {
                firstVisibleCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstVisibleCard.focus();
            }
        }
    });
}

// Handle search functionality
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.card');
    
    if (searchTerm === '') {
        // Show all cards
        cards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
        return;
    }
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
        const details = card.querySelector('.card-details')?.textContent.toLowerCase() || '';
        
        const isMatch = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       details.includes(searchTerm);
        
        if (isMatch) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            
            // Add highlight effect
            card.style.boxShadow = '0 0 20px rgba(229, 9, 20, 0.5)';
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 2000);
        } else {
            card.style.opacity = '0.3';
            card.style.transform = 'scale(0.95)';
        }
    });
}

// Populate search data for better search functionality
function populateSearchData() {
    const cards = document.querySelectorAll('.card');
    searchData = [];
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent || '';
        const description = card.querySelector('.card-description')?.textContent || '';
        const category = card.getAttribute('data-category') || '';
        
        searchData.push({
            element: card,
            title: title.toLowerCase(),
            description: description.toLowerCase(),
            category: category.toLowerCase(),
            searchString: `${title} ${description} ${category}`.toLowerCase()
        });
    });
}

// Card interactions
function initializeCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            if (currentlyExpandedCard && currentlyExpandedCard !== card) {
                collapseCard(currentlyExpandedCard);
            }
        });
        
        // Add click functionality for mobile
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (window.innerWidth <= 768) {
                openCardModal(card);
            } else {
                toggleCardExpansion(card);
            }
        });
        
        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

// Toggle card expansion
function toggleCardExpansion(card) {
    if (currentlyExpandedCard === card) {
        collapseCard(card);
        currentlyExpandedCard = null;
    } else {
        if (currentlyExpandedCard) {
            collapseCard(currentlyExpandedCard);
        }
        expandCard(card);
        currentlyExpandedCard = card;
    }
}

// Expand card
function expandCard(card) {
    const details = card.querySelector('.card-details');
    if (details) {
        details.style.display = 'block';
        card.classList.add('expanded');
        
        // Scroll card into view
        setTimeout(() => {
            card.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
        }, 100);
    }
}

// Collapse card
function collapseCard(card) {
    const details = card.querySelector('.card-details');
    if (details) {
        card.classList.remove('expanded');
    }
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('cardModal');
    const closeBtn = document.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Open card modal
function openCardModal(card) {
    const modal = document.getElementById('cardModal');
    const modalBody = document.getElementById('modalBody');
    
    const title = card.querySelector('.card-title')?.textContent || '';
    const description = card.querySelector('.card-description')?.textContent || '';
    const details = card.querySelector('.card-details')?.innerHTML || '';
    const image = card.querySelector('.card-image img')?.src || '';
    
    modalBody.innerHTML = `
        <div class="modal-card">
            <div class="modal-image">
                <img src="${image}" alt="${title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
            </div>
            <h2 style="color: #E50914; margin-bottom: 10px;">${title}</h2>
            <p style="color: #b3b3b3; margin-bottom: 20px; font-size: 1.1rem;">${description}</p>
            <div class="modal-details">
                ${details}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('cardModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Smooth scrolling for navigation links
function smoothScrollForNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link, .footer-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
            top: sectionTop - navbarHeight - 20,
            behavior: 'smooth'
        });
    }
}

// Row scrolling functionality
function handleRowScrollButtons() {
    const scrollButtons = document.querySelectorAll('.scroll-btn');
    
    scrollButtons.forEach(button => {
        button.addEventListener('click', () => {
            const direction = button.classList.contains('scroll-left') ? 'left' : 'right';
            const row = button.closest('.content-row');
            const rowId = row.id;
            scrollRow(rowId, direction);
        });
    });
}

// Scroll row function
function scrollRow(rowId, direction) {
    const container = document.querySelector(`#${rowId} .cards-container`);
    if (!container) return;
    
    const scrollAmount = 320; // Card width + gap
    const currentScroll = container.scrollLeft;
    
    if (direction === 'left') {
        container.scrollTo({
            left: currentScroll - scrollAmount,
            behavior: 'smooth'
        });
    } else {
        container.scrollTo({
            left: currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // Update button visibility
    setTimeout(() => updateScrollButtons(container), 300);
}

// Update scroll button visibility
function updateScrollButtons(container) {
    const row = container.closest('.content-row');
    const leftBtn = row.querySelector('.scroll-left');
    const rightBtn = row.querySelector('.scroll-right');
    
    const isAtStart = container.scrollLeft <= 10;
    const isAtEnd = container.scrollLeft >= (container.scrollWidth - container.clientWidth - 10);
    
    leftBtn.style.opacity = isAtStart ? '0.5' : '1';
    rightBtn.style.opacity = isAtEnd ? '0.5' : '1';
    
    leftBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
    rightBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
}

// Initialize scroll buttons visibility
function initializeScrollButtonsVisibility() {
    const containers = document.querySelectorAll('.cards-container');
    containers.forEach(container => {
        updateScrollButtons(container);
        
        container.addEventListener('scroll', () => {
            updateScrollButtons(container);
        });
    });
}

// Resume download function
function downloadResume() {
    // Use your actual resume file
    const resumeUrl = './Janani_M_Resume.pdf'; // Path to your resume
    
    try {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = 'Janani_M_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Resume downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error downloading resume:', error);
        // Fallback: try opening in new tab
        window.open(resumeUrl, '_blank');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'info' ? 'info-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'info' ? '#333' : '#E50914'};
        color: white;
        padding: 15px 20px;
        border-radius: 25px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Intersection Observer for fade-in animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    const elementsToObserve = document.querySelectorAll('.card, .content-row, .about-section');
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Handle touch events for mobile swipe
function initializeTouchEvents() {
    const containers = document.querySelectorAll('.cards-container');
    
    containers.forEach(container => {
        let startX = 0;
        let scrollLeft = 0;
        let isDown = false;
        
        container.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
        
        container.addEventListener('touchend', () => {
            isDown = false;
        });
    });
}

// Initialize all event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeScrollButtonsVisibility();
    initializeIntersectionObserver();
    initializeTouchEvents();
});

// Window resize handler
window.addEventListener('resize', () => {
    // Update scroll buttons visibility on resize
    const containers = document.querySelectorAll('.cards-container');
    containers.forEach(updateScrollButtons);
    
    // Close expanded cards on mobile
    if (window.innerWidth <= 768 && currentlyExpandedCard) {
        collapseCard(currentlyExpandedCard);
        currentlyExpandedCard = null;
    }
});

// Performance optimization - Debounce scroll events
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

// Apply debounce to scroll handlers
const debouncedScrollHandler = debounce(() => {
    const containers = document.querySelectorAll('.cards-container');
    containers.forEach(updateScrollButtons);
}, 100);

document.addEventListener('scroll', debouncedScrollHandler);

// Analytics and tracking (optional)
function trackCardInteraction(cardTitle, action) {
    // You can integrate with Google Analytics or other tracking services here
    console.log(`Card interaction: ${cardTitle} - ${action}`);
}

// Add click tracking to cards
document.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) {
        const cardTitle = card.querySelector('.card-title')?.textContent || 'Unknown';
        trackCardInteraction(cardTitle, 'clicked');
    }
});

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.card-image img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/300x200/1a1a1a/e50914?text=Image+Not+Found';
            this.alt = 'Image not found';
        });
    });
});

// Preload next section images for better UX
function preloadImages() {
    const images = document.querySelectorAll('.card-image img');
    const imageUrls = Array.from(images).map(img => img.src);
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize preloading
window.addEventListener('load', preloadImages);

// Service worker registration (for PWA features - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Contact Modal Functions
function openContactModal() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('contactModal');
    if (e.target === modal) {
        closeContactModal();
    }
});

// Close modal with Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('contactModal');
        if (modal.style.display === 'block') {
            closeContactModal();
        }
    }
});

// Export functions for global access
window.scrollToSection = scrollToSection;
window.scrollRow = scrollRow;
window.downloadResume = downloadResume;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
