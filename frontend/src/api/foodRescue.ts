import { foodListingsApi, listingTagsApi, organizationsApi } from "./endpoints";
import type { FoodListingPayload } from "../types/api";
import type { Listing } from "../types/view";
import {
  groupTagsByListingId,
  mapFoodListingToViewListing,
} from "../mappers/listings";

export async function getListingsForUi(): Promise<Listing[]> {
  const [foodListings, organizations, listingTags] = await Promise.all([
    foodListingsApi.list(),
    organizationsApi.list(),
    listingTagsApi.list().catch((error: unknown) => {
      console.warn("Unable to load listing tags; continuing without tags.", error);
      return [];
    }),
  ]);

  const tagsByListingId = groupTagsByListingId(listingTags);
  return foodListings.map((listing, index) =>
    mapFoodListingToViewListing(listing, index, organizations, tagsByListingId),
  );
}

export async function createFoodListingFromUi(title: string): Promise<Listing> {
  const now = new Date();
  const endsAt = new Date(now.getTime() + 75 * 60 * 1000);
  const payload: FoodListingPayload = {
    title: title || "Fresh surplus pickup",
    category: "Prepared meals",
    description: "Posted from the frontend surplus food form.",
    quantityLabel: "24 portions",
    servingCount: 24,
    pickupInstructions: "Use loading dock B and ask for the shift lead.",
    pickupWindowStartsAt: now.toISOString(),
    pickupWindowEndsAt: endsAt.toISOString(),
    status: "AVAILABLE",
    timeTone: "SOON",
    distanceLabel: "0.2 mi",
    mapPositionX: 34,
    mapPositionY: 42,
  };

  const createdListing = await foodListingsApi.create(payload);
  return mapFoodListingToViewListing(createdListing, 0, [], new Map());
}
