module.exports.Guid = () => {
  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  return s4();
};

module.exports.isNumber = (n) => {
  return !isNaN(+n) && isFinite(n)
};