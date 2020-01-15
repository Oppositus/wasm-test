#include <math.h>

#define WASM_EXPORT __attribute__((visibility("default")))

WASM_EXPORT
float sum(float array[], int length) {
  float s = 0.0;

  for (int i = 0; i < length; ++i) {
    s += array[i];
  }

  return s;
}

WASM_EXPORT
float average(float array[], int length) {
  return sum(array, length) / length;
}

WASM_EXPORT
float stdev(float array[], int length) {
  float avr = average(array, length);
  float s = 0.0;

  for (int i = 0; i < length; ++i) {
    float d = array[i] - avr;
    s += d * d;
  }

  return sqrtf((1.0 / (length - 1)) * s);
}

WASM_EXPORT
float covar(float array1[], int length1, float array2[], int length2) {
  if (length1 != length2) {
    return NAN;
  }

  float avr1 = average(array1, length1);
  float avr2 = average(array2, length2);

  float s12 = 0.0;

  for (int i = 0; i < length1; ++i) {
    s12 += (array1[i] - avr1) * (array2[i] - avr2);
  }

  return s12 / length1;
}

WASM_EXPORT
float correlate(float array1[], int length1, float array2[], int length2) {
  if (length1 != length2) {
    return NAN;
  }

  float avr1 = average(array1, length1);
  float avr2 = average(array2, length2);

  float s12 = 0.0;
  float s1sq = 0.0;
  float s2sq = 0.0;

  for (int i = 0; i < length1; ++i) {
    float d1 = array1[i] - avr1;
    float d2 = array2[i] - avr2;

    s12 += d1 * d2;
    s1sq += d1 * d1;
    s2sq += d2 * d2;
  }

  return s12 / sqrtf(s1sq * s2sq);
}
