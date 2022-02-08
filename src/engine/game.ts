import GameData, {getColorByData} from "./gameData";
import {degreeToRadians} from "./math";

type Point = {
    x: number;
    y: number;
}

const outerContainerColor = "rgba(234,234,234,1)";
const innerContainerColor = "rgba(80,80,80,1)";

class Game {
    public data = new GameData();
    public outerSideL = 300;
    public innerSideL = 80;
    public get blockSideL() {
        return (this.outerSideL - this.innerSideL) / this.data.groupSize;
    }
    public draw(ctx: CanvasRenderingContext2D) {
        const width = ctx.canvas.clientWidth;
        const height = ctx.canvas.clientHeight;
        const center = {
            x: width * 0.5,
            y: height * 0.5
        };
        this.drawContainer(ctx, center);
        this.drawData(ctx, center);
    }

    private drawContainer(ctx: CanvasRenderingContext2D, center: Point) {
        const o1 = {x: center.x + 0.5 * this.outerSideL, y: center.y - 0.5 * this.outerSideL / Math.tan(degreeToRadians(30))};
        const o2 = {x: center.x + this.outerSideL, y: center.y};
        const o3 = {x: o1.x, y: center.y + 0.5 * this.outerSideL / Math.tan(degreeToRadians(30))};
        const o4 = {x: center.x - 0.5 * this.outerSideL, y: o3.y};
        const o5 = {x: center.x - this.outerSideL, y: center.y};
        const o6 = {x: o4.x, y: o1.y};

        const i1 = {x: center.x + 0.5 * this.innerSideL, y: center.y - 0.5 * this.innerSideL / Math.tan(degreeToRadians(30))};
        const i2 = {x: center.x + this.innerSideL, y: center.y};
        const i3 = {x: i1.x, y: center.y + 0.5 * this.innerSideL / Math.tan(degreeToRadians(30))};
        const i4 = {x: center.x - 0.5 * this.innerSideL, y: i3.y};
        const i5 = {x: center.x - this.innerSideL, y: center.y};
        const i6 = {x: i4.x, y: i1.y};

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
    }

    private drawData(ctx: CanvasRenderingContext2D, center: Point) {
        for (let i = 0; i < this.data.data.length; i++) {
            const group = this.data.data[i];
            for (let j = 0; j < group.length; j++) {
                const blockIndex = group[j];
                const or = this.innerSideL + (this.blockSideL + 1) * j;
                const ir = this.innerSideL + this.blockSideL * j;
                const o1 = {x: center.x - 0.5 * or, y: center.y - 0.5 * or / Math.tan(degreeToRadians(30))};
                const o2 = {x: center.x + 0.5 * or, y: o1.y};
                const i1 = {x: center.x - 0.5 * ir, y: center.y - 0.5 * ir / Math.tan(degreeToRadians(30))};
                const i2 = {x: center.x + 0.5 * ir, y: o1.y};

                ctx.rotate(degreeToRadians(60 * i));
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
}

export default Game;
