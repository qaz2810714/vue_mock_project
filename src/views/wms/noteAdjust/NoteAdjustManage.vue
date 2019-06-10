<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search ref="pm_search"
          :hasPackNoSearch="true"
          :packRowHeight="3"
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
        <pm_toolButton btnName ="新增" btnPermission="btn_add" btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='addTab' ></pm_toolButton>
        <pm_toolButton btnName ="作废" btnPermission="btn_del" btnIcon ="el-icon-delete" :btnClickFunc ='deleteInfo' ></pm_toolButton>
        <pm_toolButton btnName ="审核" btnPermission="btn_check" btnIcon ="el-icon-circle-check-outline" :btnClickFunc ='checkInfo' ></pm_toolButton>
        <pm_toolButton btnName ="打印" btnPermission="btn_print" btnIcon ="el-icon-printer" :btnClickFunc ='printFunc' ></pm_toolButton>
        <pm_toolButton btnName ="导出" btnPermission="btn_export" btnIcon ="el-icon-document" :btnClickFunc ='exportFunc' ></pm_toolButton>
      </pm_tool_bar>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table ref="pmTable" tableKey="NoteAdjustManage-pmTable" :reload="afterSetting" 
                  v-if="reload" :dataSource="dataSource" :totalData="totalData" :config="config">
          <pm_column prop="adjustNo" label="调整单号" width="120"></pm_column>
          <pm_column prop="adjustType" label="调整类型" width="100"></pm_column>
          <pm_column prop="cstName" label="货主单位" width="200"></pm_column>
          <pm_column prop="status" label="状态" width="100"></pm_column>
          <pm_column prop="creatorName" label="制单人" width="110"></pm_column>
          <pm_column prop="createTime" label="制单时间" width="140"></pm_column>
          <pm_column prop="totalAmount" label="总数量" width="100"></pm_column>
          <pm_column prop="totalNetWeight" label="总净重" width="100"></pm_column>
          <pm_column prop="totalGrossWeight" label="总毛重" width="100"></pm_column>
          <pm_column prop="totalPoundWeight" label="总磅重" width="100"></pm_column>
          <pm_column prop="remark" label="备注" width="200"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getList"></pm_pagination>
        <noteAdjustPrint ref="print" v-show="false"></noteAdjustPrint>
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
import {tableReload} from '@/components/common/table/table-reload';
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";
import pm_pagination from "@/components/common/table/pm_pagination";
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import httpUtil from "@/common/utils/HttpUtil";
import metadata from "@/common/entities/Metadata";
import commonUtil from '@/common/utils/CommonUtils';
import noteAdjustEdit from './NoteAdjustEdit';
import noteAdjustPrint from "./NoteAdjustPrint";

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
    pm_tool_bar,
    noteAdjustPrint
  },
  mixins:[tableReload],
  data: function() {
    return {
      dataSource: [],
      totalData:null,
      config: {
        entity: metadata.wmsNoteAdjust,
        allowEdit: false,
        multiple: false,
        dbclick: this.editTab,
      },
      totalSize:0,
      // 搜索区域条件
      searchFields: [
        {displayName: '调整单号', fieldName: 'adjustNo', xtype:"text", searchLoc:'1-1-6-8-0'},
        {displayName: '卡号', fieldName: 'cardNo', xtype:"text", searchLoc:'1-2-6-8-0'},
        {displayName: '货主单位', fieldName: 'cstId', xtype:"search_select_input", searchLoc:'1-3-6-8-0'},
        {displayName: '状态', fieldName: 'status', xtype:"select_batch", searchLoc:'1-4-6-8-0'},
        {displayName: '品名(品种)', fieldName: 'brandId', xtype:"search_select_input", searchLoc:'2-1-6-9-0'},
        {displayName: '材质(钢种)', fieldName: 'textureId', xtype:"search_select_input", searchLoc:'2-2-6-9-0'},
        {displayName: '规格', fieldName: 'spec', xtype:'text', searchLoc:'2-3-6-8-0'},
        {displayName: '产地', fieldName: 'producingId', xtype:'search_select_input', searchLoc:'2-4-6-8-0'},
        {displayName: '制单日期', fieldName: 'createTime',dateBegin: "createTimeStart",dateEnd: "createTimeEnd", xtype:'datetimerange', searchLoc:'3-1-12-4-0'},
        {displayName: '调整类型', fieldName: 'adjustType', xtype:'select_batch', searchLoc:'3-2-6-8-0'},
        // {displayName: '', fieldName: 'btn_search', xtype:'btn', searchLoc:'4-4-16-8-0'}
      ],  
    };
  },
  methods: {
    /**
     * 打印方法
     */
    printFunc:function(){
      let row = this.getCurrentRow();
      var $this = this;
      this.$commonUtil.getEntity(
        "whsadjust/getList",
        "whsadjust/getDetailList",
        { page: 0, size: 10000, adjustId: row.id },
        entity=>{
          $this.$refs.print.printDiv(entity);
        }
      );
    },
    //打开创建锁定单 tab页
    addTab: function() {
      const lockItem = {
        component: noteAdjustEdit,
        propsData: { entity: {}, parent: this },
        name: "添加调整单"
      };
      this.$tab.open(lockItem);
    },
    //打开编辑锁定单 tab页
    editTab: function(row, event) {
      var $this = this;
      this.$commonUtil.getEntity(
        "whsadjust/getList",
        "whsadjust/getDetailList",
        { page: 0, size: 1000, adjustId: row.id },
        entity=>{
          $this.$tab.open({
            component: noteAdjustEdit,
            name: "编辑调整单[" + row.adjustNo + "]",
            propsData: { key: row.id, entity, parent: $this }
          });
        }
      );
    },
    /**
     * 刷新列表
     */
    refreshList: function() {
      if(this.$refs==undefined) return;
      var param = this.$refs.pm_search.getParam();
      param.page = 0;
      this.queryData(param);
    },
    getParam: function() {
      console.log(this.formModel);
      this.$refs["demoForm"].validate();
    },
    /**
     * 查询数据
     */
    getList: function(page,size) {
      var table = this;
      this.getData(data =>{
        table.dataSource = data.content;
        table.totalSize = data.total;
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
      //this.$layer.alert("找不到对象！");
      var param = this.$refs.pm_search.getParam();
      param.page = page || 0;
      param.size = size || 100000;
      this.$commonUtil.handler.statusHander(param);
      this.$commonUtil.handler.packNoHander(param);
      param.fAdjustType = param.adjustType;
      param.adjustType = null;
      var table = this;
      this.$httpUtil.post("whsadjust/getList",param, data => {
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
        $this.$commonUtil.cloudExport($this,data.content,table,"调整单列表");
      });
    },

    //作废数据
    deleteInfo() {
      //获取当前选中数据id
      var row = this.getCurrentRow();
      if (row.status!= this.$metaData.wmsNoteAdjust.statusEnum.STATUS_READY) {
        this.$commonUtil.valid.throwEx("只允许对待审核状态的单据执行作废操作");
      }
      let $this = this;
      this.$commonUtil.message.confirm('确认作废该调整单['+row.adjustNo+']?',()=>{
        //发送请求审核数据
        this.$httpUtil.post("whsadjust/delete", row, data => {
          $this.$message({
            message: "作废成功",
            type: "success"
          });
          $this.refreshList();
        });
      });
    },
    /**
     * 确认事件
     */
    checkInfo() {
      //获取当前选中数据id
      var row = this.getCurrentRow();
      if (row.status!= this.$metaData.wmsNoteAdjust.statusEnum.STATUS_READY) {
        this.$commonUtil.valid.throwEx("只允许对待审核状态的单据执行审核操作");
      }
      let $this = this;
      //发送请求审核数据
      this.$httpUtil.post("whsadjust/check", row, data => {
        $this.$message({
          message: "库存调整成功",
          type: "success"
        });
        $this.refreshList();
      });
    },
    /**
     * 获取当前单据
     */
    getCurrentRow(){
      var row = this.$refs.pmTable.currentRow;
      if(!row){
        this.$commonUtil.valid.throwEx(this, "请选择一条调整单");
      }
      return row;
    },
  }
};
</script>