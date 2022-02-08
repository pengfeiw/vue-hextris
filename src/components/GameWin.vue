<template>
	<div id="gamewin">
		<HighScore />
		<canvas class="canvas" ref="canvas" />
	</div>
</template>

<script lang="js">
import Vue from "vue";
import {mapState} from "vuex";
import HighScore from "./HighScore.vue";
import Game from "../engine/game";
import {gsap} from "gsap";

const data = () => ({
    ctx: null,
    game: new Game(),
});
const components = {
    HighScore
};
const computed = {
    ...mapState(["status"])
};

const methods = {
    loop() {
        this.game.draw(this.ctx);
        requestAnimationFrame(this.loop);
    },
    setSize() {
        const canvas = this.$refs.canvas;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        this.ctx = ctx;
    },
    on() {
        const canvas = this.$refs.canvas;
        const rotateLeft = () => {
            gsap.to(this.game, {
                duration: 0.1,
                innerRotation: this.game.innerRotation - 60
            });
        };
        const rotateRight = () => {
            gsap.to(this.game, {
                duration: 0.1,
                innerRotation: this.game.innerRotation + 60
            });
        };
        window.addEventListener("resize", this.setSize);
        canvas.addEventListener("click", (event) => {
            const x = event.offsetX;
            if (x > canvas.width * 0.5) {
                rotateRight();
            } else {
                rotateLeft();
            }
        });
        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    rotateLeft();
                    break;
                case "ArrowRight":
                    rotateRight();
                    break;
                default:
                    break;
            }
        });
    }
};

const mounted = function(){
    this.setSize();
    this.on();
    this.loop();
};

export default Vue.extend({
    name: "GameWin",
    data,
    components,
    computed,
    mounted,
    methods
})
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
