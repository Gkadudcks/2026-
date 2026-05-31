// ─────────────────────────────────────────
// StoryModeJs.js — 스토리 모드 설정 및 로직
// BlockGameJs.js, BlockGameMaps.js 와 연동하여 동작
// ─────────────────────────────────────────

// ─────────────────────────────────────────
// 스테이지별 설정
// difficulty    : difficultySettings의 키값 (easy/normal/hard/impossible)
// startO2       : 스테이지 시작 시 산소량 (0~100)
// availableItems: 해당 스테이지에서 드롭 가능한 아이템 목록
//                 buffTypes/debuffTypes 대신 이 배열을 참조
//                 x3를 2번 넣으면 드롭 확률 2배
// mapName       : BlockGameMaps.js에 정의된 맵 이름 (null이면 기본 랜덤 배치)
// background    : 게임 진행 중 배경 이미지 파일명
// clearMessage  : 스테이지 클리어 시 표시할 메시지
// ─────────────────────────────────────────
window.STORY_STAGES = [
    {
        stage: 1,
        title: "각성 (Awakening)",
        difficulty: "easy",
        startO2: 100,
        availableItems: ["o2"],
        mapName: null,
        background: null,
        clearMessage: "시스템 복구 완료. 기억이 돌아오기 시작한다."
    },
    {
        stage: 2,
        title: "임무 (The Mission)",
        difficulty: "normal",
        startO2: 100,
        availableItems: ["o2", "widebar", "x3"],
        mapName: "split-center-wall",    // 항로를 막는 아스트로파지 군집 연출
        background: null,
        clearMessage: "타우 세티까지 항로 확보. 계속 전진한다."
    },
    {
        stage: 3,
        title: "첫 접촉 (First Contact)",
        difficulty: "normal",
        startO2: 100,
        availableItems: ["o2", "widebar", "x3", "smallball"],
        mapName: "diamond-island",       // 소수 패턴 시각적 연출
        background: "images/space-background1.png",
        clearMessage: "로키와 교신 성공. 우린 동맹이 되었다."
    },
    {
        stage: 4,
        title: "아스트로파지의 비밀 (The Secret of Astrophage)",
        difficulty: "hard",
        startO2: 100,
        availableItems: ["o2", "widebar", "x3", "smallball"],
        mapName: "three-mid-bars",       // 연구 장벽 느낌
        background: "images/space-background2.png",
        clearMessage: "아드리안에서 뭔가를 발견했다."
    },
    {
        stage: 5,
        title: "타우모에바 (Taumoeba)",
        difficulty: "hard",
        startO2: 100,
        availableItems: ["o2", "widebar", "x3", "smallball"],
        mapName: "triangle-guides",      // 공이 사방으로 퍼지는 느낌
        background: "images/space-background3.png",
        clearMessage: "타우모에바 배양 완료. 이제 귀환이다."
    },
    {
        stage: 6,
        title: "헤일 메리 (Hail Mary)",
        difficulty: "impossible",
        startO2: 30,                     // 긴박감 — 처음부터 LOW OXYGEN 경고
        availableItems: ["o2", "widebar", "x3", "smallball"],
        mapName: "diamond-cross",        // 가장 복잡한 맵
        background: "images/space-background3.png",
        clearMessage: "MISSION COMPLETE — 지구를 구했다."
    }
];

