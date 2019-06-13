<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
          <pm_form :model="formModel" ref="inFrom" :entity='config.entity' v-bind:formReadOnly='formReadOnly'>
              <pm_form_item labletext="大文本框" name="textareaId" :span="6" xtype="textarea" lableWidth="90px" :rowHeight=3></pm_form_item>
              <pm_form_item labletext="文本类型" name="textId" :span="6" xtype="text" lableWidth="90px"></pm_form_item>
              <pm_form_item labletext="数字类型" name="numberId" :span="6" xtype="number" lableWidth="90px"></pm_form_item>
              <pm_form_item labletext="时间类型" name="dateId" :span="6" xtype="date" lableWidth="90px"></pm_form_item>
              <pm_form_item labletext="时间范围" name="daterangeId" :span="6" xtype="daterange" lableWidth="90px"></pm_form_item>
              <pm_form_item labletext="单选类型" name="selectId" :span="6" xtype="select" lableWidth="90px" :selectDataList="singleSelectData"></pm_form_item>
              <pm_form_item labletext="多选类型" name="selectBatchId" :span="6" xtype="select_batch" lableWidth="90px" :selectDataList="singleSelectData"></pm_form_item>
              <pm_form_item labletext="测试数据配置化" name="cstId" :span="6" xtype="search_select_input" lableWidth="130px"></pm_form_item>
              <pm_form_item labletext="测试数据配置化2" name="brandId" :span="6" xtype="select" lableWidth="135px"></pm_form_item>
              <pm_form_item labletext="复选框" name="checkboxGroupId" :span="6" xtype="checkbox_group" lableWidth="90px"></pm_form_item>
          </pm_form>
        <pm_tool_bar>
          <pm_toolButton
            ref="search"
            btnName="搜索"
            :btnClickFunc="queryData"
            btnIcon="el-icon-circle-plus-outline"
          ></pm_toolButton>
          <pm_toolButton
            ref="addBtn"
            btnName="新增"
            btnIcon="el-icon-circle-plus-outline"
          ></pm_toolButton>
           <!-- <pm_toolButton
              ref="viewQuality"
              btnName="维护质检信息"
              btnIcon="el-icon-circle-plus-outline"
              :btnClickFunc="viewQuality"
            ></pm_toolButton> -->
          <pm_toolButton
            btnName="作废"
            btnIcon="el-icon-delete"
            :btnClickFunc="deleteInfo"
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
        <pm_pagination ref="pager" :total="totalSize" :queryFunc="getList"></pm_pagination>
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
import pm_form from "@/components/common/form/pm_form";
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
import testEntity from "@/common/entities/entity";
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
    barCodePrint,
    pm_form
  },
  data: function() {
    return {
      dataSource: [],
      totalData: null,
      config: {
        entity: testEntity,
        allowEdit: false,
        multiple: true,
        dbclick: this.editTab,
      },
      totalSize: 0,
      formModel:Object,
      singleSelectData:Array
    };
  },
  mounted() {
    this.queryData();
  },
  created(){
    this.formModel = {};
    this.singleSelectData = [{key:1,value:"aaa"},{key:2,value:"bbb"}];
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
      // var param = JSON.parse(JSON.stringify())
      // this.$commonUtil.handler.packNoHander(param);
      let param = {};
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
