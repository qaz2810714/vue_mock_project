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
          btnIcon="el-icon-circle-plus-outline"
          :btnClickFunc="addWin"
        ></pm_toolButton>
        <pm_toolButton
          btnName="作废"
          btnIcon="el-icon-edit"
          :btnClickFunc="btn_func"
        ></pm_toolButton>
      </pm_tool_bar>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table ref="pmTable" tableKey="MeterialManage-pmTable" :dataSource="dataSource" :config="config">
          <!-- <vue_column :prop="props.field" slot-scope="props" label="测试" allowEdit='true' width="200" placeholder="请输入捆包号"
          :callback="requestTransactionLogs" renderType="input"></vue_column>-->
          <pm_column prop="wmsInCode" label="入库单号" width="300"></pm_column>
          <pm_column prop="portraitPower" label="纵向强力(N)" width="200"></pm_column>
          <pm_column prop="transversePower" label="横向强力(N)" width="200"></pm_column>
          <pm_column prop="ratio" label="纵横比" width="200"></pm_column>
          <pm_column prop="portraitDrafting" label="纵向牵伸(%)" width="200"></pm_column>
          <pm_column prop="transverseDrafting" label="横向牵伸(%)" width="200"></pm_column>
          <pm_column prop="singleSilkThin" label="单丝细度(旦)" width="200"></pm_column>
          <pm_column prop="thickness" label="厚度(mm)" width="200"></pm_column>
          <pm_column prop="even" label="均匀度" width="200"></pm_column>
          <pm_column prop="soft" label="柔软度" width="200"></pm_column>
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
import qualityEdit from "./QualityEdit";
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
          displayName: "入库单号",
          fieldName: "wmsInCode",
          xtype: "text",
          searchLoc: "1-1-10-8-0"
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
          content: qualityEdit, //传递的组件对象
          parent: this, //当前的vue对象
          data: { entity: JSON.stringify({}) } //props
        },
        area: ["600px", "360px"],
        shadeClose: false,
        title: "添加质检信息"
      });
    },
    //进入编辑页面
    editWin: function(row, event) {
      var $this = this;
      $this.$layer.iframe({
        content: {
          content: qualityEdit, //传递的组件对象
          parent: $this, //当前的vue对象
          data: { key: row.id, entity: JSON.stringify(row) } //props
        },
        area: ["600px", "360px"],
        shadeClose: false,
        title: "编辑质检信息[" + row.wmsInCode + "]"
      });
    },
    getParam: function() {
      console.log(this.formModel);
      // this.$refs["demoForm"].validate();
    },
    queryData: function() {
      this.$refs.pager.refreshData();
    },
    getList: function(page, size) {
      var param = this.$refs.pm_search.getParam();
      param.page = {};
      param.page.current = page;
      param.page.size = size;
      var table = this;
      httpUtil.post("quality/getQualitiesByPage", param, data => {
        table.dataSource = data.records;
        table.totalSize = data.total;
      });
    },
    getTableInfo: function(row) {
      console.log("以下是获取整个Table的数据");
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
        httpUtil.post("quality/deleteQualityInfo", selectRow, data => {
          this.$message({
            message: "作废质检信息成功",
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