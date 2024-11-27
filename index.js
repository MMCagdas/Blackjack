// ./Cards_Image/Spades/10.png
let printPlayer = document.querySelector("#print-oyuncu");
let printDesk = document.querySelector("#print-desk");
let playerBet = document.querySelector("#player-bet");
let playerMoney = document.querySelector("#player-money");
let background = document.querySelector(".general-body");
let text = document.querySelector("#info-text");

// BUTTONS
let startButton = document.querySelector("#start-game");
let drawButton = document.querySelector("#draw-card");
let skipButton = document.querySelector("#skip-round");
let splitButton = document.querySelector("#split-cards");

let betUp = document.querySelector("#bet-up");
let betDown = document.querySelector("#bet-down");

// BUTTON FUNCTIONS
startButton.onclick = start_game;
drawButton.onclick = draw_card;
skipButton.onclick = skip_play;
splitButton.onclick = split_cards;
betUp.onclick = bet_up;
betDown.onclick = bet_down;


// VARIABLES

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

let oneTimeAcePlayer_s1;
let oneTimeAcePlayer_s2;
let split_card_counter = 0;
let split_sum_1 = 0;
let split_sum_1_2 = 0;
let split_sum_2 = 0;
let split_sum_2_2 = 0;
let player_card1;
let player_card2;
let card1;
let card2;
let is_round1 = true;
let is_splitted = false;
let is_splitted_card = false;

let delay_ms = 1000;

playerMoney.textContent = "Money: " + money +"$"
playerBet.textContent = "Bet: " + bet+"$"

function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function bet_up(){
    if (!gameOn){
        bet += 25;
        bet_backup = bet;
        playerBet.textContent = "Bet: " + bet+"$"
    }
}

function bet_down(){
    if (!gameOn){
        if(bet >= 25){
            bet -= 25;
            bet_backup = bet;
        }
        playerBet.textContent = "Bet: " + bet+"$"
    }
}

function make_game_ready(){
    text.textContent = ""

    bet = bet_backup;
    money -= bet;
    playerMoney.textContent = "Money: " + money +"$"
    playerBet.textContent = "Bet: " + bet+"$"
    background.style.background = "black";

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

    kartIndex = 1;

    oneTimeAcePc = false
    oneTimeAcePlayer = false
    firstRound = true;

    win = false;
    draw = false;
    loose = false;

    oneTimeAcePlayer_s1 = false;
    oneTimeAcePlayer_s2 = false;
    split_card_counter = 0;
    is_round1 = true;
    is_splitted = false;
    is_splitted_card = false;
    split_sum_1 = 0;
    split_sum_1_2 = 0;
    split_sum_2 = 0;
    split_sum_2_2 = 0;

    for(let num = 1; num <= 6; num++){
        let oyuncuKart = document.getElementById(`card-oyuncu${num}`);
        let deskKart = document.getElementById(`card-dagitici${num}`);

        oyuncuKart.src = "";
        deskKart.src = "";
    }
}

function delete_card(deck_val, card_value){
    if (deck_val === 0){spades.splice(card_value, 1);}
    else if (deck_val === 1){hearts.splice(card_value, 1);}
    else if (deck_val === 2){clubs.splice(card_value, 1);}
    else{diamonds.splice(card_value, 1);}
}

function manage_money(){
    if (win && !draw && !loose) {
        money = money + bet*2;
        playerMoney.textContent = "Money: " + money +"$";
        win = false;
        background.style.background = "green";
    }
    if(draw && !win && !loose){
        money = money + bet;
        playerMoney.textContent = "Money: " + money +"$";
        draw = false;
        background.style.background = "orange";
    }
    if(loose && !win && !draw){
        money = money;
        loose = false;
        background.style.background = "red";
    }
}

function finish_game(){
    if(!is_splitted){
        if (win){
            printPlayer.textContent = player_sum + " YOU WOOONN!!!!!!";    
        }
        if (draw){
            printPlayer.textContent = player_sum + " DRAW!!! :(... If you wanna start again press start game!";      
        }
        if (loose){
            printPlayer.textContent = player_sum + " Sorry Player you lost!!! :(... If you wanna start again press start game!"
        }
    }
    else{
        
    }
    manage_money();
}

