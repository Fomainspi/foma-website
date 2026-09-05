import assert from "node:assert/strict";
import { beforeEach, describe, it, mock } from "node:test";

import { SESv2Client } from "@aws-sdk/client-sesv2";

// The handler reads configuration from the environment at import time.
process.env.NEWSLETTER_CONTACT_LIST_NAME = "FOMA-Newsletter";
process.env.NEWSLETTER_TOPIC_NAME = "FOMA-Newsletter";
process.env.SES_SENDER_EMAIL = "bootcamp@foma.life";

const { handler } = await import("./index.mjs");

const CONTACT_LIST_NAME = process.env.NEWSLETTER_CONTACT_LIST_NAME || "FOMA-Newsletter";
const TOPIC_NAME = process.env.NEWSLETTER_TOPIC_NAME || "FOMA-Newsletter";

function commandName(command) {
    return command.constructor.name;
}

function makeEvent(body) {
    return { body: typeof body === "string" ? body : JSON.stringify(body) };
}

describe("newsletter subscribe handler", () => {
    let sendMock;

    beforeEach(() => {
        sendMock = mock.method(SESv2Client.prototype, "send", async () => ({}));
    });

    it("creates a contact in the existing list and returns 201", async () => {
        const response = await handler(makeEvent({ email: "Reader@Example.com" }));

        assert.equal(response.statusCode, 201);
        const body = JSON.parse(response.body);
        assert.match(body.message, /subscribed/i);

        const calls = sendMock.mock.calls.map((call) => call.arguments[0]);
        const names = calls.map(commandName);

        // The Lambda must never create the contact list at request time.
        assert.ok(!names.includes("CreateContactListCommand"));
        assert.deepEqual(names, ["CreateContactCommand", "SendEmailCommand"]);

        const createContact = calls[0].input;
        assert.equal(createContact.ContactListName, CONTACT_LIST_NAME);
        assert.equal(createContact.EmailAddress, "reader@example.com");
        assert.deepEqual(createContact.TopicPreferences, [
            { TopicName: TOPIC_NAME, SubscriptionStatus: "OPT_IN" }
        ]);

        const welcomeEmail = calls[1].input;
        assert.deepEqual(welcomeEmail.Destination, { ToAddresses: ["reader@example.com"] });
        assert.deepEqual(welcomeEmail.ListManagementOptions, {
            ContactListName: CONTACT_LIST_NAME,
            TopicName: TOPIC_NAME
        });
    });

    it("is idempotent: resubscribing the same email updates the contact instead of failing", async () => {
        sendMock.mock.mockImplementation(async (command) => {
            if (commandName(command) === "CreateContactCommand") {
                const error = new Error("Contact already exists");
                error.name = "AlreadyExistsException";
                throw error;
            }
            if (commandName(command) === "GetContactCommand") {
                return {
                    TopicPreferences: [
                        { TopicName: TOPIC_NAME, SubscriptionStatus: "OPT_OUT" }
                    ]
                };
            }
            return {};
        });

        const response = await handler(makeEvent({ email: "reader@example.com" }));

        assert.equal(response.statusCode, 201);

        const names = sendMock.mock.calls.map((call) => commandName(call.arguments[0]));
        assert.deepEqual(names, [
            "CreateContactCommand",
            "GetContactCommand",
            "UpdateContactCommand",
            "SendEmailCommand"
        ]);

        const update = sendMock.mock.calls[2].arguments[0].input;
        assert.equal(update.ContactListName, CONTACT_LIST_NAME);
        assert.equal(update.EmailAddress, "reader@example.com");
        assert.deepEqual(update.TopicPreferences, [
            { TopicName: TOPIC_NAME, SubscriptionStatus: "OPT_IN" }
        ]);
    });

    it("still returns 201 when the welcome email fails", async () => {
        sendMock.mock.mockImplementation(async (command) => {
            if (commandName(command) === "SendEmailCommand") {
                throw new Error("SES throttled");
            }
            return {};
        });

        const errorMock = mock.method(console, "error", () => {});
        const response = await handler(makeEvent({ email: "reader@example.com" }));

        assert.equal(response.statusCode, 201);
        const body = JSON.parse(response.body);
        assert.match(body.message, /welcome email may be delayed/i);
        assert.equal(errorMock.mock.calls.length, 1);
    });

    it("returns 500 when the contact cannot be saved", async () => {
        sendMock.mock.mockImplementation(async (command) => {
            if (commandName(command) === "CreateContactCommand") {
                const error = new Error("No such contact list");
                error.name = "NotFoundException";
                throw error;
            }
            return {};
        });

        const errorMock = mock.method(console, "error", () => {});
        const response = await handler(makeEvent({ email: "reader@example.com" }));

        assert.equal(response.statusCode, 500);
        assert.equal(errorMock.mock.calls.length, 1);
    });

    it("rejects invalid email addresses with 400 and does not call SES", async () => {
        const response = await handler(makeEvent({ email: "not-an-email" }));

        assert.equal(response.statusCode, 400);
        assert.equal(sendMock.mock.calls.length, 0);
    });

    it("rejects invalid JSON bodies with 400 and does not call SES", async () => {
        const response = await handler(makeEvent("{not json"));

        assert.equal(response.statusCode, 400);
        assert.equal(sendMock.mock.calls.length, 0);
    });
});
