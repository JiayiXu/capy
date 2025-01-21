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
        this.happyImage = 'capy_happy.png';
        this.eatImage = 'capy_eat.png';
        this.drinkImage = 'capy_drink.png';
        this.isHovering = false;
        this.isPressed = false;
        this.isDragging = false;
        this.isEating = false;
        this.isDrinking = false;
        this.dragOffset = { x: 0, y: 0 };
        this.draggingItem = null; // Add this to track which item is being dragged
        this.init();
        this.initNameInput();
        this.initImageHover();
        this.initFoodItem();
        this.initWaterItem();
        this.initMouseMoveHandler();
        this.initPoopCheck();
        this.initShovelItem();
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

        // Add mouse press events
        capyImg.addEventListener('mousedown', () => {
            this.isPressed = true;
            if (this.stats.energy > 30) {
                capyImg.src = this.happyImage;
                this.increaseStats('happiness', 10); // Increase by 10% instead of default 20%
                this.updateDisplay();
            }
        });

        capyImg.addEventListener('mouseup', () => {
            this.isPressed = false;
            this.updateCapybaraImage();
        });

        // Handle case where mouse leaves while pressed
        capyImg.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.isPressed = false;
            this.updateCapybaraImage();
        });
    }

    initFoodItem() {
        const burgerImg = document.getElementById('burger-img');
        const capyImg = document.getElementById('capybara-img');
        
        burgerImg.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.draggingItem = 'burger'; // Track that we're dragging the burger
            
            // Calculate offset from mouse to burger image corner
            const rect = burgerImg.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            // Add dragging style
            burgerImg.style.position = 'fixed';
            burgerImg.style.pointerEvents = 'none';
            this.updateBurgerPosition(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                if (this.draggingItem === 'burger') {
                    this.updateBurgerPosition(e);
                }
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (this.isDragging && this.draggingItem === 'burger') {
                this.isDragging = false;
                this.draggingItem = null;
                burgerImg.style.position = 'static';
                burgerImg.style.pointerEvents = 'auto';
                burgerImg.style.transform = 'none';
                
                const capyRect = capyImg.getBoundingClientRect();
                if (this.isOverlapping(e.clientX, e.clientY, capyRect)) {
                    this.startEatingAnimation();
                }
            }
        });
    }

    initWaterItem() {
        const waterImg = document.getElementById('water-img');
        const capyImg = document.getElementById('capybara-img');
        
        waterImg.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.draggingItem = 'water'; // Track that we're dragging the water
            
            const rect = waterImg.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            waterImg.style.position = 'fixed';
            waterImg.style.pointerEvents = 'none';
            this.updateWaterPosition(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                if (this.draggingItem === 'water') {
                    this.updateWaterPosition(e);
                }
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (this.isDragging && this.draggingItem === 'water') {
                this.isDragging = false;
                this.draggingItem = null;
                waterImg.style.position = 'static';
                waterImg.style.pointerEvents = 'auto';
                waterImg.style.transform = 'none';
                
                const capyRect = capyImg.getBoundingClientRect();
                if (this.isOverlapping(e.clientX, e.clientY, capyRect)) {
                    this.startDrinkingAnimation();
                }
            }
        });
    }

    updateBurgerPosition(e) {
        const burgerImg = document.getElementById('burger-img');
        burgerImg.style.left = (e.clientX - this.dragOffset.x) + 'px';
        burgerImg.style.top = (e.clientY - this.dragOffset.y) + 'px';
    }

    updateWaterPosition(e) {
        const waterImg = document.getElementById('water-img');
        waterImg.style.left = (e.clientX - this.dragOffset.x) + 'px';
        waterImg.style.top = (e.clientY - this.dragOffset.y) + 'px';
    }

    isOverlapping(x, y, rect) {
        return (x >= rect.left && x <= rect.right &&
                y >= rect.top && y <= rect.bottom);
    }

    startEatingAnimation() {
        const burgerImg = document.getElementById('burger-img');
        this.isEating = true;
        let count = 0;
        const maxCount = 6; // 3 seconds / 500ms = 6 switches
        
        // Hide burger during animation
        burgerImg.style.visibility = 'hidden';
        
        const eatInterval = setInterval(() => {
            if (count >= maxCount) {
                clearInterval(eatInterval);
                this.isEating = false;
                this.increaseStats('food', 10);
                this.updateDisplay();
                burgerImg.style.visibility = 'visible';
                return;
            }
            
            count++;
            this.updateCapybaraImage();
        }, 500);
    }

    startDrinkingAnimation() {
        const waterImg = document.getElementById('water-img');
        this.isDrinking = true;
        let count = 0;
        const maxCount = 6; // 3 seconds / 500ms = 6 switches
        
        // Hide water during animation
        waterImg.style.visibility = 'hidden';
        
        const drinkInterval = setInterval(() => {
            if (count >= maxCount) {
                clearInterval(drinkInterval);
                this.isDrinking = false;
                this.increaseStats('water', 10);
                this.updateDisplay();
                waterImg.style.visibility = 'visible';
                return;
            }
            
            count++;
            this.updateCapybaraImage();
        }, 500);
    }

    updateCapybaraImage() {
        const capyImg = document.getElementById('capybara-img');
        if (this.isEating) {
            capyImg.src = capyImg.src.includes('capy_eat.png') ? 
                this.defaultImage : this.eatImage;
        } else if (this.isDrinking) {
            capyImg.src = capyImg.src.includes('capy_drink.png') ? 
                this.defaultImage : this.drinkImage;
        } else if (this.stats.energy <= 30) {
            capyImg.src = this.sleepImage;
        } else if (this.isPressed) {
            capyImg.src = this.happyImage;
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

    increaseStats(statType, amount = 20) {
        if (this.stats[statType] < 100) {
            this.stats[statType] = Math.min(100, this.stats[statType] + amount);
        }
    }

    updateDisplay() {
        for (let stat in this.stats) {
            const element = document.getElementById(stat);
            element.querySelector('span').textContent = `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${this.stats[stat]}%`;
        }
        this.updateCapybaraImage();
        this.checkCleanliness();
    }

    initMouseMoveHandler() {
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                if (this.draggingItem === 'burger') {
                    this.updateBurgerPosition(e);
                } else if (this.draggingItem === 'water') {
                    this.updateWaterPosition(e);
                } else if (this.draggingItem === 'shovel') {
                    this.updateShovelPosition(e);
                }
            }
        });
    }

    initPoopCheck() {
        // Check cleanliness every time stats are updated
        const poopContainer = document.getElementById('poop-container');
        const shovelItem = document.querySelector('.shovel-item');
        
        // Initial check
        this.checkCleanliness();
        
        // Set up interval to check cleanliness
        setInterval(() => {
            this.checkCleanliness();
        }, 1000);
    }

    checkCleanliness() {
        const poopContainer = document.getElementById('poop-container');
        const shovelItem = document.querySelector('.shovel-item');
        
        if (this.stats.cleanliness <= 95 ) {
            poopContainer.style.display = 'block';
            shovelItem.style.display = 'block';
        } else {
            poopContainer.style.display = 'none';
            shovelItem.style.display = 'none';
        }
    }

    initShovelItem() {
        const shovelImg = document.getElementById('shovel-img');
        const poopContainer = document.getElementById('poop-container');
        
        shovelImg.addEventListener('mousedown', (e) => {
            if (this.stats.cleanliness < 50) {
                this.isDragging = true;
                this.draggingItem = 'shovel';
                
                const rect = shovelImg.getBoundingClientRect();
                this.dragOffset.x = e.clientX - rect.left;
                this.dragOffset.y = e.clientY - rect.top;
                
                shovelImg.style.position = 'fixed';
                shovelImg.style.pointerEvents = 'none';
                this.updateShovelPosition(e);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (this.isDragging && this.draggingItem === 'shovel') {
                this.isDragging = false;
                this.draggingItem = null;
                shovelImg.style.position = 'static';
                shovelImg.style.pointerEvents = 'auto';
                shovelImg.style.transform = 'none';
                
                const poopRect = poopContainer.getBoundingClientRect();
                if (this.isOverlapping(e.clientX, e.clientY, poopRect)) {
                    this.increaseStats('cleanliness', 60); // Bigger increase to get above 50
                    this.updateDisplay();
                }
            }
        });
    }

    updateShovelPosition(e) {
        const shovelImg = document.getElementById('shovel-img');
        shovelImg.style.left = (e.clientX - this.dragOffset.x) + 'px';
        shovelImg.style.top = (e.clientY - this.dragOffset.y) + 'px';
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    const pet = new CapybaraPet();
}); 