// DOM이 완전히 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {

    // ─────────────────────────────────────────
    // 환경설정 메뉴 화면 전환
    // ─────────────────────────────────────────
    const menuContainer = document.getElementById("menu-container");
    const settingsContainer = document.getElementById("settingsContainer");
    const settingsBtn = document.getElementById("settingsBtn");
    const backBtn = document.getElementById("backBtn");

    // 메뉴 배경 이미지 (전역 변수로 공유 - BlockGameJs.js에서 참조)
    window.currentMenuBackground = 'url("images/space-background1.png")';

    // 메인 메뉴로 이동
    const showMenu = () => {
        menuContainer.style.display = "flex";
        settingsContainer.style.display = "none";
    };

    // 환경설정 화면으로 이동
    const showSettings = () => {
        menuContainer.style.display = "none";
        settingsContainer.style.display = "flex";
    };

    settingsBtn.addEventListener("click", showSettings);
    backBtn.addEventListener("click", showMenu);

    // ─────────────────────────────────────────
    // 사운드 설정
    // ─────────────────────────────────────────
    const audioBtn = document.getElementById("audioBtn");
    const audioSettingsContainer = document.querySelector(".audio-settings-container");
    const audioBackBtn = document.getElementById("audioBackBtn");

    const bgmPlayer = document.getElementById("bgmPlayer");        // BGM 오디오 엘리먼트
    const bgmToggleBtn = document.getElementById("bgmToggleBtn");  // BGM ON/OFF 버튼
    const trackSelect = document.getElementById("trackSelect");    // 트랙 선택 드롭다운
    const volumeSlider = document.getElementById("volumeSlider");  // BGM 볼륨 슬라이더
    const sfxVolumeSlider = document.getElementById("sfxVolumeSlider"); // 효과음 볼륨 슬라이더

    // 사운드 설정 화면으로 이동
    const showAudioSettings = () => {
        settingsContainer.style.display = "none";
        audioSettingsContainer.style.display = "flex";
    };

    // 사운드 설정 → 환경설정으로 복귀
    const showSettingsFromAudio = () => {
        audioSettingsContainer.style.display = "none";
        settingsContainer.style.display = "flex";
    };

    audioBtn.addEventListener("click", showAudioSettings);
    audioBackBtn.addEventListener("click", showSettingsFromAudio);

    // BGM ON/OFF 토글
    // bgmOn=true: 음악 재생 + "ON" 표시 / bgmOn=false: 음악 정지 + "OFF" 표시
    let bgmOn = false; // 초기 상태: OFF
    bgmToggleBtn.addEventListener("click", () => {
        bgmOn = !bgmOn;
        if (bgmOn) {
            bgmPlayer.src = trackSelect.value; // 현재 선택된 트랙 로드
            bgmPlayer.play();
            bgmToggleBtn.textContent = "ON";
            bgmToggleBtn.classList.add("active");
        } else {
            bgmPlayer.pause();
            bgmToggleBtn.textContent = "OFF";
            bgmToggleBtn.classList.remove("active");
        }
    });

    // 트랙 변경 시 BGM이 켜져 있으면 즉시 새 트랙 재생
    trackSelect.addEventListener("change", () => {
        if (bgmOn) {
            bgmPlayer.src = trackSelect.value;
            bgmPlayer.play();
        }
    });

    // BGM 볼륨 조절 (슬라이더 값 0~100을 0~1로 변환)
    volumeSlider.addEventListener("input", () => {
        bgmPlayer.volume = volumeSlider.value / 100;
    });

    // 효과음 볼륨 조절 (BlockGameJs.js의 sfxPlayer가 같은 엘리먼트를 참조)
    sfxVolumeSlider.addEventListener("input", () => {
        const sfxPlayer = document.getElementById("sfxPlayer");
        sfxPlayer.volume = sfxVolumeSlider.value / 100;
    });

    // ─────────────────────────────────────────
    // 배경 설정
    // ─────────────────────────────────────────
    const backgroundBtn = document.getElementById("backgroundBtn");
    const backgroundSettingsContainer = document.querySelector(".background-settings-container");
    const backgroundBackBtn = document.getElementById("backgroundBackBtn");

    const bg1Btn = document.getElementById("bg1Btn");
    const bg2Btn = document.getElementById("bg2Btn");
    const bg3Btn = document.getElementById("bg3Btn");

    // 배경 설정 화면으로 이동
    const showBackgroundSettings = () => {
        settingsContainer.style.display = "none";
        backgroundSettingsContainer.style.display = "flex";
    };

    // 배경 설정 → 환경설정으로 복귀
    const showSettingsFromBackground = () => {
        backgroundSettingsContainer.style.display = "none";
        settingsContainer.style.display = "flex";
    };

    backgroundBtn.addEventListener("click", showBackgroundSettings);
    backgroundBackBtn.addEventListener("click", showSettingsFromBackground);

    // 배경 이미지 적용 (body 전체에 적용)
    const applyBackground = (imagePath) => {
        document.body.style.backgroundImage = `url('${imagePath}')`;
        document.body.style.backgroundSize = "contain";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
    };

    // 배경 선택 버튼 (window.currentMenuBackground에 저장해 화면 전환 시에도 유지)
    bg1Btn.addEventListener("click", () => {
        window.currentMenuBackground = 'url("images/space-background1.png")';
        document.body.style.backgroundImage = window.currentMenuBackground;
    });

    bg2Btn.addEventListener("click", () => {
        window.currentMenuBackground = 'url("images/space-background2.png")';
        document.body.style.backgroundImage = window.currentMenuBackground;
    });

    bg3Btn.addEventListener("click", () => {
        window.currentMenuBackground = 'url("images/space-background3.png")';
        document.body.style.backgroundImage = window.currentMenuBackground;
    });

    // ─────────────────────────────────────────
    // 조작 방식 설정
    // window.controlMode를 BlockGameJs.js가 참조하여 패들 조작 방식 결정
    // ─────────────────────────────────────────
    const controlStyleBtn = document.getElementById("controlStyleBtn");
    const controlSettingsContainer = document.querySelector(".control-settings-container");
    const controlBackBtn = document.getElementById("controlBackBtn");

    const controlKeyboardBtn = document.getElementById("controlKeyboardBtn");
    const controlMouseBtn = document.getElementById("controlMouseBtn");
    const controlBothBtn = document.getElementById("controlBothBtn");

    // 조작 방식 설정 화면으로 이동
    const showControlSettings = () => {
        settingsContainer.style.display = "none";
        controlSettingsContainer.style.display = "flex";
    };

    // 조작 방식 설정 → 환경설정으로 복귀
    const showSettingsFromControl = () => {
        controlSettingsContainer.style.display = "none";
        settingsContainer.style.display = "flex";
    };

    controlStyleBtn.addEventListener("click", showControlSettings);
    controlBackBtn.addEventListener("click", showSettingsFromControl);

    // 조작 방식 변경 함수
    // mode: "keyboard" / "mouse" / "both"
    // 선택된 버튼에 "selected" 클래스 추가해 시각적으로 표시
    window.controlMode = "both"; // 초기 조작 방식: 키보드 + 마우스 동시

    const setControlMode = (mode) => {
        window.controlMode = mode;
        // 모든 버튼에서 selected 제거 후 해당 버튼에만 추가
        [controlKeyboardBtn, controlMouseBtn, controlBothBtn].forEach(btn =>
            btn.classList.remove("selected")
        );
        if (mode === "keyboard") controlKeyboardBtn.classList.add("selected");
        if (mode === "mouse")    controlMouseBtn.classList.add("selected");
        if (mode === "both")     controlBothBtn.classList.add("selected");
    };

    setControlMode("both"); // 초기 선택 상태 적용

    controlKeyboardBtn.addEventListener("click", () => setControlMode("keyboard"));
    controlMouseBtn.addEventListener("click",    () => setControlMode("mouse"));
    controlBothBtn.addEventListener("click",     () => setControlMode("both"));
});
