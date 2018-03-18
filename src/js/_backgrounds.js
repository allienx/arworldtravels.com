import $ from "jquery";

let obj = {
  init
};

const header = $("header.masthead");
const delay = 6000;

let timerID = null;
let usedUrls = [];
let urls = [
  "/assets/img/background-berlin.jpg",
  "/assets/img/background-bovec.jpg",
  "/assets/img/background-coliseum.jpg",
  "/assets/img/background-grindelwald.jpg",
  "/assets/img/background-hoi-an.jpg",
  "/assets/img/background-lucca.jpg",
  "/assets/img/background-matterhorn.jpg",
  "/assets/img/background-milford-sound.jpg",
  "/assets/img/background-plitvice.jpg"
];

function init() {
  timerID = setInterval(function() {
    changeBackground();
  }, delay);
}

function changeBackground() {
  if (urls.length === 0) {
    urls = usedUrls;
    usedUrls = [];
  }

  let index = getRandomInt(0, urls.length);
  let newUrl = urls[index];

  usedUrls = usedUrls.concat(urls.splice(index, 1));

  header.css("background-image", "url(" + newUrl + ")");
}

// returns an integer, min <= integer < max
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

export default obj;
