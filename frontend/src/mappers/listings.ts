import type { FoodListing, ListingTag, Organization } from "../types/api";
import type { Listing } from "../types/view";

const fallbackRestaurants = [
  "Green Harvest Co.",
  "Pike St. Bakery",
  "The Garden Table",
  "Sakura Kitchen",
];
const fallbackRecipients = [
  "Mission House Shelter",
  "Northside Community Fridge",
  "City Food Bank",
  "Hope Kitchen",
];

function toNumber(value: number | string | null | undefined, fallback: number) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function formatPickupTime(endTime: string) {
  const endsAt = new Date(endTime).getTime();
  const diffMs = endsAt - Date.now();
  const absoluteMinutes = Math.max(0, Math.round(diffMs / 60000));

  if (absoluteMinutes < 60) return `${absoluteMinutes} min`;

  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not picked up yet";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function mapFoodListingToViewListing(
  listing: FoodListing,
  index: number,
  organizations: Organization[],
  tagsByListingId: Map<string, string[]>,
): Listing {
  const donorOrganizations = organizations.filter(
    (organization) => organization.organizationType === "DONOR",
  );
  const donor =
    donorOrganizations[index % Math.max(donorOrganizations.length, 1)];

  return {
    id: listing.listingId,
    title: listing.title,
    restaurant:
      donor?.name ?? fallbackRestaurants[index % fallbackRestaurants.length],
    category: listing.category,
    portions: listing.quantityLabel,
    tags: tagsByListingId.get(listing.listingId) ?? [],
    time: formatPickupTime(listing.pickupWindowEndsAt),
    timeTone: listing.timeTone.toLowerCase() as Listing["timeTone"],
    distance: listing.distanceLabel ?? "Nearby",
    coordinates: {
      x: toNumber(listing.mapPositionX, 20 + index * 16),
      y: toNumber(listing.mapPositionY, 34 + index * 7),
    },
    pickedUpBy: fallbackRecipients[index % fallbackRecipients.length],
    datePickedUp:
      listing.status === "PICKED_UP"
        ? formatDate(listing.updatedAt)
        : "Not picked up yet",
  };
}

export function groupTagsByListingId(tags: ListingTag[]) {
  return tags.reduce((grouped, tag) => {
    const listingId = tag.listing?.listingId;
    if (!listingId) return grouped;

    const existing = grouped.get(listingId) ?? [];
    grouped.set(listingId, [...existing, tag.tag]);
    return grouped;
  }, new Map<string, string[]>());
}
