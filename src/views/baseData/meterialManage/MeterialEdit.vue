<template>
<el-container style="padding:5px;">
  <el-main style="padding:10px;">
    <pm_form_render :model="formModel" :rules="rules" ref="demoForm">
        <pm_form_item row="1" labletext="材质名称" name="name" :span="24" xtype="text" maxlength="20" lableWidth="80px" required></pm_form_item>
        <pm_form_item row="2" labletext="助记码" name="mnemonicCode" :span="24" xtype="text" maxlength="20"  lableWidth="80px"></pm_form_item>
        <pm_form_item row="3" labletext="备注" name="remark" :span="24" xtype="textarea" lableWidth="80px"  maxlength="100" ></pm_form_item>
    </pm_form_render>
  </el-main>
  <el-footer style="padding:0px;">
  <!-- toolbar工具条部分 -->
        <pm_tool_bar :noBackground="true">
          <pm_toolButton
            btnName="保存"
            btnIcon="el-icon-success"
            :btnClickFunc="btn_save"
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
import httpUtil from "@/common/utils/HttpUtil";
import layerUtil from "@/common/utils/LayerUtil";
import metadata from "@/common/entities/Metadata";
import commonUtil from "@/common/utils/CommonUtils";

import Table from "@/components/common/table/Table";
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_search from "@/components/vitems/pageSearch/pm_search";
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";

import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
export default {
  components: {
    x_table: Table,
    pm_search,
    pm_form_item,
    pm_table,
    pm_column,
    pm_toolButton,
    pm_tool_bar
  },
  data: function() {
    return {
      formModel:{},
      rules: {
          name: [
              { required: true, message: "请输入材质名称", trigger: "blur" }
          ]
      }
    };
  },
  computed:{
    
  },
  created(){
    this.formModel = this.getFormModel();
  },
  methods: {
    //获取数据源
    getFormModel:function(){
        var entity = JSON.parse(this.$options.propsData.entity);
        return entity;
    },
    refreshList:function(){
       this.$options.parent.refreshList();
       this.closeWin();
    },
    btn_save: function() {
      //准备修改数据
      var data = this.$commonUtil.deepClone(this.formModel);
      //alert(JSON.stringify(data));      
      this.$refs["demoForm"].validate(this,valid => {
        if (data.id == null) {
          this.$httpUtil.post("base/addBaseTexture", data, result => {
            this.$layer.msg("材质新增成功!");
            this.refreshList();
          });
        } else {
          this.$httpUtil.post("base/updateBaseTexture", data, result => {
            this.$layer.msg("材质修改成功!");
            this.refreshList();
          });
        }
      });

    },
    queryData: function(data) {
      console.log(data);
    },
    getParam: function() {
      console.log(this.formModel);
      this.$refs["demoForm"].validate();
    },
    getTableInfo: function(row) {
      console.log(row);
      // console.log("以下是获取整个Table的数据");
      // console.log(this.$refs.pmTable.getTableInfo());
      // console.log(this.$refs.pmTable.getRowInfo(2));
    },
    closeWin: layerUtil.closeWin
  }
};
</script>