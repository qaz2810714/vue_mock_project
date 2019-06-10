<template>
  <metro_page>
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :packRowHeight="5"
          :fields="searchFields"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
      </metro_page_box_body>
    </metro_page_box>
    <metro_page_box>
      <!-- toolbar工具条部分 -->
      <pm_tool_bar>
        <pm_toolButton
          btnName="新增"
          btnPermission="btn_add"
          btnIcon="el-icon-circle-plus-outline"
          :btnClickFunc="addWin"
        ></pm_toolButton>
        <pm_toolButton
          btnName="作废"
          btnPermission="btn_del"
          btnIcon="el-icon-edit"
          :btnClickFunc="btn_del"
        ></pm_toolButton>
      </pm_tool_bar>
      <metro_page_box_body>
        <pm_table ref="pmTable" :dataSource="dataSource" :config="config">
          <pm_column prop="brandId" label="品名" width="200" placeholder></pm_column>
          <pm_column prop="spec" label="规格" width="200" placeholder></pm_column>
          <pm_column prop="weight" label="重量" width="200" placeholder></pm_column>
          <pm_column prop="adjustmentType" label="理算方式" width="200" placeholder></pm_column>
          <pm_column prop="producingArea" label="产地" placeholder></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getList"></pm_pagination>
      </metro_page_box_body>
    </metro_page_box>
  </metro_page>
</template>
<script>
import metro_page from "@/components/vitems/pageContainer/metro_page";
import metro_page_box from "@/components/vitems/pageContainer/metro_page_box";
import metro_page_box_body from "@/components/vitems/pageContainer/metro_page_box_body";
import metro_page_box_tool_bar from "@/components/vitems/pageContainer/metro_page_box_tool_bar";
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";
import pm_pagination from "@/components/common/table/pm_pagination";
import httpUtil from "@/common/utils/HttpUtil";
import commonUtil from "@/common/utils/CommonUtils";
import pm_search from "@/components/vitems/pageSearch/pm_search";
import metadata from "@/common/entities/Metadata";
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import physicalWeightEdit from "./PhysicalWeightEdit";

export default {
  components: {
    metro_page,
    metro_page_box,
    metro_page_box_body,
    metro_page_box_tool_bar,
    pm_form_item,
    pm_table,
    pm_search,
    pm_column,
    pm_pagination,
    pm_toolButton,
    pm_tool_bar
  },
  data: function() {
    return {
      dataSource: [],
      totalSize: 0,
      config: {
        entity: metadata.physicalWeight,
        height: 550,
        dbclick: this.editWin,
        showSummary: false
      },
      searchFields: [
        {
          displayName: "品名",
          fieldName: "name",
          xtype: "text",
          searchLoc: "1-1-6-4-0"
        },
        {
          displayName: "规格",
          fieldName: "spec",
          xtype: "text",
          searchLoc: "1-2-6-4-0"
        },
        {
          displayName: "理算方式",
          fieldName: "adjustmentType",
          xtype: "select",
          searchLoc: "1-3-6-6-0"
        },
        {
          displayName: "",
          fieldName: "btn_search",
          xtype: "btn",
          searchLoc: "1-4-4-1-2"
        }
      ]
    };
  },
  methods: {
    queryData: function() {
      this.$refs.pager.refreshData();
    },
    getList: function(page, size) {
      var param = this.$refs.pm_search.getParam();
      param.page = page;
      param.size = size;
      var table = this;
      httpUtil.post("base/getBasePhysicalWeightList", param, data => {
        table.dataSource = data.content;
        table.totalSize = data.total;
      });
    },
    addWin: function() {
      this.$layer.iframe({
        content: {
          content: physicalWeightEdit, //传递的组件对象
          parent: this, //当前的vue对象
          data: { entity: JSON.stringify({}) } //props
        },
        area: ["1000px", "200px"],
        shadeClose: false,
        title: "理算信息新增"
      });
    },
    //进入编辑页面
    editWin: function(row, event) {
      var $this = this;
      //alert(JSON.stringify(row));
      $this.$layer.iframe({
        content: {
          content: physicalWeightEdit, //传递的组件对象
          parent: $this, //当前的vue对象
          data: { key: row.id, entity: JSON.stringify(row) } //props
        },
        area: ["1000px", "200px"],
        shadeClose: false,
        title: "编辑理重[" + row.name + "]"
      });
    },
    refreshData: function() {
      this.$refs.search_pagination.refreshData();
    },
    //作废数据
    btn_del: function() {
      //获取当前选中数据id
      let selectRow = this.getSelectRow();
      let table = this;
      //发送请求删除数据
      this.$confirm("确认作废选中的理重数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        httpUtil.post("base/deleteBasePhysicalWeight", selectRow, data => {
          this.$message({
            message: "作废理重成功",
            type: "success"
          });
          this.refreshList();
        });
      });
    },
    /**
     * 刷新列表
     */
    refreshList: function() {
      var param = this.$refs.pm_search.getParam(); //alert(JSON.stringify(param));
      param.page = 0;
      this.$refs.pager.curPage = 0;
      this.queryData(param);
    },
    //获取选中行
    getSelectRow() {
      let selectRow = this.$refs.pmTable.currentRow;
      if (!selectRow) {
        this.$commonUtil.valid.throwEx(this, "请先选择一条信息");
      }
      return selectRow;
    }
  }
};
</script>
