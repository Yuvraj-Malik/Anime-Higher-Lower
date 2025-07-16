class AnimeHigherLowerGame {
    constructor() {
        this.characters = [];
        this.currentA = null;
        this.currentB = null;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('animeHighScore')) || 0;
        this.gameInProgress = false;
        this.isAnimating = false;

        this.initializeElements();
        this.setupEventListeners();
        this.loadCharacterData();
        this.updateHighScoreDisplay();
    }

    initializeElements() {
        this.currentScoreEl = document.getElementById('current-score');
        this.highScoreEl = document.getElementById('high-score');
        this.finalScoreEl = document.getElementById('final-score');
        this.highScoreMessageEl = document.getElementById('high-score-message');

        this.imgA = document.getElementById('imgA');
        this.nameA = document.getElementById('nameA');
        this.animeA = document.getElementById('animeA');
        this.favA = document.getElementById('favA');

        this.imgB = document.getElementById('imgB');
        this.nameB = document.getElementById('nameB');
        this.animeB = document.getElementById('animeB');
        this.comparisonName = document.getElementById('comparisonName');

        this.imgBBack = document.getElementById('imgB-back');
        this.nameBBack = document.getElementById('nameB-back');
        this.animeBBack = document.getElementById('animeB-back');
        this.favBBack = document.getElementById('favB-back');

        this.higherBtn = document.getElementById('higher-btn');
        this.lowerBtn = document.getElementById('lower-btn');
        this.cardB = document.getElementById('cardB');
        this.gameOverOverlay = document.getElementById('game-over-overlay');
        this.playAgainBtn = document.getElementById('play-again-btn');
    }

    setupEventListeners() {
        this.higherBtn.addEventListener('click', () => this.makeGuess(true));
        this.lowerBtn.addEventListener('click', () => this.makeGuess(false));
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
    }

    async loadCharacterData() {
        try {
            const response = await fetch('anime_characters.json');
            const data = await response.json();
            this.characters = this.shuffle(data.filter(char =>
                char && typeof char.favorites === 'number' && !isNaN(char.favorites)
            ));
            this.startGame();
        } catch (error) {
            console.error('Error loading character data:', error);
            alert('Failed to load character data.');
        }
    }

    startGame() {
        this.score = 0;
        this.gameInProgress = true;
        this.isAnimating = false;
        this.updateScoreDisplay();
        this.highScoreMessageEl.classList.add('hidden');
        this.gameOverOverlay.classList.add('hidden');

        this.currentA = this.getValidCharacter();
        this.currentB = this.getValidCharacter();
        while (this.currentA === this.currentB) {
            this.currentB = this.getValidCharacter();
        }

        this.updateUI();
        this.enableButtons();
        this.cardB.classList.remove('flipped');
    }

    resetGame() {
        this.startGame();
    }

    pickNewCharacters() {
        this.currentA = this.currentB;
        this.currentB = this.getValidCharacter();
        while (this.currentB === this.currentA) {
            this.currentB = this.getValidCharacter();
        }

        this.updateUI();
        this.cardB.classList.remove('flipped');
    }

    updateUI() {
        const fallbackImage = "fallback.png"; // put a local fallback image if needed

        this.imgA.onerror = () => this.imgA.src = fallbackImage;
        this.imgB.onerror = () => this.imgB.src = fallbackImage;
        this.imgBBack.onerror = () => this.imgBBack.src = fallbackImage;

        this.imgA.src = this.currentA.image;
        this.nameA.textContent = this.currentA.name;
        this.animeA.textContent = this.currentA.anime;
        this.favA.textContent = this.currentA.favorites.toLocaleString();

        this.imgB.src = this.currentB.image;
        this.nameB.textContent = this.currentB.name;
        this.animeB.textContent = this.currentB.anime;
        this.comparisonName.textContent = this.currentA.name;

        this.imgBBack.src = this.currentB.image;
        this.nameBBack.textContent = this.currentB.name;
        this.animeBBack.textContent = this.currentB.anime;
        this.favBBack.textContent = this.currentB.favorites.toLocaleString();
        this.favBBack.style.color = "#ffd93d";
        this.favBBack.style.textShadow = "none";
    }

    async makeGuess(isHigher) {
        if (!this.gameInProgress || this.isAnimating) return;
        this.isAnimating = true;
        this.disableButtons();

        const correct = isHigher
            ? this.currentB.favorites >= this.currentA.favorites
            : this.currentB.favorites < this.currentA.favorites;

        this.cardB.classList.add('flipped');

        setTimeout(() => {
            this.favBBack.style.color = correct ? '#4CAF50' : '#f44336';
            this.favBBack.style.textShadow = correct
                ? '0 0 20px rgba(76, 175, 80, 0.5)'
                : '0 0 20px rgba(244, 67, 54, 0.5)';
        }, 400);

        if (correct) {
            this.score++;
            this.updateScoreDisplay();
            setTimeout(() => {
                this.pickNewCharacters();
                this.enableButtons();
                this.isAnimating = false;
            }, 2000);
        } else {
            this.gameInProgress = false;
            setTimeout(() => {
                this.endGame();
                this.isAnimating = false;
            }, 2000);
        }
    }

    endGame() {
        this.finalScoreEl.textContent = this.score;

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('animeHighScore', this.highScore.toString());
            this.updateHighScoreDisplay();
            this.highScoreMessageEl.classList.remove('hidden');
        } else {
            this.highScoreMessageEl.classList.add('hidden');
        }

        this.gameOverOverlay.classList.remove('hidden');
    }

    updateScoreDisplay() {
        this.currentScoreEl.textContent = this.score;
    }

    updateHighScoreDisplay() {
        this.highScoreEl.textContent = this.highScore;
    }

    getValidCharacter() {
        let char;
        do {
            char = this.characters[Math.floor(Math.random() * this.characters.length)];
        } while (!char || typeof char.favorites !== 'number' || isNaN(char.favorites));
        return char;
    }

    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    enableButtons() {
        this.higherBtn.disabled = false;
        this.lowerBtn.disabled = false;
    }

    disableButtons() {
        this.higherBtn.disabled = true;
        this.lowerBtn.disabled = true;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new AnimeHigherLowerGame();
});
