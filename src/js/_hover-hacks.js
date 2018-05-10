import $ from "jquery";

export default {
  init
};

const links = $("a.hackz");

function init() {
  links.hover(startHover, endHover);
}

function startHover(e) {
  let target = $(e.target);
  let text = target.text();
  let newText = text
    .replace(/o/gi, "0")
    .replace(/l/g, "1")
    .replace(/\+/i, "-")
    .replace(/s/gi, "5")
    .replace(/t/gi, "7")
    .replace(/i/gi, "1")
    .replace(/a/gi, "4")
    .replace(/e/gi, "3");

  $.data(target.get(0), "text", text);
  target.text(newText);
}

function endHover(e) {
  let target = $(e.target);

  target.text($.data(target.get(0), "text"));
}
