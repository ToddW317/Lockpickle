// Game -> Jasvascript //

const MAX_ATTEMPTS = 5;
let attempts = MAX_ATTEMPTS;
let code = generateCode();
console.log(code);

window.onload = function() {
    setupInputBehavior();
    document.getElementById('attempts').textContent = attempts;
    document.querySelector('.input-box').focus(); // Focus the first input box
};

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


function makeGuess() {
    let guess = Array.from(document.querySelectorAll('.input-box')).map(input => input.value).join('');

    if (guess.length !== 4) {
        alert('Please enter a 4-digit code.');
        return;
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

    let hintMessage = getHint(guess, feedbackRow.querySelectorAll('.feedback-box'));

    if (guess === code) {
        confettiRain();
        alert('Congratulations! You cracked the code!');
        resetGame();
        resetInputBoxes();
        return;
    }

    attempts--;
    document.getElementById('attempts').textContent = attempts;

    if (attempts <= 0) {
        alert('Out of attempts! The correct code was ' + code);
        resetGame();
    }

    // Clear the input boxes for the next guess
    resetInputBoxes();

    // Focus the first input box
    document.querySelector('.input-box').focus();
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


function confettiRain() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    (function frame() {
        const timeLeft = animationEnd - Date.now();
        const ticks = Math.max(200, 500 * (timeLeft / duration));
        confetti(Object.assign({}, defaults, { particleCount: 2 * ticks, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
        if (timeLeft > 0) {
            requestAnimationFrame(frame);
        }
    }());
}

function resetGame() {
    code = generateCode();
    attempts = MAX_ATTEMPTS;
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('feedback-container').innerHTML = '';
    setupInputBehavior();
    document.querySelectorAll('.key').forEach(key => key.disabled = false);
    console.log(code);
}
