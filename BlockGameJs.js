// DOM이 완전히 로드된 후 실행
window.addEventListener("DOMContentLoaded", () => {

    // ─────────────────────────────────────────
    // DOM 요소 가져오기
    // ─────────────────────────────────────────
    const startBtn = document.getElementById("startBtn");
    const exitBtn = document.getElementById("exitBtn");
    const backToMenuBtn = document.getElementById("backToMenuBtn");
    const menuContainer = document.querySelector(".menu-container");
    const menuBtns = document.querySelectorAll(".menu-buttons .menu-btn");
    const gameContainer = document.getElementById("gameContainer");
    const canvasStack = document.getElementById("canvasStack");
    const backgroundCanvas = document.getElementById("backgroundCanvas");   // 배경 전용 캔버스
    const canvas = document.getElementById("gameCanvas");                   // 게임 오브젝트 캔버스
    const effectCanvas = document.getElementById("effectCanvas");           // 효과(경고, 일시정지 등) 캔버스
    const gameResultButtons = document.getElementById("gameResultButtons");
    const resumeBtn = document.getElementById("resumeBtn");
    const retryBtn = document.getElementById("retryBtn");
    const nextStageBtn = document.getElementById("nextStageBtn");

    // 각 캔버스의 2D 렌더링 컨텍스트
    const bgCtx = backgroundCanvas.getContext("2d");
    const ctx = canvas.getContext("2d");
    const effectCtx = effectCanvas.getContext("2d");

    // ─────────────────────────────────────────
    // 이미지 미리 불러오기
    // ─────────────────────────────────────────
    const dirtBrickImg = new Image();
    dirtBrickImg.src = "images/dirt-brick.png";

<<<<<<< HEAD
	const oxygenItemImg = new Image();
	oxygenItemImg.src = "images/oxygen-item.png";
=======
    const metalBrickImg = new Image();
    metalBrickImg.src = "images/metal-brick.png";

    const oxygenTankImg = new Image();
    oxygenTankImg.src = "images/oxygen-tank.png";
>>>>>>> 499d0936dd0a8feed68b980ef11984a56a475be6

    const smallballitemImg = new Image();
    smallballitemImg.src = "images/item_smallball.png";

    const x3itemImg = new Image();
    x3itemImg.src = "images/item_x3.png";

    const widebaritemImg = new Image();
    widebaritemImg.src = "images/item_widebar.png";

    // 게임 진행 중 배경 이미지
    const gameBg = new Image();
    gameBg.src = "images/game_play_bg.png";

    // 메뉴 화면 배경 설정 (SettingsJs.js에서 변경 가능)
    document.body.style.backgroundImage = window.currentMenuBackground || 'url("images/space-background1.png")';

    // ─────────────────────────────────────────
    // 난이도 선택 관련 DOM 요소
    // ─────────────────────────────────────────
    const difficultyContainer = document.getElementById("difficultyContainer");
    const difficultyBackBtn = document.getElementById("difficultyBackBtn");
    const difficultyBtns = document.querySelectorAll(".difficulty-btn");
    const settingsContainer = document.getElementById("settingsContainer");
    const audioSettingsContainer = document.querySelector(".audio-settings-container");
    const backgroundSettingsContainer = document.querySelector(".background-settings-container");
    const controlSettingsContainer = document.querySelector(".control-settings-container");

    // 현재 보이는 메뉴 화면을 찾아 키보드 방향키 조작에 사용하는 배열
    // container: 화면 전체 div / controls: 이동할 요소들 / selectedIndex: 현재 선택된 요소 번호
    const menuScreens = [
        { container: menuContainer, controls: menuBtns, selectedIndex: 0 },
        { container: difficultyContainer, controls: difficultyBtns, selectedIndex: 0 },
        { container: settingsContainer, controls: settingsContainer.querySelectorAll(".menu-btn"), selectedIndex: 0 },
        { container: audioSettingsContainer, controls: audioSettingsContainer.querySelectorAll("button, select, input"), selectedIndex: 0 },
        { container: backgroundSettingsContainer, controls: backgroundSettingsContainer.querySelectorAll(".menu-btn"), selectedIndex: 0 },
        { container: controlSettingsContainer, controls: controlSettingsContainer.querySelectorAll(".menu-btn"), selectedIndex: 0 }
    ];

    // ─────────────────────────────────────────
    // 난이도별 설정값
    // ballSpeed: 공 속도 / o2Drain: 초당 산소 감소량
    // brickRow: 벽돌 행 수 / brickCol: 벽돌 열 수
    // ─────────────────────────────────────────
    const difficultySettings = {
        easy: {
            ballSpeed: 6,
            o2Drain: 2,
            brickRow: 3,
            brickCol: 6
        },
        normal: {
            ballSpeed: 9,
            o2Drain: 3,
            brickRow: 4,
            brickCol: 8
        },
        hard: {
            ballSpeed: 10,
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

    // 캔버스 크기 상수
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    // ─────────────────────────────────────────
    // 게임 상태 변수
    // ─────────────────────────────────────────
    let animationId = null;         // requestAnimationFrame ID (루프 취소에 사용)
    let isPlaying = false;          // 게임 진행 중 여부
    let score = 0;                  // 현재 점수
    let o2 = 100;                   // 현재 산소량 (0~100)
    let lastTime = 0;               // 이전 프레임 시간 (deltaTime 계산용)
    let lowOxygenShake = 0;         // 산소 부족 시 화면 흔들림 카운터
    let gameOverMessage = null;     // 게임 오버 메시지 ("MISSION FAILED" 등)
    let isPaused = false;           // 일시정지 여부
    let currentO2Drain = difficultySettings.easy.o2Drain;  // 현재 산소 감소 속도
    const PADDLE_HISTORY_FRAME = 10;    // 패들 이동 기록 프레임 수
    let paddleMoveHistory = Array(PADDLE_HISTORY_FRAME).fill(0); // 최근 10프레임 패들 이동량

    // 공 배열 (x3 아이템으로 여러 개가 될 수 있어 배열로 관리)
    let balls = [{
        x: WIDTH / 2,      // 초기 위치: 캔버스 가로 중앙
        y: HEIGHT - 90,    // 초기 위치: 캔버스 하단 위
        radius: 8,
        dx: 3,             // x축 이동 속도
        dy: -3             // y축 이동 속도 (위로)
    }];

    // 패들(플레이어가 조작하는 막대) 설정
    const paddle = {
        width: 110,
        height: 14,
        x: WIDTH / 2 - 55,     // 초기 위치: 가로 중앙
        y: HEIGHT - 35,         // 위치: 화면 하단 고정
        speed: 8
    };

    // 키보드 입력 상태 (keydown/keyup으로 true/false 변경)
    const keys = {
        left: false,
        right: false
    };

    // 벽돌 기본 설정 (createBricks에서 난이도에 따라 덮어씀)
    const brickInfo = {
        row: 4,
        col: 8,
        width: 82,
        height: 24,
        padding: 10,
        offsetTop: 70,
        offsetLeft: 35
    };

    let bricks = [];        // 벽돌 객체 배열
    let dropItems = [];     // 현재 떨어지고 있는 아이템 배열

    // 현재 난이도 저장 (난이도 선택 시 갱신)
    let currentDifficulty = difficultySettings.easy;
    let currentMode = "easy"; // 아이템 디버프 확률 계산에 사용되는 난이도 문자열

    const sfxPlayer = document.getElementById("sfxPlayer"); // 효과음 오디오 엘리먼트

    // ─────────────────────────────────────────
    // 게임 UI (점수, 산소 게이지) 동적 생성
    // ─────────────────────────────────────────
    const ui = document.createElement("div");
    ui.className = "game-ui";
    ui.innerHTML = `
        <div class="score-box">SCORE <span id="scoreText">0</span></div>
        <div class="o2-panel">
            <img class="o2-label" src="images/oxygen-tank.png" alt="O2">
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

    // ─────────────────────────────────────────
    // 벽돌 생성
    // 현재 난이도의 행/열 수에 맞게 벽돌 크기와 위치를 자동 계산
    // ─────────────────────────────────────────
    function createBricks() {
        bricks = [];
        const settings = currentDifficulty;
        const row = settings.brickRow;
        const col = settings.brickCol;
        const padding = 8;
        const offsetLeft = 35;
        const offsetTop = 70;

        // 열 수가 많을수록 벽돌이 좁아지도록 너비 자동 계산
        const brickWidth = (WIDTH - offsetLeft * 2 - padding * (col - 1)) / col;

        // 행 수가 많을수록 벽돌 높이 감소 (최소 14px)
        const brickHeight = Math.max(14, 28 - row * 2);

        for (let r = 0; r < row; r++) {
            for (let c = 0; c < col; c++) {
                bricks.push({
                    x: offsetLeft + c * (brickWidth + padding),
                    y: offsetTop + r * (brickHeight + padding),
                    width: brickWidth,
                    height: brickHeight,
                    alive: true  // false가 되면 화면에서 제거
                });
            }
        }
    }

    // ─────────────────────────────────────────
    // 게임 상태 초기화 (라운드 시작 전 호출)
    // ─────────────────────────────────────────
    function resetGame() {
        score = 0;
        o2 = 100;
        dropItems = [];
        // 공을 1개로 초기화 (x3 효과, smallball 효과 모두 리셋)
        balls.length = 0;
        balls.push({
            x: WIDTH / 2,
            y: HEIGHT - 90,
            radius: 8,
            dx: currentDifficulty.ballSpeed / 2,
            dy: -currentDifficulty.ballSpeed / 2
        });
        paddle.width = 110;     // widebar 아이템 효과 초기화
        paddle.x = WIDTH / 2 - paddle.width / 2;
        paddleMoveHistory = Array(PADDLE_HISTORY_FRAME).fill(0);
        gameOverMessage = null;
        isPaused = false;
        hideResultButtons();
        createBricks();
        updateUI();
    }

    // 결과 버튼 전부 숨기기
    function hideResultButtons() {
        gameResultButtons.style.display = "none";
        resumeBtn.style.display = "none";
        retryBtn.style.display = "none";
        nextStageBtn.style.display = "none";
        backToMenuBtn.style.display = "none";
    }

    // 게임 결과 버튼 표시 (isSuccess: 스테이지 클리어 여부)
    function showResultButtons(isSuccess) {
        gameResultButtons.style.display = "flex";
        resumeBtn.style.display = "none";
        retryBtn.style.display = isSuccess ? "none" : "block";     // 실패 시 재도전 버튼
        nextStageBtn.style.display = isSuccess ? "block" : "none"; // 성공 시 다음 스테이지 버튼
        backToMenuBtn.style.display = "block";
    }

    // 일시정지 버튼 표시 (재개 + 메인메뉴)
    function showPauseButtons() {
        gameResultButtons.style.display = "flex";
        resumeBtn.style.display = "block";
        retryBtn.style.display = "none";
        nextStageBtn.style.display = "none";
        backToMenuBtn.style.display = "block";
    }

    // 라운드 시작 (초기화 → 게임 루프 시작)
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
            cancelAnimationFrame(animationId); // 이전 루프가 남아있으면 취소
        }
        animationId = requestAnimationFrame(gameLoop);
    }

    // 점수와 산소 UI 갱신
    function updateUI() {
        scoreText.textContent = score;
        o2Text.textContent = `${Math.ceil(o2)}%`;
        o2Bar.style.width = `${o2}%`;
        o2Bar.classList.toggle("low", o2 < 20); // 20% 미만이면 "low" 클래스 추가 (CSS에서 빨간색 처리)
    }

    // 메인 메뉴의 첫 번째 버튼에 포커스
    function focusMenuButton() {
        menuBtns[menuScreens[0].selectedIndex].focus();
    }

    // display가 none이 아닌 화면을 찾아 현재 보이는 메뉴 화면 반환
    function getActiveMenuScreen() {
        return menuScreens.find((screen) => getComputedStyle(screen.container).display !== "none");
    }

    // 현재 메뉴 화면에서 선택된 인덱스로 포커스 이동
    function focusMenuScreenControl(screen) {
        screen.controls[screen.selectedIndex].focus();
    }

    // 메뉴 화면에서 방향키(위/아래)로 포커스 이동, Enter로 버튼 클릭
    // select, input은 포커스 이동만 되고 Enter 클릭은 button에만 동작
    function handleMenuKeyboard(event) {
        const screen = getActiveMenuScreen();
        //화살표 위 아래 혹은 enter인 경우에만 처리
        if (!screen || !["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) return false;
        //화살표,enter가 기본동작 못하고 아래에 정해진 동작을 하게 하기 위해 preventDefault사용
        event.preventDefault();

        //%연산으로 순환
        if (event.key === "ArrowUp") {
            // 위 방향키: 이전 항목으로 (0번이면 마지막으로 순환)
            screen.selectedIndex = (screen.selectedIndex - 1 + screen.controls.length) % screen.controls.length;
            focusMenuScreenControl(screen);
        } else if (event.key === "ArrowDown") {
            // 아래 방향키: 다음 항목으로 (마지막이면 0번으로 순환)
            screen.selectedIndex = (screen.selectedIndex + 1) % screen.controls.length;
            focusMenuScreenControl(screen);
        } else if (screen.controls[screen.selectedIndex].tagName === "BUTTON") {
            // Enter: 현재 선택이 버튼일 때만 클릭 처리
            screen.controls[screen.selectedIndex].click();
            //setTimeout으로 클릭 이벤트, 화면 전환 후에 포커스 다시 맞추도록함
            setTimeout(() => {
                const nextScreen = getActiveMenuScreen();
                if (nextScreen) focusMenuScreenControl(nextScreen);
            }, 0);
        }
        return true;
    }

    // ─────────────────────────────────────────
    // 렌더링 함수들
    // ─────────────────────────────────────────

    // 배경 캔버스에 게임 진행 배경 이미지 그리기
    function drawBackground() {
        bgCtx.clearRect(0, 0, WIDTH, HEIGHT);
        bgCtx.drawImage(gameBg, 0, 0, WIDTH, HEIGHT);
    }

    // 공 그리기 (여러 개일 경우 전부 그림)
    function drawBall() {
        balls.forEach(ball => {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#ff8c3a";
            ctx.shadowColor = "#ff8c3a";
            ctx.shadowBlur = 16;    // 글로우 효과
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.closePath();
        });
    }

    // 패들 그리기
    function drawPaddle() {
        ctx.fillStyle = "#e9f7ff";
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.strokeStyle = "#ff8c3a";
        ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    // 살아있는 벽돌만 이미지로 그리기
    function drawBricks() {
        bricks.forEach((brick) => {
            if (!brick.alive) return; // 깨진 벽돌은 건너뜀
            ctx.drawImage(dirtBrickImg, brick.x, brick.y, brick.width, brick.height);
        });
    }

    // 현재 떨어지는 아이템들을 타입에 맞는 이미지로 그리기
    function drawItems() {
        dropItems.forEach((item) => {
            const size = item.radius * 3;
            let img;
            if (item.type === "o2")        img = oxygenTankImg;
            if (item.type === "widebar")   img = widebaritemImg;
            if (item.type === "smallball") img = smallballitemImg;
            if (item.type === "x3")        img = x3itemImg;
            ctx.drawImage(img, item.x - size / 2, item.y - size / 2, size, size);
        });
    }

<<<<<<< HEAD
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
	function drawItems() {

		// o2Items 배열의 모든 아이템 반복
		dropItems.forEach((item) => {

        // 아이템 크기 설정
        const  size = item.radius * 3;
        let img;
        // 산소통 이미지를 아이템 위치에 그림
        if (item.type === "o2")       img = oxygenItemImg;
        if (item.type === "widebar")  img = widebaritemImg;
        if (item.type === "smallball") img = smallballitemImg;
        if (item.type === "x3")       img = x3itemImg;

        ctx.drawImage(img, item.x - size / 2, item.y - size / 2, size, size);
		});
	}

    // 산소가 20% 미만 일 시 경고 메시지 출력하기
=======
    // 산소 20% 미만 시 경고 표시 (effectCanvas에 빨간 오버레이 + 텍스트)
>>>>>>> 499d0936dd0a8feed68b980ef11984a56a475be6
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

    // ─────────────────────────────────────────
    // 아이템 생성
    // 벽돌이 깨질 때 35% 확률로 아이템 드롭
    // 난이도에 따라 디버프 아이템 등장 확률이 달라짐
    // ─────────────────────────────────────────
    function spawnItem(x, y) {
        if (Math.random() > 0.35) return; // 65% 확률로 아이템 없음

<<<<<<< HEAD
        // 버프 아이템 목록 
        const buffTypes = ["o2", "widebar","x3"];
=======
        const buffTypes = ["o2", "widebar", "x3"];      // 버프 아이템 목록
        const debuffTypes = ["smallball"];               // 디버프 아이템 목록
>>>>>>> 499d0936dd0a8feed68b980ef11984a56a475be6

        // 난이도별 디버프 등장 확률 (easy는 디버프 없음)
        const debuffChance = {
            easy: 0,
            normal: 0.2,
            hard: 0.3,
            impossible: 0.4
        };

        let type;
        if (Math.random() < debuffChance[currentMode]) {
            type = debuffTypes[Math.floor(Math.random() * debuffTypes.length)];
        } else {
            type = buffTypes[Math.floor(Math.random() * buffTypes.length)];
        }

        dropItems.push({
            x,
            y,
            radius: 15,
            dy: 1.4,        // 아이템 낙하 속도
            type,
            caught: false   // 패들에 먹혔는지 여부
        });
    }

    // ─────────────────────────────────────────
    // 이동 및 충돌 처리 함수들
    // ─────────────────────────────────────────

    // 키보드 입력에 따라 패들 이동 (화면 밖 이탈 방지)
    function movePaddle() {
        if (keys.left)  paddle.x -= paddle.speed;
        if (keys.right) paddle.x += paddle.speed;
        paddle.x = Math.max(0, Math.min(WIDTH - paddle.width, paddle.x));
    }

    // 최근 10프레임 패들 이동량 기록 (공 반사 시 방향에 영향)
    function recordPaddleMovement(beforeX) {
        paddleMoveHistory.push(paddle.x - beforeX);
        if (paddleMoveHistory.length > PADDLE_HISTORY_FRAME) {
            paddleMoveHistory.shift(); // 오래된 기록 제거
        }
    }

    // 최근 패들 이동 평균값 반환 (공이 패들에 맞을 때 수평 속도에 반영)
    function getAveragePaddleMovement() {
        return paddleMoveHistory.reduce((sum, value) => sum + value, 0) / paddleMoveHistory.length;
    }

    // 공 이동 + 벽/천장/패들 충돌 처리
    function moveBall() {
        balls.forEach(ball => {
            ball.x += ball.dx;
            ball.y += ball.dy;

            // 좌우 벽 충돌: x방향 반전
            if (ball.x + ball.radius > WIDTH || ball.x - ball.radius < 0) ball.dx *= -1;
            // 천장 충돌: y방향 반전
            if (ball.y - ball.radius < 0) ball.dy *= -1;

            // 패들과의 충돌 판정
            const hitPaddle =
                ball.y + ball.radius >= paddle.y &&
                ball.y + ball.radius <= paddle.y + paddle.height &&
                ball.x >= paddle.x &&
                ball.x <= paddle.x + paddle.width;

            if (hitPaddle) {
                ball.dy = -Math.abs(ball.dy); // 반드시 위로 튕기게
                // 패들 중심 기준 타격 위치 (-1 ~ 1) + 패들 이동 방향을 수평 속도에 반영
                const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
                //패들의 최근 10프레임 움직임을 공 움직임에 조금 반영.
                //보정계수 0.25 -> 15로 줄임
                ball.dx = hitPoint * 4 + getAveragePaddleMovement() * 0.15;
            }
        });

        // 화면 아래로 떨어진 공 제거
        balls = balls.filter(ball => ball.y - ball.radius <= HEIGHT);
        // 모든 공이 사라지면 게임 오버
        if (balls.length === 0) gameOver("MISSION FAILED");
    }

    // 공과 벽돌 충돌 처리
    // 겹침량(overlap)을 계산해 x/y 중 더 작은 쪽 방향으로 공을 튕김
    function checkBrickCollision() {
        balls.forEach(ball => {
            bricks.forEach((brick) => {
                if (!brick.alive) return;

                // AABB 충돌 판정 (Axis-Aligned Bounding Box)
                const hit =
                    ball.x + ball.radius > brick.x &&
                    ball.x - ball.radius < brick.x + brick.width &&
                    ball.y + ball.radius > brick.y &&
                    ball.y - ball.radius < brick.y + brick.height;

                if (hit) {
                    brick.alive = false;

                    // 벽돌 중심과 공의 상대 위치
                    const brickCenterX = brick.x + brick.width / 2;
                    const brickCenterY = brick.y + brick.height / 2;
                    const dx = ball.x - brickCenterX;
                    const dy = ball.y - brickCenterY;

                    // 겹친 양 계산
                    const overlapX = brick.width / 2 + ball.radius - Math.abs(dx);
                    const overlapY = brick.height / 2 + ball.radius - Math.abs(dy);

                    // 겹침이 적은 축 방향으로 튕김 처리
                    if (overlapX < overlapY) {
                        ball.dx *= -1;
                        ball.x = dx > 0 ? brick.x + brick.width + ball.radius : brick.x - ball.radius;
                    } else {
                        ball.dy *= -1;
                        ball.y = dy > 0 ? brick.y + brick.height + ball.radius : brick.y - ball.radius;
                    }

                    score += 10;
                    spawnItem(brick.x + brick.width / 2, brick.y + brick.height / 2);
                    // 벽돌 파괴 효과음 재생
                    sfxPlayer.currentTime = 0;
                    sfxPlayer.play();
                }
            });
        });

        // 모든 벽돌이 파괴되면 스테이지 클리어
        if (bricks.every((brick) => !brick.alive)) {
            gameOver("STAGE CLEAR");
        }
    }

    // 아이템 이동 + 패들과의 충돌(획득) 처리
    function moveItems() {
        dropItems.forEach((item) => {
            item.y += item.dy; // 아이템 낙하

            // 패들과 아이템 충돌 판정
            const hitPaddle =
                item.y + item.radius >= paddle.y &&
                item.y - item.radius <= paddle.y + paddle.height &&
                item.x >= paddle.x &&
                item.x <= paddle.x + paddle.width;

            if (hitPaddle) {
                item.caught = true;

                if (item.type === "o2") {
                    // 산소 20 회복 (최대 100)
                    o2 = Math.min(100, o2 + 20);

                } else if (item.type === "widebar") {
                    // 패들 너비 50 증가 (최대 310)
                    paddle.width = Math.min(paddle.width + 50, 310);

                } else if (item.type === "smallball") {
                    // 공 크기 2 감소 (최소 2)
                    balls.forEach(b => { b.radius = Math.max(b.radius - 2, 2); });

                } else if (item.type === "x3") {
                    // 현재 공마다 ±20도 방향으로 공 2개 추가 생성 (기존 1개 → 총 3개)
                    const newBalls = [];
                    balls.forEach(b => {
                        const speed = Math.sqrt(b.dx * b.dx + b.dy * b.dy); // 현재 공의 속력
                        const angle = Math.atan2(b.dy, b.dx);               // 현재 이동 각도
                        const spread = 20 * Math.PI / 180;                  // 20도를 라디안으로 변환
                        // +20도 방향 공
                        newBalls.push({ x: b.x, y: b.y, radius: b.radius,
                            dx: speed * Math.cos(angle + spread),
                            dy: speed * Math.sin(angle + spread) });
                        // -20도 방향 공
                        newBalls.push({ x: b.x, y: b.y, radius: b.radius,
                            dx: speed * Math.cos(angle - spread),
                            dy: speed * Math.sin(angle - spread) });
                    });
                    balls = [...balls, ...newBalls]; // 기존 공 배열에 새 공 추가
                }
            }
        });

        // 화면 밖으로 나갔거나 이미 획득한 아이템 제거
        dropItems = dropItems.filter((item) => !item.caught && item.y < HEIGHT + 30);
    }

    // ─────────────────────────────────────────
    // 게임 종료 처리
    // message: "MISSION FAILED" / "STAGE CLEAR" / "OXYGEN DEPLETED"
    // ─────────────────────────────────────────
    function gameOver(message) {
        if (!isPlaying) return; // 중복 실행 방지
        isPlaying = false;
        gameOverMessage = message;
        canvasStack.style.transform = "translate(0,0)";
        showResultButtons(message === "STAGE CLEAR");
    }

    // effectCanvas 중앙에 반투명 검정 배경 + 텍스트 출력 (게임 오버, 일시정지 메시지용)
    function drawCenterMessage(message) {
        effectCtx.fillStyle = "rgba(0, 0, 0, 0.72)";
        effectCtx.fillRect(0, 0, WIDTH, HEIGHT);
        effectCtx.fillStyle = "#ffffff";
        effectCtx.font = "bold 38px Orbitron";
        effectCtx.textAlign = "center";
        effectCtx.fillText(message, WIDTH / 2, HEIGHT / 2 - 20);
    }

    // 일시정지 처리
    function pauseGame() {
        if (!isPlaying || gameOverMessage) return;
        isPlaying = false;
        isPaused = true;
        if (animationId) cancelAnimationFrame(animationId);
        canvasStack.style.transform = "translate(0, 0)";
        effectCtx.clearRect(0, 0, WIDTH, HEIGHT);
        drawCenterMessage("PAUSED");
        showPauseButtons();
    }

    // 일시정지 해제 및 게임 재개
    function resumeGame() {
        if (!isPaused) return;
        hideResultButtons();
        effectCtx.clearRect(0, 0, WIDTH, HEIGHT);
        isPaused = false;
        isPlaying = true;
        lastTime = performance.now();
        animationId = requestAnimationFrame(gameLoop);
    }

    // 산소 감소 처리 (deltaTime 기반으로 프레임 속도 무관하게 일정하게 감소)
    function updateOxygen(deltaTime) {
        o2 -= deltaTime * currentO2Drain; // 난이도에 따른 초당 감소량
        o2 = Math.max(0, o2);             // 0 미만으로 내려가지 않도록

        // 20% 미만이면 화면 흔들림 활성화
        if (o2 < 20) {
            lowOxygenShake = 5;
        }

        if (o2 <= 0) {
            gameOver("OXYGEN DEPLETED");
        }
    }

    // ─────────────────────────────────────────
    // 메인 게임 루프
    // requestAnimationFrame으로 매 프레임 호출됨
    // timestamp: 브라우저가 자동으로 넣어주는 현재 시간(ms)
    // ─────────────────────────────────────────
    function gameLoop(timestamp) {
        if (!isPlaying && !gameOverMessage) return; // 게임 종료 상태면 루프 중단
        if (isPaused) return;                       // 일시정지 상태면 루프 중단

        // deltaTime: 이전 프레임과의 시간 차이(초 단위) → 프레임 속도 독립적 처리
        const deltaTime = (timestamp - lastTime) / 1000 || 0;
        lastTime = timestamp;

        // 게임 로직 업데이트
        updateOxygen(deltaTime);
        const paddleBeforeX = paddle.x;
        movePaddle();
        recordPaddleMovement(paddleBeforeX);
        moveBall();
        checkBrickCollision();
        moveItems();
        updateUI();

        // 산소 부족 시 화면 흔들림 처리
        if (lowOxygenShake > 0) {
            const shakeX = Math.random() * 8 - 4;
            const shakeY = Math.random() * 8 - 4;
            canvasStack.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
            lowOxygenShake--;
        } else {
            canvasStack.style.transform = "translate(0, 0)";
        }

        // 렌더링 (매 프레임 전체 다시 그림)
        drawBackground();
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        effectCtx.clearRect(0, 0, WIDTH, HEIGHT);
        drawBricks();
        drawItems();
        drawPaddle();
        drawBall();
        drawLowOxygenWarning();

        // 게임 오버 상태면 중앙 메시지 출력 후 루프 종료
        if (gameOverMessage) {
            drawCenterMessage(gameOverMessage);
            return;
        }

        animationId = requestAnimationFrame(gameLoop); // 다음 프레임 요청
    }

    // ─────────────────────────────────────────
    // 이벤트 리스너 등록
    // ─────────────────────────────────────────

    // 종료 버튼: 확인 후 탭 닫기 시도
    exitBtn.addEventListener("click", () => {
        if (confirm("게임을 종료하시겠습니까?")) {
            window.close();
            // window.close()가 차단된 경우 (직접 열린 탭)
            document.body.innerHTML = "<div style='display:flex;justify-content:center;align-items:center;height:100vh;color:white;font-size:24px;background:#000;'>탭을 닫아주세요.</div>";
        }
    });

    // 게임 시작 버튼: 난이도 선택 화면으로 이동
    startBtn.addEventListener("click", () => {
        menuContainer.style.display = "none";
        difficultyContainer.style.display = "flex";
    });

    // 난이도 버튼 클릭: 선택한 난이도로 게임 시작
    difficultyBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            document.body.style.backgroundImage = "none";
            const mode = btn.dataset.mode; // HTML의 data-mode 속성값
            if (!mode) return;
            currentDifficulty = difficultySettings[mode];
            currentO2Drain = currentDifficulty.o2Drain;
            currentMode = mode;
            difficultyContainer.style.display = "none";
            menuContainer.style.display = "none";
            gameContainer.style.display = "flex";
            startRound();
        });
    });

    // 난이도 선택 → 뒤로가기: 메인 메뉴로 복귀
    difficultyBackBtn.addEventListener("click", () => {
        difficultyContainer.style.display = "none";
        menuContainer.style.display = "flex";
        document.body.style.backgroundImage = window.currentMenuBackground || 'url("images/space-background1.png")';
        focusMenuButton();
    });

    // 메인 메뉴로 버튼: 게임 루프 중단 후 메뉴로 복귀
    backToMenuBtn.addEventListener("click", () => {
        isPlaying = false;
        isPaused = false;
        if (animationId) cancelAnimationFrame(animationId);
        gameContainer.style.display = "none";
        menuContainer.style.display = "flex";
        difficultyContainer.style.display = "none";
        document.body.style.backgroundImage = window.currentMenuBackground || 'url("images/space-background1.png")';
        canvasStack.style.transform = "translate(0, 0)";
        hideResultButtons();
        gameOverMessage = null;
        focusMenuButton();
    });

    // 재개 버튼
    resumeBtn.addEventListener("click", () => {
        resumeGame();
    });

    // 재도전 버튼
    retryBtn.addEventListener("click", () => {
        startRound();
    });

    // 다음 스테이지 버튼 (현재는 같은 스테이지 재시작)
    nextStageBtn.addEventListener("click", () => {
        startRound();
    });

    // 키보드 입력 처리
    document.addEventListener("keydown", (event) => {
        if (handleMenuKeyboard(event)) return; // 메뉴에서의 방향키/Enter 처리

        // Escape: 일시정지 토글
        if (event.key === "Escape") {
            if (isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
            return;
        }

        if (window.controlMode === "mouse") return; // 마우스 모드면 키보드 패들 조작 무시
        if (event.key === "ArrowLeft")  keys.left = true;
        if (event.key === "ArrowRight") keys.right = true;
    });

    document.addEventListener("keyup", (event) => {
        if (window.controlMode === "mouse") return;
        if (event.key === "ArrowLeft")  keys.left = false;
        if (event.key === "ArrowRight") keys.right = false;
    });

    // 마우스 이동 시 패들이 마우스 X좌표를 따라가도록 처리
    canvas.addEventListener("mousemove", (event) => {
        if (window.controlMode === "keyboard") return; // 키보드 모드면 마우스 무시
        const rect = canvas.getBoundingClientRect();
        paddle.x = event.clientX - rect.left - paddle.width / 2;
        paddle.x = Math.max(0, Math.min(WIDTH - paddle.width, paddle.x)); // 화면 밖 이탈 방지
    });

    focusMenuButton(); // 초기 포커스 설정
});
