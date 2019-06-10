<template>
  <metro_page>
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :packRowHeight="5"
          :entity="config.entity"
          :fields="searchFields"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
      </metro_page_box_body>
    </metro_page_box>
    <metro_page_box>
      <pm_tool_bar>
        <pm_toolButton
          btnName="新增"
          btnPermission="btn_add"
          btnIcon="el-icon-circle-plus-outline"
          :btnClickFunc="addWin"
        ></pm_toolButton>
        <!-- <pm_toolButton btnName ="修改" btnPermission="btn_update" btnIcon ="el-icon-edit" :btnClickFunc ='editWin' ></pm_toolButton> -->
        <pm_toolButton
          btnName="作废"
          btnPermission="btn_del"
          btnIcon="el-icon-edit"
          :btnClickFunc="deleteInfo"
        ></pm_toolButton>
      </pm_tool_bar>
      <metro_page_box_body>
        <pm_table ref="pmTable" tableKey="LibraryPositionManage-pmTable" :dataSource="dataSource" :config="config">
          <pm_column prop="code" label="代码" width="200" placeholder></pm_column>
          <pm_column prop="name" label="名称" width="200" placeholder></pm_column>
          <pm_column prop="level" label="级别" width="200" placeholder></pm_column>
          <pm_column prop="type" label="类型" placeholder></pm_column>
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
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";
import pm_pagination from "@/components/common/table/pm_pagination";
import httpUtil from "@/common/utils/HttpUtil";
import pm_search from "@/components/vitems/pageSearch/pm_search";
import metadata from "@/common/entities/Metadata";
import libraryPositionEdit from "./LibraryPositionEdit";
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
    pm_tool_bar,
    pm_pagination
  },
  data: function() {
    return {
      dataSource: [],
      totalSize: 0,
      queryFields: {
        mnemonicCode: null
      },
      config: {
        entity: metadata.storeLocation,
        dbclick: this.editWin,
        showSummary: false
      },
      searchFields: [
        {
          displayName: "库位",
          fieldName: "whsRoomId",
          xtype: "tree_select",
          searchLoc: "1-1-6-4-0",
          parentName: "whsRoomId",
          childName: "whsAreaId"
        },
        {
          displayName: "",
          fieldName: "btn_search",
          xtype: "btn",
          searchLoc: "1-2-4-8-14"
        }
      ]
    };
  },
  methods: {
    getData: function(page, size) {
      let _this = this;
      let searchField = this.queryFields;
      searchField.page = page;
      searchField.size = size;
      httpUtil.post("store/getStoreLocationByPage", searchField, data => {
        _this.dataSource = data.content;
        _this.totalSize = data.total;
      });
    },
    addWin: function() {
      this.$layer.iframe({
        content: {
          content: libraryPositionEdit, //传递的组件对象
          parent: this, //当前的vue对象
          data: { editFlag: "add", entity: JSON.stringify({}) } //props
        },
        area: ["1000px", "250px"],
        shadeClose: false,
        title: "新增信息"
      });
    },
    //进入编辑页面
    editWin: function() {
      //获取选中行信息
      let selectRow = this.$refs.pmTable.currentRow;
      if (!selectRow) {
        this.$alert("请先选择一条信息", "提示");
        return;
      }
      this.$layer.iframe({
        content: {
          content: libraryPositionEdit, //传递的组件对象
          parent: this, //当前的vue对象
          data: { editFlag: "update", entity: JSON.stringify(selectRow) } //props
        },
        area: ["1000px", "250px"],
        shadeClose: false,
        title: "修改信息"
      });
    },
    deleteInfo: function() {
      //获取选中行信息
      let selectRow = this.$refs.pmTable.currentRow;
      if (!selectRow) {
        this.$message({
          message: "请先选择一条信息!",
          type: "fail"
        });
        return;
      }
      let _this = this;
      httpUtil.post("store/deleteStoreLocatin", selectRow, data => {
        this.$message({
          message: "废弃库区信息成功!",
          type: "success"
        });
        _this.queryData();
      });
    },
    queryData: function() {
      this.queryFields = this.$refs.pm_search.getParam();
      this.$refs.search_pagination.refreshData();
    }
  }
};
</script>
