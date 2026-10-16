import { Marvin, MarvinImage } from "marvinj-ts";

const canvasId = "canvas-img";
const canvasH = 200;

export const marvinImage = new MarvinImage();

export const getCanvas = () =>
  document.getElementById(canvasId) as HTMLCanvasElement;

export const FileImporter = (props: {
  setImgW: (w: string) => void;
  setImgH: (h: string) => void;
}) => {
  let fileReader: FileReader | null = null;

  const handleRead = () => {
    if (fileReader === null) {
      return;
    }
    const previewCanvas = getCanvas();
    const dataURL = fileReader.result as string;

    const imageLoaded = () => {
      props.setImgW(`${marvinImage.width}`);
      props.setImgH(`${marvinImage.height}`);
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
    <>
      <div className="upload-file">
        <input
          type="file"
          id="file"
          className="input-file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => handleChosenFile(e.target.files?.[0])}
        ></input>
      </div>
      <div>
        <canvas id={canvasId} width={canvasH} height={canvasH}></canvas>
      </div>
    </>
  );
};
