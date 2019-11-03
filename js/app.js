/*
 * Copyright (c) 2019
 * Rock Paper Scissors halloween
 * author Roy Sharoni
 */

'use strict'

//home page
const homePage = document.querySelector('.home-page');
const textWrapper = document.querySelector('.text-wrapper');
const startBtn = document.querySelector('.start-btn');

// avatar page
const avatarPage = document.querySelector('.avatar-page');
const avatarElements = document.querySelectorAll('.avatar-page > div > *');
const avatarImg = avatarPage.querySelector('.avatar-img');
const inputName = avatarPage.querySelector('input');
const imgList = avatarPage.querySelector('.avatar-img-list');
const nextBtn = avatarPage.querySelector('.next-btn');

// game mode page

let gameMode = document.querySelector('.game-mode-page');
let gameModesElements = gameMode.querySelectorAll('.game-mode-page > div > *');
const singleBtn = gameMode.querySelector('.single-btn');
const multiBtn = gameMode.querySelector('.multi-btn');
const backAvatarBtn = gameMode.querySelector('.back-avatar-btn');


// game page
const gamePage = document.querySelector('.game-page');
//player 1 - the user
const player1Details = gamePage.querySelector('.player1-details');
const player1Name = player1Details.querySelector('h2');
const player1Img = player1Details.querySelector('.player1-img');

const player1Hand = gamePage.querySelector('.player1-hand');
const player1HandImg = gamePage.querySelector('.player1-hand img');

//player 2 - the computer or multi player user
const player2Details = gamePage.querySelector('.player2-details');
const player2Name = player2Details.querySelector('h2');
const player2Img = player2Details.querySelector('.player2-img');

// messages in game
const player2Hand = gamePage.querySelector('.player2-hand');
const player2HandImg = gamePage.querySelector('.player2-hand img');
const msgInfo = gamePage.querySelector('.msg.info');
const msgChooseHand = gamePage.querySelector('.msg.choose-hand');
const msgNumbers = gamePage.querySelector('.msg.numbers');

// buttons for user - hands
const controls = gamePage.querySelector('.controls');
const controlBtns = gamePage.querySelectorAll('.controls > button');

// end turn win, lose, draw imgs
const bigWinIcon = gamePage.querySelector('.big-win-icon');
const bigLoseIcon = gamePage.querySelector('.big-lose-icon');
const bigDrawIcon = gamePage.querySelector('.big-draw-icon');

// end game message
const endGameMsg = gamePage.querySelector('.end-game-msg');
const endTitle = endGameMsg.querySelector('.end-title');
const playAgainBtn = endGameMsg.querySelector('.play-again-btn');
const backMenuBtn = endGameMsg.querySelector('.back-menu-btn');

const candyBarsImgs = gamePage.querySelectorAll('.candy-bar img');

// side bar
const sideBar = document.querySelector('.sidebar');
// menu button - open close sidebar
const menuBtn = document.querySelector('.menu-btn');

// const tooltip = document.querySelector('.tooltip');
// const tooltipCloseBtn = document.querySelector('.tooltip .close');


// =========================================================================
// variables
// =========================================================================

//get the user object from local host
let user = getLocalhost('user') || {
    userName: '',
    avatarImg: '',
};
//get the sound object from local host
let soundConfig = getLocalhost('sound') || {
    fx: true,
    music: true
};

let avatars = ['mummy', 'frankestien', 'ghost', 'pumpkin', 'skull', 'vampire', 'voodoo'];
let pages = {
    'home': { name: 'home-page', initFunc: 'homePageInit' },
    'avatar': { name: 'avatar-page', initFunc: 'avatarPageInit' },
    'gameMode': { name: 'game-mode-page', initFunc: 'gameModePageInit' },
    'singlePlayer': { name: 'single-player-page', initFunc: 'singlePlayerPageInit' },
    'game': { name: 'game-page', initFunc: 'gamePageInit' },
};

