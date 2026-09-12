# FOMA.life — Foundation of Mastering Automation

> **DevOps from Zero to Hero** — a production-oriented learning platform for the Foundation of Mastering Automation (FOMA).

FOMA.life is an end-to-end project designed, built, deployed, and operated by **William Foma**. The project combines product/UI design, a responsive static frontend, AWS serverless services, CI/CD automation, infrastructure configuration, application security, observability, and continuous improvement.

## 🌐 Live Platform

- **Website:** https://foma.life
- **Repository:** https://github.com/Fomainspi/foma-website
- **Primary AWS Region:** `ap-southeast-1` (Singapore)

## 🎯 Project Goals

FOMA.life was created to provide a professional online presence and registration platform for a DevOps training initiative while serving as a practical demonstration of modern DevOps and cloud engineering practices.

The project focuses on:

- Professional UX/UI and responsive web design
- Cloud-native and serverless architecture
- Automated CI/CD
- Infrastructure managed through AWS SAM/CloudFormation
- Secure separation of development and production environments
- Reliable bootcamp registration and newsletter workflows
- Monitoring, troubleshooting, and operational readiness
- Continuous improvement based on real deployment and user-experience issues

## 🏗️ High-Level Architecture

```text
                         ┌──────────────────────┐
                         │       Visitors       │
                         │     foma.life        │
                         └──────────┬───────────┘
                                    │ HTTPS
                                    ▼
                         ┌──────────────────────┐
                         │   CloudFront / CDN   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     Static Frontend  │
                         │        Amazon S3     │
                         └──────────┬───────────┘
                                    │ API requests
                                    ▼
                         ┌──────────────────────┐
                         │    Amazon API        │
                         │       Gateway        │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
          ┌────────────────────┐        ┌──────────────────────┐
          │ Registration       │        │ Newsletter           │
          │ AWS Lambda         │        │ AWS Lambda            │
          └─────────┬──────────┘        └──────────┬───────────┘
                    │                              │
                    ▼                              ▼
          ┌────────────────────┐        ┌──────────────────────┐
          │    DynamoDB        │        │ Amazon SES           │
          │ Registrations      │        │ Contact List / Email │
          └────────────────────┘        └──────────────────────┘
                    │
                    ▼
               Amazon SES
             Email notification

        GitHub ──► GitHub Actions ──► AWS SAM/CloudFormation
```

## ☁️ AWS Services

| Service | Purpose |
|---|---|
| **Amazon S3** | Hosts the static website assets |
| **Amazon CloudFront** | CDN delivery, HTTPS and production content distribution |
| **Amazon API Gateway** | HTTP API entry point for backend operations |
| **AWS Lambda** | Serverless registration and newsletter processing |
| **Amazon DynamoDB** | Stores bootcamp registration records |
| **Amazon SES** | Registration notifications, confirmations and newsletter emails |
| **AWS SAM** | Serverless application definition, build and deployment |
| **AWS CloudFormation** | Infrastructure provisioning and environment management |
| **IAM** | Least-privilege access and deployment permissions |
| **CloudWatch / AWS logging** | Operational visibility and troubleshooting |

## 🔐 Environment Separation

The backend is deliberately separated into independent Dev and Production environments.

- **Dev:** `foma-backend-dev`
- **Production:** `foma-backend-prod`

Each environment has its own API, Lambda functions, DynamoDB table, CloudFormation stack and IAM configuration. There are no cross-environment resource references.

The production backend is deployed in `ap-southeast-1`.

## ⚙️ Backend Architecture

The backend is implemented as an AWS SAM application under [`backend/`](backend/).

### Registration flow

```text
Visitor
  │
  │ POST /register
  ▼
API Gateway
  │
  ▼
foma-register-prod Lambda
  │
  ├── Validate input
  ├── Calculate enrollment score server-side
  ├── Store registration in DynamoDB
  ├── Send admin notification through SES
  └── Optionally send student confirmation
```

The registration record is written to DynamoDB before email notifications are attempted. This prevents an email-delivery problem from causing an otherwise valid registration to be lost.

### Newsletter flow

```text
Visitor
  │
  │ POST /newsletter/subscribe
  ▼
API Gateway
  │
  ▼
foma-newsletter-subscribe-prod Lambda
  │
  ├── Create/update SES contact
  ├── Explicitly opt visitor into topic
  └── Send welcome email
```

The `FOMA-Newsletter` SES contact list is provisioned as infrastructure rather than being created at request time. Subscription is idempotent: an existing contact is updated instead of creating a duplicate contact-list resource.

## 🚀 CI/CD

The project uses **GitHub Actions** to automate production backend deployment.

Production backend changes are triggered when changes are pushed to `main` under `backend/**` or the production deployment workflow.

```text
Git push to main
       │
       ▼
GitHub Actions
       │
       ├── Checkout
       ├── Configure AWS credentials using OIDC
       ├── Install AWS SAM CLI
       ├── sam build
       ├── sam deploy --config-env prod
       ├── Display deployed endpoints
       └── Production newsletter smoke test
```

The deployment workflow uses **GitHub OIDC** rather than storing long-lived AWS access keys in the repository.

Workflow: `.github/workflows/deploy-backend-production.yml`

