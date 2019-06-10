<template>
<el-container>
  <el-aside width="260px" style="padding:0px;display:flex;flex-direction: column;background:#fff;margin:2px 5px 0 0">
      <p style="text-align:left;padding-left:24px;"><b>部门信息</b></p>
      <div class="block" style="overflow-y:auto;flex:1;border-right:1px solid #eee;">
      <el-tree :data="departmentTreeData" ref="deptTree" show-checkbox node-key="id" 
        :expand-on-click-node="false"  
        :default-expand-all="true"
        :check-strictly="true"  
        :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}
           <el-button
            type="text"
            size="mini"
            @click="() => editDept_func(data)">
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => removeDept_func(data)">
            删除
          </el-button>
        </span>
      </span>
      </el-tree>
      </div>
    
  </el-aside>
<el-container>
<el-main style="padding:0">
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
       <pm_toolButton btnName="新增部门" btnIcon="el-icon-circle-plus-outline" :btnClickFunc="addDept_func"></pm_toolButton>
       <pm_toolButton btnName="新增人员" btnIcon="el-icon-circle-plus-outline" :btnClickFunc="addUser_func"></pm_toolButton>
       <pm_toolButton btnName="重置密码" btnIcon="el-icon-refresh" :btnClickFunc="resetPassWord_func"></pm_toolButton>
      </pm_tool_bar>
       <!-- body内容区域 -->
      <metro_page_box_body>
        <pm_table ref="pmTable" tableKey="UserDepartmentManage-pmTable" :dataSource="dataSource" :config="config">
          <pm_column prop="name" label="用户名"  ></pm_column>
		      <pm_column prop="loginName" label="登录账号"  ></pm_column>
		      <pm_column prop="departmentId" label="部门" ></pm_column>
          <pm_column prop="remark" label="备注" ></pm_column>
          <pm_column prop="deleteFlag" label="状态" width="200"></pm_column>
        </pm_table>
        <pm_pagination ref="pager" :totalSize="totalSize" :queryData="getList"></pm_pagination>
      </metro_page_box_body>
    </metro_page_box>
  </metro_page>
</el-main>
</el-container>
</el-container>
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
import departmentEdit from "./DepartmentEdit";
import userEdit from "./UserEdit";
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
      departmentTreeData: [],
      defaultProps: {
          children: 'subNodes',
          label: 'name',
          id:'id'
      },
      config: {
        entity: null,
        allowEdit: false,
        multiple: false,
        dbclick: this.editUser_func,
        showSummary:false
      },
      totalSize:0,
      // 搜索区域条件
      searchFields: [
        {
          displayName: "用户名",
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
    addDept_func: function(data) {
      var entity ={};
      entity.editFlag='deptAdd';
      this.$layer.iframe({
        content: {
          content: departmentEdit, //传递的组件对象
          parent: this,//当前的vue对象
          data:{
            deptTree:JSON.stringify(this.departmentTreeData),
            entity:JSON.stringify(entity)
          }//props
        },
        area:['600px','350px'],
        shadeClose: false, 
        title: '新增部门'
      });
    },
    editDept_func: function(deptNode) {
      var entity = deptNode.node;
      entity.editFlag='deptEdit';
      this.$layer.iframe({
        content: {
          content: departmentEdit, //传递的组件对象
          parent: this,//当前的vue对象
          data:{
            deptTree:JSON.stringify(this.departmentTreeData),
            entity:JSON.stringify(entity)
          }//props
        },
        area:['600px','350px'],
        shadeClose: false, 
        title: '编辑部门'
      });
    },
    removeDept_func: function(deptNode) { 
      var entity =deptNode.node; 
      this.$confirm('此操作将删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
      }).then(() => {
        httpUtil.post("rbac/department/deleteDepartment",entity, data => {
            this.getDepartmentTree();
            this.$message({ type: 'success', message: '删除成功!'});
        });
      }).catch(() => {
            
      }); 
    },
    addUser_func:function(){
      var entity ={};
      entity.editFlag='userAdd';
      entity.deleteFlag = 0;
      this.$layer.iframe({
        content: {
          content: userEdit, //传递的组件对象
          parent: this,//当前的vue对象
          data:{
            deptTree:JSON.stringify(this.departmentTreeData),
            entity:JSON.stringify(entity)
          }//props
        },
        area:['700px','500px'],
        shadeClose: false, 
        title: '新增人员信息'
      });
    },
    editUser_func:function(row,event){
      row.editFlag = 'userEdit';
      row.loginPassword = '111111'
      if(row.deleteFlag){
          row.deleteFlag = 1;
      }else{
          row.deleteFlag = 0;
      };
      row.roleIds  =[];
      httpUtil.post("rbac/role/getRolesOfUser", row.id, data => {
        data.forEach(item=>{
          row.roleIds.push(item.id);
        });
        this.$layer.iframe({
          content: {
            content: userEdit, //传递的组件对象
            parent: this,//当前的vue对象
            data:{
              deptTree:JSON.stringify(this.departmentTreeData),
              entity:JSON.stringify(row)
            }//props
          },
          area:['700px','500px'],
          shadeClose: false, 
          title: '编辑人员信息'
        });
      });         
    },
    resetPassWord_func:function(){
      var row = this.$refs.pmTable.currentRow;
      if(!row){
         this.$message({
          message: '请先选择一条需要重置的人员信息。',
          type: 'warning'
        });
      }       

      var _this =this;   
      _this.$confirm('重置该人员密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        httpUtil.post("rbac/user/resetPassword",row, data => {
          _this.$alert('新密码为< '+data+' >请牢记。', '重置密码成功');          
        });
      }).catch(() => {
            
      });  
    },
    getList: function(page,size) {
      var param = this.$refs.pm_search.getParam();
      param.deptIds = this.$refs.deptTree.getCheckedKeys();
      param.page = page;
      param.size = size;
      var table = this;
      httpUtil.post("rbac/user/getUserPage",param, data => {
          table.dataSource = data.content;
          table.totalSize = data.total
      });
    },
    queryData:function(){
      this.$refs.pager.refreshData();
    },
    getDepartmentTree: function() {
      httpUtil.post("rbac/department/getDepartmentTree", {}, data => {
        this.wrapData(data);
        console.log(data);
        this.departmentTreeData = data;
      });
    },
    wrapData:function(nodes){
      nodes.forEach(node=>{
        for(var item in node){
          if(item=="node"){
             node.name = node[item].name;
             node.id = node[item].id;
             node.parentId = node[item].parentId;
             node.parentPath = node[item].parentPath;
          }else if(item == "subNodes"){
            node.children = node[item];
            this.wrapData(node[item]);
          }
      }
      });
    },
  },
  created(){

    this.getDepartmentTree();
  },
}
</script>

<style scoped>
 .el-tree {
     min-width: 100%;
     display:inline-block !important;
 }
</style>