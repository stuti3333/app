export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const isValidImageUrl = (url) => {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '')
    return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
