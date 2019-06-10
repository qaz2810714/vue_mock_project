<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :hasPackNoSearch="true"
          :packRowHeight="3"
          :btnOffset='10' 
          :packNoSearchSpan='6' 
          :fields="searchFields"
          :entity="config.entity"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
      </metro_page_box_body>
    </metro_page_box>

    <!-- 数据展示区域 -->
    <metro_page_box>
      <!-- toolbar工具条部分 -->
      <pm_tool_bar>
        <pm_toolButton
          btnName="新增"
          ref="btn_add"
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
          btnPermission="btn_lock"
          btnIcon="pm-font pm-icon-Lock"
          :btnClickFunc="lockInfo"
        ></pm_toolButton>
        <pm_toolButton
          btnName="解锁"
          btnPermission="btn_unlock"
          btnIcon="pm-font pm-icon-lockopen"
          :btnClickFunc="unLockInfo"
        ></pm_toolButton>
        <pm_toolButton
          btnName="打印"
          btnPermission="btn_print"
          btnIcon="el-icon-printer"
          :btnClickFunc="printFunc"
        ></pm_toolButton>
        <pm_toolButton
          btnName="导出"
          btnPermission="btn_export"
          btnIcon="el-icon-document"
          :btnClickFunc="exportFunc"
        ></pm_toolButton>
      </pm_tool_bar>
      <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table ref="pmTable" tableKey="NoteLockManage-pmTable" :reload="afterSetting" 
                  v-if="reload"  :dataSource="dataSource" :totalData="totalData" :config="config">
          <!-- <vue_column :prop="props.field" slot-scope="props" label="测试" allowEdit='true' width="200" placeholder="请输入捆包号"
          :callback="requestTransactionLogs" renderType="input"></vue_column>-->
          <pm_column prop="lockNo" label="锁定单号" width="120"></pm_column>
          <pm_column prop="cstName" label="货主单位" width="200"></pm_column>
          <pm_column prop="status" label="锁定状态" width="95"></pm_column>
          <pm_column prop="creatorName" label="制单人" width="110"></pm_column>
          <pm_column prop="createTime" label="制单时间" width="140"></pm_column>
          <pm_column prop="totalAmount" label="总数量" width="100"></pm_column>
          <pm_column prop="totalNetWeight" label="总净重" width="100"></pm_column>
          <pm_column prop="totalGrossWeight" label="总毛重" width="100"></pm_column>
          <pm_column prop="totalPoundWeight" label="总磅重" width="100"></pm_column>
          <pm_column prop="remark" label="备注" width="200"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getList"></pm_pagination>
        <noteLockPrint ref="print" v-show="false"></noteLockPrint>
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
import noteLockEdit from "./NoteLockEdit";
import noteLockPrint from "./NoteLockPrint";

