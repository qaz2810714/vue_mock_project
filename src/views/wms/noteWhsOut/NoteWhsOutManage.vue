<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :entity="config.entity"
          :btnOffset="10"
          :packNoSearchSpan="6"
          :hasPackNoSearch="true"
          :packRowHeight="3"
          :fields="searchFields"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
        <pm_tool_bar>
          <pm_toolButton
            btnName="新增"
            btnPermission="btn_add"
            btnIcon="el-icon-circle-plus-outline"
            :btnClickFunc="addTab"
          ></pm_toolButton>
          <pm_toolButton
            btnName="作废"
            btnPermission="btn_del"
            btnIcon="el-icon-delete"
            :btnClickFunc="deleteInfo"
          ></pm_toolButton>
          <pm_toolButton
            btnName="出库"
            btnPermission="btn_check"
            btnIcon="el-icon-goods"
            :btnClickFunc="auditInfo"
          ></pm_toolButton>
          <pm_toolButton
            btnName="打印"
            btnPermission="btn_print"
            btnIcon="el-icon-printer"
            :btnClickFunc="printInfo"
          ></pm_toolButton>
          <pm_toolButton
            btnName="结算"
            btnPermission="btn_settle"
            btnIcon="el-icon-sold-out"
            :btnClickFunc="settleInfo"
          ></pm_toolButton>
          <pm_toolButton
            btnName="导出"
            btnPermission="btn_export"
            btnIcon="el-icon-document"
            :btnClickFunc="exportFunc"
          ></pm_toolButton>
          <pm_toolButton
            btnName="调整"
            btnPermission="btn_adjust"
            btnIcon="el-icon-edit-outline"
            :btnClickFunc="adjustTab"
          ></pm_toolButton>
        </pm_tool_bar>
      </metro_page_box_body>
    </metro_page_box>

    <!-- 数据展示区域 -->
    <metro_page_box>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table
          ref="pmTable"
          tableKey="NoteWhsOutManage-pmTable"
          :reload="afterSetting"
          v-if="reload"
          :dataSource="dataSource"
          :totalData="totalData"
          :config="config"
        >
          <pm_column prop="whsoutNo" label="出库单号" width="120"></pm_column>
          <pm_column prop="cstName" label="货主单位" width="200"></pm_column>
          <pm_column prop="deliveryName" label="提货单位" width="200"></pm_column>
          <pm_column prop="vehicleNumber" label="提货车牌号" width="110"></pm_column>
          <pm_column prop="billAttachmentId" label="外部单据号" width="150"></pm_column>
          <pm_column prop="status" label="出库单状态" width="108"></pm_column>
          <pm_column prop="allNumber" label="总数量" width="100"></pm_column>
          <pm_column prop="totalNetWeight" label="总净重" width="100"></pm_column>
          <pm_column prop="totalGrossWeight" label="总毛重" width="100"></pm_column>
          <pm_column prop="totalPoundWeight" label="总磅重" width="100"></pm_column>
          <pm_column prop="creatorName" label="制单人" width="109"></pm_column>
          <pm_column prop="createTime" label="制单时间" width="150"></pm_column>
          <pm_column prop="remark" label="备注" width="200"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getList"></pm_pagination>
      </metro_page_box_body>
    </metro_page_box>
    <noteWhsOutPrint ref="print" v-show="false"></noteWhsOutPrint>
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
import noteWhsOutEdit from "./NoteWhsOutEdit";
import commonUtil from "@/common/utils/CommonUtils";
import costBalanceAddManage from "@/views/cost/costBalanceAdd/CostBalanceAddManage";
import printJS from "print-js";
import noteWhsOutPrint from "./NoteWhsOutPrint";
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
    noteWhsOutPrint
  },
  data: function() {
    return {
      dataSource: [],
      totalData: null,
      config: {
        entity: metadata.whsOut,
        allowEdit: false,
        multiple: false,
        dbclick: this.editTab,
        rowCanEdit: function(obj) {}
      },
      totalSize: 0,
      // 搜索区域条件
      searchFields: [
        {
          displayName: "出库单号",
          fieldName: "whsoutNo",
          xtype: "text",
          searchLoc: "1-1-8-8-0"
        },
        {
          displayName: "货主单位",
          fieldName: "cstId",
          xtype: "search_select_input",
          searchLoc: "1-2-8-8-0"
        },
        {
          displayName: "卡号",
          fieldName: "cstPackNo",
          xtype: "text",
          searchLoc: "1-3-8-8-0"
        },
        {
          displayName: "品名",
          fieldName: "brandId",
          xtype: "search_select_input",
          searchLoc: "2-1-8-8-0"
        },
        {
          displayName: "材质",
          fieldName: "textureId",
          xtype: "search_select_input",
          searchLoc: "2-2-8-8-0"
        },
        {
          displayName: "规格",
          fieldName: "spec",
          xtype: "text",
          searchLoc: "2-3-8-8-0"
        },
        {
          displayName: "产地",
          fieldName: "producingId",
          xtype: "search_select_input",
          searchLoc: "3-1-8-8-0"
        },
        {
          displayName: "制单时间",
          fieldName: "createTime",
          xtype: "datetimerange",
          searchLoc: "3-2-16-4-0",
          dateBegin: "createTimeStart",
          dateEnd: "createTimeEnd"
        }
      ],
      searchParam: {}
    };
  },
  methods: {
    printInfo: function() {
      let _this = this;
      let row = this.getSelectRow();
      this.$commonUtil.getDetailEntity(
        "whsout/getWhsoutDetailInfoByMainId",
        { id: row.id, mainId: row.id, bizType: 2, bizId: row.id },
        row,
        function(entity) {
          _this.$refs.print.printDiv(entity);
        }
      );
    },
    queryData: function(data) {
      var $this = this;
      //1.查询时先获取所有的数据
      this.getData(data => {
        $this.totalData = data.content;
        //2.触发查询
        $this.$refs.pager.refreshData();
      });
    },
    getList: function(page, size) {
      var table = this;
      this.getData(data => {
        table.dataSource = data.content;
        table.totalSize = data.total;
      },page,size);
    },
    //打开创建入库单 tab页
    addTab: function() {
      var $this = this;
      var entity = {};
      entity.editFlag = "3";
      const outItem = {
        component: noteWhsOutEdit,
        propsData: { entity: entity, parentView: $this },
        name: "添加出库单"
      };
      this.$tab.open(outItem);
    },
    //打开编辑出库单 tab页
    editTab: function(row, event) {
      var $this = this;
      this.$commonUtil.getEntityNoPageWithFileOut(
        "whsout/getOutInfoByMainId",
        "whsout/getWhsoutDetailInfoByMainId",
        "file/getFileItemInfo",
        { id: row.id, mainId: row.id, bizType: 2, bizId: row.id },
        function(entity) {
          entity.editFlag = "1";
          $this.$tab.open({
            component: noteWhsOutEdit,
            name: "编辑出库单[" + row.whsoutNo + "]",
            propsData: { key: row.id, entity, parentView: $this }
          });
        }
      );
    },
    //打开调整出库单 tab页
    adjustTab: function() {
      var $this = this;
      let row = this.getSelectRow();
      if (row.status != 2) {
        this.$message({
          message: "只能调整已出库的单据",
          type: "fail"
        });
        return;
      }
      this.$commonUtil.getEntityNoPageWithFileOut(
        "whsout/getOutInfoByMainId",
        "whsout/getWhsoutDetailInfoByMainId",
        "file/getFileItemInfo",
        { id: row.id, mainId: row.id, bizType: 2, bizId: row.id },
        function(entity) {
          entity.editFlag = "2";
          $this.$tab.open({
            component: noteWhsOutEdit,
            name: "调整出库单[" + row.whsoutNo + "]",
            propsData: { key: row.id, entity, parentView: $this }
          });
        }
      );
    },
    //作废数据
    deleteInfo() {
      //获取当前选中数据id
      let row = this.getSelectRow();
      if (row.status != 1) {
        this.$message({
          message: "只能作废待出库状态的单据！",
          type: "fail"
        });
        return;
      }
      let table = this;
      //发送请求删除数据
      this.$confirm("确认作废选中的出库单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        httpUtil.post("whsout/deleteOutInfo", row, data => {
          this.$message({
            message: "作废出库单成功",
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
          message: "只能出库待出库状态的单据！",
          type: "fail"
        });
        return;
      }
      let table = this;
      //发送请求审核数据
      this.$confirm("确认出库选中的出库单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        httpUtil.post("whsout/getWhsoutDetailInfoByMainId", row, data => {
          row.detail = data;
          var param = commonUtil.deepClone(row);
          param.status = 2;
          httpUtil.post("whsout/stockOutInfo", param, data => {
            this.$message({
              message: "出库成功",
              type: "success"
            });
            table.queryData();
          });
        });
      });
    },
    /**
     * 获取所有的查询数据
     */
    getData(callback,page,size) {
      var param = this.$refs.pm_search.getParam();
      this.$commonUtil.handler.packNoHander(param);
      param.page = page || 0;
      param.size = size || 100000;
      httpUtil.post("whsout/getWhOutfoBypage", param, data => {
        if (callback) {
          callback(data);
        }
      });
    },
    /**
     * 导出方法
     */
    exportFunc() {
      var $this = this;
      this.getData(data => {
        //获取表单的信息
        var table = $this.$refs.pmTable;
        $this.$commonUtil.cloudExport($this, data.content, table, "出库单列表");
      });
    },
    settleInfo() {
      var $this = this;
      let selectRow = this.getSelectRow();
      var entity = this.$commonUtil.deepClone(selectRow);
      entity.cstId = entity.cstId;
      entity.businessNo = entity.whsoutNo;
      entity.detailList = this.dataSource;
      selectRow.mainId = selectRow.id;
      httpUtil.post("whsout/getWhsoutDetailInfoByMainId", selectRow, data => {
        entity.detailList = data;
        $this.wrapData(entity);
        const costBalanceItem = {
          component: costBalanceAddManage,
          propsData: { entity: entity },
          name: "新增结算单"
        };
        $this.$tab.open(costBalanceItem);
      });
    },
    wrapData(entity) {
      entity.businessNo = entity.whsoutNo;
      entity.cstId = entity.cstId;
      entity.businessType = 2;
      entity.createDate = entity.createTime;
      entity.creatorData = entity.creator;
      if (!entity.detailList) {
        return;
      }
      entity.detailList.forEach(element => {
        element.material = element.textureId;
        element.productPlace = element.producingId;
        element.businessNo = element.whsoutNo;
        //element.transferDate = element.transferTime;
        element.whsInFirstDate = element.whsinTime;
        element.createDate = element.createTime;
        element.numFin = element.number;
        if (!element.transferTimes) {
          element.transferNum = 0;
        } else {
          element.transferNum = element.transferTimes;
        }
        element.businessType = 1;
        element.costDate = element.costTime;
      });
      entity.detail = entity.detailList;
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

<style scoped>
</style>
