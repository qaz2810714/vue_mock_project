<template>
<el-container style="padding:5px;">
  <el-main style="padding:10px;">
    <pm_form_render :model="formModel" :rules="rules" ref="paForm">
          <pm_form_item row="1" labletext="产地代码" name="placeId" :span="24" xtype="text" placeholder="系统自动生成CD+8位流水号" :readOnly="true"   lableWidth="80px"></pm_form_item>
          <pm_form_item row="2" labletext="产地名称" name="placeShortName" :span="24" xtype="text" lableWidth="80px" required></pm_form_item>
          <pm_form_item row="3" labletext="助记码" name="mnemonicCode" :span="24" xtype="text" lableWidth="80px"></pm_form_item>
          <pm_form_item row="4" labletext="备注" name="remark" :span="24" xtype="textarea" lableWidth="80px"></pm_form_item>
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
              { required: true, message: "请输入产地名称", trigger: "blur" }
          ]
      }
    };
  },
  created:function(){
    this.formModel=this.getFormModel();

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
      data.placeFullName=data.placeShortName;      
      this.$refs["paForm"].validate(this,valid => {
        if (data.id == null) {
          this.$httpUtil.post("base/addBasePlace", data, result => {
            this.$message({
                message: '产地新增成功!',
                type: 'success'
            });
            this.refreshList();
          });
        } else {
          this.$httpUtil.post("base/updateBasePlace", data, result => {
            this.$message({
                message: '产地修改成功!',
                type: 'success'
            });
            this.refreshList();
          });
        }
      });
    },
    queryData: function(data) {
      console.log(data);
    },
    getParam: function() {
      this.$refs["paForm"].validate();
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