let game = {
    turnWinnerNum: 0,
    player1: {
        userName: '',
        avatarImg: '',
        wins: 0,
        currHand: 'idle', // r s p 
        playerNum: 1
    },
    player2: {
        userName: '',
        avatarImg: '',
        wins: 0,
        currHand: 'idle', // r s p 
        playerNum: 2
    },
};

let sounds = {
    clickSfx: new initSound("./sound/click.mp3", 'fx'),
    hoverSfx: new initSound("./sound/hover.mp3", 'fx'),
    loseSfx: new initSound("./sound/evil_laugh.mp3", 'fx'),
    winSfx: new initSound("./sound/harp.mp3", 'fx'),
    winTurnSfx: new initSound("./sound/bell.mp3", 'fx'),
    loseTurnSfx: new initSound("./sound/bones.mp3", 'fx'),
    drawTurnSfx: new initSound("./sound/bat.mp3", 'fx'),
    bgMusic: new initSound("./sound/bg_music.mp3", 'music'),
}

let handsIdleAnim = [];



// =========================================================================
// init page
// =========================================================================
function init() {
    sounds.bgMusic.sound.loop = true;
    openPage('home');
    homePageInit();
}

document.addEventListener("DOMContentLoaded", init);


// =========================================================================
// home page 
// =========================================================================
function homePageInit() {
    let textWrapperChildren = homePage.querySelectorAll('.text-wrapper > *');
    // staggerFromToElements(textWrapperChildren, 0.2, 2);
    textWrapperChildren.forEach(el => {
        fadeOut(el, 0);
    })
    TweenMax.delayedCall(0.6, staggerFromToElements, [textWrapperChildren, 1, 0.2]);
}
// add evenet listeners
startBtn.addEventListener('click', () => {
    openPage('avatar');
    sounds.clickSfx.play();
    sounds.bgMusic.play();

});
startBtn.addEventListener('mouseover', () => {
    sounds.hoverSfx.play();
});

// =========================================================================
// avatar page 
// =========================================================================
function avatarPageInit() {
    // TweenMax.set(tooltip, { autoAlpha: 0 });
    avatarElements.forEach(el => {
        fadeOut(el, 0);
    });
    TweenMax.delayedCall(0.6, staggerFromToElements, [avatarElements, 1, 0.2]);


    avatarImg.innerHTML = `<img src="./img/avatars/avatar_placeholder.svg"/>`;
    if (user.userName) inputName.value = user.userName;
    if (user.avatarImg) avatarImg.innerHTML = `<img src= './img/avatars/${user.avatarImg}.png'/>`;
    function buildImgList() {
        let res = '';
        avatars.forEach(img => {
            res += `<li onclick="handleAvatarClick('${img}')" onmouseover="handleAvatarOver()"><img src="./img/avatars/${img}.png" alt="${img}"></li>`
        });
        imgList.innerHTML = res;
    }

    buildImgList();
    // call after the intro animation ends - check the if user ready
    TweenMax.delayedCall(1, isAvatarReady);
}

// add evenet listeners
nextBtn.addEventListener('click', () => {
    setLocalhost('user', user);
    openPage('gameMode');
    sounds.clickSfx.play();
});
nextBtn.addEventListener('mouseover', () => {
    sounds.hoverSfx.play();
});


inputName.addEventListener('input', (e) => {
    updateUser('userName', e.target.value);
    isAvatarReady()
});
function handleAvatarClick(img) {
    avatarImg.innerHTML = `<img src="./img/avatars/${img}.png" alt="${img}">`;
    updateUser('avatarImg', img);
    isAvatarReady();
    sounds.clickSfx.play();
}
function handleAvatarOver() {
    sounds.hoverSfx.play();
}
function isAvatarReady() {
    (user.userName && user.avatarImg) ? enableBnt(nextBtn, 0.5) : disableBnt(nextBtn, 0.5);
}


