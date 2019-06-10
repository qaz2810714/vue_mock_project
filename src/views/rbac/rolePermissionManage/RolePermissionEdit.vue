<template>
<el-container>
  <el-main style="padding:10px;">
    <pm_form_render :model="formModel" :rules="rules" ref="mainForm">
          <pm_form_item row="1" labletext="角色" name="name" :span="12" xtype="text" lableWidth="80px" maxlength="20"></pm_form_item>
          <pm_form_item row="1" labletext="状态" name="deleteFlag" :span="8" xtype="select" lableWidth="80px" ref="delete" ></pm_form_item>
          <pm_form_item row="2" labletext="备注原因" name="remark" :span="23" xtype="textarea" lableWidth="80px" maxlength="30"></pm_form_item> 
    </pm_form_render>
    <div :class="'toolbar toolbar-bg'">
      <div class="block" style="height:270px;overflow: auto;">
      <p>权限</p>
      <el-tree :data="permissionTreeData" ref="tree" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="checkIds" :props="defaultProps">
      </el-tree>
      </div>
    </div>
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
              { required: true, message: '请输入角色名称', trigger: 'blur' },
          ]
      },
      permissionTreeData: [],
      checkIds:[],
      formModel:null,
      defaultProps: {
          children: 'subNodes',
          label: 'name',
          id:'id'
      }
    };
  },
  methods: {
    confirm_func: function() {
      var _this= this;
      this.formModel.permissionIds = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
      this.$refs["mainForm"].validate(this,valid => {
        if(_this.formModel.editFlag=="1"){
          //新增确认
          httpUtil.post("rbac/role/insertRole", _this.formModel, data => {
            _this.$message({
              message: '新增角色成功',
              type: 'success'
            });
            _this.$options.parent.queryData();
            _this.closeWin();
          });
        }else if(_this.formModel.editFlag=="2"){
          //编辑确认
          httpUtil.post("rbac/role/updateRole", _this.formModel, data => {
            _this.$message({
              message: '修改角色成功',
              type: 'success'
            });
          _this.$options.parent.queryData();
          _this.closeWin();
          });
        }else{

        }
      })
    },
    getPermissionTree: function() {
      httpUtil.post("rbac/permission/getPermissionTree", {}, data => {
        this.wrapData(data);
        this.permissionTreeData = data;
      },null,false);
    },
    getformModel: function() {
      var entity = JSON.parse(this.$options.propsData.entity);
      if(entity.editFlag == '2'){//编辑
        httpUtil.post("rbac/permission/findPermissionsOfRole", entity, data => {
          data.forEach(item=>{
            if(item.type == "2"){
              this.checkIds.push(item.id);
            }         
          });
        },null,false);
      }
      this.formModel = entity;
    },
    wrapData:function(nodes){
      nodes.forEach(node=>{
        for(var item in node){
          if(item=="node"){
             node.name = node[item].name;
             node.id = node[item].id;
          }else if(item == "subNodes"){
            this.wrapData(node[item]);
          }
      }
      });
    },
    closeWin:layerUtil.closeWin,
  },
  created(){
    this.getPermissionTree();
    this.getformModel();
  },
  mounted(){
    if(this.formModel.editFlag =='1'){
       this.$refs.delete.readOnly  = true;
    }
  },
};
</script>