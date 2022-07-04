/**
 * 获取年月日字符串（本地时区）
 * @param {number | string | Date} [time] - 指定时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @param {string} [separator] - 分隔符，默认为 `-`。
 * @returns {string} - 年月日字符串，默认格式为 `YYYY-MM-DD`。
 */
const getYMD = (
  time?: number | string | Date,
  separator: string = '-'
): string => {
  const d = time ? new Date(time) : new Date();
  return [
    d.getFullYear(),
    preZero(d.getMonth() + 1),
    preZero(d.getDate()),
  ].join(separator);
};

/**
 * 获取时分秒字符串（本地时区）
 * @param {number | string | Date} [time] - 指定时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @param {string} [separator] - 分隔符，默认为 `:`。
 * @returns {string} - 时分秒字符串，默认格式为 `HH:mm:ss`。
 */
const getHMS = (
  time?: number | string | Date,
  separator: string = ':'
): string => {
  const d = time ? new Date(time) : new Date();
  return [
    preZero(d.getHours()),
    preZero(d.getMinutes()),
    preZero(d.getSeconds()),
  ].join(separator);
};

/**
 * 获取包含年月日周时分秒的对象（本地时区）
 * @param {number | string | Date} [time] - 指定时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @returns {object} - 包含年月日周时分秒的对象。
 */
const getDateTime = (
  time?: number | string | Date
): {
  year: number;
  month: number;
  date: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} => {
  const d = time ? new Date(time) : new Date();
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    date: d.getDate(),
    day: d.getDay(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds(),
  };
};

/**
 * 获取指定天数后 0 时的时间对象（本地时区）
 * @param {number} [days] - 天数，默认为 1。
 * @param {number | string | Date} [time] - 起始时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @returns {Date} - 指定天数后 0 时的时间对象。
 */
const getNextNDaysT0 = (days: number = 1, time?: number | string | Date): Date => {
  const nextTime = time ? new Date(time) : new Date();
  nextTime.setDate(nextTime.getDate() + days);
  nextTime.setHours(0, 0, 0, 0);
  return nextTime;
};

/**
 * 获取次日 0 时的时间对象（本地时区）
 * @param {number | string | Date} [time] - 起始时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @returns {Date} - 次日 0 时的时间对象。
 */
const getNextDayT0 = (time?: number | string | Date): Date => {
  return getNextNDaysT0(1, time);
};

/**
 * 在个位数前补 0
 * @param {number | string} num - 数值
 * @returns {string} - 补 0 后的字符串
 */
const preZero = (num: number | string): string => {
  return (num < 10 ? '0' : '') + num;
};

export {
  getYMD,
  getHMS,
  getDateTime,
  getNextNDaysT0,
  getNextDayT0,
  preZero
}