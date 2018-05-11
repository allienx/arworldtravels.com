/**
 * This background slideshow is implemented with two div elements. They are positioned absolutely
 * so that one is on top of the other (the bottom element is not visible initially, opacity: 0).
 * When the bottom element changes to an opacity of 1, it becomes visible because it was defined
 * after the top element. The switching of images is done by cycling the bottom element's opacity
 * between 0 and 1 on a timer. A transition is defined on the bottom element's opacity property.
 * The "hidden" element will always load the next image in the slideshow so that we don't have
 * to preload all the images.
 */

import $ from "jquery";

export default {
  init
};

const topSlide = $(".background-slideshow.top");
const bottomSlide = $(".background-slideshow.bottom");
const timerLengthMS = 6000;
const transitionDurationMS = 1300;

let isTopSlideShowing = true;
let timerID = null;
let urls = [
  "/assets/img/background-berlin.jpg",
  "/assets/img/background-bovec.jpg",
  "/assets/img/background-coliseum.jpg",
  "/assets/img/background-grindelwald.jpg",
  "/assets/img/background-hoi-an.jpg",
  "/assets/img/background-lucca.jpg",
  "/assets/img/background-matterhorn.jpg",
  "/assets/img/background-milford-sound.jpg",
  "/assets/img/background-manarola.jpg"
];
let usedUrls = [urls.pop()];

topSlide.css("background-image", "url(" + usedUrls[0] + ")");
bottomSlide.css("background-image", "url(" + getRandomUrl() + ")");

function init() {
  timerID = setInterval(changeBackground, timerLengthMS);
}

function changeBackground() {
  if (urls.length === 0) {
    urls = usedUrls;
    usedUrls = [];
  }

  let nextSlide = isTopSlideShowing ? topSlide : bottomSlide;

  bottomSlide.css("opacity", isTopSlideShowing ? "1" : "0");

  // Wait until the transition is finished so the loading of the next image isn't visible.
  setTimeout(() => nextSlide.css("background-image", "url(" + getRandomUrl() + ")"), transitionDurationMS);

  isTopSlideShowing = !isTopSlideShowing;
}

function getRandomUrl() {
  const index = getRandomInt(0, urls.length);
  const url = urls[index];

  usedUrls = usedUrls.concat(urls.splice(index, 1));

  return  url;
}

// returns an integer, min <= integer < max
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}
