var availableHeroes =[
    "hanzo",
    "mei",
    "zen",
    "moira",
    "mercy",
    "ana",
    "lucio",
    "rein",
    "hog",
    "orisa",
    "dva",
    "genji",
    "junk",
    "symm",
    "phara",
    "bastion",
    "torb",
    "tracer",
    "zarya",
    "soldier",
    "mccree",
    "winston",
    "brigitte",
    "widow",
    "reaper"
];
var cards = [];
var startingTheme;
var whoosh;
var backgroundTheme;
var optionMute;
var selectedHeroes = [];
var tempHeroes = [];

initApp();

function initApp() {
    startingTheme = document.getElementById("startingTheme");
    whoosh = document.getElementById("whoosh");
    backgroundTheme = document.getElementById("backgroundTheme");
    document.getElementById("btn-play").addEventListener("click", handleClick_btnPlay);
    document.getElementById("optionsContainer").addEventListener("mouseenter", fadeInOptions);
    document.getElementById("optionsContainer").addEventListener("mouseleave", fadeOutOptions);
    document.getElementById("btn-start").addEventListener("click", handleClick_btnStart);

    optionMute = document.getElementsByClassName("option-restart")[0];

    optionMute.addEventListener("click", ()=>{
        backgroundTheme.volume = 0;
    });

    document.getElementById("optionsContainer").addEventListener("click", (e) => {
        console.log(e.target);
        
    });

    
    startingTheme.play();
    initHeroSelection();
}




var gameManager = {
    activeCards: [],
    compareCards() {
        if (this.activeCards.length == 2) {
            setTimeout(() => {
                if (this.activeCards[0].style.backgroundImage != this.activeCards[1].style.backgroundImage) {

                    this.activeCards.forEach(card => {
                        card.parentNode.closeCard(card.parentNode);
                    });
                }
                this.activeCards = [];

            }, 1300);
        }
    },
    addActiveCard(card) {
        if (this.activeCards.length < 2) {
            this.activeCards.push(card);
        }
    }

}

function handleClick_btnStart(){
    initPlayField();
    fadeOutOverlay_Selection();
}

function initPlayField() {
    createRandomTiles();
    cards = document.getElementsByClassName("card");
    for (let index = 0; index < cards.length; index++) {
        var card = cards[index];
        card.turned = false;
        card.openCard = (card) => {
            if (gameManager.activeCards.length < 2 && !card.turned) {
                card.turned = true;
                card.voiceline.play();
                gameManager.addActiveCard(card.childNodes[0]);
                card.parentNode.classList.add("card__maxScale");
                card.classList.add("card__turn");
                card.childNodes[0].classList.add("card__img__open");
                gameManager.compareCards();
            }

        };
        card.closeCard = (card) => {
            card.classList.remove("card__turn");
            card.childNodes[0].classList.remove("card__img__open");
            card.parentNode.classList.remove("card__maxScale");
            card.turned = false;
        };


        card.addEventListener("click", handleClick_card);
    }
}

function fadeInOptions() {
    var options = document.getElementsByClassName("option");
    for (let index = 0; index < options.length; index++) {
        const option = options[index];
        option.classList.add("option__visible");
    }
    document.getElementById("play-field").classList.add("play-field__darkened");
}

function fadeOutOptions() {
    var options = document.getElementsByClassName("option");
    for (let index = 0; index < options.length; index++) {
        const option = options[index];
        option.classList.remove("option__visible");
    }
    document.getElementById("play-field").classList.remove("play-field__darkened");

}
function createTempHeroArray() {
    
    if(selectedHeroes.length == 0){
        for (let index = 0; index < availableHeroes.length; index++) {
            const hero = availableHeroes[index];
            selectedHeroes.push(hero);        
        }
    }    
    for (let index = 0; index < selectedHeroes.length; index++) {
        const hero = selectedHeroes[index];
        tempHeroes.push(hero);        
    }
   
}

function createRandomTiles() {
    createTempHeroArray();
    
    var heroCounter = selectedHeroes.length * 2;
    var cardArr = [];

    var cardContainer = document.getElementById("cardContainer");

    for (let index = 0; index < heroCounter; index++) {
        if (index == heroCounter / 2) {
            createTempHeroArray();
        }
        var imgIndex = Math.floor(Math.random() * tempHeroes.length);
        var hero = tempHeroes[imgIndex];

        var cardScaleDiv = document.createElement("div");
        cardScaleDiv.classList.add("card__scale");

        var cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        cardDiv.voiceline = document.createElement("audio");
        cardDiv.voiceline.src = "./music/heroes/" + hero + ".mp3";

        var cardImg = document.createElement("div");
        cardImg.classList.add("card__img");
        cardImg.style.backgroundImage = "url('./images/heroes/" + hero + ".png')";
        tempHeroes.splice(imgIndex, 1);

        cardDiv.appendChild(cardImg);
        cardScaleDiv.appendChild(cardDiv);

        do {
            var cardIndex = Math.floor(Math.random() * heroCounter);
        } while (cardArr[cardIndex] != undefined);
        cardArr[cardIndex] = cardScaleDiv;

    }
    for (let index = 0; index < cardArr.length; index++) {
        cardContainer.appendChild(cardArr[index]);

    }

}

