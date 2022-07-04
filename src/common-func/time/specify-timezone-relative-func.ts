/**
 * [私有] 输出除时区外，其他数值和指定时区时间一致的 UTC 时间对象
 * @private
 * @param {number | string | Date} [time] - 指定时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @param {number} timeZone - 指定时区
 * @returns {Date} - 除时区外，其他数值和指定时区时间一致的 UTC 时间对象
 */
const _getTmpUTCDate = (time?: number | string | Date, timeZone: number = 8): Date => {
  const d = time ? new Date(time) : new Date();
  d.setUTCHours(d.getUTCHours() + timeZone);
  return d;
};

/**
 * 获取指定时区的年月日字符串
 * @param {number | string | Date} [time] - 指定时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @param {number} [timeZone] - 指定时区，默认为 8。
 * @param {string} [separator] - 分隔符，默认为 `-`。
 * @returns {string} - 年月日字符串，默认格式为 `YYYY-MM-DD`。
 */
const getTzYMD = (
  time?: number | string | Date,
  timeZone: number = 8,
  separator: string = '-'
): string => {
  const d = _getTmpUTCDate(time, timeZone);
  return [
    d.getUTCFullYear(),
    preZero(d.getUTCMonth() + 1),
    preZero(d.getUTCDate()),
  ].join(separator);
};

/**
 * 获取指定时区的时分秒字符串
 * @param {number | string | Date} [time] - 指定时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @param {number} [timeZone] - 指定时区，默认为 8。
 * @param {string} [separator] - 分隔符，默认为 `:`。
 * @returns {string} - 时分秒字符串，默认格式为 `HH:mm:ss`。
 */
const getTzHMS = (
  time?: number | string | Date,
  timeZone: number = 8,
  separator: string = ':'
): string => {
  const d = _getTmpUTCDate(time, timeZone);
  return [
    preZero(d.getUTCHours()),
    preZero(d.getUTCMinutes()),
    preZero(d.getUTCSeconds()),
  ].join(separator);
};

/**
 * 获取指定时区包含年月日周时分秒的对象
 * @param {number | string | Date} [time] - 指定时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @param {number} [timeZone] - 指定时区，默认为 8。
 * @returns {object} - 包含年月日周时分秒的对象。
 */
const getTzDateTime = (
  time?: number | string | Date,
  timeZone: number = 8
): {
  year: number;
  month: number;
  date: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} => {
  const d = _getTmpUTCDate(time, timeZone);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    date: d.getUTCDate(),
    day: d.getUTCDay(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
  };
};

/**
 * 获取指定时区指定天数后 0 时的时间对象
 * @param {number} [days] - 天数，默认为 1。
 * @param {number | string | Date} [time] - 起始时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @param {number} [timeZone] - 指定时区，默认为 8。
 * @returns {Date} - 指定天数后 0 时的时间对象。
 */
const getTzNextNDaysT0 = (
  days: number = 1,
  time?: number | string | Date,
  timeZone: number = 8
): Date => {
  const nextTime = time ? new Date(time) : new Date();
  const t0UTCHours = 24 - timeZone;
  const dateAdjust = days - (nextTime.getUTCHours() < t0UTCHours ? 1 : 0);
  dateAdjust && nextTime.setUTCDate(nextTime.getUTCDate() + dateAdjust);
  nextTime.setUTCHours(t0UTCHours, 0, 0, 0);
  return nextTime;
};

/**
 * 获取指定时区次日 0 时的时间对象
 * @param {number | string | Date} [time] - 起始时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @returns {Date} - 次日 0 时的时间对象。
 */
const getTzNextDayT0 = (time?: number | string | Date, timeZone: number = 8): Date => {
  return getTzNextNDaysT0(1, time, timeZone);
};

/**
 * 根据本地时间到 UTC 的偏移获取本地时区
 * @returns {string} - 本地时区，格式：UTC+08:00
 */
const getTimezone = (): string => {
  const offset = new Date().getTimezoneOffset();
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  return `UTC${offset < 0 ? '+' : '-'}${preZero(hours)}:${preZero(minutes)}`;
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
  _getTmpUTCDate,
  getTzYMD,
  getTzHMS,
  getTzDateTime,
  getTzNextNDaysT0,
  getTzNextDayT0,
  getTimezone,
  preZero
}
