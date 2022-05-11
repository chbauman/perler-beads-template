import { useState } from "react";
import "./App.css";
import { FileImporter } from "./components/fileReader";
import { PDFCreator } from "./components/pdfCreator";

function App() {
  const [imgH, setImgH] = useState(0);
  const [imgW, setImgW] = useState(0);

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
            value={imgH}
            name="h"
            onChange={(e) => setImgH(parseInt(e.target.value))}
          />
          {" x "}
          <input
            type="number"
            min={0}
            step={1}
            value={imgW}
            name="w"
            onChange={(e) => setImgW(parseInt(e.target.value))}
          />
          {" pixels / beads."}
        </div>
      </div>
      <PDFCreator h={imgH} w={imgW}></PDFCreator>
    </div>
  );
}

export default App;
