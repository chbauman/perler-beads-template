import jsPDF from "jspdf";
import { getBead } from "./beads";

const a4SizeMM = [297, 210];
const [, a4W] = a4SizeMM;
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
  if (!(boardSize >= 1) || !(selectedCellSizeMM > 0)) {
    warning = "Board size and cell size must be positive!";
    return { warning, info };
  }

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

/** Generate Pdf from marvinImage. */
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

        for (let k = 0; k < wMax; ++k) {
          const offsetw = borderSpace + k * selectedCellSizeMM;
          const bead = getBead(w, h, k + wIndexOffset, i + hIndexOffset);
          if (bead !== null) {
            doc.setFillColor(bead.r, bead.g, bead.b);
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

/** Summary and download button for the PDF. */
export const PDFCreator = (props: {
  w: number;
  h: number;
  boardSize: number;
  cellSize: number;
}) => {
  const { w, h, boardSize, cellSize } = props;
  const { warning, info } = getInfo(boardSize, cellSize, { w, h });

  return (
    <div className="pdf-export">
      {info !== null && (
        <div className="pdf-summary">
          {info.totNPages} {info.totNPages === 1 ? "page" : "pages"}
        </div>
      )}
      {warning && <div className="warning">{warning}</div>}
      <button
        className="primary"
        disabled={info === null || warning !== null}
        onClick={() => info && generatePdf(boardSize, cellSize, info, warning)}
      >
        Create PDF
      </button>
    </div>
  );
};
