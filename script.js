// DOM Elements
const slider = document.querySelector(".nav-slider");
const tabs = document.querySelectorAll(".nav nav a");
const defaultPage = "about";

let index_value = 0;                            
let left_position = 10;
let isAnimating = false;

document.addEventListener("DOMContentLoaded", function () {
    history.scrollRestoration = 'manual';
    initNavigation();
    loadInitialPage();
    applyGlobalRippleEffect();
    applyInitialActiveButton();
});

// Initialize Navigation
function initNavigation() {
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", function (event) {
            event.preventDefault();
            handleTabClick(tab, index);
        });
    });

    // Handle back/forward navigation
    window.onpopstate = function () {
        const page = new URLSearchParams(window.location.search).get("page") || defaultPage;
        loadSection(page);
    };
}

// Load Initial Page from URL or Default
function loadInitialPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get("page") || defaultPage;
    loadSection(page);
}

// Load Page Content Dynamically
function loadSection(page) {
    const contentContainer = document.getElementById("content");
    fetch(`Pages/${page}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Page not found");
            return response.text();
        })
        .then(data => {
            contentContainer.innerHTML = data;
            history.pushState({}, "", `?page=${page}`);
            updateNavSlider(page);
            setActiveTab(page);
            applyGlobalRippleEffect();
        })
        .catch(error => {
            contentContainer.innerHTML = "<h2>Page not found</h2>";
            console.error("Error loading page:", error);
        });
}

// Handle Tab Click
function handleTabClick(tab, index) {
    if (isAnimating) return;
    isAnimating = true;

    // Reset active state
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    // Animate Tabs
    animateTabs(index);

    // Update slider position
    updateSliderPosition(tab);

    // Load Section
    const section = tab.getAttribute("onclick").match(/'([^']+)'/)[1];
    loadSection(section);
}

// Animate Tabs Hover Effect
function animateTabs(newIndex) {
    let prevIndex = index_value;
    index_value = newIndex;
    let start = Math.min(prevIndex, newIndex);
    let end = Math.max(prevIndex, newIndex);
    let delay = 40;

    for (let i = start; i <= end; i++) {
        setTimeout(() => { tabs[i].classList.add("hovered"); }, Math.abs(i - start) * delay);
    }

    setTimeout(() => {
        tabs.forEach(tab => {
            if (!tab.classList.contains("active")) {
                tab.classList.remove("hovered");
            }
        });
        isAnimating = false;
    }, (end - start + 1) * delay);
}

// Update Slider Position
function updateSliderPosition(tab) {
    getLeftPosition();
    slider.style.width = tab.clientWidth - 20 + "px";
    slider.style.left = left_position + "px";
    left_position = 10;
}

// Calculate Left Position for Slider
function getLeftPosition() {
    left_position = 10;
    for (let i = 0; i < index_value; i++) {
        left_position += tabs[i].clientWidth;
    }
}

// Update Active Tab Styling
function setActiveTab(activePage) {
    tabs.forEach(link => {
        const section = link.getAttribute("onclick").match(/'([^']+)'/)[1];
        link.classList.toggle("active", section === activePage);
    });
}

// Update Slider Position Based on Active Tab
function updateNavSlider(activePage) {
    tabs.forEach(link => {
        const section = link.getAttribute("onclick").match(/'([^']+)'/)[1];
        if (section === activePage) {
            slider.style.left = `${link.offsetLeft + 10}px`;
            slider.style.width = `${link.offsetWidth - 20}px`;
        }
    });
}

// Global Button Click Effect
function addRippleEffect(button) {
    button.addEventListener('mousedown', function() {
        let ripple = document.createElement('div');
        ripple.classList.add('ripple-effect');
        button.appendChild(ripple);

        // Trigger animation immediately
        requestAnimationFrame(() => {
            ripple.classList.add('animate');
        });

        // Remove ripple after transition
        ripple.addEventListener('transitionend', function() {
            ripple.remove();
        });
    });
}

// Apply Ripple Effect to All Buttons
function applyGlobalRippleEffect() {
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        addRippleEffect(button);
    });
}

// Number Navigation Button Activation
function activateNumberButton(button) {
    const numberButtons = document.querySelectorAll('.educationHTML .number-nav button');
    numberButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Apply Initial Active Button and Ripple Effect
function applyInitialActiveButton() {
    const firstButton = document.querySelector('.educationHTML .number-nav button:first-child');
    if (firstButton) {
        activateNumberButton(firstButton);

        // Manually trigger the ripple effect
        let ripple = document.createElement('div');
        ripple.classList.add('ripple-effect');
        firstButton.appendChild(ripple);

        requestAnimationFrame(() => {
            ripple.classList.add('animate');
        });

        ripple.addEventListener('transitionend', function() {
            ripple.remove();
        });
    }
}

// Scroll to Target Spot and Activate Button
function scrollToSpot(spotNumber) {
    let target = document.getElementById("spot" + spotNumber);
    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        const button = document.querySelector(`.educationHTML .number-nav button:nth-child(${spotNumber})`);
        if (button) {
            activateNumberButton(button);
        }
    }
}

// Function to scroll to any section by its ID, usable in HTML onclick
function scrollToElement(elementId, offset = 100) {
    let target = document.getElementById(elementId);
    if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - offset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}