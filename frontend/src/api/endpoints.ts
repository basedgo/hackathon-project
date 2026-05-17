import { apiRequest, createResourceApi } from "./http";
import type {
  AppUser,
  AuditEvent,
  FoodListing,
  FoodListingPayload,
  ListingAlertPreference,
  ListingTag,
  Organization,
  PickupClaim,
} from "../types/api";

export const organizationsApi = createResourceApi<
  Organization,
  Partial<Organization>
>("organizations");
export const appUsersApi = createResourceApi<AppUser, Partial<AppUser>>(
  "app-users",
);
export const foodListingsApi = createResourceApi<
  FoodListing,
  FoodListingPayload
>("food-listings");
export const pickupClaimsApi = createResourceApi<
  PickupClaim,
  Partial<PickupClaim>
>("pickup-claims");
export const listingAlertPreferencesApi = createResourceApi<
  ListingAlertPreference,
  Partial<ListingAlertPreference>
>("listing-alert-preferences");
export const auditEventsApi = createResourceApi<
  AuditEvent,
  Partial<AuditEvent>
>("audit-events");

export const listingTagsApi = {
  list: () => apiRequest<ListingTag[]>("listing-tags"),
  get: (listingId: string, tag: string) =>
    apiRequest<ListingTag>(
      `listing-tags/${listingId}/${encodeURIComponent(tag)}`,
    ),
  create: (payload: ListingTag) =>
    apiRequest<ListingTag>("listing-tags", { method: "POST", body: payload }),
  update: (
    listingId: string,
    tag: string,
    payload: Pick<ListingTag, "tagType">,
  ) =>
    apiRequest<ListingTag>(
      `listing-tags/${listingId}/${encodeURIComponent(tag)}`,
      { method: "PUT", body: payload },
    ),
  remove: (listingId: string, tag: string) =>
    apiRequest<void>(`listing-tags/${listingId}/${encodeURIComponent(tag)}`, {
      method: "DELETE",
    }),
};
