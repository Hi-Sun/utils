export const parseRGBA = (val: string) => {
  const argb: any = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val) || {};
  const color = {
    r: parseInt(argb?.[1], 16),
    g: parseInt(argb?.[2], 16),
    b: parseInt(argb?.[3], 16),
    a: parseInt(argb?.[4], 16) / 255,
  };

  return `rgba(${color?.r}, ${color.g}, ${color.b}, ${color?.a?.toFixed(1)})`;
};