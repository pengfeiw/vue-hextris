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
import {mapGetters} from "vuex";
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
        ...mapGetters(["status"])
	}
});
</script>

<style lang="less">
html,
body {
	margin: 0;
	padding: 0;
	font-size: 16px;
}
* {
	box-sizing: border-box;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100vw;
	height: 100vh;

	.unselectable {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
}
@media screen and (max-width: 400px) {
    html {
        font-size: 10px;
    }
}
</style>
