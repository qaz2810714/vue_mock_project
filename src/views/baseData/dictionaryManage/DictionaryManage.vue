<template>
	<el-container>
		<el-aside width="240px" style="background-color: rgb(238, 241, 246);margin: 3px 5px 0 0;">
		<!-- 条件区域封装控件 -->
		<pm_dicMenu :classClick="changeClass" labelName="字典分类" 
		menuStyle='position:absolute;top:0;bottom:0;left:0;right:0;'
		filedName="className" valueKey="className" :data="dicClassList"></pm_dicMenu>
		</el-aside>
		<el-container>
  		<el-main>
			<pm_tool_bar>
        		<pm_toolButton btnName ="新增" btnPermission="btn_add"  btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='addWin' :btnDisabled="disableButton" ></pm_toolButton>
        		<!-- <pm_toolButton btnName ="修改" btnPermission="btn_update"  btnIcon ="el-icon-edit" :btnClickFunc ='editWin' :btnDisabled="disableButton" ></pm_toolButton> -->
				<pm_toolButton btnName ="作废" btnPermission="btn_del" btnIcon ="el-icon-edit" :btnClickFunc ='deleteInfo' :btnDisabled="disableButton" ></pm_toolButton>
      		</pm_tool_bar>
			<pm_table ref="pmTable" tableKey="DictionaryManage-pmTable" :dataSource="dataSource" :config="config">
				<pm_column prop="classCode" label="分类编号" width="200"></pm_column>
				<pm_column prop="className" label="分类名称" width="150"></pm_column>
				<pm_column prop="itemName" label="字典项名称" width="150"></pm_column>
				<pm_column prop="itemValue" label="字典项值" width="100"></pm_column>
				<pm_column prop="deleteFlag" label="状态" width="100"></pm_column>
				<pm_column prop="remark" label="备注"></pm_column>
			</pm_table>
			<pm_pagination ref="pager" :totalSize="totalSize" :queryData="getDicInfo"></pm_pagination>
  		</el-main>
		</el-container>
	</el-container>
</template>
<script>
import metro_page from '@/components/vitems/pageContainer/metro_page';
import metro_page_box from '@/components/vitems/pageContainer/metro_page_box';
import metro_page_box_tool_bar from '@/components/vitems/pageContainer/metro_page_box_tool_bar';
import metro_page_box_body from '@/components/vitems/pageContainer/metro_page_box_body';
import metro_pageheader from '@/components/vitems/pageheader';
import pm_form_render from '@/components/common/form/pm_form_render';
import pm_form_item from '@/components/common/form/pm_form_item';
import pm_search from '@/components/vitems/pageSearch/pm_search';
import pm_toolButton from "@/components/common/button/pm_toolButton";
import pm_tool_bar from "@/components/common/table/pm_tool_bar";
import pm_table from "@/components/common/table/pm_table";
import pm_column from "@/components/common/table/pm_column";
import httpUtil from "@/common/utils/HttpUtil";
import metadata from "@/common/entities/Metadata";
import pm_pagination from "@/components/common/table/pm_pagination";
import pm_dicMenu from "@/components/common/dicMenu/pm_dicMenu";
import dictionaryEdit from "./DictionaryEdit";
export default {
	 components: {metro_page, metro_page_box, metro_page_box_tool_bar,
			metro_page_box_body, metro_pageheader,pm_search,pm_form_item,pm_toolButton, pm_tool_bar,pm_table, pm_column,pm_pagination,pm_dicMenu},
	data:function(){
		return{
			dicClassList:[],
			selectClass:{},
			dataSource:[],
			config: {
				  entity: metadata.baseDictionary,
				  dbclick: this.editWin,
				  showSummary:false
			},
			disableButton:true,
			totalSize:0,
		}
	},
	mounted:function(){
		var _this = this;
		//加载字典分类
		httpUtil.post("dict/getDicClass", null, data => {
		    _this.dicClassList = data;
		});
	},
	methods:{
		getDicInfo : function(page,size){
			let _this = this;
			let queryParam = this.selectClass;
			queryParam.page = page;
			queryParam.size = size;
			//不使用遮罩层
			httpUtil.post("dict/getDicEntityByPage", queryParam, data => {
			_this.dataSource = data.content;
			_this.totalSize = data.total;
		},null,false);
		},
		queryData : function(){
			this.$refs.pager.refreshData();
		},
		changeClass : function(item){
			this.selectClass = item;
			if(this.selectClass.type !=3){
				this.disableButton = true;
			}
			else{
				this.disableButton = false;
			}
			this.queryData();
		},
		addWin : function(){
			let dicClass = this.selectClass;
			dicClass.editFlag = "add";
			if(!dicClass.classCode){
				this.$message({
                        message: '请先选择一条字典分类!',
                        type: 'fail'
				}); 
				return;
			}
			this.$layer.iframe({
				content: {
					content: dictionaryEdit, //传递的组件对象
					parent: this,//当前的vue对象
					data:{entity:JSON.stringify(dicClass)}//props
				},
				area:['500px','300px'],
				shadeClose: false, 
				title: '新增字典'
			});
		},
		editWin : function(){
			//获取选中行信息
			let selectRow = this.$refs.pmTable.currentRow;
			selectRow.editFlag = "update";
			if (!selectRow) {
				this.$message({
                        message: '请先选择一条字典分类!',
                        type: 'fail'
				}); 
				return;
			};
			this.$layer.iframe({
				content: {
					content: dictionaryEdit, //传递的组件对象
					parent: this,//当前的vue对象
					data:{entity:JSON.stringify(selectRow)}//props
				},
				area:['500px','300px'],
				shadeClose: false, 
				title: '修改字典'
			});
		},
		//作废选中行信息
		deleteInfo:function(){
			//获取选中行信息
			let _this = this;
			let selectRow = this.$refs.pmTable.currentRow;
			if (!selectRow) {
				this.$message({
                        message: '请先选择一条字典分类!',
                        type: 'fail'
				}); 
				return;
			};
			if(selectRow.deleteFlag == 1){
				this.$message({
                        message: '无法废弃禁用的字典项!',
                        type: 'fail'
				}); 
				return;
			}
			this.$confirm("是否确定废弃该字典项","提示",{
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type:'warning'
			}).then(()=>{
				httpUtil.post("dict/deleteDic", selectRow, data => {
					this.$message({
						message: '废弃字典信息成功',
						type: 'success'
					});
					_this.queryData();
				})
			}).catch(()=>{return;});
		},
	}
}
</script>
