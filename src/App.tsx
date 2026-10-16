import { useState } from "react";
import "./App.css";
import { BeadPreview } from "./components/beadPreview";
import { FileImporter } from "./components/fileReader";
import { PDFCreator } from "./components/pdfCreator";

const NumberField = (props: {
  id: string;
  label: string;
  unit: string;
  value: string;
  step: number;
  disabled?: boolean;
  onChange: (value: string) => void;
}) => (
  <div className="field">
    <label htmlFor={props.id}>{props.label}</label>
    <div className="field-input">
      <input
        type="number"
        id={props.id}
        min={0}
        step={props.step}
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <span className="unit">{props.unit}</span>
    </div>
  </div>
);

function App() {
  const [imgH, setImgH] = useState("");
  const [imgW, setImgW] = useState("");
  const [imageVersion, setImageVersion] = useState(0);
  const [boardSize, setBoardSize] = useState("30");
  const [cellSize, setCellSize] = useState("5");

  const imgHNum = parseInt(imgH) || 0;
  const imgWNum = parseInt(imgW) || 0;
  const imgDefined = imageVersion > 0;

  return (
    <div className="perler-app">
      <header>
        <h1>Perler Bead Template Generator</h1>
        <p>
          Upload an image and generate a PDF containing a perler bead template.
          Each pixel of the image becomes one bead. Works well with images
          created on <a href="https://pixilart.com">pixilart.com</a>.
        </p>
      </header>
      <main>
        <aside className="controls">
          <section className="card">
            <h2>Image</h2>
            <FileImporter
              onLoad={(w, h) => {
                setImgW(`${w}`);
                setImgH(`${h}`);
                setImageVersion((v) => v + 1);
              }}
            />
            <div className="field-row">
              <NumberField
                id="imgW"
                label="Width"
                unit="beads"
                value={imgW}
                step={1}
                disabled={!imgDefined}
                onChange={setImgW}
              />
              <NumberField
                id="imgH"
                label="Height"
                unit="beads"
                value={imgH}
                step={1}
                disabled={!imgDefined}
                onChange={setImgH}
              />
            </div>
          </section>
          <section className="card">
            <h2>Board</h2>
            <div className="field-row">
              <NumberField
                id="boardSize"
                label="Board size"
                unit="cells"
                value={boardSize}
                step={1}
                onChange={setBoardSize}
              />
              <NumberField
                id="cellSize"
                label="Cell size"
                unit="mm"
                value={cellSize}
                step={0.1}
                onChange={setCellSize}
              />
            </div>
            <PDFCreator
              w={imgDefined ? imgWNum : 0}
              h={imgDefined ? imgHNum : 0}
              boardSize={parseInt(boardSize)}
              cellSize={parseFloat(cellSize)}
            />
          </section>
        </aside>
        <section className="card preview">
          <h2>Preview</h2>
          <BeadPreview
            w={imgWNum}
            h={imgHNum}
            boardSize={parseInt(boardSize)}
            imageVersion={imageVersion}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
