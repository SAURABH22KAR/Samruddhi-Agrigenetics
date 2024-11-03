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
