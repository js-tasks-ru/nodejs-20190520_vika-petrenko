function sum(a, b) {
  if (!parseFloat(a) || !parseFloat(b)) {
      throw new TypeError('Arguments are not number');
  }
  return a + b;
}

module.exports = sum;
