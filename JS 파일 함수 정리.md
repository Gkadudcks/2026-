# JS 파일 함수 정리

## 1. BlockGameJs.js — 게임 본체 담당

### 초기 설정 부분

* 캔버스(`backgroundCanvas`, `gameCanvas`, `effectCanvas`) 생성 및 관리
* 메뉴 버튼 및 게임 UI 초기화
* 이미지 리소스 로드
* 점수 및 산소(O₂) 게이지 생성
* 공, 패들, 벽돌, 아이템 배열 초기화
* 난이도 설정값(`difficultySettings`) 정의

---

### 게임 초기화 및 진행 함수

#### resetGame()

* 게임 상태 초기화
* 점수, 산소, 공, 패들, 아이템 리셋
* 맵 선택 후 벽돌 및 장애물 생성

#### startRound()

* 게임 시작
* 게임 루프 실행
* 결과창 숨김

#### gameOver()

* 게임 종료 처리
* 성공/실패 판정
* 결과 버튼 표시

#### gameLoop()

* 게임의 핵심 반복 함수
* 패들 이동
* 공 이동
* 충돌 검사
* 아이템 처리
* 산소 감소
* 화면 렌더링

---

### 맵 및 벽돌 생성 함수

#### getBrickGridMetrics()

* 현재 난이도에 맞는 벽돌 행/열 정보 계산
* 벽돌 크기 자동 조정

#### getGridRect()

* 격자 좌표를 실제 캔버스 좌표로 변환

#### addBrick()

* 벽돌 객체 생성
* 난이도에 따라 HP 1 또는 HP 2 설정

#### addBrickCellsFromGroup()

* `brickGroups` 정보를 실제 벽돌 셀 목록으로 변환

#### removeObstacleCells()

* 장애물이 위치한 셀을 벽돌 생성 후보에서 제거

#### createBricks()

* 현재 맵 구조에 맞는 벽돌 생성

#### selectCurrentMap()

* 난이도에 맞는 특수 맵 랜덤 선택

#### createWalls()

* 맵 데이터의 장애물을 실제 충돌 객체로 변환

---

### UI 및 메뉴 함수

#### updateUI()

* 점수 표시 갱신
* 산소 게이지 갱신

#### hideResultButtons()

* 결과 버튼 숨김

#### showResultButtons()

* 게임 결과 버튼 표시
* Retry / Next Stage / Return To Menu 관리

#### showPauseButtons()

* 일시정지 메뉴 표시

#### focusMenuButton()

* 메뉴 기본 포커스 설정

#### getActiveMenuScreen()

* 현재 표시 중인 메뉴 화면 반환

#### focusMenuScreenControl()

* 현재 메뉴 선택 항목 포커스

#### handleMenuKeyboard()

* 방향키 메뉴 이동
* Enter 선택 처리

---

### 렌더링 함수

#### drawBackground()

* 게임 배경 이미지 출력

#### drawBall()

* 공 렌더링

#### drawPaddle()

* 패들 렌더링

#### drawBricks()

* 벽돌 이미지 렌더링

#### drawWalls()

* 장애물 렌더링

#### drawItems()

* 아이템 렌더링

#### drawLowOxygenWarning()

* 산소 부족 경고 표시

#### drawCenterMessage()

* 게임 오버 또는 스테이지 클리어 메시지 표시

---

### 장애물 렌더링 함수

#### drawLineWall()

* 직선 벽 렌더링

#### drawDiamondWall()

* 마름모 벽 렌더링

#### drawTriangleWall()

* 삼각형 벽 렌더링

#### getTrianglePoints()

* 삼각형 꼭짓점 좌표 계산

#### getDiamondPoints()

* 마름모 꼭짓점 좌표 계산

---

### 이동 및 조작 함수

#### movePaddle()

* 키보드 또는 마우스 입력에 따라 패들 이동

#### recordPaddleMovement()

* 최근 패들 이동량 저장

#### getAveragePaddleMovement()

* 평균 이동량 계산
* 공 반사 방향 보정

#### moveBall()

* 공 이동
* 벽, 천장, 패들 충돌 처리
* 공이 모두 사라지면 게임 오버

---

### 충돌 처리 함수

#### isBallHitRect()

* 공과 사각형 충돌 검사

#### getWallPolygon()

* 장애물을 다각형 형태로 변환

#### getPolygonCenter()

* 다각형 중심 계산

