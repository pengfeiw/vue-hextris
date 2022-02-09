import GameData, {getColorByData} from "./gameData";
import {degreeToRadians} from "./math";
import {GameStatus} from "./status";

type Point = {
    x: number;
    y: number;
}

const outerContainerColor = "rgba(234,234,234,1)";
const innerContainerColor = "rgba(80,80,80,1)";
const startButtonColor = "rgba(255, 255, 255, 1)";
const textColor = "rgba(32,73,105,1)";


class Game {
    public data = new GameData();
    public outerSideL = 300;
    public innerSideL = 80;
    public innerRotation = 60;
    public get blockSideL() {
        return (this.outerSideL - this.innerSideL) / this.data.groupSize;
    }
    public draw(ctx: CanvasRenderingContext2D, status: GameStatus) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const width = ctx.canvas.clientWidth;
        const height = ctx.canvas.clientHeight;
        const center = {
            x: width * 0.5,
            y: height * 0.5
        };
        this.drawContainer(ctx, center);
        this.drawData(ctx, center);
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

    private drawData(ctx: CanvasRenderingContext2D, center: Point) {
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

    private drawUnstartInfo(ctx: CanvasRenderingContext2D, center: Point, status: GameStatus) {
        // set text alignment
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        if (status === GameStatus.UNSTART) {
            // draw start button
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

            // draw title
            ctx.font = "10rem serif";
            ctx.fillStyle = textColor;
            ctx.fillText("Hextris", center.x, center.y - 1.2 * this.innerSideL);
        } else if (status === GameStatus.PAUSED) {
            //
        }
    }
}

export default Game;
