<template>
	<div id="info">
		<img
			v-if="status === GameStatus.PAUSED"
			class="help-button"
			src="../assets/help.png"
			@click="helpClick"
		/>
		<img
			v-if="status === GameStatus.RUNNING"
			class="pause-button"
			src="../assets/pause.png"
			@click="switchStatus(GameStatus.PAUSED)"
		/>
		<img
			v-if="status === GameStatus.PAUSED"
			class="restart-button"
			src="../assets/restart.png"
			@click="switchStatus(GameStatus.RUNNING)"
		/>
		<img
			v-if="status === GameStatus.PAUSED"
			class="continue-button"
			src="../assets/continue.png"
			@click="switchStatus(GameStatus.RUNNING)"
		/>
		<Help v-if="helpShow" @close-help="helpShow = false"></Help>
	</div>
</template>

<script lang="js">
import Vue from "vue";
import { GameStatus } from "../engine/status";
import Help from "./Help.vue";

const props = {
	status: Number,
    switchStatus: Function
};

const components ={
    Help
};

const data = () => ({
    GameStatus,
    helpShow: false
});

const methods = {
    helpClick: function() {
        this.helpShow = true;
    }
};

export default Vue.extend({
	name: "Info",
	props,
    data,
    components,
    methods
});
</script>

<style lang="less" scoped>
#info {
	width: 100%;
	height: 100%;
	position: fixed;
	.help-button,
	.pause-button,
	.restart-button,
	.continue-button {
		position: fixed;
		cursor: pointer;
	}

	.help-button {
		top: 15px;
		left: 15px;
	}

	.pause-button,
	.continue-button {
		bottom: 15px;
		right: 15px;
	}

	.restart-button {
		bottom: 15px;
		left: 15px;
	}
}
</style>
