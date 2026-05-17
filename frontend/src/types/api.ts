export type UUID = string
export type ISODateTime = string

export type OrganizationType = 'DONOR' | 'RECIPIENT'
export type UserRole = 'VOLUNTEER' | 'DONOR_ADMIN' | 'RECIPIENT_ADMIN'
export type ListingStatus = 'DRAFT' | 'AVAILABLE' | 'CLAIMED' | 'PICKED_UP' | 'EXPIRED' | 'CANCELLED'
export type TimeTone = 'URGENT' | 'SOON' | 'CALM'
export type TagType = 'DIETARY' | 'ALLERGEN' | 'PACKAGING' | 'ALERT'
export type ClaimStatus = 'CLAIMED' | 'IN_TRANSIT' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED'
export type AlertAudience = 'NEARBY_SHELTERS' | 'VOLUNTEER_DRIVERS' | 'FOODBANKS'

export type Organization = {
  organizationId: UUID
  name: string
  organizationType: OrganizationType
  displayInitials?: string | null
  contactName?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  streetAddress?: string | null
  city: string
  stateCode: string
  postalCode?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  serviceRadiusMiles?: number | string | null
  capacityNotes?: string | null
  snsTopicArn?: string | null
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export type AppUser = {
  userId: UUID
  fullName: string
  displayInitials?: string | null
  role: UserRole
  email?: string | null
  phone?: string | null
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export type FoodListing = {
  listingId: UUID
  title: string
  category: string
  description?: string | null
  quantityLabel: string
  servingCount?: number | null
  pickupInstructions?: string | null
  pickupWindowStartsAt?: ISODateTime | null
  pickupWindowEndsAt: ISODateTime
  status: ListingStatus
  timeTone: TimeTone
  distanceLabel?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
  mapPositionX?: number | string | null
  mapPositionY?: number | string | null
  photoUrl?: string | null
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export type FoodListingPayload = Omit<Partial<FoodListing>, 'createdAt' | 'updatedAt'> & {
  title: string
  category: string
  quantityLabel: string
  pickupWindowEndsAt: ISODateTime
}

export type ListingTag = {
  listingId?: UUID | null
  listing?: FoodListing
  tag: string
  tagType: TagType
}

export type PickupClaim = {
  claimId: UUID
  status: ClaimStatus
  claimedAt: ISODateTime
  pickedUpAt?: ISODateTime | null
  deliveredAt?: ISODateTime | null
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export type ListingAlertPreference = {
  listingAlertPreferenceId: UUID
  audience: AlertAudience
  enabled: boolean
  createdAt: ISODateTime
}

export type AuditEvent = {
  auditEventId: UUID
  entityType: string
  entityId: UUID
  eventType: string
  eventPayload: string
  createdAt: ISODateTime
}
