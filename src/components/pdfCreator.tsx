import jsPDF from "jspdf";
import { useRef, useState } from "react";
import { mavinImage } from "./fileReader";

const a4SizeMM = [297, 210];
const [a4H, a4W] = a4SizeMM;
const topSpaceMM = 20;

/** Generate Pdf from mavinImage. */
export const generatePdf = (boardSize: number, cellSize: number) => {
  const w = mavinImage.width;
  const h = mavinImage.height;
  if (w === 0 || h === 0) {
    console.debug("Invalid image!");
    return;
  }

  // Board size
  const selectedCellSizeMM = cellSize;
  const halfCellSize = selectedCellSizeMM / 2;
  console.log(boardSize);
  console.assert(a4H > 0);
  const fullSize = boardSize * selectedCellSizeMM;
  const borderSpace = (a4W - fullSize) / 2;
  if (borderSpace < 0) {
    console.debug("Board does not fit on A4 page!");
  }

  // Create PDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: a4SizeMM,
  });

  // Compute number of pages
  const pagesNumberW = Math.ceil(w / boardSize);
  const pagesNumberH = Math.ceil(h / boardSize);
  if (pagesNumberW > 1 || pagesNumberH > 1) {
    console.log("Not yet implemented", `${pagesNumberH} x ${pagesNumberW}`);
  }

  for (let pageIdxH = 0; pageIdxH < pagesNumberH; ++pageIdxH) {
    const hIndexOffset = pageIdxH * boardSize;
    const hMax = Math.min(boardSize, h - hIndexOffset);

    for (let pageIdxW = 0; pageIdxW < pagesNumberW; ++pageIdxW) {
      const wIndexOffset = pageIdxW * boardSize;
      const wMax = Math.min(boardSize, w - wIndexOffset);

      // Add page, header and full rect
      if (pageIdxW !== 0 || pageIdxH !== 0) {
        doc.addPage();
      }
      doc.text("Perler Beads Template", a4W / 2, 10, { align: "center" });
      doc.rect(borderSpace, topSpaceMM, fullSize, fullSize);

      for (let i = 0; i < hMax; ++i) {
        const offsetH = topSpaceMM + i * selectedCellSizeMM;

        for (let k = 0; k < wMax; ++k) {
          const offsetw = borderSpace + k * selectedCellSizeMM;
          const redChan = mavinImage.getIntComponent0(
            k + wIndexOffset,
            i + hIndexOffset
          );
          const greenChan = mavinImage.getIntComponent1(
            k + wIndexOffset,
            i + hIndexOffset
          );
          const blueChan = mavinImage.getIntComponent2(
            k + wIndexOffset,
            i + hIndexOffset
          );
          const alpha = mavinImage.getAlphaComponent(
            k + wIndexOffset,
            i + hIndexOffset
          );
          if (alpha > 0) {
            doc.setFillColor(redChan, greenChan, blueChan);
            doc.circle(
              offsetw + halfCellSize,
              offsetH + halfCellSize,
              halfCellSize * 0.9,
              "FD"
            );
          } else {
            doc.setFillColor(0, 0, 0);
            doc.circle(
              offsetw + halfCellSize,
              offsetH + halfCellSize,
              halfCellSize * 0.2,
              "FD"
            );
          }
          doc.rect(offsetw, offsetH, selectedCellSizeMM, selectedCellSizeMM);
        }
      }
    }
  }

  doc.save("perler-template-chba.pdf");
};

/** PDF file creator component. */
export const PDFCreator = () => {
  const [boardSize, setBoardSize] = useState(30);
  const [cellSize, setCellSize] = useState(5);

  return (
    <>
      <div className="cellSize">
        <label htmlFor="cellSize">Cell Size: </label>
        <input
          type="number"
          min={0}
          step={0.1}
          value={cellSize}
          name="cellSize"
          onChange={(e) => setCellSize(parseFloat(e.target.value))}
        />{" "}
        mm.
      </div>
      <div className="boardSize">
        <label htmlFor="boardSize">Board Size: </label>
        <input
          type="number"
          min={0}
          step={1}
          value={boardSize}
          name="boardSize"
          onChange={(e) => setBoardSize(parseInt(e.target.value))}
        />{" "}
        cells (square).
      </div>
      <button onClick={() => generatePdf(boardSize, cellSize)}>
        Create PDF
      </button>
    </>
  );
};
