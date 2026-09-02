let currentLang = localStorage.getItem('preferredLanguage') || "en";
const pathname = window.location.pathname;
let pathPrefix = "./";

if (pathname.includes('/projects/')) {
    pathPrefix = "../../";
} else if (pathname.includes('/blog/') || pathname.includes('/training/')) {
    pathPrefix = "../";
}
const isBlogArticlePage = !!document.querySelector('.blog-post-article');

if (isBlogArticlePage) {
    document.body.classList.add('is-blog-article');
}

// Load header dynamically (use relative path for local server)
fetch(`${pathPrefix}components/header.html?t=${Date.now()}`)
    .then(res => res.text())
    .then(data => {
        document.body.insertAdjacentHTML("afterbegin", data);
        const header = document.querySelector('header');
        if (header) {
            // Rebase relative links in injected header when loaded from nested folders.
            header.querySelectorAll('a[href]').forEach(link => {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
                const normalized = href.replace(/^\.\//, '').replace(/^\.\.\//, '');
                link.setAttribute('href', `${pathPrefix}${normalized}`);
            });
        }

        // Force reload the logo image
        const logoImg = document.querySelector('.logo-img');
        if (logoImg) {
            const src = logoImg.getAttribute('src') || 'images/Horizontal-official-logo.png';
            const normalizedSrc = src.replace(/^\.\//, '').replace(/^\.\.\//, '');
            logoImg.src = `${pathPrefix}${normalizedSrc}?t=${Date.now()}`;
        }
        // Hide back to home button on home page
        if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('index.html')) {
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
        setupMobileMenu();
        setupLanguageSwitcher();
        applyTranslations(); // Apply language after header loads
        initWaitlistForm();
        initWhatsAppFloatingButton();
    })
    .catch(error => console.error('Error loading header:', error));

// Bootcamp registration form: submit to backend API.
function initWaitlistForm() {
    const bootcampForm = document.getElementById('bootcampForm') || document.getElementById('waitlistForm');
    if (!bootcampForm || bootcampForm.dataset.bound === 'true') return;

    bootcampForm.dataset.bound = 'true';
    const feedbackContainer = document.getElementById('bootcampFormFeedback');

    function showFormMessage(message, success = true) {
        if (!feedbackContainer) return;
        feedbackContainer.textContent = message;
        feedbackContainer.className = `form-feedback ${success ? 'success' : 'error'}`;
    }

    bootcampForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const form = event.currentTarget;
        if (!form.checkValidity()) {
            form.reportValidity();
            showFormMessage('Please complete all required fields.', false);
            return;
        }

        const name = (form.querySelector('#fullName')?.value || '').trim();
        const email = (form.querySelector('#email')?.value || '').trim();
        const phone = (form.querySelector('#phone')?.value || '').trim();
        const country = (form.querySelector('#country')?.value || '').trim();
        const program = form.querySelector('#program-select')?.value || '';
        const experience = form.querySelector('#experience')?.value || '';
        const message = (form.querySelector('#message')?.value || '').trim();
        const scoreInput = form.querySelector('#score');
        const scoreFromField = Number(scoreInput?.value);

        const score = Number.isFinite(scoreFromField)
            ? scoreFromField
            : (experience === 'Intermediate' ? 70 : experience === 'Beginner' ? 40 : experience === 'Advanced' ? 90 : 0);

        const payload = {
            name,
            email,
            phone,
            country,
            program,
            experience,
            message,
            score,
            notifyEmail: 'bootcamp@foma.life',
            sendConfirmation: true,
            submittedAt: new Date().toISOString()
        };

        try {
            const response = await fetch('https://u16cqud033.execute-api.ap-southeast-1.amazonaws.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            let result = {};
            try {
                result = await response.json();
            } catch (parseError) {
                result = {};
            }

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            showFormMessage(result.message || 'Thank you! Your application has been received. We will be in touch shortly.', true);
            form.reset();
        } catch (error) {
            showFormMessage(error.message || 'Something went wrong. Please try again.', false);
            console.error('Bootcamp registration error:', error);
        }
    });
}

function initWhatsAppFloatingButton() {
    if (document.querySelector('.whatsapp-float')) return;

    const message = 'Hello, I want to learn more about your DevOps training';
    const button = document.createElement('a');
    button.href = `https://wa.me/639062369675?text=${encodeURIComponent(message)}`;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.className = 'whatsapp-float';
    button.setAttribute('aria-label', 'Chat on WhatsApp');
    button.title = 'WhatsApp';
    button.textContent = 'WA';

    document.body.appendChild(button);
}

function setupMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('header nav');
    const languageSwitch = document.querySelector('.language-switch');

    if (!toggle || !navigation || !languageSwitch) return;

    toggle.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navigation.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navigation.classList.remove('menu-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initWaitlistForm();
    initWhatsAppFloatingButton();
});

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

    document.querySelectorAll("[data-lang-placeholder]").forEach(element => {
        const key = element.getAttribute("data-lang-placeholder");
        if (translations && translations[currentLang] && translations[currentLang][key]) {
            element.placeholder = translations[currentLang][key];
        }
    });
}

