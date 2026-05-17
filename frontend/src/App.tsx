import { useEffect, useMemo, useState } from "react";
import type { SubmitEvent } from "react";
import "./App.css";

type Role = "customer" | "company";
type CustomerView = "listings" | "history" | "profile" | "inbox";
type CompanyView = "dashboard" | "post" | "listings" | "profile" | "inbox";
type Filter = "All" | "Meals" | "Bakery" | "Produce" | "Urgent" | "Distance";

type Listing = {
  id: number;
  title: string;
  restaurant: string;
  category: string;
  portions: string;
  tags: string[];
  time: string;
  timeTone: "urgent" | "soon" | "calm";
  distance: string;
  coordinates: { x: number; y: number };
  pickedUpBy: string;
  datePickedUp: string;
};

type Message = {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
};

const fallbackListings: Listing[] = [
  {
    id: 1,
    title: "Pasta Primavera & Marinara",
    restaurant: "Green Harvest Co.",
    category: "Prepared meals",
    portions: "48 portions",
    tags: ["Vegan", "Gluten"],
    time: "42 min",
    timeTone: "urgent",
    distance: "0.4 mi",
    coordinates: { x: 21, y: 34 },
    pickedUpBy: "Mission House Shelter",
    datePickedUp: "May 16, 2026",
  },
  {
    id: 2,
    title: "Bakery Assortment",
    restaurant: "Pike St. Bakery",
    category: "Bakery",
    portions: "30+ items",
    tags: ["Gluten", "Dairy"],
    time: "1h 20m",
    timeTone: "soon",
    distance: "0.7 mi",
    coordinates: { x: 72, y: 31 },
    pickedUpBy: "Northside Community Fridge",
    datePickedUp: "May 15, 2026",
  },
  {
    id: 3,
    title: "Fresh Salad Bowls",
    restaurant: "The Garden Table",
    category: "Produce",
    portions: "22 bowls",
    tags: ["GF", "Sesame"],
    time: "1h 45m",
    timeTone: "soon",
    distance: "1.1 mi",
    coordinates: { x: 45, y: 56 },
    pickedUpBy: "City Food Bank",
    datePickedUp: "May 13, 2026",
  },
  {
    id: 4,
    title: "Bento Boxes & Rice",
    restaurant: "Sakura Kitchen",
    category: "Prepared meals",
    portions: "18 boxes",
    tags: ["Soy", "Egg"],
    time: "2h 30m",
    timeTone: "calm",
    distance: "1.4 mi",
    coordinates: { x: 86, y: 58 },
    pickedUpBy: "Hope Kitchen",
    datePickedUp: "May 10, 2026",
  },
];

const monthlyDonations = [
  { label: "Jan", value: 18 },
  { label: "Feb", value: 24 },
  { label: "Mar", value: 31 },
  { label: "Apr", value: 44 },
  { label: "May", value: 57 },
  { label: "Jun", value: 63 },
];

const topRecipients = [
  { name: "Mission House Shelter", pickups: 18 },
  { name: "City Food Bank", pickups: 14 },
  { name: "Northside Community Fridge", pickups: 11 },
];

const initialMessages: Message[] = [
  {
    id: 1,
    from: "Green Harvest Co.",
    subject: "Pickup door instructions",
    preview:
      "Please use the side entrance on Pine. The boxes are labeled Last Mile.",
    time: "4:18 PM",
    unread: true,
  },
  {
    id: 2,
    from: "Mission House Shelter",
    subject: "Delivery confirmation",
    preview: "Thanks, we received the meals and logged the handoff.",
    time: "Yesterday",
  },
  {
    id: 3,
    from: "City Food Bank",
    subject: "Driver available",
    preview: "We can send a van for larger produce pickups after 7 PM.",
    time: "May 15",
  },
];

