// STICKY FORM WITH SCROLL BEHAVIOR - Fixed Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Get the sticky container
    const stickyContainer = document.querySelector('.fixed.w-full.left-0.bottom-0.z-\\[99\\]');
    const form = document.querySelector('form');
    
    if (!stickyContainer) {
        console.error('Sticky container not found');
        return;
    }
    
    // Scroll behavior variables
    let lastScrollY = window.scrollY;
    let ticking = false;
    let isVisible = false;
    // Function to update sticky form visibility
    function updateStickyForm() {
        
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Show form when user scrolls down more than 100px
        if (scrollY > 100 && !isVisible) {
            stickyContainer.classList.add('show');
            
            document.getElementById("sticky-form-container").classList.add("animated");
            document.getElementById("sticky-form-nav").classList.add("animated");
            isVisible = true;
        } else if (scrollY <= 100 && isVisible) {
            stickyContainer.classList.remove('show');
            document.getElementById("sticky-form-container").classList.remove("animated");
            document.getElementById("sticky-form-nav").classList.remove("animated");
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
    
    // 1. Dropdown Toggle Logic
    const destinationsButton = document.querySelector('button[type="button"]');
    const destinationsDropdown = document.querySelector('.absolute.inset-x-0.z-50');
    let isDropdownOpen = false;
    
    if (destinationsButton && destinationsDropdown) {
        destinationsButton.addEventListener('click', function(e) {
            e.stopPropagation();
            isDropdownOpen = !isDropdownOpen;
            destinationsDropdown.classList.toggle('show', isDropdownOpen);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!destinationsButton.contains(e.target) && !destinationsDropdown.contains(e.target)) {
                isDropdownOpen = false;
                destinationsDropdown.classList.remove('show');
            }
        });
    }

    // 2. Form Submission Logic
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const selectedDestinations = [];
            const checkboxButtons = document.querySelectorAll('button[role="checkbox"]');
            checkboxButtons.forEach(button => {
                if (button.getAttribute('data-state') === 'checked') {
                    selectedDestinations.push(button.id);
                }
            });
            
            const startDate = document.querySelector('#\\:r1\\:-form-item')?.value;
            const endDate = document.querySelector('#\\:r2\\:')?.value;
            const guests = document.querySelector('.number-wrapper:first-child span')?.textContent;
            const bedrooms = document.querySelector('.number-wrapper:last-child span')?.textContent;
            
            console.log('Form submitted with data:', {
                destinations: selectedDestinations,
                startDate: startDate,
                endDate: endDate,
                guests: guests,
                bedrooms: bedrooms
            });
        });
    }

    // 3. Checkbox State
    const checkboxButtons = document.querySelectorAll('button[role="checkbox"]');
    checkboxButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentState = this.getAttribute('data-state') || 'unchecked';
            const newState = currentState === 'unchecked' ? 'checked' : 'unchecked';
            
            this.setAttribute('data-state', newState);
            this.setAttribute('aria-checked', newState === 'checked');
            
            const hiddenInput = this.nextElementSibling;
            if (hiddenInput && hiddenInput.type === 'checkbox') {
                hiddenInput.checked = newState === 'checked';
            }
            
            if (newState === 'checked') {
                this.classList.add('bg-dark', 'text-gold');
            } else {
                this.classList.remove('bg-dark', 'text-gold');
            }
        });
    });

    // 4. Counter Logic
    const updateCounter = (wrapperSelector, defaultValue, minCount = 0) => {
        const wrapper = document.querySelector(wrapperSelector);
        const buttons = wrapper.querySelectorAll('button');
        const display = wrapper.querySelector('span');
        let count = defaultValue;
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.textContent === '+') {
                    count++;
                } else if (this.textContent === '-' && count > minCount) {
                    count--;
                }
                
                if (wrapperSelector.includes('bedroom') && count === 0) {
                    display.textContent = 'All';
                } else {
                    display.textContent = count;
                }
            });
        });
    };
    
    updateCounter('.number-wrapper:first-child', 2, 1);
    updateCounter('.number-wrapper:last-child', 0, 0);

    console.log('✅ Sticky form with scroll behavior initialized');
});