function finish_splitted_game(r1, r2){
    printDesk.textContent = "DESK TOTAL: " + deck_sum;
    if(r1 == 0){
        if(r2 == 0){
            printPlayer.textContent = "YOU LOST BOTH SIDES SORRYY :(";
            background.style.background = "red";
        }
        else if(r2 == 1){
            printPlayer.textContent = "YOU LOST RIGHT SIDE AND DRAW ON LEFT SIDE!";
            money += bet/2;
            playerMoney.textContent = "Money: " + money +"$";
        }
        else{
            printPlayer.textContent = "YOU LOST RIGHT SIDE BUT !!WIN!! LEFT SIDE!!!";
            money += bet;
            playerMoney.textContent = "Money: " + money +"$";
        }
    }
    else if(r1 == 1){
        if(r2 == 0){
            printPlayer.textContent = "DRAW ON RIGHT SIDE BUT LOST IN LEFT SIDE";
            money += bet/2;
            playerMoney.textContent = "Money: " + money +"$";
        }
        else if(r2 == 1){
            printPlayer.textContent = "DRAW ON BOTH SIDES! YOU GET YOUR ALL MONEY BACK";
            money += bet;
            playerMoney.textContent = "Money: " + money +"$";
            background.style.background = "orange";
        }
        else{
            printPlayer.textContent = "DRAW ON RIGHT SIDE BUT !!WIN!! ON RIGHT SIDE!!!";
            money += (bet + bet/2);
            playerMoney.textContent = "Money: " + money +"$";
        }
    }
    else{
        if(r2 == 0){
            printPlayer.textContent = "YOU !!WIN!! RIGHT SIDE BUT LOST LEFT SIDE...";
            money += bet;
            playerMoney.textContent = "Money: " + money +"$";
        }
        else if(r2 == 1){
            printPlayer.textContent = "YOU !!WIN!! RIGHT SIDE AND DRAW ON LEFT SIDE!";
            money += (bet + bet/2);
            playerMoney.textContent = "Money: " + money +"$";
        }
        else{
            printPlayer.textContent = "YOU WON BOTH SIDES???? 4X MONEY HERE IT COMES!";
            money += bet*2;
            playerMoney.textContent = "Money: " + money +"$";
            background.style.background = "green";
        }
    }
}

function check_final_situation(){
    if(!is_splitted){
        if (player_sum2 > player_sum) { player_sum = player_sum2;}
        if (deck_sum2 > deck_sum) { deck_sum = deck_sum2; }

        if (((deck_sum <= 21) &&  (deck_sum > player_sum)) || ((deck_sum === 21) || (player_sum > 21))){
            loose = true;
        }
        else if (deck_sum === player_sum){
            draw = true;
        }
        else{
            win = true;
        }
        finish_game();
    }
    else{
        let r1;
        let r2;

        if(split_sum_1_2 > split_sum_1) {split_sum_1 = split_sum_1_2}
        if(split_sum_2_2 > split_sum_2) {split_sum_2 = split_sum_2_2}
        if (deck_sum2 > deck_sum) { deck_sum = deck_sum2; }
        
        if(((deck_sum <= 21) && (deck_sum > split_sum_1)) || ((deck_sum === 21) || (split_sum_1 > 21))) {r1 = 0;}
        else if(deck_sum === split_sum_1) {r1 = 1;}
        else {r1 = 2;}

        if(((deck_sum <= 21) && (deck_sum > split_sum_2)) || ((deck_sum === 21) || (split_sum_2 > 21))) {r2 = 0;}
        else if(deck_sum === split_sum_2) {r2 = 1;}
        else {r2 = 2;}

        finish_splitted_game(r1 ,r2);

    }
    
}

function check_Player_Situation(){
    if(!is_splitted){
        if (player_sum > 21){
            gameOn = false
            check_final_situation();
        }
        
        if (player_sum === 21 && !firstRound){
            printPlayer.textContent = player_sum + " Its auto skipped. You already got 21!";
            skip_play();
        }
    }
    else{
        if(is_round1){
            if(split_sum_1 > 21){
                split_round2();
            }
            if(split_sum_1 === 21){
                text.textContent = "Its auto skipped. You already got 21 FOR RIGHT SIDE!";
                split_round2();
            }
        }
        else{
            if(split_sum_2 > 21){
                skip_play();
            }
            if(split_sum_1 === 21){
                text.textContent ="Its auto skipped. You already got 21 FOR LEFT SIDE!";
                skip_play();
            }
        }
    }
}

