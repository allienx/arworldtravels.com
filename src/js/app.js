// JS Goes here - ES6 supported

// TODO: add browser prefixes for transform
$('#menu-button').click(function() {
  $('#menu-overlay').css({ left: 0 });
  $('#menu-overlay').css('z-index', '1100');
  $('#menu-drawer').css('transform', 'translate(0px, 0px)');
  $('#menu-drawer').css('z-index', '1200');
});

$('#menu-overlay').click(function() {
  $('#menu-overlay').css({ left: '-100%' });
  // $('#menu-drawer').css('transform', 'translate(-285px, 0px)');
  $('#menu-drawer').css('transform', 'translate(285px, 0px)');
});

const quoteElement = $("#quote");
const rachsBeans = [
  "Have you ever had abs like that?",
  "Hey I found some chips in my belly button.",
  "We just saw Forrest in the 'Nam jungle.",
  "How long have you been an Uber driver?",
  "I like music that is like chill with a beat.",
  "Have you ever been to the tates?",
  "Thank you. Thank you so much.",
  "You know the Indian food is going to be good when the Samosa is good."
];

function updateTheBean() {
  if (rachsBeans.length === 0) {
    return false;
  }

  return rachsBeans.pop();
}

$("#rachsBeans").click(function() {
  const nextBean = updateTheBean();

  if (nextBean) {
    quoteElement.html("\"" + nextBean + "\"");
  } else {
    quoteElement.html("All out of beans!");
  }
});
