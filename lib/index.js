/* jshint bitwise:false */
function lerp(a, b, t) {
  return (1 - t)  * a + t * b;
}

function rand(max) {
  return Math.random() * max;
}

function generateVectors(width, height) {
  var data = [], i = width * height;
  for (; i; i -= 1) {
    data.push([rand(255), rand(255), rand(255)]);
  }
  return data;
}

function sampleVectors(x, y, vectors, width) {
  var
    x0 = Math.floor(x),
    x1 = Math.ceil(x),
    y0 = Math.floor(y),
    y1 = Math.ceil(y),
    tx = x - x0,
    ty = y - y0,
    d0 = vectors[x0 + y0 * width],
    d1 = vectors[x1 + y0 * width],
    d2 = vectors[x0 + y1 * width],
    d3 = vectors[x1 + y1 * width];

  return [
    lerp(lerp(d0[0], d1[0], tx), lerp(d2[0], d3[0], tx), ty),
    lerp(lerp(d0[1], d1[1], tx), lerp(d2[1], d3[1], tx), ty),
    lerp(lerp(d0[2], d1[2], tx), lerp(d2[2], d3[2], tx), ty)
  ];
}

module.exports = function perlin(options) {
  options = options || {};

  var
    i,
    width = options.width || 1024,
    height = options.height || 1024,
    dataSize = width * height * 4,
    data = options.data || [],
    freq = 64,
    falloff = 1;

  // init array
  for (i = 0; i < dataSize; i += 1) { data[i] = 0; }

  function iterate() {
    var freqW = width / freq + 1,
      freqH = height / freq + 1,
      vectors = generateVectors(freqW, freqH),
      x, y, a, d, er, eg, eb;

    for (i = 0; i < dataSize; i += 4) {
      x = ((i >> 2) % width) / freq;
      y = Math.floor((i >> 2) / width) / freq;
      d = sampleVectors(x, y, vectors, freqW);
      er = data[i];
      eg = data[i + 1];
      eb = data[i + 2];
      a = data[i + 3];
      if (a) {
        //blend
        data[i] = lerp(d[0], er, 1 / (1 + falloff));
        data[i + 1] = lerp(d[1], eg, 1 / (1 + falloff));
        data[i + 2] = lerp(d[2], eb, 1 / (1 + falloff));
      } else {
        data[i] = d[0];
        data[i + 1] = d[1];
        data[i + 2] = d[2];
        data[i + 3] = 255;
      }
    }
  }

  while (freq >= 1) {
    iterate();
    freq /= 2;
    falloff /= 1.8;
  }

  return data;
};