function checkAce(isPlayer){
    if(!is_splitted){
        if (isPlayer){
            oneTimeAcePlayer = true;
            player_sum += 1;
            player_sum2 = player_sum + 10;
            if (player_sum2 === 21) {player_sum = player_sum2; printPlayer.textContent = player_sum;}
        }
        else{
            oneTimeAcePc = true;
            deck_sum += 1;
            deck_sum2 = deck_sum + 10;
            if (deck_sum2 === 21) {deck_sum = deck_sum2; printDesk.textContent = deck_sum;} 
        }
    }
    else{
        if (isPlayer){
            if(is_round1){
                oneTimeAcePlayer_s1 = true
                split_sum_1 += 1;
                split_sum_1_2 = split_sum_1 + 10;
                if (split_sum_1_2 === 21) {split_sum_1 = split_sum_1_2; printPlayer.textContent = split_sum_1;}
            }
            else{
                oneTimeAcePlayer_s2 = true
                split_sum_2 += 1;
                split_sum_2_2 = split_sum_2 + 10;
                if (split_sum_2_2 === 21) {split_sum_2 = split_sum_2_2; printPlayer.textContent = split_sum_2;}
            }
        }
        else{
            oneTimeAcePc = true;
            deck_sum += 1;
            deck_sum2 = deck_sum + 10;
            if (deck_sum2 === 21) {deck_sum = deck_sum2; printDesk.textContent = deck_sum;} 
        }
    }
}

function check_sum2(isPlayer){
    if(!is_splitted){
        if (player_sum2 === 21){ player_sum = 21; }
        if (deck_sum2 === 21){ deck_sum = 21; }
        if (isPlayer) { check_Player_Situation(); }
    }
    else{
        if(is_round1){
            if (split_sum_1_2 === 21){ split_sum_1 = 21; }
            if (deck_sum2 === 21){ deck_sum = 21; }
            if (isPlayer) { check_Player_Situation(); }
        }
        else{
            if (split_sum_2_2 === 21){ split_sum_2 = 21; }
            if (deck_sum2 === 21){ deck_sum = 21; }
            if (isPlayer) { check_Player_Situation(); }
        }
    }
}

function printScreen(){
    if(!is_splitted){
        if(player_sum2 !== 0 && oneTimeAcePlayer){
            printPlayer.textContent = player_sum + " | " + player_sum2;
            if(deck_sum2 !== 0 && oneTimeAcePc){
                printDesk.textContent = deck_sum + " | " + deck_sum2;
            } else{ printDesk.textContent = deck_sum; }
        }
        else{
            printPlayer.textContent = player_sum;
            if(deck_sum2 !== 0 && oneTimeAcePc){
                printDesk.textContent = deck_sum + " | " + deck_sum2;
            } else{ printDesk.textContent = deck_sum; }
        }
    }
    else{
        if(split_sum_2_2 !== 0 && oneTimeAcePlayer_s2){
            printPlayer.textContent = "Left Side: " + split_sum_2 + " | " + split_sum_2_2 + "------";
            if(split_sum_1_2 !== 0 && oneTimeAcePlayer_s1){
                printPlayer.textContent += "Right Side: " + split_sum_1 + " | " + split_sum_1_2;
            }
            else{
                printPlayer.textContent += "Right Side: " + split_sum_1;
            }
        }
        else{
            printPlayer.textContent = "Left Side: " + split_sum_2 + "------";
            if(split_sum_1_2 !== 0 && oneTimeAcePlayer_s1){
                printPlayer.textContent += "Right Side: " + split_sum_1 + " | " + split_sum_1_2;
            }
            else{
                printPlayer.textContent += "Right Side: " + split_sum_1;
            }
        }
    }

    check_Player_Situation()
}

