document.addEventListener("DOMContentLoaded", function() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');         // Toggle burger animation
        navLinks.classList.toggle('active');       // Show/hide menu
    });

    // Close the menu when a link is clicked
    navLinks.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {        // Check if a link was clicked
            burger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});




document.addEventListener("DOMContentLoaded", () => {
    const animatedSections = document.querySelectorAll(".animated");

    const animateOnScroll = () => {
        animatedSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if section is in view
            if (rect.top < windowHeight - 100) {
                section.classList.add("fade-in");
            }
        });
    };

    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll();
});


