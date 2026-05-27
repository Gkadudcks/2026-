// 난이도별 특수 맵 정의
// - brickGroups: 일반 브릭을 채울 격자 영역입니다.
// - obstacles: 같은 격자 칸을 차지하지만 깨지지 않는 구조물입니다.
// - row/col: 시작 격자 위치, rows/cols: 차지하는 격자 크기입니다.
// - type: solidBrick(금속 브릭), lineWall(얇은 벽), diamondWall(마름모), triangleWall(삼각형)입니다.
// - direction: lineWall의 가로/세로 방향 또는 triangleWall의 빗면 방향입니다.
window.BLOCK_GAME_MAPS = {
    normal: [
        // 좌우 브릭 묶음 사이를 세로 벽으로 막아 공이 중앙에서 크게 튀도록 만든 맵
        {
            name: "split-center-wall",
            brickGroups: [
                { row: 0, col: 0, rows: 4, cols: 3 },
                { row: 0, col: 5, rows: 4, cols: 3 }
            ],
            obstacles: [
                { row: 0, col: 3, rows: 4, cols: 2, type: "lineWall", direction: "vertical" }
            ]
        },
        // 네 모서리 브릭 묶음 사이에 3x3 마름모 구조물을 두어 대각 반사를 보여주는 맵
        {
            name: "diamond-island",
            brickGroups: [
                { row: 0, col: 0, rows: 2, cols: 3 },
                { row: 0, col: 5, rows: 2, cols: 3 },
                { row: 2, col: 0, rows: 2, cols: 3 },
                { row: 2, col: 5, rows: 2, cols: 3 }
            ],
            obstacles: [
                { row: 1, col: 3, rows: 3, cols: 3, type: "diamondWall" }
            ]
        },
        // 상단 브릭 아래쪽에 같은 역할의 수평 벽 3개를 배치한 맵
        {
            name: "shallow-horizontal-gates",
            brickGroups: [
                { row: 0, col: 0, rows: 2, cols: 8 },
                { row: 3, col: 1, rows: 1, cols: 6 }
            ],
            obstacles: [
                { row: 2, col: 0, rows: 1, cols: 2, type: "lineWall", direction: "horizontal" },
                { row: 2, col: 3, rows: 1, cols: 2, type: "lineWall", direction: "horizontal" },
                { row: 2, col: 6, rows: 1, cols: 2, type: "lineWall", direction: "horizontal" }
            ]
        }
    ],
    hard: [
        // 많은 브릭 아래에 세 개의 수평 벽을 배치해 공의 진입 각도를 제한하는 맵
        {
            name: "three-mid-bars",
            brickGroups: [
                { row: 0, col: 0, rows: 3, cols: 10 },
                { row: 4, col: 1, rows: 1, cols: 8 }
            ],
            obstacles: [
                { row: 3, col: 0, rows: 1, cols: 2, type: "lineWall", direction: "horizontal" },
                { row: 3, col: 4, rows: 1, cols: 2, type: "lineWall", direction: "horizontal" },
                { row: 3, col: 8, rows: 1, cols: 2, type: "lineWall", direction: "horizontal" }
            ]
        },
        // 중앙을 긴 세로 벽으로 막아 좌우 영역을 나누는 좁은 입구형 맵
        {
            name: "narrow-center-entry",
            brickGroups: [
                { row: 0, col: 0, rows: 5, cols: 4 },
                { row: 0, col: 6, rows: 5, cols: 4 }
            ],
            obstacles: [
                { row: 0, col: 4, rows: 5, cols: 2, type: "lineWall", direction: "vertical" }
            ]
        },
        // 브릭 무리 안에 2x2 삼각형 구조물을 넣어 대각선 반사를 유도하는 맵
        {
            name: "triangle-guides",
            brickGroups: [
                { row: 0, col: 0, rows: 5, cols: 10 }
            ],
            obstacles: [
                { row: 0, col: 0, rows: 2, cols: 2, type: "triangleWall", direction: "downRight" },
                { row: 1, col: 7, rows: 2, cols: 2, type: "triangleWall", direction: "downLeft" },
                { row: 3, col: 4, rows: 2, cols: 2, type: "triangleWall", direction: "upRight" }
            ]
        }
    ],
    impossible: [
        // 빽빽한 브릭 안에 여러 2x2 삼각형을 넣어 공의 진행 방향을 강하게 바꾸는 맵
        {
            name: "dense-triangle-guides",
            brickGroups: [
                { row: 0, col: 0, rows: 5, cols: 12 }
            ],
            obstacles: [
                { row: 0, col: 0, rows: 2, cols: 2, type: "triangleWall", direction: "downRight" },
                { row: 1, col: 8, rows: 2, cols: 2, type: "triangleWall", direction: "downLeft" },
                { row: 2, col: 5, rows: 2, cols: 2, type: "triangleWall", direction: "upRight" },
                { row: 3, col: 10, rows: 2, cols: 2, type: "triangleWall", direction: "upLeft" }
            ]
        },
        // 위아래 브릭 영역 사이에 좁은 통로만 남긴 수평 벽 맵
        {
            name: "tight-corridor",
            brickGroups: [
                { row: 0, col: 0, rows: 3, cols: 12 },
                { row: 4, col: 1, rows: 2, cols: 10 }
            ],
            obstacles: [
                { row: 3, col: 0, rows: 1, cols: 5, type: "lineWall", direction: "horizontal" },
                { row: 3, col: 7, rows: 1, cols: 5, type: "lineWall", direction: "horizontal" }
            ]
        },
        // 네 구석 브릭 묶음과 중앙 3x3 마름모를 함께 배치한 대각 반사 중심 맵
        {
            name: "diamond-cross",
            brickGroups: [
                { row: 0, col: 0, rows: 2, cols: 4 },
                { row: 0, col: 8, rows: 2, cols: 4 },
                { row: 4, col: 0, rows: 2, cols: 4 },
                { row: 4, col: 8, rows: 2, cols: 4 }
            ],
            obstacles: [
                { row: 2, col: 5, rows: 3, cols: 3, type: "diamondWall" },
                { row: 3, col: 0, rows: 1, cols: 3, type: "lineWall", direction: "horizontal" },
                { row: 3, col: 9, rows: 1, cols: 3, type: "lineWall", direction: "horizontal" }
            ]
        }
    ]
};
