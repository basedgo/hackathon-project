# Testing The PostgreSQL Database

This guide tests the backend database locally without Docker.

## 1. Check PostgreSQL

```bash
psql --version
```

If PostgreSQL is not installed on macOS:

```bash
brew install postgresql@16
brew services start postgresql@16
```

## 2. Create The Local Database And User

From any terminal:

```bash
createdb food_rescue
createuser food_rescue
```

Open the database:

```bash
psql -d food_rescue
```

Then run:

```sql
alter user food_rescue with password 'food_rescue';
grant all privileges on database food_rescue to food_rescue;
grant all on schema public to food_rescue;
```

Exit `psql`:

```sql
\q
```

## 3. Run The Backend

From this `backend` directory:

```bash
mvn spring-boot:run
```

The backend uses these local defaults from `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/food_rescue
spring.datasource.username=food_rescue
spring.datasource.password=food_rescue
```

When the app starts, Flyway automatically runs migrations from:

```text
src/main/resources/db/migration
```

The initial schema is:

```text
src/main/resources/db/migration/V1__initial_food_rescue_schema.sql
```

If the backend starts without database errors, the schema was applied.

## 4. Inspect The Database

Open the database as the app user:

```bash
psql -U food_rescue -d food_rescue
```

If local password authentication is not configured, this may be easier:

```bash
psql -d food_rescue
```

List tables:

```sql
\dt
```

Check seeded organizations:

```sql
select name, organization_type
from organizations
order by organization_type, name;
```

Check seeded food listings:

```sql
select
    title,
    category,
    quantity_label,
    status,
    distance_label
from food_listings
order by created_at desc;
```

Check pickup claims:

```sql
select
    food_listings.title,
    organizations.name as recipient,
    pickup_claims.status,
    pickup_claims.delivered_at
from pickup_claims
join food_listings using (listing_id)
join organizations on organizations.organization_id = pickup_claims.recipient_organization_id
order by pickup_claims.delivered_at desc;
```

Check the analytics views:

```sql
select *
from company_monthly_donation_summary;

select *
from top_recipient_summary;
```

Expected seeded data includes:

- `Green Harvest Co.`
- `Mission House Shelter`
- `Pasta Primavera & Marinara`
- `Bakery Assortment`
- `Fresh Salad Bowls`
- `Bento Boxes & Rice`

## 5. Reset And Re-test

Only do this for local test data you are comfortable deleting:

```bash
dropdb food_rescue
createdb food_rescue
psql -d food_rescue
```

Then rerun the grants:

```sql
alter user food_rescue with password 'food_rescue';
grant all privileges on database food_rescue to food_rescue;
grant all on schema public to food_rescue;
\q
```

Start the backend again:

```bash
mvn spring-boot:run
```

Flyway will recreate the schema and seed data.

## 6. Test Against AWS RDS

For RDS, use the same backend command with database environment variables:

```bash
DATABASE_URL=jdbc:postgresql://<rds-endpoint>:5432/food_rescue \
DATABASE_USERNAME=<rds-user> \
DATABASE_PASSWORD=<rds-password> \
mvn spring-boot:run
```

Use an RDS database you are comfortable migrating. Flyway will apply any pending migrations on startup.
