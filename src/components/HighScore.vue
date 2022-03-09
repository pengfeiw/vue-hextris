<template>
	<div id="high-score" class="unselectable">
		<div class="title">HIGH SCORE</div>
		<div class="value">{{ game.highScore }}</div>
	</div>
</template>

<script lang="js">
import Vue from "vue";
import {mapState} from "vuex";

export default Vue.extend({
    name: "HighScore",
    computed: {
        ...mapState(["game"])
    }
});
</script>

<style lang="less" scoped>
#high-score {
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	top: 15px;
    text-align: center;
	.title {
		color: rgba(59, 154, 156, 0.7);
	}

	.value {
		font-size: 1.8rem;
	}
}
</style>
