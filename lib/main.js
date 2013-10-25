var time = Date.now();

require("./canvas")(".main");

document.querySelectorAll(".elapsed")[0].innerHTML = (Date.now() - time) + "ms";

