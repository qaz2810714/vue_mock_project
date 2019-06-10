<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :hasPackNoSearch="true"
          :packRowHeight="4"
          :btnOffset='10' 
          :packNoSearchSpan='6' 
          :fields="searchFields"
          :entity ="config.entity"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
      </metro_page_box_body>
    </metro_page_box>

    <!-- 数据展示区域 -->
    <metro_page_box>
      <!-- toolbar工具条部分 -->
      <pm_tool_bar>
        <pm_toolButton
          btnName="导出"
          btnPermission="btn_export"
          btnIcon="el-icon-sold-out"
          :btnClickFunc="exportFunc"
        ></pm_toolButton>
      </pm_tool_bar>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table ref="pmTable" tableKey="NoteWhsStockGrid-pmTable" :reload="afterSetting" 
                  v-if="reload" :dataSource="dataSource" :totalData="totalData" :config="config">
          <!-- <vue_column :prop="props.field" slot-scope="props" label="测试" allowEdit='true' width="200" placeholder="请输入捆包号"
          :callback="requestTransactionLogs" renderType="input"></vue_column>-->
          <pm_column prop="packNo" label="捆包号" width="150"></pm_column>
          <pm_column prop="cstId" label="货主单位" width="200"></pm_column>
          <pm_column prop="costDays" label="仓储天数" width="100"></pm_column>
          <pm_column prop="brandId" label="品名(品种)" width="150"></pm_column>
          <pm_column prop="textureId" label="材质(钢种)" width="110"></pm_column>
          <pm_column prop="spec" label="规格" width="120"></pm_column>
          <pm_column prop="producingId" label="产地" width="150"></pm_column>
          <pm_column prop="calcType" label="计重方式" width="100"></pm_column>
          <pm_column prop="measurementUnit" label="数量单位" width="100"></pm_column>
          <pm_column prop="netWeight" label="净重" width="100"></pm_column>
          <pm_column prop="realOutWeight" label="实发重量" width="100"></pm_column>
          <pm_column prop="grossWeight" label="毛重" width="100"></pm_column>
          <pm_column prop="poundWeight" label="磅重" width="100"></pm_column>
          <pm_column prop="number" label="数量" width="100"></pm_column>
          <pm_column prop="unitNumber" label="单包支数" width="100"></pm_column>
          <pm_column prop="whsCalcStackId" label="库区" width="160"></pm_column>
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
import Table from "@/components/common/table/Table";
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_search from "@/components/vitems/pageSearch/pm_search";
import pm_table from "@/components/common/table/pm_table";
import {tableReload} from '@/components/common/table/table-reload';
import pm_column from "@/components/common/table/pm_column";
import httpUtil from "@/common/utils/HttpUtil";
import metadata from "@/common/entities/Metadata";
import pm_pagination from "@/components/common/table/pm_pagination";
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
export default {
  components: {
    metro_page,
    metro_page_box,
    metro_page_box_tool_bar,
    metro_page_box_body,
    metro_pageheader,
    x_table: Table,
    pm_search,
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
      totalData:null,
      config: {
        entity: metadata.wmsStock,
        allowEdit: false,
        multiple: false,
        autofit: false,//列宽自适应
      },
      totalSize: {
        type: Number,
        default: 0
      },
      // 搜索区域条件
      searchFields: [
        {
          displayName: "卡号",
          fieldName: "cardNo",
          xtype: 'text',
          searchLoc: "1-1-6-8-0"
        },
        {
          displayName: "品名(品种)",
          fieldName: "brandId",
          xtype: 'search_select_input',
          searchLoc: "1-2-6-9-0"
        },
        {
          displayName: "材质(钢种)",
          fieldName: "textureId",
          xtype: 'search_select_input',
          searchLoc: "1-3-6-9-0"
        },
        {
          displayName: "产地",
          fieldName: "producingId",
          xtype: 'search_select_input',
          searchLoc: "1-4-6-8-0"
        },
        {
          displayName: "货主",
          fieldName: "cstId",
          xtype: 'search_select_input',
          searchLoc: "2-1-6-8-0"
        },
        {
          displayName: "库位",
          fieldName: "whsCalcStackId",
          xtype: 'tree_select',
          searchLoc: "2-2-6-8-0"
        },
        {
          displayName: "规格",
          fieldName: "spec",
          xtype: 'text',
          searchLoc: "2-3-6-8-0"
        },
        {
          displayName: "净重",
          fieldName: "netWeight",
          xtype: 'number',
          searchLoc: "2-4-6-8-0"
        },
        {
          displayName: "毛重",
          fieldName: "grossWeight",
          xtype: 'number',
          searchLoc: "3-1-6-8-0"
        },
        {
          displayName: "磅重",
          fieldName: "poundWeight",
          xtype: 'number',
          searchLoc: "3-2-6-8-0"
        },
        {
          displayName: "入库时间",
          fieldName: "whsinTime",
          dateBegin:"inTimeBegin",
          dateEnd:"inTimeEnd",
          xtype: 'datetimerange',
          timeDefault: [],
          searchLoc: "3-3-12-4-0"
        },
        {displayName: '状态', fieldName: 'status', xtype:'select_batch',value:[1,5], searchLoc:'4-1-12-4-0'}, 
      ]
    };
  },
  created(){
  },
  methods: {
    getParam: function() {
      this.$refs["demoForm"].validate();
    },
    /**
     * 查询数据
     */
    getList: function(page,size) {
      var $this = this;
      this.getData(data =>{
        $this.dataSource = Object.freeze(data.content);
        $this.totalSize = data.total;
      },page,size);
    },
    queryData:function(param){
      var $this = this;
      //1.查询时先获取所有的数据
      this.getData(data =>{
        $this.totalData = data.content;
        //2.触发查询
        $this.$refs.pager.refreshData();
      });
    },
    /**
     * 获取所有的查询数据
     */
    getData(callback,page,size){
      var $this = this;
      var param = this.$refs.pm_search.getParam();
      this.$commonUtil.handler.statusHander(param);
      this.$commonUtil.handler.packNoHander(param);
      param.page = page || 0;
      param.size = size || 100000;
      this.$httpUtil.post("stock/getList", param, data => {
        //对数据源进行处理
        if(data.content){
          data.content.forEach(a=>{
            $this.$metaData.wmsStock.methods.calcUsableProp(a);
          });
        }
        if(callback){
          callback(data);
        }
      });
    },
    /**
     * 导出方法
     */
    exportFunc: function(){
      var $this = this;
      this.getData(data=>{
        //获取表单的信息
        var table = $this.$refs.pmTable;
        $this.$commonUtil.cloudExport($this,data.content,table,"库存台账列表");
      })
    }
  }
};
</script>