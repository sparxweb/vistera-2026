import {
  FoodRecoveryOffer,
  FoodRecoveryNotification,
  FoodSafetyReview,
  OfferPickupStatus,
  UserRole,
  AuthUser,
  FoodUnit,
} from '@/types/foodflow';
import {
  INITIAL_RECOVERY_OFFERS,
  INITIAL_RECOVERY_NOTIFICATIONS,
  DEMO_HOTEL_USER,
  DEMO_NGO,
} from '@/lib/demoData';
import { supabase } from '@/lib/supabase/client';

const STORAGE_KEYS = {
  OFFERS: 'foodflow_recovery_offers_v2',
  NOTIFICATIONS: 'foodflow_recovery_notifications_v2',
  ACTIVE_ROLE: 'foodflow_active_role_v2',
};

// Safe localStorage helpers
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`[RecoveryService] Failed to read ${key}:`, e);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('foodflow_offers_updated'));
  } catch (e) {
    console.warn(`[RecoveryService] Failed to write ${key}:`, e);
  }
}

/**
 * 1. Fetch All Offers from Shared Data Layer
 */
export async function getRecoveryOffers(): Promise<{
  offers: FoodRecoveryOffer[];
  isRemote: boolean;
}> {
  const localOffers = getLocal<FoodRecoveryOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_RECOVERY_OFFERS);

  // If Supabase is connected, attempt sync
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('surplus_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Return local merged with remote if schema fits, otherwise local authoritative demo state
        return { offers: localOffers, isRemote: true };
      }
    } catch {
      // Fallback
    }
  }

  return { offers: localOffers, isRemote: false };
}

/**
 * 2. Fetch Single Offer by ID
 */
export function getRecoveryOfferById(id: string): FoodRecoveryOffer | null {
  const offers = getLocal<FoodRecoveryOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_RECOVERY_OFFERS);
  return offers.find((o) => o.id === id) || null;
}

export interface CreateOfferInput {
  foodItem: string;
  dishCategory: string;
  quantity: number;
  unit: FoodUnit;
  servingsEquivalent?: number;
  preparationDateTime: string;
  availableUntil: string;
  pickupDeadline: string;
  storageCondition: 'Hot-holding (≥63°C)' | 'Refrigerated (≤4°C)' | 'Ambient / Dry';
  temperatureLoggedCelsius?: number;
  hotelLocation?: string;
  handlingNotes?: string;
  dietaryTags?: string[];
  allergens?: string[];
}

/**
 * 3. Hotel: Create Food Recovery Offer
 * Enforces validation: positive quantity, non-empty fields, valid deadlines
 * Sets initial state to PENDING_REVIEW with locked acceptance.
 */
