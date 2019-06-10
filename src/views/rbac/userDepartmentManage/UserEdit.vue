<template>
<el-container>
  <el-main style="padding:10px;">
    <div style="height:350px;">
    <pm_form_render :model="formModel" :rules="rules" ref="mainForm" :entity="$metaData.role">
        <pm_form_item row="1" labletext="部门" name="departmentId" :span="16" xtype="tree_select" lableWidth="80px" :dataTree="deptTree" :canClickParent='true'></pm_form_item>
        <pm_form_item row="2" labletext="用户名" name="name" :span="16" xtype="text" lableWidth="80px" placeholder="用户名长度至少2位,由中文、数字、字母组成" maxlength ='20'></pm_form_item>
        <pm_form_item row="3" labletext="登录名" name="loginName" :span="16" xtype="text" lableWidth="80px" placeholder="登录名长度至少2位,由数字、字母组成" maxlength ='20'></pm_form_item>
        <pm_form_item row="4" labletext="登录密码" name="loginPassword"  :span="16"  xtype="password" lableWidth="80px" ref="password" placeholder="登录密码长度至少6位,由数字、字母组成" maxlength ='20'></pm_form_item>
        <pm_form_item row="5" labletext="角色" name="roleIds" :span="16" xtype="select_batchMemo" lableWidth="80px" ></pm_form_item> 
        <pm_form_item row="6" labletext="备注" name="remark" :span="23" xtype="textarea" lableWidth="80px"></pm_form_item> 
        <pm_form_item row="7" labletext="状态" name="deleteFlag" :span="16" xtype="select" lableWidth="80px"  ref="delete" ></pm_form_item> 
    </pm_form_render>
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
         departmentId: [
              { required: true, message: '请选择部门', trigger: 'blur' },
          ],
          name: [
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{2,20}$/, message: '用户名长度至少2位,由中文、数字、字母组成' }
          ],
          loginName: [
              { required: true, message: '请输入登录名', trigger: 'blur' },
              { pattern: /^[0-9A-Za-z]{2,20}$/, message: '登录名长度至少2位,由数字、字母组成' }
          ],
          loginPassword: [
              { required: true, message: '请输入登录密码', trigger: 'blur' },
              { pattern: /^[A-Za-z0-9]{6,20}$/, message: '登录密码长度至少6位,由数字、字母组成' }
          ]
      },
      deptTree:[],
      formModel:null
    };
  },
  methods: {
    confirm_func: function() {
      let _this= this;
      this.$refs["mainForm"].validate(this,valid => {
        if(_this.formModel.editFlag=="userAdd"){
          //新增确认
          httpUtil.post("rbac/user/insertUser", _this.formModel, data => {
            _this.$message({
              message: '新增人员成功',
              type: 'success'
            });
            _this.$options.parent.queryData();
            _this.closeWin();
            
          });
        }else if(_this.formModel.editFlag=="userEdit"){
          //编辑确认
          httpUtil.post("rbac/user/updateUser", _this.formModel, data => {
            _this.$message({
              message: '修改人员成功',
              type: 'success'
            });
          _this.$options.parent.queryData();
          _this.closeWin();
          });
        }else{

        }
      })
    },
    closeWin:layerUtil.closeWin,
  },
  mounted(){
    if(this.formModel.editFlag =='userEdit'){
      this.$refs.password.readOnly  = true;
    }else if(this.formModel.editFlag =='userAdd'){
      this.$refs.delete.readOnly  = true;
    }
  },
  created(){
    this.deptTree=JSON.parse(this.$options.propsData.deptTree);
    //获取传入数据
    this.formModel = JSON.parse(this.$options.propsData.entity);
  },
};
</script>