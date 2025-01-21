class CapybaraPet {
    constructor() {
        this.stats = {
            happiness: 100,
            food: 100,
            water: 100,
            cleanliness: 100,
            energy: 100    // Add energy stat
        };
        
        this.decreaseInterval = 5000; // Stats decrease every 5 seconds
        this.petName = localStorage.getItem('petName') || 'My Capybara';
        this.defaultImage = 'capybara.png';
        this.sleepImage = 'capy_sleep.png';
        this.leftImage = 'capy_left.png';
        this.isHovering = false;
        this.init();
        this.initNameInput();
        this.initImageHover();
    }

    init() {
        // Start decreasing stats over time
        setInterval(() => this.decreaseStats(), this.decreaseInterval);
        
        // Add click listeners to buttons
        document.querySelectorAll('.status-button').forEach(button => {
            button.addEventListener('click', () => {
                const statType = button.id;
                this.increaseStats(statType);
                this.updateDisplay();
            });
        });
    }

    initNameInput() {
        const nameInput = document.getElementById('pet-name');
        nameInput.value = this.petName;
        
        nameInput.addEventListener('change', () => {
            this.petName = nameInput.value;
            localStorage.setItem('petName', this.petName);
        });
    }

    initImageHover() {
        const capyImg = document.getElementById('capybara-img');
        
        capyImg.addEventListener('mouseenter', () => {
            this.isHovering = true;
            if (this.stats.energy > 30) {
                capyImg.src = this.leftImage;
            }
        });
        
        capyImg.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.updateCapybaraImage();
        });
    }

    updateCapybaraImage() {
        const capyImg = document.getElementById('capybara-img');
        if (this.stats.energy <= 30) {
            capyImg.src = this.sleepImage;
        } else if (this.isHovering) {
            capyImg.src = this.leftImage;
        } else {
            capyImg.src = this.defaultImage;
        }
    }

    decreaseStats() {
        for (let stat in this.stats) {
            this.stats[stat] = Math.max(0, this.stats[stat] - 5);
        }
        this.updateDisplay();
    }

    increaseStats(statType) {
        if (this.stats[statType] < 100) {
            this.stats[statType] = Math.min(100, this.stats[statType] + 20);
        }
    }

    updateDisplay() {
        for (let stat in this.stats) {
            const element = document.getElementById(stat);
            element.querySelector('span').textContent = `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${this.stats[stat]}%`;
        }
        this.updateCapybaraImage();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    const pet = new CapybaraPet();
}); 