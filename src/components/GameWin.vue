<template>
	<div id="gamewin">
		<HighScore />
		<canvas class="canvas" ref="canvas" />
	</div>
</template>

<script lang="js">
import Vue from "vue";
import { mapState } from "vuex";
import HighScore from "./HighScore.vue";
import Game from "../engine/game";
import EventHandler from "../engine/eventHandler";

const data = () => ({
    ctx: null,
    game: new Game(),
    eventHandler: new EventHandler() 
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
    }
}

const mounted = function(){
    const setSize = () => {
        const canvas = this.$refs.canvas;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        this.ctx = ctx;
    };

    this.eventHandler.resizeHandler = setSize;
    this.eventHandler.init();
    setSize();
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
