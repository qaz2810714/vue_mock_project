<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          :entity="config.entity"
          ref="pm_search"
          :btnOffset="10"
          :packNoSearchSpan="6"
          :hasPackNoSearch="false"
          :packRowHeight="3"
          :fields="searchFields"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
        <pm_tool_bar>
          <pm_toolButton
            ref="addBtn"
            btnName="新增"
            btnIcon="el-icon-circle-plus-outline"
          ></pm_toolButton>
           <pm_toolButton
              ref="viewQuality"
              btnName="维护质检信息"
              btnIcon="el-icon-circle-plus-outline"
              :btnClickFunc="viewQuality"
            ></pm_toolButton>
          <pm_toolButton
            btnName="作废"
            btnIcon="el-icon-delete"
            :btnClickFunc="deleteInfo"
          ></pm_toolButton>
           <!-- <pm_toolButton
            btnName="审核"
            btnIcon="el-icon-circle-check-outline"
            :btnClickFunc="auditInfo"
          ></pm_toolButton> -->
          <!-- <pm_toolButton
            btnName="打印"
            btnIcon="el-icon-printer"
            :btnClickFunc="printInfo"
          ></pm_toolButton> -->
          <!-- <pm_toolButton
            btnName="结算"
            btnIcon="el-icon-sold-out"
            :btnClickFunc="settleInfo"
          ></pm_toolButton>
          <pm_toolButton
            btnName="导出"
            btnIcon="el-icon-document"
            :btnClickFunc="exportFunc"
          ></pm_toolButton>
          <pm_toolButton
            btnName="调整"
            btnIcon="el-icon-edit-outline"
            :btnClickFunc="adjustTab"
          ></pm_toolButton> -->
        </pm_tool_bar>
      </metro_page_box_body>
    </metro_page_box>

    <!-- <pm_context_menu ref="pmContextMenu" colsKey='whsinManage'></pm_context_menu> -->

    <!-- 数据展示区域 -->
    <metro_page_box>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table
          ref="pmTable"
          tableKey="NoteWhsInManage-pmTable"
          :reload="afterSetting"
          v-if="reload"
          :entity="config.entity"
          :dataSource="dataSource"
          :totalData="totalData"
          :config="config"
        >
          <pm_column prop="whsInCode" label="入库单号" width="200"></pm_column>
          <pm_column prop="clientName" label="客户名称" width="180"></pm_column>
          <pm_column prop="brand" label="品名" width="160"></pm_column>
          <pm_column prop="gramWeight" label="克重" width="120"></pm_column>
          <pm_column prop="classes" label="班次" width="120"></pm_column>
          <pm_column prop="clothWidth" label="幅宽" width="120"></pm_column>
          <pm_column prop="num" label="个数" width="120"></pm_column>
          <pm_column prop="color" label="颜色" width="120"></pm_column>
          <pm_column prop="createTime" label="创建时间" width="160"></pm_column>
          <pm_column prop="creator" label="创建人" width="160"></pm_column>
          <pm_column prop="modifier" label="修改人" width="160"></pm_column>
          <pm_column prop="modifyTime" label="修改时间" width="160"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getList"></pm_pagination>
      </metro_page_box_body>
    </metro_page_box>
    <div v-show="false">
      <barCodePrint ref="print" v-show="true"></barCodePrint>
    </div>
  </metro_page>
</template>

