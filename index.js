window.addEventListener("DOMContentLoaded", () => {
  const printPlayer = document.querySelector("#print-oyuncu");
  const printDesk = document.querySelector("#print-desk");
  const playerBet = document.querySelector("#player-bet");
  const playerMoney = document.querySelector("#player-money");
  const background = document.body;
  const text = document.querySelector("#info-text");

  // Buttons
  const startButton = document.querySelector("#start-game");
  const drawButton = document.querySelector("#draw-card");
  const skipButton = document.querySelector("#skip-round");
  const betUp = document.querySelector("#bet-up");
  const betDown = document.querySelector("#bet-down");

  // Variables
  let hearts, spades, clubs, diamonds, deck;
  let bet = 100;
  let bet_backup = bet;
  let gameOn = false;
  let money = 1000;
  let kartIndex = 1;

  let player_sum = 0;
  let player_sum2 = 0;
  let deck_sum = 0;
  let deck_sum2 = 0;

  let oneTimeAcePc = false;
  let oneTimeAcePlayer = false;
  let firstRound = true;

  let win = false;
  let draw = false;
  let loose = false;

  const delay_ms = 1000;

  playerMoney.textContent = "Money: " + money + "$";
  playerBet.textContent = "Bet: " + bet + "$";

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function bet_up() {
    if (!gameOn) {
      bet += 25;
      bet_backup = bet;
      playerBet.textContent = "Bet: " + bet + "$";
    }
  }

  function bet_down() {
    if (!gameOn && bet > 25) {
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

    player_sum = 0;
    player_sum2 = 0;
    deck_sum = 0;
    deck_sum2 = 0;

    kartIndex = 3;

    oneTimeAcePc = false;
    oneTimeAcePlayer = false;
    firstRound = true;

    win = false;
    draw = false;
    loose = false;

    for (let i = 1; i <= 6; i++) {
      const oyuncuKart = document.getElementById(`card-oyuncu${i}`);
      const deskKart = document.getElementById(`card-dagitici${i}`);
      if (oyuncuKart) oyuncuKart.src = "";
      if (deskKart) deskKart.src = "";
    }

    printPlayer.textContent = "Total: ";
    printDesk.textContent = "Total: ";

    drawButton.disabled = false;
    skipButton.disabled = false;
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
      background.style.background = "#0f0a";
    }
    if (draw && !win && !loose) {
      money += bet;
      playerMoney.textContent = "Money: " + money + "$";
      draw = false;
      background.style.background = "#ffa500a1";
    }
    if (loose && !win && !draw) {
      loose = false;
      background.style.background = "#f00a";
    }
  }

  function finish_game() {
    if (win) {
      printPlayer.textContent = player_sum + " YOU WON!";
    } else if (draw) {
      printPlayer.textContent =
        player_sum + " DRAW! Press Start Game to play again.";
    } else if (loose) {
      printPlayer.textContent =
        player_sum + " You lost! Press Start Game to try again.";
    }
    manage_money();
    drawButton.disabled = true;
    skipButton.disabled = true;
    gameOn = false;
  }

  function check_final_situation() {
    if (player_sum2 > player_sum) player_sum = player_sum2;
    if (deck_sum2 > deck_sum) deck_sum = deck_sum2;

    if (
      (deck_sum <= 21 && deck_sum > player_sum) ||
      deck_sum === 21 ||
      player_sum > 21
    ) {
      loose = true;
    } else if (deck_sum === player_sum) {
      draw = true;
    } else {
      win = true;
    }
    finish_game();
  }

  function checkAce(isPlayer) {
    if (isPlayer) {
      oneTimeAcePlayer = true;
      player_sum += 1;
      player_sum2 = player_sum + 10;
      if (player_sum2 === 21) player_sum = player_sum2;
    } else {
      oneTimeAcePc = true;
      deck_sum += 1;
      deck_sum2 = deck_sum + 10;
      if (deck_sum2 === 21) deck_sum = deck_sum2;
    }
  }

  function check_sum2(isPlayer) {
    if (isPlayer) {
      if (player_sum2 === 21) player_sum = 21;
      check_Player_Situation();
    } else {
      if (deck_sum2 === 21) deck_sum = 21;
    }
  }

  function printScreen() {
    if (player_sum2 !== 0 && oneTimeAcePlayer) {
      printPlayer.textContent = player_sum + " | " + player_sum2;
    } else {
      printPlayer.textContent = player_sum;
    }

    if (deck_sum2 !== 0 && oneTimeAcePc) {
      printDesk.textContent = deck_sum + " | " + deck_sum2;
    } else {
      printDesk.textContent = deck_sum;
    }
    check_Player_Situation();
  }

  function return_image(deck_val, ret_value, isPlayer) {
    ret_value++;

    if (ret_value === 1) ret_value = "A";
    if (ret_value === 11) ret_value = "j";
    if (ret_value === 12) ret_value = "q";
    if (ret_value === 13) ret_value = "k";

    if (!isPlayer) {
      if (ret_value === "A") checkAce(false);
      else if (["j", "q", "k"].includes(ret_value)) {
        deck_sum += 10;
        if (oneTimeAcePc) deck_sum2 = deck_sum + 10;
        else deck_sum2 = 0;
      } else {
        deck_sum += ret_value;
        if (oneTimeAcePc) deck_sum2 = deck_sum + 10;
        else deck_sum2 = 0;
      }
    } else {
      if (ret_value === "A") checkAce(true);
      else if (["j", "q", "k"].includes(ret_value)) {
        player_sum += 10;
        if (oneTimeAcePlayer) player_sum2 = player_sum + 10;
        else player_sum2 = 0;
      } else {
        player_sum += ret_value;
        if (oneTimeAcePlayer) player_sum2 = player_sum + 10;
        else player_sum2 = 0;
      }
    }

    if (player_sum2 > 21) player_sum2 = 0;
    if (deck_sum2 > 21) deck_sum2 = 0;

    printScreen();

    if (deck_val === 0)
      return "./Cards_Image/Spades/" + ret_value + ".png";
    else if (deck_val === 1)
      return "./Cards_Image/Hearts/" + ret_value + ".png";
    else if (deck_val === 2)
      return "./Cards_Image/Clubs/" + ret_value + ".png";
    else return "./Cards_Image/Diamonds/" + ret_value + ".png";
  }

  function delete_card(deck_val, card_value) {
    if (deck_val === 0) spades.splice(card_value, 1);
    else if (deck_val === 1) hearts.splice(card_value, 1);
    else if (deck_val === 2) clubs.splice(card_value, 1);
    else diamonds.splice(card_value, 1);
  }

  function pick_random_card(isPlayer) {
    let pick_deck = Math.floor(Math.random() * 4);
    let pick_card = Math.floor(Math.random() * 13);

    delete_card(pick_deck, pick_card);

    return return_image(pick_deck, pick_card, isPlayer);
  }

  function first_draw_cards() {
    for (let i = 1; i <= 2; i++) {
      const oyuncuKart = document.getElementById(`card-oyuncu${i}`);
      const deskKart = document.getElementById(`card-dagitici${i}`);

      if (oyuncuKart) oyuncuKart.src = pick_random_card(true);
      if (deskKart) {
        if (i === 2) deskKart.src = "./Cards_Image/reverse.png";
        else deskKart.src = pick_random_card(false);
      }
    }
  }

  function draw_card() {
    if (gameOn && kartIndex <= 6) {
      const oyuncuKart = document.getElementById(`card-oyuncu${kartIndex}`);
      if (oyuncuKart) {
        oyuncuKart.src = pick_random_card(true);
        kartIndex++;
        check_sum2(true);
      }
    } else {
      text.textContent = "Cannot draw more cards!";
    }
  }

  async function skip_play() {
    if (!gameOn) return;
    gameOn = false;
    kartIndex = 3;

    let deskKart = document.getElementById(`card-dagitici2`);
    deskKart.src = pick_random_card(false);

    for (let i = 3; i <= 6; i++) {
      if (
        deck_sum <= 17 &&
        deck_sum <= 21 &&
        deck_sum < player_sum
      ) {
        deskKart = document.getElementById(`card-dagitici${i}`);
        if (deskKart) {
          deskKart.src = pick_random_card(false);
          check_sum2(false);
          await delay(delay_ms);
        }
      } else {
        break;
      }
    }
    check_final_situation();
  }

  function auto_win() {
    if (player_sum === 21 || player_sum2 === 21) {
      player_sum = 21;
      gameOn = false;
      win = true;
      finish_game();
    }
  }

  function check_Player_Situation() {
    if (player_sum > 21) {
      gameOn = false;
      check_final_situation();
    }
    if (player_sum === 21 && !firstRound) {
      text.textContent = "Auto skipped. You already got 21!";
      skip_play();
    }
  }

  function start_game() {
    if (!gameOn) {
      if (bet > 0) {
        if (money >= bet) {
          make_game_ready();
          first_draw_cards();
          auto_win();
          firstRound = false;
          drawButton.disabled = false;
          skipButton.disabled = false;
          kartIndex = 3;
        } else {
          text.textContent = "!YOU DO NOT HAVE ENOUGH MONEY!";
        }
      } else {
        text.textContent = "!BET MUST BE HIGHER THAN 0$!";
      }
    }
  }

  startButton.onclick = start_game;
  drawButton.onclick = draw_card;
  skipButton.onclick = skip_play;
  betUp.onclick = bet_up;
  betDown.onclick = bet_down;

  drawButton.disabled = true;
  skipButton.disabled = true;
});
