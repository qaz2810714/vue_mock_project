<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :btnOffset="10"
          :packNoSearchSpan="6"
          :hasPackNoSearch="true"
          :packRowHeight="5"
          :fields="searchFields"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
        <pm_tool_bar>
          <pm_toolButton btnName="导出" btnIcon="el-icon-document" :btnClickFunc="exportFunc"></pm_toolButton>
        </pm_tool_bar>
      </metro_page_box_body>
    </metro_page_box>

    <!-- 数据展示区域 -->
    <metro_page_box>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table
          ref="pmTable"
          tableKey="NoteWhsOutGrid-pmTable"
          :reload="afterSetting"
          v-if="reload"
          :dataSource="dataSource"
          :totalData="totalData"
          :config="config"
        >
          <pm_column prop="whsoutNo" label="出库单号" width="120">
            <a
              href="javascript:void(0);"
              slot-scope="scope"
              @click="editTab(scope.row)"
            >{{scope.row.whsoutNo}}</a>
          </pm_column>
          <pm_column prop="remarkMain" label="主档备注" width="197"></pm_column>
          <pm_column prop="cstName" label="货主单位" width="180"></pm_column>
          <pm_column prop="deliveryName" label="提货单位" width="180"></pm_column>
          <pm_column prop="vehicleNumber" label="提货车牌号" width="120"></pm_column>
          <pm_column prop="status" label="出库状态" width="100"></pm_column>
          <pm_column prop="cstPackNo" label="卡号" width="120"></pm_column>
          <pm_column prop="packNo" label="捆包号" width="140"></pm_column>
          <pm_column prop="brandId" label="品名" width="120"></pm_column>
          <pm_column prop="textureId" label="材质" width="120"></pm_column>
          <pm_column prop="spec" label="规格" width="120"></pm_column>
          <pm_column prop="producingId" label="产地" width="120"></pm_column>
          <pm_column prop="calcType" label="计重方式" width="95"></pm_column>
          <pm_column prop="measurementUnit" label="数量单位" width="95"></pm_column>
          <pm_column prop="number" label="数量" width="100"></pm_column>
          <pm_column prop="netWeight" label="净重" width="100"></pm_column>
          <pm_column prop="grossWeight" label="毛重" width="100"></pm_column>
          <pm_column prop="poundWeight" label="磅重" width="100"></pm_column>
          <pm_column prop="unitNumber" label="单包支数" width="100"></pm_column>
          <pm_column prop="whsCalcStackId" label="库区" width="140"></pm_column>
          <pm_column prop="stackName" label="库位" width="100"></pm_column>
          <pm_column prop="costDays" label="仓储天数" width="100"></pm_column>
          <pm_column prop="transferTimes" label="过户次数" width="100"></pm_column>
          <pm_column prop="costTime" label="货主入库时间" width="140"></pm_column>
          <pm_column prop="floorNum" label="层数" width="90"></pm_column>
          <pm_column prop="slinger" label="吊机工" width="90"></pm_column>
          <pm_column prop="whsManager" label="仓管" width="90"></pm_column>
          <pm_column prop="whsinTime" label="首入库日期" width="140"></pm_column>
          <pm_column prop="transceiver" label="收发人" width="100"></pm_column>
          <pm_column prop="stoveCode" label="炉号" width="100"></pm_column>
          <pm_column prop="remark" label="明细备注" width="200"></pm_column>
          <pm_column prop="manufactureTime" label="出厂日期" width="140"></pm_column>
          <pm_column prop="createTime" label="制单时间" width="140"></pm_column>
          <pm_column prop="creatorName" label="制单人" width="110"></pm_column>
          <pm_column prop="packType" label="包装方式" width="100"></pm_column>
          <pm_column prop="packDesc" label="包装描述" width="150"></pm_column>
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
import noteWhsOutEdit from "./NoteWhsOutEdit";
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
    pm_pagination
  },
  data: function() {
    return {
      dataSource: [],
      totalData: null,
      config: {
        entity: metadata.whsOut,
        allowEdit: false,
        multiple: false
      },
      totalSize: 0,
      // 搜索区域条件
      searchFields: [
        {
          displayName: "出库单号",
          fieldName: "whsoutNo",
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
          displayName: "净重",
          fieldName: "netWeight",
          xtype: "number",
          searchLoc: "2-4-6-8-0"
        },
        {
          displayName: "毛重",
          fieldName: "grossWeight",
          xtype: "number",
          searchLoc: "3-1-6-8-0"
        },
        {
          displayName: "磅重",
          fieldName: "poundWeight",
          xtype: "number",
          searchLoc: "3-2-6-8-0"
        },
        {
          displayName: "库位",
          fieldName: "whsRoomId",
          xtype: "text",
          searchLoc: "3-3-6-8-0"
        },
        {
          displayName: "炉号",
          fieldName: "stoveCode",
          xtype: "text",
          searchLoc: "3-4-6-8-0"
        },
        {
          displayName: "提货车牌号",
          fieldName: "vehicleNumber",
          xtype: "search_select_input",
          searchLoc: "4-1-6-8-0"
        },
        {
          displayName: "首入库日期",
          fieldName: "whsinTime",
          xtype: "date",
          searchLoc: "4-2-6-8-0"
        },
        {
          displayName: "创建时间",
          fieldName: "createTime",
          xtype: "datetimerange",
          searchLoc: "4-3-12-4-0",
          dateBegin: "createTimeStart",
          dateEnd: "createTimeEnd"
        }
      ],
      searchParam: {}
    };
  },
  methods: {
    queryData: function(data) {
      this.searchParam = data;
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
    //打开编辑出库单 tab页
    editTab: function(row, event) {
      var $this = this;
      this.$commonUtil.getEntityNoPageWithFileOut(
        "whsout/getOutInfoByMainId",
        "whsout/getWhsoutDetailInfoByMainId",
        "file/getFileItemInfo",
        { id: row.mainId, mainId: row.mainId, bizType: 2, bizId: row.mainId },
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
    /**
     * 获取所有的查询数据
     */
    getData(callback,page,size) {
      var param = this.$refs.pm_search.getParam();
      this.$commonUtil.handler.packNoHander(param);
      param.page = page || 0;
      param.size = size || 100000;
      httpUtil.post("whsout/getOutDetailByPage", param, data => {
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
        $this.$commonUtil.cloudExport($this, data.content, table, "出库单台账列表");
      });
    }
  }
};
</script>