## 🧪 Deployment Validation

Deployment success is not treated as equivalent to application health.

After deployment, the pipeline performs a production smoke test against the newsletter endpoint and expects HTTP `201` for a successful subscription request.

Operational validation also includes checking:

- API availability
- Lambda execution
- DynamoDB persistence
- SES behavior
- Application logs
- HTTP responses
- Frontend behavior
- CDN/content propagation

## 🛡️ Security Practices

Security was considered throughout the project rather than added only after deployment.

Key practices include:

- AWS IAM-based access control
- GitHub Actions authentication through OIDC
- Server-side handling of administrative email configuration
- No reliance on browser-supplied admin notification addresses
- Separate Dev and Production resources
- API throttling to reduce accidental abuse/spam
- HTTPS through the production delivery layer
- Sensitive configuration kept outside application source code

The production API uses conservative throttling defaults of **5 requests/second** with a **10-request burst limit**, configurable through the SAM deployment parameters.

## 📊 Monitoring & Observability

The project is operated with an observability mindset rather than simply being deployed and forgotten.

Monitoring and troubleshooting focus on:

- Application logs
- Lambda execution behavior
- API responses
- Registration failures
- Newsletter subscription failures
- Infrastructure health
- Deployment results
- CDN/content delivery behavior
- User-facing errors

When an issue occurs, the troubleshooting approach is to correlate deployment changes, application behavior, AWS service logs and configuration rather than treating symptoms in isolation.

## 🧩 Real-World Troubleshooting & Continuous Improvement

FOMA.life has also been a practical DevOps laboratory where infrastructure and application issues were diagnosed and improved.

### CloudFront cache propagation

One operational issue involved website updates being successfully deployed to S3 while users continued to see older content. The investigation showed that the origin content had changed but cached CloudFront objects had not yet been invalidated.

The lesson was to distinguish between:

```text
Source deployment ≠ CDN content refresh
```

The deployment process was therefore improved to account for cache invalidation/content propagation when required.

### Responsive UI issue

A mobile UI issue caused the language-selection controls to overlap the logo. I reproduced the problem on smaller screen sizes, adjusted the responsive CSS/layout, tested the change, and redeployed through the CI/CD process.

This reflects the project's broader philosophy: **observe → reproduce → diagnose → fix → validate → document → improve**.

## 🎨 Product & UI/UX Design

FOMA.life is also a design project. I own the visual and user experience aspects of the platform, including:

- Brand identity
- Website layout
- Navigation
- Responsive design
- Training/course presentation
- Registration experience
- Mobile usability
- Visual assets
- Content presentation

This combination of design and engineering allows the project to be improved from both the **user perspective** and the **platform/operations perspective**.

## 📁 Repository Structure

```text
foma-website/
├── .github/
│   └── workflows/
│       └── deploy-backend-production.yml
├── backend/
│   ├── events/
│   ├── src/
│   │   └── functions/
│   │       ├── register/
│   │       └── subscribe/
│   ├── samconfig.toml
│   ├── template.yaml
│   └── README.md
├── blog/
├── components/
├── css/
├── images/
├── infrastructure/
│   └── cloudfront-clean-urls.js
├── js/
├── about.html
├── blog.html
├── contact.html
├── index.html
├── newsletter.html
├── local_server.py
└── README.md
```

## 🛠️ Local Development

The frontend is a static website and can be served locally using the included Python helper:

```bash
python local_server.py
```

For backend development:

```bash
cd backend
sam build
```

The backend also contains sample events and unit tests for the newsletter subscription Lambda.

## 🚢 Backend Deployment

### Development

```bash
cd backend
sam build
sam deploy --config-env dev
```

### Production

Production deployment is normally performed through GitHub Actions from `main`.

For an intentional authorized manual deployment:

```bash
cd backend
sam build
sam deploy --config-env prod
```

Production deployments should be treated as controlled changes because they modify the live backend.

## 🔄 Engineering Approach

The project follows a practical DevOps lifecycle:

```text
Plan
  ↓
Design
  ↓
Develop
  ↓
Version Control
  ↓
Validate
  ↓
Build
  ↓
Deploy
  ↓
Monitor
  ↓
Troubleshoot
  ↓
Improve
  ↺
```

The goal is not only automation. The goal is to create a platform that is **repeatable, observable, secure, maintainable and continuously improved**.

## 📌 Project Highlights

- End-to-end ownership from product design to production operations
- AWS serverless backend
- S3 + CloudFront frontend delivery
- API Gateway + Lambda + DynamoDB + SES
- Separate Dev and Production environments
- AWS SAM / CloudFormation infrastructure
- GitHub Actions CI/CD
- GitHub OIDC authentication to AWS
- API throttling
- Automated production smoke testing
- Application and infrastructure troubleshooting
- Responsive UI/UX design
- Continuous monitoring and improvement

## 👨‍💻 Author

**William Foma**  
DevOps / DevSecOps Engineer | Cloud & Automation | Product & UI Designer

FOMA — Foundation of Mastering Automation

Website: https://foma.life

---

> **Project philosophy:** Build it, automate it, secure it, monitor it, troubleshoot it, document it, and improve it.
