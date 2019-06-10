<template>
<el-container style="padding:5px;">
  <el-main style="padding:10px;">
    <pm_form_render :model="formModel" :rules="rules" ref="qualityForm" :entity='entity'>
      <pm_form_item row="1" labletext="入库单号" name="wmsInCode" :span="12" xtype="text" maxlength="20" lableWidth="100px" required></pm_form_item>
      <pm_form_item row="2" labletext="纵向强力(N)" name="portraitPower" :span="12" xtype="number" maxlength="20" lableWidth="100px" ></pm_form_item>
      <pm_form_item row="2" labletext="横向强力(N)" name="transversePower" :span="12" xtype="number" maxlength="20" lableWidth="100px" ></pm_form_item>
      <pm_form_item row="1" labletext="纵横比" name="ratio" :span="12" xtype="number" maxlength="20" lableWidth="100px" ></pm_form_item>
      <pm_form_item row="3" labletext="纵向牵伸(%)" name="portraitDrafting" :span="12" xtype="number" maxlength="20" lableWidth="100px" ></pm_form_item>
      <pm_form_item row="3" labletext="横向牵伸(%)" name="transverseDrafting" :span="12" xtype="number" maxlength="20" lableWidth="100px" ></pm_form_item>
      <pm_form_item row="4" labletext="单丝细度(旦)" name="singleSilkThin" :span="12" xtype="number" maxlength="20" lableWidth="100px" ></pm_form_item>
      <pm_form_item row="4" labletext="厚度(mm)" name="thickness" :span="12" xtype="number" maxlength="20" lableWidth="100px" ></pm_form_item>
      <pm_form_item row="5" labletext="均匀度" name="even" :span="12" xtype="number" maxlength="20" lableWidth="100px" ></pm_form_item>
      <pm_form_item row="5" labletext="柔软度" name="soft" :span="12" xtype="number" maxlength="20" lableWidth="100px" ></pm_form_item>
      <pm_form_item row="6" labletext="备注" name="remark" :span="24" xtype="textarea" lableWidth="80px"  maxlength="100" ></pm_form_item>
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
      },
      entity: metadata.quality
    };
  },
   watch:{
      'formModel.portraitPower'(){
        if(this.formModel.portraitPower == null  || this.formModel.transversePower == null){
          this.$set(this.formModel,"ratio",0);
        }else{
          this.$set(this.formModel,"ratio",this.formModel.portraitPower/this.formModel.transversePower);
        }
      },
      'formModel.transversePower'(){
        if(this.formModel.portraitPower == null  || this.formModel.transversePower == null){
          this.$set(this.formModel,"ratio",0);
        }else{
          this.$set(this.formModel,"ratio",this.formModel.portraitPower/this.formModel.transversePower);
        }
      }
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
      this.$refs["qualityForm"].validate(this,valid => {
        if (data.id == null) {
          this.$httpUtil.post("quality/addQualityInfo", data, result => {
            this.$layer.msg("质检信息新增成功!");
            this.refreshList();
          });
        } else {
          this.$httpUtil.post("quality/updateQualityInfo", data, result => {
            this.$layer.msg("质检信息修改成功!");
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
      this.$refs["qualityForm"].validate();
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