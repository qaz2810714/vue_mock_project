<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :entity="entity"
          :btnOffset="10"
          :packNoSearchSpan="6"
          :hasPackNoSearch="true"
          :packRowHeight="4"
          :fields="searchFields"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
        <pm_tool_bar>
          <pm_toolButton
            btnName="导出"
            btnPermission="btn_export"
            btnIcon="el-icon-document"
            :btnClickFunc="exportFunc"
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
          tableKey="NoteTransferGrid-pmTable"
          :reload="afterSetting"
          v-if="reload"
          :dataSource="dataSource"
          :totalData="totalData"
          :config="config"
        >
          <pm_column prop="transferNo" label="过户单号" width="120">
            <a
              href="javascript:void(0);"
              slot-scope="scope"
              @click="editTab(scope.row)"
            >{{scope.row.transferNo}}</a>
          </pm_column>
          <pm_column prop="cardNo" label="卡号" width="150"></pm_column>
          <pm_column prop="transferStatus" label="过户单状态" width="110"></pm_column>
          <pm_column prop="oldCstId" label="原货主" width="180"></pm_column>
          <pm_column prop="newCstId" label="新货主" width="180"></pm_column>
          <pm_column prop="mainRemark" label="主单备注" width="200"></pm_column>
          <pm_column prop="packNo" label="捆包号" width="120"></pm_column>
          <pm_column prop="whsinTime" label="首入库时间" width="140"></pm_column>
          <pm_column prop="brandId" label="品名" width="120"></pm_column>
          <pm_column prop="textureId" label="材质" width="120"></pm_column>
          <pm_column prop="spec" label="规格" width="120"></pm_column>
          <pm_column prop="producingId" label="产地" width="100"></pm_column>
          <pm_column prop="calcType" label="计量方式" width="100"></pm_column>
          <pm_column prop="poundWeight" label="磅重" width="120"></pm_column>
          <pm_column prop="measurementUnit" label="数量单位" width="100"></pm_column>
          <pm_column prop="amount" label="数量" width="70"></pm_column>
          <pm_column prop="unitNumber" label="单包支数" width="100"></pm_column>
          <pm_column prop="grossWeight" label="毛重" width="120"></pm_column>
          <pm_column prop="netWeight" label="净重" width="120"></pm_column>
          <pm_column prop="whsCalcStackId" label="库位号" width="110"></pm_column>
          <pm_column prop="manufactureTime" label="出厂日期" width="140"></pm_column>
          <pm_column prop="stoveCode" label="炉号" width="100"></pm_column>
          <pm_column prop="creatorName" label="制单人" width="120"></pm_column>
          <pm_column prop="createTime" label="制单时间" width="140"></pm_column>
          <pm_column prop="costTime" label="货主入库时间" width="140"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getTransferInfo"></pm_pagination>
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
import noteTransferEdit from "./NoteTransferEdit";
import httpUtil from "@/common/utils/HttpUtil";
import metadata from "@/common/entities/Metadata";
import pm_pagination from "@/components/common/table/pm_pagination";
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
  components: {
    metro_page,
    metro_page_box,
    metro_page_box_tool_bar,
    noteTransferEdit,
    metro_page_box_body,
    metro_pageheader,
    pm_search,
    pm_form_item,
    pm_toolButton,
    pm_tool_bar,
    pm_table,
    pm_column,
    pm_pagination
  },
  mixins: [tableReload],
  data: function() {
    return {
      dataSource: [],
      totalData: null,
      entity: metadata.wmsTransfer,
      config: {
        entity: metadata.wmsTransferDetail,
        allowEdit: false
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
          displayName: "炉号",
          fieldName: "stoveCode",
          xtype: "text",
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
          displayName: "净重",
          fieldName: "netWeight",
          xtype: "number",
          searchLoc: "3-2-6-8-0"
        },
        {
          displayName: "毛重",
          fieldName: "grossWeight",
          xtype: "number",
          searchLoc: "3-3-6-8-0"
        },
        {
          displayName: "磅重",
          fieldName: "poundWeight",
          xtype: "number",
          searchLoc: "3-4-6-8-0"
        },
        {
          displayName: "库位",
          fieldName: "whsCalcStackId",
          xtype: "tree_select",
          searchLoc: "4-1-6-8-0"
        },
        {
          displayName: "首入库时间",
          fieldName: "whsinTime",
          xtype: "date",
          searchLoc: "4-2-6-8-0"
        },
        {
          displayName: "制单时间",
          fieldName: "createTime",
          dateBegin: "createStartTime",
          dateEnd: "createEndTime",
          xtype: "datetimerange",
          searchLoc: "4-3-12-4-0"
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
    /**
     * 获取所有的查询数据
     */
    getData(callback,page,size) {
      var $this = this;
      var param = this.$refs.pm_search.getParam();
      this.$commonUtil.handler.packNoHander(param);
      param.page = page || 0;
      param.size = size || 100000;
      httpUtil.post("whsTransfer/getLedgerDetailByPage", param, data => {
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
        $this.$commonUtil.cloudExport($this, data.content, table, "过户单台账列表");
      });
    },
    //打开编辑入库单 tab页
    editTab: function(row, event) {
      let rowInfo = this.$commonUtil.deepClone(row);
      httpUtil.post("whsTransfer/getNoteByDetailId", rowInfo, data => {
        let openData = data;
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
          { id: openData.id },
          openData,
          function(entity) {
            $this.$tab.open({
              component: noteTransferEdit,
              name: titleName,
              propsData: { entity, parentView: $this }
            });
          }
        );
      });
    },
    getTransferInfo: function(page, size) {
      var _this = this;
      this.getData(data => {
        _this.dataSource = data.content;
        _this.totalSize = data.total;
      },page,size);
    }
  }
};
</script>

<style scoped>
</style>