<script>
import metro_page from "@/components/vitems/pageContainer/metro_page";
import metro_page_box from "@/components/vitems/pageContainer/metro_page_box";
import metro_page_box_tool_bar from "@/components/vitems/pageContainer/metro_page_box_tool_bar";
import metro_page_box_body from "@/components/vitems/pageContainer/metro_page_box_body";
import metro_pageheader from "@/components/vitems/pageheader";
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_search from "@/components/vitems/pageSearch/pm_search";
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import { tableReload } from "@/components/common/table/table-reload";
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";
import httpUtil from "@/common/utils/HttpUtil";
import metadata from "@/common/entities/Metadata";
import pm_pagination from "@/components/common/table/pm_pagination";
import commonUtil from "@/common/utils/CommonUtils";
import printJS from "print-js";
import pm_context_menu from "@/components/common/menu/pm_context_menu";
import barCodePrint from "./BarCodePrint";
export default {
  mixins: [tableReload],
  components: {
    metro_page,
    metro_page_box,
    metro_page_box_tool_bar,
    metro_page_box_body,
    metro_pageheader,
    pm_search,
    pm_form_item,
    pm_toolButton,
    pm_tool_bar,
    pm_table,
    pm_column,
    pm_pagination,
    pm_context_menu,
    barCodePrint
  },
  data: function() {
    return {
      dataSource: [],
      totalData: null,
      config: {
        entity: metadata.wmsIn,
        allowEdit: false,
        multiple: true,
        dbclick: this.editTab,
      },
      totalSize: {
        type: Number,
        default: 0
      },
      // 搜索区域条件
      searchFields: [
        {
          displayName: "入库单号",
          fieldName: "whsInCode",
          xtype: "text",
          searchLoc: "1-1-6-8-0"
        },
        {
          displayName: "工艺",
          fieldName: "techId",
          xtype: "search_select_input",
          searchLoc: "1-2-6-8-0"
        },
        {
          displayName: "客户名称",
          fieldName: "clientName",
          xtype: "text",
          searchLoc: "1-3-6-8-0"
        },
        {
          displayName: "品名",
          fieldName: "brand",
          xtype: "text",
          searchLoc: "1-4-6-8-0"
        },
        {
          displayName: "班次",
          fieldName: "classes",
          xtype: "text",
          searchLoc: "2-1-6-8-0"
        },
        {
          displayName: "创建时间",
          fieldName: "createTime",
          xtype: "datetimerange",
          searchLoc: "2-2-12-4-0",
          dateBegin: "createStartTime",
          dateEnd: "createEndTime"
        },
        {
          displayName: "",
          fieldName: "btn_search",
          xtype: "btn",
          searchLoc: "2-3-4-8-2"
        }
      ]
    };
  },
  mounted() {
    // var cols = this.$refs.pmTable.getTableCols();
    // //右键菜单指定挂接位置
    // var tableHead = this.$refs.pmTable.$refs.multipleTable.$refs.tableHeader;
    // var el = tableHead.$el,vnode = tableHead.$vnode;
    // this.$refs.pmContextMenu.items = cols;
    // this.$refs.pmContextMenu.addRef(el,vnode);
  },
  methods: {
    printInfo: function() {
      let _this = this;
      let row = this.getSelectRow();
      _this.$refs.print.printDiv(row);
      // this.$commonUtil.getDetailEntity(
      //   "wmsin/getInDetailByMainId",
      //   { mainId: row.id },
      //   row,
      //   function(entity) {
      //     _this.$refs.print.printDiv(entity);
      //   }
      // );
    },
    queryData: function() {
      var $this = this;
      //1.查询时先获取所有的数据
      this.getData(data => {
        $this.totalData = data.records;
        //2.触发查询
        $this.$refs.pager.refreshData();
      });
    },
    getList: function(page, size) {
      var table = this;
      this.getData(data => {
        table.dataSource = data.records;
        table.totalSize = data.total;
      },page,size);
    },
    //作废数据
    deleteInfo() {
      //获取当前选中数据id
      let row = this.getSelectRow();
      if (row.status != 1) {
        this.$message({
          message: "只能作废待入库状态的单据！",
          type: "fail"
        });
        return;
      }
      let table = this;
      this.$confirm("确认作废选中的入库单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //发送请求删除数据
        httpUtil.post("whsin/deleteInInfo", row, data => {
          this.$message({
            message: "作废入库单成功",
            type: "success"
          });
          table.queryData();
        });
      });
    },
    auditInfo() {
      //获取当前选中数据id
      let row = this.getSelectRow();
      if (row.status != 1) {
        this.$message({
          message: "只能审核待入库状态的单据！",
          type: "fail"
        });
        return;
      }
      let table = this;
      //发送请求审核数据
      this.$confirm("确认审核选中的入库单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        httpUtil.post("whsin/auditInInfo", row, data => {
          this.$message({
            message: "审核入库单成功",
            type: "success"
          });
          table.queryData();
        });
      });
    },
    /**
     * 获取所有的查询数据
     */
    getData(callback,page,size) {
      var param = this.$refs.pm_search.getParam();
      this.$commonUtil.handler.packNoHander(param);
      param.page = {
        "current" : page||0,
        "size" : size||100000
      }
      //param.page = page || 0;
      //param.size = size || 100000;
      httpUtil.post("wmsin/viewPageList", param, data => {
        if (callback) {
          callback(data);
        }
      });
    },
    /**
     * 导出方法
     */
    exportFunc: function() {
      var $this = this;
      this.getData(data => {
        //获取表单的信息
        var table = $this.$refs.pmTable;
        $this.$commonUtil.cloudExport($this, data.records, table, "入库单列表");
      });
    },
    //获取选中行
    getSelectRow() {
      let selectRow = this.$refs.pmTable.currentRow;
      if (!selectRow) {
        this.$commonUtil.valid.throwEx(this, "请先选择一条信息");
      }
      return selectRow;
    },
    wrapData(entity) {
      entity.businessNo = entity.whsinCode;
      entity.cstId = entity.cstId;
      entity.businessType = 1;
      entity.createDate = entity.createTime;
      entity.creatorData = entity.creator;
      if (!entity.detailList) {
        return;
      }
      entity.detailList.forEach(element => {
        element.material = element.textureId;
        element.productPlace = element.producingId;
        element.businessNo = element.whsinCode;
        //element.transferDate = element.transferTime;
        element.whsInFirstDate = element.whsinTime;
        element.createDate = element.createTime;
        element.numFin = element.amount;
        if (!element.transferTimes) {
          element.transferNum = 0;
        } else {
          element.transferNum = element.transferTimes;
        }
        element.businessType = 1;
        element.costDate = element.costTime;
      });
      entity.detail = entity.detailList;
    }
  }
};
</script>

<style scoped>
</style>
