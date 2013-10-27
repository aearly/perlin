var container = [0, 0, 0];

/* jshint bitwise:false */
function lerp(a, b, t) {
  return (1 - t)  * a + t * b;
}

function generateVectors(width, height) {
  var data = [], i = width * height;
  for (; i; i -= 1) {
    data.push(Math.random() * 255, Math.random() * 255, Math.random() * 255);
  }
  return data;
}

function sampleVectors(x, y, vectors, width) {
  var
    x0 = Math.floor(x),
    x1 = x0 + 1,
    y0 = Math.floor(y),
    y1 = y0 + 1,
    tx = x - x0,
    ty = y - y0,
    dr0 = vectors[(x0 + y0 * width) * 3],
    dg0 = vectors[(x0 + y0 * width) * 3 + 1],
    db0 = vectors[(x0 + y0 * width) * 3 + 2],
    dr1 = vectors[(x1 + y0 * width) * 3],
    dg1 = vectors[(x1 + y0 * width) * 3 + 1],
    db1 = vectors[(x1 + y0 * width) * 3 + 2],
    dr2 = vectors[(x0 + y1 * width) * 3],
    dg2 = vectors[(x0 + y1 * width) * 3 + 1],
    db2 = vectors[(x0 + y1 * width) * 3 + 2],
    dr3 = vectors[(x1 + y1 * width) * 3],
    dg3 = vectors[(x1 + y1 * width) * 3 + 1],
    db3 = vectors[(x1 + y1 * width) * 3 + 2];

  container[0] = lerp(lerp(dr0, dr1, tx), lerp(dr2, dr3, tx), ty);
  container[1] = lerp(lerp(dg0, dg1, tx), lerp(dg2, dg3, tx), ty);
  container[2] = lerp(lerp(db0, db1, tx), lerp(db2, db3, tx), ty);

  return container;
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
    falloff = 1, r, g, b, l;

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

  for (i = 0; i < dataSize; i += 4) {
    r = data[i];
    g = data[i + 1];
    b = data[i + 2];
    //l = r * 0.3 + g * 0.5 + b * 0.2;
    //data[i] = data[i + 1] = data[i + 2] = l;
    /*data[i] = (2 * r + l) / 3;
    data[i + 1] = (2 * g + l) / 3;
    data[i + 2] = (2 * b + l) / 3;*/
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  return data;
};
