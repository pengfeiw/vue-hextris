export type Data = 1 | 2 | 3 | 4;
export type OneGroupData = Data[];

export const getColorByData = (data: Data) => {
    switch (data) {
        case 1:
            return "#FF7260";
        case 2:
            return "#9BD7D5";
        case 3:
            return "#7ebc59";
        case 4:
            return "#AEC5EB";
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
    public constructor() {
        // this._data = [
        //     [1, 2, 3, 4],
        //     [1, 1, 1],
        //     [2, 3, 4],
        //     [],
        //     [3],
        //     []
        // ];
    }
    public isOver() {
        return !this._data.every((group) => group.length <= this.groupSize);
    }

    /**
     * 递归回溯检查是否可消除
     * @returns 
     */
    public eliminate() {
        let resData: boolean[][] = [];
        const checkData: boolean[][] = [];
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

        const loop = (i: number, j: number, dataType: Data) => {
            if (!(i < this.data.length && i >= 0 && j < this.data[i].length && j >= 0)) {
                return;
            }

            if (this.data[i][j] !== dataType || resData[i][j] === true) {
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
                    const temData2 = JSON.parse(JSON.stringify(resData)) as boolean[][];
                    loop(i, j, this.data[i][j]);

                    let preEliminatecount = 0;
                    for (let ii = 0; ii < temData2.length; ii++) {
                        preEliminatecount += temData2[ii].filter((value) => value).length;
                    }

                    let curEliminatecount = 0;
                    for (let ii = 0; ii < resData.length; ii++) {
                        curEliminatecount += resData[ii].filter((value) => value).length;
                    }

                    if (curEliminatecount - preEliminatecount < 3) {
                        resData = temData2;
                    }
                }
            }
        }

        for (let i = 0; i < resData.length; i++) {
            for (let j = resData[i].length - 1; j >= 0; j--) {
                if (resData[i][j]) {
                    this.data[i].splice(j, 1);
                    eliminateCount++;
                }
            }
        }

        return eliminateCount;
    }
}

export default GameData;