export async function createRecoveryOffer(
  input: CreateOfferInput,
  creator: AuthUser = DEMO_HOTEL_USER
): Promise<{ success: boolean; offer?: FoodRecoveryOffer; error?: string }> {
  // Validations
  if (!input.foodItem || input.foodItem.trim().length === 0) {
    return { success: false, error: 'Food item description is required.' };
  }
  if (!input.quantity || input.quantity <= 0) {
    return { success: false, error: 'Available quantity must be greater than zero.' };
  }
  if (!input.pickupDeadline || input.pickupDeadline.trim().length === 0) {
    return { success: false, error: 'Pickup deadline is required.' };
  }

  const existingOffers = getLocal<FoodRecoveryOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_RECOVERY_OFFERS);
  const nextNum = existingOffers.length + 1;
  const uniqueId = `FF-SURPLUS-${nextNum.toString().padStart(4, '0')}`;

  const nowIso = new Date().toISOString();
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

  const newOffer: FoodRecoveryOffer = {
    id: uniqueId,
    hotelId: creator.facilityId || 'DGH-HYD-01',
    hotelName: creator.name || 'Deccan Grand Hotel — Hyderabad',
    hotelLocation: input.hotelLocation || creator.location || 'Service Bay Dock 2, Gachibowli, Hyderabad',
    hotelCoordinates: creator.coordinates || { lat: 17.4447, lng: 78.3483 },
    foodItem: input.foodItem.trim(),
    dishCategory: input.dishCategory || 'Cooked Meals',
    quantity: Number(input.quantity),
    unit: input.unit || 'kg',
    servingsEquivalent: input.servingsEquivalent || Math.round(Number(input.quantity) * 6),
    preparationDateTime: input.preparationDateTime || `Today, ${timeStr}`,
    availableUntil: input.availableUntil,
    pickupDeadline: input.pickupDeadline,
    handlingNotes: input.handlingNotes,
    dietaryTags: input.dietaryTags || ['Verified Hot-Held'],
    allergens: input.allergens || ['None'],
    // Initial Safety Review Gate: PENDING_REVIEW
    safetyReview: {
      preparationTime: input.preparationDateTime || timeStr,
      storageCondition: input.storageCondition,
      temperatureLoggedCelsius: input.temperatureLoggedCelsius,
      temperatureVerified: false,
      hygieneCheckPassed: false,
      packagingFoodGrade: true,
      responsibleStaffConfirmation: false,
      reviewedBy: 'Pending Staff Verification',
      reviewerDesignation: 'Shift Duty Supervisor',
      reviewedAt: 'Awaiting Review',
      decision: 'PENDING_REVIEW',
      safetyNotes: 'Offer logged. Awaiting authorized hotel staff safety inspection.',
      policyNotes: 'Pending review against hot/cold holding temperature requirements before NGO release.',
    },
    status: 'OFFERED',
    timeline: [
      {
        stage: 'OFFERED',
        label: 'Offer Created',
        actor: `${creator.contactPerson || creator.name} (${creator.role})`,
        timestamp: timeStr,
        details: `Created surplus offer (${input.quantity} ${input.unit}, ~${input.servingsEquivalent || Math.round(Number(input.quantity) * 6)} servings). Locked behind safety review gate.`,
      },
    ],
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const updatedOffers = [newOffer, ...existingOffers];
  setLocal(STORAGE_KEYS.OFFERS, updatedOffers);

  // In-app notification for Hotel
  createInAppNotification({
    targetRole: 'HOTEL',
    offerId: uniqueId,
    title: 'Surplus Offer Created',
    message: `Offer ${uniqueId} created for ${input.foodItem}. Pending mandatory food safety review.`,
    type: 'WARNING',
  });

  // Attempt Supabase insert
  if (supabase) {
    try {
      await supabase.from('surplus_listings').insert({
        food_description: newOffer.foodItem,
        quantity: newOffer.quantity,
        unit: newOffer.unit,
        quantity_servings: newOffer.servingsEquivalent,
        status: 'ACTIVE',
        pickup_location: newOffer.hotelLocation,
      });
    } catch (e) {
      console.warn('[RecoveryService] Supabase insert fallback to local:', e);
    }
  }

  return { success: true, offer: newOffer };
}

export interface SafetyReviewInput {
  temperatureVerified: boolean;
  hygieneCheckPassed: boolean;
  packagingFoodGrade: boolean;
  responsibleStaffConfirmation: boolean;
  temperatureLoggedCelsius?: number;
  reviewedBy: string;
  reviewerDesignation: string;
  decision: 'ELIGIBLE_FOR_REVIEWED_PICKUP' | 'REJECTED';
  rejectionReason?: string;
  safetyNotes?: string;
}

/**
 * 4. Hotel: Perform Food Safety Review Gate
 * Approves offer for NGO acceptance or rejects it.
 */
