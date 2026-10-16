import { Marvin, MarvinImage } from "marvinj-ts";

const canvasId = "canvas-img";
const canvasH = 120;

export const marvinImage = new MarvinImage();

export const getCanvas = () =>
  document.getElementById(canvasId) as HTMLCanvasElement;

export const FileImporter = (props: {
  onLoad: (w: number, h: number) => void;
}) => {
  let fileReader: FileReader | null = null;

  const handleRead = () => {
    if (fileReader === null) {
      return;
    }
    const dataURL = fileReader.result as string;

    const imageLoaded = () => {
      props.onLoad(marvinImage.width, marvinImage.height);
      const previewCanvas = getCanvas();
      const newWidth = Math.round(
        (marvinImage.width / marvinImage.height) * canvasH
      );
      const rescaledImage = new MarvinImage();
      Marvin.scale(marvinImage, rescaledImage, newWidth, canvasH);
      previewCanvas.setAttribute("width", `${newWidth}`);
      rescaledImage.draw(previewCanvas, 0, 0, 0);
    };

    marvinImage.load(dataURL, imageLoaded);
  };

  const handleChosenFile = (file: File | undefined) => {
    if (file) {
      fileReader = new FileReader();
      fileReader.onloadend = handleRead;
      fileReader.readAsDataURL(file);
    } else {
      fileReader = null;
    }
  };

  return (
    <div className="file-importer">
      <label className="file-button" htmlFor="file">
        Choose image
      </label>
      <input
        type="file"
        id="file"
        className="file-input"
        accept=".jpg,.jpeg,.png"
        onChange={(e) => handleChosenFile(e.target.files?.[0])}
      />
      <canvas id={canvasId} width={canvasH} height={canvasH}></canvas>
    </div>
  );
};
