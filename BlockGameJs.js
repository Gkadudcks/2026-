window.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const backToMenuBtn = document.getElementById("backToMenuBtn");
    const menuContainer = document.querySelector(".menu-container");
    const menuBtns = document.querySelectorAll(".menu-buttons .menu-btn");
    const gameContainer = document.getElementById("gameContainer");
    const canvasStack = document.getElementById("canvasStack");
    const backgroundCanvas = document.getElementById("backgroundCanvas");
    const canvas = document.getElementById("gameCanvas");
    const effectCanvas = document.getElementById("effectCanvas");
    const gameResultButtons = document.getElementById("gameResultButtons");
    const resumeBtn = document.getElementById("resumeBtn");
    const retryBtn = document.getElementById("retryBtn");
    const nextStageBtn = document.getElementById("nextStageBtn");
    const bgCtx = backgroundCanvas.getContext("2d");
    const ctx = canvas.getContext("2d");
    const effectCtx = effectCanvas.getContext("2d");
    
	// 이미지 불러오기
	const dirtBrickImg = new Image();
	dirtBrickImg.src = "images/dirt-brick.png";

	const metalBrickImg = new Image();
	metalBrickImg.src = "images/metal-brick.png";

	const oxygenTankImg = new Image();
	oxygenTankImg.src = "images/oxygen-tank.png";
	
    // 게임 진행 시 background Image
    const gameBg = new Image();
    gameBg.src = "images/game_play_bg.png";

    //배경 이미지 넣어주기 초기 선택 화면에서
    document.body.style.backgroundImage = window.currentMenuBackground || 'url("images/space-background1.png")';

    //난이도 선택
    const difficultyContainer = document.getElementById("difficultyContainer");
    const difficultyBackBtn = document.getElementById("difficultyBackBtn");
    const difficultyBtns = document.querySelectorAll(".difficulty-btn");
    const settingsContainer = document.getElementById("settingsContainer");
    const audioSettingsContainer = document.querySelector(".audio-settings-container");
    const backgroundSettingsContainer = document.querySelector(".background-settings-container");
    const controlSettingsContainer = document.querySelector(".control-settings-container");
    //현재 보이는 메뉴 화면 찾아서 키보드 조작 처리하기 위한 배열
    const menuScreens = [
        { container: menuContainer, controls: menuBtns, selectedIndex: 0 },
        { container: difficultyContainer, controls: difficultyBtns, selectedIndex: 0 },
        { container: settingsContainer, controls: settingsContainer.querySelectorAll(".menu-btn"), selectedIndex: 0 },
        { container: audioSettingsContainer, controls: audioSettingsContainer.querySelectorAll("button, select, input"), selectedIndex: 0 },
        { container: backgroundSettingsContainer, controls: backgroundSettingsContainer.querySelectorAll(".menu-btn"), selectedIndex: 0 },
        { container: controlSettingsContainer, controls: controlSettingsContainer.querySelectorAll(".menu-btn"), selectedIndex: 0 }
    ];
	
	
    const difficultySettings = {
        easy: {
        ballSpeed: 6,
        o2Drain: 2,
        brickRow: 3, // 벽돌 세로 줄 개수
        brickCol: 6	 // 벽돌 가로 칸 개수
    },
    normal: {
        ballSpeed: 9,
        o2Drain: 3,
        brickRow: 4,
        brickCol: 8
    },
    hard: {
        ballSpeed: 100,
        o2Drain: 4,
        brickRow: 5,
        brickCol: 10
    },
    impossible: {
        ballSpeed: 16,
        o2Drain: 6,
        brickRow: 6,
        brickCol: 12
    }
    };

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    let animationId = null;
    let isPlaying = false;
    let score = 0;
    let o2 = 100;
    let lastTime = 0;
    let lowOxygenShake = 0;
    let gameOverMessage = null;
    let isPaused = false;
    let currentO2Drain = difficultySettings.easy.o2Drain;
    const PADDLE_HISTORY_FRAME = 10;
    let paddleMoveHistory = Array(PADDLE_HISTORY_FRAME).fill(0);

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
	
	// 현재 난이도 저장
	let currentDifficulty = difficultySettings.easy;

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

    // 벽돌 생성 함수
	function createBricks() {

		// 기존 벽돌 배열 초기화
		bricks = [];

		// 현재 난이도에 맞는 설정 가져오기
		const settings = currentDifficulty;

		// 현재 난이도의 벽돌 행/열 개수 가져오기
		const row = settings.brickRow;
		const col = settings.brickCol;

		// 벽돌 사이 간격
		const padding = 8;

		// 벽돌 시작 위치
		const offsetLeft = 35;
		const offsetTop = 70;

		// 화면 너비에 맞게 벽돌 너비 자동 계산
		// 난이도가 올라가 col 개수가 많아지면 벽돌 크기가 자동으로 작아짐
		const brickWidth = (WIDTH - offsetLeft * 2 - padding * (col - 1)) / col;

		// 벽돌 높이 계산
		// row가 많아질수록 벽돌 높이도 조금씩 감소
		const brickHeight = Math.max(14, 28 - row * 2);

		// 벽돌 생성 반복문
		for (let r = 0; r < row; r++) {

			for (let c = 0; c < col; c++) {

				// 벽돌 객체 추가
				bricks.push({

					// x 위치 계산
					x: offsetLeft + c * (brickWidth + padding),

					// y 위치 계산
					y: offsetTop + r * (brickHeight + padding),

					// 벽돌 크기
					width: brickWidth,
					height: brickHeight,

					// 벽돌 생존 여부
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
        /*
            수정 사항 : ballSpeed가 고정값으로 되어 있음
            수정 전 : dx, dy 가 각각 3, -3으로 고정 
            수정 후 : currentDifficulty.ballSpeed / 2 으로 수정
        */
        ball.dx = currentDifficulty.ballSpeed / 2;
        ball.dy = -currentDifficulty.ballSpeed / 2;
        paddle.x = WIDTH / 2 - paddle.width / 2;
        paddleMoveHistory = Array(PADDLE_HISTORY_FRAME).fill(0);
        gameOverMessage = null;
        isPaused = false;
        hideResultButtons();
        createBricks();
        updateUI();
    }

    function hideResultButtons() {
        gameResultButtons.style.display = "none";
        resumeBtn.style.display = "none";
        retryBtn.style.display = "none";
        nextStageBtn.style.display = "none";
        backToMenuBtn.style.display = "none";
    }

    function showResultButtons(isSuccess) {
        gameResultButtons.style.display = "flex";
        resumeBtn.style.display = "none";
        retryBtn.style.display = isSuccess ? "none" : "block";
        nextStageBtn.style.display = isSuccess ? "block" : "none";
        backToMenuBtn.style.display = "block";
    }

    function showPauseButtons() {
        gameResultButtons.style.display = "flex";
        resumeBtn.style.display = "block";
        retryBtn.style.display = "none";
        nextStageBtn.style.display = "none";
        backToMenuBtn.style.display = "block";
    }

    function startRound() {
        hideResultButtons();
        canvasStack.style.transform = "translate(0, 0)";
        effectCtx.clearRect(0, 0, WIDTH, HEIGHT);
        resetGame();
        isPlaying = true;
        isPaused = false;
        gameOverMessage = null;
        lastTime = performance.now();
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        animationId = requestAnimationFrame(gameLoop);
    }

    function updateUI() {
        scoreText.textContent = score;
        o2Text.textContent = `${Math.ceil(o2)}%`; /* o2 퍼센트 텍스트 업데이트 문자열 */
        o2Bar.style.width = `${o2}%`;   // 산소 길이 변경
        o2Bar.classList.toggle("low", o2 < 20); // 이건 특정 조건이면 CSS 클래스 추가/제거하는 코드
    }

    function focusMenuButton() {
        menuBtns[menuScreens[0].selectedIndex].focus();
    }

    function getActiveMenuScreen() {
        return menuScreens.find((screen) => getComputedStyle(screen.container).display !== "none");
    }

    function focusMenuScreenControl(screen) {
        screen.controls[screen.selectedIndex].focus();
    }
    // 현재 보이는 메뉴 화면에서 화살표로 포서스 이동, enter로 실행
    // select, input은 포커스 이동만, enter 클릭은 버튼에만 적용
    function handleMenuKeyboard(event) {
        const screen = getActiveMenuScreen();
        if (!screen || !["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) return false;

        event.preventDefault();
        if (event.key === "ArrowUp") {
            screen.selectedIndex = (screen.selectedIndex - 1 + screen.controls.length) % screen.controls.length;
            focusMenuScreenControl(screen);
        } else if (event.key === "ArrowDown") {
            screen.selectedIndex = (screen.selectedIndex + 1) % screen.controls.length;
            focusMenuScreenControl(screen);
        } else if (screen.controls[screen.selectedIndex].tagName === "BUTTON") {
            screen.controls[screen.selectedIndex].click();
            setTimeout(() => {
                const nextScreen = getActiveMenuScreen();
                if (nextScreen) focusMenuScreenControl(nextScreen);
            }, 0);
        }
        return true;
    }

    function drawBackground() {
        /* 우주 느낌나는 배경 그리기 그라데이션으로 처리함 */
        // const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT); //그라데이션 생성 (0,0) -> (WIDTH, HEIGHT) 방향으로 그라데이션 생성
        // gradient.addColorStop(0, "#050816"); //시작 색
        // gradient.addColorStop(1, "#1c0f0a"); //끝 색
        // ctx.fillStyle = gradient;
        // ctx.fillRect(0, 0, WIDTH, HEIGHT);  //Canvas 전체를 사각형으로 채움.

        /* 우주 느낌 나도록 배경에 별 그리기 */
        // ctx.fillStyle = "rgba(255,255,255,0.75)";
        // for (let i = 0; i < 45; i++) {
        //     const x = (i * 97) % WIDTH;
        //     const y = (i * 53) % HEIGHT;
        //     ctx.fillRect(x, y, 1.5, 1.5);
        // }

        /*
            수정 사항 
            수정 전 drawBackground : canvas에 직접 배경을 그리는 방식
            수정 후 drawBackground : 게임 시작 버튼 누를 시 게임 초기 배경 날린 후, 게임 진행 이미지 출력하는 방식
        */
        bgCtx.clearRect(0,0,WIDTH,HEIGHT);

        bgCtx.drawImage(gameBg, 0, 0, WIDTH, HEIGHT);
    }

    // 공 그리는 함수
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

    // 사용자 이동 바 그리는 함수
    function drawPaddle() {
        ctx.fillStyle = "#e9f7ff";      // 내부를 색으로 채운 사각형
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.strokeStyle = "#ff8c3a";    // 테두리만 그리는 사각형
        ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

	// 벽돌을 화면에 그리는 함수
	function drawBricks() {

    // bricks 배열에 있는 모든 벽돌 반복
    bricks.forEach((brick) => {

        // 이미 깨진 벽돌이면 그리지 않음
        if (!brick.alive) return;

        // dirtBrickImg 이미지를 벽돌 위치와 크기에 맞게 출력
        ctx.drawImage(
            dirtBrickImg,     // 사용할 이미지
            brick.x,          // x 좌표
            brick.y,          // y 좌표
            brick.width,      // 벽돌 너비
            brick.height      // 벽돌 높이
        );
    });
	}


	// 산소 아이템(O2 아이템)을 화면에 그리는 함수
	function drawO2Items() {

		// o2Items 배열의 모든 아이템 반복
		o2Items.forEach((item) => {

        // 아이템 크기 설정
        const size = item.radius * 3;

        // 산소통 이미지를 아이템 위치에 그림
        ctx.drawImage(
            oxygenTankImg,      // 사용할 산소통 이미지
            item.x - size / 2, // 이미지 중앙 정렬 x좌표
            item.y - size / 2, // 이미지 중앙 정렬 y좌표
            size,              // 이미지 너비
            size               // 이미지 높이
			);
		});
	}

    // 산소가 20% 미만 일 시 경고 메시지 출력하기
    function drawLowOxygenWarning() {
        if (o2 >= 20) return;
        effectCtx.fillStyle = "rgba(255, 80, 40, 0.15)";
        effectCtx.fillRect(0, 0, WIDTH, HEIGHT);

        effectCtx.fillStyle = "#ff5b38";
        effectCtx.font = "bold 36px Orbitron";
        effectCtx.textAlign = "center";
        effectCtx.shadowColor = "#ff5b38";
        effectCtx.shadowBlur = 16;
        effectCtx.fillText("⚠ LOW OXYGEN ⚠", WIDTH / 2, HEIGHT / 2);
        effectCtx.shadowBlur = 0;
    }

    //벽돌이 깨졌을 때 확률적으로 O2 아이템 생성
    function spawnO2Item(x, y) {
        //35% 확률 난이도 별 상이한 확률을 조정할 필요가 있음
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
        paddle.x = Math.max(0, Math.min(WIDTH - paddle.width, paddle.x));   //패들이 화면 밖으로 못 나가게 제한
    }
    // 패들 움직임을 ball과 충돌에 반영하기 위한 최근 10프레임 패들 움직임 기록
    function recordPaddleMovement(beforeX) {
        paddleMoveHistory.push(paddle.x - beforeX);
        if (paddleMoveHistory.length > PADDLE_HISTORY_FRAME) {
            paddleMoveHistory.shift();
        }
    }

    function getAveragePaddleMovement() {
        return paddleMoveHistory.reduce((sum, value) => sum + value, 0) / paddleMoveHistory.length;
    }

    //공 움직이기 + 충돌처리
    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // 오른쪽 / 왼쪽 벽에 충돌했을 경우 처리 : 공의 가장자리를 검사 해야 하기 때문에 radius를 사용함
        if (ball.x + ball.radius > WIDTH || ball.x - ball.radius < 0) ball.dx *= -1;
        //천장 충돌
        if (ball.y - ball.radius < 0) ball.dy *= -1;

        // 패들 충돌 여부 : 공이 패들 영역 안에 있는지
        const hitPaddle =
            ball.y + ball.radius >= paddle.y && // 공 아래쪽이 패들 위에 닿음
            ball.y + ball.radius <= paddle.y + paddle.height && // 패들 아래보다 위에 있음
            //공이 패들 가로 범위 안인지 검사.
            ball.x >= paddle.x &&
            ball.x <= paddle.x + paddle.width;

        if (hitPaddle) {
            ball.dy = -Math.abs(ball.dy); // 반드시 위를 보장하기 위해 절댓값에 -부호 붙임
            // 튕기는 각도 계산
            const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            // 패들 움직임 영향이 너무 크지 않도록 보정계수 0.25를 곱해서 적용
            ball.dx = hitPoint * 4 + getAveragePaddleMovement() * 0.25;
        }

        //게임 오버 체크 : 공이 화면아래로 갔을 경우
        if (ball.y - ball.radius > HEIGHT) {
            gameOver("MISSION FAILED");
        }
    }

    //공(ball)과 벽돌(bricks)의 충돌 처리
    // 수정 사항 : 충돌 판정을 더 정확하게
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
                // 공 중심과 벽돌 중심 거리 계산
                const brickCenterX = brick.x + brick.width / 2;
                const brickCenterY = brick.y + brick.height / 2;
                const dx = ball.x - brickCenterX;
                const dy = ball.y - brickCenterY;

                // 위 아래 충돌 우선
                const overlapX = brick.width / 2 + ball.radius - Math.abs(dx);
                const overlapY = brick.height / 2 + ball.radius - Math.abs(dy);

                // 더 적게 겹친 방향 기준
                if (overlapX < overlapY) {
                    // 진짜 옆면 충돌만 좌우 반사
                    ball.dx *= -1;
                    // 위치 보정
                    if (dx > 0) {
                        ball.x = brick.x + brick.width + ball.radius;
                    } else{
                        ball.x = brick.x - ball.radius;
                    }
                }else{
                    // 대부분은 상하 반사
                    ball.dy *= -1;
                    // 위치 보정
                    if(dy > 0){
                        ball.y = brick.y + brick.height + ball.radius;
                    } else{
                        ball.y = brick.y - ball.radius;
                    }
                }
                score += 10;
                spawnO2Item(brick.x + brick.width / 2, brick.y + brick.height / 2); //o2 아이템 생성
                //효과음 재생
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
            //아이템 떨어트리기
            item.y += item.dy;

            /* 
                수정 사항
                수정 전 : 아이템이 공과 충돌할 경우
                수정 후 : 아이템이 패들과 충돌할 경우 
            */

            // const dx = ball.x - item.x;
            // const dy = ball.y - item.y;
            // const distance = Math.sqrt(dx * dx + dy * dy);

            // if (distance < ball.radius + item.radius) {
            //     item.caught = true;
            //     o2 = Math.min(100, o2 + 20);
            // }
            const hitPaddle = item.y + item.radius >= paddle.y &&
                item.y - item.radius <= paddle.y + paddle.height &&
                item.x >= paddle.x && item.x <= paddle.x + paddle.width;

            if (hitPaddle) {
                item.caught = true;             //먹힌 상태 표시
                o2 = Math.min(100, o2 + 20);    //o2 회복
            }
        });
        //필요없는 o2 아이템 제거하기 ( 화면 밖으로 벗어남 | 이미 획득한 아이템 )
        // filter를 사용해 조건을 만족하는 요소만 남긴 새 배열 반환함 (아직 획득하지 않은 아이템 & 화면 안에 있는 아이템)
        o2Items = o2Items.filter((item) => !item.caught && item.y < HEIGHT + 30);
    }

    //게임 오버 메세지 출력하기
    function gameOver(message) {
        // isPlaying = false;
        // gameOverMessage = message;
        // cancelAnimationFrame(animationId);
        // canvas.style.transform = "translate(0,0)";
        // backToMenuBtn.style.display = "block";
        
        // setTimeout(() => {
        //     gameContainer.style.display = "none";
        //     menuContainer.style.display = "flex";
        //     document.body.style.backgroundImage ='url("menu_bg.png")';
        //     }, 1500);

        /* 
            게임 오버 형식 수정 
            수정 전 : MISSION FAILED 출력 후 1.5초 뒤에 게임 초기 화면으로 감
            수정 후 : RETURN TO MENU 버튼 생성하고 클릭 시에 초기화면으로 돌아고도록
        */
            // 중복 실행 방지
            if (!isPlaying) return;

            isPlaying = false;

            gameOverMessage = message;

            canvasStack.style.transform = "translate(0,0)";

            showResultButtons(message === "STAGE CLEAR");
        }

    //산소(O2) 시스템 전체 관리
    function drawCenterMessage(message) {
        effectCtx.fillStyle = "rgba(0, 0, 0, 0.72)";
        effectCtx.fillRect(0, 0, WIDTH, HEIGHT);
        effectCtx.fillStyle = "#ffffff";
        effectCtx.font = "bold 38px Orbitron";
        effectCtx.textAlign = "center";
        effectCtx.fillText(
            message,
            WIDTH / 2,
            HEIGHT / 2 - 20
        );
    }

    function pauseGame() {
        if (!isPlaying || gameOverMessage) return;
        isPlaying = false;
        isPaused = true;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvasStack.style.transform = "translate(0, 0)";
        effectCtx.clearRect(0, 0, WIDTH, HEIGHT);
        drawCenterMessage("PAUSED");
        showPauseButtons();
    }

    function resumeGame() {
        if (!isPaused) return;
        hideResultButtons();
        effectCtx.clearRect(0, 0, WIDTH, HEIGHT);
        isPaused = false;
        isPlaying = true;
        lastTime = performance.now();
        animationId = requestAnimationFrame(gameLoop);
    }

    function updateOxygen(deltaTime) {
        o2 -= deltaTime * currentO2Drain; // 난이도에 따라 1초당 o2 감소
        o2 = Math.max(0, o2); // 최솟값 제한 0 밑으로 못 내려감

        //산소 부족 경고 : 20% 미만일 시 화면 흔들림 활성화
        if (o2 < 20) {  
            lowOxygenShake = 5;
        }

        if (o2 <= 0) {
            gameOver("OXYGEN DEPLETED");
        }
    }

    //timestamp : 브라우저가 자동으로 넣어주는 시간값 (ms)
    function gameLoop(timestamp) {
        // 게임 종료 상태면 루프 종료 (게임 오버 메세지가 없음 && 플레이 중이 아님)
        if (!isPlaying && !gameOverMessage) return;
        if (isPaused) return;

        // deltaTime : 이전 프레임과 현재 프레임 시간 차이 (ms)
        const deltaTime = (timestamp - lastTime) / 1000 || 0;
        lastTime = timestamp; // 현재 시간 저장

        updateOxygen(deltaTime); //산소 감소 처리.
        const paddleBeforeX = paddle.x;
        movePaddle(); // 패들 이동 처리
        recordPaddleMovement(paddleBeforeX);
        moveBall(); // 공 이동 + 벽 충돌 처리
        checkBrickCollision();  // 벽돌 충돌 검사
        moveO2Items();  // 산소 아이템 이동 처리
        updateUI(); //점수 / O2 UI 업데이트

        // 산소 부족할 때 흔들림
        if (lowOxygenShake > 0) {
            const shakeX = Math.random() * 8 - 4;
            const shakeY = Math.random() * 8 - 4;
            canvasStack.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
            //Canvas 흔들기 : Canvas 위치를 랜덤으로 이동시킴
            lowOxygenShake--;
            // 흔들림 카운트 감소 한 프레임씩 줄어듦
        } else {
            //흔들림 끝나면 원위치
            canvasStack.style.transform = "translate(0, 0)";
        }

        //렌더링
        drawBackground();
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        effectCtx.clearRect(0, 0, WIDTH, HEIGHT);
        drawBricks();
        drawO2Items();
        drawPaddle();
        drawBall();
        drawLowOxygenWarning();

        //게임 오버 메세지 출력
        if (gameOverMessage) {
            // 게임 화면 어둡게 덮기.
            drawCenterMessage(gameOverMessage);
            return;
        }
        // 다음 프레임 요청
        animationId = requestAnimationFrame(gameLoop);
    }

    startBtn.addEventListener("click", () => {
        menuContainer.style.display = "none";
        difficultyContainer.style.display = "flex";

        
        /*
            수정 사항
            수정 전 : 게임 시작 누르면 바로 게임 시작
            수정 후 : 게임 시작 시 난이도 선택 창으로
        */
        // gameContainer.style.display = "flex";
        // resetGame();

        // isPlaying = true;
        // lastTime = performance.now();
        // cancelAnimationFrame(animationId);
        // // 이미지가 이미 로드됐으면 바로 시작
        // if (gameBg.complete) {

        //     animationId = requestAnimationFrame(gameLoop);

        // } else {
        //     // 아직 로드 전이면 로드 후 시작
        //     gameBg.onload = () => {
        //         animationId = requestAnimationFrame(gameLoop);
        //     };
        // }
    });

    difficultyBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            document.body.style.backgroundImage = "none"; // body 배경 제거
            const mode = btn.dataset.mode;  // button의 data-mode 값 가져오기
            if (!mode) return;
            // 현재는 EASY만 구현
            console.log("선택 난이도:", mode);
			currentDifficulty = difficultySettings[mode];	//현재 난이도를 기억한다
            currentO2Drain = currentDifficulty.o2Drain;

            difficultyContainer.style.display = "none";
            menuContainer.style.display = "none";
            gameContainer.style.display = "flex";
            startRound();
        });
    });

    difficultyBackBtn.addEventListener("click", () => {
        // 난이도 창 숨김
        difficultyContainer.style.display = "none";
        // 메인 메뉴 복귀
        menuContainer.style.display = "flex";
        document.body.style.backgroundImage = window.currentMenuBackground ||'url("images/space-background1.png")';
        focusMenuButton();
    });

    backToMenuBtn.addEventListener("click", () => {
        isPlaying = false;
        isPaused = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        gameContainer.style.display = "none";
        menuContainer.style.display = "flex";
        difficultyContainer.style.display = "none";
        document.body.style.backgroundImage = window.currentMenuBackground ||'url("images/space-background1.png")';
        canvasStack.style.transform = "translate(0, 0)";
        hideResultButtons();
        gameOverMessage = null;
        focusMenuButton();
    });

    resumeBtn.addEventListener("click", () => {
        resumeGame();
    });

    retryBtn.addEventListener("click", () => {
        startRound();
    });

    nextStageBtn.addEventListener("click", () => {
        startRound();
    });

    document.addEventListener("keydown", (event) => {
        if (handleMenuKeyboard(event)) return;

        if (event.key === "Escape") {
            if (isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
            return;
        }
        if (window.controlMode === "mouse") return;
        if (event.key === "ArrowLeft") keys.left = true;
        if (event.key === "ArrowRight") keys.right = true;
    });

    document.addEventListener("keyup", (event) => {
        if (window.controlMode === "mouse") return;
        if (event.key === "ArrowLeft") keys.left = false;
        if (event.key === "ArrowRight") keys.right = false;
    });

    //마우스를 움직이면 패들이 마우스를 따라 움직이게 하는 코드
    canvas.addEventListener("mousemove", (event) => {
        if (window.controlMode === "keyboard") return; // 키보드 조작일 땐 마우스 무시
        const rect = canvas.getBoundingClientRect();
        paddle.x = event.clientX - rect.left - paddle.width / 2;
        paddle.x = Math.max(0, Math.min(WIDTH - paddle.width, paddle.x));
    });
    focusMenuButton();
});
