var perlin = require("./index");

module.exports = function (selector) {
  var
    canvas = document.querySelectorAll(selector)[0],
    ctx = canvas.getContext("2d"),
    image = ctx.createImageData(1024, 1024);

  perlin({
    width: 1024,
    height: 1024,
    data: image.data
  });

  /*data.forEach(function (octet, i) {
    image.data[i] = octet;
  });*/

  ctx.putImageData(image, 0, 0);

};