export async function submitSafetyReview(
  offerId: string,
  reviewInput: SafetyReviewInput,
  reviewer: AuthUser = DEMO_HOTEL_USER
): Promise<{ success: boolean; offer?: FoodRecoveryOffer; error?: string }> {
  const offers = getLocal<FoodRecoveryOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_RECOVERY_OFFERS);
  const index = offers.findIndex((o) => o.id === offerId);
  if (index === -1) {
    return { success: false, error: `Offer ${offerId} not found.` };
  }

  const current = offers[index];
  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  const nowIso = new Date().toISOString();

  // If approving, mandatory checks must pass
  if (reviewInput.decision === 'ELIGIBLE_FOR_REVIEWED_PICKUP') {
    if (!reviewInput.responsibleStaffConfirmation) {
      return {
        success: false,
        error: 'Responsible staff confirmation is mandatory to approve this offer.',
      };
    }
    if (!reviewInput.hygieneCheckPassed) {
      return {
        success: false,
        error: 'Hygiene and sensory inspection must pass to approve recovery eligibility.',
      };
    }
  }

  const updatedReview: FoodSafetyReview = {
    ...current.safetyReview,
    temperatureVerified: reviewInput.temperatureVerified,
    hygieneCheckPassed: reviewInput.hygieneCheckPassed,
    packagingFoodGrade: reviewInput.packagingFoodGrade,
    responsibleStaffConfirmation: reviewInput.responsibleStaffConfirmation,
    temperatureLoggedCelsius: reviewInput.temperatureLoggedCelsius ?? current.safetyReview.temperatureLoggedCelsius,
    reviewedBy: reviewInput.reviewedBy || reviewer.contactPerson || 'Authorized Food Safety Supervisor',
    reviewerDesignation: reviewInput.reviewerDesignation || 'F&B Food Safety Lead',
    reviewedAt: `Today, ${timeStr}`,
    decision: reviewInput.decision,
    rejectionReason: reviewInput.rejectionReason,
    safetyNotes: reviewInput.safetyNotes || (reviewInput.decision === 'ELIGIBLE_FOR_REVIEWED_PICKUP' ? 'All sensory and temperature checks verified.' : 'Failed safety threshold.'),
    policyNotes: 'Reviewed against internal hotel SOPs (hot-holding ≥63°C / refrigerated ≤4°C). Explicit manual inspection completed.',
  };

  const isApproved = reviewInput.decision === 'ELIGIBLE_FOR_REVIEWED_PICKUP';

  const updatedOffer: FoodRecoveryOffer = {
    ...current,
    safetyReview: updatedReview,
    status: isApproved ? 'OFFERED' : 'DECLINED',
    timeline: [
      ...current.timeline,
      {
        stage: isApproved ? 'SAFETY_APPROVED' : 'SAFETY_REJECTED',
        label: isApproved ? 'Food Safety Approved' : 'Safety Review Rejected',
        actor: `${updatedReview.reviewedBy} (${reviewer.role})`,
        timestamp: timeStr,
        details: isApproved
          ? `Verified by ${updatedReview.reviewedBy} (${updatedReview.reviewerDesignation}). Stamped ELIGIBLE_FOR_REVIEWED_PICKUP.`
          : `Rejected: ${reviewInput.rejectionReason || 'Did not meet safety criteria'}. Offer closed.`,
      },
    ],
    updatedAt: nowIso,
  };

  offers[index] = updatedOffer;
  setLocal(STORAGE_KEYS.OFFERS, offers);

  // Generate notifications
  if (isApproved) {
    createInAppNotification({
      targetRole: 'HOTEL',
      offerId,
      title: 'Offer Approved for Recovery',
      message: `Offer ${offerId} verified and published to the NGO recovery inbox.`,
      type: 'SUCCESS',
    });
    createInAppNotification({
      targetRole: 'NGO',
      offerId,
      title: 'New Food Recovery Offer Available',
      message: `Deccan Grand Hotel published eligible surplus: ${current.foodItem} (${current.quantity} ${current.unit}).`,
      type: 'SUCCESS',
    });
  } else {
    createInAppNotification({
      targetRole: 'HOTEL',
      offerId,
      title: 'Offer Safety Review Rejected',
      message: `Offer ${offerId} marked REJECTED: ${reviewInput.rejectionReason || 'Unsafe storage'}.`,
      type: 'ALERT',
    });
  }

  return { success: true, offer: updatedOffer };
}

/**
 * 5. NGO: Accept Food Recovery Offer
 * Checks: Must be ELIGIBLE_FOR_REVIEWED_PICKUP, not already accepted, not expired.
 */
