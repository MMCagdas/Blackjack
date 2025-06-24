let printPlayer = document.querySelector("#print-oyuncu");
let printDesk = document.querySelector("#print-desk");
let playerBet = document.querySelector("#player-bet");
let playerMoney = document.querySelector("#player-money");
let background = document.querySelector(".container");
let text = document.querySelector("#info-text");

let startButton = document.querySelector("#start-game");
let drawButton = document.querySelector("#draw-card");
let skipButton = document.querySelector("#skip-round");
let betUp = document.querySelector("#bet-up");
let betDown = document.querySelector("#bet-down");

startButton.onclick = start_game;
drawButton.onclick = draw_card;
skipButton.onclick = skip_play;
betUp.onclick = bet_up;
betDown.onclick = bet_down;

let hearts = [];
let spades = [];
let clubs = [];
let diamonds = [];
let deck = [];

let bet = 100;
let bet_backup = bet;
let gameOn = false;

let money = 1000;
let kartIndex = 1;

let player_sum = 0;
let player_sum2 = 0;
let deck_sum = 0;
let deck_sum2 = 0;

let oneTimeAcePc;
let oneTimeAcePlayer;
let firstRound;

let win = false;
let draw = false;
let loose = false;

playerMoney.textContent = "Money: " + money + "$";
playerBet.textContent = "Bet: " + bet + "$";

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function bet_up() {
  if (!gameOn) {
    bet += 25;
    bet_backup = bet;
    playerBet.textContent = "Bet: " + bet + "$";
  }
}

function bet_down() {
  if (!gameOn && bet >= 25) {
    bet -= 25;
    bet_backup = bet;
    playerBet.textContent = "Bet: " + bet + "$";
  }
}

function make_game_ready() {
  text.textContent = "";
  bet = bet_backup;
  money -= bet;
  playerMoney.textContent = "Money: " + money + "$";
  playerBet.textContent = "Bet: " + bet + "$";
  background.style.background = "#121212";

  hearts = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  spades = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  clubs = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  diamonds = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  deck = [spades, hearts, clubs, diamonds];

  gameOn = true;
  kartIndex = 1;

  player_sum = 0;
  player_sum2 = 0;
  deck_sum = 0;
  deck_sum2 = 0;

  oneTimeAcePc = false;
  oneTimeAcePlayer = false;
  firstRound = true;

  win = false;
  draw = false;
  loose = false;

  for (let i = 1; i <= 6; i++) {
    document.querySelector(`#card-oyuncu${i}`).src = "";
    document.querySelector(`#card-dagitici${i}`).src = "";
  }

  drawButton.disabled = false;
  skipButton.disabled = false;
  startButton.disabled = true;
}

function delete_card(deck_val, card_value) {
  if (deck_val === 0) spades.splice(card_value, 1);
  else if (deck_val === 1) hearts.splice(card_value, 1);
  else if (deck_val === 2) clubs.splice(card_value, 1);
  else diamonds.splice(card_value, 1);
}

function manage_money() {
  if (win && !draw && !loose) {
    money += bet * 2;
    playerMoney.textContent = "Money: " + money + "$";
    win = false;
    background.style.background = "#0a0";
  }
  if (draw && !win && !loose) {
    money += bet;
    playerMoney.textContent = "Money: " + money + "$";
    draw = false;
    background.style.background = "#fa0";
  }
  if (loose && !win && !draw) {
    loose = false;
    background.style.background = "#a00";
  }
}

function finish_game() {
  if (win) printPlayer.textContent = player_sum + " YOU WON!";
  else if (draw) printPlayer.textContent = player_sum + " DRAW! Press Start to play again.";
  else if (loose) printPlayer.textContent = player_sum + " You lost! Press Start to try again.";
  manage_money();
  drawButton.disabled = true;
  skipButton.disabled = true;
  startButton.disabled = false;
  gameOn = false;
}

function check_final_situation() {
  if (player_sum2 > player_sum) player_sum = player_sum2;
  if (deck_sum2 > deck_sum) deck_sum = deck_sum2;

  if ((deck_sum <= 21 && deck_sum > player_sum) || deck_sum === 21 || player_sum > 21) loose = true;
  else if (deck_sum === player_sum) draw = true;
  else win = true;

  finish_game();
}

function check_Player_Situation() {
  if (player_sum > 21) {
    gameOn = false;
    check_final_situation();
  }

  if (player_sum === 21 && !firstRound) {
    printPlayer.textContent = player_sum + " Auto skipped. You got 21!";
    skip_play();
  }
}

