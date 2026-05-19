window.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const menuContainer = document.querySelector(".menu-container");
    const gameContainer = document.getElementById("gameContainer");
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    let animationId = null;
    let isPlaying = false;
    let score = 0;
    let o2 = 100;
    let lastTime = 0;
    let lowOxygenShake = 0;
    let gameOverMessage = null;

    const ball = {
        // ball의 처음 위치 (가로 : canvas의 중앙 / 세로 : 캔버스 높이 - 90)
        x: WIDTH / 2, 
        y: HEIGHT - 90,
        radius: 8,
        dx: 3,
        dy: -3
    };

    // 플레이어가 움직이는 아래 막대
    const paddle = {
        width: 110,
        height: 14,
        x: WIDTH / 2 - 55,
        y: HEIGHT - 35,
        speed: 8
    };

    // 키보드 입력 (왼쪽 오른쪽 화살표)
    const keys = {
        left: false,
        right: false
    };

    // 벽돌
    const brickInfo = {
        row: 4,
        col: 8,
        width: 82,
        height: 24,
        padding: 10,
        offsetTop: 70,
        offsetLeft: 35
    };

    
    let bricks = [];
    let o2Items = [];

    const sfxPlayer = document.getElementById("sfxPlayer");

    // 게임 화면에 score 및 o2 박스 만들기
    const ui = document.createElement("div");
    ui.className = "game-ui";
    /*
    o2-bar-outer : 바깥 게이지
    o2-bar-inner : 실제 줄어드는 게이지
    o2-percent : 퍼센트 표시
    */
    ui.innerHTML = `
        <div class="score-box">SCORE <span id="scoreText">0</span></div>
        <div class="o2-panel">
            <span class="o2-label">O2</span>
            <div class="o2-bar-outer">
                <div class="o2-bar-inner" id="o2Bar"></div>
            </div>
            <span class="o2-percent" id="o2Text">100%</span>
        </div>
    `;
    gameContainer.prepend(ui);

    const scoreText = document.getElementById("scoreText");
    const o2Bar = document.getElementById("o2Bar");
    const o2Text = document.getElementById("o2Text");

    function createBricks() {
        bricks = [];
        for (let r = 0; r < brickInfo.row; r++) {
            for (let c = 0; c < brickInfo.col; c++) {
                bricks.push({
                    x: brickInfo.offsetLeft + c * (brickInfo.width + brickInfo.padding),
                    y: brickInfo.offsetTop + r * (brickInfo.height + brickInfo.padding),
                    width: brickInfo.width,
                    height: brickInfo.height,
                    alive: true
                });
            }
        }
    }

    function resetGame() {
        score = 0;
        o2 = 100;
        o2Items = [];
        ball.x = WIDTH / 2;
        ball.y = HEIGHT - 90;
        ball.dx = 3;
        ball.dy = -3;
        paddle.x = WIDTH / 2 - paddle.width / 2;
        gameOverMessage = null;
        createBricks();
        updateUI();
    }

    function updateUI() {
        scoreText.textContent = score;
        o2Text.textContent = `${Math.ceil(o2)}%`;
        o2Bar.style.width = `${o2}%`;
        o2Bar.classList.toggle("low", o2 < 20);
    }

    function drawBackground() {
        const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
        gradient.addColorStop(0, "#050816");
        gradient.addColorStop(1, "#1c0f0a");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = "rgba(255,255,255,0.75)";
        for (let i = 0; i < 45; i++) {
            const x = (i * 97) % WIDTH;
            const y = (i * 53) % HEIGHT;
            ctx.fillRect(x, y, 1.5, 1.5);
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ff8c3a";
        ctx.shadowColor = "#ff8c3a";
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.fillStyle = "#e9f7ff";
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.strokeStyle = "#ff8c3a";
        ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    function drawBricks() {
        bricks.forEach((brick) => {
            if (!brick.alive) return;
            ctx.fillStyle = "#b65b2e";
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            ctx.strokeStyle = "#ffb067";
            ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        });
    }

    function drawO2Items() {
        o2Items.forEach((item) => {
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#7ee7ff";
            ctx.shadowColor = "#7ee7ff";
            ctx.shadowBlur = 16;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.closePath();

            ctx.fillStyle = "#001018";
            ctx.font = "bold 10px Orbitron";
            ctx.textAlign = "center";
            ctx.fillText("O2", item.x, item.y + 3);
        });
    }

    function drawLowOxygenWarning() {
        if (o2 >= 20) return;
        ctx.fillStyle = "rgba(255, 80, 40, 0.15)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = "#ff5b38";
        ctx.font = "bold 36px Orbitron";
        ctx.textAlign = "center";
        ctx.shadowColor = "#ff5b38";
        ctx.shadowBlur = 16;
        ctx.fillText("⚠ LOW OXYGEN ⚠", WIDTH / 2, HEIGHT / 2);
        ctx.shadowBlur = 0;
    }

    function spawnO2Item(x, y) {
        if (Math.random() < 0.35) {
            o2Items.push({
                x,
                y,
                radius: 15,
                dy: 1.4
            });
        }
    }

    function movePaddle() {
        if (keys.left) paddle.x -= paddle.speed;
        if (keys.right) paddle.x += paddle.speed;
        paddle.x = Math.max(0, Math.min(WIDTH - paddle.width, paddle.x));
    }

    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x + ball.radius > WIDTH || ball.x - ball.radius < 0) ball.dx *= -1;
        if (ball.y - ball.radius < 0) ball.dy *= -1;

        const hitPaddle =
            ball.y + ball.radius >= paddle.y &&
            ball.y + ball.radius <= paddle.y + paddle.height &&
            ball.x >= paddle.x &&
            ball.x <= paddle.x + paddle.width;

        if (hitPaddle) {
            ball.dy = -Math.abs(ball.dy);
            const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            ball.dx = hitPoint * 4;
        }

        if (ball.y - ball.radius > HEIGHT) {
            gameOver("MISSION FAILED");
        }
    }

    function checkBrickCollision() {
        bricks.forEach((brick) => {
            if (!brick.alive) return;

            const hit =
                ball.x + ball.radius > brick.x &&
                ball.x - ball.radius < brick.x + brick.width &&
                ball.y + ball.radius > brick.y &&
                ball.y - ball.radius < brick.y + brick.height;

            if (hit) {
                brick.alive = false;
                ball.dy *= -1;
                score += 10;
                spawnO2Item(brick.x + brick.width / 2, brick.y + brick.height / 2);
                sfxPlayer.currentTime = 0;
                sfxPlayer.play();
            }
        });

        if (bricks.every((brick) => !brick.alive)) {
            gameOver("STAGE CLEAR");
        }
    }

    function moveO2Items() {
        o2Items.forEach((item) => {
            item.y += item.dy;

            const dx = ball.x - item.x;
            const dy = ball.y - item.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ball.radius + item.radius) {
                item.caught = true;
                o2 = Math.min(100, o2 + 20);
            }
        });

        o2Items = o2Items.filter((item) => !item.caught && item.y < HEIGHT + 30);
    }

    function gameOver(message) {
        isPlaying = false;
        gameOverMessage = message;
    }

    function updateOxygen(deltaTime) {
        o2 -= deltaTime * 4.5; // 1초에 4.5% 감소
        o2 = Math.max(0, o2);

        if (o2 < 20) {
            lowOxygenShake = 5;
        }

        if (o2 <= 0) {
            gameOver("OXYGEN DEPLETED");
        }
    }

    function gameLoop(timestamp) {
        if (!isPlaying) return;

        const deltaTime = (timestamp - lastTime) / 1000 || 0;
        lastTime = timestamp;

        updateOxygen(deltaTime);
        movePaddle();
        moveBall();
        checkBrickCollision();
        moveO2Items();
        updateUI();

        if (lowOxygenShake > 0) {
            const shakeX = Math.random() * 8 - 4;
            const shakeY = Math.random() * 8 - 4;
            canvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
            lowOxygenShake--;
        } else {
            canvas.style.transform = "translate(0, 0)";
        }

        drawBackground();
        drawBricks();
        drawO2Items();
        drawPaddle();
        drawBall();
        drawLowOxygenWarning();

        if (gameOverMessage) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 38px Orbitron";
            ctx.textAlign = "center";
            ctx.fillText(gameOverMessage, WIDTH / 2, HEIGHT / 2 - 20);
            ctx.font = "18px Orbitron";
            ctx.fillText("게임 시작 버튼으로 다시 시작", WIDTH / 2, HEIGHT / 2 + 30);

            setTimeout(() => {
                gameContainer.style.display = "none";
                menuContainer.style.display = "flex";
            }, 1500);
            return;
        }

        animationId = requestAnimationFrame(gameLoop);
    }

    startBtn.addEventListener("click", () => {
        menuContainer.style.display = "none";
        gameContainer.style.display = "flex";
        resetGame();
        isPlaying = true;
        lastTime = performance.now();
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(gameLoop);
    });

    document.addEventListener("keydown", (event) => {
        if (window.controlMode === "mouse") return;
        if (event.key === "ArrowLeft") keys.left = true;
        if (event.key === "ArrowRight") keys.right = true;
    });

    document.addEventListener("keyup", (event) => {
        if (window.controlMode === "mouse") return;
        if (event.key === "ArrowLeft") keys.left = false;
        if (event.key === "ArrowRight") keys.right = false;
    });

    canvas.addEventListener("mousemove", (event) => {
        if (window.controlMode === "keyboard") return;
        const rect = canvas.getBoundingClientRect();
        paddle.x = event.clientX - rect.left - paddle.width / 2;
        paddle.x = Math.max(0, Math.min(WIDTH - paddle.width, paddle.x));
    });
});