/**
 * 
 * @param file image
 * @param params 限制的高宽
 * @returns boolean 是否符合高宽限制
 */
const checkSize: (
  file: File,
  params: Record<'width' | 'height', number>
) => Promise<boolean> = (file, params) => {
  const {width, height} = params;
  return new Promise(function (resolve, reject) {
      let filereader = new FileReader();
      filereader.onload = (e: ProgressEvent<FileReader>) => {
          // @ts-ignore
          let src = e.target.result;
          const image = new Image();
          image.onload = function () {
              if (
                  (this as HTMLImageElement).width > width ||
                  (this as HTMLImageElement).height > height
              ) {
                  // 上传图片的宽高与传递过来的限制宽高作比较，超过限制则调用失败回调
                  resolve(false);
              } else {
                  resolve(true);
              }
          };
          image.onerror = reject;
          image.src = src as string;
      };
      filereader.readAsDataURL(file);
  });
};

export {
  checkSize
}