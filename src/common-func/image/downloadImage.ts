import { getFileName } from "../file/getFileNameAndType";

const downloadImage = (imgUrl: string) => {
  if (imgUrl) {
    const fileName = getFileName(imgUrl);
    const image = new Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx && ctx.drawImage(image, 0, 0, image.width, image.height);
      const url = canvas.toDataURL("image/png");
      const aEle = document.createElement("a");
      aEle.download = fileName;
      aEle.href = url;
      aEle.click();
    };
    image.src = imgUrl;
  }
};

export {
  downloadImage
}