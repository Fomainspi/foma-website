import { SESv2Client, CreateContactCommand, GetContactCommand, UpdateContactCommand, SendEmailCommand } from "@aws-sdk/client-sesv2";

const sesClient = new SESv2Client({});
const ENVIRONMENT_NAME = process.env.ENVIRONMENT_NAME || "dev";
// The contact list is created once as infrastructure (see backend/template.yaml).
// The Lambda only manages contacts inside the existing list.
const CONTACT_LIST_NAME = process.env.NEWSLETTER_CONTACT_LIST_NAME || "FOMA-Newsletter";
const TOPIC_NAME = process.env.NEWSLETTER_TOPIC_NAME || "FOMA-Newsletter";
const SES_SENDER_EMAIL = process.env.SES_SENDER_EMAIL;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

async function upsertContact(email) {
    const contact = {
        ContactListName: CONTACT_LIST_NAME,
        EmailAddress: email,
        TopicPreferences: [
            {
                TopicName: TOPIC_NAME,
                SubscriptionStatus: "OPT_IN"
            }
        ],
        UnsubscribeAll: false
    };

    try {
        await sesClient.send(new CreateContactCommand(contact));
        return;
    } catch (error) {
        if (error?.name !== "AlreadyExistsException") {
            throw error;
        }
    }

    const existing = await sesClient.send(
        new GetContactCommand({
            ContactListName: CONTACT_LIST_NAME,
            EmailAddress: email
        })
    );

    const preferences = (existing.TopicPreferences || []).map((preference) => ({
        TopicName: preference.TopicName,
        SubscriptionStatus: preference.TopicName === TOPIC_NAME
            ? "OPT_IN"
            : preference.SubscriptionStatus
    }));

    if (!preferences.some((preference) => preference.TopicName === TOPIC_NAME)) {
        preferences.push({ TopicName: TOPIC_NAME, SubscriptionStatus: "OPT_IN" });
    }

    await sesClient.send(
        new UpdateContactCommand({
            ContactListName: CONTACT_LIST_NAME,
            EmailAddress: email,
            TopicPreferences: preferences,
            UnsubscribeAll: false
        })
    );
}

async function sendWelcomeEmail(email) {
    if (!SES_SENDER_EMAIL) return false;

    await sesClient.send(
        new SendEmailCommand({
            FromEmailAddress: SES_SENDER_EMAIL,
            Destination: { ToAddresses: [email] },
            ListManagementOptions: {
                ContactListName: CONTACT_LIST_NAME,
                TopicName: TOPIC_NAME
            },
            Content: {
                Simple: {
                    Subject: {
                        Data: "Welcome to the FOMA Newsletter"
                    },
                    Body: {
                        Text: {
                            Data: [
                                "Foundation of Mastering Automation",
                                "",
                                "Thank you for subscribing to the FOMA Newsletter.",
                                "",
                                "You will receive practical insights and updates about DevOps, DevSecOps, Cloud, Kubernetes and automation.",
                                "",
                                "Visit us: https://foma.life",
                                "",
                                "You can unsubscribe at any time using the unsubscribe link provided in our emails.",
                                "",
                                "— Foundation of Mastering Automation (FOMA)"
                            ].join("\n")
                        },
                        Html: {
                            Data: `<!doctype html><html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#222"><h1>Foundation of Mastering Automation</h1><p>Thank you for subscribing to the <strong>FOMA Newsletter</strong>.</p><p>You will receive practical insights and updates about DevOps, DevSecOps, Cloud, Kubernetes and automation.</p><p><a href="https://foma.life">Visit foma.life</a></p><hr><p style="font-size:12px;color:#666">You can unsubscribe at any time using the unsubscribe link below.</p><p style="font-size:12px"><a href="{{amazonSESUnsubscribeUrl}}">Unsubscribe from the FOMA Newsletter</a></p><p style="font-size:12px;color:#666">— Foundation of Mastering Automation</p></body></html>`
                        }
                    }
                }
            }
        })
    );

    return true;
}

export const handler = async (event) => {
    let payload;
    try {
        payload = JSON.parse(event.body || "{}");
    } catch {
        return jsonResponse(400, { message: "Request body must be valid JSON." });
    }

    const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

    if (!EMAIL_REGEX.test(email)) {
        return jsonResponse(400, { message: "Please enter a valid email address." });
    }

    try {
        await upsertContact(email);
    } catch (error) {
        console.error("Newsletter contact subscription failed", {
            name: error?.name,
            message: error?.message,
            code: error?.Code || error?.code,
            statusCode: error?.$metadata?.httpStatusCode
        });
        return jsonResponse(500, {
            message: "We could not complete your subscription right now. Please try again later."
        });
    }

    let welcomeEmailSent = false;
    try {
        welcomeEmailSent = await sendWelcomeEmail(email);
    } catch (error) {
        console.error("Newsletter welcome email failed", {
            name: error?.name,
            message: error?.message,
            code: error?.Code || error?.code,
            statusCode: error?.$metadata?.httpStatusCode
        });
    }

    return jsonResponse(201, {
        message: welcomeEmailSent
            ? "You're subscribed to the FOMA Newsletter. Welcome to Foundation of Mastering Automation!"
            : "You're subscribed to the FOMA Newsletter. Welcome to Foundation of Mastering Automation! Your welcome email may be delayed.",
        website: "https://foma.life",
        environment: ENVIRONMENT_NAME
    });
};
