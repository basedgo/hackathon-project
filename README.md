# Last Mile Food Rescue

Hackathon concept: restaurants and grocery stores post closing-time surplus food with a one-hour pickup window. Nearby shelters and volunteers receive a real-time alert, claim the pickup, and move the food before it becomes waste.

## AWS Service Architecture

### Core Request Flow

1. **React frontend on AWS Amplify Hosting**
   - Hosts the donor, shelter, and volunteer web app.
   - Calls the Spring Boot API over HTTPS.
   - Keeps the demo simple while still showing a deployable cloud frontend.

2. **Java Spring Boot API on AWS Elastic Beanstalk**
   - Owns listing creation, recipient matching, claim status, and volunteer assignment.
   - Exposes endpoints such as `POST /api/listings`, `GET /api/listings/nearby`, and `POST /api/listings/{id}/claim`.
   - This is the easiest AWS path for a hackathon Spring Boot backend because Beanstalk handles EC2 provisioning, load balancing, logs, and app deployment.

3. Amazon RDS (PostgreSQL)

Stores surplus listings, shelters, volunteers, claims, and audit events.
Recommended tables:

   -food_listings: listing_id, donor details, food description, servings, pickup deadline, status, latitude, longitude.
   -recipients: shelter or volunteer contact preferences, service radius, capacity, topic_arn.
   -claims: listing_id, recipient_id, volunteer_id, status, timestamps.

   -Use expires_at timestamp column + a scheduled cleanup (via Lambda/EventBridge) to handle expired listings.
   -Spring Boot connects via JPA/Hibernate — no extra client library needed beyond the PostgreSQL driver.

4. **Amazon SNS**
   - Sends SMS, email, or mobile push alerts to nearby shelters and volunteer groups.
   - Topic strategy for the demo:
     - `food-rescue-zip-94103`
     - `food-rescue-zip-94107`
     - `food-rescue-shelters`
   - Spring Boot publishes a message after a listing is created or a claim changes.

5. **AWS Lambda plus Amazon EventBridge**
   - EventBridge runs a scheduled rule every few minutes.
   - Lambda expires listings whose pickup window has passed, publishes final SNS updates, and writes audit records.
   - Keeps time-sensitive cleanup out of the Spring Boot request path.

6. **Amazon S3**
   - Stores optional proof-of-pickup photos, donor receipts, and generated impact exports.
   - For a hackathon demo, S3 can also hold static sample data or CSV reports.

7. **Amazon CloudWatch**
   - Centralizes Spring Boot logs, Lambda logs, SNS publish metrics, and demo dashboards.
   - Track `ListingsCreated`, `AlertsSent`, `ClaimsConfirmed`, and `ServingsRescued`.

### Minimum AWS Services For The Track

Use these at minimum in the judged demo:

- **Amazon SNS** for real-time gratitude-and-impact alerts.
- **Amazon DynamoDB** for live surplus food, recipient, and claim data.

Stronger track-specific version:

- **AWS Elastic Beanstalk** for Spring Boot API deployment.
- **Amazon SNS** for alert fan-out.
- **Amazon DynamoDB** for operational data.
- **AWS Lambda/EventBridge** for pickup-window expiry.

### Why This Aligns With The Theme

The gratitude angle is concrete: the app turns appreciation for being fed into a repeatable logistics loop. Donors see exactly where surplus meals went, shelters get timely food instead of cold outreach, and volunteers receive one clear action when they can help.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Build check:

```bash
cd frontend
npm run build
```