//import cacheUtil from '@/common/utils/CacheUtil'

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
    noteLockPrint
  },
  mixins:[tableReload],
  data: function() {
    return {
      dataSource: [],
      totalData:null,
      config: {
        entity: this.$metaData.wmsNoteLock,
        allowEdit: false,
        multiple: true,
        dbclick: this.editTab
      },
      totalSize: 0,
      // 搜索区域条件
      searchFields: [
        {
          displayName: "锁定单号",
          fieldName: "lockNo",
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
          displayName: "货主单位",
          fieldName: "cstId",
          xtype: "search_select_input",
          searchLoc: "1-3-6-8-0"
        },
        {
          displayName: "锁定状态",
          fieldName: "status",
          xtype: "select_batch",
          searchLoc: "1-4-6-8-0"
        },
        {
          displayName: "品名",
          fieldName: "brandId",
          xtype: "search_select_input",
          searchLoc: "2-1-6-8-0"
        },
        {
          displayName: "材质",
          fieldName: "textureId",
          xtype: "search_select_input",
          searchLoc: "2-2-6-8-0",
          watchField:'brandId'
        },
        {
          displayName: "产地",
          fieldName: "producingId",
          xtype: "search_select_input",
          searchLoc: "2-3-6-8-0"
        },
        {
          displayName: "规格",
          fieldName: "spec",
          xtype: "text",
          searchLoc: "2-4-6-8-0"
        },
        {
          displayName: "制单时间",
          dateBegin: "createTimeStart",
          dateEnd: "createTimeEnd",
          fieldName: "createTime",
          xtype: "daterange",
          searchLoc: "3-1-12-4-0"
        },
        // {displayName: '', fieldName: 'btn_search', xtype:'btn', searchLoc:'4-4-16-8-0'}
      ]
    };
  },
  methods: {
    //打开创建锁定单 tab页
    addTab: function() {
      const lockItem = {
        component: noteLockEdit,
        propsData: { entity: {}, parent: this },
        name: "添加锁定单"
      };
      this.$tab.open(lockItem);
    },
    //打开编辑锁定单 tab页
    editTab: function(row, event) {
      var $this = this;
      this.$commonUtil.getEntity(
        "whslock/getList",
        "whslock/getDetailList",
        { page: 0, size: 1000, lockId: row.id },
        entity=>{
          $this.$tab.open({
            component: noteLockEdit,
            name: "编辑锁定单[" + row.lockNo + "]",
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
      this.queryData();
    },
    /**
     * 查询数据
     */
    getList: function(page, size) {
      var table = this;
       this.getData(data =>{
        table.dataSource = data.content;
        table.totalSize = data.total;
      },page,size);
    },
    queryData: function(param) {
      var $this = this;
      //1.查询时先获取所有的数据
      this.getData(data =>{
        $this.totalData = data.content;
        //2.触发查询
        $this.$refs.pager.refreshData();
      });
    },
    //作废数据
    deleteInfo() {
      //获取当前选中数据id
      var row = this.getCurrentRow();
      if (row.status!= this.$metaData.wmsNoteLock.statusEnum.STATUS_READY) {
        this.$commonUtil.valid.throwEx("只允许对待审核状态的单据执行作废操作");
      }
      let $this = this;
      //发送请求审核数据
      this.$commonUtil.message.confirm('确认作废该锁定单['+row.lockNo+']?',()=>{
        this.$httpUtil.post("whslock/delete", row, data => {
          $this.$message({
            message: "作废成功",
            type: "success"
          });
          $this.refreshList();
        });
      })
    },
    /**
     * 锁定事件
     */
    lockInfo() {
      //获取当前选中数据id
      var row = this.getCurrentRow();
      if (row.status!= this.$metaData.wmsNoteLock.statusEnum.STATUS_READY) {
        this.$commonUtil.valid.throwEx("只允许对待审核状态的单据执行审核操作");
      }
      let $this = this;
      //发送请求审核数据
      this.$httpUtil.post("whslock/lock", row, data => {
        $this.$message({
          message: "锁定成功",
          type: "success"
        });
        $this.refreshList();
      });
    },
    /**
     * 解锁事件
     */
    unLockInfo() {
      //获取当前选中数据id
      var rows = this.getAllSelected();
      var invalids = rows.filter(a=>a.status != this.$metaData.wmsNoteLock.statusEnum.STATUS_LOCKED);
      if (invalids.length>0) {
        var lockNos = invalids.map(a=>a.lockNo).join("、");
        this.$commonUtil.valid.throwEx("锁定单["+lockNos+"]未被锁定\r\n只允许对已锁定状态的单据执行解锁操作！");
      }
      let $this = this;
      //发送请求审核数据
      this.$httpUtil.post("whslock/batchUnlock", rows, data => {
        $this.$message({
          message: "解锁成功",
          type: "success"
        });
        $this.refreshList();
      });
    },
    /**
     * 获取当前单据
     */
    getCurrentRow(){
      var rows = this.getAllSelected();
      if(rows.length>1){
        this.$commonUtil.valid.throwEx("只允许选择一条锁定单");
      }
      return rows[0];
    },
    /**
     * 获取所有选中单据
     */
    getAllSelected(){
      //获取所有的选择记录
      var rows = this.$refs.pmTable.getSelectedRows();
      if(rows == null || rows.length==0){
        this.$commonUtil.valid.throwEx("请至少选择一条锁定单");
      }
      return rows;
    },
    /**
     * 获取所有的查询数据
     */
    getData(callback,page,size){
      var param = this.$refs.pm_search.getParam();
      param.page = page || 0;
      param.size = size || 100000;
      this.$commonUtil.handler.statusHander(param);
      this.$commonUtil.handler.packNoHander(param);
      this.$httpUtil.post("whslock/getList", param, data => {
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
        $this.$commonUtil.cloudExport($this,data.content,table,"锁定单列表");
      });
    },
    /**
     * 打印方法
     */
    printFunc:function(){
      let row = this.getCurrentRow();
      var $this = this;
      this.$commonUtil.getEntity(
        "whslock/getList",
        "whslock/getDetailList",
        { page: 0, size: 10000, lockId: row.id },
        entity=>{
          $this.$refs.print.printDiv(entity);
        }
      );
    },
  }
};
</script>