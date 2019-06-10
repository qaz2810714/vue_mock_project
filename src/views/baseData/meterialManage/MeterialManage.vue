<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :hasPackNoSearch="false"
          :fields="searchFields"
          :entity="config.entity"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
      </metro_page_box_body>
    </metro_page_box>

    <!-- 数据展示区域 -->
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
          :btnClickFunc="btn_func"
        ></pm_toolButton>
      </pm_tool_bar>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table ref="pmTable" tableKey="MeterialManage-pmTable" :dataSource="dataSource" :config="config">
          <!-- <vue_column :prop="props.field" slot-scope="props" label="测试" allowEdit='true' width="200" placeholder="请输入捆包号"
          :callback="requestTransactionLogs" renderType="input"></vue_column>-->
          <pm_column prop="name" label="材质名称" width="300"></pm_column>
          <pm_column prop="mnemonicCode" label="助记码" width="200"></pm_column>
          <pm_column prop="remark" label="备注"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getList"></pm_pagination>
      </metro_page_box_body>
    </metro_page_box>
  </metro_page>
</template>
<script>
import metro_page from "@/components/vitems/pageContainer/metro_page";
import metro_page_box from "@/components/vitems/pageContainer/metro_page_box";
import metro_page_box_tool_bar from "@/components/vitems/pageContainer/metro_page_box_tool_bar";
import metro_page_box_body from "@/components/vitems/pageContainer/metro_page_box_body";
import metro_pageheader from "@/components/vitems/pageheader";
import pm_search from "@/components/vitems/pageSearch/pm_search";
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";
import httpUtil from "@/common/utils/HttpUtil";
import metadata from "@/common/entities/Metadata";
import commonUtil from "@/common/utils/CommonUtils";

import pm_pagination from "@/components/common/table/pm_pagination";
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import meterialEdit from "./MeterialEdit";
export default {
  components: {
    metro_page,
    metro_page_box,
    metro_page_box_tool_bar,
    metro_page_box_body,
    metro_pageheader,
    pm_search,
    pm_table,
    pm_column,
    pm_pagination,
    pm_toolButton,
    pm_tool_bar
  },
  data: function() {
    return {
      dataSource: [],
      config: {
        entity: null,
        allowEdit: false,
        multiple: false,
        showSummary: false,
        dbclick: this.editWin
      },
      totalSize: 0,
      // 搜索区域条件
      searchFields: [
        {
          displayName: "材质名称",
          fieldName: "name",
          xtype: "text",
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
        // {displayName: '', fieldName: 'btn_search', xtype:'btn', searchLoc:'4-4-16-8-0'}
      ]
    };
  },
  methods: {
    addWin: function() {
      this.$layer.iframe({
        content: {
          content: meterialEdit, //传递的组件对象
          parent: this, //当前的vue对象
          data: { entity: JSON.stringify({}) } //props
        },
        area: ["400px", "300px"],
        shadeClose: false,
        title: "添加材质"
      });
    },
    //进入编辑页面
    editWin: function(row, event) {
      var $this = this;
      $this.$layer.iframe({
        content: {
          content: meterialEdit, //传递的组件对象
          parent: $this, //当前的vue对象
          data: { key: row.id, entity: JSON.stringify(row) } //props
        },
        area: ["400px", "300px"],
        shadeClose: false,
        title: "编辑材质[" + row.name + "]"
      });
    },
    getParam: function() {
      console.log(this.formModel);
      this.$refs["demoForm"].validate();
    },
    queryData: function() {
      this.$refs.pager.refreshData();
    },
    getList: function(page, size) {
      var param = this.$refs.pm_search.getParam();
      param.page = page;
      param.size = size;
      var table = this;
      httpUtil.post("base/getBaseTextureList", param, data => {
        table.dataSource = data.content;
        table.totalSize = data.total;
      });
    },
    getTableInfo: function(row) {
      //console.log(row);
      console.log("以下是获取整个Table的数据");
      // console.log(this.$refs.pmTable.getTableInfo());
      // console.log(this.$refs.pmTable.getRowInfo(2));
    },
    /**
     * 刷新列表
     */
    refreshList: function() {
      //alert(JSON.stringify(this.$refs.pager.curPage));
      var param = this.$refs.pm_search.getParam();
      param.page = 0;
      this.$refs.pager.curPage = 0;
      this.queryData(param);
    },
    //作废数据
    btn_func() {
      let selectRow = this.getSelectRow();
      let $this = this;

      //发送请求删除数据
      this.$confirm("确认作废选中的材质数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //发送请求删除数据
        httpUtil.post("base/deleteBaseTexture", selectRow, data => {
          this.$message({
            message: "作废材质成功",
            type: "success"
          });
          $this.refreshList();
        });
      });
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