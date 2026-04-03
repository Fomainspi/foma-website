let currentLang = localStorage.getItem('preferredLanguage') || "en";

// Load header dynamically (use relative path for local server)
fetch("components/header.html?t=" + Date.now())
    .then(res => res.text())
    .then(data => {
        document.body.insertAdjacentHTML("afterbegin", data);
        // Force reload the logo image
        const logoImg = document.querySelector('.logo-img');
        if (logoImg) {
            logoImg.src = logoImg.src.split('?')[0] + '?t=' + Date.now();
        }
        // Hide back to home button on home page
        if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
            const backHomeLi = document.querySelector('.back-home-li');
            const homeLi = document.querySelector('.home-li');
            if (backHomeLi) backHomeLi.style.display = 'none';
            if (homeLi) homeLi.style.display = 'block';
        } else {
            const backHomeLi = document.querySelector('.back-home-li');
            const homeLi = document.querySelector('.home-li');
            if (backHomeLi) backHomeLi.style.display = 'block';
            if (homeLi) homeLi.style.display = 'none';
        }
        setupLanguageSwitcher();
        applyTranslations(); // Apply language after header loads
    })
    .catch(error => console.error('Error loading header:', error));

// Setup language switcher in header
function setupLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.language-switch button, .blog-language-switch button');
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            setLanguage(this.textContent.toLowerCase());
        });
    });
    updateLanguageButtonStyles();
}

// Set language globally
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    applyTranslations();
    updateLanguageButtonStyles();
}

// Update language button styles
function updateLanguageButtonStyles() {
    const langBtns = document.querySelectorAll('.language-switch button, .blog-language-switch button');
    langBtns.forEach(btn => {
        if (btn.textContent.toLowerCase() === currentLang) {
            btn.style.background = '#64ffda';
            btn.style.color = '#000';
            btn.style.fontWeight = '600';
        } else {
            btn.style.background = 'rgba(255, 255, 255, 0.1)';
            btn.style.color = 'white';
            btn.style.fontWeight = '400';
        }
    });
}

// Apply translations
function applyTranslations() {
    document.querySelectorAll("[data-lang]").forEach(element => {
        const key = element.getAttribute("data-lang");
        if (translations && translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });
}

/* ================= BLOG SYSTEM ================= */

// Pagination config
let currentPage = 1;
const postsPerPage = 4;

// Load posts (latest + paginated)
function loadPosts(page = 1) {
    const container = document.getElementById("latest-posts");
    if (!container || typeof articles === "undefined") return;

    container.innerHTML = "";

    const sorted = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));

    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginated = sorted.slice(start, end);

    if (paginated.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>No articles found.</p>";
        return;
    }

    paginated.forEach(article => {
        const card = document.createElement("div");
        card.className = "blog-card";
        card.setAttribute("data-category", article.category);

        card.innerHTML = `
            <img src="${article.image}" loading="lazy" alt="${article.title}">
            <h2>${article.title}</h2>
            <p>${article.description}</p>
            <a href="${article.link}">Read More →</a>
        `;

        container.appendChild(card);
    });

    renderPagination(sorted.length);
}

// Pagination buttons
function renderPagination(totalPosts) {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.style.margin = "5px";
        btn.onclick = () => goToPage(i);

        pagination.appendChild(btn);
    }
}

// Change page
function goToPage(page) {
    currentPage = page;
    loadPosts(page);
}

// Search system
function searchArticles() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    const value = input.value.toLowerCase();
    const cards = document.querySelectorAll(".blog-card");

    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(value) ? "block" : "none";
    });
}

// Category filter
function filterCategory(category) {
    const cards = document.querySelectorAll(".blog-card");

    cards.forEach(card => {
        if (category === "all" || card.dataset.category === category) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// INIT
window.addEventListener("load", () => {
    loadPosts();
});