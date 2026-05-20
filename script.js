// Mobile navigation, smooth anchor behavior and lightweight form feedback.
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navDropdownButtons = document.querySelectorAll(".nav-dropdown-toggle");
const navItems = document.querySelectorAll(".nav-links a, .brand[href^='#'], .hero-actions a, .product-card a, .download-item");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
const productFilterPanel = document.querySelector("[data-product-filters]");
const productCards = document.querySelectorAll("[data-product-card]");
const filterEmpty = document.querySelector("[data-filter-empty]");
const driveTabs = document.querySelector("[data-drive-tabs]");

function closeMegaMenus() {
    document.querySelectorAll(".nav-item.is-open").forEach((item) => {
        item.classList.remove("is-open");
        const button = item.querySelector(".nav-dropdown-toggle");
        if (button) {
            button.setAttribute("aria-expanded", "false");
        }
    });
}

function closeMenu() {
    menuToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    closeMegaMenus();
}

function openMenu() {
    menuToggle.classList.add("is-open");
    navLinks.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
}

// Toggle the mobile hamburger menu.
menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.contains("is-open");
    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Mobile mega-menu accordions. Desktop mega menus open through CSS hover/focus.
navDropdownButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        if (window.innerWidth > 900) {
            return;
        }

        event.preventDefault();
        const navItem = button.closest(".nav-item");
        const isOpen = navItem.classList.contains("is-open");

        closeMegaMenus();

        if (!isOpen) {
            navItem.classList.add("is-open");
            button.setAttribute("aria-expanded", "true");
        }
    });
});

// Smoothly scroll to in-page sections and close the mobile menu after selection.
navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
        const targetId = item.getAttribute("href");

        if (!targetId || !targetId.startsWith("#")) {
            return;
        }

        const target = document.querySelector(targetId);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMenu();
    });
});

// Demo contact-form response without sending data to a server.
if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        formStatus.textContent = "Thank you. The INFINAIR engineering team will contact you shortly.";
        contactForm.reset();
    });
}

// Product-family filters. Data attributes make additional models easy to add.
if (productFilterPanel && productCards.length) {
    const activeFilters = {
        pressure: "all",
        application: "all",
        drive: "all",
    };

    function cardMatches(card, filterName, filterValue) {
        if (filterValue === "all") {
            return true;
        }

        const values = (card.dataset[filterName] || "").split(" ");
        return values.includes(filterValue);
    }

    function updateProductGrid() {
        let visibleCount = 0;

        productCards.forEach((card) => {
            const isVisible =
                cardMatches(card, "pressure", activeFilters.pressure) &&
                cardMatches(card, "application", activeFilters.application) &&
                cardMatches(card, "drive", activeFilters.drive);

            card.classList.toggle("is-hidden", !isVisible);
            if (isVisible) {
                visibleCount += 1;
            }
        });

        if (filterEmpty) {
            filterEmpty.hidden = visibleCount > 0;
        }
    }

    productFilterPanel.addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter]");
        if (!button) {
            return;
        }

        const filterName = button.dataset.filter;
        activeFilters[filterName] = button.dataset.value;

        productFilterPanel
            .querySelectorAll(`[data-filter="${filterName}"]`)
            .forEach((item) => item.classList.remove("is-active"));

        button.classList.add("is-active");
        updateProductGrid();
    });
}

// Product detail drive configuration tabs.
if (driveTabs) {
    const tabButtons = driveTabs.querySelectorAll("[data-drive-tab]");
    const tabPanels = driveTabs.querySelectorAll("[data-drive-panel]");

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetDrive = button.dataset.driveTab;

            tabButtons.forEach((item) => {
                const isActive = item === button;
                item.classList.toggle("is-active", isActive);
                item.setAttribute("aria-selected", String(isActive));
            });

            tabPanels.forEach((panel) => {
                panel.classList.toggle("is-active", panel.dataset.drivePanel === targetDrive);
            });
        });
    });
}

// Close the mobile menu if the viewport returns to desktop width.
window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        closeMenu();
    } else {
        closeMegaMenus();
    }
});
