import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import {
    ListContactsCommand,
    SendEmailCommand,
    SESv2Client
} from "@aws-sdk/client-sesv2";

const dynamoClient = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(dynamoClient);
const sesClient = new SESv2Client({});

const ENVIRONMENT_NAME = process.env.ENVIRONMENT_NAME || "dev";
const CONTACT_LIST_NAME = process.env.NEWSLETTER_CONTACT_LIST_NAME || "FOMA-Newsletter";
const TOPIC_NAME = process.env.NEWSLETTER_TOPIC_NAME || "FOMA-Newsletter";
const SES_SENDER_EMAIL = process.env.SES_SENDER_EMAIL;
const SEND_LOG_TABLE = process.env.NEWSLETTER_SEND_LOG_TABLE;
const ARTICLE_BASE_URL = process.env.NEWSLETTER_ARTICLE_BASE_URL || "https://foma.life/newsletter/article";
const CMS_API_URL = process.env.NEWSLETTER_CMS_API_URL || "https://admin.foma.life/api/newsletters";

function jsonResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
        },
        body: JSON.stringify(body)
    };
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function extractText(node) {
    if (!node) return "";
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (typeof node.text === "string") return node.text;
    return extractText(node.children);
}

function renderInline(children = []) {
    return children.map((child) => {
        if (!child) return "";
        if (child.type === "link") {
            const url = child.url || "#";
            return `<a href="${escapeHtml(url)}">${renderInline(child.children || [])}</a>`;
        }
        let html = escapeHtml(child.text || extractText(child));
        if (child.bold) html = `<strong>${html}</strong>`;
        if (child.italic) html = `<em>${html}</em>`;
        if (child.underline) html = `<u>${html}</u>`;
        if (child.strikethrough) html = `<s>${html}</s>`;
        if (child.code) html = `<code>${html}</code>`;
        return html;
    }).join("");
}

function renderBlocks(blocks = []) {
    if (!Array.isArray(blocks)) return "";

    return blocks.map((block) => {
        if (!block) return "";
        const children = block.children || [];
        const inline = renderInline(children);

        switch (block.type) {
            case "heading": {
                const level = Math.min(6, Math.max(2, Number(block.level) || 2));
                return `<h${level}>${inline}</h${level}>`;
            }
            case "quote":
                return `<blockquote style="margin:20px 0;padding:12px 18px;border-left:4px solid #1f8f4e;background:#f4faf6">${inline}</blockquote>`;
            case "code":
                return `<pre style="background:#111;color:#fff;padding:14px;border-radius:8px;overflow:auto"><code>${escapeHtml(extractText(children))}</code></pre>`;
            case "list": {
                const tag = block.format === "ordered" ? "ol" : "ul";
                const items = children.map((item) => `<li>${renderInline(item.children || [])}</li>`).join("");
                return `<${tag}>${items}</${tag}>`;
            }
            case "image": {
                const image = block.image || {};
                const url = image.url || image.data?.attributes?.url;
                if (!url) return "";
                return `<p><img src="${escapeHtml(url)}" alt="${escapeHtml(image.alternativeText || "FOMA Newsletter")}" style="max-width:100%;height:auto;border-radius:10px"></p>`;
            }
            case "paragraph":
            default:
                return inline ? `<p>${inline}</p>` : "";
        }
    }).join("\n");
}

function normalizeEntry(payload) {
    const entry = payload?.entry;
    if (!entry || typeof entry !== "object") return null;
    return entry.attributes && !entry.title ? entry.attributes : entry;
}

async function fetchNewsletter(documentId) {
    if (!documentId) return null;
    const url = `${CMS_API_URL.replace(/\/$/, "")}/${encodeURIComponent(documentId)}?populate=*`;
    try {
        const response = await fetch(url, { headers: { Accept: "application/json" } });
        if (!response.ok) return null;
        const result = await response.json();
        return result?.data?.attributes || result?.data || null;
    } catch (error) {
        console.error("Newsletter CMS fetch failed", {
            name: error?.name,
            message: error?.message,
            documentId
        });
        return null;
    }
}

function articleUrl(documentId) {
    return `${ARTICLE_BASE_URL}?id=${encodeURIComponent(documentId)}`;
}

async function alreadySent(sendKey) {
    if (!SEND_LOG_TABLE) return false;
    const result = await dynamo.send(new GetCommand({
        TableName: SEND_LOG_TABLE,
        Key: { sendKey }
    }));
    return Boolean(result.Item);
}

async function markSent(sendKey, email, documentId) {
    if (!SEND_LOG_TABLE) return;
    await dynamo.send(new PutCommand({
        TableName: SEND_LOG_TABLE,
        Item: {
            sendKey,
            email,
            documentId,
            sentAt: new Date().toISOString()
        }
    }));
}

async function listOptedInContacts() {
    const contacts = [];
    let nextToken;

    do {
        const result = await sesClient.send(new ListContactsCommand({
            ContactListName: CONTACT_LIST_NAME,
            Filter: {
                FilteredStatus: "OPT_IN",
                TopicFilter: {
                    TopicName: TOPIC_NAME,
                    UseDefaultIfPreferenceUnavailable: false
                }
            },
            PageSize: 100,
            NextToken: nextToken
        }));
        contacts.push(...(result.Contacts || []));
        nextToken = result.NextToken;
    } while (nextToken);

    return contacts.map((contact) => contact.EmailAddress).filter(Boolean);
}

