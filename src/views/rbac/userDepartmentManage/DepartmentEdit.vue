<template>
<el-container>
  <el-main style="padding:10px;">
    <pm_form_render :model="formModel" :rules="rules" ref="mainForm">
        <pm_form_item row="1" labletext="上级部门" name="parent" :span="12" xtype="tree_select" lableWidth="80px" :dataTree="deptTree" :canClickParent='true'></pm_form_item>
        <pm_form_item row="2" labletext="部门名称" name="name" :span="12" xtype="text" lableWidth="80px" ></pm_form_item>
        <pm_form_item row="3" labletext="部门简称" name="shortName" :span="12" xtype="text" lableWidth="80px" ></pm_form_item>
        <pm_form_item row="4" labletext="备注" name="remark" :span="23" xtype="textarea" lableWidth="80px"></pm_form_item> 
    </pm_form_render>
  </el-main>
  <el-footer style="padding:0px;">
  <!-- toolbar工具条部分 -->
    <pm_tool_bar :noBackground="true">
      <pm_toolButton
        btnName="确认"
        btnIcon="el-icon-success"
        :btnClickFunc="confirm_func"
      ></pm_toolButton>
      <pm_toolButton
        btnName="取消"
        btnIcon="el-icon-close"
        :btnClickFunc="closeWin"
      ></pm_toolButton>
    </pm_tool_bar>
  </el-footer>
</el-container>
</template>
<script>
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import layerUtil from "@/common/utils/LayerUtil";
import httpUtil from "@/common/utils/HttpUtil";
export default {
  components: {
    pm_form_item,
    pm_toolButton,
    pm_tool_bar
  },
  data: function() {
    return {
      rules: {
          name: [
              { required: true, message: '请输入部门名称', trigger: 'blur' },
          ]
      },
      deptTree:[],
      formModel:null
    };
  },
  methods: {
    confirm_func: function() {
      if(!this.formModel.parent){
        this.formModel.parent = "0";
      }
      if(this.formModel.treeNode){
        this.formModel.parentPath = this.formModel.treeNode.parentPath; 
      }
      let _this= this;
      this.$refs["mainForm"].validate(this,valid => {
        if(_this.formModel.editFlag=="deptAdd"){
        //新增确认
        httpUtil.post("rbac/department/insertDepartment", _this.formModel, data => {
          _this.$message({
            message: '新增部门成功',
            type: 'success'
          });
          _this.$options.parent.getDepartmentTree();
          _this.closeWin();
        });
      }else if(_this.formModel.editFlag=="deptEdit"){
        if( _this.formModel.parentPath){
          _this.formModel.parentPath = _this.formModel.parentPath+_this.formModel.id+"-";
        }else{
          _this.formModel.parentPath = _this.formModel.id+"-";
        }
        //编辑确认
        httpUtil.post("rbac/department/updateDepartment", _this.formModel, data => {
          _this.$message({
            message: '修改部门成功',
            type: 'success'
          });
         _this.$options.parent.getDepartmentTree();
         _this.closeWin();
        });
      }else{

      }
      })
    },
    closeWin:layerUtil.closeWin,
  },
  created(){
    this.deptTree=JSON.parse(this.$options.propsData.deptTree);
    //获取传入数据
    this.formModel = JSON.parse(this.$options.propsData.entity);
  },
};
</script>