# FOMA Backend (Serverless Registration Stack)

This directory contains the AWS SAM project implementing the FOMA bootcamp
registration backend. It is deployed as two isolated environments:

- **Dev:** `foma-backend-dev`
- **Production:** `foma-backend-prod`

The original legacy `bootcamp-registration` Lambda/API Gateway/database was
left untouched during the migration and remains available as a rollback
reference. The production website no longer calls the legacy API.

## Production status

Production cutover is complete and has been validated end-to-end.

- Website: `https://foma.life`
- Production API: `https://7gd3r709wf.execute-api.ap-southeast-1.amazonaws.com/prod`
- Registration route: `POST /register`
- Newsletter subscription route: `POST /newsletter/subscribe`
- Lambda: `foma-register-prod`
- Newsletter Lambda: `foma-newsletter-subscribe-prod`
- DynamoDB table: `foma-registrations-prod`
- CloudFormation stack: `foma-backend-prod`
- Region: `ap-southeast-1`

A real submission from `foma.life` returned the expected success message,
and the configured admin notification email was received successfully.
The Lambda writes the registration to DynamoDB before attempting email
notifications, so a successful registration response plus the subsequent
admin email confirms the production registration path is functioning.

## Newsletter

The newsletter subscription endpoint uses Amazon SES contact-list management.
A shared SES contact list named `FOMA-Newsletter` is created by the subscription
Lambda when first needed, avoiding CloudFormation contact-list tagging
requirements. The list contains the `FOMA-Newsletter` topic.

A successful subscription explicitly opts the visitor into that topic and
sends a welcome email through SES with an unsubscribe link. Newsletter
subscriptions are separate from bootcamp registration records.

## Architecture

```
Frontend (dev.foma.life / foma.life)
        |
        v
API Gateway (HTTP API, per environment)
        |
        +--> Lambda: foma-register-<env>
        |        |
        |        +--> DynamoDB: foma-registrations-<env>
        |        +--> Amazon SES (registration emails)
        |
        +--> Lambda: foma-newsletter-subscribe-<env>
                 |
                 +--> Amazon SES Contact List: FOMA-Newsletter
                 +--> Amazon SES (welcome email)
```

Every environment has its own CloudFormation stack, API, Lambda, DynamoDB
table, and IAM role. There are no cross-environment resource references.

## API throttling

The API stage uses conservative defaults to protect the public registration
route from accidental abuse/spam:

- `ApiThrottlingRateLimit`: 5 requests/second
- `ApiThrottlingBurstLimit`: 10 requests

These are template parameters and can be changed independently per
environment through `samconfig.toml`.

## Files

- `template.yaml` — AWS SAM template parameterized by environment, CORS,
  SES addresses, and throttling settings.
- `src/functions/register/index.mjs` — Registration Lambda. It validates
  input, computes the enrollment score server-side, stores the registration
  in DynamoDB, sends the admin notification, and optionally sends a student
  confirmation.
- `src/functions/subscribe/index.mjs` — Newsletter subscription Lambda.
- `src/functions/register/package.json` — Lambda dependencies.
- `samconfig.toml` — Separate deployment configuration for Dev and Production.
- `events/register-event.json` — Sample event for local testing.

## Email safety

Dev uses `SesAllowedTestRecipients` as an explicit allowlist for student
confirmation emails. Production does not use that Dev allowlist; the
Production Lambda permits confirmation emails when the frontend requests
one, subject to the SES account/domain configuration.

The admin notification recipient is always taken from the server-side
`SesAdminRecipientEmail` parameter. It is never accepted from the browser.

## Deploying Dev

```bash
cd backend
sam build
sam deploy --config-env dev
```

## Deploying Production

Production is deployed by GitHub Actions from `main` using the configured
OIDC deployment role. The workflow is:

`.github/workflows/deploy-backend-production.yml`

For an intentional manual deployment from an authorized environment:

```bash
cd backend
sam build
sam deploy --config-env prod
```

Do not run a Production deployment casually; it changes the live backend.

## Frontend integration

The frontend resolves the registration API by hostname:

- `dev.foma.life` → Dev `/dev/register` endpoint
- `foma.life` → Production `/prod/register` endpoint

Newsletter subscription uses the corresponding `/newsletter/subscribe` route.

## Legacy backend / rollback

The legacy `bootcamp-registration` backend was not modified or deleted as
part of the migration. It should be treated as a **frozen rollback reference**
until the new Production backend has been operating reliably for an agreed
period.

Before deleting or disabling the legacy resources, verify that:

1. Production registrations continue to appear in `foma-registrations-prod`.
2. Admin notification emails continue to arrive.
3. Student confirmation behavior is correct, if enabled by the form.
4. No production frontend code references the legacy API.
5. No other application or scheduled process still depends on the legacy
   Lambda/API/database.

The frontend repository currently contains no reference to the old legacy
API endpoint.

## Operational note

The Lambda intentionally treats email notification failures separately from
the registration write. If SES fails after the DynamoDB write, the user can
still receive the successful registration response while the failure is
logged for follow-up. This prevents a mail delivery problem from causing a
successful application to be lost.