// =========================================================================
// game mode page 
// =========================================================================
function gameModePageInit() {
    // let elements = document.querySelectorAll('.game-mode-page > div > *');
    gameModesElements.forEach(el => {
        fadeOut(el, 0);
    })
    TweenMax.delayedCall(0.6, staggerFromToElements, [gameModesElements, 1, 0.2]);
}

// add evenet listeners
singleBtn.addEventListener('click', () => {
    openPage('singlePlayer');
    sounds.clickSfx.play();
});
singleBtn.addEventListener('mouseover', () => {
    sounds.hoverSfx.play();
});
backAvatarBtn.addEventListener('click', () => {
    openPage('avatar');
    sounds.clickSfx.play();
});
backAvatarBtn.addEventListener('mouseover', () => {
    sounds.hoverSfx.play();
});

// =========================================================================
// single Player Page
// =========================================================================
function singlePlayerPageInit() {
    // play against computer
    // user
    game.player1.userName = user.userName;
    game.player1.avatarImg = user.avatarImg;
    // computer
    let randomAvatar = getRandomAvatar();
    game.player2.userName = 'computer';
    game.player2.avatarImg = randomAvatar;
    openPage('game');
}

// =========================================================================
// multi Player Page
// =========================================================================
function multiPlayerPageInit() {
    // to do 
}

// =========================================================================
// game Page
// =========================================================================
function gamePageInit() {
    restartGame()
    fadeOut(controls, 0);
    disableControlBnts();
    TweenMax.set([player1Details, player2Details], { autoAlpha: 0 });
    TweenMax.set(player1Hand, { autoAlpha: 0 });
    TweenMax.set(player2Hand, { autoAlpha: 0 });
    TweenMax.set(msgInfo, { autoAlpha: 0, scale: 0.4 });
    TweenMax.set(msgChooseHand, { autoAlpha: 0, scale: 0.4 });
    TweenMax.set(msgNumbers, { autoAlpha: 0, scale: 0.4 });
    TweenMax.set(bigWinIcon, { autoAlpha: 0, scale: 0.4 });
    TweenMax.set(bigLoseIcon, { autoAlpha: 0, scale: 0.4 });
    TweenMax.set(bigDrawIcon, { autoAlpha: 0, scale: 0.4 });
    TweenMax.set(endGameMsg, { autoAlpha: 0 });

    playTurn(true);

    player1Name.textContent = game.player1.userName;
    player1Img.src = `./img/avatars/${game.player1.avatarImg}.png`;

    player2Name.textContent = game.player2.userName;
    player2Img.src = `./img/avatars/${game.player2.avatarImg}.png`;

    if (handsIdleAnim.length === 0) {
        startHandIdleAnim();
    }
}

// add evenet listeners

controlBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        game.player1.currHand = e.target.dataset.control;
        resetControlBnts();
        e.target.classList.add('active');
        showHand(game.player1);

        fadeOut(msgChooseHand);
        fadeOut(msgNumbers);
        // gameMsgTl.seek('check');
        gameMsgTl.pause();
        showHand(game.player2);
        checkWin();
        sounds.clickSfx.play();
    });
    btn.addEventListener('mouseover', (e) => {
        sounds.hoverSfx.play();
    });
});



playAgainBtn.addEventListener('click', (e) => {
    restartGame();
    sounds.clickSfx.play();
});
playAgainBtn.addEventListener('mouseover', (e) => {
    sounds.hoverSfx.play();
});
backMenuBtn.addEventListener('click', (e) => {
    handsIdleAnim[0].kill();
    handsIdleAnim[1].kill();
    handsIdleAnim = [];
    openPage('gameMode');
    sounds.clickSfx.play();
});
backMenuBtn.addEventListener('mouseover', (e) => {
    sounds.hoverSfx.play();
});


function computerHand() {
    game.player2.currHand = getComputerChoice();
}

function showHand(player) {
    let url = `./img/hands/${player.avatarImg}/${player.currHand}.svg`;
    if (player.playerNum === 1) {
        player1HandImg.src = url;
    } else {
        player2HandImg.src = url;
    }
}

