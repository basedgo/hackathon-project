# Last Mile Food Rescue

Last Mile Food Rescue is a hackathon project for coordinating closing-time surplus food pickup. Restaurants can post available food with a short pickup window, while shelters, food banks, and volunteers can find nearby listings, claim pickups, and track delivery activity.

The app is split into a React frontend and a Spring Boot backend backed by PostgreSQL. The frontend focuses on the donor, recipient, and volunteer workflow. The backend owns listings, organizations, users, pickup claims, alert preferences, tags, and audit events.

## Project Structure

```text
.
├── frontend/                 # React + Vite app
├── backend/                  # Java Spring Boot API
├── template.yaml             # Early AWS SAM Lambda/API Gateway deployment config
└── README.md
```

## Tech Stack

- React 19, TypeScript, and Vite
- Java 21 and Spring Boot 3
- PostgreSQL
- Flyway database migrations
- Maven

## Prerequisites

Install these before running the project locally:

- Node.js and npm
- Java 21
- Maven
- PostgreSQL

On macOS, PostgreSQL can be installed with Homebrew:

```bash
brew install postgresql@16
brew services start postgresql@16
```

## Backend Setup

Create the local database and user expected by the default Spring configuration:

```bash
createdb food_rescue
createuser food_rescue
psql -d food_rescue
```

Inside `psql`, run:

```sql
alter user food_rescue with password 'food_rescue';
grant all privileges on database food_rescue to food_rescue;
grant all on schema public to food_rescue;
\q
```

Start the backend:

```bash
cd backend
mvn spring-boot:run
```

The API runs on `http://localhost:8080`. Flyway runs automatically on startup and applies migrations from:

```text
backend/src/main/resources/db/migration
```

The backend uses these local defaults:

```properties
DATABASE_URL=jdbc:postgresql://localhost:5432/food_rescue
DATABASE_USERNAME=food_rescue
DATABASE_PASSWORD=food_rescue
```

To use a different database, pass environment variables when starting the backend:

```bash
DATABASE_URL=jdbc:postgresql://<host>:5432/food_rescue \
DATABASE_USERNAME=<username> \
DATABASE_PASSWORD=<password> \
mvn spring-boot:run
```

## Frontend Setup

Install dependencies and start the Vite dev server:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the URL printed by Vite, usually `http://localhost:5173`.

During local development, Vite proxies `/api` requests to the backend at `http://localhost:8080`, so the normal local setup is:

1. Start PostgreSQL.
2. Start the backend from `backend/`.
3. Start the frontend from `frontend/`.

If the API is hosted somewhere else, set:

```bash
VITE_API_BASE_URL=https://example.com/api npm run dev
```

## Useful Commands

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

Backend:

```bash
cd backend
mvn spring-boot:run
mvn test
mvn clean package
```

## Database Notes

The first Flyway migration creates and seeds the core local tables:

- `organizations`
- `app_users`
- `food_listings`
- `pickup_claims`
- `listing_alert_preferences`
- `listing_tags`
- `audit_events`

To inspect local data:

```bash
psql -U food_rescue -d food_rescue
```

Example checks:

```sql
\dt

select title, category, quantity_label, status
from food_listings
order by created_at desc;
```

For a deeper database walkthrough, see `backend/TESTING_DATABASE.md`.

## Deployment Notes

The repo includes a public demo deployment path using AWS SAM:

- Spring Boot API on AWS Lambda behind API Gateway.
- React frontend in a private S3 bucket served through CloudFront.
- Demo data in an embedded H2 database so deployment does not require RDS.

Prerequisites:

- AWS CLI configured with credentials.
- AWS SAM CLI installed.
- Java, Maven, Node.js, and npm installed locally.

Deploy:

```bash
./scripts/deploy-public.sh
```

The script deploys the AWS stack, reads the API Gateway URL, builds the frontend with `VITE_API_BASE_URL`, uploads `frontend/dist` to S3, and invalidates CloudFront. It prints the public frontend URL when it finishes.

The default stack name is `last-mile-food-rescue-public`. Override it if needed:

```bash
STACK_NAME=my-food-rescue-demo ./scripts/deploy-public.sh
```

Deploy with RDS PostgreSQL:

```bash
DEPLOY_DATABASE=true ./scripts/deploy-public.sh
```

That creates a private RDS PostgreSQL instance, a VPC with two private subnets, security groups that allow Lambda to reach PostgreSQL, and Lambda VPC configuration. Flyway applies the PostgreSQL migrations the first time the API starts.

Optional RDS settings:

```bash
DEPLOY_DATABASE=true \
DATABASE_NAME=food_rescue \
DATABASE_USERNAME=food_rescue \
DATABASE_PASSWORD=<strong-password> \
DATABASE_INSTANCE_CLASS=db.t4g.micro \
DATABASE_ALLOCATED_STORAGE=20 \
./scripts/deploy-public.sh
```

Undeploy:

```bash
./scripts/delete-public.sh
```

This empties the frontend bucket and deletes the SAM/CloudFormation stack. If the stack created RDS, the database is deleted too.

To use an existing PostgreSQL database instead of creating RDS in this stack, pass database environment variables:

```bash
DATABASE_URL=jdbc:postgresql://<host>:5432/food_rescue \
DATABASE_USERNAME=<username> \
DATABASE_PASSWORD=<password> \
SPRING_PROFILES_ACTIVE=default \
./scripts/deploy-public.sh
```

If the database is private in a VPC, add Lambda VPC configuration to `template.yaml` before deploying.
