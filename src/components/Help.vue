<template>
	<div id="help">
        <h2>HOW TO PLAY</h2>
		<div class="main">
			<p>
				The goal of Hextris is to stop blocks from leaving the inside of
				the outer gray hexagon.
			</p>
			<p>
				Press the <b>right</b> and <b>left</b> arrow keys to rotate the Hexagon. Press
				the <b>down</b> arrow to speed up the block falling.
			</p>
			<p>
				Clear blocks and get points by making 3 or more blocks of the
				same color touch.
			</p>
			<p>
				Time left before your combo streak disappears is indicated by
				the colored lines on outer hexagon.
			</p>
		</div>
        <div class="footer">
            <el-button class="close-button" size="medium" @click="$emit('close-help')">close</el-button
            >
        </div>
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
	background-color: rgba(36, 35, 35, 0.5);
    color: white;
	font-size: 1.5rem;
    h2 {
        text-align: center;
    }
	.main {
		max-width: 900px;
		margin: 0 auto;
	}
    .footer {
        text-align: center;
    }
}
</style>
