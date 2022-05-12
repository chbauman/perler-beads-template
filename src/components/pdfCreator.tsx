import jsPDF from "jspdf";
import { useState } from "react";
import { mavinImage } from "./fileReader";

const a4SizeMM = [297, 210];
const [a4H, a4W] = a4SizeMM;
const topSpaceMM = 20;

type OptionalWarning = null | string;
type ImgSize = { h: number | null; w: number | null };
type ImgInfo = {
  h: number;
  w: number;
  fullSize: number;
  borderSpace: number;
  totNPages: number;
};

const getInfo = (
  boardSize: number,
  selectedCellSizeMM: number,
  imgSize: ImgSize
) => {
  const { h, w } = imgSize;
  if (h === null || w === null) {
    return { warning: null, info: null };
  }
  const info: ImgInfo = { h, w, fullSize: 0, borderSpace: 0, totNPages: 0 };
  let warning: OptionalWarning = null;
  if (w === 0 || h === 0) {
    warning = "Invalid image!";
    return { warning, info };
  }

  console.assert(a4H > 0);
  const fullSize = boardSize * selectedCellSizeMM;
  const borderSpace = (a4W - fullSize) / 2;
  if (borderSpace < 0) {
    warning = "Board does not fit on A4 page!";
  }
  const pagesNumberW = Math.ceil(w / boardSize);
  const pagesNumberH = Math.ceil(h / boardSize);
  const totNPages = pagesNumberW * pagesNumberH;

  info.fullSize = fullSize;
  info.borderSpace = borderSpace;
  info.totNPages = totNPages;

  return { warning, info };
};

/** Generate Pdf from mavinImage. */
export const generatePdf = (
  boardSize: number,
  selectedCellSizeMM: number,
  info: ImgInfo,
  warning: OptionalWarning
) => {
  if (warning !== null) {
    console.log(warning);
    return;
  }

  const { w, h, fullSize, borderSpace } = info;

  // Create PDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: a4SizeMM,
  });

  // Compute number of pages
  const pagesNumberW = Math.ceil(w / boardSize);
  const pagesNumberH = Math.ceil(h / boardSize);

  const resFacW = mavinImage.width / w;
  const resFacH = mavinImage.height / h;

  const halfCellSize = selectedCellSizeMM / 2;
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
        const hResampled = i + hIndexOffset;
        const hOrig = Math.round(resFacH * (hResampled + 0.5) - 0.5);

        for (let k = 0; k < wMax; ++k) {
          const offsetw = borderSpace + k * selectedCellSizeMM;
          const wRes = k + wIndexOffset;
          const wOrig = Math.round(resFacW * (wRes + 0.5) - 0.5);

          const redChan = mavinImage.getIntComponent0(wOrig, hOrig);
          const greenChan = mavinImage.getIntComponent1(wOrig, hOrig);
          const blueChan = mavinImage.getIntComponent2(wOrig, hOrig);
          const alpha = mavinImage.getAlphaComponent(wOrig, hOrig);
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
export const PDFCreator = (props: ImgSize) => {
  const [boardSize, setBoardSize] = useState(30);
  const [cellSize, setCellSize] = useState(5);

  const { warning, info } = getInfo(boardSize, cellSize, props);
  const warnComp = warning && <div>WARNING: {warning}</div>;

  let generateComp = null;
  if (info !== null) {
    generateComp = (
      <>
        {" "}
        <div>Total: {info.totNPages} pages</div>
        <button onClick={() => generatePdf(boardSize, cellSize, info, warning)}>
          Create PDF
        </button>
      </>
    );
  }

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
      {generateComp}
      {warnComp}
    </>
  );
};
