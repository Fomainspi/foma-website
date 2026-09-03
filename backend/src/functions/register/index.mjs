import { randomUUID } from "node:crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sesClient = new SESClient({});

const TABLE_NAME = process.env.TABLE_NAME;
const ENVIRONMENT_NAME = process.env.ENVIRONMENT_NAME || "dev";
const SES_SENDER_EMAIL = process.env.SES_SENDER_EMAIL;
const SES_ADMIN_RECIPIENT_EMAIL = process.env.SES_ADMIN_RECIPIENT_EMAIL;
const SES_ALLOWED_TEST_RECIPIENTS = (process.env.SES_ALLOWED_TEST_RECIPIENTS || "")
    .split(",")
    .map((address) => address.trim().toLowerCase())
    .filter(Boolean);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SCORE_BY_EXPERIENCE = {
    Beginner: 40,
    Intermediate: 70,
    Advanced: 90
};

function jsonResponse(statusCode, body) {
    return {
        statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };
}

function validatePayload(payload) {
    const errors = [];
    const requiredFields = ["name", "email", "phone", "country", "program", "experience"];

    for (const field of requiredFields) {
        if (!payload[field] || typeof payload[field] !== "string" || !payload[field].trim()) {
            errors.push(`"${field}" is required.`);
        }
    }

    if (payload.email && !EMAIL_REGEX.test(payload.email.trim())) {
        errors.push('"email" must be a valid email address.');
    }

    if (payload.experience && !(payload.experience in SCORE_BY_EXPERIENCE)) {
        errors.push('"experience" must be one of Beginner, Intermediate, Advanced.');
    }

    return errors;
}

// Score is always computed server-side from the validated experience level.
// A client-supplied "score" value is intentionally ignored to prevent tampering.
function computeScore(experience) {
    return SCORE_BY_EXPERIENCE[experience] ?? 0;
}

async function sendAdminNotification(registration) {
    if (!SES_SENDER_EMAIL || !SES_ADMIN_RECIPIENT_EMAIL) {
        console.warn("SES sender/admin recipient not configured; skipping admin notification email.");
        return;
    }

    const command = new SendEmailCommand({
        Source: SES_SENDER_EMAIL,
        Destination: { ToAddresses: [SES_ADMIN_RECIPIENT_EMAIL] },
        Message: {
            Subject: { Data: `[FOMA ${ENVIRONMENT_NAME.toUpperCase()}] New bootcamp registration: ${registration.name}` },
            Body: {
                Text: {
                    Data: [
                        `New bootcamp registration received (${ENVIRONMENT_NAME}).`,
                        "",
                        `Name: ${registration.name}`,
                        `Email: ${registration.email}`,
                        `Phone: ${registration.phone}`,
                        `Country: ${registration.country}`,
                        `Program: ${registration.program}`,
                        `Experience: ${registration.experience}`,
                        `Score: ${registration.score}`,
                        `Message: ${registration.message || "(none)"}`,
                        `Registration ID: ${registration.registrationId}`,
                        `Submitted at: ${registration.createdAt}`
                    ].join("\n")
                }
            }
        }
    });

    await sesClient.send(command);
}

// Dev-only safety guard: only send the optional student confirmation email
// if the recipient is on the explicit verified-address allowlist. This
// prevents accidentally emailing arbitrary external addresses while testing.
// In Production this variable is expected to be left empty/unused because
// Production SES will be out of the sandbox with domain-level sending.
function isConfirmationRecipientAllowed(email) {
    if (ENVIRONMENT_NAME !== "dev") {
        return true;
    }
    return SES_ALLOWED_TEST_RECIPIENTS.includes(email.toLowerCase());
}

async function sendStudentConfirmation(registration) {
    if (!SES_SENDER_EMAIL) {
        console.warn("SES sender not configured; skipping student confirmation email.");
        return;
    }

    if (!isConfirmationRecipientAllowed(registration.email)) {
        console.info(
            `Skipping student confirmation email in ${ENVIRONMENT_NAME}: ` +
            `${registration.email} is not in SES_ALLOWED_TEST_RECIPIENTS.`
        );
        return;
    }

    const command = new SendEmailCommand({
        Source: SES_SENDER_EMAIL,
        Destination: { ToAddresses: [registration.email] },
        Message: {
            Subject: { Data: "FOMA Bootcamp: We received your registration" },
            Body: {
                Text: {
                    Data: [
                        `Hi ${registration.name},`,
                        "",
                        "Thank you for registering for the FOMA DevOps Bootcamp. We have received your application",
                        `for the "${registration.program}" program and will be in touch shortly.`,
                        "",
                        "— The FOMA Team"
                    ].join("\n")
                }
            }
        }
    });

    await sesClient.send(command);
}

export const handler = async (event) => {
    let payload;
    try {
        payload = JSON.parse(event.body || "{}");
    } catch (error) {
        return jsonResponse(400, { message: "Request body must be valid JSON." });
    }

    const validationErrors = validatePayload(payload);
    if (validationErrors.length > 0) {
        return jsonResponse(400, { message: validationErrors.join(" ") });
    }

    const registration = {
        registrationId: randomUUID(),
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        country: payload.country.trim(),
        program: payload.program.trim(),
        experience: payload.experience.trim(),
        message: typeof payload.message === "string" ? payload.message.trim() : "",
        score: computeScore(payload.experience.trim()),
        submittedAt: typeof payload.submittedAt === "string" ? payload.submittedAt : null,
        createdAt: new Date().toISOString(),
        environment: ENVIRONMENT_NAME
    };

    try {
        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: registration,
                ConditionExpression: "attribute_not_exists(registrationId)"
            })
        );
    } catch (error) {
        console.error("Failed to store registration", error);
        return jsonResponse(500, { message: "Something went wrong. Please try again." });
    }

    try {
        await sendAdminNotification(registration);
    } catch (error) {
        // The registration is already stored; a notification failure should not
        // fail the whole request, but must be logged for follow-up.
        console.error("Failed to send admin notification email", error);
    }

    if (payload.sendConfirmation) {
        try {
            await sendStudentConfirmation(registration);
        } catch (error) {
            console.error("Failed to send student confirmation email", error);
        }
    }

    return jsonResponse(201, {
        message: "Thank you! Your application has been received. We will be in touch shortly.",
        registrationId: registration.registrationId
    });
};
