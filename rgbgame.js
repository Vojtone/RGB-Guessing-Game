var header_color = document.getElementById("header_color");
var sq1 = document.getElementById("sq1");
var sq2 = document.getElementById("sq2");
var sq3 = document.getElementById("sq3");
var sq4 = document.getElementById("sq4");
var sq5 = document.getElementById("sq5");
var sq6 = document.getElementById("sq6");
var newColorsButton = document.getElementById("newColors");
var easyButton = document.getElementById("easy");
var hardButton = document.getElementById("hard");
var info = document.getElementById("info");
var progress = document.querySelector(".progress");
var scoreBar = document.getElementById("score");
var answer;
var easyAnswer;
var easy = [];
var hardModeFlag = true;
var easyModeFlag = false;
var numberOfAnswers = 0;
var correctAnwers = 0;
var r = 69;
var g = 133;
var b = 204;
var rSign = true;
var gSign = false;
var bSign = false;

function resetScore() {
    numberOfAnswers = 0;
    correctAnwers = 0;
    scoreBar.style.width = "100%";
    scoreBar.setAttribute("aria-valuenow", "100");
    scoreBar.style.color = "seashell";
};

progress.addEventListener("click", resetScore);
progress.addEventListener("mouseover", function(){
    scoreBar.textContent = "Reset";
});
progress.addEventListener("mouseout", function(){
    scoreBar.textContent = "Score";
});
scoreBar.style.backgroundColor = "rgb(69, 133, 204)";

function changeColorR(){
    if (r === 255) rSign = false;
    if (r === 0) rSign = true;
    if(r < 256 && rSign === true) r++;
    if (r > 0 && rSign === false) r--;
};
function changeColorG(){
    if (g === 255) gSign = false;
    if (g === 0) gSign = true;
    if(g < 256 && gSign === true) g++;
    if (g > 0 && gSign === false) g--;
};
function changeColorB(){
    if (b === 255) bSign = false;
    if (b === 0) bSign = true;
    if(b < 256 && bSign === true) b++;
    if (b > 0 && bSign === false) b--;
};

setInterval(changeColorR, 20);
setInterval(changeColorG, 40);
setInterval(changeColorB, 60);
setInterval(function(){
    scoreBar.style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")";
}, 20);

function easyMode() {
    hardModeFlag = false;
    easyButton.classList.add("highlight");
    hardButton.classList.remove("highlight");
    easyButton.removeEventListener("click",easyMode);
    hardButton.addEventListener("click",hardMode);
    
    if(!easyModeFlag) {
        easyModeFlag = true;
        easyAnswer = Math.floor(Math.random()*3)+1;
        var tmp = window["sq" + answer].style.backgroundColor;
        window["sq" + answer].style.backgroundColor = window["sq" + easyAnswer].style.backgroundColor;
        window["sq" + easyAnswer].style.backgroundColor = tmp;
        answer = easyAnswer;
        for (var i=1; i<4; i++) {
            if (i === answer) continue;

            var easyTmp = easy.pop();
            var tmp = window["sq" + i].style.backgroundColor;
            window["sq" + i].style.backgroundColor = window["sq" + easyTmp].style.backgroundColor;
            window["sq" + easyTmp].style.backgroundColor = tmp;
        }
    }
    
    for (var i=1; i<4; i++) {
        window["sq" + i].classList.remove("disappear");
    }
    
    for (var i=4; i<7; i++) {
        window["sq" + i].classList.add("disappear");
    }
    
};

function hardMode() {
    hardModeFlag = true;
    hardButton.classList.add("highlight");
    easyButton.classList.remove("highlight");
    hardButton.removeEventListener("click",hardMode);
    easyButton.addEventListener("click",easyMode);
    for (var i=1; i<7; i++) {
        window["sq" + i].classList.remove("disappear");
    }
}

function reset() { 
    var liczby = [];
    for (var i=0; i<18; i++) {
        liczby.push(Math.floor((Math.random()*256)));
    }

    var correct = [];
    for (var i=0; i<3; i++) {
        correct[i] = liczby.pop();
    }

    //changing RGB in header
    header_color.textContent = correct[0] + ", " + correct[1] + ", " + correct[2];

    answer = Math.floor((Math.random()*6))+1;
    for (var i=0; i<2; i++) {
        while(true) {
            easy[i] = Math.floor((Math.random()*6))+1;
            if (i === 1 && easy[i] !== answer && easy[i] !== easy[i-1]) break;
            if (i === 0 && easy[i] !== answer) break;
        }
    }
    
    window["sq" + answer].style.backgroundColor = "rgb(" + correct[0] + ", " + correct[1] + ", " +correct[2] + ")";

    for (var i=1; i<7; i++) {
        if (answer === i) continue;
        str = "rgb("
        for (var j=0; j<3; j++) {
            str = str + liczby.pop() + ", "; 
        }
        str = str.slice(0, -2);
        str = str + ")";
        window["sq" + i].style.backgroundColor = str;
    }
    
    for (var i=1; i<7; i++) {
        window["sq" + i].classList.remove("disappear");
    }
    info.textContent = "";
    for (var i=1; i<7; i++) {
        window["sq" + i].addEventListener("click", check);
    }
    newColorsButton.addEventListener("click",reset);
    
    if (!easyModeFlag) easyButton.addEventListener("click",easyMode);
    else hardButton.addEventListener("click",hardMode);
    
    
    if(hardModeFlag) easyModeFlag = false;
    if(easyModeFlag) {
        easyModeFlag = false;
        easyMode();
    }
};

function check() {
    if (this.id[2] === String(answer)) {
        info.textContent = "Great!";
        for (var i=1; i<7; i++) {
            window["sq" + i].removeEventListener("click",check);
        }
        numberOfAnswers++;
        correctAnwers++;
        for (var i=1; i<7; i++) {
            window["sq"+i].style.backgroundColor = window[this.id].style.backgroundColor;
        }
        setTimeout(reset, 2000);
    } else {
        if (!window[this.id].classList.contains("disappear")) numberOfAnswers++;
        window[this.id].classList.add("disappear");
        if (!(easyModeFlag === true && (this.id[2] == 4 || this.id[2] == 5 || this.id[2] == 6))) {
            info.textContent = "Try again!";
        }
    }
    scoreBar.setAttribute("aria-valuenow", correctAnwers/numberOfAnswers*100);
    scoreBar.style.width = (correctAnwers/numberOfAnswers)*100 + "%";
    if (Number(scoreBar.getAttribute("aria-valuenow")) < 15) scoreBar.style.color = "black";
    else scoreBar.style.color = "seashell";
};

reset();
