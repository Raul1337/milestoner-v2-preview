// Above the normal 16px rem, a fixed orbital node cannot guarantee full labels.
// Use a flowing presentation from 125%, without changing normal orbital geometry.
export function usesReadableUniverse(remPixels){return Number.isFinite(remPixels)&&remPixels>=20}
