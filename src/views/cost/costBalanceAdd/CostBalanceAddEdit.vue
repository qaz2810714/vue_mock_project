<template>
	<metro_page>
        <!-- 搜索条件区域 -->
        <metro_page_box>
            <metro_page_box_body>
	<!-- form表单显示区域 -->
		<pm_form_render :model="formModel" :rules="rules" ref="demoForm">
        	<pm_form_item row="1" labletext="收费项目" name="costType" :span="12" xtype="select" lableWidth="100px"></pm_form_item>
			<pm_form_item row="1" labletext="计费单位" name="regularUnit" :span="12" xtype="select" lableWidth="100px" watchField='costType'></pm_form_item>
			<pm_form_item row="2" labletext="应用范围" name="rangeApply" :span="12" xtype="select" lableWidth="100px"></pm_form_item>
			<pm_form_item row="2" labletext="是否统一单价" name="isUnifyUnitPrice" :span="12" xtype="radio" :radioGroup="group" lableWidth="100px" watchField='rangeApply'></pm_form_item>
			<pm_form_item row="3" labletext="统一单价" name="unifyUnitPrice" :span="12" xtype="text" lableWidth="100px" watchField='isUnifyUnitPrice'></pm_form_item>
        </pm_form_render>
            </metro_page_box_body>
        </metro_page_box> 

		<!-- 数据展示区域 -->
        <metro_page_box>
            <!-- body内容区域 -->
            <metro_page_box_body>
        <pm_tool_bar>
    	    <pm_toolButton ref="setUnitPrice" btnName ="单价赋值" btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='setUnitprice'></pm_toolButton>
        </pm_tool_bar>
            
            <pm_table ref="pmTable" tableKey="CostBalanceAddEdit-pmTable" :dataSource="dataSource" :config="config">
      			<pm_column prop="brandId" label="品名" width="300" placeholder :canEdit='false'></pm_column>
      			<pm_column prop="unitprice" label="单价" width="300" placeholder></pm_column>
    		</pm_table>      
            <!-- toolbar工具条部分 -->
			<pm_tool_bar>
            	<pm_toolButton btnName ="保存" btnIcon ="el-icon-circle-check" :btnClickFunc ='saveInfo'></pm_toolButton>
            	<pm_toolButton btnName ="关闭" btnIcon ="el-icon-circle-close"  :btnClickFunc ='closeWin'></pm_toolButton>
        	</pm_tool_bar>
            </metro_page_box_body>
        </metro_page_box>
	</metro_page>
</template>

<script>
	import metro_page from '@/components/vitems/pageContainer/metro_page';
	import metro_page_box from '@/components/vitems/pageContainer/metro_page_box';
    import metro_page_box_tool_bar from '@/components/vitems/pageContainer/metro_page_box_tool_bar';
    import metro_page_box_body from '@/components/vitems/pageContainer/metro_page_box_body';
	import pm_form_render from '@/components/common/form/pm_form_render';
	import pm_form_item from '@/components/common/form/pm_form_item';
	import pm_toolButton from "@/components/common/button/pm_toolButton";
	import pm_tool_bar from "@/components/common/table/pm_tool_bar";
	import pm_table from "@/components/common/table/pm_table";
	import pm_column from "@/components/common/table/pm_column";
	import pm_radio from "@/components/common/radio/pm_radio";
	import metadata from "@/common/entities/Metadata";
	import commonUtil from "@/common/utils/CommonUtils";
	import cacheUtil from "@/common/utils/CacheUtil";
	import httpUtil from "@/common/utils/HttpUtil";
	import pm_pagination from "@/components/common/table/pm_pagination";
	import costSelectItem from "@/views/cost/costBalanceManage/CostSelectItem";
	import layerUtil from "@/common/utils/LayerUtil";
	export default {
		components: {metro_page, metro_page_box, metro_page_box_tool_bar,pm_tool_bar,pm_toolButton,
			pm_table,pm_column,metro_page_box_body, pm_form_item,pm_radio,pm_pagination},
		data: function(){
			return{
				dataSource: [],
				dataList:[],
				config: {
                	entity: metadata.regular,
                	allowEdit: true,
                	multiple: false,
				},
				 rules: {
				},
				formModel:{},
				counter:0,
				totalSize:0,
				group:[{key:1,value:"是"},{key:2,value:"否"}],
			}
			
		},
		created(){
			this.getFormModel();
		},
		watch:{
			costType(val, oldVal){
			//监听值发生改变，则重新计算配置信息
				if(oldVal!=undefined){
					this.changeValue(val);
				}
			},
			isUnifyUnitPrice(val, oldVal){
				if(val==1){
					this.$refs["setUnitPrice"].disabled=false;
				}else{
					this.$refs["setUnitPrice"].disabled=true;
				}
			}
		},
		computed:{
    		costType() {
        		return this.formModel.costType;
			  },
			isUnifyUnitPrice(){
				return this.formModel.isUnifyUnitPrice;
			}
  		},
		methods:{
			Init:function(entity){
				entity.costType=1;
				entity.rangeApply=1;
			},
			changeValue:function(val){
				var paramList=[];
				var oldBrandId;
				for(var i=0;i<this.dataList.length;i++){
					if(i==0){
						oldBrandId=this.dataList[i].brandId;
						this.dataList[i].regularType=val;
						paramList.push(this.dataList[i]);
					}else{
						if(oldBrandId=this.dataList[i].brandId){
							continue;
						}else{
							this.dataList[i].regularType=val;
							paramList.push(this.dataList[i]);
						}
					}
				}
				// this.dataList.forEach(a=>{
				// 	a.regularType=val;
				// 	paramList.push(a);
				// });
				httpUtil.post("regular/getRegularDetailBS", paramList, data => {
					this.dataSource=data;
				});
			},
			closeWin: layerUtil.closeWin,
			saveInfo:function(){
                //返回选中的数据
				var rows = this.dataSource;
				var result=this.wrapData(this.dataList,rows);
				//触发选中事件
				this.$options.propsData.selected(result);
				//关闭系统
                this.closeWin();
			},
			getFormModel:function(){
				//debugger;
				var entity = JSON.parse(this.$options.propsData.entity);
				var list=entity.list;
					// if(list){
					// 	return;
					// }
					// list.forEach(a=>{
					// 	if(entity.costType===2){
					// 		a.unitprice=10;
					// 	}
					// })
				this.dataSource=list;
				this.formModel= entity;				
				this.dataList=entity.detailList;
				this.dataList.forEach(a=>{
					a.businessNo=entity.businessNo;
					a.costType=entity.regularType;
					a.rangeApply=entity.rangeApply;
					a.regularUnit=entity.regularUnit;
					a.cstId=entity.cstId;
				});
			},
			wrapData(list1,list2){
				var entity=this.formModel;
				var $this = this;
				list1.forEach(a => {
					a.costType = entity.costType;
					list2.forEach(b=>{
						if(a.brandId===b.brandId){
							a.unitprice=b.unitprice;
							a.regularDetailNo=b.regularDetailNo;
						}
					})
				});
				return list1;
			},
			setUnitprice(){
				var unifyUnitPrice=this.formModel.unifyUnitPrice;
				this.dataSource.forEach(a=>{
					a.unitprice=unifyUnitPrice;
				});
			}
		}      
	}
</script>