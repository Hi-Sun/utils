// import 'core-js/stable/url';
const WINDOW = (typeof window !== 'undefined' ? window : {}) as Window;

const getFullUrl = (url: string | URL, base: string | URL | undefined = WINDOW.location?.href) => {
  return url ? new URL(url, base).href : '';
};

export default getFullUrl;
