<template>
    <div>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters" style="float:right">
				<el-form-item>
					<el-button  type="primary"  v-for="btn in buttons" :key="btn.name" :icon="btn.icon"
                     @click="btn.click_func" v-has="btn.permission"> {{btn.name}}</el-button>
				</el-form-item>
			</el-form>
		</el-col>
    </div>
</template>

<script>
export default {
    name: 'metro_page_box_tool_bar',
    props: {
        buttons: {
            type: Array,
            default: []
        },
    }
}
</script>

<style scoped>
/* .el-col {
    height: 4rem;
}
.el-button{
    height: 1rem;
} */
/* .portlet-title {
    background-color: #EEE !important;
}
.portlet-title .left {
    float: left;
}
.portlet-title .actions {
    padding: 2px 0 4px 0;
}
.btn, .portlet-title .actions > .btn { 
    padding: 2px 6px;
    margin-left: 3px;
}
.portlet-title .left .actions > .btn { 
    margin-right: 3px;
}
.btn:active, .portlet-title .actions > .btn:active {
    position:relative;
    top: 1px;
    left: 1px;;
} */
</style>