#### getClosestPointOnSegment()

* 선분과 점 사이의 최소 거리 계산

#### isPointInPolygon()

* 점이 다각형 내부에 있는지 판정

#### getCirclePolygonCollision()

* 원과 다각형 충돌 계산

#### bounceBallFromRect()

* 사각형 반사 처리

#### bounceBallFromPolygon()

* 다각형 반사 처리

#### getWallCollision()

* 장애물 충돌 종류 판정

#### checkWallCollision()

* 공과 장애물 충돌 처리

#### checkBrickCollision()

* 공과 벽돌 충돌 처리
* HP 감소
* 점수 증가
* 아이템 생성

---

### 아이템 함수

#### spawnItem()

* 벽돌 파괴 시 아이템 생성
* 난이도별 등장 확률 적용

아이템 종류:

* `o2` : 산소 회복
* `widebar` : 패들 확장
* `x3` : 공 3개 생성
* `smallball` : 공 크기 감소

#### moveItems()

* 아이템 낙하 처리
* 패들 획득 처리
* 아이템 효과 적용

---

### 산소 및 게임 상태 함수

#### updateOxygen()

* 시간 경과에 따른 산소 감소

#### pauseGame()

* 게임 일시정지

#### resumeGame()

* 게임 재개

---

### 이벤트 처리

#### 버튼 이벤트

* 게임 시작
* 게임 종료
* 난이도 선택
* Retry
* Next Stage
* Return To Menu

#### 키보드 이벤트

* 패들 이동
* 메뉴 선택
* 일시정지

#### 마우스 이벤트

* 패들 이동

---

## 2. BlockGameMaps.js — 특수 맵 데이터 담당

### 역할

게임 난이도별 특수 맵 구조를 정의하는 데이터 파일

---

### window.BLOCK_GAME_MAPS

난이도별 맵 목록 저장

* normal
* hard
* impossible

---

### brickGroups

일반 벽돌 생성 영역

속성:

* row
* col
* rows
* cols

---

### obstacles

깨지지 않는 장애물 정의

속성:

* type
* direction
* row
* col
* rows
* cols
* offsetRows
* offsetCols

---

### 장애물 종류

#### lineWall

* 가로 또는 세로 직선 벽

#### diamondWall

* 마름모 벽
* 대각선 반사

#### triangleWall

* 삼각형 벽
* 방향별 반사

---

### 맵 예시

#### normal

* split-center-wall
* diamond-island
* shallow-horizontal-gates

#### hard

* three-mid-bars
* narrow-center-entry
* triangle-guides

#### impossible

* dense-triangle-guides
* tight-corridor
* diamond-cross

---

## 3. SettingsJs.js — 환경설정 담당

### 역할

게임 환경 설정 관리

---

### 화면 전환 함수

#### showMenu()

* 메인 메뉴 표시

#### showSettings()

* 설정 화면 표시

#### showAudioSettings()

* 사운드 설정 화면 표시

#### showSettingsFromAudio()

* 사운드 설정 → 설정 메뉴 복귀

#### showBackgroundSettings()

* 배경 설정 화면 표시

#### showSettingsFromBackground()

* 배경 설정 → 설정 메뉴 복귀

#### showControlSettings()

* 조작 설정 화면 표시

#### showSettingsFromControl()

* 조작 설정 → 설정 메뉴 복귀

---

### 사운드 설정

#### BGM ON/OFF

* 음악 재생
* 음악 정지

#### 트랙 변경

* 선택한 음악 재생

#### 볼륨 조절

* BGM 볼륨 조절
* 효과음 볼륨 조절

---

### 배경 설정

#### applyBackground()

* 메뉴 배경 이미지 적용

배경 종류:

* `space-background1`
* `space-background2`
* `space-background3`

---

### 조작 방식 설정

#### setControlMode(mode)

설정값:

* `keyboard`
* `mouse`
* `both`

선택한 조작 방식을 `window.controlMode`에 저장한다.

`BlockGameJs.js`에서 이를 참조하여 실제 패들 조작 방식을 결정한다.

---

## 파일별 역할 요약

### BlockGameJs.js

게임 실행, 충돌 처리, 렌더링, 아이템, UI, 난이도, 스테이지 진행 담당

### BlockGameMaps.js

특수 맵 구조 및 장애물 데이터 정의 담당

### SettingsJs.js

배경, 사운드, 조작 방식 등 환경설정 담당