function App() {
  const [role, setRole] = useState<Role>("customer");
  const [customerView, setCustomerView] = useState<CustomerView>("listings");
  const [companyView, setCompanyView] = useState<CompanyView>("dashboard");
  const [selectedListing, setSelectedListing] = useState<Listing>(
    fallbackListings[0],
  );
  const [companyListings, setCompanyListings] =
    useState<Listing[]>(fallbackListings);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("Seattle, WA");
  const [postingTitle, setPostingTitle] = useState("");
  const [messages] = useState<Message[]>(initialMessages);

  const activeView = role === "customer" ? customerView : companyView;

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      try {
        const response = await fetch(`/listings.csv?updated=${Date.now()}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("CSV file could not be loaded");

        const csvListings = parseListingsCsv(await response.text());
        if (isMounted && csvListings.length > 0) {
          setCompanyListings(csvListings);
          setSelectedListing(
            (currentListing) =>
              csvListings.find((listing) => listing.id === currentListing.id) ??
              csvListings[0],
          );
        }
      } catch (error) {
        console.warn(
          "Using fallback listings because CSV loading failed:",
          error,
        );
      }
    }

    loadListings();
    const intervalId = window.setInterval(loadListings, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const filteredListings = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    const visibleListings = companyListings.filter((listing) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          listing.title,
          listing.restaurant,
          listing.category,
          listing.portions,
          ...listing.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      if (!matchesSearch) return false;
      if (activeFilter === "All" || activeFilter === "Distance") return true;
      if (activeFilter === "Urgent") return listing.timeTone === "urgent";
      if (activeFilter === "Meals")
        return (
          listing.category.toLowerCase().includes("meal") ||
          listing.category.toLowerCase().includes("prepared")
        );
      return listing.category
        .toLowerCase()
        .includes(activeFilter.toLowerCase());
    });

    if (activeFilter === "Distance") {
      return [...visibleListings].sort(
        (first, second) =>
          parseDistance(first.distance) - parseDistance(second.distance),
      );
    }

    return visibleListings;
  }, [activeFilter, companyListings, searchText]);

  useEffect(() => {
    if (
      filteredListings.length > 0 &&
      !filteredListings.some((listing) => listing.id === selectedListing.id)
    ) {
      setSelectedListing(filteredListings[0]);
    }
  }, [filteredListings, selectedListing.id]);

  function switchRole(nextRole: Role) {
    setRole(nextRole);
    setActiveFilter("All");
    setSearchText("");
    if (nextRole === "customer") setCustomerView("listings");
    if (nextRole === "company") setCompanyView("dashboard");
  }

  async function submitPosting(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    let nextListing: Listing;

    try {
      nextListing = await createFoodListingFromUi(postingTitle);
      setApiStatus("connected");
    } catch (error) {
      console.error(
        "Unable to create backend listing, adding local fallback listing.",
        error,
      );
      setApiStatus("offline");
      nextListing = {
        id: `local-${Date.now()}`,
        title: postingTitle || "Fresh surplus pickup",
        restaurant: "Your Restaurant",
        category: "Prepared meals",
        portions: "24 portions",
        tags: ["Contains dairy", "Packed hot"],
        time: "1h 15m",
        timeTone: "soon",
        distance: "0.2 mi",
        coordinates: { x: 34, y: 42 },
        pickedUpBy: "Awaiting match",
        datePickedUp: "Not picked up yet",
      };
    }

    setCompanyListings([nextListing, ...companyListings]);
    setSelectedListing(nextListing);
    setPostingTitle("");
    setCompanyView("listings");
  }

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="brand">
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 19c9-.6 13.4-5 14-14C10 5.6 5.6 10 5 19Z" />
              <path d="M5 19c4-5 7.7-7.8 12-9.3" />
            </svg>
          </span>
          <strong>Last Mile Food Rescue</strong>
        </div>

        <nav className="main-tabs" aria-label="Primary navigation">
          {role === "customer" ? (
            <>
              <button
                className={customerView === "listings" ? "active" : ""}
                onClick={() => setCustomerView("listings")}
              >
                Nearby Listings
              </button>
              <button
                className={customerView === "history" ? "active" : ""}
                onClick={() => setCustomerView("history")}
              >
                My History
              </button>
              <button
                className={customerView === "profile" ? "active" : ""}
                onClick={() => setCustomerView("profile")}
              >
                Profile
              </button>
              <button
                className={customerView === "inbox" ? "active" : ""}
                onClick={() => setCustomerView("inbox")}
              >
                Inbox
              </button>
            </>
          ) : (
            <>
              <button
                className={companyView === "dashboard" ? "active" : ""}
                onClick={() => setCompanyView("dashboard")}
              >
                Analytics
              </button>
              <button
                className={companyView === "post" ? "active" : ""}
                onClick={() => setCompanyView("post")}
              >
                Food Posting
              </button>
              <button
                className={companyView === "listings" ? "active" : ""}
                onClick={() => setCompanyView("listings")}
              >
                Nearby Listings
              </button>
              <button
                className={companyView === "profile" ? "active" : ""}
                onClick={() => setCompanyView("profile")}
              >
                Profile
              </button>
              <button
                className={companyView === "inbox" ? "active" : ""}
                onClick={() => setCompanyView("inbox")}
              >
                Inbox
              </button>
            </>
          )}
        </nav>

        <div className="right-nav">
          <button
            className={
              role === "customer" ? "role-toggle active" : "role-toggle"
            }
            onClick={() => switchRole("customer")}
          >
            Customer
          </button>
          <button
            className={
              role === "company" ? "role-toggle active" : "role-toggle"
            }
            onClick={() => switchRole("company")}
          >
            Company
          </button>
          <button
            className="profile-pill"
            onClick={() =>
              role === "company"
                ? setCompanyView("profile")
                : setCustomerView("profile")
            }
          >
            <span>{role === "company" ? "GH" : "MT"}</span>
            {role === "company" ? "Green Harvest" : "Marcus T."}
          </button>
        </div>
      </header>

      {activeView === "listings" && (
        <section className="search-band">
          <div className="search-card">
            <label>
              <span>Search</span>
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder={
                  role === "company"
                    ? "Find listings, pickups, recipients..."
                    : "Search food, restaurant..."
                }
              />
            </label>
            <label>
              <span>Location</span>
              <input
                value={locationText}
                onChange={(event) => setLocationText(event.target.value)}
                placeholder="Seattle, WA"
              />
            </label>
            <button type="button">
              {role === "company" ? "Review" : "Search"}
            </button>
          </div>
          <div className="filter-row" aria-label="Listing filters">
            {(
              [
                "All",
                "Meals",
                "Bakery",
                "Produce",
                "Urgent",
                "Distance",
              ] as Filter[]
            ).map((filter) => (
              <button
                className={activeFilter === filter ? "active" : ""}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </section>
      )}

      {role === "customer" && activeView === "listings" && (
        <ListingsAndMap
          listings={filteredListings}
          selectedListing={selectedListing}
          onSelectListing={setSelectedListing}
          activeFilter={activeFilter}
        />
      )}
      {role === "customer" && activeView === "history" && (
        <HistoryView listings={companyListings} />
      )}
      {role === "customer" && activeView === "profile" && (
        <ProfileSetup role="customer" />
      )}
      {role === "customer" && activeView === "inbox" && (
        <Inbox role="customer" messages={messages} />
      )}

      {role === "company" && activeView === "dashboard" && (
        <CompanyDashboard listings={companyListings} />
      )}
      {role === "company" && activeView === "post" && (
        <FoodPosting
          onSubmit={submitPosting}
          postingTitle={postingTitle}
          setPostingTitle={setPostingTitle}
        />
      )}
      {role === "company" && activeView === "listings" && (
        <ListingsAndMap
          listings={filteredListings}
          selectedListing={selectedListing}
          onSelectListing={setSelectedListing}
          activeFilter={activeFilter}
          companyMode
        />
      )}
      {role === "company" && activeView === "profile" && (
        <ProfileSetup role="company" />
      )}
      {role === "company" && activeView === "inbox" && (
        <Inbox role="company" messages={messages} />
      )}
    </div>
  );
}

function ListingsAndMap({
  listings,
  selectedListing,
  onSelectListing,
  activeFilter,
  companyMode = false,
}: {
  listings: Listing[];
  selectedListing: Listing;
  onSelectListing: (listing: Listing) => void;
  activeFilter: Filter;
  companyMode?: boolean;
}) {
  const safeSelectedListing =
    listings.find((listing) => listing.id === selectedListing.id) ??
    listings[0];

  return (
    <main className="content-grid">
      <section className="results-column">
        <div className="list-heading">
          <span>{listings.length} listings</span>
          <strong>
            {companyMode
              ? "Posts visible to rescue partners"
              : activeFilter === "Distance"
                ? "Sorted by nearest pickup"
                : "Updated just now"}
          </strong>
        </div>

        {listings.length === 0 ? (
          <div className="empty-state">No listings match this filter yet.</div>
        ) : (
          <div className="listing-stack">
            {listings.map((listing) => (
              <article
                className={`listing-card ${safeSelectedListing.id === listing.id ? "selected" : ""}`}
                key={listing.id}
                onClick={() => onSelectListing(listing)}
              >
                <div className="listing-card-top">
                  <div>
                    <span className="badge">{listing.category}</span>
                    <h2>{listing.title}</h2>
                    <p>{listing.restaurant}</p>
                  </div>
                  <span className={`time-pill ${listing.timeTone}`}>
                    {listing.time}
                  </span>
                </div>
                <div className="chip-row">
                  <span>{listing.portions}</span>
                  {listing.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                  <span>{listing.distance}</span>
                </div>
                {safeSelectedListing.id === listing.id && !companyMode && (
                  <button className="claim-button">Pickup</button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {safeSelectedListing && (
        <aside className="right-panel">
          <div className="panel-header">
            <div>
              <span className="badge">Amazon Location Service</span>
              <h1>{safeSelectedListing.restaurant}</h1>
              <p>{safeSelectedListing.title}</p>
            </div>
            <button type="button">Get directions</button>
          </div>
          <MapPanel
            selectedListing={safeSelectedListing}
            listings={listings}
            onSelectListing={onSelectListing}
          />
          <div className="detail-strip">
            <span>Pickup window: closes in {safeSelectedListing.time}</span>
            <span>Walk: 8 min</span>
            <span>Drive: 2 min</span>
          </div>
        </aside>
      )}
    </main>
  );
}

function MapPanel({
  selectedListing,
  listings,
  onSelectListing,
}: {
  selectedListing: Listing;
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
}) {
  const placeCalloutLeft = selectedListing.coordinates.x > 72;
  const calloutStyle = {
    left: placeCalloutLeft
      ? `${selectedListing.coordinates.x - 7}%`
      : `${selectedListing.coordinates.x + 4}%`,
    top: `${Math.max(selectedListing.coordinates.y - 7, 6)}%`,
  };

  return (
    <div className="map-panel">
      <svg
        className="route-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M18 34 V44 H36 V68 H56 V78" />
      </svg>
      {listings.map((listing) => (
        <button
          className={`map-pin ${selectedListing.id === listing.id ? "active" : ""}`}
          key={listing.id}
          onClick={() => onSelectListing(listing)}
          style={{
            left: `${listing.coordinates.x}%`,
            top: `${listing.coordinates.y}%`,
          }}
          aria-label={`Select ${listing.title}`}
        >
          {listing.title.slice(0, 1)}
        </button>
      ))}
      <div
        className={`map-callout ${placeCalloutLeft ? "left" : ""}`}
        style={calloutStyle}
      >
        <strong>{selectedListing.restaurant}</strong>
        <span>Closes in {selectedListing.time}</span>
      </div>
      <div className="you-are-here">
        <span />
        You're here
      </div>
    </div>
  );
}

function CompanyDashboard({ listings }: { listings: Listing[] }) {
  const maxValue = Math.max(...monthlyDonations.map((item) => item.value));
  const totalDonations = monthlyDonations.reduce(
    (total, item) => total + item.value,
    0,
  );

  return (
    <main className="dashboard-layout">
      <section className="analytics-card">
        <div className="section-title">
          <span>Analytics Dashboard</span>
          <h1>Donation performance</h1>
        </div>
        <div className="metric-grid">
          <div>
            <span>Total donations</span>
            <strong>{totalDonations}</strong>
          </div>
          <div>
            <span>This month</span>
            <strong>63</strong>
          </div>
          <div>
            <span>Avg pickup time</span>
            <strong>38m</strong>
          </div>
        </div>
        <div className="bar-chart" aria-label="Monthly donations chart">
          {monthlyDonations.map((item) => (
            <div className="bar-column" key={item.label}>
              <span>{item.value}</span>
              <div>
                <i style={{ height: `${(item.value / maxValue) * 100}%` }} />
              </div>
              <em>{item.label}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="table-card">
        <div className="section-title">
          <span>Past Orders</span>
          <h2>Pickup log</h2>
        </div>
        <div className="data-table">
          <div className="data-row header">
            <span>Date picked up</span>
            <span>Company picked up</span>
            <span>Food</span>
          </div>
          {listings.map((listing) => (
            <div className="data-row" key={listing.id}>
              <span>{listing.datePickedUp}</span>
              <span>{listing.pickedUpBy}</span>
              <span>{listing.title}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="table-card compact">
        <div className="section-title">
          <span>Top Recipients</span>
          <h2>Most active partners</h2>
        </div>
        {topRecipients.map((recipient) => (
          <div className="recipient-row" key={recipient.name}>
            <strong>{recipient.name}</strong>
            <span>{recipient.pickups} pickups</span>
          </div>
        ))}
      </section>
    </main>
  );
}

function FoodPosting({
  onSubmit,
  postingTitle,
  setPostingTitle,
}: {
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  postingTitle: string;
  setPostingTitle: (title: string) => void;
}) {
  return (
    <main className="posting-layout">
      <form className="posting-card" onSubmit={onSubmit}>
        <div className="section-title">
          <span>Food Posting</span>
          <h1>Create a 1-2 hour pickup window</h1>
        </div>

        <label>
          Food details
          <select defaultValue="Prepared meals">
            <option>Prepared meals</option>
            <option>Dairy</option>
            <option>Bakery</option>
            <option>Produce</option>
            <option>Pantry staples</option>
          </select>
        </label>
        <label>
          Post title
          <input
            value={postingTitle}
            onChange={(event) => setPostingTitle(event.target.value)}
            placeholder="Example: 24 boxed pasta dinners"
          />
        </label>
        <label className="wide">
          Description of food
          <textarea placeholder="Describe what is available, how it is packed, and any temperature notes." />
        </label>
        <label>
          Allergies
          <input placeholder="Wheat, dairy, nuts..." />
        </label>
        <label>
          Quantity
          <input placeholder="48 portions, 6 crates..." />
        </label>
        <label className="wide">
          Pickup window/instructions
          <textarea placeholder="Tonight, 8:00 PM - 9:15 PM. Use loading dock B and ask for Maya." />
        </label>
        <fieldset className="wide alert-options">
          <legend>Alert preferences</legend>
          {["Nearby shelters", "Customer recipients", "Foodbanks"].map(
            (option) => (
              <label key={option}>
                <input
                  defaultChecked={option !== "Foodbanks"}
                  type="checkbox"
                />
                {option}
              </label>
            ),
          )}
        </fieldset>
        <label className="wide">
          Optional photos of food
          <input placeholder="Paste a photo URL or connect upload later" />
        </label>
        <button className="submit-button">Post surplus food</button>
      </form>
    </main>
  );
}

function ProfileSetup({ role }: { role: Role }) {
  const isCompany = role === "company";

  return (
    <main className="profile-layout">
      <section className="profile-panel">
        <div className="section-title">
          <span>{isCompany ? "Company Profile" : "Customer Profile"}</span>
          <h1>
            {isCompany ? "Business pickup setup" : "Recipient preferences"}
          </h1>
        </div>

        <div className="profile-identity">
          <div className="profile-avatar">{isCompany ? "GH" : "GM"}</div>
          <div>
            <strong>
              {isCompany ? "Green Harvest Co." : "Glide Memorial Shelter"}
            </strong>
            <span>
              {isCompany
                ? "Restaurant · Donor · 98101"
                : "Shelter · Recipient · 94102"}
            </span>
          </div>
        </div>

        <label>
          {isCompany ? "Business name" : "Contact name"}
          <input
            defaultValue={isCompany ? "Green Harvest Co." : "Maria Chen"}
          />
        </label>
        <label>
          {isCompany ? "Primary contact" : "Phone number"}
          <input defaultValue={isCompany ? "Maya Chen" : "(415) 555-0241"} />
        </label>
        <label>
          {isCompany ? "Email" : "Email"}
          <input
            defaultValue={
              isCompany ? "ops@greenharvest.co" : "intake@glidemem.org"
            }
          />
        </label>
        <label>
          {isCompany ? "ZIP code" : "ZIP code"}
          <input defaultValue={isCompany ? "98101" : "94102"} />
        </label>

        <div className="preferences-section wide">
          <h2>{isCompany ? "Posting preferences" : "Food preferences"}</h2>
          <span className="field-label">
            {isCompany ? "Default alert recipients" : "Dietary restrictions"}
          </span>
          <div className="preference-chips">
            {(isCompany
              ? ["Nearby shelters", "Customer recipients", "Foodbanks"]
              : ["Halal", "Vegetarian", "No pork", "Gluten-free", "Nut-free"]
            ).map((option, index) => (
              <button
                className={index < 3 ? "selected" : ""}
                key={option}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <label>
          {isCompany ? "Default pickup window" : "Servings needed / day"}
          <select
            defaultValue={isCompany ? "1-2 hours after close" : "80 servings"}
          >
            {isCompany ? (
              <>
                <option>30-60 minutes after close</option>
                <option>1-2 hours after close</option>
                <option>Next morning pickup</option>
              </>
            ) : (
              <>
                <option>40 servings</option>
                <option>80 servings</option>
                <option>120 servings</option>
                <option>200 servings</option>
              </>
            )}
          </select>
        </label>
        <label>
          {isCompany ? "Contact preference" : "Contact preference"}
          <select defaultValue="SMS + email">
            <option>SMS + email</option>
            <option>Email only</option>
            <option>SMS only</option>
          </select>
        </label>
        <label>
          {isCompany ? "Pickup instructions" : "Service radius (miles)"}
          <select defaultValue={isCompany ? "Use loading dock B" : "3 miles"}>
            {isCompany ? (
              <>
                <option>Use front counter</option>
                <option>Use loading dock B</option>
                <option>Call on arrival</option>
                <option>Side door pickup</option>
              </>
            ) : (
              <>
                <option>1 mile</option>
                <option>3 miles</option>
                <option>5 miles</option>
                <option>10 miles</option>
              </>
            )}
          </select>
        </label>
        <label>
          {isCompany ? "Food photo requirement" : "Pickup capability"}
          <select defaultValue={isCompany ? "Optional photos" : "Can pickup"}>
            <option>Can pickup</option>
            <option>Needs delivery</option>
            <option>Optional photos</option>
            <option>Always add photos</option>
          </select>
        </label>

        <button className="submit-button wide" type="button">
          Save preferences
        </button>
      </section>
    </main>
  );
}

function Inbox({ role, messages }: { role: Role; messages: Message[] }) {
  const visibleMessages =
    role === "company"
      ? messages.map((message) => ({
          ...message,
          from:
            message.from === "Green Harvest Co."
              ? "Mission House Shelter"
              : message.from,
        }))
      : messages;

  return (
    <main className="inbox-layout simple">
      <section className="inbox-card">
        <div className="section-title">
          <span>{role === "company" ? "Company Inbox" : "Customer Inbox"}</span>
          <h1>Inbox</h1>
        </div>
        <div className="message-list">
          {visibleMessages.map((message) => (
            <article
              className={message.unread ? "message-row unread" : "message-row"}
              key={message.id}
            >
              <div>
                <strong>{message.from}</strong>
                <span>{message.subject}</span>
                <p>{message.preview}</p>
              </div>
              <time>{message.time}</time>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function HistoryView({ listings }: { listings: Listing[] }) {
  return (
    <main className="dashboard-layout">
      <section className="table-card full">
        <div className="section-title">
          <span>Customer history</span>
          <h1>Completed pickups</h1>
        </div>
        <div className="data-table">
          <div className="data-row header four">
            <span>Date</span>
            <span>Restaurant</span>
            <span>Food</span>
            <span>Impact</span>
          </div>
          {listings.map((listing) => (
            <div className="data-row four" key={listing.id}>
              <span>{listing.datePickedUp}</span>
              <span>{listing.restaurant}</span>
              <span>{listing.title}</span>
              <span>{listing.portions} delivered</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function parseListingsCsv(csvText: string): Listing[] {
  const [headerLine, ...dataLines] = csvText.trim().split(/\r?\n/);
  if (!headerLine) return [];

  const headers = splitCsvLine(headerLine);

  return dataLines
    .filter((line) => line.trim().length > 0)
    .map((line, index) => {
      const values = splitCsvLine(line);
      const row = headers.reduce<Record<string, string>>(
        (currentRow, header, headerIndex) => {
          currentRow[header] = values[headerIndex] ?? "";
          return currentRow;
        },
        {},
      );
      const timeTone =
        row.timeTone === "urgent" ||
        row.timeTone === "soon" ||
        row.timeTone === "calm"
          ? row.timeTone
          : "soon";

      return {
        id: Number(row.id) || index + 1,
        title: row.title || "Untitled surplus food",
        restaurant: row.restaurant || "Unknown restaurant",
        category: row.category || "Prepared meals",
        portions: row.portions || "Quantity not listed",
        tags: row.tags
          ? row.tags
              .split("|")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        time: row.time || "1h",
        timeTone,
        distance: row.distance || "0.0 mi",
        coordinates: {
          x: Number(row.x) || 50,
          y: Number(row.y) || 50,
        },
        pickedUpBy: row.pickedUpBy || "Awaiting match",
        datePickedUp: row.datePickedUp || "Not picked up yet",
      };
    });
}

function splitCsvLine(line: string) {
  const values: string[] = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && nextCharacter === '"') {
      currentValue += '"';
      index += 1;
    } else if (character === '"') {
      insideQuotes = !insideQuotes;
    } else if (character === "," && !insideQuotes) {
      values.push(currentValue.trim());
      currentValue = "";
    } else {
      currentValue += character;
    }
  }

  values.push(currentValue.trim());
  return values;
}

function parseDistance(distance: string) {
  const parsedDistance = Number.parseFloat(distance);
  return Number.isNaN(parsedDistance)
    ? Number.POSITIVE_INFINITY
    : parsedDistance;
}

export default App;
