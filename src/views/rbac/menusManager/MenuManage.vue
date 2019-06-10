<template>
  <el-container>
    <el-aside width="240px" style="background-color:#fff;display:flex;
    flex-direction: column;margin:2px 5px 0 0">
      <p style="text-align:left;padding-left:24px;margin: 9px 0;"><b>系统菜单</b>
      <span>
        <el-button size="mini" title="新增菜单项" @click="addClass_func">新增</el-button>
        <!-- <el-button size="mini">编辑</el-button>
        <el-button size="mini">删除</el-button> -->
      </span></p>
      <div class="block" style="overflow-y:auto;border-right: 1px solid rgb(238, 238, 238);flex:1">
      <el-tree :data="dicClassList" ref="mainTree" node-key="id" 
        @current-change="treeNodeChange"
        :expand-on-click-node="false"  
        :default-expand-all="true" 
        :check-strictly="true"  
        :highlight-current="true"
        :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}
           <el-button
            v-if="data.id !==0"
            type="text"
            size="mini"
            @click="() => editClass_func(data)">
            编辑
          </el-button>
          <el-button
            v-if="data.id !==0"
            type="text"
            size="mini"
            @click="() => removeClass_func(data)">
            删除
          </el-button>
        </span>
      </span>
      </el-tree>
      </div>
      <!-- 条件区域封装控件 -->
      <!-- <pm_tree showField="name" keyField="id" :dicClassList="dicClassList" :getInfo="changeClass"></pm_tree> -->
      <!-- <el-menu
          class="el-menu-vertical-demo"
          unique-opened @open="getInfo" @close="getInfo">
        <pm_tree_item
        showField="name"
        keyField="id"
        :clickFunc="changeClass"
        :menus="dicClassList">
      </pm_tree_item>
      </el-menu>-->
    </el-aside>
    <el-container>
      <el-main style="padding: 0px;">
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :hasPackNoSearch="false"
          :fields="searchFields"
          :entity="config.entity"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
        <!-- toolbar工具条部分 -->
        <pm_tool_bar>
          <pm_toolButton
            btnName="新增"
            btnPermission="btn_add"
            btnIcon="el-icon-circle-plus-outline"
            :btnClickFunc="addWin"
          ></pm_toolButton>
          <pm_toolButton btnName="作废" btnPermission="btn_add" btnIcon="el-icon-edit" 
            :btnClickFunc="deleteInfo"></pm_toolButton>
        </pm_tool_bar>
        <pm_table ref="pmTable" tableKey="BrandManage-pmTable" :dataSource="dataSource" :config="config">
          <pm_column prop="name" label="菜单名称" width="200"></pm_column>
          <pm_column prop="id" label="菜单URL" width="200"></pm_column>
          <!-- <pm_column prop="mnemonicCode" label="品名助记码" width="200"></pm_column>
          <pm_column prop="whsoutType" label="出库方式" width="200"></pm_column>
          <pm_column prop="classId" label="品类" width="200"></pm_column>
          <pm_column prop="deleteFlag" label="状态" width="200" placeholder></pm_column> -->
          <pm_column prop="remark" label="备注" width="200"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getList"></pm_pagination>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import pm_form_render from "@/components/common/form/pm_form_render";
import pm_form_item from "@/components/common/form/pm_form_item";
import pm_search from "@/components/vitems/pageSearch/pm_search";
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";
import httpUtil from "@/common/utils/HttpUtil";
import metadata from "@/common/entities/Metadata";
import pm_pagination from "@/components/common/table/pm_pagination";
import pm_dicMenu from "@/components/common/dicMenu/pm_dicMenu";
import pm_tree from "@/components/common/menu/pm_tree";
import pm_tree_item from "@/components/common/menu/pm_tree_item";

import commonUtil from "@/common/utils/CommonUtils";
import menuEdit from "./MenuEdit";
import menuClsEdit from './MenuClsEdit';

