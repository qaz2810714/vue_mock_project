<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box class="search_partition">
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          :entity="config.entity"
          ref="pm_search"
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
            btnIcon="el-icon-edit"
            :btnClickFunc="deleteInfo"
          ></pm_toolButton>
          <pm_toolButton
            btnName="审核"
            btnPermission="btn_check"
            btnIcon="el-icon-document"
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
            btnIcon="el-icon-circle-check-outline"
            :btnClickFunc="settleInfo"
          ></pm_toolButton>
          <pm_toolButton
            btnName="导出"
            btnPermission="btn_export"
            btnIcon="el-icon-sold-out"
            :btnClickFunc="exportFunc"
          ></pm_toolButton>
          <pm_toolButton
            btnName="调整"
            btnPermission="btn_adjust"
            btnIcon="el-icon-sold-out"
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
          tableKey="NoteTransferManage-pmTable"
          :reload="afterSetting"
          v-if="reload"
          :dataSource="dataSource"
          :totalData="totalData"
          :config="config"
        >
          <pm_column prop="transferNo" label="过户单号" width="115"></pm_column>
          <pm_column prop="oldCstId" label="原货主" width="180"></pm_column>
          <pm_column prop="newCstId" label="新货主" width="180"></pm_column>
          <pm_column prop="creatorName" label="制单人" width="120"></pm_column>
          <pm_column prop="createTime" label="制单时间" width="140"></pm_column>
          <pm_column prop="totalAmount" label="总数量" width="100"></pm_column>
          <pm_column prop="transferStatus" label="过户单状态" width="115"></pm_column>
          <pm_column prop="totalNetWeight" label="总净重" width="100"></pm_column>
          <pm_column prop="totalGrossWeight" label="总毛重" width="100"></pm_column>
          <pm_column prop="totalPoundWeight" label="总磅重" width="100"></pm_column>
          <pm_column prop="remark" label="备注" width="200"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getTransferInfoByPage"></pm_pagination>
      </metro_page_box_body>
    </metro_page_box>
    <noteTransferPrint ref="print" v-show="false"></noteTransferPrint>
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
import commonUtil from "@/common/utils/CommonUtils";
import pm_pagination from "@/components/common/table/pm_pagination";
import noteTransferEdit from "./NoteTransferEdit";
import noteTransferPrint from "./NoteTransferPrint";
import costBalanceAddManage from "@/views/cost/costBalanceAdd/CostBalanceAddManage";
import printJS from "print-js";
const statusEnum = {
  STATUS_READY: 1, //已制单
  STATUS_SUCC: 2, //已过户
  STATUS_DELETE: 3 //已废弃
};
const operTypeEnum = {
  OPER_ADD: "1", //新增
  OPER_EDIT: "2", //修改
  OPER_ADJUST: "3", //调整
  OPER_CHECK: "4" //调整
};
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
    noteTransferPrint
  },
  data: function() {
    return {
      dataSource: [],
      totalData: null,
      config: {
        entity: metadata.wmsTransfer,
        allowEdit: false,
        multiple: false,
        dbclick: this.editTab
      },
      totalSize: 0,
      // 搜索区域条件
      searchFields: [
        {
          displayName: "过户单号",
          fieldName: "transferNo",
          xtype: "text",
          searchLoc: "1-1-6-8-0"
        },
        {
          displayName: "卡号",
          fieldName: "cardNo",
          xtype: "text",
          searchLoc: "1-2-6-8-0"
        },
        {
          displayName: "过户状态",
          fieldName: "transferStatus",
          xtype: "select",
          searchLoc: "1-3-6-8-0"
        },
        {
          displayName: "原货主",
          fieldName: "oldCstId",
          xtype: "search_select_input",
          searchLoc: "1-4-6-8-0"
        },
        {
          displayName: "现货主",
          fieldName: "newCstId",
          xtype: "search_select_input",
          searchLoc: "2-1-6-8-0"
        },
        {
          displayName: "规格",
          fieldName: "spec",
          xtype: "text",
          searchLoc: "2-2-6-8-0"
        },
        {
          displayName: "品名",
          fieldName: "brandId",
          xtype: "search_select_input",
          searchLoc: "2-3-6-8-0"
        },
        {
          displayName: "材质",
          fieldName: "textureId",
          xtype: "search_select_input",
          searchLoc: "2-4-6-8-0"
        },
        {
          displayName: "产地",
          fieldName: "producingId",
          xtype: "search_select_input",
          searchLoc: "3-1-6-8-0"
        },
        {
          displayName: "制单时间",
          fieldName: "createTime",
          dateBegin: "createStartTime",
          dateEnd: "createEndTime",
          xtype: "datetimerange",
          searchLoc: "3-2-12-4-0"
        }
      ]
    };
  },
  methods: {
    queryData: function() {
      var $this = this;
      //1.查询时先获取所有的数据
      this.getData(data => {
        $this.totalData = data.content;
        //2.触发查询
        $this.$refs.pager.refreshData();
      });
    },
    getTransferInfoByPage: function(page, size) {
      var _this = this;
      this.getData(data => {
        _this.dataSource = data.content;
        _this.totalSize = data.total;
      },page,size);
    },
    //打开创建移库单 tab页
    addTab: function() {
      var entity = {};
      entity.method = operTypeEnum.OPER_ADD;
      const addwin = {
        component: noteTransferEdit,
        propsData: { entity, parentView: this },
        name: "添加过户单"
      };
      this.$tab.open(addwin);
    },
    //进入编辑页面
    editTab: function(row, event) {
      let openData = this.$commonUtil.deepClone(row);
      let titleName = "";
      //编辑页面
      if (row.transferStatus == 1) {
        openData.method = operTypeEnum.OPER_EDIT;
        titleName = "编辑过户单[" + row.transferNo + "]";
      }
      //查看页面
      else if (row.transferStatus == 2) {
        openData.method = operTypeEnum.OPER_CHECK;
        titleName = "查看过户单[" + row.transferNo + "]";
      }
      var $this = this;
      this.$commonUtil.getDetailEntity(
        "whsTransfer/getTransferDetail",
        { id: row.id },
        openData,
        function(entity) {
          $this.$tab.open({
            component: noteTransferEdit,
            name: titleName,
            propsData: { entity, parentView: $this }
          });
        }
      );
    },
    //获取选中行
    getSelectRow() {
      let selectRow = this.$refs.pmTable.currentRow;
      if (!selectRow) {
        this.$commonUtil.valid.throwEx(this, "请先选择一条信息");
      }
      return selectRow;
    },

    adjustTab: function() {
      //获取选中行信息
      let selectRow = this.getSelectRow();
      if (selectRow.transferStatus != 2) {
        this.$alert("此条过户单还未审核！无法调整！", "提示");
        return;
      }
      var $this = this;
      this.$commonUtil.getDetailEntity(
        "whsTransfer/getTransferDetail",
        { id: selectRow.id },
        selectRow,
        function(entity) {
          entity.method = operTypeEnum.OPER_ADJUST;
          $this.$tab.open({
            component: noteTransferEdit,
            name: "调整过户单[" + entity.transferNo + "]",
            propsData: { entity, parentView: $this }
          });
        }
      );
    },
    //作废
    deleteInfo: function() {
      //获取选中行信息
      let selectRow = this.getSelectRow();
      if (selectRow.transferStatus != 1) {
        this.$alert("已审核的过户单无法被作废！", "提示");
        return;
      }
      let _this = this;
      this.$confirm("是否删除该条数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          httpUtil.post("whsTransfer/deleteTransferNote", selectRow, data => {
            this.$message({
              message: "作废成功！",
              type: "success"
            });
            _this.queryData();
          });
        })
        .catch(() => {
          return;
        });
    },
    //
    auditInfo() {
      //获取选中行信息
      let _this = this;
      let selectRow = this.$refs.pmTable.currentRow;
      if (!selectRow) {
        this.$alert("请先选择一条信息", "提示");
        return;
      }
      if (selectRow.transferStatus != 1) {
        this.$alert("已审核的过户单无法被再次审核", "提示");
        return;
      }
      this.$confirm("确认审核该条数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          httpUtil.post("whsTransfer/auditTransferNote", selectRow, data => {
            this.$message({
              message: "审核成功！",
              type: "success"
            });
            _this.queryData();
          });
        })
        .catch(() => {
          return;
        });
    },
    printInfo() {
      let _this = this;
      let row = this.getSelectRow();
      this.$commonUtil.getDetailEntity(
        "whsTransfer/getTransferDetail",
        { id: row.id },
        row,
        function(entity) {
          _this.$refs.print.printDiv(entity);
        }
      );
    },
    settleInfo() {
      let selectRow = this.getSelectRow();
      if (selectRow.transferStatus != 2) {
        this.$commonUtil.valid.throwEx(this, "此条过户单还未进行审核！");
      }
      var entity = this.$commonUtil.deepClone(selectRow);
      // entity.cstId=entity.oldCstId;
      // entity.businessNo=entity.transferNo;
      let _this = this;
      httpUtil.post("whsTransfer/getTransferDetail", selectRow, data => {
        entity.detailList = data;
        _this.wrapData(entity);
        //this.formModel.detailList=this.dataSource;
        const costBalanceItem = {
          component: costBalanceAddManage,
          propsData: { entity: entity },
          name: "新增结算单"
        };
        _this.$tab.open(costBalanceItem);
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
      httpUtil.post("whsTransfer/getTransferNoteByPage", param, data => {
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
        $this.$commonUtil.cloudExport($this, data.content, table, "过户单列表");
      });
    },
    wrapData(entity) {
      entity.businessNo = entity.transferNo;
      entity.cstId = entity.oldCstId;
      entity.businessType = 4;
      entity.createDate = entity.createTime;
      entity.creatorData = entity.creator;
      if (!entity.detailList) {
        return;
      }
      entity.detailList.forEach(element => {
        element.material = element.textureId;
        element.productPlace = element.producingId;
        element.businessNo = element.transferNo;
        element.transferDate = entity.auditTime;
        element.whsInFirstDate = element.whsinTime;
        element.createDate = element.createTime;
        element.numFin = element.amount;
        element.transferNum = element.transferTimes;
        element.businessType = 4;
        element.costDate = element.costTime;
      });
      entity.detail = entity.detailList;
    }
  }
};
</script>
<style>
</style>
