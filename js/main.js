let currentLang = localStorage.getItem('preferredLanguage') || "en";
const isNestedPage = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/training/');
const pathPrefix = isNestedPage ? "../" : "./";

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
            const src = logoImg.getAttribute('src') || 'images/logo.png';
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
        card.setAttribute("role", "link");
        card.setAttribute("tabindex", "0");
        card.style.cursor = "pointer";

        card.innerHTML = `
            <img src="${article.image}" loading="lazy" alt="${article.title}">
            <h2>${article.title}</h2>
            <p>${article.description}</p>
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
    loadArticlesFromCMS();
});

async function loadArticlesFromCMS() {
    try {
        const res = await fetch("http://admin.foma.life/api/articles?populate=*");
        const result = await res.json();

        const articles = Array.isArray(result.data) ? result.data : [];

        const container = document.getElementById("latest-posts");

        if (!container) return;

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
            const category = (data?.category || "").toString().toLowerCase();
            const articleLink = categoryRoutes[category] || "#";

            const cmsImageUrl =
                data?.image?.url ||
                data?.image?.data?.attributes?.url ||
                "";

            const imageUrl = cmsImageUrl
                ? "http://admin.foma.life" + cmsImageUrl
                : "images/devops.jpg";

            const card = document.createElement("div");
            card.className = "blog-card";
            card.setAttribute("data-category", category || "devops");
            card.setAttribute("role", "link");
            card.setAttribute("tabindex", "0");

            const openArticle = () => {
                if (!articleId) return;
                window.location.href = `blog/cms-article.html?id=${data.documentId}`;
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
                <a href="${articleId ? `blog/cms-article.html?id=${articleId}` : articleLink}">Read More →</a>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("CMS error:", error);
    }
}