<template>
  <el-container>
    <el-aside width="240px" style="background-color: rgb(238, 241, 246);padding:5px;">
      <!-- 条件区域封装控件 -->
      <pm_search
        ref="pm_search"
        :hasPackNoSearch="false"
        :packRowHeight="10"
        :fields="searchFields"
        :entity="config.entity"
        v-on:getAllSearchParams="queryData"
      ></pm_search>
    </el-aside>
    <el-container>
      <el-main style="padding: 0 10px;overflow:hidden;">
        <pm_table ref="pmTable" tableKey="SelectStock-pmTable" :reload="afterSetting" 
                  v-if="reload" :dataSource="dataSource" :totalData="totalData" :config="config" :bottomHeight="100">
          <!-- <vue_column :prop="props.field" slot-scope="props" label="测试" allowEdit='true' width="200" placeholder="请输入捆包号"
          :callback="requestTransactionLogs" renderType="input"></vue_column>-->
          <pm_column prop="packNo" label="捆包号" width="150"></pm_column>
          <pm_column prop="usableNum" label="可用数量" width="100"></pm_column>
          <pm_column prop="usableWeight" label="可用重量" width="100"></pm_column>
          <pm_column prop="cstId" label="货主单位" width="200"></pm_column>
          <!-- <pm_column prop="costDays" label="仓储天数" width="100"></pm_column> -->
          <pm_column prop="brandId" label="品名(品种)" width="150"></pm_column>
          <pm_column prop="textureId" label="材质(钢种)" width="110"></pm_column>
          <pm_column prop="spec" label="规格" width="120"></pm_column>
          <pm_column prop="producingId" label="产地" width="150"></pm_column>
          <pm_column prop="calcType" label="计重方式" width="100"></pm_column>
          <pm_column prop="measurementUnit" label="数量单位" width="100"></pm_column>
          <pm_column prop="number" label="数量" width="100"></pm_column>
          <pm_column prop="netWeight" label="净重" width="100"></pm_column>
          <pm_column prop="usedNum" label="已用数量" width="100"></pm_column>
          <pm_column prop="usedWeight" label="已用重量" width="100"></pm_column>
          <pm_column prop="realOutWeight" label="实发重量" width="100"></pm_column>
          <pm_column prop="grossWeight" label="毛重" width="100"></pm_column>
          <pm_column prop="poundWeight" label="磅重" width="100"></pm_column>
          <pm_column prop="unitNumber" label="单包支数" width="100"></pm_column>
          <pm_column prop="whsCalcStackId" label="库区" width="150"></pm_column>
          <pm_column prop="whsStackName" label="库位" width="70"></pm_column>
          <pm_column prop="whsLayerId" label="层数" width="70"></pm_column>
          <pm_column prop="status" label="状态" width="80"></pm_column>
          <pm_column prop="remark" label="备注" width="200"></pm_column>
          <pm_column prop="manufactureTime" label="出厂日期" width="140"></pm_column>
          <pm_column prop="stoveCode" label="炉号" width="100"></pm_column>
          <pm_column prop="whsinTime" label="首入库日期" width="140"></pm_column>
          <pm_column prop="costTime" label="货主入库时间" width="150"></pm_column>
          <pm_column prop="transferTimes" label="过户次数" width="100"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :pageSize="25" :queryData="getList"></pm_pagination>
      </el-main>
      <el-footer style="padding:0px;">
        <!-- toolbar工具条部分 -->
        <pm_tool_bar :noBackground="true">
          <pm_toolButton btnName="确认" btnIcon="el-icon-success" :btnClickFunc="ok"></pm_toolButton>
          <pm_toolButton btnName="关闭" btnIcon="el-icon-close" :btnClickFunc="closeWin"></pm_toolButton>
        </pm_tool_bar>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
