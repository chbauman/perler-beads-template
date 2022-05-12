import { useState } from "react";
import "./App.css";
import { FileImporter } from "./components/fileReader";
import { PDFCreator } from "./components/pdfCreator";

function App() {
  const [imgH, setImgH] = useState<string | null>(null);
  const [imgW, setImgW] = useState<string | null>(null);

  const imgHNum = imgH ? parseInt(imgH) : 0;
  const imgWNum = imgW ? parseInt(imgW) : 0;

  const imgDefined = imgH !== null && imgW !== null;

  return (
    <div className="perler-app">
      <h1>Perler Bead Template Generator</h1>
      <p>
        Upload an image and generate a PDF containing a perler bead template.
        Each pixel of the passed image will correspond to one bead in the
        generated PDF. Works well with images created on{" "}
        <a href="https://pixilart.com">pixilart.com</a>.
      </p>
      <FileImporter setImgH={setImgH} setImgW={setImgW}></FileImporter>
      <div>
        <div className="imgSize">
          {"Image Size: "}
          <input
            type="number"
            min={0}
            step={1}
            value={imgH === null ? undefined : imgH}
            name="h"
            onChange={(e) => {
              setImgH(e.target.value);
            }}
            disabled={!imgDefined}
          />
          {" x "}
          <input
            type="number"
            min={0}
            step={1}
            value={imgW === null ? undefined : imgW}
            name="w"
            onChange={(e) => {
              setImgW(e.target.value);
            }}
            disabled={!imgDefined}
          />
          {" pixels / beads."}
        </div>
      </div>
      <PDFCreator h={imgHNum} w={imgWNum}></PDFCreator>
    </div>
  );
}

export default App;
