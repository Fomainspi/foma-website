// BLOG PAGE JAVASCRIPT

let currentLang = localStorage.getItem("preferredLanguage") || "en";
let currentCategory = "all";
let currentPage = 1;
const postsPerPage = 6;
const CMS_API_URL = "https://admin.foma.life/api/articles?populate=*";
const DEFAULT_AUTHOR = "William Foma";

// CMS posts are merged with the existing static posts so old articles continue to work.
let allBlogPosts = [];
let filteredPosts = [];

// Maps existing static blog post IDs to their published article pages.
const postRoutes = {
    1: "/blog/docker-basics",
    2: "/blog/kubernetes-intro",
    3: "/blog/terraform",
    4: "/blog/cicd-pipeline",
    5: "/blog/cloud",
    6: "/blog/linux",
    7: "/blog/devsecops",
    8: "/blog/kubernetes-networking",
    9: "/blog/linux-devops",
    10: "/blog/docker-revolutionizing-software-development-and-deployment",
    11: "/blog/article1"
};

function sortPostsByDate(posts) {
    return [...posts].sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
    });
}

function normalizeCategory(category) {
    return (category || "devops").toString().toLowerCase().trim().replace(/[\s/-]+/g, "");
}

function getPostText(value) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
        return value.en || value.fr || Object.values(value)[0] || "";
    }
    return "";
}

function getCmsImageUrl(data) {
    const image = data?.image;
    const url = image?.url || image?.data?.attributes?.url || "";
    if (!url) return "images/devops.jpg";
    return url.startsWith("http") ? url : `https://admin.foma.life${url}`;
}

function mapCmsArticle(article) {
    const data = article?.attributes || article || {};
    const documentId = data.documentId || article?.documentId || article?.id;
    const category = normalizeCategory(data.category);

    return {
        id: `cms-${documentId}`,
        cmsDocumentId: documentId,
        title: {
            en: getPostText(data.title) || "DevOps Article",
            fr: getPostText(data.title) || "DevOps Article"
        },
        description: {
            en: getPostText(data.description) || "Explore this DevOps article.",
            fr: getPostText(data.description) || "Explore this DevOps article."
        },
        category,
        image: getCmsImageUrl(data),
        date: data.date || data.publishedAt || data.createdAt || "",
        author: DEFAULT_AUTHOR,
        isCms: true
    };
}

async function loadCmsPosts() {
    try {
        const response = await fetch(CMS_API_URL, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`CMS request failed with status ${response.status}`);
        }

        const result = await response.json();
        const cmsArticles = Array.isArray(result.data) ? result.data : [];
        return cmsArticles.map(mapCmsArticle).filter(post => post.cmsDocumentId);
    } catch (error) {
        console.error("Unable to load CMS articles:", error);
        return [];
    }
}

function mergeBlogPosts(cmsPosts) {
    const staticPosts = typeof blogPosts !== "undefined" && Array.isArray(blogPosts)
        ? blogPosts
        : [];

    // CMS posts are authoritative for CMS-managed articles. Static posts remain available.
    allBlogPosts = [...staticPosts, ...cmsPosts];
    filteredPosts = filterPostsByCategory(allBlogPosts, currentCategory);
}

// Initialize blog page
async function initializeBlog() {
    // Render existing static articles immediately.
    mergeBlogPosts([]);
    loadBlogPosts();
    setupEventListeners();
    applyTranslations();

    // Then add published Strapi articles without requiring any code changes for future posts.
    const cmsPosts = await loadCmsPosts();
    mergeBlogPosts(cmsPosts);
    loadBlogPosts();
}

// Check if DOM is ready, if not, wait for it.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeBlog);
} else {
    initializeBlog();
}

// Setup event listeners
function setupEventListeners() {
    const categoryBtns = document.querySelectorAll(".category-btn");
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            categoryBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            currentCategory = this.getAttribute("data-category") || "all";
            currentPage = 1;
            filterAndLoadPosts();
        });
    });

    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");

    if (searchBtn) {
        searchBtn.addEventListener("click", performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                performSearch();
            }
        });
    }

    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", loadMorePosts);
    }
}

// Perform search across both static and CMS articles.
function performSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchTerm = (searchInput?.value || "").toLowerCase().trim();

    if (searchTerm === "") {
        filteredPosts = filterPostsByCategory(allBlogPosts, currentCategory);
    } else {
        filteredPosts = sortPostsByDate(allBlogPosts.filter(post => {
            const title = getPostText(post.title).toLowerCase();
            const description = getPostText(post.description).toLowerCase();
            const category = (post.category || "").toLowerCase();
            const author = (post.author || "").toLowerCase();
            return title.includes(searchTerm) ||
                   description.includes(searchTerm) ||
                   category.includes(searchTerm) ||
                   author.includes(searchTerm);
        }));
    }

    currentPage = 1;
    loadBlogPosts();
}

// Filter posts by category
function filterPostsByCategory(posts, category) {
    const sortedPosts = sortPostsByDate(posts);
    const normalizedCategory = normalizeCategory(category);

    if (normalizedCategory === "all") {
        return sortedPosts;
    }

    return sortedPosts.filter(post => normalizeCategory(post.category) === normalizedCategory);
}

