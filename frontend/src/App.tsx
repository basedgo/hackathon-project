import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Role = 'volunteer' | 'company'
type VolunteerView = 'listings' | 'history'
type CompanyView = 'dashboard' | 'post' | 'listings'

type Listing = {
  id: number
  title: string
  restaurant: string
  category: string
  portions: string
  tags: string[]
  time: string
  timeTone: 'urgent' | 'soon' | 'calm'
  distance: string
  coordinates: { x: number; y: number }
  pickedUpBy: string
  datePickedUp: string
}

const listings: Listing[] = [
  {
    id: 1,
    title: 'Pasta Primavera & Marinara',
    restaurant: 'Green Harvest Co.',
    category: 'Prepared meals',
    portions: '48 portions',
    tags: ['Vegan', 'Gluten'],
    time: '42 min',
    timeTone: 'urgent',
    distance: '0.4 mi',
    coordinates: { x: 21, y: 34 },
    pickedUpBy: 'Mission House Shelter',
    datePickedUp: 'May 16, 2026',
  },
  {
    id: 2,
    title: 'Bakery Assortment',
    restaurant: 'Pike St. Bakery',
    category: 'Bakery',
    portions: '30+ items',
    tags: ['Gluten', 'Dairy'],
    time: '1h 20m',
    timeTone: 'soon',
    distance: '0.7 mi',
    coordinates: { x: 72, y: 31 },
    pickedUpBy: 'Northside Community Fridge',
    datePickedUp: 'May 15, 2026',
  },
  {
    id: 3,
    title: 'Fresh Salad Bowls',
    restaurant: 'The Garden Table',
    category: 'Produce',
    portions: '22 bowls',
    tags: ['GF', 'Sesame'],
    time: '1h 45m',
    timeTone: 'soon',
    distance: '1.1 mi',
    coordinates: { x: 45, y: 56 },
    pickedUpBy: 'City Food Bank',
    datePickedUp: 'May 13, 2026',
  },
  {
    id: 4,
    title: 'Bento Boxes & Rice',
    restaurant: 'Sakura Kitchen',
    category: 'Prepared meals',
    portions: '18 boxes',
    tags: ['Soy', 'Egg'],
    time: '2h 30m',
    timeTone: 'calm',
    distance: '1.4 mi',
    coordinates: { x: 86, y: 58 },
    pickedUpBy: 'Hope Kitchen',
    datePickedUp: 'May 10, 2026',
  },
]

const monthlyDonations = [
  { label: 'Jan', value: 18 },
  { label: 'Feb', value: 24 },
  { label: 'Mar', value: 31 },
  { label: 'Apr', value: 44 },
  { label: 'May', value: 57 },
  { label: 'Jun', value: 63 },
]

const topRecipients = [
  { name: 'Mission House Shelter', pickups: 18 },
  { name: 'City Food Bank', pickups: 14 },
  { name: 'Northside Community Fridge', pickups: 11 },
]

function App() {
  const [role, setRole] = useState<Role>('volunteer')
  const [volunteerView, setVolunteerView] = useState<VolunteerView>('listings')
  const [companyView, setCompanyView] = useState<CompanyView>('dashboard')
  const [selectedListing, setSelectedListing] = useState<Listing>(listings[0])
  const [companyListings, setCompanyListings] = useState<Listing[]>(listings)
  const [postingTitle, setPostingTitle] = useState('')

  const activeView = role === 'volunteer' ? volunteerView : companyView

  function switchRole(nextRole: Role) {
    setRole(nextRole)
    if (nextRole === 'volunteer') setVolunteerView('listings')
    if (nextRole === 'company') setCompanyView('dashboard')
  }

  function submitPosting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextListing: Listing = {
      id: companyListings.length + 1,
      title: postingTitle || 'Fresh surplus pickup',
      restaurant: 'Your Restaurant',
      category: 'Prepared meals',
      portions: '24 portions',
      tags: ['Contains dairy', 'Packed hot'],
      time: '1h 15m',
      timeTone: 'soon',
      distance: '0.2 mi',
      coordinates: { x: 34, y: 42 },
      pickedUpBy: 'Awaiting match',
      datePickedUp: 'Not picked up yet',
    }

    setCompanyListings([nextListing, ...companyListings])
    setSelectedListing(nextListing)
    setPostingTitle('')
    setCompanyView('listings')
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
          {role === 'volunteer' ? (
            <>
              <button className={volunteerView === 'listings' ? 'active' : ''} onClick={() => setVolunteerView('listings')}>
                Nearby Listings
              </button>
              <button className={volunteerView === 'history' ? 'active' : ''} onClick={() => setVolunteerView('history')}>
                My History
              </button>
            </>
          ) : (
            <>
              <button className={companyView === 'dashboard' ? 'active' : ''} onClick={() => setCompanyView('dashboard')}>
                Analytics
              </button>
              <button className={companyView === 'post' ? 'active' : ''} onClick={() => setCompanyView('post')}>
                Food Posting
              </button>
              <button className={companyView === 'listings' ? 'active' : ''} onClick={() => setCompanyView('listings')}>
                Listing Map
              </button>
            </>
          )}
        </nav>

        <div className="right-nav">
          <button className={role === 'volunteer' ? 'role-toggle active' : 'role-toggle'} onClick={() => switchRole('volunteer')}>
            Volunteer
          </button>
          <button className={role === 'company' ? 'role-toggle active' : 'role-toggle'} onClick={() => switchRole('company')}>
            Company
          </button>
          <button className="profile-pill">
            <span>{role === 'company' ? 'GH' : 'MT'}</span>
            {role === 'company' ? 'Green Harvest' : 'Marcus T.'}
          </button>
        </div>
      </header>

      <section className="search-band">
        <div className="search-card">
          <label>
            <span>Search</span>
            <input placeholder={role === 'company' ? 'Find listings, pickups, recipients...' : 'Search food, restaurant...'} />
          </label>
          <label>
            <span>Location</span>
            <input placeholder="Seattle, WA" />
          </label>
          <button>{role === 'company' ? 'Review' : 'Search'}</button>
        </div>
        <div className="filter-row">
          {['All', 'Meals', 'Bakery', 'Produce', 'Urgent', 'Distance'].map((filter) => (
            <button className={filter === 'All' ? 'active' : ''} key={filter}>
              {filter}
            </button>
          ))}
        </div>
      </section>

      {role === 'volunteer' && activeView === 'listings' && (
        <ListingsAndMap listings={companyListings} selectedListing={selectedListing} onSelectListing={setSelectedListing} />
      )}

      {role === 'volunteer' && activeView === 'history' && <HistoryView />}

      {role === 'company' && activeView === 'dashboard' && <CompanyDashboard />}

      {role === 'company' && activeView === 'post' && <FoodPosting onSubmit={submitPosting} postingTitle={postingTitle} setPostingTitle={setPostingTitle} />}

      {role === 'company' && activeView === 'listings' && (
        <ListingsAndMap listings={companyListings} selectedListing={selectedListing} onSelectListing={setSelectedListing} companyMode />
      )}
    </div>
  )
}

