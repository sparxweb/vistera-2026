/**
 * Haversine Great-Circle Distance Calculation
 * Computes exact geodesic distance between two latitude/longitude coordinates in kilometers.
 * Displays as approximate straight-line distance, not driving distance.
 */

export function calculateHaversineDistance(
  lat1?: number | null,
  lon1?: number | null,
  lat2?: number | null,
  lon2?: number | null
): number {
  if (
    lat1 === undefined || lat1 === null || isNaN(lat1) ||
    lon1 === undefined || lon1 === null || isNaN(lon1) ||
    lat2 === undefined || lat2 === null || isNaN(lat2) ||
    lon2 === undefined || lon2 === null || isNaN(lon2)
  ) {
    return 0;
  }

  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export function formatStraightLineDistance(
  lat1?: number | null,
  lon1?: number | null,
  lat2?: number | null,
  lon2?: number | null
): string {
  if (
    lat1 === undefined || lat1 === null || isNaN(lat1) ||
    lon1 === undefined || lon1 === null || isNaN(lon1) ||
    lat2 === undefined || lat2 === null || isNaN(lat2) ||
    lon2 === undefined || lon2 === null || isNaN(lon2)
  ) {
    return 'Distance unavailable';
  }
  const dist = calculateHaversineDistance(lat1, lon1, lat2, lon2);
  return `${dist} km (straight-line)`;
}

export const calculateDistanceKm = calculateHaversineDistance;

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

