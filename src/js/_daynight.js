import $ from "jquery";

export default {
  init
};

const westerkerkNight = $(".westerkerk.night");
let isNight = false;

function init() {
  westerkerkNight.on("touchstart", function() {
    isNight = !isNight;

    if (isNight) {
      night();
    } else {
      day();
    }
  });
}

function day() {
  isNight = false;
  westerkerkNight.css("opacity", "0");
}

function night() {
  isNight = true;
  westerkerkNight.css("opacity", "1");
}
