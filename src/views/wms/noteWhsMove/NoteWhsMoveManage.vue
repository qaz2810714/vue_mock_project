<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :entity="$metaData.wmsMove"
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
            btnName="审核"
            btnPermission="btn_check"
            btnIcon="el-icon-circle-check-outline"
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
          tableKey="NoteWhsMoveManage-pmTable"
          :reload="afterSetting"
          v-if="reload"
          :dataSource="dataSource"
          :totalData="totalData"
          :config="config"
        >
          <pm_column prop="moveNo" label="移库单号" width="110"></pm_column>
          <pm_column prop="moveStatus" label="移库状态" width="100"></pm_column>
          <pm_column prop="whsShortName" label="仓库简称" width="100"></pm_column>
          <pm_column prop="totalAmout" label="总数量" width="90"></pm_column>
          <pm_column prop="totalNetWeight" label="总净重" width="100"></pm_column>
          <pm_column prop="totalGrossWeight" label="总毛重" width="100"></pm_column>
          <pm_column prop="totalPoundWeight" label="总磅重" width="100"></pm_column>
          <pm_column prop="transceiver" label="收发人" width="110"></pm_column>
          <pm_column prop="createTime" label="制单时间" width="150"></pm_column>
          <pm_column prop="creatorName" label="制单人" width="110"></pm_column>
          <pm_column prop="modifyTime" label="修改时间" width="140"></pm_column>
          <pm_column prop="modifierName" label="修改人" width="110"></pm_column>
          <pm_column prop="remark" label="备注" width="200"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getList"></pm_pagination>
      </metro_page_box_body>
    </metro_page_box>
    <noteWhsMovePrint ref="print" v-show="false"></noteWhsMovePrint>
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
import noteWhsMoveEdit from "./NoteWhsMoveEdit";
import commonUtil from "@/common/utils/CommonUtils";
import costBalanceAddManage from "@/views/cost/costBalanceAdd/CostBalanceAddManage";
import printJS from "print-js";
import noteWhsMovePrint from "./NoteWhsMovePrint";
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
    noteWhsMovePrint
  },
  data: function() {
    return {
      dataSource: [],
      totalData: null,
      config: {
        entity: metadata.wmsMove,
        allowEdit: false,
        multiple: false,
        dbclick: this.editTab,
        rowCanEdit: function(obj) {
          if (obj.cstName == null) return false;
          return obj.cstName.includes("江阴");
          return false;
        }
      },
      totalSize: 0,
      // 搜索区域条件
      searchFields: [
        {
          displayName: "移库单号",
          fieldName: "moveNo",
          xtype: "text",
          searchLoc: "1-1-6-8-0"
        },
        {
          displayName: "货主单位",
          fieldName: "cstId",
          xtype: "search_select_input",
          searchLoc: "1-2-6-8-0"
        },
        {
          displayName: "卡号",
          fieldName: "cardNo",
          xtype: "text",
          searchLoc: "1-3-6-8-0"
        },
        {
          displayName: "品名",
          fieldName: "brandId",
          xtype: "search_select_input",
          searchLoc: "1-4-6-8-0"
        },
        {
          displayName: "材质",
          fieldName: "textureId",
          xtype: "search_select_input",
          searchLoc: "2-1-6-8-0",
          watchField: "brandId"
        },
        {
          displayName: "规格",
          fieldName: "spec",
          xtype: "text",
          searchLoc: "2-2-6-8-0"
        },
        {
          displayName: "产地",
          fieldName: "producingId",
          xtype: "search_select_input",
          searchLoc: "2-3-6-8-0"
        },
        {
          displayName: "创建时间",
          fieldName: "createTime",
          xtype: "datetimerange",
          searchLoc: "3-1-12-4-0",
          dateBegin: "createTimeStart",
          dateEnd: "createTimeEnd"
        },
        {
          displayName: "移库状态",
          fieldName: "moveStatus",
          xtype: "select",
          searchLoc: "2-4-6-8-0"
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
        "whsmove/getMoveDetailByMainId",
        { moveMainId: row.id },
        row,
        function(entity) {
          _this.$refs.print.printDiv(entity);
        }
      );
    },
    getList: function(page, size) {
      var table = this;
      this.getData(data => {
        table.dataSource = data.content;
        table.totalSize = data.total;
      },page,size);
    },
    queryData: function() {
      var $this = this;
      //1.查询时先获取所有的数据
      this.getData(data => {
        $this.totalData = data.content;
        //2.触发查询
        $this.$refs.pager.refreshData();
      });
    },
    //打开创建移库单 tab页
    addTab: function() {
      var entity = {};
      entity.editFlag = "3";
      const moveItem = {
        component: noteWhsMoveEdit,
        propsData: { entity: entity, parentView: this },
        name: "添加移库单"
      };
      this.$tab.open(moveItem);
    },
    //打开编辑移库单 tab页
    editTab: function(row, event, editFlag) {
      var $this = this;
      this.$commonUtil.getEntityNoPage(
        "whsmove/getMoveInfoByMainId",
        "whsmove/getMoveDetailByMainId",
        { id: row.id, moveMainId: row.id },
        function(entity) {
          entity.editFlag = "1";
          var titleHead = "编辑";
          if (entity.moveStatus == 2) {
            //移库完成
            titleHead = "查看";
          }
          if (entity.transceiver) {
            entity.transceiver = entity.transceiver.split(",");
            for (let i = 0; i < entity.transceiver.length; i++) {
              entity.transceiver[i] = parseInt(entity.transceiver[i]);
            }
          }
          $this.$tab.open({
            component: noteWhsMoveEdit,
            name: titleHead + "移库单[" + row.moveNo + "]",
            propsData: { key: row.id, entity, parentView: $this }
          });
        }
      );
    },
    //打开调整移库单 tab页
    adjustTab: function() {
      var $this = this;
      let row = this.getSelectRow();
      if (row.moveStatus != 2) {
        this.$message({
          message: "只能调整已移库的单据!",
          type: "fail"
        });
        return;
      }
      this.$commonUtil.getEntityNoPage(
        "whsmove/getMoveInfoByMainId",
        "whsmove/getMoveDetailByMainId",
        { id: row.id, moveMainId: row.id },
        function(entity) {
          entity.editFlag = "2";
          if (entity.transceiver) {
            entity.transceiver = row.transceiver.split(",");
            for (let i = 0; i < entity.transceiver.length; i++) {
              entity.transceiver[i] = parseInt(entity.transceiver[i]);
            }
          }
          $this.$tab.open({
            component: noteWhsMoveEdit,
            name: "调整移库单[" + row.moveNo + "]",
            propsData: { key: row.id, entity, parentView: $this }
          });
        }
      );
    },
    //作废数据
    deleteInfo() {
      //获取当前选中数据id
      let row = this.getSelectRow();
      if (row.moveStatus != 1) {
        this.$message({
          message: "只能作废待移库状态的单据!",
          type: "fail"
        });
        return;
      }
      let table = this;
      //发送请求删除数据
      this.$confirm("确认作废选中的移库单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        httpUtil.post("whsmove/deleteMoveInfo", row, data => {
          this.$message({
            message: "作废移库单成功",
            type: "success"
          });
          table.queryData();
        });
      });
    },
    auditInfo() {
      //获取当前选中数据id
      let row = this.getSelectRow();
      if (row.moveStatus != 1) {
        this.$message({
          message: "只能审核待移库状态的单据!",
          type: "fail"
        });
        return;
      }
      let table = this;
      //发送请求审核数据
      this.$confirm("确认审核选中的移库单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        httpUtil.post("whsmove/auditMoveInfo", row, data => {
          this.$message({
            message: "审核移库单成功",
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
      param.page = page || 0;
      param.size = size || 100000;
      httpUtil.post("whsmove/getWhsmoveInfoBypage", param, data => {
        if (callback) {
          callback(data);
        }
      });
    },
    exportFunc() {
      var $this = this;
      this.getData(data => {
        //获取表单的信息
        var table = $this.$refs.pmTable;
        $this.$commonUtil.cloudExport($this, data.content, table, "移库单列表");
      });
    },
    settleInfo() {
      var $this = this;
      let selectRow = this.getSelectRow();
      if (selectRow.moveStatus != 2) {
        this.$message({
          message: "只能结算已移库状态的单据！",
          type: "fail"
        });
        return;
      }
      var entity = this.$commonUtil.deepClone(selectRow);
      selectRow.moveMainId = selectRow.id;
      httpUtil.post("whsmove/getMoveDetailByMainId", selectRow, data => {
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
      entity.businessNo = entity.moveNo;
      entity.cstId = entity.cstId;
      entity.businessType = 3;
      entity.createDate = entity.createTime;
      entity.creatorData = entity.creator;
      if (!entity.detailList) {
        return;
      }
      entity.detailList.forEach(element => {
        element.material = element.textureId;
        element.productPlace = element.producingId;
        element.businessNo = element.moveNo;
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
