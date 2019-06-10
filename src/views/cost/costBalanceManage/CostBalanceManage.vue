<template>
	<metro_page>
    <!-- 搜索条件区域 -->
    <metro_page_box>
        <metro_page_box_body class="search_partition">
	        <!-- form表单显示区域 -->
		<pm_form_render :model="formModel" :rules="rules" ref="demoForm" v-bind:formReadOnly='formReadOnly'>
        	<pm_form_item row="1" labletext="货主单位" name="cstId" :span="6" xtype="select" lableWidth="100px" :readOnly='readOnly()' required></pm_form_item>
			<pm_form_item row="1" labletext="结算单位" name="settleCompanyId" :span="6" xtype="select" lableWidth="100px" required></pm_form_item>
			<pm_form_item row="1" labletext="结算清单号" name="balanceNo" :span="6" xtype="text" lableWidth="100px" :readOnly='true'></pm_form_item>
			<pm_form_item row="1" labletext="结算节点" name="balanceNode" :span="6" xtype="select" lableWidth="100px" :readOnly='readOnly()'></pm_form_item>
			<pm_form_item row="2" labletext="结算方式" name="balanceType" :span="6" xtype="select" lableWidth="100px" required></pm_form_item>
			<pm_form_item row="2" labletext="付款方式" name="payType" :span="6" xtype="select" lableWidth="100px" watchField='balanceType' required></pm_form_item>
			<pm_form_item row="2" labletext="实结金额" name="actMoney" :span="6" xtype="text" lableWidth="100px"></pm_form_item>
			<pm_form_item row="2" labletext="是否已结" name="IsSettle" :span="6" xtype="check" lableWidth="100px" watchField='actMoney'></pm_form_item>
			<pm_form_item row="3" labletext="建档日期" name="createDate" :span="6" xtype="date" lableWidth="100px" required></pm_form_item>
			<pm_form_item row="3" labletext="建档人" name="creatorName" :span="6" xtype="text" lableWidth="100px" :readOnly='true' required></pm_form_item>
            <pm_form_item row="3" labletext="结算计重" name="weightType" :span="12" xtype="radio" :radioGroup="group" lableWidth="100px" required></pm_form_item>
			<pm_form_item row="4" labletext="备注" name="memo" :span="24" xtype="textarea" lableWidth="100px"></pm_form_item>
    	</pm_form_render>
        </metro_page_box_body>
    </metro_page_box>
    <!-- 数据展示区域 -->
    <metro_page_box>
        <pm_tool_bar>
            <pm_toolButton btnName ="挑选待结算明细" btnIcon ="el-icon-circle-plus" :btnClickFunc ='selectDetail'></pm_toolButton>
            <pm_toolButton btnName ="手工新增" btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='addDetail'></pm_toolButton>
            <pm_toolButton btnName ="删除明细" btnIcon ="el-icon-circle-close-outline" :btnClickFunc ='deleteDetail' ></pm_toolButton>
        </pm_tool_bar>
    <!-- body内容区域 -->
        <metro_page_box_body>
    <!-- table结构展示 -->
            <pm_table ref="pmTable" tableKey="CostBalanceManage-pmTable" :dataSource="dataSource" :config="config" :bottomHeight="167">
                <pm_column prop="costType" label="费用类型" width="120" required :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="businessNo" label="业务单据号" width="150" :canEdit='false'></pm_column>
                <pm_column prop="packNo" label="捆包号" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="whsDayNum" label="仓储天数" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="whsFreeDayNum" label="免仓储天数" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="transferNum" label="过户次数" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="numFin" label="件数" width="150" :cellCanEdit="cellCanEdit"></pm_column>
				<pm_column prop="netWeight" label="商品净重" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="grossWeight" label="商品毛重" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="poundWeight" label="商品磅重" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="balancePreNum" label="结算量" width="150" :cellCanEdit="cellCanEdit" required></pm_column>
                <pm_column prop="unitprice" label="结算单价" width="150" :cellCanEdit="cellCanEdit" required></pm_column>
                <pm_column prop="regularUnit" label="计费单位" width="120" required :canEdit='false' watchField='costType'></pm_column>
                <pm_column prop="settleExpress" label="计算公式" width="300" required :cellCanEdit="cellCanEdit"></pm_column>
				<pm_column prop="settleAmt" label="应结金额" width="150" :cellCanEdit="cellCanEdit"></pm_column>
				<pm_column prop="settleActAmt" label="实结金额" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="brandId" label="品名" width="180" :cellCanEdit="cellCanEdit" required></pm_column>
                <pm_column prop="textureId" label="材质" width="150" :cellCanEdit="cellCanEdit" required></pm_column>
                <pm_column prop="spec" label="规格" width="150" :cellCanEdit="cellCanEdit" required></pm_column>
                <pm_column prop="producingId" label="产地" width="150" :cellCanEdit="cellCanEdit" required></pm_column>
                <pm_column prop="cardNo" label="卡号" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="balanceNode" label="结算节点" width="120" :cellCanEdit="cellCanEdit"></pm_column>
				<pm_column prop="businessType" label="业务类型" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="createTime" label="单据生成时间" width="200" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="oriPackNo" label="原捆包号" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="balanceNoType" label="结算单据类型" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="rangeApply" label="应用范围" width="150" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="whsInFirstDate" label="入库日期" width="250" :cellCanEdit="cellCanEdit"></pm_column>
                <pm_column prop="transferDate" label="过户日期" width="250" :cellCanEdit="cellCanEdit"></pm_column>
				<pm_column prop="remark" label="备注" width="250" :cellCanEdit="cellCanEdit"></pm_column>
            </pm_table>
            <!-- <pm_pagination :totalSize="totalSize" :queryData="queryData"></pm_pagination> -->
            <pm_tool_bar :noBackground="true">
            <pm_toolButton btnName ="保存" btnIcon ="el-icon-circle-check-outline" :btnClickFunc ='saveInfo'></pm_toolButton>
            <pm_toolButton btnName ="作废" btnIcon ="el-icon-circle-close" :btnClickFunc ='deleteInfo'></pm_toolButton>
            <pm_toolButton btnName ="打印" btnIcon ="el-icon-printer" :btnClickFunc ='printInfo' ></pm_toolButton>
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
    import cacheUtil from "@/common/utils/CacheUtil";
    import commonUtil from "@/common/utils/CommonUtils";
    import pm_pagination from "@/components/common/table/pm_pagination";
    import costSelectItem from "./CostSelectItem";
    export default {
        components: {metro_page, metro_page_box, metro_page_box_tool_bar,
            metro_page_box_body, metro_pageheader,pm_search,pm_form_item,pm_toolButton, pm_tool_bar,pm_table, pm_column,pm_pagination},
        data: function() {
            return {
                dataSource: [],
                config: {
                  entity: metadata.regular,
                  allowEdit: true,
                  multiple: false,
                //   rowCanEdit: function(obj) {
                //     if (obj.cstName == null) return false;
                //     return obj.cstName.includes("江阴");
                //     return false;
                //   }
                },
                rules: {
                },
                formReadOnly:false,
                totalSize:0,
                counter:0,
                group:[{key:1,value:"净重"}
                ,{key:2,value:"毛重"},
                {key:3,value:"磅重"}],
                formModel:null,
                oldDetail:[],
                balancePreNum:0,
            }
        },
        created(){
            this.formModel = this.getFormModel();
        },
        watch:{
            newValue(val, oldVal){
			//监听值发生改变，则重新计算配置信息
			if(oldVal!=undefined){
				this.changeValue(val);
            }
            }
        },
        computed:{
            newValue() {
                if(this.formModel){
                    return this.formModel.costType;
                }
      		}
  		},
        methods: {
            getFormModel(){
                var entity = this.$options.parent.propsData;
                var weightType;
                if(entity===undefined){
                    entity = {};
                    entity.IsSettle = false;
                    entity.balanceNo = this.$commonUtil.appConst.nullNo;
                    entity.creatorName = cacheUtil.getUser().configUser.name;
                    entity.createDate=new Date();
                    if(entity.detailList===undefined){
                        this.dataSource=[];
                    }else{
                        this.dataSource = entity.detailList;
                    }
        	        console.log(entity);
                }else{
                    if(!entity.balanceNo){
                        entity.balanceNo = this.$commonUtil.appConst.nullNo;
                        entity.creatorName = cacheUtil.getUser().configUser.name;
                        entity.createDate = new Date();
                        entity.balanceType=2;
                    }
                    entity.settleCompanyId=entity.balanceCompanyId;
                    if(entity.balanceStatus==2){
                        entity.IsSettle = true;
                    }else{
                        entity.IsSettle = false;
                    }
                    entity.flag=1;
                    this.oldDetail=entity.detailList;
                    entity.detailList.forEach(a=>{
                        weightType=a.balanceWeightType;
                        a.textureId=a.material;
                        a.producingId=a.productPlace;
                        a.textureId=parseInt(a.textureId);
                        a.producingId=parseInt(a.producingId);
                        if(!a.unitprice){
                            a.unitprice=a.settleUnitprice;
                        }else{
                            a.settleUnitprice=a.unitprice;
                        }
                        if(a.whsFreeDayNum==undefined){
                            a.whsFreeDayNum=a.whsFreedayNum;
                        }else{
                            a.whsFreedayNum=a.whsFreeDayNum;
                        }
                        if(weightType){
                            a.balanceWeightType=weightType;
                        }
                        if(a.balanceWeightType==1){
                            a.balancePreNum=a.netWeight;
                        }else if(a.balanceWeightType==2){
                            a.balancePreNum=a.grossWeight;
                        }else{
                            a.balancePreNum=a.poundWeight;
                        }
                        //a.balancePreNum=a.balanceNum;
                        
                        if(!entity.balanceNo){
                            a.flag=1;
                        }else{
                            a.flag=2;
                        }
                        a.balanceNoType=1;
                        if(weightType==1){
                            if(a.costType==1){
						        a.settleAmt = a.unitprice * a.balancePreNum *(a.whsDayNum-a.whsFreedayNum);
                    	        a.settleActAmt = a.settleAmt;
						        a.settleExpress="结算单价*待结算量*(仓储天数-免仓储天数)";
					        }else{
						        a.settleAmt = a.unitprice * a.netWeight;
                    	        a.settleActAmt = a.settleAmt;
						        a.settleExpress="结算单价*商品净重";
					        }
                        }else if(weightType==2){
                            if(a.costType==1){
						        a.settleAmt = a.unitprice * a.balancePreNum *(a.whsDayNum-a.whsFreedayNum);
                    	        a.settleActAmt = a.settleAmt;
						        a.settleExpress="结算单价*待结算量*(仓储天数-免仓储天数)";
					        }else{
						        a.settleAmt = a.unitprice * a.netWeight;
                    	        a.settleActAmt = a.settleAmt;
						        a.settleExpress="结算单价*商品毛重";
					        }
                        }else{
                            if(a.costType==1){
						        a.settleAmt = a.unitprice * a.balancePreNum *(a.whsDayNum-a.whsFreedayNum);
                    	        a.settleActAmt = a.settleAmt;
						        a.settleExpress="结算单价*待结算量*(仓储天数-免仓储天数)";
					        }else{
						        a.settleAmt = a.unitprice * a.netWeight;
                    	        a.settleActAmt = a.settleAmt;
						        a.settleExpress="结算单价*商品磅重";
					        }
                        }
                        
                    });
                    entity.weightType=weightType;
                    this.dataSource = entity.detailList;
                }    	
        	    return entity;
            },
            //更新界面状态
            initFormState: function(data) {
                if(data.flag){
                    this.formModel={};
                    this.formModel.balanceNo=this.$commonUtil.appConst.nullNo;
                    this.dataSource=[];
                }else{
                    this.$set(this.formModel,'balanceNo',data.balanceNo);
                    data.details.forEach(a=>{
                        a.unitprice=a.settleUnitprice;
                        a.whsFreeDayNum=a.whsFreedayNum;
                        a.balancePreNum=a.balanceNum;
                    });
                    this.dataSource=data.details;
                }
            },
            selectDetail:function(parent){
                var $this = this;
                var cstIdNo=this.formModel.cstId;
                var oldList = this.dataSource;
                if(cstIdNo==null || cstIdNo==""){
                    this.$message.error('请选择货主单位');
                    return;
                }
                this.$layer.iframe({
                    content: {
                    content: costSelectItem, //传递的组件对象
                    parent: this, //当前的vue对象
                    data: { 
                        entity: JSON.stringify({cstIdNo:cstIdNo}),
                        selected: function (rows) {
                            console.log(rows);
                            var packNoList = [];
                            rows.forEach(a => {
                                $this.wrapData($this.formModel,a);
                                a.flag=1;
                                if (oldList.length != 0) {
                                    var count=0;
                                    oldList.forEach(b => {
                                        if (b.costType === a.costType && b.packNo === a.packNo) {
                                            count=0;
                                            return;
                                        } else {
                                            count++;
                                        }
                                    });
                                    if(count!=0){
                                        $this.dataSource.push(a);
                                    }
                                } else {
                                    $this.dataSource.push(a);
                                }
                            });
                        }
                    }   
                },
                area: ["1000px", "600px"],
                shadeClose: false, 
                title: "待结算明细"
                });
            },
            queryData: function(data){
                console.log(data);              
            },
            readOnly:function(){
                var entity= this.formModel;
                var result=false;
                if(entity.flag===1){
                    result=true;
                }
                return result;
            },
            cellCanEdit: function(obj) {
                if(obj.flag==1){
                    return false;
                }else{
                    return true;
                }
            },
            getTableInfo: function(row) {
              console.log(row);
            },
            addDetail:function(){
                var $this = this;
                if(!$this.dataSource){
                   $this.dataSource = []; 
                }
                var detail = {whsDayNum:0,
								whsFreeDayNum:0,
								numFin:0,
								unitprice:0,
								netWeight:0,
								grossWeight:0,
                                poundWeight:0,
                                settleAmt:0,
                                settleActAmt:0,
                                balancePreNum:0,
                                balanceNoType:1,
                                flag:2};
                this.counter += 1;
                detail.index = this.counter;
                $this.dataSource =  $this.dataSource.concat(detail);
            },
            deleteDetail:function(){
                //返回选中的数据
                var rows=[];
                var row = this.$refs.pmTable.currentRow;
                //从数据源中移除数据
                if(row==undefined){
                    this.$message.error('请选择一笔资料');
                    return;
                }
                rows.push(row);
                commonUtil.removeSelectedRows(rows, this.dataSource,(data,row)=>{
                    return (data.costType == row.costType) && (data.packNo == row.packNo);
                });
                //从数据源中移除数据
                //commonUtil.removeSelectedRows2(rows,this.dataSource);
            },
            saveInfo:function(){
                var $this=this;
                var flag="save";
                var param=this.formModel;
                if(param.actMoney==undefined){
                    param.actMoney=0;
                }
                if(param.IsSettle){
                    param.balanceStatus=2;
                }else{
                    param.balanceStatus=1
                }
                this.$refs["demoForm"].validate(this);
                param.balanceCompanyId=param.settleCompanyId;
                param.details=this.dataSource;
                if(param.details.length===0){
                    this.$message.error('请至少添加一笔明细资料');
                    return;
                }
                param.details.forEach(a=>{
                    a.id=undefined;
                    a.settleUnitPrice=a.unitprice;
                    a.whsFreedayNum=a.whsFreeDayNum;
                    if(a.balanceWeightType==1){
                        if(a.balancePreNum>a.netWeight){
                        commonUtil.valid.throwEx('结算量不能大于计费结算量，请检查！');
                    }
                    }else if(a.balanceWeightType==2){
                        if(a.balancePreNum>a.grossWeight){
                        commonUtil.valid.throwEx('结算量不能大于计费结算量，请检查！');
                    }
                    }else{
                        if(a.balancePreNum>a.poundWeight){
                        commonUtil.valid.throwEx('结算量不能大于计费结算量，请检查！');
                    }
                    }
                });
                this.$refs.pmTable.validator();
                httpUtil.post("balance/addBalance",param, data => {
                        this.$message({
                            message: '结算单保存成功',
                            type: 'success'
                        });
                        $this.initFormState(data);
                    });
            },
            deleteInfo:function(){
                var flag="del";
                var $this=this;
                var param=this.formModel;
                if(param.balanceNo==this.$commonUtil.appConst.nullNo){
                    this.$message.error('请先保存结算单后再进行作废操作！');
                    return;
                }
                if(this.oldDetail.length!=this.dataSource.length){
                    this.$message.error('请先保存结算单后再进行作废操作！');
                    return;
                }
                httpUtil.post("balance/deleteBalance",param, data => {
                        this.$message({
                            message: '结算单作废成功',
                            type: 'success'
                        });
                        data.flag=flag;
                        //重新刷新表单
                        $this.initFormState(data);
                    });
            },
            printInfo:function(){},
            wrapData(entity,a){
				a.whsInFirstDate=a.whsinTime;
                a.producingId=a.productPlace;
                a.whsFreedayNum=a.whsFreeDayNum;
				if(entity.weightType==1){
                    a.balanceWeightType=1;
					if(a.costType==1){
						a.settleAmt = a.unitprice * a.balancePreNum *(a.whsDayNum-a.whsFreedayNum);
                    	a.settleActAmt = a.settleAmt;
						a.settleExpress="结算单价*待结算量*(仓储天数-免仓储天数)";
					}else{
						a.settleAmt = a.unitprice * a.netWeight;
                    	a.settleActAmt = a.settleAmt;
						a.settleExpress="结算单价*商品净重";
					}
				}else if(entity.weightType==2){
                    a.balanceWeightType=2;
					if(a.costType==1){
						a.settleAmt = a.unitprice * a.balancePreNum *(a.whsDayNum-a.whsFreedayNum);
                    	a.settleActAmt = a.settleAmt;
						a.settleExpress="结算单价*待结算量*(仓储天数-免仓储天数)";
					}else{
						a.settleAmt = a.unitprice * a.grossWeight;
                    	a.settleActAmt = a.settleAmt;
						a.settleExpress="结算单价*商品毛重";
					}
				}else{
                    a.balanceWeightType=3;
					if(a.costType==1){
						a.settleAmt = a.unitprice * a.balancePreNum *(a.whsDayNum-a.whsFreedayNum);
                    	a.settleActAmt = a.settleAmt;
						a.settleExpress="结算单价*待结算量*(仓储天数-免仓储天数)";
					}else{
						a.settleAmt = a.unitprice * a.poundWeight;
                    	a.settleActAmt = a.settleAmt;
						a.settleExpress="结算单价*商品磅重";
					}
				}
			},
        }
    }
</script>

<style>
.pmtable.pmtable28 .el-table__body tr.current-row td {
    background-color: #5253ab;
    color: white;
}
</style>