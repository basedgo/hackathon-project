create extension if not exists pgcrypto;

create table organizations (
    organization_id uuid primary key default gen_random_uuid(),
    name varchar(160) not null,
    organization_type varchar(32) not null check (organization_type in ('DONOR', 'RECIPIENT')),
    display_initials varchar(8),
    contact_name varchar(120),
    contact_email varchar(255),
    contact_phone varchar(40),
    street_address varchar(255),
    city varchar(120) not null default 'Seattle',
    state_code char(2) not null default 'WA',
    postal_code varchar(20),
    latitude numeric(9, 6),
    longitude numeric(9, 6),
    service_radius_miles numeric(5, 2),
    capacity_notes text,
    sns_topic_arn varchar(512),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_organizations_type on organizations (organization_type);
create index idx_organizations_location on organizations (city, state_code, postal_code);

create table app_users (
    user_id uuid primary key default gen_random_uuid(),
    organization_id uuid references organizations (organization_id) on delete set null,
    full_name varchar(160) not null,
    display_initials varchar(8),
    role varchar(32) not null check (role in ('VOLUNTEER', 'DONOR_ADMIN', 'RECIPIENT_ADMIN')),
    email varchar(255) unique,
    phone varchar(40),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_app_users_organization on app_users (organization_id);
create index idx_app_users_role on app_users (role);

create table food_listings (
    listing_id uuid primary key default gen_random_uuid(),
    donor_organization_id uuid not null references organizations (organization_id),
    title varchar(180) not null,
    category varchar(80) not null,
    description text,
    quantity_label varchar(80) not null,
    serving_count integer check (serving_count is null or serving_count >= 0),
    pickup_instructions text,
    pickup_window_starts_at timestamptz,
    pickup_window_ends_at timestamptz not null,
    status varchar(32) not null default 'AVAILABLE' check (status in ('DRAFT', 'AVAILABLE', 'CLAIMED', 'PICKED_UP', 'EXPIRED', 'CANCELLED')),
    time_tone varchar(16) not null default 'SOON' check (time_tone in ('URGENT', 'SOON', 'CALM')),
    distance_label varchar(40),
    latitude numeric(9, 6),
    longitude numeric(9, 6),
    map_position_x numeric(5, 2) check (map_position_x is null or (map_position_x >= 0 and map_position_x <= 100)),
    map_position_y numeric(5, 2) check (map_position_y is null or (map_position_y >= 0 and map_position_y <= 100)),
    photo_url varchar(1024),
    created_by_user_id uuid references app_users (user_id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_food_listings_status_deadline on food_listings (status, pickup_window_ends_at);
create index idx_food_listings_donor on food_listings (donor_organization_id);
create index idx_food_listings_category on food_listings (category);

create table listing_tags (
    listing_id uuid not null references food_listings (listing_id) on delete cascade,
    tag varchar(80) not null,
    tag_type varchar(32) not null default 'DIETARY' check (tag_type in ('DIETARY', 'ALLERGEN', 'PACKAGING', 'ALERT')),
    primary key (listing_id, tag)
);

create index idx_listing_tags_tag on listing_tags (tag);

create table pickup_claims (
    claim_id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references food_listings (listing_id) on delete cascade,
    recipient_organization_id uuid not null references organizations (organization_id),
    volunteer_user_id uuid references app_users (user_id) on delete set null,
    status varchar(32) not null default 'CLAIMED' check (status in ('CLAIMED', 'IN_TRANSIT', 'PICKED_UP', 'DELIVERED', 'CANCELLED')),
    claimed_at timestamptz not null default now(),
    picked_up_at timestamptz,
    delivered_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_pickup_claims_listing on pickup_claims (listing_id);
create index idx_pickup_claims_recipient on pickup_claims (recipient_organization_id);
create index idx_pickup_claims_volunteer on pickup_claims (volunteer_user_id);
create index idx_pickup_claims_status on pickup_claims (status);

create table listing_alert_preferences (
    listing_alert_preference_id uuid primary key default gen_random_uuid(),
    listing_id uuid not null references food_listings (listing_id) on delete cascade,
    audience varchar(64) not null check (audience in ('NEARBY_SHELTERS', 'VOLUNTEER_DRIVERS', 'FOODBANKS')),
    enabled boolean not null default true,
    created_at timestamptz not null default now(),
    unique (listing_id, audience)
);

create table audit_events (
    audit_event_id uuid primary key default gen_random_uuid(),
    entity_type varchar(80) not null,
    entity_id uuid not null,
    event_type varchar(80) not null,
    event_payload jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index idx_audit_events_entity on audit_events (entity_type, entity_id);
create index idx_audit_events_created_at on audit_events (created_at);

create view company_monthly_donation_summary as
select
    donor_organization_id,
    to_char(date_trunc('month', coalesce(picked_up_at, delivered_at, food_listings.created_at)), 'Mon') as month_label,
    count(*)::integer as donation_count
from food_listings
left join pickup_claims using (listing_id)
where food_listings.status in ('PICKED_UP', 'CLAIMED', 'AVAILABLE')
group by donor_organization_id, date_trunc('month', coalesce(picked_up_at, delivered_at, food_listings.created_at))
order by date_trunc('month', coalesce(picked_up_at, delivered_at, food_listings.created_at));

create view top_recipient_summary as
select
    recipient_organization_id,
    organizations.name,
    count(*)::integer as pickup_count
from pickup_claims
join organizations on organizations.organization_id = pickup_claims.recipient_organization_id
where pickup_claims.status in ('PICKED_UP', 'DELIVERED')
group by recipient_organization_id, organizations.name
order by pickup_count desc, organizations.name;

insert into organizations (organization_id, name, organization_type, display_initials, contact_name, city, state_code, postal_code, latitude, longitude)
values
    ('10000000-0000-0000-0000-000000000001', 'Green Harvest Co.', 'DONOR', 'GH', 'Maya Chen', 'Seattle', 'WA', '98101', 47.609720, -122.333090),
    ('10000000-0000-0000-0000-000000000002', 'Pike St. Bakery', 'DONOR', 'PB', 'Owen Park', 'Seattle', 'WA', '98101', 47.610120, -122.341010),
    ('10000000-0000-0000-0000-000000000003', 'The Garden Table', 'DONOR', 'GT', 'Leah Stone', 'Seattle', 'WA', '98104', 47.603830, -122.330060),
    ('10000000-0000-0000-0000-000000000004', 'Sakura Kitchen', 'DONOR', 'SK', 'Hana Ito', 'Seattle', 'WA', '98104', 47.599950, -122.326200),
    ('20000000-0000-0000-0000-000000000001', 'Mission House Shelter', 'RECIPIENT', 'MH', 'Ana Ruiz', 'Seattle', 'WA', '98101', 47.613020, -122.331410),
    ('20000000-0000-0000-0000-000000000002', 'Northside Community Fridge', 'RECIPIENT', 'NC', 'Jules Martin', 'Seattle', 'WA', '98103', 47.661420, -122.342610),
    ('20000000-0000-0000-0000-000000000003', 'City Food Bank', 'RECIPIENT', 'CF', 'Priya Shah', 'Seattle', 'WA', '98104', 47.602910, -122.328450),
    ('20000000-0000-0000-0000-000000000004', 'Hope Kitchen', 'RECIPIENT', 'HK', 'Sam Wilson', 'Seattle', 'WA', '98122', 47.608010, -122.312500);

insert into app_users (user_id, organization_id, full_name, display_initials, role, email)
values
    ('30000000-0000-0000-0000-000000000001', null, 'Marcus Taylor', 'MT', 'VOLUNTEER', 'marcus@example.com'),
    ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Green Harvest Admin', 'GH', 'DONOR_ADMIN', 'admin@greenharvest.example');

insert into food_listings (
    listing_id,
    donor_organization_id,
    title,
    category,
    description,
    quantity_label,
    serving_count,
    pickup_instructions,
    pickup_window_starts_at,
    pickup_window_ends_at,
    status,
    time_tone,
    distance_label,
    latitude,
    longitude,
    map_position_x,
    map_position_y,
    created_by_user_id,
    created_at
)
values
    ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Pasta Primavera & Marinara', 'Prepared meals', 'Packed pans of pasta with marinara sauce.', '48 portions', 48, 'Use loading dock B and ask for Maya.', '2026-05-16 18:00:00-07', '2026-05-16 19:00:00-07', 'PICKED_UP', 'URGENT', '0.4 mi', 47.609720, -122.333090, 21, 34, '30000000-0000-0000-0000-000000000002', '2026-05-16 16:55:00-07'),
    ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Bakery Assortment', 'Bakery', 'Mixed breads, pastries, and muffins from end-of-day stock.', '30+ items', 30, 'Pickup from front counter after close.', '2026-05-15 19:00:00-07', '2026-05-15 20:20:00-07', 'PICKED_UP', 'SOON', '0.7 mi', 47.610120, -122.341010, 72, 31, null, '2026-05-15 17:30:00-07'),
    ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Fresh Salad Bowls', 'Produce', 'Prepared salad bowls with dressing packed separately.', '22 bowls', 22, 'Refrigerated case by the east entrance.', '2026-05-13 17:30:00-07', '2026-05-13 19:15:00-07', 'PICKED_UP', 'SOON', '1.1 mi', 47.603830, -122.330060, 45, 56, null, '2026-05-13 15:40:00-07'),
    ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Bento Boxes & Rice', 'Prepared meals', 'Boxed meals with rice, vegetables, and sauces.', '18 boxes', 18, 'Ask for Hana near the kitchen entrance.', '2026-05-10 18:00:00-07', '2026-05-10 20:30:00-07', 'PICKED_UP', 'CALM', '1.4 mi', 47.599950, -122.326200, 86, 58, null, '2026-05-10 16:25:00-07');

insert into listing_tags (listing_id, tag, tag_type)
values
    ('40000000-0000-0000-0000-000000000001', 'Vegan', 'DIETARY'),
    ('40000000-0000-0000-0000-000000000001', 'Gluten', 'ALLERGEN'),
    ('40000000-0000-0000-0000-000000000002', 'Gluten', 'ALLERGEN'),
    ('40000000-0000-0000-0000-000000000002', 'Dairy', 'ALLERGEN'),
    ('40000000-0000-0000-0000-000000000003', 'GF', 'DIETARY'),
    ('40000000-0000-0000-0000-000000000003', 'Sesame', 'ALLERGEN'),
    ('40000000-0000-0000-0000-000000000004', 'Soy', 'ALLERGEN'),
    ('40000000-0000-0000-0000-000000000004', 'Egg', 'ALLERGEN');

insert into pickup_claims (
    claim_id,
    listing_id,
    recipient_organization_id,
    volunteer_user_id,
    status,
    claimed_at,
    picked_up_at,
    delivered_at
)
values
    ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'DELIVERED', '2026-05-16 17:10:00-07', '2026-05-16 18:18:00-07', '2026-05-16 18:42:00-07'),
    ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'DELIVERED', '2026-05-15 18:00:00-07', '2026-05-15 19:08:00-07', '2026-05-15 19:35:00-07'),
    ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 'DELIVERED', '2026-05-13 16:35:00-07', '2026-05-13 17:55:00-07', '2026-05-13 18:24:00-07'),
    ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 'DELIVERED', '2026-05-10 17:15:00-07', '2026-05-10 18:36:00-07', '2026-05-10 19:03:00-07');

insert into listing_alert_preferences (listing_id, audience, enabled)
select listing_id, audience, enabled
from (
    values
        ('40000000-0000-0000-0000-000000000001'::uuid, 'NEARBY_SHELTERS', true),
        ('40000000-0000-0000-0000-000000000001'::uuid, 'VOLUNTEER_DRIVERS', true),
        ('40000000-0000-0000-0000-000000000001'::uuid, 'FOODBANKS', false),
        ('40000000-0000-0000-0000-000000000002'::uuid, 'NEARBY_SHELTERS', true),
        ('40000000-0000-0000-0000-000000000002'::uuid, 'VOLUNTEER_DRIVERS', true),
        ('40000000-0000-0000-0000-000000000002'::uuid, 'FOODBANKS', false),
        ('40000000-0000-0000-0000-000000000003'::uuid, 'NEARBY_SHELTERS', true),
        ('40000000-0000-0000-0000-000000000003'::uuid, 'VOLUNTEER_DRIVERS', true),
        ('40000000-0000-0000-0000-000000000003'::uuid, 'FOODBANKS', false),
        ('40000000-0000-0000-0000-000000000004'::uuid, 'NEARBY_SHELTERS', true),
        ('40000000-0000-0000-0000-000000000004'::uuid, 'VOLUNTEER_DRIVERS', true),
        ('40000000-0000-0000-0000-000000000004'::uuid, 'FOODBANKS', false)
) as preferences(listing_id, audience, enabled);
