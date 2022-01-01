import { MarvinImage } from "marvinj-ts";

const canvasId = "canvas-img";

export const mavinImage = new MarvinImage();

export const getCanvas = () =>
  document.getElementById(canvasId) as HTMLCanvasElement;

export const FileImporter = () => {
  let fileReader: FileReader | null = null;

  const handleRead = (e: any) => {
    if (fileReader === null) {
      return;
    }
    console.log(e);
    const output = getCanvas();
    const dataURL = fileReader!.result as string;

    const imageLoaded = () => {
      mavinImage.draw(output, 0, 0, 0);
    };

    mavinImage.load(dataURL, imageLoaded);
  };

  const handleChosenFile = (file: any) => {
    if (file) {
      console.log("Chosen: ", file);
      fileReader = new FileReader();
      fileReader.onloadend = handleRead;
      fileReader.readAsDataURL(file);
    } else {
      fileReader = null;
    }
  };

  return (
    <>
      <div className="upload-expense">
        <input
          type="file"
          id="file"
          className="input-file"
          accept=".jpg,.jpeg,.png"
          onChange={(e: any) => handleChosenFile(e.target.files[0])}
        ></input>
      </div>
      <div>
        <canvas id={canvasId} width="200" height="200"></canvas>
      </div>
    </>
  );
};
