// Pexels CDN helper — royalty-free, commercial use OK
export function P(id: number, w = 800, h = 500): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;
}
