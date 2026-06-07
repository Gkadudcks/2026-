# 2026-1 웹프로그래밍 팀프로젝트 10조

## 게임 개요

Project Hail Mary를 모티브로 제작한 우주 테마 벽돌깨기 게임이다.

플레이어는 패들을 조작하여 공을 반사시키고 모든 벽돌을 제거해야 한다.

일반 벽돌깨기와 달리 산소(O₂) 시스템, 강화 벽돌, 아이템 시스템, 특수 구조물 맵을 추가하여 전략성과 난이도를 높였다.

---

# 난이도 시스템

난이도는 Easy / Normal / Hard / Impossible 총 4단계로 구성된다.

각 난이도는 다음 요소가 달라진다.

* 공 속도
* 산소 감소 속도
* 벽돌 행 수
* 벽돌 열 수
* 강화 벽돌 등장 확률

### 강화 벽돌 등장 확률

| 난이도        | HP 2 벽돌 확률 |
| ---------- | ---------- |
| Easy       | 0%         |
| Normal     | 20%        |
| Hard       | 30%        |
| Impossible | 35%        |

---

# 벽돌 생성 방식

## 일반 벽돌

* 난이도별 행(row), 열(col) 수에 맞게 자동 생성된다.
* 각 벽돌은 HP 값을 가진다.
* HP가 0이 되면 파괴된다.

## 강화 벽돌

* HP가 2인 벽돌
* 첫 번째 충돌 시 HP만 감소
* 두 번째 충돌 시 파괴
* 손상된 이미지를 사용하여 상태를 표현

---

# 산소(O₂) 시스템

게임 진행 중 산소가 지속적으로 감소한다.

```javascript
o2 -= currentO2Drain * deltaTime;
```

산소가 0이 되면 즉시 게임이 종료된다.

```javascript
gameOver("OXYGEN DEPLETED");
```

## 산소 부족 경고

산소가 20% 미만일 경우

* LOW OXYGEN 경고 표시
* 붉은 화면 효과
* 화면 흔들림 효과

적용

---

# 아이템 시스템

벽돌 파괴 시 일정 확률로 아이템이 생성된다.

## O₂ Tank

효과

* 산소 +20 회복

## Wide Bar

효과

* 패들 길이 증가

## Small Ball

효과

* 공 크기 감소

## X3 Ball

효과

* 현재 공을 기준으로 추가 공 생성
* 최대 3개의 공 동시 플레이

---

# 맵/구조물 생성 방식

## 맵 선택

* Easy는 기본 벽돌 배열 사용
* Normal / Hard / Impossible은 특수 맵 3개 중 랜덤 선택

---

## brickGroups

일반 벽돌이 생성될 영역

속성

* row
* col
* rows
* cols

---

## obstacles

깨지지 않는 구조물 정의

속성

* row
* col
* rows
* cols
* type
* direction
* offsetRows
* offsetCols

---

# 구조물 종류

## lineWall

가로 또는 세로 벽

* 일반 사각형 충돌 사용

## diamondWall

마름모 구조물

* 다각형 충돌 사용
* 대각선 반사

## triangleWall

삼각형 구조물

* 다각형 충돌 사용
* 방향별 반사

## solidBrick

금속 벽

* 파괴 불가
* 일반 벽돌 위치를 대체

---

# 충돌 처리 방식

## 일반 충돌

AABB(Axis-Aligned Bounding Box) 충돌 판정 사용

대상

* 벽돌
* lineWall
* solidBrick

---

## 다각형 충돌

대상

* triangleWall
* diamondWall

처리 과정

1. 공 중심점 계산
2. 다각형 각 변과의 최단 거리 계산
3. 충돌 여부 판정
4. 법선 벡터 계산
5. 반사 공식 적용

반사 공식

```javascript
v' = v - 2(v·n)n
```

---

# 게임 루프

requestAnimationFrame 기반으로 동작한다.

매 프레임마다

1. 산소 업데이트
2. 패들 이동
3. 공 이동
4. 벽돌 충돌 검사
5. 구조물 충돌 검사
6. 아이템 처리
7. UI 갱신
8. 렌더링

순서로 실행된다.

---

# 환경설정 시스템

SettingsJs.js에서 관리

## 사운드 설정

* BGM ON/OFF
* BGM 선택
* BGM 볼륨 조절
* 효과음 볼륨 조절

## 배경 설정

* 우주 배경 3종 선택

## 조작 설정

* Keyboard
* Mouse
* Both

선택 가능

---

# 파일 역할

## BlockGameJs.js

게임 실행, 충돌 처리, 렌더링, 아이템, 산소, 난이도, UI 담당

## BlockGameMaps.js

난이도별 특수 맵 및 구조물 데이터 담당

## SettingsJs.js

환경설정 및 사용자 설정 담당

## StoryModeJs.js

스토리 모드 진행, 컷신, 스테이지 관리 담당