function ListingsAndMap({
  listings,
  selectedListing,
  onSelectListing,
  companyMode = false,
}: {
  listings: Listing[]
  selectedListing: Listing
  onSelectListing: (listing: Listing) => void
  companyMode?: boolean
}) {
  return (
    <main className="content-grid">
      <section className="results-column">
        <div className="list-heading">
          <span>{listings.length} listings</span>
          <strong>{companyMode ? 'Posts visible to rescue partners' : 'Updated just now'}</strong>
        </div>

        <div className="listing-stack">
          {listings.map((listing) => (
            <article
              className={`listing-card ${selectedListing.id === listing.id ? 'selected' : ''}`}
              key={listing.id}
              onClick={() => onSelectListing(listing)}
            >
              <div className="listing-card-top">
                <div>
                  <span className="badge">{listing.category}</span>
                  <h2>{listing.title}</h2>
                  <p>{listing.restaurant}</p>
                </div>
                <span className={`time-pill ${listing.timeTone}`}>{listing.time}</span>
              </div>
              <div className="chip-row">
                <span>{listing.portions}</span>
                {listing.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
                <span>{listing.distance}</span>
              </div>
              {selectedListing.id === listing.id && !companyMode && <button className="claim-button">Claim pickup</button>}
            </article>
          ))}
        </div>
      </section>

      <aside className="right-panel">
        <div className="panel-header">
          <div>
            <span className="badge">Amazon Location Service</span>
            <h1>{selectedListing.restaurant}</h1>
            <p>{selectedListing.title}</p>
          </div>
          <button>Get directions</button>
        </div>
        <MapPanel selectedListing={selectedListing} listings={listings} onSelectListing={onSelectListing} />
        <div className="detail-strip">
          <span>Pickup window: closes in {selectedListing.time}</span>
          <span>Walk: 8 min</span>
          <span>Drive: 2 min</span>
        </div>
      </aside>
    </main>
  )
}

function MapPanel({
  selectedListing,
  listings,
  onSelectListing,
}: {
  selectedListing: Listing
  listings: Listing[]
  onSelectListing: (listing: Listing) => void
}) {
  return (
    <div className="map-panel">
      <svg className="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M18 34 V44 H36 V68 H56 V78" />
      </svg>
      {listings.map((listing) => (
        <button
          className={`map-pin ${selectedListing.id === listing.id ? 'active' : ''}`}
          key={listing.id}
          onClick={() => onSelectListing(listing)}
          style={{ left: `${listing.coordinates.x}%`, top: `${listing.coordinates.y}%` }}
          aria-label={`Select ${listing.title}`}
        >
          {listing.title.slice(0, 1)}
        </button>
      ))}
      <div className="map-callout" style={{ left: `${selectedListing.coordinates.x + 4}%`, top: `${selectedListing.coordinates.y - 7}%` }}>
        <strong>{selectedListing.restaurant}</strong>
        <span>Closes in {selectedListing.time}</span>
      </div>
      <div className="you-are-here">
        <span />
        You're here
      </div>
    </div>
  )
}

function CompanyDashboard() {
  const maxValue = Math.max(...monthlyDonations.map((item) => item.value))
  const totalDonations = monthlyDonations.reduce((total, item) => total + item.value, 0)

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
  )
}

function FoodPosting({
  onSubmit,
  postingTitle,
  setPostingTitle,
}: {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  postingTitle: string
  setPostingTitle: (title: string) => void
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
          <input value={postingTitle} onChange={(event) => setPostingTitle(event.target.value)} placeholder="Example: 24 boxed pasta dinners" />
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
          {['Nearby shelters', 'Volunteer drivers', 'Foodbanks'].map((option) => (
            <label key={option}>
              <input defaultChecked={option !== 'Foodbanks'} type="checkbox" />
              {option}
            </label>
          ))}
        </fieldset>
        <label className="wide">
          Optional photos of food
          <input placeholder="Paste a photo URL or connect upload later" />
        </label>
        <button className="submit-button">Post surplus food</button>
      </form>
    </main>
  )
}

function HistoryView() {
  return (
    <main className="dashboard-layout">
      <section className="table-card full">
        <div className="section-title">
          <span>Volunteer history</span>
          <h1>Completed pickups</h1>
        </div>
        <div className="data-table">
          <div className="data-row header">
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
  )
}

export default App
