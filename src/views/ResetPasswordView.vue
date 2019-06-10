<template>
<el-container>
  <el-main style="padding:10px;">
 <el-form :model="formModel" :rules="rules" ref="mainForm" label-position="left" label-width="0px" >
    <el-form-item prop="oldPassword">
     <label>原始密码</label>
      <el-input type="password" v-model="formModel.oldPassword" auto-complete="off" placeholder="请输入原始密码" maxlength ='20'></el-input>
    </el-form-item>
    <el-form-item prop="loginPassword">
       <label>登录密码</label>
      <el-input type="password" v-model="formModel.loginPassword" auto-complete="off" placeholder="请输入2~20位登录密码" maxlength ='20'></el-input>
    </el-form-item>
   <el-form-item prop="confirmPassword">
     <label>确认密码</label>
      <el-input type="password" v-model="formModel.confirmPassword" auto-complete="off" placeholder="请再次输入登录密码" maxlength ='20'></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="confirm_func" >确认</el-button>
    </el-form-item>
  </el-form>
  </el-main>
</el-container>
</template>
<script>
import httpUtil from "@/common/utils/HttpUtil";
import userCache from "@/common/utils/CacheUtil.js";
import layerUtil from "@/common/utils/LayerUtil";
export default {
  components: {
   
  },
  data: function() {
   var validateConfirmPassword = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请再次输入登录密码'))
      } else if (value !== this.formModel.loginPassword) {
        callback(new Error('登录密码和确认密码不一致！'))
      } else {
        callback()
      }
    }
    var validateLoginPassword = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入登录密码'))
      } else if (value == this.formModel.oldPassword) {
        callback(new Error('登录密码和原始密码不可以相同！'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      rules: {
          oldPassword: [
              { required: true, message: "请输入原密码", trigger: 'blur' },
              { pattern: /^[a-zA-Z0-9]{6,20}$/, message: '密码长度至少6位,由数字、字母组成' }
          ],
          loginPassword: [
              { required: true, validator: validateLoginPassword, trigger: 'blur' },
              { pattern: /^[a-zA-Z0-9]{6,20}$/, message: '密码长度至少6位,由数字、字母组成' }
          ],
          confirmPassword: [
              { required: true, validator: validateConfirmPassword, trigger: 'blur' },
          ]
      },
      formModel:{}
    };
    
  },
  methods: {
    confirm_func(ev) {
      var _this = this;
      _this.formModel.id=userCache.getUser().userId;
      this.$refs.mainForm.validate((valid) => {
        if (valid) {
          httpUtil.post("rbac/user/updatePassword", _this.formModel, data => {
            _this.$message({
              message: '修改密码成功',
              type: 'success'
            });
            _this.closeWin();    
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    closeWin:layerUtil.closeWin,
  },
};
</script>