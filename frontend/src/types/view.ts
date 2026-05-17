export type Role = 'volunteer' | 'company'
export type VolunteerView = 'listings' | 'history'
export type CompanyView = 'dashboard' | 'post' | 'listings'

export type Listing = {
  id: string
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
