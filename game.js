main();

function main() {

    // initialise all page elements
    const options = Array.from(document.querySelectorAll(".option"));
    const output = document.querySelector(".output");
    const userScoreTag = document.querySelector(".user-score");
    const compScoreTag = document.querySelector(".computer-score");
    const play = document.querySelector('.play');
    let buttonsActive = false;

    // play game when user clicks on play button
    play.addEventListener('click', () => {
        toggleDiv("menu");
        buttonsActive = playGame(options, buttonsActive, output, userScoreTag, compScoreTag);
    });
}

function playGame(options, buttonsActive, output, userScoreTag, compScoreTag) {

    // initialise the game
    const scores = {userScore: 0, compScore: 0};
    userScoreTag.textContent = "0";
    compScoreTag.textContent = "0";

    // handler to play a round of the game
    const handler = function() {
        playRound(this, scores, output, userScoreTag, compScoreTag);
    }

    // set up option button click listeners and run round handler on click
    // flag buttons as active so new listeners aren't added on replay
    if (!buttonsActive) {
        options.forEach(option => option.addEventListener('click', handler));
        buttonsActive = true;
    }

    return buttonsActive;
}

function playRound(option, scores, output, userScoreTag, compScoreTag) {
    // update user image to choice
    const userChoice = option.id;
    updateImage("user", userChoice);

    // computer makes a choice
    const compChoice = getComputerChoice();
    updateImage("computer", compChoice);

    // output results
    const result = getResult(userChoice, compChoice);
    output.textContent = result;

    // update scores
    scores.userScore = updateScore(result, scores.userScore, "win");
    scores.compScore = updateScore(result, scores.compScore, "lose");

    // update score tags with the current scores
    userScoreTag.textContent = scores.userScore;
    compScoreTag.textContent = scores.compScore;

    // end the game if there have been 5 rounds without a tie
    if (scores.userScore + scores.compScore >= 5) {
        endGame(scores.userScore, scores.compScore);
        scores.userScore = 0;
        scores.compScore = 0;
    }
}


// helper function to hide and show divs
function toggleDiv(div) {
    const divTag = document.querySelector(`.${div}`);
    divTag.classList.toggle('invisible');
}

// helper function to display the end menu
function endGame(userScore, compScore) {
    toggleDiv("menu");
    const title = document.querySelector('.menu h1');
    const result = document.querySelector('.menu .message');
    const retry = document.querySelector('.menu .retry');
    title.textContent = "Game Over";
    result.textContent = determineWinner(userScore, compScore);
    retry.textContent = "Press the play button to retry.";
}

// get a random choice for the computer
function getComputerChoice() {
    const options = ["rock", "paper", "scissors"];
    return options[Math.floor(Math.random() * options.length)];
}

// update the player's current image to a new image
function updateImage(player, newImg) {
    const currentImage = document.querySelector(`.${player} i`);
    currentImage.classList.remove(currentImage.classList[1]);
    currentImage.classList.add(`fa-hand-${newImg}-o`);
}

// determine the round winner given two selections
function getResult(playerSelection, computerSelection) {

    // group all scenarios in which the computer wins
    if ((playerSelection === "rock" && computerSelection === "paper") ||
        (playerSelection === "paper" && computerSelection === "scissors") ||
        (playerSelection === "scissors" && computerSelection === "rock")) {
            // computer wins
            return `You lose! ${computerSelection} beats ${playerSelection}.`;
    }

    // group all scenarios in which the user wins
    else if ((playerSelection === "rock" && computerSelection === "scissors") ||
             (playerSelection === "paper" && computerSelection === "rock") ||
             (playerSelection === "scissors" && computerSelection === "paper")) {
            // user wins
            return `You win! ${playerSelection} beats ${computerSelection}.`;
    }

    // therefore the remaining scenario is where they picked the same
    else {
        return `It was a draw! You both picked ${playerSelection}.`;
    }
}

function updateScore(roundResult, currentScore, searchStr) {
    // increment score if result of that round contains the search string
    return (roundResult.includes(searchStr)) ? ++currentScore : currentScore;
}

function determineWinner(playerScore, computerScore) {
    // the player wins
    if (playerScore > computerScore) {
        return `You have won! You scored ${playerScore} and the computer scored ${computerScore}.`;
    }
    
    // the computer wins
    else if (playerScore < computerScore) {
        return `You have lost! You scored ${playerScore} and the computer scored ${computerScore}.`;
    }

    // it was a tie
    else {
        return `It was a tie! You both scored ${playerScore}`;
    }
}