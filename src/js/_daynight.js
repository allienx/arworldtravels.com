import $ from "jquery";

let obj = {
  init
};

const westerkerk = $(".westerkerk");
let isNight = false;

function init() {
  westerkerk.hover(night, day);

  westerkerk.on("touchstart", function() {
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
  westerkerk.removeClass("night");
  westerkerk.addClass("day");
}

function night() {
  isNight = true;
  westerkerk.removeClass("day");
  westerkerk.addClass("night");
}

export default obj
