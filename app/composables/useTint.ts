// The ground for a tile that has no photograph: one quiet neutral, so a missing
// image reads as a deliberate placeholder and does not compete with real photos.
export const tintFor = (_seed: string | number): string => '#F1F2F5'

/** First letter or digit of a name, for the tile of something with no photograph. */
export const initialOf = (name: string): string => (name.trim().match(/[a-z0-9]/i)?.[0] ?? '').toUpperCase()