// ─────────────────────────────────────────
// 컷씬 텍스트
// lines: 한 줄씩 순서대로 표시할 텍스트 배열
// ─────────────────────────────────────────
window.STORY_CUTSCENES = [
    {
        stage: 1,
        character: null,
        lines: [
            "눈이 떠진다.",
            "여기는... 어디지?",
            "",
            "주위에는 아무도 없다.",
            "창밖엔 별밖에 없다.",
            "",
            "내 이름은 라일랜드 그레이스.",
            "그리고 나는... 뭔가 중요한 걸 해야 했던 것 같다.",
            "",
            "[산소 잔량 확인 중...]",
            "[MISSION START]"
        ]
    },
    {
        stage: 2,
        character: null,
        lines: [
            "기억이 돌아왔다.",
            "",
            "태양이 죽어가고 있다.",
            "아스트로파지(Astrophage)라는 미생물이",
            "태양의 에너지를 빨아먹고 있다.",
            "",
            "인류는 나를 보냈다. 혼자.",
            "타우 세티(Tau Ceti) 별을 향해.",
            "",
            "거기엔 뭔가 답이 있을 거라고.",
            "나는 돌아오지 못할 수도 있다.",
            "",
            "그래도 간다."
        ]
    },
    {
        stage: 3,
        character: "loki1",
        lines: [
            "레이더에 뭔가 잡혔다.",
            "",
            "...우주선?",
            "나 말고도 누군가 여기 있다.",
            "",
            "신호를 보냈다. 응답이 왔다.",
            "하지만 말이 통하지 않는다.",
            "",
            "숫자로 시도해봤다.",
            "1, 2, 3, 5, 7...",
            "",
            "상대방이 답했다: 11, 13, 17...",
            "",
            "소수(prime number).",
            "우린 서로를 이해하기 시작했다.",
            "",
            "그의 이름은 '로키(Rocky)'.",
            "그도 나처럼 자기 별을 구하러 왔다."
        ]
    },
    {
        stage: 4,
        character: "loki1",
        lines: [
            "로키와 함께 아스트로파지를 분석했다.",
            "",
            "이 녀석들은 빛을 에너지원으로 쓴다.",
            "별을 먹는다. 효율적으로, 끊임없이.",
            "",
            "그런데 이상하다.",
            "타우 세티 근처의 행성 '아드리안(Adrian)'—",
            "거기엔 아스트로파지가 없다.",
            "",
            "왜지?"
        ]
    },
    {
        stage: 5,
        character: "loki1",
        lines: [
            "찾았다.",
            "",
            "아드리안의 미생물, '타우모에바(Taumoeba)'.",
            "얘네가 아스트로파지를 먹는다.",
            "",
            "이걸 지구로 가져가면—",
            "태양을 살릴 수 있다.",
            "",
            "로키도 같은 결론에 도달했다.",
            "에리드(Erid) 별도 살릴 수 있다.",
            "",
            "하지만 문제가 있다.",
            "우린 각자의 별로 돌아가야 한다.",
            "그리고 우리 중 하나는...",
            "혼자 돌아가야 한다."
        ]
    },
    {
        stage: 6,
        character: "loki2",
        lines: [
            "로키는 나를 돌려보내기로 했다.",
            "자기는 에리드로 간다고.",
            "",
            "\"당신의 별이 더 많은 사람이 살고 있다.\"",
            "그가 그렇게 말했다. 그 말이 맞다.",
            "",
            "하지만 나는—",
            "",
            "[통신 두절]",
            "",
            "로키. 고마워.",
            "살아서 돌아가.",
            "",
            "나는 지구로 간다.",
            "혼자지만, 우리가 찾은 답을 들고."
        ]
    }
];

// ─────────────────────────────────────────
// 엔딩 A — 지구로 돌아가는 엔딩 (Stage 6 클리어 후)
// ─────────────────────────────────────────
window.STORY_ENDING_A = [
    "지구로 돌아왔다.",
    "",
    "타우모에바는 아스트로파지를 먹어치웠다.",
    "태양은 다시 빛나기 시작했다.",
    "",
    "임무 완수.",
    "그레이스는 영웅이 되었다.",
    "",
    "로키—",
    "너도 잘 돌아갔겠지.",
    "언젠가 다시 만날 수 있을까.",
    "별과 별 사이 어딘가에서.",
    "",
    "ENDING A",
    "— PROJECT HAIL MARY —"
];

// ─────────────────────────────────────────
// 엔딩 B — 로키와 함께 남는 엔딩 (Stage 5 클리어 후 선택)
// ─────────────────────────────────────────
window.STORY_ENDING_B = [
    "나는 남기로 했다.",
    "",
    "로키 혼자서는 에리드로 돌아갈 수 없다.",
    "그걸 알면서 어떻게 떠날 수 있겠어.",
    "",
    "지구는... 다른 방법을 찾을 거야.",
    "인류는 포기하지 않으니까.",
    "",
    "나는 여기, 로키 곁에 있다.",
    "우주에서 가장 먼 곳에서.",
    "가장 가까운 친구와 함께.",
    "",
    "ENDING B  ─  TRUE ENDING",
    "— PROJECT HAIL MARY —"
];

