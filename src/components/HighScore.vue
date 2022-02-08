<template>
	<div id="high-score" class="unselectable">
		<div class="title">HIGH SCORE</div>
		<div class="value">{{ highscore() }}</div>
	</div>
</template>

<script lang="js">
    import Vue from "vue";

    export default Vue.extend({
        name: "HighScore",
        methods: {
            highscore() {
                const highscore = localStorage.getItem("highscore");
                return highscore ? highscore : 0;
            }
        }
    });
</script>

<style lang="less" scoped>
#high-score {
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	top: 15px;
	.title {
		color: rgba(59, 154, 156, 0.7);
	}

	.value {
		font-size: 1.8rem;
	}
}
</style>