function restartGame() {
    game.player1.wins = 0;
    game.player2.wins = 0;
    game.turnWinnerNum = 0;
    resetCandies();
    fadeOut(endGameMsg, 0.2);
    playTurn();
}
function playTurn(showStartMsg = false) {
    resetPlayers();
    if (showStartMsg) {
        gameMsgTl.restart();
    } else {
        gameMsgTl.seek('msgChooseHand');
        gameMsgTl.play();
    }
}

function resetPlayers() {
    game.player1.currHand = 'idle';
    game.player2.currHand = 'idle';
    showHand(game.player1);
    showHand(game.player2);
}
function resetCandies() {
    TweenMax.to(candyBarsImgs, 0.3, { autoAlpha: 0.3, ease: Power0.easeNone });
}

function checkEndGame() {
    // user win
    if (game.player1.wins === 3) {
        game.player1.currHand = 'win';
        showHand(game.player1);
        handWinAnim(player1HandImg);
        endTitle.textContent = 'You Win!'
        endGameTl.restart();
        sounds.winSfx.play();
        return;
    }

    // user lose
    if (game.player2.wins === 3) {
        game.player2.currHand = 'win';
        showHand(game.player2);
        handWinAnim(player2HandImg);
        endTitle.textContent = 'You Lose!'
        endGameTl.restart();
        sounds.loseSfx.play();
        return;
    }

    playTurn();
}

function checkWin() {
    disableControlBnts();
    let res = 'you lose';
    let player1Hand = game.player1.currHand;
    let player2Hand = game.player2.currHand;
    if (player1Hand === 'idle') player1Hand = '0';
    if (player2Hand === 'idle') player2Hand = '0';

    switch (player1Hand + player2Hand) {
        case 'rs':
        case 'pr':
        case 'sp':
        case 's0':
        case 'r0':
        case 'p0':
            game.turnWinnerNum = 1;
            game.player1.wins++;
            winTurnTl.restart();
            break;
        case 'rp':
        case 'ps':
        case 'sr':
        case '0s':
        case '0r':
        case '0p':
            game.turnWinnerNum = 2;
            game.player2.wins++;
            loseTurnTl.restart();
            break;
        case 'rr':
        case 'pp':
        case 'ss':
        case '00':
        case '00':
        case '00':
            game.turnWinnerNum = 0;
            drawTurnTl.restart();
            break;
    }
}





function resetControlBnts() {
    const pos = [0, -188, -376];
    controlBtns.forEach((btn, index) => {
        if (btn.classList.contains('active')) {
            btn.style.backgroundPosition = `"${pos[index]}px 0"`;
            btn.style.boxShadow = 'none';
        }
        btn.classList.remove('active');
    });
}
function disableControlBnts() {
    controlBtns.forEach(btn => {
        removePointerEvents(btn);
        TweenMax.to(btn, 0.5, { opacity: 0.5, ease: Power1.easeOut });
    });
}
function enableControlBnts() {
    fadeIn(controls, 0.3);
    controlBtns.forEach(btn => {
        addPointerEvents(btn);
        resetControlBnts();
        TweenMax.to(btn, 0.5, { opacity: 1, ease: Power1.easeOut });
    });
}
function disableBnt(btn, duration) {
    removePointerEvents(btn);
    TweenMax.to(btn, duration, { autoAlpha: 0.4, ease: Power1.easeOut });
}
function enableBnt(btn, duration) {
    addPointerEvents(btn);
    TweenMax.to(btn, duration, { autoAlpha: 1, ease: Power1.easeOut });
}
// =========================================================================
// tabs in sidebar
// =========================================================================
function openPage(pageName) {
    var i;
    for (let key in pages) {
        let page = document.querySelector(`.${pages[key].name}`);
        TweenMax.set(page, {
            autoAlpha: 0,
            onComplete: () => {
                TweenMax.set(page, { display: 'none' });
            }
        });
    };

    let page = document.querySelector(`.${pages[pageName].name}`);
    TweenMax.set(page, { display: 'block' });
    TweenMax.to(page, 0.3, { autoAlpha: 1, ease: Power1.easeOut });

    window[`${pages[pageName].initFunc}`]();
}

