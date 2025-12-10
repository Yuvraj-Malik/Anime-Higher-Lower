class Game {
    constructor() {
        this.chars = [];
        this.charA = null;
        this.charB = null;
        this.score = 0;
        this.highScore = 0;
        this.totalGuesses = 0;
        this.correctGuesses = 0;
        this.animating = false;

        this.init();
        this.loadData();
    }

    async loadData() {
        try {
            const response = await fetch('anime_characters.json');
            if (!response.ok) throw new Error('Failed to load characters');
            const data = await response.json();
            this.chars = this.shuffle(data.filter(c =>
                c && typeof c.favorites === 'number' && !isNaN(c.favorites)
            ));
            if (this.chars.length === 0) throw new Error('No valid characters found');
            this.start();
        } catch (error) {
            console.error('Error loading characters:', error);
            alert('Failed to load character data. Please make sure anime_characters.json is in the same directory as this HTML file.');
        }
    }

    init() {
        this.currentScoreEl = document.getElementById('currentScore');
        this.highScoreEl = document.getElementById('highScore');
        this.finalScoreEl = document.getElementById('finalScore');
        this.newRecordEl = document.getElementById('newRecord');
        this.modalEl = document.getElementById('gameOverModal');
        this.modalHighScoreEl = document.getElementById('modalHighScore');
        this.modalAccuracyEl = document.getElementById('modalAccuracy');

        this.leftPanel = document.getElementById('leftPanel');
        this.rightPanel = document.getElementById('rightPanel');

        this.imgA = document.getElementById('imgA');
        this.nameA = document.getElementById('nameA');
        this.animeA = document.getElementById('animeA');
        this.favA = document.getElementById('favA');
        this.bgImgA = document.getElementById('bgImgA');

        this.imgB = document.getElementById('imgB');
        this.nameB = document.getElementById('nameB');
        this.animeB = document.getElementById('animeB');
        this.favB = document.getElementById('favB');
        this.bgImgB = document.getElementById('bgImgB');
        this.compName = document.getElementById('compName');

        this.higherBtn = document.getElementById('higherBtn');
        this.lowerBtn = document.getElementById('lowerBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');

        this.higherBtn.addEventListener('click', () => this.guess(true));
        this.lowerBtn.addEventListener('click', () => this.guess(false));
        this.playAgainBtn.addEventListener('click', () => this.start());
    }

    start() {
        this.score = 0;
        this.totalGuesses = 0;
        this.correctGuesses = 0;
        this.updateScore();
        this.modalEl.classList.remove('active');

        // Reset panel positions
        this.leftPanel.className = 'game-panel';
        this.rightPanel.className = 'game-panel';

        this.charA = this.getRandom();
        this.charB = this.getRandom();
        while (this.charA === this.charB) this.charB = this.getRandom();

        this.render();
        this.enable();
    }

    render() {
        this.imgA.src = this.charA.image;
        this.nameA.textContent = this.charA.name;
        this.animeA.textContent = this.charA.anime;
        this.favA.textContent = this.charA.favorites.toLocaleString();
        this.bgImgA.src = this.charA.image;

        this.imgB.src = this.charB.image;
        this.nameB.textContent = this.charB.name;
        this.animeB.textContent = this.charB.anime;
        this.favB.textContent = '?';
        this.favB.className = 'stat-number hidden';
        this.bgImgB.src = this.charB.image;
        this.compName.textContent = this.charA.name;
    }

    async guess(higher) {
        if (this.animating) return;
        this.animating = true;
        this.disable();
        this.totalGuesses++;

        const correct = higher
            ? this.charB.favorites >= this.charA.favorites
            : this.charB.favorites < this.charA.favorites;

        if (correct) this.correctGuesses++;

        this.favB.textContent = this.charB.favorites.toLocaleString();
        this.favB.className = `stat-number ${correct ? 'correct' : 'incorrect'}`;

        await this.sleep(1500);

        if (correct) {
            this.score++;
            this.updateScore();

            // Slide animation
            this.leftPanel.classList.add('slide-out-left');
            this.rightPanel.classList.add('slide-out-left');

            await this.sleep(600);

            this.charA = this.charB;
            this.charB = this.getRandom();
            while (this.charA === this.charB) this.charB = this.getRandom();

            // Reset and prepare for slide in
            this.leftPanel.className = 'game-panel';
            this.rightPanel.className = 'game-panel slide-in-right';

            this.render();
            this.enable();
            this.animating = false;
        } else {
            await this.sleep(500);
            this.end();
        }
    }

    end() {
        const accuracy = this.totalGuesses > 0
            ? Math.round((this.correctGuesses / this.totalGuesses) * 100)
            : 0;

        this.finalScoreEl.textContent = this.score;
        this.modalHighScoreEl.textContent = Math.max(this.score, this.highScore);
        this.modalAccuracyEl.textContent = accuracy + '%';

        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreEl.textContent = this.highScore;
            this.newRecordEl.classList.remove('hidden');
        } else {
            this.newRecordEl.classList.add('hidden');
        }

        this.modalEl.classList.add('active');
        this.animating = false;
    }

    updateScore() {
        this.currentScoreEl.textContent = this.score;
    }

    getRandom() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }

    shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    enable() {
        this.higherBtn.disabled = false;
        this.lowerBtn.disabled = false;
    }

    disable() {
        this.higherBtn.disabled = true;
        this.lowerBtn.disabled = true;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

new Game();