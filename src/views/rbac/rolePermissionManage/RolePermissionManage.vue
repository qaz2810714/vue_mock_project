<template>
  <metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
      <metro_page_box_body>
        <!-- 条件区域封装控件 -->
        <pm_search
          ref="pm_search"
          :hasPackNoSearch="false"
          :packRowHeight="8"
          :fields="searchFields"
          :entity ="config.entity"
          v-on:getAllSearchParams="queryData"
        ></pm_search>
      </metro_page_box_body>
    </metro_page_box>
    <metro_page_box>
      <pm_tool_bar>
        <pm_toolButton btnName="新增" btnIcon="el-icon-circle-plus-outline" :btnClickFunc="add_func"></pm_toolButton>
      </pm_tool_bar>
       <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table ref="pmTable" tableKey="RolePermissionManage-pmTable" :dataSource="dataSource" :config="config">
          <pm_column prop="name" label="角色"  ></pm_column>
          <pm_column prop="remark" label="备注" ></pm_column>
          <pm_column prop="deleteFlag" label="状态" width="200"></pm_column>
          <pm_column prop="modifierName" label="更新人" width="200"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getList"></pm_pagination>
      </metro_page_box_body>
    </metro_page_box>
  </metro_page>
</template>
<script>
import metro_page from "@/components/vitems/pageContainer/metro_page";
import metro_page_box from "@/components/vitems/pageContainer/metro_page_box";
import metro_page_box_body from "@/components/vitems/pageContainer/metro_page_box_body";
import pm_search from "@/components/vitems/pageSearch/pm_search";
import metadata from '../../../common/entities/Metadata';
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";
import pm_pagination from "@/components/common/table/pm_pagination";
import httpUtil from "@/common/utils/HttpUtil";
import rolePermissionEdit from "./RolePermissionEdit";
import commonUtil from "@/common/utils/CommonUtils";
export default {
  components: {
    metro_page,
    metro_page_box,
    metro_page_box_body,
    pm_search,
    pm_toolButton,
    pm_tool_bar,
    pm_table,
    pm_column,
    pm_pagination
  },
  data: function() {
    return {
      dataSource: [],
      config: {
        entity: null,
        allowEdit: false,
        multiple: false,
        dbclick: this.editWin,
        showSummary:false
      },
      totalSize:0,
      // 搜索区域条件
      searchFields: [
        {
          displayName: "角色",
          fieldName: 'name',
          xtype: 'text',
          searchLoc: "1-1-8-8-0"
        },
        { 
          displayName: "状态", 
          fieldName: 'deleteFlag',
          xtype:'select', 
          searchLoc:"1-2-8-8-0",
          value:0
        },
        { 
          displayName: "", 
          fieldName: 'search_btn',
          xtype:'btn', 
          searchLoc:"1-3-7-8-1"
        }
      ]
    };
  },
  methods: {
    add_func: function(data) {
      var entity = {};
      entity.editFlag = '1';
      entity.deleteFlag= 0 ;
      this.$layer.iframe({
        content: {
          content: rolePermissionEdit, //传递的组件对象
          parent: this,//当前的vue对象
          data:{
            entity:JSON.stringify(entity)
          }//props
        },
        area:['700px','550px'],
        shadeClose: false, 
        title: '添加角色'
      });
    },
    //进入编辑页面
    editWin:function(row,event){
      row.editFlag = '2'
      if(row.deleteFlag){
        row.deleteFlag = 1;
      }else{
        row.deleteFlag = 0;
      }  
      
      
      this.$layer.iframe({
        content: {
          content: rolePermissionEdit, //传递的组件对象
          parent: this,//当前的vue对象
          data:{
            entity:JSON.stringify(row)
          }//props
        },
        area:['700px','550px'],
        shadeClose: false, 
        title: '编辑角色'
      });
    },
    getList: function(page,size) {
      var param = this.$refs.pm_search.getParam();
      param.page = page;
      param.size = size;
      var table = this;
      httpUtil.post("rbac/role/getRolePage",param, data => {
          table.dataSource = data.content;
          table.totalSize = data.total
      });
    },
    queryData:function(){
      this.$refs.pager.refreshData();
    }
  }
};
</script>