// BLOG PAGE JAVASCRIPT

let currentLang = "en";
let currentCategory = "all";
let currentPage = 1;
const postsPerPage = 6;
let filteredPosts = [...blogPosts];

// Maps blog post IDs to their published article pages.
const postRoutes = {
    1: "blog/docker-basics.html",
    2: "blog/kubernetes-intro.html",
    3: "blog/terraform.html",
    4: "blog/cicd-pipeline.html",
    5: "blog/cloud.html",
    6: "blog/linux.html",
    7: "blog/devsecops.html",
    8: "blog/kubernetes-networking.html",
    9: "blog/linux-devops.html"
};

// Initialize blog page
function initializeBlog() {
    loadBlogPosts();
    setupEventListeners();
    applyTranslations();
}

// Check if DOM is ready, if not, wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBlog);
} else {
    initializeBlog();
}

// Setup event listeners
function setupEventListeners() {
    // Category filter buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.getAttribute('data-category');
            currentPage = 1;
            filterAndLoadPosts();
        });
    });

    // Search button
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMorePosts);
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        filteredPosts = filterPostsByCategory(blogPosts, currentCategory);
    } else {
        filteredPosts = blogPosts.filter(post => {
            const title = post.title[currentLang].toLowerCase();
            const description = post.description[currentLang].toLowerCase();
            return title.includes(searchTerm) || description.includes(searchTerm);
        });
    }

    currentPage = 1;
    loadBlogPosts();
}

// Filter posts by category
function filterPostsByCategory(posts, category) {
    if (category === 'all') {
        return posts;
    }
    return posts.filter(post => post.category === category);
}

// Filter and load posts
function filterAndLoadPosts() {
    filteredPosts = filterPostsByCategory(blogPosts, currentCategory);
    loadBlogPosts();
}

// Load and display blog posts
function loadBlogPosts() {
    const postsContainer = document.getElementById('postsContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!postsContainer) return;

    const startIndex = 0;
    const endIndex = currentPage * postsPerPage;
    const postsToDisplay = filteredPosts.slice(startIndex, endIndex);

    if (postsToDisplay.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <h3 data-lang="blog_no_posts">No posts found</h3>
                <p data-lang="blog_no_posts">No posts found</p>
            </div>
        `;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        applyTranslations();
        return;
    }

    postsContainer.innerHTML = postsToDisplay.map(post => createPostCard(post)).join('');

    if (loadMoreBtn) {
        if (endIndex >= filteredPosts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    applyTranslations();
    addPostCardListeners();
}

// Create post card HTML
function createPostCard(post) {
    const title = post.title[currentLang];
    const description = post.description[currentLang];
    const formattedDate = formatDate(post.date);

    return `
        <div class="blog-card">
            <img src="${post.image}" alt="${title}" class="blog-card-image">
            <div class="blog-card-content">
                <span class="blog-card-category">${post.category}</span>
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="blog-card-meta">
                    <span class="blog-card-date">${formattedDate}</span>
                    <span class="blog-card-author">${post.author}</span>
                </div>
                <button class="read-more-btn" data-lang="read_more" data-post-id="${post.id}">Read More</button>
            </div>
        </div>
    `;
}

// Add click listeners to post cards
function addPostCardListeners() {
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = this.getAttribute('data-post-id');
            openBlogPost(postId);
        });
    });

    const postCards = document.querySelectorAll('.blog-card');
    postCards.forEach(card => {
        const btn = card.querySelector('.read-more-btn');
        if (!btn) return;

        card.style.cursor = 'pointer';
        card.setAttribute('role', 'link');
        card.setAttribute('tabindex', '0');

        const postId = btn.getAttribute('data-post-id');
        const openPost = () => openBlogPost(postId);

        card.addEventListener('click', function(e) {
            if (e.target.closest('.read-more-btn')) return;
            openPost();
        });

        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPost();
            }
        });
    });
}

// Open blog post (in a real app, would navigate)
function openBlogPost(postId) {
    const post = blogPosts.find(p => p.id == postId);
    if (post) {
        const route = postRoutes[Number(postId)];
        if (route) {
            window.location.href = route;
            return;
        }

        alert("This article page is not published yet.");
    }
}

// Load more posts
function loadMorePosts() {
    currentPage++;
    loadBlogPosts();
}

// Format date utility
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'fr-FR', options);
}

// Apply translations to page elements
function applyTranslations() {
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });

    // Reload posts to update translated content
    const postsContainer = document.getElementById('postsContainer');
    if (postsContainer && filteredPosts.length > 0) {
        const endIndex = currentPage * postsPerPage;
        const postsToDisplay = filteredPosts.slice(0, endIndex);
        postsContainer.innerHTML = postsToDisplay.map(post => createPostCard(post)).join('');
        addPostCardListeners();
    }
}

// Set language globally
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    applyTranslations();
    
    // Update active language button
    const langBtns = document.querySelectorAll('.language-switch button');
    langBtns.forEach(btn => {
        if (btn.textContent.trim() === lang.toUpperCase()) {
            btn.style.background = '#64ffda';
            btn.style.color = '#000';
        } else {
            btn.style.background = 'transparent';
            btn.style.color = 'white';
        }
    });
}

// Load saved language preference
window.addEventListener('load', function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    currentLang = savedLang;
    applyTranslations();
});
