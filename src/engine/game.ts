import GameData, {getColorByData, BlcokType} from "./gameData";
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
    type: BlcokType;
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

/**
 * 获取中心点在 (0, 0) 点的六边形的六个顶点
 * @param sideLen 六边形边长
 */
const getHextrisPoints = (sideLen: number) => {
    const p1 = {x: 0.5 * sideLen, y: -0.5 * sideLen / Math.tan(degreeToRadians(30))};
    const p2 = {x: sideLen, y: 0};
    const p3 = {x: p1.x, y: 0.5 * sideLen / Math.tan(degreeToRadians(30))};
    const p4 = {x: -0.5 * sideLen, y: p3.y};
    const p5 = {x: -sideLen, y: 0};
    const p6 = {x: p4.x, y: p1.y};

    return [p1, p2, p3, p4, p5, p6];
};

class Game {
    public status = GameStatus.UNSTART;
    public data = new GameData();
    public outerSideL = 300;
    public innerSideL = 80;
    public innerRotation = 0;
    public highScore = 0;
    public score = 0;
    private _speedTimer: IntervalTimer;
    private _generateBlockDelay = 3000;
    private _generateBlockElapse = 0;
    private _lastTickTime = 0;
    private _outlineColor = getColorByData(1);
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
        this._speedTimer = new IntervalTimer(() => {
            this.speed += 0.1;
        }, 10000, false);

        const highscoreStr = localStorage.getItem("highscore");
        if (highscoreStr) {
            this.highScore = parseInt(highscoreStr);
        }
    }
    public pause() {
        this.status = GameStatus.PAUSED;
        this._speedTimer.pause();
    }
    public resume() {
        this.status = GameStatus.RUNNING;
        this._speedTimer.resume();
    }
    public start() {
        this.status = GameStatus.RUNNING;
        this._speedTimer.start();

        this._lastTickTime = Date.now();
        this.generateRandomBlock();
    }
    public tick(ctx: CanvasRenderingContext2D, delta: number) {
        const status = this.status;

        // generate random block
        const now = Date.now();
        if (this.status === GameStatus.RUNNING) {
            this._generateBlockElapse += now - this._lastTickTime;
            if (this._generateBlockElapse >= this._generateBlockDelay) {
                this.generateRandomBlock();
                this._generateBlockElapse = 0;
                this._outlineColor = getColorByData(MathUtil.randomInteger(1, 5) as BlcokType);
            }
        }
        this._lastTickTime = now;

        // check game over
        this.checkOver();

        // move active blocks
        if (status === GameStatus.RUNNING) {
            for (let i = 0; i < this.activeBlocks.length; i++) {
                this.activeBlocks[i].blockInnerSideL2OutersideL -= delta * this.speed * 0.0003;
            }
        }

        this.updateData();

        this.draw(ctx);
    }
    private draw(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const width = ctx.canvas.clientWidth;
        const height = ctx.canvas.clientHeight;
        const center = {
            x: width * 0.5,
            y: height * 0.5
        };
        this.drawOutline(ctx, center);
        this.drawContainer(ctx, center);
        this.drawSettledBlock(ctx, center);
        this.drawActiveBlock(ctx, center);
        this.drawUnrunningInfo(ctx, center);
    }
    private drawContainer(ctx: CanvasRenderingContext2D, center: Point) {
        const [o1, o2, o3, o4, o5, o6] = getHextrisPoints(this.outerSideL);
        const [i1, i2, i3, i4, i5, i6] = getHextrisPoints(this.innerSideL);

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
    private drawOutline(ctx: CanvasRenderingContext2D, center: Point) {
        let lenPercent = 1 - this._generateBlockElapse / this._generateBlockDelay;
        const points = getHextrisPoints(this.outerSideL);
        ctx.translate(center.x, center.y);
        ctx.beginPath();
        let pIndex = 1;
        ctx.moveTo(points[0].x, points[0].y);

        while (pIndex <= 5 && lenPercent > 1 / 6) {
            ctx.lineTo(points[pIndex].x, points[pIndex].y);
            pIndex++;
            lenPercent -= 1 / 6;
        }
        const p1 = points[pIndex - 1];
        const p2 = points[pIndex % 6];
        const vec = MathUtil.normalizeVector({
            x: p2.x - p1.x,
            y: p2.y - p1.y
        });
        const last = MathUtil.addVec(p1, MathUtil.multiplyVectorByScalar(vec, lenPercent * this.outerSideL * 6))

        if (MathUtil.getPointDistance(last, points[0]) < 0.01) {
            ctx.closePath();
        } else {
            ctx.lineTo(last.x, last.y);
        }

        ctx.lineWidth = 10;
        ctx.strokeStyle = this._outlineColor;
        ctx.stroke();
        ctx.resetTransform();
    }
    private drawSettledBlock(ctx: CanvasRenderingContext2D, center: Point) {
        for (let i = 0; i < this.data.data.length; i++) {
            const group = this.data.data[i];

            for (let j = 0; j < group.length; j++) {
                if (group[j].visible) {
                    const blockData = group[j].data;
                    const or = this.innerSideL + (j + 1) * this.blockSideL;
                    const ir = this.innerSideL + this.blockSideL * j;
                    const o1 = {x: -0.5 * or, y: -0.5 * or / Math.tan(degreeToRadians(30))};
                    const o2 = {x: 0.5 * or, y: o1.y};
                    const i1 = {x: -0.5 * ir, y: -0.5 * ir / Math.tan(degreeToRadians(30))};
                    const i2 = {x: 0.5 * ir, y: i1.y};

                    ctx.translate(center.x, center.y);
                    ctx.rotate(degreeToRadians(60 * i + this.innerRotation));
                    ctx.beginPath();
                    ctx.fillStyle = getColorByData(blockData);
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

    private drawUnrunningInfo(ctx: CanvasRenderingContext2D, center: Point) {
        if (this.status === GameStatus.UNSTART) {
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
        const counts = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 6];
        const count = counts[MathUtil.randomInteger(0, counts.length)];
        const indexes = [0, 1, 2, 3, 4, 5];
        for (let i = 0; i < count; i++) {
            const [index] = indexes.splice(~~(Math.random() * indexes.length), 1);
            const type = MathUtil.randomInteger(1, 5) as BlcokType;
            const blockInnerSideL2OutersideL = 1.3;
            this.activeBlocks.push({
                index,
                type,
                blockInnerSideL2OutersideL
            });
        }
    }

    private updateData() {
        if (this.status === GameStatus.RUNNING) {
            const eliminateCount = this.data.eliminate();

            this.score += eliminateCount * 10;
            if (this.score > this.highScore) {
                this.highScore = this.score;
            }
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
                    groupData.push({
                        data: activeBlock.type,
                        visible: true
                    });

                    this.activeBlocks.splice(i, 1);
                }
            }
        }
    }

    private checkOver() {
        if (this.data.isOver()) {
            this.status = GameStatus.OVER;
        }
    }
    public updateScoreToLocalstorage() {
        localStorage.setItem("highscore", this.highScore.toString());
    }
}

export default Game;