// Filter and load posts
function filterAndLoadPosts() {
    const searchInput = document.getElementById("searchInput");
    const searchTerm = (searchInput?.value || "").toLowerCase().trim();

    if (searchTerm) {
        filteredPosts = filterPostsByCategory(allBlogPosts, currentCategory).filter(post => {
            const title = getPostText(post.title).toLowerCase();
            const description = getPostText(post.description).toLowerCase();
            return title.includes(searchTerm) || description.includes(searchTerm);
        });
    } else {
        filteredPosts = filterPostsByCategory(allBlogPosts, currentCategory);
    }

    loadBlogPosts();
}

// Load and display blog posts
function loadBlogPosts() {
    const postsContainer = document.getElementById("postsContainer");
    const loadMoreBtn = document.getElementById("loadMoreBtn");

    if (!postsContainer) return;

    const endIndex = currentPage * postsPerPage;
    const postsToDisplay = filteredPosts.slice(0, endIndex);

    if (postsToDisplay.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <h3 data-lang="blog_no_posts">No posts found</h3>
                <p data-lang="blog_no_posts">No posts found</p>
            </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
        applyTranslations();
        return;
    }

    postsContainer.innerHTML = postsToDisplay.map(post => createPostCard(post)).join("");

    if (loadMoreBtn) {
        loadMoreBtn.style.display = endIndex >= filteredPosts.length ? "none" : "block";
    }

    applyTranslations();
    addPostCardListeners();
}

// Escape user/CMS text before inserting it into HTML.
function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Create post card HTML
function createPostCard(post) {
    const title = escapeHtml(getPostText(post.title) || "DevOps Article");
    const description = escapeHtml(getPostText(post.description) || "Explore this DevOps article.");
    const category = escapeHtml(post.category || "devops");
    const author = escapeHtml(post.author || DEFAULT_AUTHOR);
    const formattedDate = post.date ? formatDate(post.date) : "";

    return `
        <div class="blog-card">
            <img src="${escapeHtml(post.image || "images/devops.jpg")}" alt="${title}" class="blog-card-image" loading="lazy">
            <div class="blog-card-content">
                <span class="blog-card-category">${category}</span>
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="blog-card-meta">
                    ${formattedDate ? `<span class="blog-card-date">${escapeHtml(formattedDate)}</span>` : ""}
                    <span class="blog-card-author">${author}</span>
                </div>
                <button class="read-more-btn" data-lang="read_more" data-post-id="${escapeHtml(post.id)}">Read More</button>
            </div>
        </div>
    `;
}

// Add click listeners to post cards
function addPostCardListeners() {
    const readMoreBtns = document.querySelectorAll(".read-more-btn");
    readMoreBtns.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const postId = this.getAttribute("data-post-id");
            openBlogPost(postId);
        });
    });

    const postCards = document.querySelectorAll(".blog-card");
    postCards.forEach(card => {
        const btn = card.querySelector(".read-more-btn");
        if (!btn) return;

        card.style.cursor = "pointer";
        card.setAttribute("role", "link");
        card.setAttribute("tabindex", "0");

        const postId = btn.getAttribute("data-post-id");
        const openPost = () => openBlogPost(postId);

        card.addEventListener("click", function(e) {
            if (e.target.closest(".read-more-btn")) return;
            openPost();
        });

        card.addEventListener("keydown", function(e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openPost();
            }
        });
    });
}

// Open static or CMS blog post.
function openBlogPost(postId) {
    const post = allBlogPosts.find(p => String(p.id) === String(postId));
    if (!post) return;

    if (post.isCms && post.cmsDocumentId) {
        window.location.href = `/blog/cms-article?id=${encodeURIComponent(post.cmsDocumentId)}`;
        return;
    }

    const route = postRoutes[Number(postId)] || post.link;
    if (route) {
        window.location.href = route;
        return;
    }

    alert("This article page is not published yet.");
}

// Load more posts
function loadMorePosts() {
    currentPage++;
    loadBlogPosts();
}

// Format date utility
function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(currentLang === "en" ? "en-US" : "fr-FR", options);
}

// Apply translations to page elements
function applyTranslations() {
    if (typeof translations === "undefined") return;

    document.querySelectorAll("[data-lang]").forEach(element => {
        const key = element.getAttribute("data-lang");
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === "INPUT") {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });

    document.querySelectorAll("[data-lang-placeholder]").forEach(element => {
        const key = element.getAttribute("data-lang-placeholder");
        if (translations[currentLang] && translations[currentLang][key]) {
            element.placeholder = translations[currentLang][key];
        }
    });
}

// Set language globally for the blog page.
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("preferredLanguage", lang);
    applyTranslations();
    loadBlogPosts();

    const langBtns = document.querySelectorAll(".language-switch button, .blog-language-switch button");
    langBtns.forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === lang.toLowerCase()) {
            btn.style.background = "#64ffda";
            btn.style.color = "#000";
            btn.style.fontWeight = "600";
        } else {
            btn.style.background = "rgba(255, 255, 255, 0.1)";
            btn.style.color = "white";
            btn.style.fontWeight = "400";
        }
    });
}

window.addEventListener("load", function() {
    const savedLang = localStorage.getItem("preferredLanguage") || "en";
    currentLang = savedLang;
    applyTranslations();
    loadBlogPosts();
});
