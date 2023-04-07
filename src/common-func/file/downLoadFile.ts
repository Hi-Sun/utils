import { getFileName, getFileSuffix } from "./getFileNameAndType";

const targetFileUrl = ''; // 目标源文件

const downloadSingleFile = () => {
  const downloadElement = document.createElement('a');
  downloadElement.href = targetFileUrl || '';
  document.body.appendChild(downloadElement);
  downloadElement.click(); //点击下载
  document.body.removeChild(downloadElement); //下载完成移除元素
}

const downloadImageAndFile = (imgUrl: string, fileUrl: string) => {
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
  } else if (fileUrl) {
    const fileName = getFileName(fileUrl);
    const filetype = getFileSuffix(fileUrl);
    // 创建a标签
    const bqa = document.createElement("a");
    // 给a标签的href属性赋值
    bqa.setAttribute("href", fileUrl);
    // 给a标签的download属性赋值,表示下载的文件名
    bqa.setAttribute("download", `${fileName}.${filetype}`);
    // 调用a标签的点击事件
    bqa.click();
    // 移除a标签
    bqa.remove();
  }
};

export {
  downloadSingleFile,
  downloadImageAndFile
}