// SCROLL BEHAVIOR - Change element style on scroll
document.addEventListener('DOMContentLoaded', function() {
    
    // Scroll behavior variables
    let lastScrollY = window.scrollY;
    let ticking = false;
    let isVisible = false;
    
    // Function to update sticky form visibility
    function updateStickyForm() {
        const scrollY = window.scrollY;
        
        // When user scrolls down below 10px
        if (scrollY > 10 && !isVisible) {
           
            document.getElementById("sticky-form-nav").style.backgroundColor = "black"
            isVisible = true;
        } 
        // When user scrolls back above 10px
        else if (scrollY <= 10 && isVisible) {
            // Add your logic here for scrolling above 10px
            // Example: stickyContainer.classList.remove('scrolled');
            document.getElementById("sticky-form-nav").style.backgroundColor = "transparent"
            isVisible = false;
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    // Request animation frame for smooth performance
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateStickyForm);
            ticking = true;
        }
    }
    
    // Handle scroll events
    window.addEventListener('scroll', requestTick);
    
    // Initialize on load
    updateStickyForm();
    
    console.log('🎯 Scroll behavior template ready - customize your logic in updateStickyForm()');
});