/* ================= BLOG SYSTEM ================= */

// Pagination config
let currentPage = 1;
const postsPerPage = 4;

// Load posts (latest + paginated)
function loadPosts(page = 1, category = "all") {
    const container = document.getElementById("latest-posts");
    if (!container || typeof articles === "undefined") return;

    container.innerHTML = "";

    const activeCategory = arguments.length < 2
        ? (container.dataset.activeCategory || "all")
        : category;

    container.dataset.activeCategory = activeCategory;

    // Sort articles by date (latest first)
    let filtered = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Apply category filter FIRST
    if (activeCategory !== "all") {
        filtered = filtered.filter(a =>
            (a.category || "").toLowerCase() === activeCategory.toLowerCase()
        );
    }

    // Apply pagination AFTER filtering
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginated = filtered.slice(start, end);

    if (paginated.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>No articles found.</p>";
        return;
    }

    paginated.forEach(article => {
        const card = document.createElement("div");
        card.className = "blog-card";

        // Keep category for filtering system
        card.setAttribute("data-category", article.category);
        card.setAttribute("role", "link");
        card.setAttribute("tabindex", "0");
        card.style.cursor = "pointer";

        card.innerHTML = `
            <img src="${article.image}" loading="lazy" alt="${article.title}">
            <h2>${article.title}</h2>
            <p>${article.description || "No description available"}</p>
            <a href="${article.link}">Read More →</a>
        `;

        const openArticle = () => {
            window.location.href = article.link;
        };

        card.addEventListener("click", (event) => {
            if (event.target.closest("a")) return;
            openArticle();
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openArticle();
            }
        });

        container.appendChild(card);
    });

    renderPagination(filtered.length);
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
    currentPage = 1;
    loadPosts(1, category);
}

// INIT
window.addEventListener("load", () => {
    loadPosts();

    if (!document.getElementById("latest-posts") || typeof articles !== "undefined") {
        return;
    }

    loadArticlesFromCMS();
});

async function loadArticlesFromCMS() {
    const container = document.getElementById("latest-posts");

    if (!container) return;

    try {
        const res = await fetch("https://admin.foma.life/api/articles?populate=*");
        const result = await res.json();

        const articles = Array.isArray(result.data) ? result.data : [];

        const categoryRoutes = {
            devops: "training/devops.html",
            docker: "training/docker.html",
            kubernetes: "training/kubernetes.html",
            cicd: "training/cicd.html",
            linux: "training/linux.html",
            terraform: "training/terraform.html",
            ansible: "training/ansible.html"
        };

        articles.forEach(article => {
            const articleId = article?.id || article?.attributes?.id;
            const data = article?.attributes || article;
            const rawCategory = (data?.category || "").toString().toLowerCase().trim();
            const category = rawCategory.replace(/[\s/-]+/g, "");
            const articleLink = categoryRoutes[category] || "#";

            const cmsImageUrl =
                data?.image?.url ||
                data?.image?.data?.attributes?.url ||
                "";

            const imageUrl = cmsImageUrl
                ? "https://admin.foma.life" + cmsImageUrl
                : "images/devops.jpg";

            const card = document.createElement("div");
            card.className = "blog-card";
            card.setAttribute("data-category", category || "devops");
            card.setAttribute("role", "link");
            card.setAttribute("tabindex", "0");

            const articleDocumentId = data.documentId || articleId;

            const openArticle = () => {
                if (!articleDocumentId) return;
                window.location.href = `blog/cms-article.html?id=${articleDocumentId}`;
            };

            // Make entire card clickable like static cards
            card.style.cursor = "pointer";
            card.addEventListener("click", (event) => {
                if (event.target.closest("a")) return;
                openArticle();
            });

            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openArticle();
                }
            });

            card.innerHTML = `
                <img src="${imageUrl}" alt="${data?.title || "DevOps Article"}">
                <h2>${data?.title || "DevOps Article"}</h2>
                <p>${data?.description || "Explore this DevOps article."}</p>
                <a href="${articleDocumentId ? `blog/cms-article.html?id=${articleDocumentId}` : articleLink}">Read More →</a>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("CMS error:", error);
    }
}