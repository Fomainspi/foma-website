// FOMA NEWSLETTER SUBSCRIPTION

const NEWSLETTER_SUBSCRIBE_ENDPOINTS = {
    production: "https://7gd3r709wf.execute-api.ap-southeast-1.amazonaws.com/prod/newsletter/subscribe",
    dev: "https://04almrnto7.execute-api.ap-southeast-1.amazonaws.com/dev/newsletter/subscribe"
};

function getNewsletterSubscribeEndpoint() {
    return window.location.hostname === "dev.foma.life"
        ? NEWSLETTER_SUBSCRIBE_ENDPOINTS.dev
        : NEWSLETTER_SUBSCRIBE_ENDPOINTS.production;
}

function initializeNewsletterSubscription() {
    const form = document.getElementById("newsletterSubscribeForm");
    const emailInput = document.getElementById("newsletterEmail");
    const feedback = document.getElementById("newsletterSubscribeFeedback");

    if (!form || !emailInput || !feedback) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        feedback.textContent = "";
        feedback.className = "newsletter-subscribe-feedback";

        const email = emailInput.value.trim().toLowerCase();
        if (!email || !emailInput.checkValidity()) {
            feedback.textContent = "Please enter a valid email address.";
            feedback.classList.add("error");
            return;
        }

        const button = form.querySelector("button[type=submit]");
        if (button) button.disabled = true;

        try {
            const response = await fetch(getNewsletterSubscribeEndpoint(), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.message || "Unable to subscribe right now.");
            }

            feedback.textContent = result.message || "You're subscribed to the FOMA Newsletter. Welcome to Foundation of Mastering Automation!";
            feedback.classList.add("success");
            form.reset();
        } catch (error) {
            console.error("Newsletter subscription failed:", error);
            feedback.textContent = error.message || "Unable to subscribe right now. Please try again later.";
            feedback.classList.add("error");
        } finally {
            if (button) button.disabled = false;
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeNewsletterSubscription);
} else {
    initializeNewsletterSubscription();
}
