<template>
  <el-container style="padding:5px;">
    <el-main style="padding:10px;">
      <div style="height:255px;">
        <pm_form_render
          :model="formModel"
          :entity="$metaData.baseBrand"
          :rules="rules"
          ref="mainForm"
        >
          <pm_form_item
            row="1"
            labletext="品名名称"
            name="name"
            :span="12"
            xtype="text"
            lableWidth="80px"
            required
          ></pm_form_item>
          <pm_form_item
            row="1"
            labletext="助记码"
            name="mnemonicCode"
            :span="12"
            xtype="text"
            lableWidth="80px"
          ></pm_form_item>
          <pm_form_item
            row="2"
            labletext="出库方式"
            name="whsoutType"
            :span="12"
            xtype="select"
            lableWidth="80px"
            required
          ></pm_form_item>
          <pm_form_item
            row="2"
            labletext="备注"
            name="remark"
            :span="12"
            xtype="text"
            lableWidth="80px"
          ></pm_form_item>
          <pm_form_item
            row="3"
            labletext="sku属性"
            name="skuProperty"
            :span="24"
            :disabledList="['brandId','textureId','spec','producingId']"
            xtype="checkbox_group"
            lableWidth="80px"
            required
          ></pm_form_item>
          <pm_form_item
            row="4"
            labletext="材质"
            name="brandTextureList"
            :span="24"
            xtype="select_batch"
            lableWidth="80px"
            required
          ></pm_form_item>
        </pm_form_render>
      </div>
    </el-main>
    <el-footer style="padding:0px;">
      <!-- toolbar工具条部分 -->
      <pm_tool_bar :noBackground="true">
        <pm_toolButton btnName="保存" btnIcon="el-icon-success" :btnClickFunc="btn_save"></pm_toolButton>
        <pm_toolButton btnName="取消" btnIcon="el-icon-close" :btnClickFunc="closeWin"></pm_toolButton>
      </pm_tool_bar>
    </el-footer>
  </el-container>
</template>
<script>
import layerUtil from "@/common/utils/LayerUtil";
import metadata from "@/common/entities/Metadata";
import Table from "@/components/common/table/Table";
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
export default {
  components: {
    x_table: Table,
    pm_form_item,
    pm_toolButton,
    pm_tool_bar
  },
  data: function() {
    return {
      formModel: {},
      rules: {
        name: [{ required: true, message: "请输入品名名称", trigger: "blur" }],
        skuProperty: [
          { required: true, message: "请选择sku属性", trigger: "blur" }
        ],
        brandTextureList: [
          { required: true, message: "请选择材质", trigger: "blur" }
        ],
        whsoutType: [
          { required: true, message: "请选择出库方式", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.formModel = this.getFormModel();
  },
  methods: {
    //获取数据源
    getFormModel: function() {
      var entity = JSON.parse(this.$options.propsData.entity);
      if (entity.skuProperty == null) {
        this.$set(entity, "skuProperty", []);
      }
      //新增给默认值
      if (entity.id == null) {
        this.$set(entity, "skuProperty", [
          "brandId",
          "textureId",
          "spec",
          "producingId"
        ]);
      }
      if (entity.textureList != null && entity.textureList.length > 0) {
        this.$set(
          entity,
          "brandTextureList",
          entity.textureList.map(a => a.id)
        );
      } else {
        this.$set(entity, "brandTextureList", []);
      }
      return entity;
    },
    refreshList: function() {
      this.$options.parent.refreshList();
      this.closeWin();
    },
    /**
     * 保存数据
     */
    btn_save: function() {
      //准备修改数据
      var data = this.$commonUtil.deepClone(this.formModel);
      data.brandTextureList = data.brandTextureList.map(a => {
        return { textureId: a };
      });
      data.skuProperties = data.skuProperty.join(",");
      var $this = this;
      this.$refs["mainForm"].validate(this, valid => {
        if (data.id == null) {
          $this.$httpUtil.post("product/addBrand", data, result => {
            $this.$message({
              message: "品名新增成功",
              type: "success"
            });
            $this.refreshList();
          });
        } else {
          $this.$httpUtil.post("product/updateBrand", data, result => {
            $this.$message({
              message: "品名修改成功",
              type: "success"
            });
            $this.refreshList();
          });
        }
      });
    },
    closeWin: layerUtil.closeWin
  }
};
</script>