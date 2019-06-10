<template>
	<div id="app">
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	}
}

</script>

<style lang="scss">
body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
	// background: #1F2D3D;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}
::-webkit-input-placeholder { 
  color: #aaa!important;
  font-size:14px;
}

::-moz-placeholder { 
  color: #aaa!important;
  font-size:14px;
}

:-ms-input-placeholder { 
  color: #aaa!important;
  font-size:14px;
}  
#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}
body .el-loading-spinner{
	.circular{
		width: 40px;
		height: 40px;
	}
	.el-loading-text {
	    font-size: 24px;
	}
} 
body .el-input__inner{
	color:#333;
}
body .el-input.is-disabled .el-input__inner {
    background-color: #ebebf0;
    color: #999;
}
.el-row{
	margin-bottom: 3px;
}
.search_partition{
	.el-form-item__content{
		>div{
			vertical-align:middle;
		}
	}
}
.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
.edit_padding{
  padding-top: 5px;
}
</style>