import Game from "./game";

export type BlcokType = 1 | 2 | 3 | 4;
export interface Data {
    data: BlcokType;
    visible: boolean;
    willDelete?: boolean;
}
export type OneGroupData = Data[];

export const getColorByData = (type: BlcokType) => {
    switch (type) {
        case 1:
            return "#2E94B9";
        case 2:
            return "#08D9D6";
        case 3:
            return "#F0B775";
        case 4:
            return "#D25565";
        default:
            throw new Error("unkonw block dataIndex");
    }
}
class GameData {
    public groupSize = 8;
    private _data: OneGroupData[] = [[], [], [], [], [], []];
    public get data() {
        return this._data;
    }
    public isOver() {
        return !this._data.every((group) => (group.filter((item) => item.willDelete === undefined
        || item.willDelete === false).length <= this.groupSize));
    }

    /**
     * 递归回溯检查是否可消除
     */
    public eliminateUpdateScore(game: Game) {
        let resData: boolean[][] = []; // false 表示不用消除，true 表示需要消除
        let checkData: boolean[][] = [];
        let eliminateCount = 0;

        for (let i = 0; i < this.data.length; i++) {
            const group = this.data[i];
            resData.push([] as boolean[]);
            checkData.push([] as boolean[]);
            for (let j = 0; j < group.length; j++) {
                resData[i].push(false);
                checkData[i].push(false);
            }
        }

        const loop = (i: number, j: number, dataType: BlcokType) => {
            if (!(i < this.data.length && i >= 0 && j < this.data[i].length && j >= 0)) {
                return;
            }

            if (this.data[i][j].willDelete || this.data[i][j].data !== dataType || resData[i][j] === true) {
                // checkData[i][j] = true;
                return;
            }

            resData[i][j] = true;
            checkData[i][j] = true;

            if (j < this.data[i].length) {
                loop(i, j + 1, dataType);
            }
            if (j > 0) {
                loop(i, j - 1, dataType);
            }
            loop((i + 1) % 6, j, dataType);
            loop((i - 1 + 6) % 6, j, dataType);
        };

        for (let i = 0; i < this.data.length; i++) {
            for (let j = 0; j < this.data[i].length; j++) {
                if (checkData[i][j] === false) {
                    const preResData = JSON.parse(JSON.stringify(resData)) as boolean[][];
                    const preCheckData = JSON.parse(JSON.stringify(checkData)) as boolean[][];
                    loop(i, j, this.data[i][j].data);

                    let preEliminatecount = 0;
                    for (let ii = 0; ii < preResData.length; ii++) {
                        preEliminatecount += preResData[ii].filter((value) => value).length;
                    }

                    let curEliminatecount = 0;
                    for (let ii = 0; ii < resData.length; ii++) {
                        curEliminatecount += resData[ii].filter((value) => value).length;
                    }

                    if (curEliminatecount - preEliminatecount < 3) {
                        resData = preResData;
                        checkData = preCheckData;
                    }
                }
            }
        }

        for (let i = 0; i < resData.length; i++) {
            for (let j = resData[i].length - 1; j >= 0; j--) {
                if (resData[i][j]) {
                    // this.data[i].splice(j, 1);
                    this.data[i][j].willDelete = true;
                    eliminateCount++;
                }
            }
        }

        const interval = setInterval(() => {
            for (let i = 0; i < resData.length; i++) {
                for (let j = resData[i].length - 1; j >= 0; j--) {
                    if (resData[i][j]) {
                        this.data[i][j].visible = !this.data[i][j].visible;
                    }
                }
            }
        }, 200);
        
        setTimeout(() => {
            window.clearInterval(interval);

            for (let i = 0; i < resData.length; i++) {
                for (let j = resData[i].length - 1; j >= 0; j--) {
                    if (resData[i][j]) {
                        this.data[i].splice(j, 1);
                    }
                }
            }

            if (eliminateCount > 0) {
                this.eliminateUpdateScore(game);
            }
        }, 600);

        if (eliminateCount > 0) {
            game.score += eliminateCount * 10;

            return true;
        }

        return false;
    }
}

export default GameData;
