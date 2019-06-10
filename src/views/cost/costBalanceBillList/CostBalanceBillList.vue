<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <pm_search
          ref="pm_search"
          :btnOffset="10"
          :packRowHeight="3"
          :packNoSearchSpan="6"
          :hasPackNoSearch="true"
          :fields="searchFields"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
      </metro_page_box_body>
    </metro_page_box>
    <!-- 数据展示区域 -->
    <metro_page_box>
      <pm_tool_bar>
        <pm_toolButton btnName="结算" btnIcon="el-icon-sold-out" :btnClickFunc="settle"></pm_toolButton>
        <pm_toolButton btnName="结案" btnIcon="el-icon-document" :btnClickFunc="closeCase"></pm_toolButton>
        <pm_toolButton btnName="作废" btnIcon="el-icon-error" :btnClickFunc="remove"></pm_toolButton>
      </pm_tool_bar>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <!-- table结构展示 -->
        <pm_table
          ref="pmTable"
          tableKey="CostBalanceBillList-pmTable"
          :reload="afterSetting"
          v-if="reload"
          :dataSource="dataSource"
          :totalData="totalData"
          :config="config"
        >
          <pm_column prop="businessNo" label="业务单据号" width="130"></pm_column>
          <pm_column prop="packNo" label="捆包号" width="150"></pm_column>
          <pm_column prop="cstId" label="货主单位" width="200"></pm_column>
          <pm_column prop="costType" label="费用类型" width="100"></pm_column>
          <pm_column prop="balanceStatus" label="计费单状态" width="110"></pm_column>
          <pm_column prop="whsDayNum" label="仓储天数" width="100"></pm_column>
          <pm_column prop="whsFreeDayNum" label="免仓储天数" width="110"></pm_column>
          <pm_column prop="transferNum" label="过户次数" width="95"></pm_column>
          <pm_column prop="balanceNum" label="已结算量" width="120"></pm_column>
          <pm_column prop="balancePreNum" label="待结算量" width="120"></pm_column>
          <pm_column prop="unitprice" label="结算单价" width="95"></pm_column>
          <pm_column prop="regularUnit" label="计费单位" width="95"></pm_column>
          <pm_column prop="amtMoney" label="应结金额" width="130"></pm_column>
          <pm_column prop="numFin" label="商品件数" width="100"></pm_column>
          <pm_column prop="netWeight" label="商品净重" width="130"></pm_column>
          <pm_column prop="grossWeight" label="商品毛重" width="120"></pm_column>
          <pm_column prop="poundWeight" label="商品磅重" width="120"></pm_column>
          <pm_column prop="businessType" label="业务类型" width="100"></pm_column>
          <pm_column prop="createTime" label="计费单生成时间" width="132"></pm_column>
          <pm_column prop="dataSource" label="数据来源" width="100"></pm_column>
          <pm_column prop="regularDetailNo" label="计费规则明细单号" width="148"></pm_column>
          <pm_column prop="oriPackNo" label="原捆包号" width="150"></pm_column>
          <pm_column prop="cardNo" label="卡号" width="150"></pm_column>
          <pm_column prop="brandId" label="品名" width="130"></pm_column>
          <pm_column prop="textureId" label="材质" width="120"></pm_column>
          <pm_column prop="spec" label="规格" width="120"></pm_column>
          <pm_column prop="producingId" label="产地" width="100"></pm_column>
          <pm_column prop="whsInFirstDate" label="入库日期" width="100"></pm_column>
          <pm_column prop="transferDate" label="过户日期" width="100"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getBalanceList"></pm_pagination>
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
import commonUtil from "@/common/utils/CommonUtils";
import metadata from "@/common/entities/Metadata";
import pm_pagination from "@/components/common/table/pm_pagination";
import costBalanceManage from "@/views/cost/costBalanceManage/CostBalanceManage";
import CostBalanceManageVue from "../costBalanceManage/CostBalanceManage.vue";
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
        entity: metadata.regular,
        allowEdit: false,
        multiple: true
      },
      totalSize: 0,
      // 搜索区域条件
      searchFields: [
        {
          displayName: "费用类型",
          fieldName: "costType",
          xtype: "select",
          searchLoc: "1-1-8-8-0"
        },
        {
          displayName: "业务类型",
          fieldName: "businessType",
          xtype: "select",
          searchLoc: "1-2-8-8-0"
        },
        {
          displayName: "单据号",
          fieldName: "businessNo",
          xtype: "text",
          searchLoc: "1-3-8-8-0"
        },
        {
          displayName: "货主单位",
          fieldName: "cstId",
          xtype: "search_select_input",
          searchLoc: "2-1-8-8-0"
        },
        {
          displayName: "品名",
          fieldName: "brandId",
          xtype: "search_select_input",
          searchLoc: "2-2-8-8-0"
        },
        {
          displayName: "状态",
          fieldName: "balanceStatus",
          xtype: "select",
          searchLoc: "2-3-8-8-0"
        },
        {
          displayName: "创建时间",
          fieldName: "createTime",
          xtype: "datetimerange",
          searchLoc: "3-3-16-4-0"
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
    getBalanceList: function(page, size) {
      var table = this;
      this.getData(
        data => {
          table.dataSource = data.content;
          table.totalSize = data.total;
        },
        page,
        size
      );
    },
    /**
     * 获取所有的查询数据
     */
    getData(callback, page, size) {
      var param = this.$refs.pm_search.getParam();
      param.page = page || 0;
      param.size = size || 100000;
      param.createDateStart = param.createTimeBegin;
      param.createDateEnd = param.createTimeEnd;
      httpUtil.post("BalanceList/queryBalanceList", param, data => {
        data.content.forEach(a => {
          a.textureId = a.material;
          a.producingId = a.productPlace;
          if (a.costType == 1) {
            a.amtMoney =
              a.balancePreNum * a.unitprice * (a.whsDayNum - a.whsFreeDayNum);
          } else {
            a.amtMoney = a.balancePreNum * a.unitprice;
          }
          if (a.transferNum == undefined) {
            a.transferNum = 0;
          }
        });
        if (callback) {
          callback(data);
        }
      });
    },
    settle: function() {
      var selectItems = this.$refs.pmTable.getSelectedRows();
      var cstId;
      var oldCstId;
      if (selectItems.length === 0) {
        this.$message.error("请至少选择一笔资料");
        return;
      }
      for (var i = 0; i < selectItems.length; i++) {
        if (i === 0) {
          oldCstId = selectItems[i].cstId;
        }
        if (oldCstId != selectItems[i].cstId) {
          commonUtil.valid.throwEx("请选择相同货主的计费单资料");
        }
        if (selectItems[i].balanceStatus != 1) {
          commonUtil.valid.throwEx("请选择待结算的计费单资料！");
        }
        cstId = selectItems[i].cstId;
        selectItems[i].textureId = selectItems[i].material;
        selectItems[i].producingId = selectItems[i].productPlace;
      }
      var param = {};
      param.cstId = cstId;
      param.settleCompanyId = cstId;
      param.detailList = selectItems;
      const costBalanceItem = {
        component: costBalanceManage,
        parent: this,
        propsData: param,
        name: "新增结算单"
      };
      this.$tab.open(costBalanceItem);
    },
    closeCase: function() {
      var $this = this;
      var selectItems = this.$refs.pmTable.getSelectedRows();
      if (selectItems.length === 0) {
        this.$message.error("请至少选择一笔资料");
        return;
      }
      selectItems.forEach(item => {
        if (item.balanceStatus != 2) {
          commonUtil.valid.throwEx("只能结案已结算的计费单，请检查!");
        }
      });
      httpUtil.post("BalanceList/closeBalanceList", selectItems, data => {
        this.$message({
          message: "计费单结案成功",
          type: "success"
        });
        $this.queryData();
      });
    },
    remove: function() {
      var $this = this;
      var selectItems = this.$refs.pmTable.getSelectedRows();
      if (selectItems.length === 0) {
        this.$message.error("请至少选择一笔资料");
        return;
      }
      selectItems.forEach(item => {
        if (item.balanceStatus != 1) {
          commonUtil.valid.throwEx("只能作废待结算的计费单，请检查!");
        }
      });
      httpUtil.post("BalanceList/deleteBalanceList", selectItems, data => {
        this.$message({
          message: "计费单作废成功",
          type: "success"
        });
        $this.queryData();
      });
    }
  }
};
</script>