export default {
  components: {
    pm_search,
    pm_form_item,
    pm_toolButton,
    pm_tool_bar,
    pm_table,
    pm_column,
    pm_pagination,
    pm_dicMenu,
    pm_tree,
    pm_tree_item
  },
  data: function() {
    return {
      dicClassList: [],
      dataSource: [],
      selectClass:{},
      config: {
        entity: metadata.baseDictionary,
        dbclick: this.editWin
      },
      defaultProps: {
          children: 'children',
          label: 'name',
          id:'id'
      },
      // 搜索区域条件
      searchFields: [
        {
          displayName: "菜单名称",
          fieldName: "name",
          xtype: "text",
          searchLoc: "1-1-8-8-0"
        },
        {
          displayName: "系统名称",
          fieldName: "mnemonicCode",
          xtype: "text",
          searchLoc: "1-2-8-8-0"
        },
        {
          displayName: "",
          fieldName: "btn_search",
          xtype: "btn",
          searchLoc: "1-3-6-8-2"
        }
        // {displayName: '', fieldName: 'btn_search', xtype:'btn', searchLoc:'4-4-16-8-0'}
      ],
      totalSize: 0
      // [{"classCode":"CostType","className":"费用类型","type":3},{"classCode":"AdjustType","className":"调整类型","type":1},{"classCode":"BalanceNode","className":"结算节点","type":1},{"classCode":"BalanceNoType","className":"结算单据类型","type":1},{"classCode":"BalanceStatus","className":"结算状态","type":1},{"classCode":"BalanceType","className":"结算方式","type":1},{"classCode":"BrandSkuProperties","className":"品名sku属性","type":1},{"classCode":"BusinessType","className":"业务类型","type":1},{"classCode":"CalcType","className":"计重方式","type":1},{"classCode":"CstInTime","className":"货主入库时间","type":1},{"classCode":"CstSettleType","className":"货主结算方式","type":1},{"classCode":"CstType","className":"货主类型","type":1},{"classCode":"CstValid","className":"货主启用状态","type":1},{"classCode":"DataSource","className":"数据来源","type":1},{"classCode":"DeleteFlag","className":"删除标记","type":1},{"classCode":"InvoiceType","className":"发票类型","type":1},{"classCode":"MeasurementUnit","className":"数量单位","type":1},{"classCode":"MoveStatus","className":"移库状态","type":1},{"classCode":"NoteAdjustStatus","className":"调整单状态","type":1},{"classCode":"NoteLockStatus","className":"锁定状态","type":1},{"classCode":"PayType","className":"付款方式","type":1},{"classCode":"RangeApply","className":"应用范围","type":1},{"classCode":"RegularStatus","className":"计费规则状态","type":1},{"classCode":"RegularUnit","className":"计费单位","type":1},{"classCode":"SettleStatus","className":"结算单状态","type":1},{"classCode":"SpecStr","className":"特殊字符","type":1},{"classCode":"StockStatus","className":"库存状态","type":1},{"classCode":"StoreLocationType","className":"库房类型","type":1},{"classCode":"TransferStatus","className":"过户状态","type":1},{"classCode":"WareHouse","className":"仓库集合","type":1},{"classCode":"WareHouseType","className":"仓库类型","type":1},{"classCode":"WareHouseUserMax","className":"仓库用户最大数","type":1},{"classCode":"WeightType","className":"计重单位","type":1},{"classCode":"WhsInStatus","className":"入库状态","type":1},{"classCode":"WhsInStyle","className":"入库类型","type":1},{"classCode":"WhsInType","className":"入库方式","type":1},{"classCode":"WhsLevel","className":"库区级别","type":1},{"classCode":"whsoutStatus","className":"出库状态","type":1},{"classCode":"WhsoutType","className":"出库方式","type":1}]
    };
  },
  mounted: function() {
    this.loadTree();
  },
  methods: {
    loadTree:function(){
      var _this = this;
      this.$httpUtil.post("product/getBaseClassList", null, data => {
        //拼接一个根元素
        if(data){
          var root = {
            deleteFlag:false,
            id: 0,
            name: '权限管理系统',
            parentId:'',
            children:data
          };
          _this.dicClassList = [root];
        }
      });
    },
    /**
     * 树节点变更
     */
    treeNodeChange:function(node,vm){
      this.selectClass = node;
      this.queryData({});
    },
    getSelectedClass:function(){
      var node = this.$refs.mainTree.getCurrentNode();
      if(node==null){
        this.$commonUtil.valid.throwEx("请选择一个菜单节点");
      }
      return node;
    },
    //---------- 处理分类信息 begin -----------------------
    /**
     * 新增
     */
    addClass_func: function(data) {
      var selectClass = this.getSelectedClass();
      var entity ={
        editFlag:'add',
        parentId: selectClass.id
      };
      this.$layer.iframe({
        content: {
          content: menuClsEdit, //传递的组件对象
          parent: this,//当前的vue对象
          data:{
            list:JSON.stringify(this.dicClassList),
            entity:JSON.stringify(entity)
          }//props
        },
        area:['400px','260px'],
        shadeClose: false, 
        title: '新增菜单'
      });
    },
    /**
     * 编辑
     */
    editClass_func: function(deptNode) {
      var entity = deptNode;
      entity.editFlag='edit';
      this.$layer.iframe({
        content: {
          content: menuClsEdit, //传递的组件对象
          parent: this,//当前的vue对象
          data:{
            list:JSON.stringify(this.dicClassList),
            entity:JSON.stringify(entity)
          }//props
        },
        area:['400px','260px'],
        shadeClose: false, 
        title: '编辑菜单'
      });
    },
    /**
     * 删除
     */
    removeClass_func: function(deptNode) { 
      var entity =deptNode; 
      var $this = this;
      this.$commonUtil.message.confirm('确认删除选择的菜单【'+ entity.name +'】吗?', function(){
        httpUtil.post("product/deleteBaseClass",entity, data => {
            this.getDepartmentTree();
            $this.message.alert('删除成功!',"success");
        });
      }); 
    },
    //----------------------------------------------------

    addWin: function() {
      var selectClass = this.getSelectedClass();
      this.$layer.iframe({
        content: {
          content: menuEdit, //传递的组件对象
          parent: this, //当前的vue对象
          data: { entity: JSON.stringify({ classId: selectClass.id })} //props
        },
        area: ["600px", "400px"],
        title: "新增品名",
        shadeClose: false, 
      });
    },
    //进入编辑页面
    editWin: function(row, event) {
      var $this = this;
      this.$httpUtil.post("product/getBaseBrandInfo", row.id, entity => {
        $this.$layer.iframe({
          content: {
            content: menuEdit, //传递的组件对象
            parent: $this, //当前的vue对象
            data: { key: row.id, entity: JSON.stringify(entity) } //props
          },
          area: ["600px", "400px"],
          title: "编辑品名[" + row.name + "]",
          shadeClose: false, 
        });
      });
    },
    //作废数据
    deleteInfo(){
        //获取当前选中数据id
        var row = this.$refs.pmTable.currentRow;
        if(!row){
          this.$commonUtil.valid.throwEx("至少选择一条数据");
        }
        let $this = this;
        this.$commonUtil.message.confirm('请确认是否废弃选中品名['+row.name+']信息?',()=>{
          //发送请求删除数据
          httpUtil.post("product/deleteBrand",row, data => {
              this.$message({
                  message: '作废品名成功',
                  type: 'success'
              });
              $this.refreshList();
          });
        });
    },
    /**
     * 刷新列表
     */
    refreshList: function() {
      this.queryData();
    },
    queryData: function(param) {
      this.$refs.pager.refreshData(param);
    },
    getList: function(page, size,defaultParam) {
      //this.$layer.alert("找不到对象！");
      var param = null;
      if(defaultParam !=null){
        param = defaultParam;
      }else{
        param = this.$refs.pm_search.getParam();
      }
      param.page = page;
      param.size = size;
      var selectClass = this.$refs.mainTree.getCurrentNode();
      if(selectClass){
        //搜集左侧导航树的过滤条件
        param.classId = selectClass.id;
      }else{
        param.classId = null;
      }
      var table = this;
      httpUtil.post("product/getBaseBrandList", param, data => {
        table.dataSource = data.content;
        table.totalSize = data.total;
        //this.$refs.pagination.totalSize = data.size
      },null,false);
    }
  }
};
</script>
<style scoped>
  .block .el-tree{
    background: transparent !important;
  }
</style>

