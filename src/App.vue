<template>
	<div id="app">
		<span>{{ statusText }}</span>
		<el-button
			v-if="status === GameStatus.UNSTART"
			@click="switchStatus(GameStatus.RUNNING)"
		>
			start
		</el-button>
		<Info />
	</div>
</template>

<script lang="js">
import Vue from "vue";
import Info from "./components/Info.vue";
import { GameStatus } from "./engine/status";
import {mapState, mapMutations} from "vuex";

export default Vue.extend({
	name: "App",
	components: {
		Info,
	},
	data: () => ({
        GameStatus
	}),
	computed: {
		statusText: function () {
			switch (this.$store.state.status) {
				case GameStatus.UNSTART:
					return "UNSTART";
				case GameStatus.RUNNING:
					return "RUNNING";
				case GameStatus.PAUSED:
					return "PAUSED";
				case GameStatus.OVER:
					return "OVER";
				default:
					throw new Error("unknow status type.");
			}
		},
        ...mapState(["status"])
	},
    methods: {
        ...mapMutations(["switchStatus"])
    }
});
</script>

<style lang="less">
html,
body {
	margin: 0;
	padding: 0;
}
* {
	box-sizing: border-box;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	width: 100vw;
	height: 100vh;
}
</style>