function return_image(deck_val, ret_value, isPlayer){
    ret_value++;

    if (firstRound){
        if(split_card_counter == 0){
            player_card1 = ret_value;
            split_card_counter++;
        }
        else{
            player_card2 = ret_value;
            split_card_counter++;
        }
    }

    if(ret_value === 1){ret_value = "A";}
    if(ret_value === 11){ret_value = "j";}
    if(ret_value === 12){ret_value = "q";}
    if(ret_value === 13){ret_value = "k";}


    if(!is_splitted){
        if (ret_value === "A"){
            if (isPlayer) { checkAce(true); }
            else { checkAce(false); }
        }
        else if ((ret_value === "j")||(ret_value === "q")||(ret_value === "k")){
            if(isPlayer){player_sum += 10; if(oneTimeAcePlayer){player_sum2 = 10 + player_sum;}}
            else{deck_sum += 10; if(oneTimeAcePc){deck_sum2 = 10 + deck_sum;}}
        }
        else{
            if(isPlayer){player_sum += ret_value; if(oneTimeAcePlayer){player_sum2 = 10 + player_sum;}}
            else{deck_sum += ret_value; if(oneTimeAcePc){deck_sum2 = 10 + deck_sum;}}
        } 
        
        if (player_sum2 > 21) { player_sum2 = 0; }
        if (deck_sum2 > 21) { deck_sum2 = 0; }
    }
    else{
        if(ret_value === 'j' || ret_value === "q" || ret_value === "k") {ret_value = 10;}
        if(isPlayer){
            if(ret_value === "A"){
                checkAce(true);
            }
            else if(ret_value !== "A" && is_round1) {split_sum_1 += ret_value; if(oneTimeAcePlayer_s1) {split_sum_1_2 = 10+ split_sum_1;}}
            else if(ret_value !== "A" && !is_round1) {split_sum_2 += ret_value; if(oneTimeAcePlayer_s2) {split_sum_2_2 = 10+ split_sum_2;}}
        }
        else{
            if(ret_value === "A"){checkAce(false);}
            if(ret_value !== "A") {deck_sum += ret_value; if(oneTimeAcePc) {deck_sum2 = deck_sum+10;}}
        }

        if(split_sum_1_2 > 21) { split_sum_1_2 = 0; }
        if(split_sum_2_2 > 21) { split_sum_2_2 = 0; } 
        
    }
    printScreen();

    if (deck_val === 0){
        return "./Cards_Image/Spades/" + ret_value + ".png";
    } else if (deck_val === 1){
        return "./Cards_Image/Hearts/" + ret_value + ".png";
    } else if (deck_val === 2){
        return "./Cards_Image/Clubs/" + ret_value + ".png";
    } else{
        return "./Cards_Image/Diamonds/" + ret_value + ".png";
    }
}

function pick_random_card(isPlayer){
    let pick_deck = Math.floor(Math.random() * 4);
    let pick_card = Math.floor(Math.random() * 13);

    delete_card(pick_deck, pick_card);

    image = return_image(pick_deck, pick_card, isPlayer);
    return image;
}

function first_draw_cards(){
    let count = 3;
    for (kartIndex; kartIndex<count; kartIndex++){
        let oyuncuKart = document.getElementById(`card-oyuncu${kartIndex}`);
        let deskKart = document.getElementById(`card-dagitici${kartIndex}`);
        
        if (oyuncuKart && deskKart) {
            temp_card = pick_random_card(true);
            oyuncuKart.src = temp_card;
            if(!is_splitted_card) {card1 = temp_card; is_splitted_card = true;}
            else {card2 = temp_card;}
            if (kartIndex !== 2){deskKart.src = pick_random_card(false); }
            else{ deskKart.src = "./Cards_Image/reverse.png" }
        } else {
            console.error(`Kart bulunamadi: card-oyuncu${kartIndex} veya card-dagitici${kartIndex}`);
        }
    }
}

function draw_card(){
    if (gameOn){
        if ( kartIndex <= 5){
        let oyuncuKart = document.getElementById(`card-oyuncu${kartIndex}`);
        if(oyuncuKart){
            oyuncuKart.src = pick_random_card(true);
            kartIndex++;
            check_sum2(true);
        } else{
            console.error(`Kart bulunamadi:`);
        }
    }
        else{
            text.textContent = "Bu ellik baska cekemezsin!";
        }

    }
}

async function skip_play(){
    if(is_splitted){
        drawButton.onclick = draw_card;
        skipButton.onclick = skip_play;
    }
    if(gameOn){
        gameOn = false
        kartIndex = 3;
        let deskKart = document.getElementById(`card-dagitici2`);
        deskKart.src = pick_random_card(false);
        if ((deck_sum || deck_sum2) <= 17 ){
            for(kartIndex; kartIndex <= 5; kartIndex++){
                if(!is_splitted){
                    if ((deck_sum || deck_sum2) > 21 || (deck_sum || deck_sum2) == 21 || (deck_sum || deck_sum2) >= player_sum){
                        break;
                    }
                    else {
                        deskKart = document.getElementById(`card-dagitici${kartIndex}`);
                        deskKart.src = pick_random_card(false);
                        check_sum2(false);
                    }
                }
                else{
                    if ((deck_sum || deck_sum2) > 21 || (deck_sum || deck_sum2) == 21 || (((deck_sum || deck_sum2) >= split_sum_1) && ((deck_sum || deck_sum2) >= split_sum_2))){
                        break;
                    }
                    else {
                        deskKart = document.getElementById(`card-dagitici${kartIndex}`);
                        deskKart.src = pick_random_card(false);
                        check_sum2(false);
                    }
                }
                await delay(delay_ms);
            }
        }

        check_final_situation();
    }
}

