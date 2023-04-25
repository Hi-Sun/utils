
const requestDownloadFile = (downloadUrl: string, filterParam: any) => {
  fetch(downloadUrl, {
    method: 'post',
    //@ts-ignore
    data: { ...filterParam },
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  }).then((res: any) => {
    const url = window.URL.createObjectURL(
      new Blob([res], {
        type: 'application/octet-stream',
      }),
    );
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.setAttribute('download', '商查数据服务.xlsx');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}