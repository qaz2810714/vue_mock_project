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
          :hasPackNoSearch="true"
          :packRowHeight="3"
          :fields="searchFields"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
        <pm_tool_bar>
          <pm_toolButton
            ref="addBtn"
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
          <pm_column prop="whsinCode" label="入库单号" width="112"></pm_column>
          <pm_column prop="cstName" label="货主单位" width="180"></pm_column>
          <pm_column prop="whsinType" label="入库方式" width="100"></pm_column>
          <pm_column prop="auditorName" label="审核人" width="120"></pm_column>
          <pm_column prop="creatorName" label="制单人" width="120"></pm_column>
          <pm_column prop="billAttachmentId" label="入库通知单号" width="120"></pm_column>
          <pm_column prop="createTime" label="制单日期" width="150"></pm_column>
          <pm_column prop="status" label="单据状态" width="95"></pm_column>
          <pm_column prop="totalAmount" label="总数量" width="100"></pm_column>
          <pm_column prop="totalNetWeight" label="总净重" width="100"></pm_column>
          <pm_column prop="totalGrossWeight" label="总毛重" width="100"></pm_column>
          <pm_column prop="totalPoundWeight" label="总磅重" width="100"></pm_column>
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
import noteWhsInEdit from "./NoteWhsInEdit";
import commonUtil from "@/common/utils/CommonUtils";
import printJS from "print-js";
import pm_context_menu from "@/components/common/menu/pm_context_menu";
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
  },
  data: function() {
    return {
      dataSource: [],
      totalData: null,
      config: {
        entity: metadata.wmsIn,
        allowEdit: false,
        multiple: false,
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
          fieldName: "whsinCode",
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
          searchLoc: "2-1-6-8-0"
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
          displayName: "入库库区",
          fieldName: "whsRoomId",
          xtype: "tree_select",
          searchLoc: "2-4-6-8-0",
          extQuryParam: { whsRoomId: "whsRoomId", whsAreaId: "whsAreaId" }
        },
        {
          displayName: "入库方式",
          fieldName: "whsinType",
          xtype: "select",
          searchLoc: "3-1-6-8-0"
        },
        {
          displayName: "创建时间",
          fieldName: "createTime",
          xtype: "datetimerange",
          searchLoc: "3-3-12-4-0",
          dateBegin: "createTimeStart",
          dateEnd: "createTimeEnd"
        },
        {
          displayName: "单据状态",
          fieldName: "status",
          xtype: "select",
          searchLoc: "3-2-6-8-0"
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
      this.$commonUtil.getDetailEntity(
        "whsin/getInDetailByMainId",
        { whsinMainId: row.id },
        row,
        function(entity) {
          _this.$refs.print.printDiv(entity);
        }
      );
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
    getList: function(page, size) {
      var table = this;
      this.getData(data => {
        table.dataSource = data.content;
        table.totalSize = data.total;
      },page,size);
    },
    //打开创建入库单 tab页
    addTab: function() {
      var entity = {};
      entity.editFlag = "3";
      const inItem = {
        component: noteWhsInEdit,
        propsData: { entity: entity, parentView: this },
        name: "添加入库单"
      };
      this.$tab.open(inItem);
    },
    //打开编辑入库单 tab页
    editTab: function(row, event) {
      var $this = this;
      this.$commonUtil.getEntityNoPageWithFile(
        "whsin/getInInfoByMainId",
        "whsin/getInDetailByMainId",
        "file/getFileItemInfo",
        { id: row.id, whsinMainId: row.id, bizType: 1, bizId: row.id },
        function(entity) {
          var titleHead = "编辑";
          if (entity.moveStatus == 2) {
            //入库完成
            titleHead = "查看";
          }
          entity.editFlag = "1";
          $this.$tab.open({
            component: noteWhsInEdit,
            name: titleHead + "入库单[" + row.whsinCode + "]",
            propsData: { key: row.id, entity, parentView: $this }
          });
        }
      );
    },
    //打开调整入库单 tab页
    adjustTab: function() {
      var $this = this;
      let row = this.getSelectRow();
      if (row.status != 2) {
        this.$message({
          message: "只能调整已入库的单据!",
          type: "fail"
        });
        return;
      }
      this.$commonUtil.getEntityNoPageWithFile(
        "whsin/getInInfoByMainId",
        "whsin/getInDetailByMainId",
        "file/getFileItemInfo",
        { id: row.id, whsinMainId: row.id, bizType: 1, bizId: row.id },
        function(entity) {
          entity.editFlag = "2";
          $this.$tab.open({
            component: noteWhsInEdit,
            name: "调整入库单[" + row.whsinCode + "]",
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
      param.page = page || 0;
      param.size = size || 100000;
      let data ={
        'content':[
          {

          }
        ]
      }
      httpUtil.post("whsin/getWhsinInfoBypage", param, data => {
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
        $this.$commonUtil.cloudExport($this, data.content, table, "入库单列表");
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
