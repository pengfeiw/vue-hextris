import GameData, {getColorByData, Data} from "./gameData";
import {degreeToRadians} from "./math";
import {GameStatus} from "./status";
import {IntervalTimer} from "./timer";
import * as MathUtil from "./math";

type Point = {
    x: number;
    y: number;
}

interface ActiveBlock {
    /** the type(color) of block. */
    type: Data;
    /** 
     * the block direction, 
     * there are six direction of block,
     * they are top(0)、right top(1)、right bottom(2)、bottom(3)、left bottom(4)、left top(5)
     * */
    index: number;
    /**
     * multiply this value with Game.outerSideL get the innerSideL of block, 
     */
    blockInnerSideL2OutersideL: number;
}

const outerContainerColor = "rgba(234,234,234,1)";
const innerContainerColor = "rgba(80,80,80,1)";
const startButtonColor = "rgba(255, 255, 255, 1)";
const textColor = "rgba(32,73,105,1)";

class Game {
    public data = new GameData();
    public outerSideL = 300;
    public innerSideL = 80;
    public innerRotation = 0;
    public score = 0;
    private _timer: IntervalTimer;
    private _generateBlockDelay = 3000;
    private _status: GameStatus = GameStatus.UNSTART;
    public speed = 1;
    public activeBlocks: ActiveBlock[] = [
        // {index: 0, type: 1, blockInnerSideL2OutersideL: 1.3},
        // {index: 1, type: 2, blockInnerSideL2OutersideL: 1.2},
        // {index: 2, type: 3, blockInnerSideL2OutersideL: 1.1},
        // {index: 3, type: 4, blockInnerSideL2OutersideL: 1.0},
        // {index: 4, type: 1, blockInnerSideL2OutersideL: 0.9},
        // {index: 5, type: 2, blockInnerSideL2OutersideL: 0.7},
    ];
    public get blockSideL() {
        return (this.outerSideL - this.innerSideL) / this.data.groupSize;
    }
    public constructor() {
        this._timer = new IntervalTimer(this.generateRandomBlock.bind(this), this._generateBlockDelay, false);
    }
    public pause() {
        this._timer.pause();
    }
    public resume() {
        this._timer.resume();
    }
    public tick(ctx: CanvasRenderingContext2D, status: GameStatus, delta: number) {
        this.setStatus(status);

        if (status === GameStatus.RUNNING) {
            for (let i = 0; i < this.activeBlocks.length; i++) {
                this.activeBlocks[i].blockInnerSideL2OutersideL -= delta * 0.0003;
            }
        }

        this.updateData();

        this.draw(ctx, status);
    }
    private draw(ctx: CanvasRenderingContext2D, status: GameStatus) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const width = ctx.canvas.clientWidth;
        const height = ctx.canvas.clientHeight;
        const center = {
            x: width * 0.5,
            y: height * 0.5
        };
        this.drawContainer(ctx, center);
        this.drawSettledBlock(ctx, center);
        this.drawActiveBlock(ctx, center);
        this.drawUnstartInfo(ctx, center, status);
    }
    private drawContainer(ctx: CanvasRenderingContext2D, center: Point) {
        const o1 = {x: 0.5 * this.outerSideL, y: -0.5 * this.outerSideL / Math.tan(degreeToRadians(30))};
        const o2 = {x: this.outerSideL, y: 0};
        const o3 = {x: o1.x, y: 0.5 * this.outerSideL / Math.tan(degreeToRadians(30))};
        const o4 = {x: -0.5 * this.outerSideL, y: o3.y};
        const o5 = {x: -this.outerSideL, y: 0};
        const o6 = {x: o4.x, y: o1.y};

        const i1 = {x: 0.5 * this.innerSideL, y: -0.5 * this.innerSideL / Math.tan(degreeToRadians(30))};
        const i2 = {x: this.innerSideL, y: 0};
        const i3 = {x: i1.x, y: 0.5 * this.innerSideL / Math.tan(degreeToRadians(30))};
        const i4 = {x: -0.5 * this.innerSideL, y: i3.y};
        const i5 = {x: -this.innerSideL, y: 0};
        const i6 = {x: i4.x, y: i1.y};

        ctx.translate(center.x, center.y);
        ctx.beginPath();
        ctx.fillStyle = outerContainerColor;
        ctx.moveTo(o1.x, o1.y);
        ctx.lineTo(o2.x, o2.y);
        ctx.lineTo(o3.x, o3.y);
        ctx.lineTo(o4.x, o4.y);
        ctx.lineTo(o5.x, o5.y);
        ctx.lineTo(o6.x, o6.y);
        ctx.closePath();
        ctx.fill();

        ctx.rotate(degreeToRadians(this.innerRotation));
        ctx.beginPath();
        ctx.fillStyle = innerContainerColor;
        ctx.moveTo(i1.x, i1.y);
        ctx.lineTo(i2.x, i2.y);
        ctx.lineTo(i3.x, i3.y);
        ctx.lineTo(i4.x, i4.y);
        ctx.lineTo(i5.x, i5.y);
        ctx.lineTo(i6.x, i6.y);
        ctx.closePath();
        ctx.fill();
        ctx.resetTransform();
    }

    private drawSettledBlock(ctx: CanvasRenderingContext2D, center: Point) {
        for (let i = 0; i < this.data.data.length; i++) {
            const group = this.data.data[i];
            for (let j = 0; j < group.length; j++) {
                const blockIndex = group[j];
                const or = this.innerSideL + (j + 1) * this.blockSideL;
                const ir = this.innerSideL + this.blockSideL * j;
                const o1 = {x: -0.5 * or, y: -0.5 * or / Math.tan(degreeToRadians(30))};
                const o2 = {x: 0.5 * or, y: o1.y};
                const i1 = {x: -0.5 * ir, y: -0.5 * ir / Math.tan(degreeToRadians(30))};
                const i2 = {x: 0.5 * ir, y: i1.y};

                ctx.translate(center.x, center.y);
                ctx.rotate(degreeToRadians(60 * i + this.innerRotation));
                ctx.beginPath();
                ctx.fillStyle = getColorByData(blockIndex);
                ctx.moveTo(o1.x, o1.y);
                ctx.lineTo(o2.x, o2.y);
                ctx.lineTo(i2.x, i2.y);
                ctx.lineTo(i1.x, i1.y);
                ctx.closePath();
                ctx.fill();
                ctx.resetTransform();
            }
        }
    }

    private drawActiveBlock(ctx: CanvasRenderingContext2D, center: Point) {
        for (let i = 0; i < this.activeBlocks.length; i++) {
            const blockInnerSideL = this.activeBlocks[i].blockInnerSideL2OutersideL * this.outerSideL;
            const ir = blockInnerSideL;
            const or = blockInnerSideL + this.blockSideL;
            const o1 = {x: -0.5 * or, y: -0.5 * or / Math.tan(degreeToRadians(30))};
            const o2 = {x: 0.5 * or, y: o1.y};
            const i1 = {x: -0.5 * ir, y: -0.5 * ir / Math.tan(degreeToRadians(30))};
            const i2 = {x: 0.5 * ir, y: i1.y};

            ctx.translate(center.x, center.y);
            ctx.rotate(degreeToRadians(60 * this.activeBlocks[i].index));
            ctx.beginPath();
            ctx.fillStyle = getColorByData(this.activeBlocks[i].type);
            ctx.moveTo(o1.x, o1.y);
            ctx.lineTo(o2.x, o2.y);
            ctx.lineTo(i2.x, i2.y);
            ctx.lineTo(i1.x, i1.y);
            ctx.closePath();
            ctx.fill();
            ctx.resetTransform();
        }
    }

    private drawUnstartInfo(ctx: CanvasRenderingContext2D, center: Point, status: GameStatus) {
        if (status === GameStatus.UNSTART) {
            const startBtnSideL = 0.7 * this.innerSideL;
            const startBtnP1 = {x: center.x - startBtnSideL * Math.sqrt(3) / 4, y: center.y - startBtnSideL * 0.5};
            const startBtnP2 = {x: center.x + startBtnSideL * Math.sqrt(3) / 4, y: center.y};
            const startBtnP3 = {x: startBtnP1.x, y: center.y + startBtnSideL * 0.5};

            ctx.beginPath();
            ctx.fillStyle = startButtonColor;
            ctx.moveTo(startBtnP1.x, startBtnP1.y);
            ctx.lineTo(startBtnP2.x, startBtnP2.y);
            ctx.lineTo(startBtnP3.x, startBtnP3.y);
            ctx.closePath();
            ctx.fill();

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.font = "10rem serif";
            ctx.fillStyle = textColor;
            ctx.fillText("Hextris", center.x, center.y - 1.2 * this.innerSideL);

            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.font = "1.5rem serif";
            ctx.fillStyle = textColor;
            ctx.fillText("Click Triangle or press SPACE to start!", center.x, center.y + 1.2 * this.innerSideL);
        } else {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "2rem serif";
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillText(this.score.toString(), center.x, center.y);
        }
    }

    private generateRandomBlock() {
        const index = MathUtil.randomInteger(0, 6);
        const type = MathUtil.randomInteger(1, 5) as Data;
        const blockInnerSideL2OutersideL = 1.3;
        this.activeBlocks.push({
            index,
            type,
            blockInnerSideL2OutersideL
        });
    }

    private updateData() {
        if (this._status === GameStatus.RUNNING) {
            const eliminateCount = this.data.eliminate();

            this.score += eliminateCount * 10;

            for (let i = this.activeBlocks.length - 1; i >= 0; i--) {
                const activeBlock = this.activeBlocks[i];
                const innerSideL = activeBlock.blockInnerSideL2OutersideL * this.outerSideL;
                let index = (activeBlock.index - Math.ceil(this.innerRotation / 60) % 6) % 6;

                if (index < 0) {
                    index += 6;
                }

                const groupData = this.data.data[index];
                const groupOuterSideL = this.innerSideL + groupData.length * this.blockSideL;

                if (groupOuterSideL >= innerSideL) {
                    groupData.push(activeBlock.type);

                    this.activeBlocks.splice(i, 1);
                }
            }
        }
    }

    private setStatus(status: GameStatus) {
        if (this._status !== status) {
            if (this._status === GameStatus.RUNNING && status === GameStatus.PAUSED) {
                this._timer.pause();
            } else if (this._status === GameStatus.PAUSED && status === GameStatus.RUNNING) {
                this._timer.resume();
            } else if (this._status === GameStatus.UNSTART && status === GameStatus.RUNNING) {
                this.generateRandomBlock();
                this._timer.start();
            }
        }

        this._status = status;
    }
}

export default Game;
