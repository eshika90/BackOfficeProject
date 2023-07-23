const parseCookies = (cookieString) => {
  const cookieObject = {};

  if (cookieString) {
    const cookieArray = cookieString.split(';');

    for (const cookie of cookieArray) {
      const [key, value] = cookie.trim().split('=');
      cookieObject[key] = decodeURIComponent(value);
    }
  }

  return cookieObject;
};
module.exports = parseCookies;
