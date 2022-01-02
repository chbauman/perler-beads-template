import "./App.css";
import { FileImporter } from "./components/fileReader";
import { PDFCreator } from "./components/pdfCreator";

function App() {
  return (
    <div className="App">
      <h1>Perler Bead Template Generator</h1>
      <p>
        Upload an image and generate a PDF containing a perler bead template.
        Each pixel of the passed image will correspond to one perl in the
        generated PDF. Works well with images created on{" "}
        <a href="https://pixilart.com">pixilart.com</a>.
      </p>
      <FileImporter></FileImporter>
      <PDFCreator></PDFCreator>
    </div>
  );
}

export default App;
