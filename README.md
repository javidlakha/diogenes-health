# Diogenes Health

Diogenes Health is a powerful electronic health record built on top of AWS and
GPT-4.

## Features

- A fast and powerful custom template builder that supports medical diagrams,
  checklists and text
- Voice transcription
- Automatically generate in-patient progress notes, discharge summaries and
  referral letters using GPT-4
- High quality medical diagrams that can be annotated
- Create, update and access notes on any device
- Securely send notes to patients or colleagues via email
- Export to Microsoft Word or PDF
- Audit trail

## Tech stack

- AWS: API Gateway, AppSync, CDK, CloudFront, Cognito, DynamoDB, Lambda,
  Route53, S3, SES
- Docker
- GraphQL + Apollo
- OpenAI: GPT-4, Whisper
- Python
- React

## Setup

To install all Python and TypeScript dependencies and set up git hooks:

```bash
yarn setup
```

Then, populate `.env.local` and `.env.production`.

Finally, run

```bash
yarn deploy-to-staging
```

to set up the staging server for local development.

## Local development

Local development is supported for the frontend. The staging server is used for
the backend.

```bash
yarn start
```

## Deployments

The deployment scripts require Docker.

### Staging

```bash
yarn deploy-to-staging
```

### Production

```bash
yarn deploy-to-production
```
