import { marvinImage } from "./fileReader";

export type Bead = { r: number; g: number; b: number } | null;

/**
 * Bead at position (x, y) of the image resampled to w x h beads
 * (nearest neighbour). Returns null for transparent pixels.
 */
export const getBead = (w: number, h: number, x: number, y: number): Bead => {
  const xOrig = Math.round((marvinImage.width / w) * (x + 0.5) - 0.5);
  const yOrig = Math.round((marvinImage.height / h) * (y + 0.5) - 0.5);
  if (marvinImage.getAlphaComponent(xOrig, yOrig) === 0) {
    return null;
  }
  return {
    r: marvinImage.getIntComponent0(xOrig, yOrig),
    g: marvinImage.getIntComponent1(xOrig, yOrig),
    b: marvinImage.getIntComponent2(xOrig, yOrig),
  };
};
