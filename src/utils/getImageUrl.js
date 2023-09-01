module.exports = function getImageUrl(obj) {
  if (obj?.url && obj?.seed) {
    return `${obj.url}?v=${obj.seed}`;
  }
  return obj?.url;
};