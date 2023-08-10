// Game -> Jasvascript //
var timerStarted = false;

document.getElementById("start-btn").addEventListener("click", function () {
    startTimer();
    var timeRemaining = 60;
    let attempts = 0;
    let correctCodes = 0;

    var timerInterval = setInterval(function () {
        document.getElementById("timer").textContent = timeRemaining;
        timeRemaining--;

        if (timeRemaining < 0) {
            clearInterval(timerInterval);
            correctCodes = 0;
            attempts = 0;
            document.getElementById('correct-codes-display').textContent = correctCodes;
            gameOver();
          }
    }, 1000);
});


let code = generateCode();
console.log(code);
setupInputBehavior();
var timeRemaining = 60;
let attempts = 0;
let correctCodes = 0;
currentCodeAttemptsContainer = document.createElement('div');

function generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function setupInputBehavior() {
    const inputBoxes = document.querySelectorAll('.input-box');
    inputBoxes.forEach((box, index) => {
        box.addEventListener('input', () => {
            if (index < inputBoxes.length - 1 && box.value) {
                inputBoxes[index + 1].focus();
            }
        });
        box.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                makeGuess();
            }
            if (event.key === 'Backspace' && box.value === '' && index > 0) {
                inputBoxes[index - 1].focus();
            }
        });
    });
}

var currentCodeAttemptsContainer;

function makeGuess() {
    let guess = Array.from(document.querySelectorAll('.input-box')).map(input => input.value).join('');

    if (guess.length !== 4) {
        alert('Please enter a 4-digit code.');
        return;
    }

    if (!timerStarted) {
        startTimer(); // Automatically start the timer on the first guess
        timerStarted = true;
    }

    let feedbackRow = document.createElement('div');
    feedbackRow.className = 'feedback-row';

    for (let i = 0; i < 4; i++) {
        let box = document.createElement('div');
        box.className = 'feedback-box';
        box.textContent = guess[i];
        feedbackRow.appendChild(box);
    }

    document.getElementById('feedback-container').appendChild(feedbackRow);

    // Create a copy of the feedback row
    let feedbackRowCopy = feedbackRow.cloneNode(true);
    getHint(guess, feedbackRowCopy.querySelectorAll('.feedback-box'));
    currentCodeAttemptsContainer.appendChild(feedbackRowCopy);

    let hintMessage = getHint(guess, feedbackRow.querySelectorAll('.feedback-box'));

    if (guess === code) {
        correctCodes++;
        document.getElementById('correct-codes-display').textContent = correctCodes;
        alert('Congratulations! You cracked the code!');

        appendCurrentAttemptsToSnapshots(); // Append the current attempts to the snapshots
        currentCodeAttemptsContainer = document.createElement('div'); // Reset the container for the next code

        resetKeys(); // Enable the keys again
        code = generateCode(); // Generate a new code for the next round
        console.log(code);

        // Clear the hint boxes (feedback container)
        document.getElementById('feedback-container').innerHTML = '';
    }

    // Increment the attempts
    attempts++;
    document.getElementById('attempts').textContent = attempts;

    // Clear the input boxes for the next guess
    resetInputBoxes();

    // Focus the first input box
    document.querySelector('.input-box').focus();
}


function startTimer() {
    var timeRemaining = 60;
    var timerInterval = setInterval(function () {
        document.getElementById("timer").textContent = timeRemaining;
        timeRemaining--;

        if (timeRemaining < 0) {
            clearInterval(timerInterval);
            correctCodes = 0;
            attempts = 0;
            document.getElementById('correct-codes-display').textContent = correctCodes;
            gameOver();
          }
    }, 1000);
}

function resetKeys() {
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = false;
    });
}

function appendCurrentAttemptsToSnapshots() {
    const snapshotsContainer = document.getElementById('snapshots-container');
    
    // Add a title to indicate the number of the code
    const title = document.createElement('h3');
    title.textContent = `Code ${correctCodes}`;
    snapshotsContainer.appendChild(title);

    // Append the current attempts for this code
    snapshotsContainer.appendChild(currentCodeAttemptsContainer);

    // Add a separator to divide the different code attempts
    const separator = document.createElement('hr');
    snapshotsContainer.appendChild(separator);
}


function createSnapshot(guess) {
    const snapshotContainer = document.getElementById('snapshots-container');
    const snapshot = document.createElement('div');
    snapshot.className = 'snapshot';

    for (let i = 0; i < guess.length; i++) {
        let box = document.createElement('div');
        box.className = 'snapshot-box';
        box.textContent = guess[i];
        snapshot.appendChild(box);
    }

    snapshotContainer.appendChild(snapshot);
}

