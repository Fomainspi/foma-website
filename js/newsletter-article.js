// FOMA NEWSLETTER ARTICLE PAGE

const NEWSLETTER_ARTICLE_API =
    "https://admin.foma.life/api/newsletters?populate=*";

function escapeNewsletterArticleHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getNewsletterArticleImage(data) {
    const image = data?.image;
    const url = image?.url || image?.data?.attributes?.url || "";

    if (!url) {
        return "../images/devops.jpg";
    }

    return url.startsWith("http")
        ? url
        : `https://admin.foma.life${url}`;
}

function formatNewsletterArticleDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(
        typeof currentLang !== "undefined" && currentLang === "fr"
            ? "fr-FR"
            : "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}

function renderNewsletterBlocks(blocks) {
    if (!Array.isArray(blocks)) {
        return "";
    }

    return blocks.map(block => {
        const type = block?.type || "";
        const children = Array.isArray(block?.children)
            ? block.children
            : [];

        const text = children.map(child => {
            const childText = escapeNewsletterArticleHtml(child?.text || "");

            if (child?.bold) return `<strong>${childText}</strong>`;
            if (child?.italic) return `<em>${childText}</em>`;
            if (child?.underline) return `<u>${childText}</u>`;
            if (child?.strikethrough) return `<s>${childText}</s>`;

            return childText;
        }).join("");

        switch (type) {
            case "heading":
                return `<h2>${text}</h2>`;

            case "quote":
                return `<blockquote>${text}</blockquote>`;

            case "list":
                return `<ul>${text}</ul>`;

            case "paragraph":
            default:
                return `<p>${text}</p>`;
        }
    }).join("");
}

async function loadNewsletterArticle() {
    const container = document.getElementById("newsletterArticleContainer");

    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const documentId = params.get("id");

    if (!documentId) {
        container.innerHTML = `
            <div class="newsletter-error">
                <h2 data-lang="newsletter_article_not_found">
                    Newsletter not found.
                </h2>
                <a href="/newsletter" class="cta-button">
                    <span data-lang="back_to_newsletters">
                        Back to Newsletters
                    </span>
                </a>
            </div>
        `;

        if (typeof applyTranslations === "function") {
            applyTranslations();
        }

        return;
    }

    try {
        const response = await fetch(NEWSLETTER_ARTICLE_API, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `Newsletter request failed with status ${response.status}`
            );
        }

        const result = await response.json();

        const newsletters = Array.isArray(result.data)
            ? result.data
            : [];

        const newsletter = newsletters.find(item => {
            const data = item?.attributes || item || {};
            const itemDocumentId =
                data.documentId ||
                item?.documentId ||
                item?.id;

            return String(itemDocumentId) === String(documentId);
        });

        if (!newsletter) {
            container.innerHTML = `
                <div class="newsletter-error">
                    <h2 data-lang="newsletter_article_not_found">
                        Newsletter not found.
                    </h2>
                    <a href="/newsletter" class="cta-button">
                        <span data-lang="back_to_newsletters">
                            Back to Newsletters
                        </span>
                    </a>
                </div>
            `;

            if (typeof applyTranslations === "function") {
                applyTranslations();
            }

            return;
        }

        const data = newsletter?.attributes || newsletter || {};

        const title = data.title || "FOMA Newsletter";
        const description = data.description || "";
        const category = data.category || "FOMA";
        const author = data.author || "William Foma";
        const date = formatNewsletterArticleDate(
            data.date || data.publishedAt || data.createdAt
        );
        const image = getNewsletterArticleImage(data);
        const content = renderNewsletterBlocks(data.content);

        document.title = `${title} | FOMA`;

        container.innerHTML = `
            <article class="newsletter-full-article">

                <div class="newsletter-full-article-header">

                    <span class="newsletter-full-article-category">
                        ${escapeNewsletterArticleHtml(category)}
                    </span>

                    <h1 class="newsletter-full-article-title">
                        ${escapeNewsletterArticleHtml(title)}
                    </h1>

                    <p class="newsletter-full-article-description">
                        ${escapeNewsletterArticleHtml(description)}
                    </p>

                    <div class="newsletter-full-article-meta">
                        ${date ? escapeNewsletterArticleHtml(date) + " · " : ""}
                        ${escapeNewsletterArticleHtml(author)}
                    </div>

                </div>

                ${
                    image
                        ? `
                            <img
                                src="${escapeNewsletterArticleHtml(image)}"
                                alt="${escapeNewsletterArticleHtml(title)}"
                                class="newsletter-full-article-image"
                            >
                        `
                        : ""
                }

                <div class="newsletter-full-article-content">
                    ${content}
                </div>

                <div class="newsletter-full-article-footer">
                    <a href="/newsletter" class="cta-button">
                        <span data-lang="back_to_newsletters">
                            Back to Newsletters
                        </span>
                    </a>
                </div>

            </article>
        `;

        if (typeof applyTranslations === "function") {
            applyTranslations();
        }

    } catch (error) {
        console.error("Unable to load newsletter:", error);

        container.innerHTML = `
            <div class="newsletter-error">
                <h2 data-lang="newsletter_error">
                    Unable to load newsletters.
                </h2>

                <a href="/newsletter" class="cta-button">
                    <span data-lang="back_to_newsletters">
                        Back to Newsletters
                    </span>
                </a>
            </div>
        `;

        if (typeof applyTranslations === "function") {
            applyTranslations();
        }
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadNewsletterArticle);
} else {
    loadNewsletterArticle();
}