function auto_win(){
    if (player_sum === 21 || player_sum2 === 21){
        player_sum = 21;
        gameOn = false;
        win = true;
        finish_game()
    }
}

function start_game(){
    if (!gameOn){
        if(bet > 0){
            if (money >= bet){
                make_game_ready();
                first_draw_cards();
                auto_win();
                firstRound = false;
            }
            else{
                text.textContent = "!YOU DO NOT HAVE ENOUGH MONEY!";
            }
        }
        else{
            text.textContent = "!BET MUST BE HIGHER THAN 0$!";
        }
    }
}

function draw_splitted_card2(){
    let oyuncuKart = document.getElementById(`card-oyuncu${kartIndex}`);
    oyuncuKart.src = pick_random_card(true);
    kartIndex--;
    check_sum2(true);

    if(kartIndex === 0) {skip_play();}
}

function draw_splitted_card1(){
    let oyuncuKart = document.getElementById(`card-oyuncu${kartIndex}`);
    oyuncuKart.src = pick_random_card(true);
    kartIndex++;
    check_sum2(true);

    if(kartIndex === 7) {split_round2();}
}

function split_round1(){
    drawButton.onclick = draw_splitted_card1;
    skipButton.onclick = split_round2;
    let oyuncuKart;
    let oyuncuKart2;
    for(let tmp_index = 1; tmp_index<=6; tmp_index++) {
        oyuncuKart = document.getElementById(`card-oyuncu${tmp_index}`);
        oyuncuKart.src = "";
    }

    oyuncuKart = document.querySelector("#card-oyuncu3");
    oyuncuKart.src = card1;
    oyuncuKart2 = document.querySelector("#card-oyuncu4");
    oyuncuKart2.src = card2;

    kartIndex = 5;
}

function split_round2(){
    text.textContent = "YOU DRAW CARD FOR LEFT SIDE RIGHT NOW! IF YOU DRAW 2 CARD, IT WILL AUTO SKIP ROUND! (SU AN SOL TARAF ICIN KART CEKIYORSUN! EGER 2 KART CEKERSEN OTOMATIK OLARAK SKIP ROUND YAPACAK!)"
    is_round1 = false;
    drawButton.onclick = draw_splitted_card2;
    skipButton.onclick = skip_play;

    kartIndex = 2;   
}


function split_cards(){
    if(player_card1 === 11){player_card1 = 10;}
    if(player_card1 === 12){player_card1 = 10;}
    if(player_card1 === 13){player_card1 = 10;}

    if(player_card2 === 11){player_card2 = 10;}
    if(player_card2 === 12){player_card2 = 10;}
    if(player_card2 === 13){player_card2 = 10;}

    if(player_card1 === player_card2 && !is_splitted && gameOn){
        if(money >= bet){
            text.textContent = "BE CAREFUL! YOU CAN ONLY DRAW 2 CARDS FOR EACH SIDE! "
            text.textContent += " FIRST ROUND YOU WILL DRAW FOR RIGHT SIDE! IF YOU DRAW 2 CARD, IT WILL AUTOMATICLY SKIP TO LEFT SIDE! SKIP ROUND BUTTON WILL SKIP YOU TO LEFT SIDE! (2 TARAFA DA SADECE EKSTRA 2 KART CEKILEBILIR! ILK ROUND SAG TARAF ICIN KART CEKERSIN! EGER 2 KART CEKMISSEN OTOMATIK OLARAK SOL TARAFA GECER! SKIP ROUND BUTONU SIZI SOL TARAFA GECIRIR!)"
            split_sum_1 = player_sum / 2;
            split_sum_2 = split_sum_1;
            is_splitted = true;

            money -= bet;

            playerMoney.textContent = "Money: " + money +"$"
            playerBet.textContent = "Bet: " + bet + " | " +  bet + "$";

            bet *= 2;

            split_round1();
        }
        else{
            text.textContent = "YOU DONT HAVE ENOUGH MONEY SORRYYYY!!! ( YETERINCE PARAN YOK FAKIRSIN :(((( ) "
        }
    }
    else if(is_splitted) {text.textContent = "ROUND ALREADY SPLITTED! SPLIT ONLY USABLE ONCE! (HALIHAZIRDA SPLIT KULLANDIN! SPLIT SADECE 1 KEZ KULLANILABILIR!)";}
    else{
        text.textContent = "THIS ROUND IS NOT SPLITABLE!! (BU ROUND SPLIT YAPILAMAZ!) YOU NEED 2 SAME VALUE CARD FOR SPLIT! (SPLIT ICIN 2 AYNI KARTA SAHIP OLMAN LAZIM!)"
    }
    
}