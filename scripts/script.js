
const SPADES = 0, HEARTS=1, CLUBS=2, DIAMONDS=3;
const cardIcons = Object.freeze({0:`♠`, 1:`♥`, 2:`♣`, 3:`♦`});
const cardColors = Object.freeze({0:`black`, 1:`red`, 2:`black`, 3:`red`});
const cardNum2Char = Object.freeze({1:`Ace`, 2:`2`, 3:`3`, 4:`4`, 5:`5`, 6:`6`, 7:`7`, 8:`8`, 9:`9`, 10:`10`, 11:`Jack`, 12:`QQ`, 13:`K`});

const deck = new Deck();
const dealer = new Hand();
const player = new Hand();

$( document ).ready(function() {
    dealer.setElements(document.querySelector(`.dealer-cards .deck`));
    player.setElements(document.querySelector(`.your-cards .deck`));
    resetGame();
    
});

//return t othe starter state
function resetGame() {
    dealer.viewPoos();
    player.viewPoos();
    // document.querySelectorAll('.card').forEach(e=>{;
    //     let num = e.querySelector('div');
    //     num.innerHTML = `💩`;
    //     // num.style.color = `transparent`
    //     // num.style['text-shadow'] = `0 0 0 red`
    //     let color = e.querySelector('span');
    //     // color.innerHTML = cardIcons[HEARTS];
    //     // color.style.color = cardColors[HEARTS];
    // });

    
    deck.newDeck();
    deck.deckShuffle();
    dealer.getCards(deck.getCards(2))
    dealer.getPoint();
    player.getCards(deck.getCards(2))
    player.getPoint();
    updateHTML()
    //enable player interface
    
}

function updateHTML() {
    dealer.viewCards();
    player.viewCards();
    let hitbutton = document.querySelector('#action-hit');
    hitbutton.removeAttribute('disabled');
    hitbutton.addEventListener('click', playerHit);
    let standbutton = document.querySelector('#action-stand');
    standbutton.removeAttribute('disabled');
    standbutton.addEventListener('click', playerStand);
}
function playerHit() {
    console.log(`hit!`);
    //send card
}

function playerStand() {
    console.log(`stand...`);
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
    
    return array;
    
}
function Hand() {
    this.hand = [];
    this.elements = null;
}
Hand.prototype.addCard = function (c) {
    this.cards.push(c);
} 
Hand.prototype.getPoint = function() {console.log(this.hand)};
Hand.prototype.getCards = function(cards) {
    cards.forEach(c => this.hand.push(c))
};
Hand.prototype.setElements = function(elements) {
    this.elements = elements;
};
Hand.prototype.viewPoos = function() {
    if(this.elements) {
        this.elements.querySelectorAll('div', e=>e.innerHTML = `💩`);
        this.elements.querySelectorAll('span', e=>e.innerHTML = null);
    }
}
Hand.prototype.viewCards = function () {
    for(let i=0; i<this.hand.length; i++) {
        console.log(this.elements)
        let face = this.elements.querySelector(`#Card${i+1} div`);
        console.log(face);
        face.innerHTML = cardNum2Char[this.hand[i].num];
        face.style.color = cardColors[this.hand[i].color];
        let color = this.elements.querySelector(`#Card${i+1} span`);
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
