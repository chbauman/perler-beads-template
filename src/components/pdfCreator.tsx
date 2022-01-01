import jsPDF from "jspdf";
import { mavinImage } from "./fileReader";

const a4SizeMM = [297, 210];
const [a4H, a4W] = a4SizeMM;
const cellSizeMM = 5;
const topSpaceMM = 20;

export const generatePdf = () => {
  const w = mavinImage.width;
  const h = mavinImage.height;
  if (w === 0 || h === 0) {
    console.debug("Invalid image!");
    return;
  }

  console.assert(a4H > 0);

  const borderSpace = (a4W - w * cellSizeMM) / 2;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: a4SizeMM,
  });
  doc.text("Perler Beads Template", a4W / 2, 10, { align: "center" });

  for (let i = 0; i < h; ++i) {
    const offsetH = borderSpace + i * cellSizeMM;

    for (let k = 0; k < w; ++k) {
      const offsetw = topSpaceMM + k * cellSizeMM;
      const redChan = mavinImage.getIntComponent0(i, k);
      const greenChan = mavinImage.getIntComponent1(i, k);
      const blueChan = mavinImage.getIntComponent2(i, k);
      const alpha = mavinImage.getAlphaComponent(i, k);
      if (alpha > 0) {
        doc.setFillColor(redChan, greenChan, blueChan);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.rect(offsetH, offsetw, cellSizeMM, cellSizeMM, "FD");
    }
  }

  doc.save("a4.pdf");
};

export const CreateSample = () => {
  return <button onClick={() => generatePdf()}>Create PDF</button>;
};
