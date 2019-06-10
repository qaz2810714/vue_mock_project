<template>
  <metro_page>
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :hasPackNoSearch="false"
          :entity="config.entity"
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
        <!-- <pm_toolButton btnName ="修改" btnPermission="btn_update" btnIcon ="el-icon-edit" :btnClickFunc ='editWin' ></pm_toolButton> -->
      </pm_tool_bar>
      <metro_page_box_body>
        <pm_table ref="pmTable" tableKey="OwnerManage-pmTable" :dataSource="dataSource" :config="config">
          <pm_column prop="cstNo" label="客户编号" width="150" placeholder></pm_column>
          <pm_column prop="cstFullName" label="客户全称" placeholder></pm_column>
          <pm_column prop="cstShortName" label="客户简称" width="200" placeholder></pm_column>
          <pm_column prop="mnemonicCode" label="助记码" width="200" placeholder></pm_column>
          <pm_column prop="contactPersonPhone" label="业务联系人电话" width="150" placeholder></pm_column>
          <pm_column prop="deleteFlag" label="状态" width="150" placeholder></pm_column>
        </pm_table>
        <pm_pagination ref="search_pagination" :totalSize="totalSize" :queryData="getData"></pm_pagination>
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
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import pm_search from "@/components/vitems/pageSearch/pm_search";
import metadata from "@/common/entities/Metadata";
import ownerEdit from "./OwnerEdit";
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
    pm_toolButton,
    pm_pagination,
    pm_tool_bar
  },
  data: function() {
    return {
      dataSource: [],
      totalSize: 0,
      queryFields: {},
      config: {
        entity: metadata.baseCst,
        dbclick: this.editWin,
        showSummary: false
      },
      searchFields: [
        {
          displayName: "客户",
          fieldName: "cstId",
          xtype: "search_select_input",
          searchLoc: "1-1-8-8-0"
        },
        {
          displayName: "助记码",
          fieldName: "mnemonicCode",
          xtype: "text",
          searchLoc: "1-2-8-8-0"
        },
        {
          displayName: "",
          fieldName: "btn_search",
          xtype: "btn",
          searchLoc: "1-3-4-8-4"
        }
      ]
    };
  },
  methods: {
    getData: function(page, size) {
      var _this = this;
      var searchField = this.queryFields;
      searchField.page = page;
      searchField.size = size;
      searchField.cstNo = searchField.cstId;
      httpUtil.post("cst/getCstByPage", searchField, data => {
        _this.dataSource = data.content;
        _this.totalSize = data.total;
      });
    },
    queryData: function() {
      this.queryFields = this.$refs.pm_search.getParam();
      this.$refs.search_pagination.refreshData();
    },
    addWin: function() {
      this.$layer.iframe({
        content: {
          content: ownerEdit, //传递的组件对象
          parent: this, //当前的vue对象
          data: { editFlag: "add", entity: JSON.stringify({}) } //props
        },
        area: ["1000px", "450px"],
        shadeClose: false,
        title: "新增货主信息"
      });
    },
    //进入编辑页面
    editWin: function() {
      //获取选中行信息
      let selectRow = this.$refs.pmTable.currentRow;
      if (!selectRow) {
        this.$message("请先选择一条信息");
        return;
      }
      this.$layer.iframe({
        content: {
          content: ownerEdit, //传递的组件对象
          parent: this, //当前的vue对象
          data: { editFlag: "update", entity: JSON.stringify(selectRow) } //props
        },
        area: ["1000px", "450px"],
        shadeClose: false,
        title: "修改货主信息"
      });
    }
  }
};
</script>
