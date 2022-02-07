<template>
	<div id="help">
		<h2>HOW TO PLAY</h2>
		<p>
			The goal of Hextris is to stop blocks from leaving the inside of the
			outer gray hexagon.
		</p>
		<p>
			Press the right and left arrow keys to rotate the Hexagon. Press the
			down arrow to speed up the block falling.
		</p>
		<p>
			Clear blocks and get points by making 3 or more blocks of the same
			color touch.
		</p>
		<p>
			Time left before your combo streak disappears is indicated by the
			colored lines on outer hexagon.
		</p>
        <el-button size="medium" @click="$emit('close-help')">close</el-button>
	</div>
</template>

<script lang="js">
import Vue from "vue";

export default Vue.extend({
	name: "Help",
});
</script>

<style lang="less" scoped>
#help {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
	padding-top: 20px;
    background-color: rgba(209, 203, 203, 0.5);
}
</style>
