export const KAABA = { lat: 21.4225, lon: 39.8262 };

function toRad(d: number) {
  return (d * Math.PI) / 180;
}
function toDeg(r: number) {
  return (r * 180) / Math.PI;
}

/** Great-circle initial bearing (degrees, 0-360) from (lat, lon) to the Kaaba. */
export function qiblaBearing(lat: number, lon: number): number {
  const phiK = toRad(KAABA.lat);
  const lambdaK = toRad(KAABA.lon);
  const phi = toRad(lat);
  const lambda = toRad(lon);
  const psi = toDeg(
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    )
  );
  return (psi + 360) % 360;
}

const COMPASS_DIRS = ["Utara", "Timur Laut", "Timur", "Tenggara", "Selatan", "Barat Daya", "Barat", "Barat Laut"];

export function compassLabel(deg: number): string {
  return COMPASS_DIRS[Math.round(deg / 45) % 8];
}
