<template>
	<div class='bgCont'>
		<div class='bg'></div>
		<div class='copyRight'>COPYRIGHT © 食享会 www.shixh.com </div>
	</div>
</template>

<script>
	export default {
	}

</script>

<style scoped>
.bgCont{
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	background-color:#fff;
}
.copyRight{
	 /* line-height: 24px; */
	text-align: center;
	color: #ccc;
	padding-bottom: 30px;
	 /* background-color:#e8e8e8; */
}
.bg{
	flex: 1;
	max-width: 1508px;
	margin: 0 auto;
	background:url(/assets/bg1.png) no-repeat;
    /* // top: 120px;
    // left: 230px;
    // right: 0;
    // bottom: 0; */
	background-position:center;
	background-size: 90% auto;
	width: 100%;
	height: 100%;
    /* // background-size: contain;
    // background-size: contain;
    // position: fixed; */
	filter: opacity(0.9);
}
</style>