// =========================================================================
// utils functions
// =========================================================================
function removePointerEvents(item) {
    item.style.pointerEvents = "none";
}
function addPointerEvents(item) {
    item.style.pointerEvents = "auto";
}

// update the user object
function updateUser(itemKey, value) {
    user[itemKey] = value;
}

function setLocalhost(itemName, item) {
    localStorage.setItem(itemName, JSON.stringify(item));
}
function getLocalhost(itemName) {
    return JSON.parse(localStorage.getItem(itemName));
}

function getComputerChoice() {
    const choices = ['r', 'p', 's'];
    const randomNum = Math.floor(Math.random() * choices.length);
    return choices[randomNum];
}
function getRandomAvatar() {
    return avatars[getRandomIntInclusive(0, avatars.length - 1)];
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}


// =========================================================================
// animations functions
// =========================================================================

function startHandIdleAnim() {
    let hands = [player1Hand, player2Hand];
    for (let index = 0; index < 2; index++) {
        let tl = new TimelineMax({ repeat: -1, yoyo: true });
        let dir = 1;
        if (index === 2) dir = -1;
        tl
            .to(hands[index], 2, { y: `+=${13 * dir}`, rotation: `+=${5}`, ease: Power0.easeOut })
            .to(hands[index], 1, { y: `-=${13 * dir}`, rotation: `-=${5}`, ease: Power0.easeOut });

        handsIdleAnim[index] = tl;
        handsIdleAnim[index].play();
    }
}


function fadeIn(el = null, duration = 1, delay = 0) {
    TweenMax.to(el, duration, { autoAlpha: 1, scale: 1, delay: delay, ease: Back.easeOut.config(1.7), force3D: false });
}
function fadeOut(el = null, duration = 0.5, delay = 0) {
    TweenMax.to(el, duration, { autoAlpha: 0, scale: 0.5, delay: delay, ease: Back.easeIn.config(1.7), force3D: false });
}

function staggerFromToElements(elements, duration, delayIteration) {
    TweenMax.staggerFromTo(elements, duration,
        {
            force3D: false,
            autoAlpha: 0,
            scale: 0.7,
        },
        {
            autoAlpha: 1,
            scale: 1,
            ease: Elastic.easeOut.config(1, 0.75),
        },
        delayIteration);
}

function startCounting() {
    let numbersEl = msgNumbers.querySelectorAll('span');
    fadeIn(msgNumbers);
    TweenMax.staggerFromTo(numbersEl, 1,
        { scale: 0.5, opacity: 0, force3D: false },
        {
            scale: 1, opacity: 1, force3D: false, ease: Back.easeIn.config(1.7),
            onComplete: function () { fadeOut(this.target, 0.5, 0) }
        }
        , 1.3);
}

// win turn 
function highlightPlayerCandy() {
    if (game.turnWinnerNum === 0) return; // draw no need to highlight
    let currPlayerCandy = game[`player${game.turnWinnerNum}`].wins;
    let candy = document.querySelector(`.player${game.turnWinnerNum}-details .candy-bar img:nth-child(${currPlayerCandy})`);
    fadeIn(candy);
}

let winTurnTl = new TimelineMax({ paused: true });
winTurnTl
    .add(() => fadeIn(bigWinIcon), 0.7)
    .add(() => sounds.winTurnSfx.play())
    .add(() => fadeOut(bigWinIcon), '+=2.5')
    .add(() => highlightPlayerCandy(), '+=1')
    .add(() => checkEndGame());


let loseTurnTl = new TimelineMax({ paused: true });
loseTurnTl
    .add(() => fadeIn(bigLoseIcon), 0.7)
    .add(() => sounds.loseTurnSfx.play())
    .add(() => fadeOut(bigLoseIcon), '+=2.5')
    .add(() => highlightPlayerCandy(), '+=1')
    .add(() => checkEndGame());


