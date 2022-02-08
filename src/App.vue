<template>
	<div id="app">
		<GameWin />
		<Info />
	</div>
</template>

<script lang="js">
import Vue from "vue";
import Info from "./components/Info.vue";
import { GameStatus } from "./engine/status";
import {mapState, mapMutations} from "vuex";
import GameWin from "./components/GameWin.vue";

export default Vue.extend({
	name: "App",
	components: {
		Info,
        GameWin
	},
	data: () => ({
        GameStatus
	}),
	computed: {
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
	color: rgba(5, 68, 92, 1);
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	width: 100vw;
	height: 100vh;

	.unselectable {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
}
</style>
