import "./App.css";
import { FileImporter } from "./components/fileReader";
import { CreateSample } from "./components/pdfCreator";

function App() {
  return (
    <div className="App">
      <h1>File Converter</h1>
      <FileImporter></FileImporter>
      <CreateSample></CreateSample>
    </div>
  );
}

export default App;
