// Hover Animation System - Matching 6113e18bb93f1d002d529c18.html
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize text slide-up animations
    function initTextAnimations() {
        const textElements = document.querySelectorAll('h1, h2, h3, p, .text-slide-up');
        
        // Create observer for scroll-triggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 100); // Staggered animation
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        textElements.forEach(element => {
            element.classList.add('text-slide-up');
            observer.observe(element);
        });
    }
    
    // Enhance dropdown animations
    function enhanceDropdowns() {
        const dropdownContainers = document.querySelectorAll('.relative > span');
        
        dropdownContainers.forEach(container => {
            const dropdown = container.querySelector('ul');
            if (!dropdown) return;
            
            // Add smooth transition
            dropdown.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            
            // Handle hover events
            container.addEventListener('mouseenter', () => {
                dropdown.style.transform = 'scaleY(1) translateZ(0px)';
                
                // Animate list items with staggered delays
                const listItems = dropdown.querySelectorAll('li');
                listItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(10px)';
                    
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50 + (index * 50)); // Staggered animation
                });
            });
            
            container.addEventListener('mouseleave', () => {
                dropdown.style.transform = 'scaleY(0) translateZ(0px)';
                
                // Reset list items
                const listItems = dropdown.querySelectorAll('li');
                listItems.forEach(item => {
                    item.style.opacity = '';
                    item.style.transform = '';
                });
            });
        });
    }
    
    // Add smooth scroll behavior
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Add parallax effect to hero sections
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // Initialize all animations
    initTextAnimations();
    enhanceDropdowns();
    initSmoothScroll();
    initParallax();
    
    console.log('✅ Hover animation system initialized');
});
