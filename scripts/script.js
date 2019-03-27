
const SPADES = 0, HEARTS=1, CLUBS=2, DIAMONDS=3;
const cardIcons = Object.freeze({0:`♠`, 1:`♥`, 2:`♣`, 3:`♦`});
const cardColors = Object.freeze({0:`black`, 1:`red`, 2:`black`, 3:`red`});
const cardNum2Char = Object.freeze({1:`Ace`, 2:`2`, 3:`3`, 4:`4`, 5:`5`, 6:`6`, 7:`7`, 8:`8`, 9:`9`, 10:`10`, 11:`Jack`, 12:`QQ`, 13:`K`});
const cardNum2Value = Object.freeze({1: 11, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10, 11:10, 12:10, 13:10});

const GAME_PLAYER_PLAY = 0, 
      GAME_DEALER_PLAY=1, 
      GAME_PLAYER_WINS=2, 
      GAME_DEALER_WINS=3,
      GAME_WELCOME=4,
      GAME_RESET=5;

let state = GAME_WELCOME;
const deck = new Deck();
const dealer = new Hand();
const player = new Hand();
let hitButton, standButton, newGameButton, labelPlayer, labelDealer,
    dealerHand, playerHand;

$( document ).ready(function() {
    //initialize reference to dom objects
    dealer.setElements(document.querySelector(`.dealer-cards .deck`));
    player.setElements(document.querySelector(`.your-cards .deck`));
    
    hitButton = document.querySelector(`#action-hit`);
    standButton = document.querySelector(`#action-stand`);
    newGameButton = document.querySelector(`#action-new-game`);

    labelDealer = document.querySelector(`.dealer-cards>h1`);
    labelPlayer = document.querySelector(`.your-cards>h1`);
    dealerHand = document.querySelector(`.dealer-cards`);
    playerHand = document.querySelector(`.your-cards`);
    
    newGameButton.addEventListener(`click`, newGameHandler);
    hitButton.addEventListener(`click`, hitHandler);
    standButton.addEventListener(`click`, standHandler);
    state = GAME_WELCOME;
    updateView();
});


function hitHandler() {
    console.log(`hit!`)
    player.getCards(deck.getCards(1));
    let score = player.getPoints();
    if(score === 21) {
        state = GAME_PLAYER_WINS;
    } else if (score > 21) {
        state = GAME_DEALER_WINS;
    } else if (player.hand.length == 5) {
        state = GAME_PLAYER_WINS;
    } 
    updateView();
}

//return t othe starter state
function newGameHandler() {
    // dealer.getCards(deck.getCards(2))
    state = GAME_RESET;
    player.viewPoos();
    dealer.viewPoos();
    
    deck.newDeck();
    deck.deckShuffle();
    player.emptyHand();
    dealer.emptyHand();

    player.getCards(deck.getCards(2));
    dealer.getCards(deck.getCards(1));
    
    
    updateView();
}
function standHandler() {
    state = GAME_DEALER_PLAY;
    updateView();
}


function viewCards() {
    dealer.viewCards();
    player.viewCards();
}

function viewPoints() {
    labelDealer.innerHTML = `莊家： ${dealer.getPoints()}點`
    labelPlayer.innerHTML = `You： ${player.getPoints()}點`
}

function dealerPlay(playerPoints) {
    dealer.getCards(deck.getCards(1))
    
    const dealerPoints = dealer.getPoints();
    if(dealerPoints === 21) {
        state = GAME_DEALER_WINS;
    } else if(dealerPoints > 21) {
        state = GAME_PLAYER_WINS;
    } else if (dealer.hand.length == 5) {
        state = GAME_DEALER_WINS;
    } else {
        if(dealerPoints >= playerPoints) {
            state = GAME_DEALER_WINS; 
        } else {
            //dealer play again
        }
    }
    updateView();
}

function updateView() {
    switch(state) {
        case GAME_RESET:
            hitButton.removeAttribute(`disabled`);
            standButton.removeAttribute(`disabled`);
            viewCards();
            if(playerHand.classList.contains(`win`)) playerHand.classList.remove(`win`)
            if(dealerHand.classList.contains(`win`)) dealerHand.classList.remove(`win`)
            state = GAME_PLAYER_PLAY;
            break;
        case GAME_WELCOME:
            dealer.viewPoos();
            player.viewPoos();
            break;
        case GAME_PLAYER_PLAY:
            player.viewCards();
            break;
        case GAME_DEALER_PLAY:
            hitButton.setAttribute(`disabled`, ``);
            standButton.setAttribute(`disabled`, ``);
            dealerPlay(player.getPoints());
            break;
        case GAME_DEALER_WINS:
            viewCards();
            hitButton.setAttribute(`disabled`, ``);
            standButton.setAttribute(`disabled`, ``);
            dealerHand.classList.add(`win`);
            break
        case GAME_PLAYER_WINS:
            viewCards();
            hitButton.setAttribute(`disabled`, ``);
            standButton.setAttribute(`disabled`, ``);
            playerHand.classList.add(`win`);
        default:
            break;
    }
    viewPoints();
}

function Deck() {
    this.deck = [];//don't make sense when client sees everything
};
Deck.prototype.getCards = function(n) {
    return this.deck.splice(0, n);
};
Deck.prototype.newDeck = function(){
    this.deck.length = 0; //delete all cards, not sure why this works
    for(let i = 0; i<52; i++){
        this.deck.push(new Card((i%13) + 1, Math.floor((i/13))))
    }
};

// Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
Deck.prototype.deckShuffle = function() {
    
    let array = this.deck;
    let currentIndex = array.length, temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
}
function Hand() {
    this.hand = [];
    this.elements = null;
}
Hand.prototype.emptyHand = function() {
    this.hand.length = 0;
}
Hand.prototype.addCard = function (c) {
    if(this.hand.length<5) this.cards.push(c);
} 
Hand.prototype.getPoints = function() {
    let sum = 0, aceCount = 0;
    this.hand.forEach((card, i)=>{
        sum += cardNum2Value[card.num];
        if(card.num === 1) {
            aceCount += 1;
        }
    })
    while(sum > 21 && aceCount>0) {
        sum -= 10;
        aceCount -= 1;
    }
    return sum;
};

Hand.prototype.getCards = function(cards) {
    cards.forEach(c => this.hand.push(c))
};
Hand.prototype.setElements = function(elements) {
    this.elements = elements;
};
Hand.prototype.viewPoos = function() {
    if(this.elements) {
        this.elements.querySelectorAll('.card>div').forEach(e=>e.innerHTML = `💩`);
        this.elements.querySelectorAll('span').forEach(e=>e.innerHTML = null);
    }
}
Hand.prototype.viewCards = function () {
    for(let i=0; i<this.hand.length && i<5; i++) {
        
        let face = this.elements.querySelector(`.Card${i+1}>div`);
        face.innerHTML = cardNum2Char[this.hand[i].num];
        face.style.color = cardColors[this.hand[i].color];
        let color = this.elements.querySelector(`.Card${i+1}>span`);
        color.innerHTML = cardIcons[this.hand[i].color];
        color.style.color = cardColors[this.hand[i].color];
    }
}

function Card(num, color) {
    this.num = num;
    this.color = color;
};
// pass in dom element
Card.prototype.setCardColor = (c) => {
    c.style.color = this.color;
};