// ─────────────────────────────────────────
// 스토리 모드 상태 변수
// ─────────────────────────────────────────
window.storyMode = {
    active: false,       // 현재 스토리 모드 진행 중 여부
    currentStage: 0,     // 현재 스테이지 인덱스 (0 = Stage 1)
    endingChoice: null   // "A" = 지구귀환, "B" = 로키와 남음
};

// ─────────────────────────────────────────
// TODO: 아래 함수들은 BlockGameJs.js와 연동하여 구현
// ─────────────────────────────────────────

// 스토리 모드 시작 (메인 메뉴 → 스토리 모드 버튼 클릭 시 호출)
function startStoryMode() {
    window.storyMode.active = true;
    window.storyMode.currentStage = 0;

    document.body.style.backgroundImage = "none";
    document.getElementById("difficultyContainer").style.display = "none";
    document.getElementById("menu-container").style.display = "none";
    document.getElementById("gameContainer").style.display = "flex";

    showCutscene(0);
}

// 컷씬 표시 (스테이지 시작 전 호출)
// stageIndex: STORY_STAGES 배열의 인덱스
function showCutscene(stageIndex) {
    // TODO: 텍스트 오버레이 div 생성 및 표시
    //       SKIP 버튼 클릭 또는 일정 시간 후 startStoryStage() 호출
    const cutscene=window.STORY_CUTSCENES[stageIndex];
    const container=document.getElementById("cutsceneContainer");
    const textEl=document.getElementById("cutsceneText");
    const charImg=document.getElementById("cutsceneCharacter");

    document.getElementById("gameResultButtons").style.display="none";

    // 캐릭터 이미지 표시 및 레이아웃 전환
    if (cutscene.character) {
        charImg.src = `images/${cutscene.character}.png`;
        charImg.style.display = "block";
        container.classList.add("with-character");
    } else {
        charImg.style.display = "none";
        container.classList.remove("with-character");
    }

    // 이전 스테이지 클리어 메시지가 캔버스에 남아있지 않도록 제거
    const effectCanvas = document.getElementById("effectCanvas");
    effectCanvas.getContext("2d").clearRect(0, 0, effectCanvas.width, effectCanvas.height);
    const gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.getContext("2d").clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    container.style.display="flex";
    textEl.innerHTML=""

    let lineIndex = 0;
    let intervalId = null;
    let textDone = false;

    const skipBtn = document.getElementById("cutsceneSkipBtn");

    function showAllText() {
        clearInterval(intervalId);
        textEl.innerHTML = cutscene.lines
            .map(line => `<p>${line || "&nbsp;"}</p>`)
            .join("");
        textDone = true;
        skipBtn.textContent = "▶ 클릭하여 시작";
    }

    intervalId = setInterval(() => {
        if (lineIndex >= cutscene.lines.length) {
            clearInterval(intervalId);
            textDone = true;
            skipBtn.textContent = "▶ 클릭하여 시작";
            return;
        }
        const p = document.createElement("p");
        p.textContent = cutscene.lines[lineIndex];
        textEl.appendChild(p);
        lineIndex++;
    }, 500);

    // 텍스트 진행 중이면 전체 표시, 완료 후면 게임 시작
    container.onclick = () => {
        if (!textDone) {
            showAllText();
        } else {
            skipBtn.textContent = "SKIP";
            skipBtn.blur();
            container.onclick = null;
            charImg.style.display = "none";
            container.classList.remove("with-character");
            container.style.display = "none";
            startStoryStage(stageIndex);
        }
    };
}

