# JS 파일 함수 정리





**1. BlockGameJs.js — 게임 본체 담당**





초기 설정 부분

캔버스, 버튼, 메뉴 화면, 이미지, 점수 UI, 산소 UI, 공, 패들, 벽돌 배열 같은 기본 요소를 준비한다.



난이도 설정

difficultySettings에서 easy, normal, hard, impossible마다 공 속도, 산소 감소 속도, 벽돌 행/열 수, HP 2 벽돌 확률을 다르게 설정한다.



게임 시작/초기화 함수

resetGame(), startRound(), gameOver()

새 게임을 시작할 때 점수, 산소, 공, 패들, 아이템, 벽돌, 장애물을 초기화하고 게임 루프를 실행한다.



벽돌/맵/장애물 생성 함수

getBrickGridMetrics(), getGridRect(), addBrick(), createBricks(), selectCurrentMap(), createWalls()

난이도와 맵 구조에 맞춰 벽돌 크기와 위치를 계산하고, 일반 벽돌과 깨지지 않는 장애물을 만든다.



그리기 함수

drawBackground(), drawBall(), drawPaddle(), drawBricks(), drawWalls(), drawItems(), drawLowOxygenWarning(), drawCenterMessage()

배경, 공, 패들, 벽돌, 장애물, 아이템, 산소 부족 경고, 게임 종료 메시지를 화면에 그린다.



장애물 모양 함수

drawLineWall(), drawDiamondWall(), drawTriangleWall(), getTrianglePoints(), getDiamondPoints()

선형 벽, 마름모 벽, 삼각형 벽을 각각 다른 모양으로 그리고, 충돌 계산에 필요한 꼭짓점 좌표를 만든다.



이동/조작 함수

movePaddle(), moveBall(), recordPaddleMovement(), getAveragePaddleMovement()

패들과 공을 움직인다. 패들이 움직인 방향도 기록해서 공이 패들에 맞았을 때 반사 방향에 영향을 준다.



충돌 처리 함수

isBallHitRect(), checkBrickCollision(), checkWallCollision()과 여러 보조 함수

공이 벽돌이나 장애물에 닿았는지 확인하고, 닿으면 공을 튕기거나 벽돌 HP를 줄인다. 삼각형/마름모 벽은 다각형 충돌 계산을 따로 사용한다.



아이템 함수

spawnItem(), moveItems()

벽돌이 깨질 때 아이템을 생성하고, 패들이 아이템을 먹으면 산소 회복, 패들 확장, 공 3개 증가, 공 크기 감소 같은 효과를 적용한다.



UI/메뉴 함수

updateUI(), hideResultButtons(), showResultButtons(), showPauseButtons(), handleMenuKeyboard()

점수와 산소 게이지를 갱신하고, 결과 버튼이나 일시정지 버튼을 보여준다. 메뉴에서는 방향키와 Enter로 선택할 수 있게 한다.



일시정지/산소/게임 루프 함수

pauseGame(), resumeGame(), updateOxygen(), gameLoop()

게임을 멈추거나 다시 시작하고, 시간에 따라 산소를 줄인다. gameLoop()는 매 프레임마다 이동, 충돌, 아이템, 산소, 화면 그리기를 반복하는 핵심 함수다.



이벤트 처리 부분

시작 버튼, 종료 버튼, 난이도 버튼, 재시작, 다음 스테이지, 메인 메뉴, 키보드 입력, 마우스 이동 같은 사용자 행동을 처리한다.



**2. BlockGameMaps.js — 특수 맵 데이터 담당**



전체 구조

window.BLOCK\_GAME\_MAPS라는 전역 객체 안에 normal, hard, impossible 난이도별 맵이 들어 있다.



brickGroups

일반 벽돌이 들어갈 영역을 정한다.

예를 들어 row, col, rows, cols 값으로 “몇 번째 줄, 몇 번째 칸부터 몇 칸짜리 벽돌 구역인지”를 표시한다.



obstacles

깨지지 않는 장애물을 배치한다.

장애물 종류는 lineWall, diamondWall, triangleWall 등이 있고, direction 값으로 가로/세로 방향이나 삼각형 방향을 정한다.



난이도별 역할

normal은 비교적 단순한 벽이나 마름모 구조물이 나오고, hard는 중앙 벽이나 삼각형 구조물이 추가된다. impossible은 더 빽빽한 벽돌과 여러 삼각형/마름모 구조물로 공의 진행 방향을 어렵게 만든다.



즉 이 파일은 직접 게임을 실행하는 함수는 거의 없고, BlockGameJs.js가 이 데이터를 읽어서 실제 벽돌과 장애물로 변환한다.



**3. SettingsJs.js — 환경설정 담당**



게임 설정 화면과 사용자 설정 기능을 담당하는 파일.



초기 실행 부분

DOMContentLoaded 안에서 HTML 요소들을 가져오고, 버튼 이벤트를 연결한다. 메인 메뉴 배경값도 window.currentMenuBackground에 저장해서 다른 JS 파일에서 사용할 수 있게 한다.



화면 전환 함수

showMenu(), showSettings()

메인 메뉴와 환경설정 화면을 서로 전환한다.



사운드 설정 함수/이벤트

showAudioSettings(), showSettingsFromAudio()

사운드 설정 화면으로 들어가거나 다시 환경설정 화면으로 돌아간다.

BGM ON/OFF 버튼은 음악을 재생/정지하고, 트랙 선택은 음악 파일을 바꾸며, 볼륨 슬라이더는 BGM과 효과음 크기를 조절한다.



배경 설정 함수/이벤트

showBackgroundSettings(), showSettingsFromBackground(), applyBackground()

배경 설정 화면으로 이동하거나 돌아가고, 선택한 배경 이미지를 body에 적용한다. 배경 1, 2, 3 버튼을 누르면 메뉴 배경이 바뀐다.



조작 방식 설정 함수/이벤트

showControlSettings(), showSettingsFromControl(), setControlMode()

조작 방식을 키보드, 마우스, 둘 다 중에서 선택한다. 선택한 값은 window.controlMode에 저장되고, BlockGameJs.js가 이 값을 참고해서 패들 조작 방식을 결정한다.



**BlockGameJs.js는 게임 실행, BlockGameMaps.js는 맵 데이터, SettingsJs.js는 환경설정 담당**