function getHint(guess, boxes) {
    let correctPositions = 0;
    let numbersPresent = 0;
    let duplicates = Array(10).fill(0);

    // Counting occurrences of each digit in the code
    for (let digit of code) {
        duplicates[parseInt(digit)]++;
    }

    let duplicateCorrects = Array(4).fill(false);
    let duplicateCounts = Array(10).fill(0); // Count of correct duplicate numbers

   // First, check for numbers in the correct position and duplicates
   for (let i = 0; i < 4; i++) {
    if (guess[i] === code[i] && duplicates[parseInt(guess[i])] > 1) {
        duplicateCorrects[i] = true;
        correctPositions++;
        duplicateCounts[parseInt(guess[i])]++;
    }
}

    // Now check for other cases
    for (let i = 0; i < 4; i++) {
        if (duplicateCorrects[i] && duplicateCounts[parseInt(guess[i])] === duplicates[parseInt(guess[i])]) {
            boxes[i].style.backgroundColor = 'green'; // All duplicates are correct
        } else if (duplicateCorrects[i]) {
            boxes[i].classList.add('duplicate-correct');
        } else if (guess[i] === code[i]) {
            correctPositions++;
            boxes[i].style.backgroundColor = 'green';
        } else if (code.includes(guess[i]) && duplicates[parseInt(guess[i])] > 1) {
            numbersPresent++;
            boxes[i].style.backgroundColor = 'blue'; // Blue for duplicate numbers
        } else if (code.includes(guess[i])) {
            numbersPresent++;
            boxes[i].style.backgroundColor = 'yellow'; // Yellow for non-duplicate numbers
        } else {
            boxes[i].style.backgroundColor = 'red';
            document.querySelectorAll('.key').forEach(key => {
                if (key.textContent === guess[i]) {
                    key.disabled = true;
                }
            });
        }
    }

    return `${correctPositions} digit(s) in the correct place. ${numbersPresent} of the numbers are in the code.`;
}

function resetInputBoxes() {
    document.querySelectorAll('.input-box').forEach(input => input.value = '');
    document.querySelector('.input-box').focus(); // Focus the first input box
}

function deleteLastInput() {
    const inputBoxes = document.querySelectorAll('.input-box');
    for (let i = inputBoxes.length - 1; i >= 0; i--) {
        if (inputBoxes[i].value) {
            inputBoxes[i].value = '';
            if (i > 0) inputBoxes[i - 1].focus();
            break;
        }
    }
}

function keyPress(digit) {
    const inputBoxes = document.querySelectorAll('.input-box');
    let focusedInput = document.activeElement;

    if (focusedInput.tagName !== 'INPUT' || focusedInput.value !== '') {
        for (let box of inputBoxes) {
            if (box.value === '') {
                focusedInput = box;
                break;
            }
        }
    }

    if (focusedInput.tagName === 'INPUT') {
        focusedInput.focus();
        focusedInput.value = digit;
        let nextInput = inputBoxes[Array.from(inputBoxes).indexOf(focusedInput) + 1];
        if (nextInput) nextInput.focus();
    }
}

// document.getElementById("play-again-btn").addEventListener("click", function() {
//     restartGame();
//     closeModal();
//   });
  
//   document.querySelector(".modal-close").addEventListener("click", closeModal);
  
//   function showModal() {
//     document.getElementById('modal').style.display = "block";
//   }
  
//   function closeModal() {
//     document.getElementById('modal').style.display = "none";
//   }
  
//   function restartGame() {
//   // Reset any game variables, scores, timers, etc.
//   attempts = 0;
//   correctCodes = 0;
//   timerStarted = false;
//   code = generateCode();
//   console.log(code);

//   // Reset the display
//   document.getElementById('timer').textContent = 60;
//   document.getElementById('attempts').textContent = 0;
//   document.getElementById('correct-codes-display').textContent = 0;

//   // Clear the feedback container
//   document.getElementById('feedback-container').innerHTML = '';
//   document.getElementById('snapshots-container').innerHTML = '';

//   // Reset input boxes
//   resetInputBoxes();

//   // Enable keys again
//   resetKeys();

//   // Hide the modal
//   document.getElementById('modal').style.display = 'none';
// }

// document.getElementById('play-again-btn').addEventListener('click', restartGame);
  
//   // When the game ends, call the showModal function
//   function gameOver() {
//     // Populate score
//     document.getElementById('modal-score').textContent = 'Score: ' + correctCodes;
  
//     // Populate attempts
//     document.getElementById('modal-attempts').textContent = 'Attempts: ' + attempts;
  
//     // Populate snapshots
//     let modalSnapshotsContainer = document.getElementById('modal-snapshots');
//     let snapshotsContainer = document.getElementById('snapshots-container');
  
//     // Clone the snapshots
//     modalSnapshotsContainer.innerHTML = snapshotsContainer.innerHTML;
  
//     // Show the modal
//     showModal();
//   }
  

  