function checkAce(isPlayer) {
  if (isPlayer) {
    oneTimeAcePlayer = true;
    player_sum += 1;
    player_sum2 = player_sum + 10;
    if (player_sum2 === 21) {
      player_sum = player_sum2;
      printPlayer.textContent = player_sum;
    }
  } else {
    oneTimeAcePc = true;
    deck_sum += 1;
    deck_sum2 = deck_sum + 10;
    if (deck_sum2 === 21) {
      deck_sum = deck_sum2;
      printDesk.textContent = deck_sum;
    }
  }
}

function check_sum2(isPlayer) {
  if (player_sum2 === 21) player_sum = 21;
  if (deck_sum2 === 21) deck_sum = 21;
  if (isPlayer) check_Player_Situation();
}

function printScreen() {
  if (player_sum2 !== 0 && oneTimeAcePlayer) {
    printPlayer.textContent = player_sum + " | " + player_sum2;
    if (deck_sum2 !== 0 && oneTimeAcePc) printDesk.textContent = deck_sum + " | " + deck_sum2;
    else printDesk.textContent = deck_sum;
  } else {
    printPlayer.textContent = player_sum;
    if (deck_sum2 !== 0 && oneTimeAcePc) printDesk.textContent = deck_sum + " | " + deck_sum2;
    else printDesk.textContent = deck_sum;
  }
  check_Player_Situation();
}

function return_image(deck_val, ret_value, isPlayer) {
  ret_value++;

  if (ret_value === 1) ret_value = "A";
  else if (ret_value === 11) ret_value = "j";
  else if (ret_value === 12) ret_value = "q";
  else if (ret_value === 13) ret_value = "k";

  if (ret_value === "A") checkAce(isPlayer);
  else if (["j", "q", "k"].includes(ret_value)) {
    if (isPlayer) {
      player_sum += 10;
      if (oneTimeAcePlayer) player_sum2 = 10 + player_sum;
    } else {
      deck_sum += 10;
      if (oneTimeAcePc) deck_sum2 = 10 + deck_sum;
    }
  } else {
    if (isPlayer) {
      player_sum += ret_value;
      if (oneTimeAcePlayer) player_sum2 = 10 + player_sum;
    } else {
      deck_sum += ret_value;
      if (oneTimeAcePc) deck_sum2 = 10 + deck_sum;
    }
  }

  if (player_sum2 > 21) player_sum2 = 0;
  if (deck_sum2 > 21) deck_sum2 = 0;

  printScreen();

  if (deck_val === 0) return "./Cards_Image/Spades/" + ret_value + ".png";
  else if (deck_val === 1) return "./Cards_Image/Hearts/" + ret_value + ".png";
  else if (deck_val === 2) return "./Cards_Image/Clubs/" + ret_value + ".png";
  else return "./Cards_Image/Diamonds/" + ret_value + ".png";
}

function pick_random_card(isPlayer) {
  let pick_deck = Math.floor(Math.random() * 4);
  let pick_card = Math.floor(Math.random() * 13);

  delete_card(pick_deck, pick_card);

  return return_image(pick_deck, pick_card, isPlayer);
}

function first_draw_cards() {
  for (kartIndex = 1; kartIndex <= 2; kartIndex++) {
    let oyuncuKart = document.getElementById(`card-oyuncu${kartIndex}`);
    let deskKart = document.getElementById(`card-dagitici${kartIndex}`);

    if (oyuncuKart && deskKart) {
      oyuncuKart.src = pick_random_card(true);
      if (kartIndex !== 2) deskKart.src = pick_random_card(false);
      else deskKart.src = "./Cards_Image/reverse.png";
    }
  }
  kartIndex = 3;
}

function draw_card() {
  if (gameOn && kartIndex <= 6) {
    let oyuncuKart = document.getElementById(`card-oyuncu${kartIndex}`);
    if (oyuncuKart) {
      oyuncuKart.src = pick_random_card(true);
      kartIndex++;
      check_sum2(true);
    }
  }
}

async function skip_play() {
  if (!gameOn) return;
  let dealerSecondCard = document.getElementById("card-dagitici2");
  if (dealerSecondCard) dealerSecondCard.src = pick_random_card(false);

  await delay(500);
  while (deck_sum < 17 && kartIndex <= 6) {
    let dealerCard = document.getElementById(`card-dagitici${kartIndex}`);
    if (dealerCard) {
      dealerCard.src = pick_random_card(false);
      kartIndex++;
    }
    await delay(600);
  }

  check_final_situation();
}

function start_game() {
  if (money < bet) {
    text.textContent = "Insufficient money to bet!";
    return;
  }
  make_game_ready();
  first_draw_cards();
  firstRound = false;
}
