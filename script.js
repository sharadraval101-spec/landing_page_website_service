document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Form Submission Handling (Hero Section)
       ========================================= */
    const leadForm = document.getElementById('leadForm');
    const formMessage = document.getElementById('formMessage');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload

            // Get the input elements
            const nameInput = document.getElementById('nameInput');
            const emailInput = document.getElementById('emailInput');
            const phoneInput = document.getElementById('phoneInput');
            const serviceInput = document.getElementById('serviceInput');

            if (nameInput.value && emailInput.value && phoneInput.value && serviceInput.value) {
                const submitBtn = leadForm.querySelector('button');
                const originalText = submitBtn.innerText;

                // Show loading state
                submitBtn.innerText = 'Submitting...';
                submitBtn.disabled = true;

                // Simulate API Call Delay
                setTimeout(() => {
                    // Reset button state
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;

                    // Show success message
                    formMessage.innerText = 'Thank you! We have received your request and will be in touch soon.';
                    formMessage.classList.add('success');

                    // Clear the inputs
                    nameInput.value = '';
                    emailInput.value = '';
                    phoneInput.value = '';
                    serviceInput.value = '';

                    // Hide the success message after 4 seconds
                    setTimeout(() => {
                        formMessage.classList.remove('success');
                        formMessage.innerText = '';
                    }, 4000);
                }, 1500);
            }
        });
    }

    /* =========================================
       2. FAQ Accordion Logic
       ========================================= */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Check if current item is active
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /* =========================================
       3. Video Play Button Alert
       ========================================= */
    const videoPlayBtn = document.getElementById('videoPlayBtn');

    if (videoPlayBtn) {
        videoPlayBtn.addEventListener('click', () => {
            alert('This would open a video player modal in a live environment!');
        });
    }

});