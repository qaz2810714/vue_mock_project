<template>
  <metro_page>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="结算清单主档" name="main">
        <!-- 搜索条件区域 -->
        <metro_page_box>
          <metro_page_box_body>
            <pm_search
              ref="pm_search"
              :packRowHeight="8"
              :hasPackNoSearch="false"
              :fields="searchFields"
              v-on:getAllSearchParams="queryData"
            ></pm_search>
          </metro_page_box_body>
        </metro_page_box>
        <!-- 数据展示区域 -->
        <metro_page_box>
          <pm_tool_bar>
            <pm_toolButton
              ref="editInvoice"
              btnName="编辑发票号"
              btnIcon="el-icon-edit-outline"
              :btnClickFunc="editInvoice"
            ></pm_toolButton>
            <pm_toolButton ref="edit" btnName="修改结算单" btnIcon="el-icon-edit" :btnClickFunc="edit"></pm_toolButton>
            <pm_toolButton
              ref="remove"
              btnName="作废结算单"
              btnIcon="el-icon-error"
              :btnClickFunc="remove"
            ></pm_toolButton>
            <pm_toolButton ref="print" btnName="打印" btnIcon="el-icon-printer" :btnClickFunc="print"></pm_toolButton>
            <pm_toolButton
              ref="export_btn"
              btnName="导出"
              btnIcon="el-icon-tickets"
              :btnClickFunc="export_btn"
            ></pm_toolButton>
          </pm_tool_bar>
          <!-- body内容区域 -->
          <metro_page_box_body>
            <!-- table结构展示 -->
            <pm_table
              ref="pmTable"
              tableKey="CostBalanceBookList-pmTable"
              :reload="afterSetting"
              v-if="reload"
              :dataSource="dataSource"
              :totalData="totalData"
              :config="config"
              :bottomHeight="210"
            >
              <pm_column prop="balanceNo" label="结算单号" width="200"></pm_column>
              <pm_column prop="balanceCompanyId" label="结算单位" width="200"></pm_column>
              <pm_column prop="cstId" label="货主" width="200"></pm_column>
              <pm_column prop="amtMoney" label="应结金额" width="200"></pm_column>
              <pm_column prop="actMoney" label="实结金额" width="200"></pm_column>
              <pm_column prop="businessNo" label="业务单据号" width="200"></pm_column>
              <pm_column prop="balanceOtherNo" label="外部单据号" width="200"></pm_column>
              <pm_column prop="balanceStatus" label="结算状态" width="200"></pm_column>
              <pm_column prop="balanceType" label="结算方式" width="200"></pm_column>
              <pm_column prop="payType" label="付款方式" width="200"></pm_column>
              <pm_column prop="creatorName" label="制单人" width="200"></pm_column>
              <pm_column prop="createDate" label="制单日期" width="200"></pm_column>
              <pm_column prop="invoiceNo" label="发票号" width="200" :cellCanEdit="cellCanEdit"></pm_column>
              <pm_column prop="invoiceType" label="发票类型" width="200" :cellCanEdit="cellCanEdit"></pm_column>
              <pm_column prop="remark" label="备注" width="200"></pm_column>
            </pm_table>
            <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getBalanceMain"></pm_pagination>
          </metro_page_box_body>
        </metro_page_box>
      </el-tab-pane>
      <el-tab-pane label="结算清单明细" name="detail">
        <!-- 搜索条件区域 -->
        <metro_page_box>
          <metro_page_box_body>
            <pm_search
              ref="pm_search1"
              :btnOffset="10"
              :packRowHeight="5"
              :packNoSearchSpan="6"
              :hasPackNoSearch="true"
              :fields="searchFieldsDetail"
              v-on:getAllSearchParams="queryData1"
            ></pm_search>
          </metro_page_box_body>
        </metro_page_box>
        <!-- 数据展示区域 -->
        <metro_page_box>
          <pm_tool_bar></pm_tool_bar>
          <!-- body内容区域 -->
          <metro_page_box_body>
            <!-- table结构展示 -->
            <pm_table
              ref="pmTable1"
              tableKey="CostBalanceBookList-pmTable1"
              :reload="afterSetting2"
              v-if="reload2"
              :dataSource="dataSource1"
              :totalData="totalData1"
              :config="config"
              :bottomHeight="210"
            >
              <pm_column prop="packNo" label="捆包号" width="157"></pm_column>
              <pm_column prop="brandId" label="品名" width="180"></pm_column>
              <pm_column prop="textureId" label="材质" width="97"></pm_column>
              <pm_column prop="spec" label="规格" width="111"></pm_column>
              <pm_column prop="whsDayNum" label="仓储天数" width="97"></pm_column>
              <pm_column prop="whsFreeDayNum" label="免仓储天数" width="117"></pm_column>
              <pm_column prop="costType" label="费用类型" width="107"></pm_column>
              <pm_column prop="regularUnit" label="计费单位" width="107"></pm_column>
              <pm_column prop="settleUnitprice" label="结算单价" width="104"></pm_column>
              <pm_column prop="balanceNum" label="结算量" width="96"></pm_column>
              <pm_column prop="settleExpress" label="计算公式" width="273"></pm_column>
              <pm_column prop="settleAmt" label="预结算金额" width="109"></pm_column>
              <pm_column prop="changeMoney" label="调整金额" width="103"></pm_column>
              <pm_column prop="settleActAmt" label="实际结算金额" width="121"></pm_column>
              <pm_column prop="createDate" label="单据生成时间" width="150"></pm_column>
              <pm_column prop="businessType" label="业务类型" width="106"></pm_column>
              <pm_column prop="businessNo" label="业务单据号" width="120"></pm_column>
              <pm_column prop="regularDetailNo" label="价格规则明细号" width="129"></pm_column>
              <pm_column prop="oriPackNo" label="原货物号" width="96"></pm_column>
              <pm_column prop="cardNo" label="卡号" width="150"></pm_column>
              <pm_column prop="balanceNoType" label="结算单据类型" width="120"></pm_column>
              <pm_column prop="remark" label="备注" width="250"></pm_column>
            </pm_table>
            <pm_pagination ref="pager1" :totalSize="totalSize1" :queryData="getBalanceDetail"></pm_pagination>
          </metro_page_box_body>
        </metro_page_box>
      </el-tab-pane>
    </el-tabs>
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
import costBalanceManage from "@/views/cost/costBalanceManage/CostBalanceManage";
import costInvoiceEdit from "./CostInvoiceEdit";
import cacheUtil from "@/common/utils/CacheUtil";
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
      dataSource1: [],
      totalData: null,
      totalData1: null,
      config: {
        entity: metadata.regular,
        allowEdit: false,
        multiple: false,
        dbclick: this.doubleClick
        //   rowCanEdit: function(obj) {
        //     if (obj.cstName == null) return false;
        //     return obj.cstName.includes("江阴");
        //     return false;
        //   }
      },
      totalSize: 0,
      totalSize1: 0,
      //默认标签页
      activeName: "main",
      // 搜索区域条件
      searchFields: [
        {
          displayName: "结算单位",
          fieldName: "balanceCompanyId",
          xtype: "search_select_input",
          searchLoc: "1-1-6-10-0"
        },
        {
          displayName: "货主",
          fieldName: "cstId",
          xtype: "search_select_input",
          searchLoc: "1-2-6-7-0"
        },
        {
          displayName: "结算方式",
          fieldName: "balanceType",
          xtype: "select",
          searchLoc: "1-3-6-9-0"
        },
        {
          displayName: "业务单据号",
          fieldName: "businessNo",
          xtype: "text",
          searchLoc: "1-4-6-10-0"
        },
        {
          displayName: "结算清单号",
          fieldName: "balanceNo",
          xtype: "text",
          searchLoc: "2-1-6-10-0"
        },
        {
          displayName: "发票号",
          fieldName: "invoiceNo",
          xtype: "text",
          searchLoc: "2-2-6-8-0"
        },
        {
          displayName: "外部单据号",
          fieldName: "businessOtherNo",
          xtype: "text",
          searchLoc: "2-3-6-10-0"
        },
        {
          displayName: "结算状态",
          fieldName: "balanceStatus",
          xtype: "select",
          searchLoc: "2-4-6-10-0"
        },
        {
          displayName: "付款方式",
          fieldName: "payType",
          xtype: "select",
          searchLoc: "3-1-6-10-0"
        },
        {
          displayName: "是否存在实结金额",
          fieldName: "IsSettleAmt",
          xtype: "radio",
          value: 1,
          searchLoc: "3-2-9-10-0",
          group: [
            { key: 0, value: "全部" },
            { key: 1, value: "是" },
            { key: 2, value: "否" }
          ]
        },
        {
          displayName: "制单人",
          fieldName: "creatorName",
          xtype: "text",
          searchLoc: "3-3-9-15-0",
          value: cacheUtil.getUser().configUser.name,
          disabled: "true"
        },
        {
          displayName: "制单日期",
          fieldName: "createTime",
          xtype: "daterange",
          searchLoc: "4-1-12-5-0"
        },
        {
          displayName: "",
          fieldName: "search_btn",
          xtype: "btn",
          searchLoc: "4-2-5-1-1"
        }
      ],
      searchFieldsDetail: [
        {
          displayName: "结算单位",
          fieldName: "balanceCompanyId",
          xtype: "search_select_input",
          searchLoc: "1-1-8-10-0"
        },
        {
          displayName: "货主",
          fieldName: "cstId",
          xtype: "search_select_input",
          searchLoc: "1-2-8-10-0"
        },
        {
          displayName: "结算方式",
          fieldName: "balanceType",
          xtype: "select",
          searchLoc: "1-3-8-10-0"
        },
        {
          displayName: "业务类型",
          fieldName: "businessType",
          xtype: "select",
          searchLoc: "2-1-8-10-0"
        },
        {
          displayName: "业务单据号",
          fieldName: "businessNo",
          xtype: "text",
          searchLoc: "2-2-8-10-0"
        },
        {
          displayName: "发票号",
          fieldName: "invoiceNo",
          xtype: "text",
          searchLoc: "2-3-8-10-0"
        },
        {
          displayName: "结算状态",
          fieldName: "balanceStatus",
          xtype: "select",
          searchLoc: "3-1-8-10-0"
        },
        {
          displayName: "结算清单号",
          fieldName: "balanceNo",
          xtype: "text",
          searchLoc: "3-2-8-10-0"
        },
        {
          displayName: "外部单据号",
          fieldName: "businessOtherNo",
          xtype: "text",
          searchLoc: "3-3-8-10-0"
        },
        {
          displayName: "制单人",
          fieldName: "creatorName",
          xtype: "text",
          searchLoc: "4-1-8-10-0",
          value: cacheUtil.getUser().configUser.name,
          disabled: "true"
        },
        {
          displayName: "制单日期",
          fieldName: "createTime",
          xtype: "daterange",
          searchLoc: "4-2-16-5-0"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    handleClick: function(tab, event) {
      if (tab.name == "main") {
        this.afterSetting();
      } else {
        this.afterSetting2();
      }
    },
    queryData: function() {
      var $this = this;
      //1.查询时先获取所有的数据
      this.getDataMain(data => {
        $this.totalData = data.content;
        //2.触发查询
        $this.$refs.pager.refreshData();
      });
    },
    queryData1: function() {
      var $this = this;
      this.getDataDetail(data => {
        $this.totalData1 = data.content;
        $this.$refs.pager1.refreshData();
      });
    },
    cellCanEdit: function(row, flag) {
      if (flag == 1) {
        return true;
      } else {
        return false;
      }
    },
    getBalanceMain: function(page, size) {
      var table = this;
      this.getDataMain(
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
    getDataMain(callback, page, size) {
      var table = this;
      var param = this.$refs.pm_search.getParam();
      param.page = page || 0;
      param.size = size || 100000;
      if (param.IsSettleAmt == 1) {
        param.IsHaveActMoney = true;
      } else if (param.IsSettleAmt == 2) {
        param.IsHaveActMoney = false;
      }
      httpUtil.post("balance/queryBalanceMain", param, data => {
        data.content.forEach(a => {
          if (a.payType == 0) {
            a.payType = null;
          }
        });
        if (callback) {
          callback(data);
        }
      });
    },
    /**
     * 获取明细列表
     */
    getBalanceDetail: function(page, size) {
      var table = this;
      this.getDataDetail(
        data => {
          table.dataSource1 = data.content;
          table.totalSize1 = data.total;
        },
        page,
        size
      );
    },
    getDataDetail: function(callback, page, size) {
      var table = this;
      var param = this.$refs.pm_search1.getParam();
      this.post(param, page, size, callback);
    },
    post: function(param, page, size, callback) {
      var $this = this;
      param.page = page || 0;
      param.size = size || 100000;
      httpUtil.post("balance/queryBalanceDetail", param, data => {
        data.content.forEach(a => {
          a.textureId = a.material;
          a.whsFreeDayNum = a.whsFreedayNum;
          a.settleUnitPrice = a.unitprice;
          if (!a.changeMoney) {
            a.changeMoney = 0;
            a.createDate = a.createTime;
          }
        });
        if (callback) {
          callback(data);
        }
        if ($this.activeName == "main") {
          $this.afterSetting();
        }
      });
    },
    doubleClick: function() {
      var $this = this;
      var selectItem = this.$refs.pmTable.currentRow;
      this.activeName = "detail";
      //避免多次发起请求
      $this.post(selectItem, 0, 25, data => {
        if (data.total > 25) {
          $this.post(selectItem, 0, 100000, data => {
            //先取所有的数据做合计
            $this.totalData1 = data.content;
            $this.dataSource1 = data.content;
            $this.totalSize1 = data.total;
          });
        } else {
          $this.totalData1 = data.content;
          $this.dataSource1 = data.content;
          $this.totalSize1 = data.total;
        }
        $this.afterSetting2();
      });
    },
    edit: function() {
      var selectItem = this.$refs.pmTable.currentRow;
      if (!selectItem) {
        this.$message.error("请至少选择一笔资料！");
        return;
      }
      if (selectItem.invoiceNo != null && selectItem.invoiceNo != "") {
        this.$message.error("请先清空发票信息，方可修改结算单！");
        return;
      }
      selectItem.size = 1000;
      selectItem.page = 0;
      var $this = this;
      this.$commonUtil.getEntity(
        "balance/queryBalanceMain",
        "balance/queryBalanceDetail",
        selectItem,
        function(entity) {
          $this.$tab.open({
            component: costBalanceManage,
            name: "编辑结算单",
            propsData: entity
          });
        }
      );
    },
    remove: function() {
      var $this = this;
      var selectItem = this.$refs.pmTable.currentRow;
      if (!selectItem) {
        this.$message.error("请至少选择一笔资料！");
        return;
      }
      httpUtil.post("balance/deleteBalance", selectItem, data => {
        this.$message({
          message: "结算单作废成功",
          type: "success"
        });
        $this.queryData();
      });
    },
    editInvoice: function() {
      var $this = this;
      var selectItem = this.$refs.pmTable.currentRow;
      if (!selectItem) {
        this.$message.error("请至少选择一笔资料！");
        return;
      }
      this.$layer.iframe({
        content: {
          content: costInvoiceEdit, //传递的组件对象
          parent: $this, //当前的vue对象
          data: {
            entity: JSON.stringify(selectItem)
          }
        },
        area: ["400px", "220px"],
        shadeClose: false,
        title: "编辑发票号"
      });
    },
    export_btn: function() {
      var $this = this;
      this.getDataMain(data => {
        //获取表单的信息
        var table = $this.$refs.pmTable;
        $this.$commonUtil.cloudExport(
          $this,
          data.content,
          table,
          "结算清单列表"
        );
      });
    },
    print: function() {}
  }
};
</script>