function handleClick_card() {
    this.openCard(this);
}

function fadeAudio(duration, srcAudio, fadeOut, toVol) {

    var step = duration / 100;
    if (fadeOut) {
        var fadeInterval = setInterval(function() {
            srcAudio.volume -= 0.01;
            if (srcAudio.volume <= 0.01) {
                srcAudio.pause();
                clearInterval(fadeInterval);
            }
        }, step);
    } else {
        srcAudio.volume = 0;
        srcAudio.play();
        var fadeInterval = setInterval(function() {
            srcAudio.volume += 0.01;
            if (srcAudio.volume >= toVol) {
                clearInterval(fadeInterval);
            }
        }, step);
    }

}

function handleClick_btnPlay() {
    this.removeEventListener("click", handleClick_btnPlay);
    whoosh.play();
    fadeAudio(2500, startingTheme, true);
    fadeOutOverlay_Start();
    
}

function fadeOutOverlay_Start() {    
    TweenMax.to("#btn-play", 1, {
        opacity: 0,
        y: -100
    });

    TweenMax.to(".overlay-start", 1.7, {
        delay: 1.5,
        y: "-110%",
        opacity: 0,
        ease: Expo.easeInOut
    });

    TweenMax.from("#overlay-selection", 1.7, {
        delay: 1.5,
        y: "100%",
        opacity: 0,
        ease: Expo.easeInOut,
        onComplete: () => {
            fadeAudio(2500, backgroundTheme, false, 0.2);
            backgroundTheme.loop = true;

        }
    });
}

function fadeOutOverlay_Selection() {    
    TweenMax.to("#btn-start", 1, {
        opacity: 0,
        y: -100
    });

    TweenMax.to("#selection-container", 1.5, {
        scaleX: .2,
        scaleY: .2,
        opacity: 0,
        ease: Expo.easeIn
    });
    TweenMax.to("#overlay-selection", 1.7, {
        delay: 2,
        y: "-110%",
        opacity: 0,
        ease: Expo.easeInOut
    });

    TweenMax.from("#play-field", 1.7, {
        delay: 2,
        y: "100%",
        opacity: 0,
        ease: Expo.easeInOut,
        onComplete: () => {
            body.style["overflow-y"] = "auto";
        }
    });
}


function initHeroSelection() {
    for (let index = 0; index < availableHeroes.length; index++) {
        var hero = availableHeroes[index];
        var selectionTile = document.createElement("div");
        selectionTile.classList.add("selectionTile");
        selectionTile.classList.add("selectionTile_unselected");
        selectionTile.selected = false;
        selectionTile.hero = hero;

        var selectionTile_img = document.createElement("img");
        selectionTile_img.src = './images/heroes/' + hero + '.png';
        selectionTile_img.classList.add("selectionTile_img");  
        selectionTile.appendChild(selectionTile_img);           
        document.getElementById("selection-container").appendChild(selectionTile);

        selectionTile.addEventListener("mouseenter", scaleImgDown);
        selectionTile.addEventListener("mouseleave", scaleImgUp);
        selectionTile.addEventListener("click", (e) => {
            tile = e.target;
            if(tile.selected){
                selectedHeroes.splice(selectedHeroes.indexOf(tile.hero), 1);
                tile.addEventListener("mouseleave", scaleImgUp);
                tile.classList.add("selectionTile_unselected");
                tile.classList.remove("selectionTile_selected");
            }else{
                selectedHeroes.push(tile.hero);
                tile.removeEventListener("mouseleave", scaleImgUp);
                tile.classList.remove("selectionTile_unselected");
                tile.classList.add("selectionTile_selected");
            }
            tile.selected = !tile.selected;
            
            
        });


        
    }
}

function scaleImgDown() {
    var node = this.childNodes[0];    
    TweenMax.to(node, .2, {
        scaleX: .8,
        scaleY: .8,
        ease: Power1.easeOut
    });           
}

function scaleImgUp() {
    var node = this.childNodes[0];    
    TweenMax.to(node, .2, {
        scaleX: 1,
        scaleY: 1,
        ease: Power1.easeOut
    });           
}
