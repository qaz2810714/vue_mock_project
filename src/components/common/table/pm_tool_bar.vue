<template>
  <div>
    <el-col :span="24" :class="noBackground?'toolbar toolbar-nobg':'toolbar toolbar-bg'" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" style="float:right">
        <el-form-item>
          <slot></slot>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import pm_toolButton from "@/components/common/button/pm_toolButton";
export default {
  name: "pm_tool_bar",
  components: { pm_toolButton },
  props:{
    filters:Object,
    noBackground:{
      type:Boolean,
      default:false
    }
  }
};
</script>
<style lang="scss">
.toolbar-bg{
  background: #f3f3f3;
}
.toolbar-nobg{
  background: none;
}
.toolbar {
	padding: 4px;
	margin: 3px 0px 0;
	.el-form-item {
		margin-bottom: 4px;
    .el-form-item__content{
      line-height:normal;
    }
    button{
      padding: 5px 10px;
    }
	}
}
</style>


