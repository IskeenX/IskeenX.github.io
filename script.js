/* ===== NAVIGATION BAR ===== */
const slider = document.querySelector(".nav-slider");
const tabs = document.querySelectorAll(".nav nav a");
let index_value = 0;
let left_position = 10;
let isAnimating = false;

// Function to handle tab clicks
tabs.forEach((item, index) => {
    item.onclick = function(event) {
        event.preventDefault();

        // Prevent animation overlap
        if (isAnimating) return;
        isAnimating = true;

        // Reset active state of tabs
        tabs.forEach(tab => tab.classList.remove("active"));
        item.classList.add("active");

        // Handle tab animation (hover effect)
        let prevIndex = index_value;
        index_value = index;

        let start = Math.min(prevIndex, index);
        let end = Math.max(prevIndex, index);

        let delay = 40;

        // Add hovered effect to each tab in the range
        for (let i = start; i <= end; i++) {
            setTimeout(() => { tabs[i].classList.add("hovered"); }, Math.abs(i - start) * delay);
        }

        // Remove hovered effect after animation
        setTimeout(() => {
            tabs.forEach(tab => {
                if (!tab.classList.contains("active")) { tab.classList.remove("hovered"); }
            });
            isAnimating = false;
        }, (end - start + 1) * delay);

        // Update slider position based on the active tab width
        get_left_position();
        slider.style.width = item.clientWidth - 20 + "px";
        slider.style.left = left_position + "px";
        left_position = 10;

        // Load the section related to the clicked tab
        const section = item.getAttribute("onclick").match(/'([^']+)'/)[1]; 
        loadSection(section);
    };
});

// Function to calculate the left position of the slider based on active tab index
function get_left_position() {
    left_position = 10;
    for (let i = 0; i < index_value; i++) { left_position += tabs[i].clientWidth; }
}

// Function to load the content of a selected section dynamically
function loadSection(section) {
    fetch(`Pages/${section}.html`)
        .then(response => response.text())
        .then(data => {
            // Update the content of the main page
            document.getElementById('content').innerHTML = data;
        }).catch(error => console.error("Error loading page:", error));
}
// Function to scroll to target spot
function scrollToSpot(spotNumber) {
    let number_scroll = document.getElementById("spot" + spotNumber);
    number_scroll.scrollIntoView({ behavior: "smooth", block: "center" });
}