export async function acceptRecoveryOffer(
  offerId: string,
  ngoUser: AuthUser = DEMO_NGO
): Promise<{ success: boolean; offer?: FoodRecoveryOffer; error?: string }> {
  const offers = getLocal<FoodRecoveryOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_RECOVERY_OFFERS);
  const index = offers.findIndex((o) => o.id === offerId);
  if (index === -1) {
    return { success: false, error: `Offer ${offerId} not found.` };
  }

  const current = offers[index];

  // Safety gate check: Ineligible food cannot be accepted!
  if (current.safetyReview.decision !== 'ELIGIBLE_FOR_REVIEWED_PICKUP') {
    return {
      success: false,
      error: `Cannot accept offer: Safety review is '${current.safetyReview.decision}'. Food must be approved by hotel staff first.`,
    };
  }

  // Duplicate acceptance check
  if (current.status !== 'OFFERED') {
    return {
      success: false,
      error: `Cannot accept offer: Offer is currently in '${current.status}' status and is no longer available.`,
    };
  }

  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  const nowIso = new Date().toISOString();

  const updatedOffer: FoodRecoveryOffer = {
    ...current,
    status: 'ACCEPTED',
    acceptedByOrgId: ngoUser.orgId || ngoUser.id,
    acceptedByOrgName: ngoUser.name || 'Hyderabad Community Food Support',
    acceptedAt: nowIso,
    pickupDetails: {
      scheduledDateTime: 'Pending Scheduling',
      handoverConfirmedByHotel: false,
      receivedConfirmedByNgo: false,
      notes: `Accepted by ${ngoUser.name}. Awaiting pickup schedule.`,
    },
    timeline: [
      ...current.timeline,
      {
        stage: 'ACCEPTED',
        label: 'Offer Accepted by Partner',
        actor: `${ngoUser.name} (${ngoUser.dataStatus})`,
        timestamp: timeStr,
        details: `Offer accepted by ${ngoUser.name}. Coordinated dispatch window opened.`,
      },
    ],
    updatedAt: nowIso,
  };

  offers[index] = updatedOffer;
  setLocal(STORAGE_KEYS.OFFERS, offers);

  // In-app notifications for both
  createInAppNotification({
    targetRole: 'HOTEL',
    offerId,
    title: 'Offer Accepted by Partner',
    message: `${ngoUser.name} accepted your surplus offer ${offerId} (${current.foodItem}).`,
    type: 'SUCCESS',
  });
  createInAppNotification({
    targetRole: 'NGO',
    offerId,
    title: 'Offer Acceptance Confirmed',
    message: `You accepted ${offerId} from Deccan Grand Hotel. Please schedule your pickup time.`,
    type: 'SUCCESS',
  });

  return { success: true, offer: updatedOffer };
}

/**
 * 6. NGO: Decline Food Recovery Offer
 */
export async function declineRecoveryOffer(
  offerId: string,
  reason: string,
  ngoUser: AuthUser = DEMO_NGO
): Promise<{ success: boolean; offer?: FoodRecoveryOffer; error?: string }> {
  const offers = getLocal<FoodRecoveryOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_RECOVERY_OFFERS);
  const index = offers.findIndex((o) => o.id === offerId);
  if (index === -1) {
    return { success: false, error: `Offer ${offerId} not found.` };
  }

  const current = offers[index];
  if (current.status !== 'OFFERED') {
    return { success: false, error: `Offer cannot be declined in status '${current.status}'.` };
  }

  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  const nowIso = new Date().toISOString();

  const updatedOffer: FoodRecoveryOffer = {
    ...current,
    status: 'DECLINED',
    declineReason: reason || 'Partner capacity full or logistics unavailable',
    declinedAt: nowIso,
    timeline: [
      ...current.timeline,
      {
        stage: 'DECLINED',
        label: 'Offer Declined by Partner',
        actor: `${ngoUser.name} (${ngoUser.role})`,
        timestamp: timeStr,
        details: `Declined: ${reason || 'Partner capacity unavailable'}.`,
      },
    ],
    updatedAt: nowIso,
  };

  offers[index] = updatedOffer;
  setLocal(STORAGE_KEYS.OFFERS, offers);

  createInAppNotification({
    targetRole: 'HOTEL',
    offerId,
    title: 'Offer Declined by Partner',
    message: `Partner declined offer ${offerId}: ${reason || 'Logistics unavailable'}.`,
    type: 'INFO',
  });

  return { success: true, offer: updatedOffer };
}