async function sendNewsletterEmail(email, newsletter) {
    const documentId = newsletter.documentId || newsletter.id;
    const title = newsletter.title || "FOMA Newsletter";
    const description = newsletter.description || "";
    const date = newsletter.date || newsletter.publishedAt || "";
    const contentHtml = renderBlocks(newsletter.content);
    const url = articleUrl(documentId);

    const html = `<!doctype html>
<html><body style="font-family:Arial,sans-serif;line-height:1.65;color:#222;max-width:760px;margin:0 auto;padding:24px">
  <div style="border-bottom:3px solid #1f8f4e;padding-bottom:12px;margin-bottom:24px">
    <div style="font-size:13px;font-weight:bold;color:#1f8f4e">FOUNDATION OF MASTERING AUTOMATION</div>
    <h1 style="margin:8px 0 0">${escapeHtml(title)}</h1>
    ${date ? `<div style="font-size:13px;color:#777;margin-top:6px">${escapeHtml(date)}</div>` : ""}
  </div>
  ${description ? `<p style="font-size:17px"><strong>${escapeHtml(description)}</strong></p>` : ""}
  ${contentHtml}
  <p style="margin-top:28px"><a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 18px;background:#1f8f4e;color:#fff;text-decoration:none;border-radius:6px">Read this newsletter on foma.life</a></p>
  <hr style="margin:32px 0;border:0;border-top:1px solid #ddd">
  <p style="font-size:12px;color:#777">You are receiving this because you subscribed to the FOMA Newsletter.</p>
  <p style="font-size:12px"><a href="{{amazonSESUnsubscribeUrl}}">Unsubscribe from the FOMA Newsletter</a></p>
</body></html>`;

    const text = [
        "FOUNDATION OF MASTERING AUTOMATION",
        title,
        date,
        "",
        description,
        "",
        extractText(newsletter.content),
        "",
        `Read this newsletter: ${url}`,
        "",
        "You are receiving this because you subscribed to the FOMA Newsletter.",
        "Unsubscribe: {{amazonSESUnsubscribeUrl}}"
    ].filter(Boolean).join("\n");

    await sesClient.send(new SendEmailCommand({
        FromEmailAddress: SES_SENDER_EMAIL,
        Destination: { ToAddresses: [email] },
        ListManagementOptions: {
            ContactListName: CONTACT_LIST_NAME,
            TopicName: TOPIC_NAME
        },
        Content: {
            Simple: {
                Subject: { Data: `FOMA Newsletter: ${title}` },
                Body: {
                    Text: { Data: text },
                    Html: { Data: html }
                }
            }
        }
    }));
}

export const handler = async (event) => {
    let payload;
    try {
        payload = JSON.parse(event.body || "{}");
    } catch {
        return jsonResponse(400, { message: "Request body must be valid JSON." });
    }

    const eventName = event?.headers?.["x-strapi-event"] || event?.headers?.["X-Strapi-Event"] || payload?.event;
    const model = payload?.model;

    if (eventName !== "entry.publish" || model !== "newsletter") {
        return jsonResponse(202, { message: "Event ignored." });
    }

    let newsletter = normalizeEntry(payload);
    const documentId = newsletter?.documentId || newsletter?.id;

    if (!newsletter || !documentId) {
        return jsonResponse(400, { message: "Published newsletter payload is missing a documentId." });
    }

    if (!newsletter.publishedAt && !newsletter.published_at) {
        return jsonResponse(400, { message: "Newsletter is not marked as published." });
    }

    // Strapi webhooks normally contain the entry. Fetching it again makes the
    // broadcaster resilient when the webhook payload is incomplete.
    if (!newsletter.content || !newsletter.title) {
        const fetched = await fetchNewsletter(documentId);
        if (fetched) newsletter = { ...fetched, documentId };
    }

    try {
        const contacts = await listOptedInContacts();
        let sent = 0;
        let skipped = 0;
        let failed = 0;

        for (const email of contacts) {
            const sendKey = `${documentId}#${email.toLowerCase()}`;
            if (await alreadySent(sendKey)) {
                skipped += 1;
                continue;
            }

            try {
                await sendNewsletterEmail(email, newsletter);
                await markSent(sendKey, email, documentId);
                sent += 1;
            } catch (error) {
                failed += 1;
                console.error("Newsletter delivery failed", {
                    name: error?.name,
                    message: error?.message,
                    code: error?.Code || error?.code,
                    statusCode: error?.$metadata?.httpStatusCode,
                    email,
                    documentId
                });
            }
        }

        console.log("Newsletter publication processed", {
            environment: ENVIRONMENT_NAME,
            documentId,
            contacts: contacts.length,
            sent,
            skipped,
            failed
        });

        return jsonResponse(200, {
            message: "Newsletter publication processed.",
            documentId,
            sent,
            skipped,
            failed
        });
    } catch (error) {
        console.error("Newsletter publication failed", {
            name: error?.name,
            message: error?.message,
            code: error?.Code || error?.code,
            statusCode: error?.$metadata?.httpStatusCode,
            documentId
        });
        return jsonResponse(500, {
            message: "Newsletter publication could not be processed."
        });
    }
};
