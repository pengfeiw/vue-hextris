<template>
	<div id="info">
		<div class="fog" v-if="status === GameStatus.PAUSED"></div>
		<img
			v-if="status === GameStatus.PAUSED || status === GameStatus.UNSTART || status === GameStatus.OVER"
			class="control-button help-button unselectable"
			src="../assets/help.png"
			@click="helpClick"
		/>
		<img
			v-if="status === GameStatus.RUNNING"
			class="control-button pause-button unselectable"
			src="../assets/pause.png"
			@click="game.pause()"
		/>
		<img
			v-if="status === GameStatus.PAUSED || status === GameStatus.OVER"
			class="control-button restart-button unselectable"
			src="../assets/restart.png"
			@click="restart()"
		/>
		<img
			v-if="status === GameStatus.PAUSED"
			class="control-button continue-button unselectable"
			src="../assets/continue.png"
			@click="game.resume()"
		/>
		<div
			v-if="status === GameStatus.UNSTART"
			class="start-button unselectable"
			@click="game.start()"
		></div>
		<div
			v-if="status === GameStatus.PAUSED"
			class="paused-info unselectable"
		>
			<div class="pause-title">Game Pause</div>
			<div>
				<a
					class="github-link"
					href="https://github.com/pengfeiw/vue-hextris"
					target="_blank"
				>
					Find some issue? click here to help improve the code.
				</a>
			</div>
		</div>
		<div
			v-if="status === GameStatus.OVER"
			class="overed-info unselectable"
		>
			<div class="pause-title">Game Over</div>
			<div>
				<a
					class="github-link"
					href="https://github.com/pengfeiw/vue-hextris"
					target="_blank"
				>
					Find some issue? click here to help improve the code.
				</a>
			</div>
		</div>
		<Help v-if="helpShow" @close-help="helpShow = false"></Help>
	</div>
</template>

<script lang="js">
import Vue from "vue";
import {GameStatus} from "../engine/status";
import Help from "./Help.vue";
import {mapGetters, mapMutations, mapState} from "vuex";

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
    },
    ...mapMutations(["restart"])
};

const computed = {
    ...mapGetters(["status"]),
    ...mapState(["game"])
};

export default Vue.extend({
	name: "Info",
    data,
    components,
    methods,
    computed
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
	.start-button,
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

	.start-button {
		height: 200px;
		width: 200px;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.fog {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(255, 255, 255, 0.5);
	}

	.paused-info,.overed-info {
		position: fixed;
        text-align: center;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		.pause-title {
			font-size: 3rem;
			margin-bottom: 10px;
		}

		.github-link {
			&:hover {
				color: rgba(59, 154, 156, 1);
			}
		}
	}

    @media screen and (max-width: 800px) {
        .control-button {
            height: 60px
        }
    }

    @media screen and (max-width: 400px) {
        .control-button {
            height: 40px;
        }
    }
}
</style>
