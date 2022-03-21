<template>
	<div id="gamewin">
		<HighScore />
		<canvas class="canvas" ref="canvas" />
	</div>
</template>

<script lang="js">
import Vue from "vue";
import {mapGetters, mapState} from "vuex";
import HighScore from "./HighScore.vue";
import {gsap} from "gsap";
import {GameStatus} from "../engine/status";

const data = () => ({
    ctx: null,
    speedup: false
});
const components = {
    HighScore
};
const computed = {
    ...mapGetters(["status"]),
    ...mapState(["game"])
};

let lastFrame = 0;

const methods = {
    loop(time) {
        if (lastFrame === -1) {
            lastFrame = time;
        }
        let delta = time - lastFrame;
        if (delta > 0) {
            if (this.speedup) {
                delta *= 10;
            }
            this.game.tick(this.ctx, delta);
        }
        lastFrame = time;
        requestAnimationFrame(this.loop);
    },
    setSize() {
        const canvas = this.$refs.canvas;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        const ctx = canvas.getContext("2d");
        this.ctx = ctx;
        ctx.scale(dpr, dpr);
        const minWH = Math.min(window.innerWidth, window.innerHeight);
        if (minWH < 800) {
            this.game.outerSideL = 0.4 * minWH;
        }
    },
    on() {
        const canvas = this.$refs.canvas;
        let innerRotation = 0;
        const rotateLeft = () => {
            if (this.status === GameStatus.RUNNING) {
                innerRotation -= 60;
                gsap.to(this.game, {
                    duration: 0.1,
                    innerRotation
                });
            }
        };
        const rotateRight = () => {
            if (this.status === GameStatus.RUNNING) {
                innerRotation += 60;
                gsap.to(this.game, {
                    duration: 0.1,
                    innerRotation
                });
            }
        };
        const toggleRun = () => {
            if (this.status === GameStatus.RUNNING) {
                this.game.pause();
            } else if (this.status === GameStatus.UNSTART){
                this.game.start();
            } else if (this.status === GameStatus.PAUSED) {
                this.game.resume();
            }
        };
        window.addEventListener("resize", this.setSize);
        canvas.addEventListener("click", (event) => {
            const dpr = window.devicePixelRatio || 1;
            const x = event.offsetX * dpr;
            if (this.status === GameStatus.RUNNING) {
                if (x > canvas.width * 0.5) {
                    rotateRight();
                } else {
                    rotateLeft();
                }
            }
        });
        window.addEventListener("keydown", (event) => {
            switch (event.code) {
                case "ArrowLeft":
                    rotateLeft();
                    break;
                case "ArrowRight":
                    rotateRight();
                    break;
                case "ArrowDown":
                    this.speedup = true;
                    break;
                case "Space":
                    toggleRun();
                    break;
                default:
                    break;
            }
        });

        window.addEventListener("keyup", () => {
            this.speedup = false;
        });

        window.addEventListener("beforeunload", () => {
            this.game.updateScoreToLocalstorage();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                if (this.game.status !== GameStatus.UNSTART) {
                    this.game.pause();
                }
            }
        });
    }
};

const mounted = function(){
    this.setSize();
    this.on();
    requestAnimationFrame(this.loop);
};

export default Vue.extend({
    name: "GameWin",
    data,
    components,
    computed,
    mounted,
    methods
});
</script>

<style lang="less" scoped>
#gamewin {
	width: 100%;
	height: 100%;
	.canvas {
		width: 100%;
		height: 100%;
	}
}
</style>