let drawTurnTl = new TimelineMax({ paused: true });
drawTurnTl
    .add(() => fadeIn(bigDrawIcon), 0.7)
    .add(() => sounds.drawTurnSfx.play())
    .add(() => fadeOut(bigDrawIcon), '+=2.3')
    .add(() => playTurn());


function handWinAnim(handImg) {
    let tl = new TimelineMax({ yoyo: true, repeat: 10, paused: true });
    tl
        .to(handImg, 0.1, { rotationY: 20, transformOrigin: "center" })
        .to(handImg, 0.2, { rotationY: -20, transformOrigin: "center" })
        .to(handImg, 0.1, { rotationY: 0, transformOrigin: "center" })

    tl.restart();
}

// create main intro timeline
let gameMsgTl = new TimelineMax({ paused: true });
gameMsgTl
    .addLabel('msgInfo')
    .add(() => resetCandies())
    .to([player1Details, player2Details], 1, { autoAlpha: 1 }, 1)
    .add(() => fadeIn(msgInfo))
    .add(() => fadeOut(msgInfo), '+=2.5')
    .to(player1Hand, 1, { autoAlpha: 1 })
    .to(player2Hand, 1, { autoAlpha: 1 }, '-=1')
    .addLabel('msgChooseHand')
    .add(() => computerHand())
    .to(player1Hand, 1.5, { top: '53%' })
    .to(player2Hand, 1.5, { bottom: '57%' }, '-=1')
    .add(() => fadeIn(msgChooseHand), '-=1.5')
    .add(() => enableControlBnts())
    .add(() => fadeOut(msgChooseHand), '+=2')
    .addLabel('msgStartCounting')
    .add(() => startCounting())
    .add(() => showHand(game.player2), '+=4')
    .add(() => checkWin());


// end game timeline
let endGameTl = new TimelineMax({ paused: true });
endGameTl
    .to(player1Hand, 0.5, { top: '+=60' }, 2)
    .to(player2Hand, 0.5, { bottom: '+=50' }, 2)
    .to(controls, 0.5, { autoAlpha: 0 }, '-=0.5')
    .add(() => fadeIn(endGameMsg, 1), 2)
    .staggerFromTo([endTitle, playAgainBtn, backMenuBtn], 1, { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.2 });


// =========================================================================
// sound functions
// =========================================================================
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle("change");
    sideBar.classList.toggle("open");
});
// =========================================================================
// music checkbox
// =========================================================================
const musicCb = document.querySelector('input[name="music"]');
musicCb.checked = soundConfig.music;
musicCb.addEventListener('change', function () {
    soundConfig.music = musicCb.checked;
    (musicCb.checked) ? sounds.bgMusic.play() : stopAllSounds('music');
    setLocalhost('sound', soundConfig);
});

// =========================================================================
// sound effects checkbox
// =========================================================================
const sfxCb = document.querySelector('input[name="sfx"]');
sfxCb.checked = soundConfig.fx;
sfxCb.addEventListener('change', function () {
    soundConfig.fx = sfxCb.checked;
    if (sfxCb.checked === false) stopAllSounds('fx');
    setLocalhost('sound', soundConfig);
});


function initSound(src, mode) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.mode = mode;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        if (this.sound.mode === 'fx' && soundConfig.fx) {
            this.currentTime = 0;
            this.sound.play();
        }

        if (this.sound.mode === 'music' && soundConfig.music) {
            this.sound.play();
        }
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function stopAllSounds(mode) {
    for (const item in sounds) {
        if (sounds[item].sound.mode === mode) {
            sounds[item].stop();
        }
    }
}


// tooltip close button
// tooltipCloseBtn.addEventListener('click', function () {
//     let parent = this.parentElement;
//     TweenMax.to(parent, 0.3, { autoAlpha: 0, ease: Power2.easeOut });
// });