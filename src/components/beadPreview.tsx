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
    const boardColor = style.getPropertyValue("--board-line").trim();
    const emptyColor = style.getPropertyValue("--bead-empty").trim();

    const cell = Math.max(4, Math.floor(maxCanvasPx / Math.max(w, h)));
    canvas.width = w * cell;
    canvas.height = h * cell;

    for (let y = 0; y < h; ++y) {
      for (let x = 0; x < w; ++x) {
        const bead = getBead(w, h, x, y);
        const cx = (x + 0.5) * cell;
        const cy = (y + 0.5) * cell;
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

    // Board boundaries: each board is one page in the PDF.
    if (boardSize >= 1) {
      ctx.strokeStyle = boardColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = boardSize; x < w; x += boardSize) {
        ctx.moveTo(x * cell, 0);
        ctx.lineTo(x * cell, canvas.height);
      }
      for (let y = boardSize; y < h; y += boardSize) {
        ctx.moveTo(0, y * cell);
        ctx.lineTo(canvas.width, y * cell);
      }
      ctx.stroke();
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
