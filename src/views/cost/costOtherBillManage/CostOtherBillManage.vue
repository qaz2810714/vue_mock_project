<template>
	<!-- <section>其他计费单登记

	</section> -->
	<metro_page>
        <!-- 搜索条件区域 -->
        <metro_page_box class="search_partition">
            <metro_page_box_body>
	<!-- form表单显示区域 -->
		<pm_form_render :model="formModel" :rules="rules" ref="demoForm" :formReadOnly="formReadOnly">
        	<pm_form_item row="1" labletext="作业单号" name="businessOtherNo" :span="8" xtype="text" lableWidth="100px" :readOnly='true'></pm_form_item>
			<pm_form_item row="1" labletext="货主" name="cstId" :span="8" xtype="select" lableWidth="100px" required></pm_form_item>
			<pm_form_item row="1" labletext="业务类型" name="businessType" :span="8" xtype="select" lableWidth="100px" :readOnly='true' required></pm_form_item>
			<pm_form_item row="2" labletext="制单人" name="creatorName" :span="8" xtype="text" lableWidth="100px" :readOnly='true'></pm_form_item>
			<pm_form_item row="2" labletext="制单日期" name="createDate" :span="8" xtype="date" lableWidth="100px" required></pm_form_item>
			<pm_form_item row="2" labletext="计重方式" name="balanceWeightType" :span="8" xtype="radio" :radioGroup="group" lableWidth="100px" required ></pm_form_item>
			<!-- <pm_radio :menu="group"></pm_radio> -->
            <!-- <pm_form_item row="1" labletext="库位" name="test" :span="10" xtype="treeSelect" lableWidth="50px"></pm_form_item> -->
    	</pm_form_render>
            </metro_page_box_body>
        </metro_page_box>

		<!-- 数据展示区域 -->
        <metro_page_box>
            <!-- body内容区域 -->
            <metro_page_box_body>
            <!-- toolbar工具条部分 -->
        <pm_tool_bar>
            <pm_toolButton ref="add" btnName ="新增明细" btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='addDetail' :btnDisabled="changeBtn"></pm_toolButton>
            <pm_toolButton ref="delete" btnName ="删除明细" btnIcon ="el-icon-remove-outline"  :btnClickFunc ='deleteDetail' :btnDisabled="changeBtn"></pm_toolButton>
            <pm_toolButton ref="clear" btnName ="清空明细" btnIcon ="el-icon-delete" :btnClickFunc ='clearDetail' :btnDisabled="changeBtn"></pm_toolButton>
        </pm_tool_bar>
            <pm_table ref="pmTable" :dataSource="dataSource" tableKey="CostRegularManage-pmTable" 
			    :config="config" :bottomHeight="168">
      			<pm_column prop="packNo" label="捆包号" width="180" placeholder="请输入捆包号"></pm_column>
      			<pm_column prop="brandId" label="品名" width="180" placeholder required></pm_column>
      			<pm_column prop="textureId" label="材质" width="150" watchField="brandId"></pm_column>
      			<pm_column prop="spec" label="规格" width="150" placeholder></pm_column>
      			<pm_column prop="producingId" label="产地" width="180" placeholder></pm_column>
      			<pm_column prop="whsDayNum" label="仓储天数" width="150" placeholder></pm_column>
      			<pm_column prop="whsFreeDayNum" label="免仓储天数" width="150" placeholder></pm_column>
      			<pm_column prop="costType" label="费用类型" width="150" required placeholder></pm_column>
      			<pm_column prop="unitprice" label="单价" width="150" placeholder></pm_column>
      			<pm_column prop="regularUnit" label="计费单位" width="120" placeholder watchField='costType' :canEdit='false' required></pm_column>
				<pm_column prop="numFin" label="商品件数" width="150" placeholder></pm_column>
      			<pm_column prop="netWeight" label="商品净重" width="150" placeholder></pm_column>
      			<pm_column prop="grossWeight" label="商品毛重" width="150" placeholder></pm_column>
      			<pm_column prop="poundWeight" label="商品磅重" width="150" placeholder></pm_column>
      			<pm_column prop="cstId" label="货主" width="200" placeholder></pm_column>
      			<pm_column prop="whsType" label="仓库类型" width="120" placeholder></pm_column>
      			<pm_column prop="whsCalcStackId" label="库房" width="150" parentPropName='whsRoomId' childPropName='whsAreaId'></pm_column>
      			<pm_column prop="whsStackName" label="库位" width="120" placeholder></pm_column>
      			<pm_column prop="cardNo" label="卡号" width="120" placeholder></pm_column>
      			<pm_column prop="remark" label="备注" width="120" placeholder></pm_column>
    		</pm_table>
			<pm_tool_bar :noBackground="true">
            <pm_toolButton ref="saveInfo" btnName ="保存" btnIcon ="el-icon-circle-check-outline" :btnClickFunc ='saveInfo' :btnDisabled="changeBtn"></pm_toolButton>
            <pm_toolButton ref="settle" btnName ="结算" btnIcon ="el-icon-sold-out"  :btnClickFunc ='settle'></pm_toolButton>
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
	import cacheUtil from "@/common/utils/CacheUtil";
	import commonUtil from "@/common/utils/CommonUtils";
	import httpUtil from "@/common/utils/HttpUtil";
	import costBalanceAddManage from "@/views/cost/costBalanceAdd/CostBalanceAddManage";
	import { tableReload } from "@/components/common/table/table-reload";
	export default {
		components: {metro_page, metro_page_box, metro_page_box_tool_bar,pm_tool_bar,pm_toolButton,
			pm_table,pm_column,metro_page_box_body, pm_form_item,pm_radio},
		mixins: [tableReload],
		data: function(){
			return{
				dataSource: [],
				config: {
                	entity: metadata.regular,
                	allowEdit: true,
					multiple: true,
					showSummary: false,
            	},
				 rules: {
				},
				formReadOnly:false,
				counter:0,
				totalSize:0,
				group:[{key:1,value:"净重"},{key:2,value:"毛重"},{key:3,value:"磅重"}],
				formModel:null,
				changeBtn:false,
			}
			
		},
		created(){
			this.formModel=this.getFormModel();
		},
		computed:{
  		},
		methods:{
			getFormModel(){
				var entity ={};	
				entity.businessOtherNo = this.$commonUtil.appConst.nullNo;
				entity.creatorName = cacheUtil.getUser().configUser.name;
				entity.businessType=5;
				entity.createDate=new Date();
        		return entity;
			},
			//更新界面状态
            initFormState: function(data) {
				//this.formModel=data;
				this.formModel.businessOtherNo=data.businessOtherNo;
				data.detail.forEach(element => {
					element.textureId=parseInt(element.material);
					element.producingId=parseInt(element.productPlace);
				});
				this.dataSource=data.detail;
				this.changeBtn=true;
				this.formReadOnly = true;
            },
			addDetail:function(){
				var $this = this;
				var param=this.formModel;
				if(param.cstId===undefined){
					this.$message.error('请选择货主单位');
                	return;
				}
            	if(!$this.dataSource){
                   $this.dataSource = []; 
            	}
				var detail = {cstId:param.cstId,
								whsDayNum:0,
								whsFreeDayNum:0,
								numFin:0,
								unitprice:0,
								netWeight:0,
								grossWeight:0,
								poundWeight:0};
            	this.counter += 1;
            	detail.index = this.counter;
            	$this.dataSource =  $this.dataSource.concat(detail);
			},
			deleteDetail:function(){
				//返回选中的数据
            	var rows = this.$refs.pmTable.getSelectedRows();
            	if(rows.length==0){
                	this.$message.error('请选择一笔资料');
                	return;
            	}
            	//从数据源中移除数据
            	commonUtil.removeSelectedRows2(rows,this.dataSource);
			},
			clearDetail:function(){
				//返回选中的数据
            	var rows = this.$refs.pmTable.getTableInfo();
            	//从数据源中移除数据
            	commonUtil.removeSelectedRows2(rows,this.dataSource);
			},
			saveInfo:function(){
				var $this=this;
				var param=this.formModel;
				//组装数据
				param.detail=this.dataSource;
            	if(param.detail.length===0){
                	this.$message.error('请添加明细资料');
                	return;
				}
				param.detail.forEach(a => {
					if (a.unitprice===0)
                	{
                    	commonUtil.valid.throwEx('单价不能为0，请检查！');
					}
					if(param.balanceWeightType==1){
						if(a.netWeight==0){
							commonUtil.valid.throwEx('商品净重不能为0，请检查！');
						}
						a.balancePreNum = a.netWeight;
					}
					else if(param.balanceWeightType==2){
						if(a.grossWeight==0){
							commonUtil.valid.throwEx('商品毛重不能为0，请检查！');
						}
						a.balancePreNum = a.grossWeight;
					}else{
						if(a.poundWeight==0){
							commonUtil.valid.throwEx('商品磅重不能为0，请检查！');
						}
						a.balancePreNum = a.poundWeight;
					}
					a.balanceNum=0;
					a.material=a.textureId;
					a.productPlace=a.producingId;
					a.createDate = param.createDate;
					a.transferNum=0;
					a.whsInFirstDate=$this.changDate(a.whsDayNum);					
				});
				this.$refs.pmTable.validator();
				httpUtil.post("BalanceList/addOtherBalanceList",param, data => {
                this.$message({
                    message: "新增其他计费单成功",
                    type: 'success'
				});
				
				//重新刷新表单
                $this.initFormState(data);
            });
                
			},
			settle:function(){
				if ((this.formModel.businessOtherNo)==="系统自动生成")
            	{
                	this.$message.error('先新增计费单，方可结算');
            	}else{
					var details=this.$commonUtil.appConst.deepClone(this.dataSource);
					this.formModel.detailList=details;
					const costBalanceItem = {
                		component: costBalanceAddManage,
                		propsData:{entity:this.formModel},
                		name: "新增结算单",
            		}
            		this.$tab.open(costBalanceItem);
				}				
			},
			changDate:function(AddDayCount){
				var dd=new Date();
				dd.setDate(dd.getDate()-AddDayCount);//获取AddDayCount天后的日期 
				var y = dd.getFullYear(); 
				var m = dd.getMonth()+1;//获取当前月份的日期 
				if(parseInt(m)<10){
					m="0"+m;
				}
				var d = dd.getDate();
				if(parseInt(d)<10){
					d="0"+d;
				}
				return y+"-"+m+"-"+d; //返回计算后的日期
			}
		}      
	}
</script>