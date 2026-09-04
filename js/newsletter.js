// FOMA NEWSLETTER PAGE

const NEWSLETTER_API_URL = "https://admin.foma.life/api/newsletters?populate=*";

function escapeNewsletterHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getNewsletterImage(data) {
    const image = data?.image;
    const url = image?.url || image?.data?.attributes?.url || "";

    if (!url) {
        return "images/devops.jpg";
    }

    return url.startsWith("http")
        ? url
        : `https://admin.foma.life${url}`;
}

function formatNewsletterDate(dateValue) {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(currentLang === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function initializeNewsletter() {
    const container = document.getElementById("newsletterContainer");

    if (!container) return;

    loadNewsletters(container);
}

async function loadNewsletters(container) {
    try {
        const response = await fetch(NEWSLETTER_API_URL, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Newsletter request failed with status ${response.status}`);
        }

        const result = await response.json();
        const newsletters = Array.isArray(result.data) ? result.data : [];

        if (newsletters.length === 0) {
            container.innerHTML = `
                <div class="newsletter-empty">
                    <h3 data-lang="newsletter_empty">No newsletters available yet.</h3>
                </div>
            `;
            applyTranslations();
            return;
        }

        newsletters.sort((a, b) => {
            const dateA = new Date(a.date || a.publishedAt || a.createdAt || 0).getTime();
            const dateB = new Date(b.date || b.publishedAt || b.createdAt || 0).getTime();
            return dateB - dateA;
        });

        container.innerHTML = newsletters.map(newsletter => {
            const data = newsletter?.attributes || newsletter || {};

            const title = data.title || "FOMA Newsletter";
            const description = data.description || "";
            const category = data.category || "FOMA";
            const author = data.author || "William Foma";
            const date = formatNewsletterDate(
                data.date || data.publishedAt || data.createdAt
            );
            const image = getNewsletterImage(data);
            const documentId = data.documentId || newsletter?.documentId || newsletter?.id;

            return `
                <article class="newsletter-card">
                    <img
                        src="${escapeNewsletterHtml(image)}"
                        alt="${escapeNewsletterHtml(title)}"
                        class="newsletter-card-image"
                        loading="lazy"
                    >

                    <div class="newsletter-card-content">
                        <span class="newsletter-card-category">
                            ${escapeNewsletterHtml(category)}
                        </span>

                        <h2 class="newsletter-card-title">
                            ${escapeNewsletterHtml(title)}
                        </h2>

                        <p class="newsletter-card-description">
                            ${escapeNewsletterHtml(description)}
                        </p>

                        <div class="newsletter-card-meta">
                            ${date ? `${escapeNewsletterHtml(date)} · ` : ""}
                            ${escapeNewsletterHtml(author)}
                        </div>

                        ${
                            documentId
                                ? `
                                    <a
                                        href="/newsletter/article?id=${encodeURIComponent(documentId)}"
                                        class="cta-button newsletter-read-more"
                                    >
                                        <span data-lang="newsletter_read_more">Read Newsletter</span>
                                    </a>
                                `
                                : ""
                        }
                    </div>
                </article>
            `;
        }).join("");

        applyTranslations();
    } catch (error) {
        console.error("Unable to load newsletters:", error);

        container.innerHTML = `
            <div class="newsletter-error">
                <h3 data-lang="newsletter_error">Unable to load newsletters.</h3>
            </div>
        `;

        applyTranslations();
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeNewsletter);
} else {
    initializeNewsletter();
}
