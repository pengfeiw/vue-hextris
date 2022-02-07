<template>
	<div id="app">
        <Info :status="GameStatus.PAUSED" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Info from "./components/Info.vue";
import {GameStatus} from "./engine/status";

export default Vue.extend({
	name: "App",
	components: {
        Info
    },
    data: () => ({
        GameStatus
    })
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
