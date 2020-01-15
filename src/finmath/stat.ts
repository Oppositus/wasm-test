export function sum(array: Float32Array): number {
  let s = 0.0;
  const length = array.length;

  for (let i = 0; i < length; ++i) {
    s += array[i];
  }

  return s;
}

export function average(array: Float32Array): number {
  return sum(array) / array.length;
}

export function stdev(array: Float32Array): number {
  const avr = average(array);
  let s = 0.0;
  const length = array.length;

  for (let i = 0; i < length; ++i) {
    const d = array[i] - avr;
    s += d * d;
  }

  return Math.sqrt((1.0 / (length - 1)) * s);
}

export function correlate(array1: Float32Array, array2: Float32Array): number {
  const len = array1.length;

  if (array2.length !== len) {
    return NaN;
  }

  const avr1 = average(array1);
  const avr2 = average(array2);

  let s12 = 0.0;
  let s1sq = 0.0;
  let s2sq = 0.0;

  for (let i = 0; i < len; ++i) {
    const d1 = array1[i] - avr1;
    const d2 = array2[i] - avr2;

    s12 += d1 * d2;
    s1sq += d1 * d1;
    s2sq += d2 * d2;
  }

  return s12 / Math.sqrt(s1sq * s2sq);
}