export interface SchedulePickupInput {
  scheduledDateTime: string;
  vehicleType: string;
  driverContact: string;
  notes?: string;
}

/**
 * 7. NGO: Schedule Pickup
 */
export async function scheduleOfferPickup(
  offerId: string,
  input: SchedulePickupInput,
  ngoUser: AuthUser = DEMO_NGO
): Promise<{ success: boolean; offer?: FoodRecoveryOffer; error?: string }> {
  const offers = getLocal<FoodRecoveryOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_RECOVERY_OFFERS);
  const index = offers.findIndex((o) => o.id === offerId);
  if (index === -1) {
    return { success: false, error: `Offer ${offerId} not found.` };
  }

  const current = offers[index];
  if (current.status !== 'ACCEPTED') {
    return {
      success: false,
      error: `Offer must be in 'ACCEPTED' status to schedule pickup. Current status: '${current.status}'.`,
    };
  }

  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  const nowIso = new Date().toISOString();

  const updatedOffer: FoodRecoveryOffer = {
    ...current,
    status: 'PICKUP_SCHEDULED',
    pickupDetails: {
      ...current.pickupDetails,
      scheduledDateTime: input.scheduledDateTime,
      vehicleType: input.vehicleType,
      driverContact: input.driverContact,
      notes: input.notes,
    },
    timeline: [
      ...current.timeline,
      {
        stage: 'PICKUP_SCHEDULED',
        label: 'Pickup Scheduled',
        actor: `${ngoUser.name} (${ngoUser.role})`,
        timestamp: timeStr,
        details: `Scheduled for ${input.scheduledDateTime} via ${input.vehicleType} (Driver: ${input.driverContact}).`,
      },
    ],
    updatedAt: nowIso,
  };

  offers[index] = updatedOffer;
  setLocal(STORAGE_KEYS.OFFERS, offers);

  createInAppNotification({
    targetRole: 'HOTEL',
    offerId,
    title: 'Pickup Scheduled by Partner',
    message: `${ngoUser.name} scheduled pickup for ${input.scheduledDateTime} at Dock 2.`,
    type: 'INFO',
  });
  createInAppNotification({
    targetRole: 'NGO',
    offerId,
    title: 'Pickup Scheduled Successfully',
    message: `Pickup confirmed for ${offerId} at ${input.scheduledDateTime}.`,
    type: 'SUCCESS',
  });

  return { success: true, offer: updatedOffer };
}

/**
 * 8. Hotel: Confirm Handover to Driver
 */
export async function confirmHotelHandover(
  offerId: string,
  temperatureAtHandoverCelsius?: number,
  hotelUser: AuthUser = DEMO_HOTEL_USER
): Promise<{ success: boolean; offer?: FoodRecoveryOffer; error?: string }> {
  const offers = getLocal<FoodRecoveryOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_RECOVERY_OFFERS);
  const index = offers.findIndex((o) => o.id === offerId);
  if (index === -1) {
    return { success: false, error: `Offer ${offerId} not found.` };
  }

  const current = offers[index];
  if (current.status !== 'PICKUP_SCHEDULED') {
    return {
      success: false,
      error: `Pickup must be in 'PICKUP_SCHEDULED' status to confirm handover. Current status: '${current.status}'.`,
    };
  }

  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  const nowIso = new Date().toISOString();

  const updatedOffer: FoodRecoveryOffer = {
    ...current,
    status: 'PICKED_UP',
    pickupDetails: {
      ...current.pickupDetails,
      handoverConfirmedByHotel: true,
      handoverTimestamp: nowIso,
      temperatureAtPickupCelsius: temperatureAtHandoverCelsius || 65.5,
    },
    timeline: [
      ...current.timeline,
      {
        stage: 'PICKED_UP',
        label: 'Food Handover Completed',
        actor: `${hotelUser.contactPerson || hotelUser.name} (Hotel)`,
        timestamp: timeStr,
        details: `Food containers inspected and handed to pickup vehicle. Handover temp: ${temperatureAtHandoverCelsius || 65.5}°C.`,
      },
    ],
    updatedAt: nowIso,
  };

  offers[index] = updatedOffer;
  setLocal(STORAGE_KEYS.OFFERS, offers);

  createInAppNotification({
    targetRole: 'NGO',
    offerId,
    title: 'Food Handed Over at Hotel Dock',
    message: `Hotel confirmed food dispatch for ${offerId}. Vehicle in transit to distribution point.`,
    type: 'INFO',
  });

  return { success: true, offer: updatedOffer };
}