// 스테이지 시작 (컷씬 종료 후 호출)
function startStoryStage(stageIndex) {
    const stage = window.STORY_STAGES[stageIndex];

    // BlockGameJs.js의 window.gameAPI를 통해 난이도 설정 후 게임 시작
    window.gameAPI.setDifficulty(stage.difficulty);
    window.gameAPI.setAvailableItems(stage.availableItems);
    window.gameAPI.setBackground(stage.background);
    window.gameAPI.startRound();
}

// 스테이지 클리어 후 다음 스테이지로 진행 (nextStageBtn 클릭 시 호출)
function nextStoryStage() {
    window.storyMode.currentStage++;

    // 스테이지 5 클리어 → 분기 선택 화면
    if (window.storyMode.currentStage === 5) {
        showBranchChoice();
        return;
    }

    // 스테이지 6 클리어 → 엔딩 A
    if (window.storyMode.currentStage >= window.STORY_STAGES.length) {
        showEnding(window.STORY_ENDING_A);
        return;
    }

    showCutscene(window.storyMode.currentStage);
}

// 분기 선택 화면 (스테이지 5 클리어 후)
function showBranchChoice() {
    const container = document.getElementById("cutsceneContainer");
    const textEl = document.getElementById("cutsceneText");
    const skipBtn = document.getElementById("cutsceneSkipBtn");
    const branchContainer = document.getElementById("branchChoiceContainer");

    document.getElementById("gameResultButtons").style.display = "none";

    const effectCanvas = document.getElementById("effectCanvas");
    effectCanvas.getContext("2d").clearRect(0, 0, effectCanvas.width, effectCanvas.height);
    const gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.getContext("2d").clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    container.style.display = "flex";
    container.onclick = null;
    skipBtn.style.display = "none";
    branchContainer.style.display = "flex";

    textEl.innerHTML = [
        "타우모에바 배양 완료.",
        "",
        "하지만 로키는 혼자 에리드로 돌아갈 수 없다.",
        "나 없이는.",
        "",
        "그리고 우리 중 하나는...",
        "혼자 돌아가야 한다.",
        "",
        "나는 어떻게 할 것인가."
    ].map(line => `<p>${line || "&nbsp;"}</p>`).join("");

    document.getElementById("branchABtn").onclick = (e) => {
        e.stopPropagation();
        branchContainer.style.display = "none";
        skipBtn.style.display = "block";
        container.style.display = "none";
        window.storyMode.endingChoice = "A";
        showCutscene(5); // 스테이지 6 컷씬 → 스테이지 6 플레이
    };

    document.getElementById("branchBBtn").onclick = (e) => {
        e.stopPropagation();
        branchContainer.style.display = "none";
        skipBtn.style.display = "block";
        window.storyMode.endingChoice = "B";
        showEnding(window.STORY_ENDING_B); // 바로 엔딩 B
    };
}

// 엔딩 화면 표시 (lines: 표시할 텍스트 배열)
function showEnding(lines) {
    const container = document.getElementById("cutsceneContainer");
    const textEl = document.getElementById("cutsceneText");
    const skipBtn = document.getElementById("cutsceneSkipBtn");
    const charImg = document.getElementById("cutsceneCharacter");

    document.getElementById("gameResultButtons").style.display = "none";
    charImg.style.display = "none";
    container.classList.remove("with-character");
    container.style.display = "flex";
    container.onclick = null;
    skipBtn.style.display = "none";
    textEl.innerHTML = "";

    let lineIndex = 0;
    const intervalId = setInterval(() => {
        if (lineIndex >= lines.length) {
            clearInterval(intervalId);
            return;
        }
        const p = document.createElement("p");
        p.textContent = lines[lineIndex] || "";
        textEl.appendChild(p);
        lineIndex++;
    }, 800);

    container.onclick = () => {
        clearInterval(intervalId);
        container.style.display = "none";
        skipBtn.style.display = "block";
        window.storyMode.active = false;
        window.storyMode.currentStage = 0;
        window.storyMode.endingChoice = null;
        document.getElementById("gameContainer").style.display = "none";
        document.getElementById("menu-container").style.display = "flex";
        document.body.style.backgroundImage =
            window.currentMenuBackground || 'url("images/space-background1.png")';
    };
}
