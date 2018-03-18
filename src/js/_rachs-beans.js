import $ from "jquery";

let obj = {
  init
};

const rachsBeans = $("#rachsBeans");
const quote = $("#quote");

const beans = [
  "Have you ever had abs like that?",
  "Hey I found some chips in my belly button.",
  "We just saw Forrest in the 'Nam jungle.",
  "How long have you been an Uber driver?",
  "I like music that is like chill with a beat.",
  "You know the Indian food is going to be good when the Samosa is good."
];

function init() {
  rachsBeans.click(() => {
    const nextBean = getNextBean();

    if (nextBean) {
      quote.html("\"" + nextBean + "\"");
    } else {
      quote.html("All out of beans!");
    }
  });
}

function getNextBean() {
  if (beans.length === 0) {
    return false;
  }

  return beans.pop();
}

export default obj;
