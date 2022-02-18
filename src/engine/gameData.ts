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
}

export default GameData;
