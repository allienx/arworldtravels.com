import $ from "jquery";

const westerkerkNight = $(".westerkerk.night");
let isNight = false;

westerkerkNight.on("touchstart", function() {
  isNight = !isNight;

  if (isNight) {
    night();
  } else {
    day();
  }
});

function day() {
  isNight = false;
  westerkerkNight.css("opacity", "0");
}

function night() {
  isNight = true;
  westerkerkNight.css("opacity", "1");
}
