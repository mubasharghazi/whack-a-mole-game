document.addEventListener('DOMContentLoaded', () => {
    const holes = document.querySelectorAll('.hole');
    const moles = document.querySelectorAll('.mole');
    const scoreDisplay = document.getElementById('score');
    const timeLeftDisplay = document.getElementById('time-left');
    const startButton = document.getElementById('start-button');
    
    let lastHole;
    let timeUp = false;
    let score = 0;
    let timeLeft = 30;
    let gameTimer;
    let moleTimer;

    // Function to get a random time for mole to pop up
    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    // Function to get a random hole
    function randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        
        // Avoid the same hole twice in a row
        if (hole === lastHole) {
            return randomHole(holes);
        }
        
        lastHole = hole;
        return hole;
    }

    // Function to make a mole appear
    function peep() {
        const time = randomTime(500, 1500);
        const hole = randomHole(holes);
        const mole = hole.querySelector('.mole');
        
        mole.classList.add('up');
        
        setTimeout(() => {
            mole.classList.remove('up');
            if (!timeUp) {
                peep();
            }
        }, time);
    }

    // Function to start the game
    function startGame() {
        scoreDisplay.textContent = '0';
        timeLeftDisplay.textContent = '30';
        score = 0;
        timeLeft = 30;
        timeUp = false;
        startButton.disabled = true;
        
        // Start the countdown
        gameTimer = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(gameTimer);
                timeUp = true;
                startButton.disabled = false;
                alert(`Game Over! Your score is ${score}`);
            }
        }, 1000);
        
        // Start the moles
        peep();
    }

    // Function to handle whacking a mole
    function whack(e) {
        if (!e.isTrusted) return; // Cheater!
        
        if (this.classList.contains('up')) {
            score++;
            this.classList.remove('up');
            scoreDisplay.textContent = score;
            
            // Add hit animation
            this.parentNode.classList.add('hit');
            setTimeout(() => {
                this.parentNode.classList.remove('hit');
            }, 300);
        }
    }

    // Add event listeners
    moles.forEach(mole => mole.addEventListener('click', whack));
    startButton.addEventListener('click', startGame);

    // Add sound effects
    function addSoundEffects() {
        const hitSound = new Audio('https://assets.codepen.io/21542/howler-push.mp3');
        
        moles.forEach(mole => {
            mole.addEventListener('click', () => {
                if (mole.classList.contains('up')) {
                    hitSound.currentTime = 0;
                    hitSound.play();
                }
            });
        });
    }

    // Try to add sound effects, but don't break the game if it fails
    try {
        addSoundEffects();
    } catch (error) {
        console.log('Sound effects could not be loaded');
    }
});
