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

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: a4SizeMM,
  });
  doc.text("Perler Beads Template", a4W / 2, 10, { align: "center" });

  const fullSize = boardSize * selectedCellSizeMM;
  const borderSpace = (a4W - fullSize) / 2;
  doc.rect(borderSpace, topSpaceMM, fullSize, fullSize);

  for (let i = 0; i < h; ++i) {
    const offsetH = borderSpace + i * selectedCellSizeMM;

    for (let k = 0; k < w; ++k) {
      const offsetw = topSpaceMM + k * selectedCellSizeMM;
      const redChan = mavinImage.getIntComponent0(i, k);
      const greenChan = mavinImage.getIntComponent1(i, k);
      const blueChan = mavinImage.getIntComponent2(i, k);
      const alpha = mavinImage.getAlphaComponent(i, k);
      if (alpha > 0) {
        doc.setFillColor(redChan, greenChan, blueChan);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.rect(offsetH, offsetw, selectedCellSizeMM, selectedCellSizeMM, "FD");
    }
  }

  doc.save("a4.pdf");
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
        cells.
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
