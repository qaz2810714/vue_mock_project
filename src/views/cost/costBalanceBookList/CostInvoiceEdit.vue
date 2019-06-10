<template>
	<metro_page>
        <!-- 搜索条件区域 -->
        <metro_page_box>
            <metro_page_box_body>
	<!-- form表单显示区域 -->
		<pm_form_render :model="formModel" :rules="rules" ref="demoForm">
        	<pm_form_item row="1" labletext="发票号" name="invoiceNo" :span="22" xtype="text" lableWidth="100px"></pm_form_item>
			<pm_form_item row="2" labletext="发票类型" name="invoiceType" :span="22" xtype="select" lableWidth="100px"></pm_form_item>
        </pm_form_render>
            <!-- toolbar工具条部分 -->
			<pm_tool_bar>
            	<pm_toolButton btnName ="保存" btnIcon ="el-icon-circle-check" :btnClickFunc ='saveInvoice'></pm_toolButton>
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
				 rules: {
				},
			}
			
		},
		created(){
            this.formModel=JSON.parse(this.$options.propsData.entity);
            if(!this.formModel.invoiceNo){
                this.formModel.invoiceNo="";
            }
            if(!this.formModel.invoiceType){
                this.formModel.invoiceType=null;
            }
		},
		watch:{
		},
		computed:{
  		},
		methods:{
                //刷新主单方法
            refreshMain: function() {
                var parent = this.$options.parent;
                if (parent && parent.queryData) {
                    parent.queryData();
                }
            },
            saveInvoice:function(){
                var param=this.formModel;
                if(param.invoiceType==""){
                    param.invoiceType=null;
                }
                if(param.invoiceType!=null){
                    if((param.invoiceType=="")){
                        this.$message.error('发票类型不能为空');
                	    return;
                    }
                    if(param.invoiceNo.trim()==""){
                        this.$message.error('发票号不能为空');
                	    return;
                    }
                }else{
                    if(param.invoiceNo.trim()!=""){
                        if((param.invoiceType=="")||(param.invoiceType==null)){
                            this.$message.error('发票类型不能为空');
                            return;
                        }
                    }
                }
                httpUtil.post("balance/addInvoice",param, data => {
                    this.$message({
                        message: "发票号保存成功",
                        type: 'success'
                    });
                    this.closeWin();
                    this.refreshMain();
                });
            },
            closeWin: layerUtil.closeWin,
		}      
	}
</script>