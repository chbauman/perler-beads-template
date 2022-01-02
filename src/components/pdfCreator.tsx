import jsPDF from "jspdf";
import { useRef } from "react";
import { mavinImage } from "./fileReader";

const a4SizeMM = [297, 210];
const [a4H, a4W] = a4SizeMM;
const defaultCellSizeMM = 5;
const topSpaceMM = 20;

/** Generate Pdf from mavinImage. */
export const generatePdf = (
  inputEl: HTMLInputElement | null,
  cellSizeInputEl: HTMLInputElement | null
) => {
  const w = mavinImage.width;
  const h = mavinImage.height;
  if (w === 0 || h === 0) {
    console.debug("Invalid image!");
    return;
  }

  // Board size
  const boardSize = inputEl ? Math.round(parseFloat(inputEl.value)) : -1;
  const selectedCellSizeMM = cellSizeInputEl
    ? parseFloat(cellSizeInputEl.value)
    : defaultCellSizeMM;
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
        const offsetH = borderSpace + i * selectedCellSizeMM;

        for (let k = 0; k < wMax; ++k) {
          const offsetw = topSpaceMM + k * selectedCellSizeMM;
          const redChan = mavinImage.getIntComponent0(
            i + hIndexOffset,
            k + wIndexOffset
          );
          const greenChan = mavinImage.getIntComponent1(
            i + hIndexOffset,
            k + wIndexOffset
          );
          const blueChan = mavinImage.getIntComponent2(
            i + hIndexOffset,
            k + wIndexOffset
          );
          const alpha = mavinImage.getAlphaComponent(
            i + hIndexOffset,
            k + wIndexOffset
          );
          if (alpha > 0) {
            doc.setFillColor(redChan, greenChan, blueChan);
          } else {
            doc.setFillColor(255, 255, 255);
          }
          doc.rect(
            offsetH,
            offsetw,
            selectedCellSizeMM,
            selectedCellSizeMM,
            "FD"
          );
        }
      }
    }
  }

  doc.save("perler-template-chba.pdf");
};

/** PDF file creator component. */
export const PDFCreator = () => {
  const boardSizeInputRef = useRef(null);
  const cellSizeInputRef = useRef(null);

  return (
    <>
      <div className="cellSize">
        <label htmlFor="cellSize">Cell Size: </label>
        <input
          type="number"
          min={0}
          defaultValue={5}
          step={0.1}
          name="cellSize"
          ref={cellSizeInputRef}
        />{" "}
        mm.
      </div>
      <div className="boardSize">
        <label htmlFor="boardSize">Board Size: </label>
        <input
          type="number"
          min={0}
          step={1}
          defaultValue={30}
          name="boardSize"
          ref={boardSizeInputRef}
        />{" "}
        cells (square).
      </div>
      <button
        onClick={() =>
          generatePdf(boardSizeInputRef.current, cellSizeInputRef.current)
        }
      >
        Create PDF
      </button>
    </>
  );
};