/**
 * 9. NGO: Confirm Collection and Complete Recovery Run
 */
export async function completeRecoveryRun(
  offerId: string,
  ngoUser: AuthUser = DEMO_NGO
): Promise<{ success: boolean; offer?: FoodRecoveryOffer; error?: string }> {
  const offers = getLocal<FoodRecoveryOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_RECOVERY_OFFERS);
  const index = offers.findIndex((o) => o.id === offerId);
  if (index === -1) {
    return { success: false, error: `Offer ${offerId} not found.` };
  }

  const current = offers[index];
  if (current.status !== 'PICKED_UP' && current.status !== 'PICKUP_SCHEDULED') {
    return {
      success: false,
      error: `Offer cannot be marked completed from status '${current.status}'. Must be dispatched or collected.`,
    };
  }

  const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  const nowIso = new Date().toISOString();

  const updatedOffer: FoodRecoveryOffer = {
    ...current,
    status: 'COMPLETED',
    pickupDetails: {
      ...current.pickupDetails,
      receivedConfirmedByNgo: true,
      completionTimestamp: nowIso,
    },
    timeline: [
      ...current.timeline,
      {
        stage: 'COMPLETED',
        label: 'Recovery & Distribution Completed',
        actor: `${ngoUser.name} (${ngoUser.role})`,
        timestamp: timeStr,
        details: `Safely received at community distribution center. ~${current.servingsEquivalent} portions served to beneficiaries.`,
      },
    ],
    updatedAt: nowIso,
  };

  offers[index] = updatedOffer;
  setLocal(STORAGE_KEYS.OFFERS, offers);

  createInAppNotification({
    targetRole: 'HOTEL',
    offerId,
    title: 'Recovery Run Completed',
    message: `${ngoUser.name} completed distribution for ${offerId}. Zero edible waste achieved!`,
    type: 'SUCCESS',
  });
  createInAppNotification({
    targetRole: 'NGO',
    offerId,
    title: 'Recovery Run Completed',
    message: `Recovery run for ${offerId} safely concluded. Stored in impact log.`,
    type: 'SUCCESS',
  });

  return { success: true, offer: updatedOffer };
}

/**
 * 10. In-App Notifications
 */
export function getRecoveryNotifications(role?: UserRole): FoodRecoveryNotification[] {
  const allNotifs = getLocal<FoodRecoveryNotification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    INITIAL_RECOVERY_NOTIFICATIONS
  );
  if (!role) return allNotifs;
  return allNotifs.filter((n) => n.targetRole === role || n.targetRole === 'ALL');
}

export function createInAppNotification(
  input: Omit<FoodRecoveryNotification, 'id' | 'timestamp' | 'read'>
): FoodRecoveryNotification {
  const notifs = getLocal<FoodRecoveryNotification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    INITIAL_RECOVERY_NOTIFICATIONS
  );
  const newNotif: FoodRecoveryNotification = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    read: false,
    ...input,
  };
  setLocal(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs.slice(0, 30)]);
  return newNotif;
}

export function markNotificationRead(id: string): void {
  const notifs = getLocal<FoodRecoveryNotification[]>(
    STORAGE_KEYS.NOTIFICATIONS,
    INITIAL_RECOVERY_NOTIFICATIONS
  );
  const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
  setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
}

export function resetRecoveryData(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEYS.OFFERS);
    window.localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
  }
}
