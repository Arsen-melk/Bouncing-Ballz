const canvas = document.getElementById('ballzCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = 0.6;
const friction = 0.7;

const balls = [];

const bounceSound = new Audio('bounce.mp3');

function randomColor() {
    const colors = ['#A020F0', '#FFFF00', '#0000FF', '#66FF00', '#EF0107'];
    return colors[Math.floor(Math.random() * colors.length)];
}



function Ball(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dy = 2; 
    this.onGround = false;
    this.history = [];

    this.draw = function() {
        for (let i = 0; i < this.history.length; i++) {
            const pos = this.history[i];
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = i / this.history.length;
            ctx.fill();
            ctx.closePath();
        }
        ctx.globalAlpha = 1.0;

        const gradient = ctx.createRadialGradient(this.x, this.y, this.radius / 2, this.x, this.y, this.radius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, this.color);

        ctx.shadowColor = 'rgba(200, 200, 200, 0.5)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    };

    this.update = function() {
        if (this.y + this.radius + this.dy > canvas.height) {
            if (!this.onGround) { 
                bounceSound.currentTime = 0; 
                bounceSound.play(); 
                this.onGround = true;
            }
            this.dy = -this.dy * friction; 
            if (Math.abs(this.dy) < 0.5) {
                this.dy = 0;
            }
            
        } else {
            this.onGround = false;
            this.dy += gravity; 
        }
        this.y += this.dy; 

        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 10) {
            this.history.shift();
        }
        this.draw(); 
    };
}


function spawnBall(x, y) {
    if (balls.length < 15) {
        const radius = 30;
        const color = randomColor();
        balls.push(new Ball(x, y, radius, color)); 
    }else {
        alert(`The maximum number of balls is 15. \n Please start again!`)
        balls.length = 0; 
    }
    
}


canvas.addEventListener('click', (event) => {
    spawnBall(event.clientX, event.clientY);
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        const x = Math.random() * canvas.width;
        const y = 30; 
        spawnBall(x, y);
    }
});

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    balls.forEach(ball => ball.update()); 
}

animate();