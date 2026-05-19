document.addEventListener("DOMContentLoaded",() =>{
	/* 환경 설정*/
	const menuContainer=document.getElementById("menu-container");
	const settingsContainer=document.getElementById("settingsContainer");

	const settingsBtn = document.getElementById("settingsBtn");
	const backBtn = document.getElementById("backBtn");


	const showMenu = () =>{
		menuContainer.style.display="flex";
		settingsContainer.style.display="none";

	};

	const showSettings = () =>{
		menuContainer.style.display = "none";
		settingsContainer.style.display="flex";
	};

	settingsBtn.addEventListener("click",showSettings);
	backBtn.addEventListener("click",showMenu);

	/*사운드 설정*/
	const audioBtn = document.getElementById("audioBtn");
	const audioSettingsContainer = document.querySelector(".audio-settings-container");
	const audioBackBtn = document.getElementById("audioBackBtn");

	const bgmPlayer = document.getElementById("bgmPlayer");
	const bgmToggleBtn = document.getElementById("bgmToggleBtn");
	const trackSelect = document.getElementById("trackSelect");
	const volumeSlider = document.getElementById("volumeSlider");
	const sfxVolumeSlider = document.getElementById("sfxVolumeSlider");

	const showAudioSettings = () => {
		settingsContainer.style.display = "none";
		audioSettingsContainer.style.display = "flex";
	};

	const showSettingsFromAudio = () => {
		audioSettingsContainer.style.display = "none";
		settingsContainer.style.display = "flex";
	};

	audioBtn.addEventListener("click", showAudioSettings);
	audioBackBtn.addEventListener("click", showSettingsFromAudio);

	/*BGM ON/OFF*/
	let bgmOn = false;
	bgmToggleBtn.addEventListener("click", () => {
		bgmOn = !bgmOn;
		if (bgmOn) {
			bgmPlayer.src = trackSelect.value;
			bgmPlayer.play();
			bgmToggleBtn.textContent = "OFF";
			bgmToggleBtn.classList.add("active");
		} else {
			bgmPlayer.pause();
			bgmToggleBtn.textContent = "ON";
			bgmToggleBtn.classList.remove("active");
		}
	});

	/*트랙 선택*/
	trackSelect.addEventListener("change", () => {
		if (bgmOn) {
			bgmPlayer.src = trackSelect.value;
			bgmPlayer.play();
		}
	});

	/*BGM 볼륨*/
	volumeSlider.addEventListener("input", () => {
		bgmPlayer.volume = volumeSlider.value / 100;
	});

	/*효과음 볼륨 — BlockGameJs.js의 sfxPlayer가 참조*/
	sfxVolumeSlider.addEventListener("input", () => {
		const sfxPlayer = document.getElementById("sfxPlayer");
		sfxPlayer.volume = sfxVolumeSlider.value / 100;
	});

	/*배경 설정*/
	const backgroundBtn = document.getElementById("backgroundBtn");
	const backgroundSettingsContainer = document.querySelector(".background-settings-container");
	const backgroundBackBtn = document.getElementById("backgroundBackBtn");

	const bg1Btn = document.getElementById("bg1Btn");
	const bg2Btn = document.getElementById("bg2Btn");
	const bg3Btn = document.getElementById("bg3Btn");

	const showBackgroundSettings = () => {
		settingsContainer.style.display = "none";
		backgroundSettingsContainer.style.display = "flex";
	};

	const showSettingsFromBackground = () => {
		backgroundSettingsContainer.style.display = "none";
		settingsContainer.style.display = "flex";
	};

	backgroundBtn.addEventListener("click", showBackgroundSettings);
	backgroundBackBtn.addEventListener("click", showSettingsFromBackground);

	/*배경 선택*/
	const applyBackground = (imagePath) => {
		document.body.style.backgroundImage = `url('${imagePath}')`;
		document.body.style.backgroundSize = "contain";
		document.body.style.backgroundPosition = "center";
		document.body.style.backgroundRepeat = "no-repeat";
	};

	bg1Btn.addEventListener("click", () => {
		applyBackground("images/space-background1.png");
	});

	bg2Btn.addEventListener("click", () => {
		applyBackground("images/space-background2.png");
	});

	bg3Btn.addEventListener("click", () => {
		applyBackground("images/space-background3.png");
	});

	/*조작 방식 설정*/
	const controlStyleBtn = document.getElementById("controlStyleBtn");
	const controlSettingsContainer = document.querySelector(".control-settings-container");
	const controlBackBtn = document.getElementById("controlBackBtn");

	const controlKeyboardBtn = document.getElementById("controlKeyboardBtn");
	const controlMouseBtn = document.getElementById("controlMouseBtn");
	const controlBothBtn = document.getElementById("controlBothBtn");

	const showControlSettings = () => {
		settingsContainer.style.display = "none";
		controlSettingsContainer.style.display = "flex";
	};

	const showSettingsFromControl = () => {
		controlSettingsContainer.style.display = "none";
		settingsContainer.style.display = "flex";
	};

	controlStyleBtn.addEventListener("click", showControlSettings);
	controlBackBtn.addEventListener("click", showSettingsFromControl);

	/*조작 방식 선택 — window.controlMode를 BlockGameJs.js가 참조*/
	window.controlMode = "both";

	const setControlMode = (mode) => {
		window.controlMode = mode;
		[controlKeyboardBtn, controlMouseBtn, controlBothBtn].forEach(btn =>
			btn.classList.remove("selected")
		);
		if (mode === "keyboard") controlKeyboardBtn.classList.add("selected");
		if (mode === "mouse")    controlMouseBtn.classList.add("selected");
		if (mode === "both")     controlBothBtn.classList.add("selected");
	};

	setControlMode("both");

	controlKeyboardBtn.addEventListener("click", () => setControlMode("keyboard"));
	controlMouseBtn.addEventListener("click",    () => setControlMode("mouse"));
	controlBothBtn.addEventListener("click",     () => setControlMode("both"));
});