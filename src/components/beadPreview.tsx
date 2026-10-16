import { useEffect, useRef } from "react";
import { getBead } from "./beads";

const maxCanvasPx = 640;

/** Preview of the resampled image as beads, with the board grid overlaid. */
export const BeadPreview = (props: {
  w: number;
  h: number;
  boardSize: number;
  /** Changes whenever a new image is loaded. */
  imageVersion: number;
}) => {
  const { w, h, boardSize, imageVersion } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const valid = w > 0 && h > 0 && imageVersion > 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !valid) {
      return;
    }
    const style = getComputedStyle(canvas);
    const boardColor = style.getPropertyValue("--board-bg").trim();
    const emptyColor = style.getPropertyValue("--bead-empty").trim();

    const hasBoards = boardSize >= 1;
    const board = hasBoards ? boardSize : Math.max(w, h);
    const boardsW = Math.ceil(w / board);
    const boardsH = Math.ceil(h / board);
    // Gap between boards, as a fraction of a cell.
    const gapFac = 0.8;

    const cell = Math.max(
      4,
      Math.floor(
        maxCanvasPx /
          Math.max(w + (boardsW - 1) * gapFac, h + (boardsH - 1) * gapFac)
      )
    );
    const gap = Math.round(cell * gapFac);
    const posX = (x: number) => x * cell + Math.floor(x / board) * gap;
    const posY = (y: number) => y * cell + Math.floor(y / board) * gap;
    canvas.width = posX(w - 1) + cell;
    canvas.height = posY(h - 1) + cell;

    // One tile per board, i.e. per PDF page.
    ctx.fillStyle = boardColor;
    for (let by = 0; by < boardsH; ++by) {
      for (let bx = 0; bx < boardsW; ++bx) {
        const x0 = posX(bx * board);
        const y0 = posY(by * board);
        const x1 = posX(Math.min((bx + 1) * board, w) - 1) + cell;
        const y1 = posY(Math.min((by + 1) * board, h) - 1) + cell;
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      }
    }

    for (let y = 0; y < h; ++y) {
      for (let x = 0; x < w; ++x) {
        const bead = getBead(w, h, x, y);
        const cx = posX(x) + cell / 2;
        const cy = posY(y) + cell / 2;
        ctx.beginPath();
        if (bead === null) {
          ctx.fillStyle = emptyColor;
          ctx.arc(cx, cy, cell * 0.1, 0, 2 * Math.PI);
        } else {
          ctx.fillStyle = `rgb(${bead.r},${bead.g},${bead.b})`;
          ctx.arc(cx, cy, cell * 0.45, 0, 2 * Math.PI);
        }
        ctx.fill();
      }
    }
  }, [w, h, boardSize, imageVersion, valid]);

  if (!valid) {
    return (
      <div className="preview-empty">
        Choose an image to see its bead preview.
      </div>
    );
  }
  return <canvas ref={canvasRef} className="bead-preview" />;
};
