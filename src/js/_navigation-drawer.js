import $ from "jquery";

let obj = {
  init
};

const menuButton = $("#menu-button");
const menuOverlay = $("#menu-overlay");
const menuDrawer = $("#menu-drawer");

function init() {
  menuButton.click(() => {
    menuOverlay.css({ left: 0 });
    menuOverlay.css("z-index", "1100");

    menuDrawer.css("-webkit-transform", "translate(0px, 0px");
    menuDrawer.css("-ms-transform", "translate(0px, 0px");
    menuDrawer.css("transform", "translate(0px, 0px");
    menuDrawer.css("z-index", "1200");
  });

  menuOverlay.click(() => {
    menuOverlay.css({ left: "-100%" });

    menuDrawer.css("-webkit-transform", "translate(285px, 0px)");
    menuDrawer.css("-ms-transform", "translate(285px, 0px)");
    menuDrawer.css("transform", "translate(285px, 0px)");
  });
}

export default obj;
