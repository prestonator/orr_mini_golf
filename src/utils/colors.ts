export const PLOT_PALETTE = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#0EA5E9', // Sky
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#D946EF', // Fuchsia
  '#EC4899', // Pink
  '#F43F5E', // Rose
];

export function getDeterministicColor(userId?: string | null): string {
  if (!userId) {
    return '#3B82F6'; // Default fallback color
  }

  let hash = 5381;
  for (let i = 0; i < userId.length; i++) {
    // DJB2 hash algorithm
    hash = (hash * 33) ^ userId.charCodeAt(i);
  }

  // Ensure positive integer and wrap within palette length
  const index = Math.abs(hash) % PLOT_PALETTE.length;
  
  return PLOT_PALETTE[index];
}
