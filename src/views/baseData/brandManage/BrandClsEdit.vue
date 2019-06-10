<template>
  <el-container style="padding:5px;">
    <el-main style="padding:10px;">
      <pm_form_render :model="formModel" :rules="rules" ref="mainForm">
        <pm_form_item
          row="1"
          labletext="品类名称"
          name="name"
          :span="24"
          xtype="text"
          lableWidth="100px"
          required
        ></pm_form_item>
        <pm_form_item
          row="2"
          labletext="上级品类代码"
          name="parentId"
          :span="24"
          xtype="text"
          lableWidth="100px"
          :readOnly="true"
          :canClickParent="true"
        ></pm_form_item>
        <pm_form_item
          row="3"
          labletext="上级品类名称"
          name="parentName"
          :span="24"
          xtype="text"
          lableWidth="100px"
          :readOnly="true"
        ></pm_form_item>
      </pm_form_render>
    </el-main>
    <el-footer style="padding:0px;">
      <!-- toolbar工具条部分 -->
      <pm_tool_bar :noBackground="true">
        <pm_toolButton btnName="确认" btnIcon="el-icon-success" :btnClickFunc="confirm_func"></pm_toolButton>
        <pm_toolButton btnName="取消" btnIcon="el-icon-close" :btnClickFunc="closeWin"></pm_toolButton>
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
        name: [{ required: true, message: "请输入品类名称", trigger: "blur" }]
      },
      deptTree: [],
      formModel: null
    };
  },
  methods: {
    confirm_func: function() {
      let _this = this;
      if (!this.formModel.parent) {
        this.formModel.parent = "0";
      }
      this.$refs["mainForm"].validate(this, valid => {
        if (_this.formModel.editFlag == "add") {
          //新增确认
          httpUtil.post("product/addBaseClass", _this.formModel, data => {
            _this.$message({
              message: "新增品类成功",
              type: "success"
            });
            _this.$options.parent.loadTree();
            _this.closeWin();
          });
        } else if (_this.formModel.editFlag == "edit") {
          //编辑确认
          httpUtil.post("product/updateBaseClass", _this.formModel, data => {
            _this.$message({
              message: "修改品类成功",
              type: "success"
            });
            _this.$options.parent.loadTree();
            _this.closeWin();
          });
        }
      });
    },
    /**
     * 查找父级信息
     */
    findParent:function(tree,parentId){
      for(var i=0;i<tree.length;i++){
        var node = tree[i];
        if(node.id == parentId) return node;
        if(node.children){
          var result = this.findParent(node.children,parentId);
          if(result) return result;
        }
      }
      return null;
    },
    closeWin: layerUtil.closeWin
  },
  created() {
    this.deptTree = JSON.parse(this.$options.propsData.list);
    //获取传入数据
    this.formModel = JSON.parse(this.$options.propsData.entity);
    var parent = this.findParent(this.deptTree, this.formModel.parentId);
    if(parent){
      this.$set(this.formModel,'parentName',parent.name);
    }
  }
};
</script>