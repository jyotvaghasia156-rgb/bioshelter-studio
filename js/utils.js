/**
 * BioShelter Studio - Shared Utility Functions
 * BUG-01 FIX: Centralized azimuth label to prevent diverging copy-paste logic.
 */

/**
 * Converts a compass azimuth in degrees to a human-readable cardinal direction label.
 * @param {number} az - Azimuth degrees (0–360)
 * @returns {string} e.g. "180° (True Solar South (Optimal))"
 */
export function formatAzimuthLabel(az) {
  let card;
  if (az === 180)                      card = 'True Solar South (Optimal)';
  else if (az > 170 && az < 190)       card = 'South';
  else if (az >= 150 && az <= 170)     card = 'SSE (Morning Warm-Up)';
  else if (az >= 120 && az < 150)      card = 'South-East';
  else if (az >= 70 && az < 120)       card = 'Due East';
  else if (az > 190 && az <= 210)      card = 'SSW (Evening Heat)';
  else if (az > 210 && az <= 240)      card = 'South-West';
  else if (az > 240 && az <= 290)      card = 'Due West';
  else if (az > 290 && az <= 340)      card = 'North-West';
  else if (az >= 20 && az < 70)        card = 'North-East';
  else                                  card = 'Due North';
  return `${az}° (${card})`;
}