import httpUtil from "@/common/utils/HttpUtil";
import metadata from "@/common/entities/Metadata";
import layerUtil from "@/common/utils/LayerUtil";
import commonUtil from "@/common/utils/CommonUtils";
import Table from "@/components/common/table/Table";
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_search from "@/components/vitems/pageSearch/pm_search";
import pm_table from "@/components/common/table/pm_table";
import {tableReload} from '@/components/common/table/table-reload';
import pm_column from "@/components/common/table/pm_column";
import pm_pagination from "@/components/common/table/pm_pagination";
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
export default {
  components: {
    x_table: Table,
    pm_search,
    pm_form_render,
    pm_form_item,
    pm_table,
    pm_column,
    pm_pagination,
    pm_toolButton,
    pm_tool_bar
  },
  mixins:[tableReload],
  data: function() {
    return {
      dataSource: [],
      totalData: null,
      config: {
        entity: this.$metaData.wmsStock,
        height: 450,
        allowEdit: false,
        multiple: true
      },
      totalSize: 0,
      formModel: { lockNo: "", status: "", cstId: "" },
      rules: {
        text1: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      // 搜索区域条件
      searchFields: [
        {
          displayName: "卡号",
          fieldName: "cardNo",
          xtype: "text",
          searchLoc: "1-1-24-9-0"
        },
        {
          displayName: "品名(品种)",
          fieldName: "brandId",
          xtype: "select",
          searchLoc: "2-1-24-9-0"
        },
        {
          displayName: "材质(钢种)",
          fieldName: "textureId",
          xtype: "select",
          searchLoc: "3-1-24-9-0"
        },
        {
          displayName: "规格",
          fieldName: "spec",
          xtype: "text",
          searchLoc: "4-1-24-9-0"
        },
        {
          displayName: "产地",
          fieldName: "producingId",
          xtype: "select",
          searchLoc: "5-1-24-9-0"
        },
        {
          displayName: "货主",
          fieldName: "cstId",
          xtype: "select",
          searchLoc: "6-1-24-9-0"
        },
        {
          displayName: "库区",
          fieldName: "whsCalcStackId",
          xtype: "tree_select",
          searchLoc: "7-1-24-9-0"
        },
        {
          displayName: "库位",
          fieldName: "stackName",
          xtype: "text",
          searchLoc: "8-1-24-9-0"
        },
        {
          displayName: "净重",
          fieldName: "netWeight",
          xtype: "number",
          precision: 3,
          searchLoc: "9-1-24-9-0"
        },
        {
          displayName: "毛重",
          fieldName: "grossWeight",
          xtype: "number",
          precision: 3,
          searchLoc: "10-1-24-9-0"
        },
        {
          displayName: "磅重",
          fieldName: "poundWeight",
          xtype: "number",
          precision: 3,
          searchLoc: "11-1-24-9-0"
        },
        {
          displayName: "入库时间",
          fieldName: "whsInTime",
          dateBegin: "inTimeBegin",
          dateEnd: "inTimeEnd",
          xtype: "datetimerange",
          timeDefault: [],
          searchLoc: "12-1-24-9-0"
        },
        {
          displayName: "捆包号",
          fieldName: "packNo",
          xtype: "textarea",
          searchLoc: "13-1-24-9-0",
          rows:4,
        },
        {
          displayName: "",
          fieldName: "btn_search",
          xtype: "btn",
          searchLoc: "14-1-20-9-4"
        }
      ]
    };
  },
  created() {
    var fields = JSON.parse(this.$options.propsData.lockFields);
    fields.forEach(f => {
      var item = this.searchFields.find(a => a.fieldName == f);
      if (item) {
        this.$set(item, "disabled", true);
      }
    });
    //formModel赋值
    this.formModel = JSON.parse(this.$options.propsData.filter);
    this.formModel.selectedValid = this.$options.propsData.selectedValid;
    //为控件赋值
    var $this = this;
    this.searchFields.forEach(a => {
      var param = this.formModel[a.fieldName];
      if (param != null) {
        $this.$set(a, "value", param);
      }
    });
  },
  methods: {
    /**
     * 查询数据
     */
    getList: function(page, size) {
      var $this = this;
      this.getData(data =>{
        $this.dataSource = Object.freeze(data.content);
        $this.totalSize = data.total;
      },page,size);
    },
    queryData: function(param) {
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
      var param = this.$refs.pm_search.getParam();
      param.page = page || 0;
      param.size = size || 100000;
      if (param.packNo != null) {
        param.fPackNo = param.packNo.split(/[\n]/);
      }
      this.$commonUtil.handler.packNoHander(param);
      //过滤条件合并
      param = { ...this.formModel, ...param };
      var $this = this;
      this.$httpUtil.post("stock/getList", param, data => {
        //对数据源进行处理
        if (data.content) {
          var calc = $this.$metaData.wmsStock.methods.calcUsableProp;
          data.content.forEach(a => {
            calc(a);
          });
        }
        if (callback) {
          callback(data);
        }
      });
    },
    closeWin: layerUtil.closeWin,
    ok: function() {
      //返回选中的数据
      var rows = this.$refs.pmTable.getSelectedRows();
      var returnList = [],
        errorMsgList = [],
        errorList = [];
      var hasError = false;
      var $this = this;
      rows.forEach(stock => {
        //数据验证
        if ($this.formModel.selectedValid) {
          //TODO:查询异常数据
          if (!$this.formModel.selectedValid(stock)) {
            hasError = true;
            errorList.push(stock);
            if ($this.formModel.errorMsg) {
              errorMsgList.push(
                "[" + stock.packNo + "]" + $this.formModel.errorMsg + "!"
              );
            } else {
              errorMsgList.push(
                "[" + stock.packNo + "]不符合选择条件,将被移除!"
              );
            }
            return;
          }
        } else {
          //TODO:查询状态不符的数据(1:在库状态)
          if (stock.status != 1) {
            hasError = true;
            errorList.push(stock);
            errorMsgList.push(
              "[" + stock.packNo + "]是" + stock.status_display + "状态，不允许挑选!"
            );
            return;
          }
          if (stock.whsoutType == 1 && stock.usableNum <= 0) {
            hasError = true;
            errorList.push(stock);
            errorMsgList.push(
              "[" + stock.packNo + "]是按件出库，可用数量为0，不允许挑选!"
            );
            return;
          }
        }
        returnList.push(stock);
      });
      //TODO:提示数据异常
      if (hasError) {
        //取消无效的选择项
        this.$refs.pmTable.toggleRowSelection(errorList, false);
        this.$commonUtil.valid.throwEx(errorMsgList.join("<br/>"));
      }
      //触发选中事件
      this.$options.propsData.selected(returnList);
      //关闭系统
      this.closeWin();
    }
  }
};
</script>