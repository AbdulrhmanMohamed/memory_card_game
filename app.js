// generate map
var rand_indces = [];
var cards_image = [];
var images = document.querySelectorAll(".card_wrapper .card_image img");
var hint = document.querySelector(".btn_hint");

var flip = document.querySelector(".btn_flip");
var card_game = document.querySelector(".card_game");

function generate_card_locations() {
    // index of the image would a random number
    // generate set of random numbers
    rand_indces = [];
    cards_image = [];
    var index;
    for (var i = 0; i < images.length; i++) {
        do {
            index = Math.floor(Math.random() * images.length);
        } while (rand_indces.includes(index));
        // after checking that the index is not repeated
        rand_indces.push(index);
    }

    return rand_indces;
}

var image_sources = [];

function map_cards_loaction_toImages() {
    // debugger;
    var ext = ".jpg";
    var string_image = "./images/image";
    rand_indces.forEach(function(ele, index) {
        cards_image.push(ele > 5 ? ele - 6 : ele);
    });

    images.forEach(function(ele, index) {
        ele.src = string_image + cards_image[index] + ext;
        ele.setAttribute("data_index", index);
        image_sources.push(ele.src);
    });
}

var t_start_id, t_win_id;

function init() {
    cards_image = [];
    rand_indces = [];
    heart_index = 0;
    count_success_cards = 0;
    minutes.innerHTML = pad(5);
    seconds.innerHTML = pad(0);
    generate_card_locations();
    map_cards_loaction_toImages();
    // reset every thing

    // lives
    all_hearts.forEach(function(ele, index) {
        ele.className = "";
        ele.classList.add("fa-solid", "fa-heart");
    });
    button_hints.disabled = false;
    allCards.forEach(function(ele, index) {
        ele.classList.remove("flip");
        ele.classList.remove("hint_flip");
        ele.classList.remove("user_flip");
    });
}

// catch the hints
var button_hints = document.querySelector(".hints");
console.log(button_hints);
button_hints.addEventListener("click", hint_for_live);
var all_hearts = document.querySelectorAll(".lives i");
var heart_index = 0;

function hint_for_live() {
    // means you lost one of your lifs

    all_hearts[heart_index].className = "";
    all_hearts[heart_index++].classList.add("fa-solid", "fa-heart-crack");
    give_hints();
    if (heart_index == 3) {
        heart_index = 0;
        button_hints.disabled = true;
    }
}

// function for generating solution for the hints
function give_hints() {
    allCards.forEach(function(ele, index) {
        ele.classList.add("hint_flip");
    });

    setTimeout(function() {
        allCards.forEach(function(ele, index) {
            if (!ele.classList.contains("user_flip")) {
                ele.classList.remove("hint_flip");
            }
        });
    }, 800);
}

// catch all the card wrapper to flip on click
var allCards = document.querySelectorAll(".card_wrapper");
// console.log(allCards.length);
allCards.forEach(function(ele, index) {
    ele.setAttribute("data_index", index);
    ele.addEventListener("click", function() {
        flipCard(ele, index);
    });
});

// user choice flipping cards
var userCards = [];
var number_of_cards = 0;

function flipCard(ele, index) {
    if (!ele.classList.contains("user_flip")) {
        ele.classList.add("user_flip");
        number_of_cards++;
        userCards.push(index);
        if (number_of_cards == 2) {
            check_user_solution(userCards);
            userCards = [];
            number_of_cards = 0;
        }
    }
}

// check user solution
var count_success_cards = 0;

function check_user_solution(twoCards) {
    setTimeout(function() {
        if (images[twoCards[0]].src == images[twoCards[1]].src) {
            allCards[twoCards[0]].classList.add("hint_flip");
            allCards[twoCards[1]].classList.add("hint_flip");
            count_success_cards += 1;

            if (count_success_cards == allCards.length / 2) {
                if (t_status_id) {
                    clearInterval(t_status_id);
                } else if (t_start_id) {
                    clearInterval(t_start_id);
                }
                game_status.style.display = "flex";
                game_status.parentElement.style.display = "flex";

                count_success_cards = 0;
                game_message.innerHTML = "We Got A Winner !!";
            }
        } else {
            allCards[twoCards[0]].classList.remove("user_flip");
            allCards[twoCards[1]].classList.remove("user_flip");
        }
    }, 1000);
    console.log(images[twoCards[0]]);
    console.log(images[twoCards[1]]);
}

function solution_color(index1, index2) {
    setTimeout(function() {
        allCards[index1].classList.add("hint_flip");
        allCards[index2].classList.add("hint_flip");
    }, 1000);
}
// create the timer and catch it's element
var timer = document.querySelector(".timer");
timer.style.color = "var(--sec3-color)";
var minutes = document.querySelector(".minutes");
var seconds = document.querySelector(".seconds");

function pad(num) {
    return num < 9 ? "0" + num : num;
}

function time() {
    // minutes.innerHTML = pad(2);
    // seconds.innerHTML = pad(0);
    var t_minute = parseInt(minutes.innerHTML);
    var t_seconds = parseInt(seconds.innerHTML);

    if (t_minute > 0 && t_seconds == 0) {
        t_minute--;
        t_seconds = 60;
    }
    if (t_seconds > 0) {
        t_seconds--;
    }
    if (
        t_minute === 0 &&
        t_seconds == 0 &&
        count_success_cards != allCards.length / 2
    ) {
        game_status.parentElement.style.display = "flex";
        game_status.style.display = "flex";
        game_message.innerHTML = "Sorry But You Lost";
        if (t_status_id) {
            clearInterval(t_status_id);
        } else if (t_start_id) {
            clearInterval(t_start_id);
        }
    }
    minutes.innerHTML = pad(t_minute);
    seconds.innerHTML = pad(t_seconds);
}

var start = document.querySelector(".newGame .start");

var game_status = document.querySelector(".status");
var game_message = document.querySelector(".status .message");
var game_play = document.querySelector(".status .play");
var exit_game = document.querySelector(".status .exit");

start.parentElement.style.display = "flex";
start.style.display = "block";
start.addEventListener("click", function() {
    this.parentElement.style.display = "none";
    this.style.display = "none";
    t_start_id = setInterval(time, 1000);
    init();
});

var t_status_id;

game_play.addEventListener("click", function() {
    chooseState(1);
});

exit_game.addEventListener("click", function() {
    chooseState(0);
});

function chooseState(option) {
    if (option) {
        init();
        t_status_id = setInterval(time, 1000);
    } else {
        button_hints.disabled = true;
    }
    game_status.style.display = "none";
    game_status.parentElement.style.display = "none";
}