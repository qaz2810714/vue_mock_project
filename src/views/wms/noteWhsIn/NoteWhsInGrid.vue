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
          :packRowHeight="6"
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
          tableKey="NoteWhsInGrid-pmTable"
          :reload="afterSetting"
          v-if="reload"
          :dataSource="dataSource"
          :totalData="totalData"
          :config="config"
        >
          <pm_column prop="whsinCode" label="入库单号" width="120">
            <a
              href="javascript:void(0);"
              slot-scope="scope"
              @click="editTab(scope.row)"
            >{{scope.row.whsinCode}}</a>
          </pm_column>
          <pm_column prop="cardNo" label="卡号" width="90"></pm_column>
          <pm_column prop="status" label="单据状态" width="95"></pm_column>
          <pm_column prop="billAttachmentId" label="入库通知单号" width="120"></pm_column>
          <pm_column prop="hasFiles" label="是否有附件" width="120"></pm_column>
          <pm_column prop="remarkMain" label="主单备注" width="200"></pm_column>
          <pm_column prop="cstId" label="货主单位" width="200"></pm_column>
          <pm_column prop="whsinType" label="入库方式" width="95"></pm_column>
          <pm_column prop="packNo" label="捆包号" width="150"></pm_column>
          <pm_column prop="whsinTime" label="入库时间" width="140"></pm_column>
          <pm_column prop="brandId" label="品名" width="130"></pm_column>
          <pm_column prop="textureId" label="材质" width="100"></pm_column>
          <pm_column prop="spec" label="规格" width="120"></pm_column>
          <pm_column prop="producingId" label="产地" width="120"></pm_column>
          <pm_column prop="calcType" label="计重方式" width="100"></pm_column>
          <pm_column prop="measurementUnit" label="数量单位" width="100"></pm_column>
          <pm_column prop="amount" label="数量" width="80"></pm_column>
          <pm_column prop="netWeight" label="净重" width="100"></pm_column>
          <pm_column prop="grossWeight" label="毛重" width="100"></pm_column>
          <pm_column prop="poundWeight" label="磅重" width="100"></pm_column>
          <pm_column prop="unitNumber" label="单包支数" width="100"></pm_column>
          <pm_column prop="whsCalcStackId" label="入库库区" width="120"></pm_column>
          <pm_column prop="whsStackName" label="入库库位" width="100"></pm_column>
          <pm_column prop="whsLayer" label="入库层" width="100"></pm_column>
          <pm_column prop="manufactureTime" label="出厂时间" width="100"></pm_column>
          <pm_column prop="transportCode" label="车船号" width="90"></pm_column>
          <pm_column prop="transceiver" label="收发人" width="100"></pm_column>
          <pm_column prop="stoveCode" label="炉号" width="100"></pm_column>
          <pm_column prop="remark" label="备注" width="200"></pm_column>
          <pm_column prop="createTime" label="制单时间" width="150"></pm_column>
          <pm_column prop="creatorName" label="制单人" width="120"></pm_column>
          <pm_column prop="auditorName" label="审核人" width="120"></pm_column>
          <pm_column prop="auditTime" label="审核时间" width="150"></pm_column>
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
import commonUtil from "@/common/utils/CommonUtils";
import noteWhsInEdit from "./NoteWhsInEdit";
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
        entity: metadata.wmsIn,
        allowEdit: false,
        multiple: false
      },
      totalSize: 0,
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
          parentName: "whsRoomId",
          childName: "whsAreaId"
        },
        {
          displayName: "层",
          fieldName: "whsLayer",
          xtype: "number",
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
          displayName: "入库方式",
          fieldName: "whsinType",
          xtype: "select",
          searchLoc: "4-1-6-8-0",
          value: 1
        },
        {
          displayName: "单据状态",
          fieldName: "status",
          xtype: "select",
          searchLoc: "4-2-6-8-0",
          value: 2
        },
        {
          displayName: "炉号",
          fieldName: "stoveCode",
          xtype: "text",
          searchLoc: "4-3-6-8-0"
        },
        {
          displayName: "创建时间",
          fieldName: "createTime",
          xtype: "datetimerange",
          searchLoc: "5-2-12-4-0",
          dateBegin: "createTimeStart",
          dateEnd: "createTimeEnd"
        },
        {
          displayName: "入库时间",
          fieldName: "whsinTime",
          xtype: "datetimerange",
          searchLoc: "5-1-12-4-0",
          dateBegin: "whsinTimeStart",
          dateEnd: "whsinTimeEnd"
        },
        {
          displayName: "车船号",
          fieldName: "transportCode",
          xtype: "text",
          searchLoc: "4-4-6-8-0"
        }
      ]
    };
  },
  methods: {
    btn_func_search: function() {},
    btn_func_reset: function() {},
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
    //打开编辑入库单 tab页
    editTab: function(row, event) {
      var $this = this;
      this.$commonUtil.getEntityNoPageWithFile(
        "whsin/getInInfoByMainId",
        "whsin/getInDetailByMainId",
        "file/getFileItemInfo",
        {
          id: row.whsinMainId,
          whsinMainId: row.whsinMainId,
          bizType: 1,
          bizId: row.whsinMainId
        },
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
    /**
     * 获取所有的查询数据
     */
    getData(callback,page,size) {
      var param = this.$refs.pm_search.getParam();
      this.$commonUtil.handler.packNoHander(param);
      param.page = page || 0;
      param.size = size || 100000;
      this.$httpUtil.post("whsin/getInDetailByPage", param, data => {
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
        $this.$commonUtil.cloudExport($this, data.content, table, "入库单台账列表");
      });
    }
  }
};
</script>

<style scoped>
</style>
