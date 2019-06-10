<template>
    <metro_page>
        <!-- 搜索条件区域 -->
        <metro_page_box>
            <metro_page_box_body class="edit_padding">
                <pm_form_render :model="formModel" :rules="rules" ref="demoForm" :entity='config.entity' v-bind:formReadOnly='formReadOnly'>
                    <pm_form_item row="1" labletext="移库单号" name="moveNo" :span="8" xtype="text" lableWidth="70px" :readOnly='true'></pm_form_item>
                    <pm_form_item row="1" labletext="仓库" name="whsShortName" :span="8" xtype="text" lableWidth="70px" :readOnly='true'></pm_form_item>
                    <pm_form_item row="1" labletext="制单人" name="creatorName" :span="8" xtype="text" lableWidth="70px" :readOnly='true'></pm_form_item>
                    <pm_form_item row="2" labletext="移库状态" name="moveStatus" :span="8" xtype="select" lableWidth="70px" :readOnly='true'></pm_form_item>
                    <pm_form_item row="2" labletext="收发人" name="transceiver" :span="8" xtype="select_batch" lableWidth="70px"></pm_form_item>
                    <pm_form_item row="2" labletext="制单时间" name="createTime" :span="8" xtype="datetime" lableWidth="70px" :readOnly='true'></pm_form_item>
                    <pm_form_item row="3" labletext="备注" name="remark" :span="24" xtype="textarea" lableWidth="70px" :rowHeight='2'></pm_form_item>
                </pm_form_render>
                <pm_tool_bar>
                    <pm_toolButton ref="select" btnName ="挑选明细" btnIcon ="el-icon-circle-plus-outline" :btnClickFunc ='getStock'></pm_toolButton>
                    <pm_toolButton ref="remove" btnName ="移除" btnIcon ="el-icon-remove-outline" :btnClickFunc ='deleteRows'></pm_toolButton>
                </pm_tool_bar>
            </metro_page_box_body>
        </metro_page_box>

        <!-- 数据展示区域 -->
        <metro_page_box>
            <!-- body内容区域 -->
            <metro_page_box_body>
                <pm_table ref="pmTable" tableKey="NoteWhsMoveEdit-pmTable" :dataSource="dataSource" :config="config" :bottomHeight="170">
                    <pm_column prop="cstId" label="货主单位" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="cardNo" label="卡号" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="packNo" label="捆包号" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="brandId" label="品名" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="textureId" label="材质" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="spec" label="规格" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="producingId" label="产地" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="calcType" label="计重方式" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="measurementUnit" label="数量单位" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="amount" label="数量" width="200" required></pm_column>
                    <pm_column prop="netWeight" label="净重" width="200" required></pm_column>
                    <pm_column prop="grossWeight" label="毛重" width="200"></pm_column>
                    <pm_column prop="poundWeight" label="磅重" width="200"></pm_column>
                    <pm_column prop="unitNumber" label="单包支数" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="originCalcStackId" type="stackSelect" label="原始库区" :canEdit='false' width="200" parentPropName='originRoomId' childPropName='originAreaId'></pm_column>
                    <pm_column prop="originStackName" label="原始库位" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="originLayer" label="原始层" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="targetCalcStackId" type="stackSelect" label="目标库区" required width="200" parentPropName='targetRoomId' childPropName='targetAreaId'></pm_column>
                    <pm_column prop="targetStackName" label="目标库位" required width="200"></pm_column>
                    <pm_column prop="targetLayer" label="目标层" width="200"></pm_column>
                    <pm_column prop="whsinTime" label="入库时间" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="stoveCode" label="炉号" width="200" :canEdit='false'></pm_column>
                    <pm_column prop="remark" label="备注" width="200"></pm_column>
                </pm_table>
            </metro_page_box_body>
        </metro_page_box>

         <!-- 页面操作区域 -->
         <metro_page_box>
            <metro_page_box_body>
                <pm_tool_bar :noBackground='true'>
                    <pm_toolButton ref="add" btnName ="保存" btnIcon ="el-icon-edit-outline" :btnClickFunc ='saveInfo'></pm_toolButton>
                    <pm_toolButton ref="save" btnName ="保存并审核" btnIcon ="el-icon-edit-outline" :btnClickFunc ='saveAndAuditInfo'></pm_toolButton>
                    <pm_toolButton ref='btn_print' btnName ="打印" btnIcon ="el-icon-printer" :btnClickFunc ='printInfo'></pm_toolButton>
                    <pm_toolButton ref="cost" btnName ="结算" btnIcon ="el-icon-tickets" :btnClickFunc ='settleInfo'></pm_toolButton>
                    <pm_toolButton ref='close' btnName ="关闭" btnIcon ="el-icon-error" :btnClickFunc ='closeWin'></pm_toolButton>
                </pm_tool_bar>
            </metro_page_box_body>
        </metro_page_box>
        <noteWhsMovePrint ref="print" v-show="false"></noteWhsMovePrint>
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
    import pm_pagination from "@/components/common/table/pm_pagination";
    import cacheUtil from "@/common/utils/CacheUtil";
    import layerUtil from "@/common/utils/LayerUtil";
    import commonUtil from "@/common/utils/CommonUtils";
    import costBalanceAddManage from "@/views/cost/costBalanceAdd/CostBalanceAddManage";
    import printJS from 'print-js'
    import noteWhsMovePrint from "./NoteWhsMovePrint";
    const statusEnum = {
        STATUS_READY:1, //待移库
        STATUS_SUCC:2,//移库完成
        STATUS_DELETE:3,//已废弃
    };
    const operTypeEnum = {
        OPER_ADD:'3',//新增
        OPER_EDIT:'1',//修改
        OPER_ADJUST:'2',//调整
    };
    export default {
        components: {metro_page, metro_page_box, metro_page_box_tool_bar,
            metro_page_box_body, metro_pageheader,pm_search,pm_form_item,pm_toolButton, pm_tool_bar,pm_table, pm_column,pm_pagination,noteWhsMovePrint},
        data: function() {
            return {
                dataSource: [],
                config: {
                  entity: metadata.wmsMove,
                  allowEdit: true,
                  multiple: true,
                  change:function(row,prop,val){
                      var brand= cacheUtil.getDic().BrandNameList.list.filter(item => item.id === row.brandId)[0];
                      if(!brand){
                          return;
                      }
                      if(row.calcType != 1 || brand.whsoutType == 2)
                      {
                        //非理计产品,按品名吨计 不做计算
                        return;
                      }
                      if (prop == "amount"){
                        var newValue = row.amount;
                        row.amount = newValue;
                        this.$set(row,'netWeight',(newValue * row.netUnit).toFixed(3));
                        this.$set(row,'grossWeight',(newValue * row.grossUnit).toFixed(3));
                        this.$set(row,'poundWeight',(newValue * row.poundUnit).toFixed(3));
                      }
                  }
                },
                totalSize:0,
                rules: {
                    
                },
                formReadOnly:false,
                deleteIdList:[],
                delPackNoList:[],
                formModel:Object
            }
        },
        created(){
            //获取数据源
            this.formModel = this.getFormModel();
        },
        mounted(){
           var hasSaveAuth = this.$commonUtil.permission.hasSaveAuth(this);
           var hasCheckAuth = this.$commonUtil.permission.hasCheckAuth(this);
           var hasPrintAuth = this.$commonUtil.permission.hasPrintAuth(this);
            //根据操作类型处理按钮的显示
           if(this.formModel.editFlag == operTypeEnum.OPER_ADJUST){
               this.$refs.save.setDisabled(true);
               this.$refs.cost.setDisabled(false);
           }else if(this.formModel.editFlag == operTypeEnum.OPER_EDIT){
               this.$refs.cost.setDisabled(true);
               if(this.formModel.moveStatus == statusEnum.STATUS_SUCC){
                    this.$refs["add"].setDisabled(true);
                    this.$refs["save"].setDisabled(true);
                    this.$refs["cost"].setDisabled(false);
                    this.$refs["select"].setDisabled(true);
                    this.$refs["remove"].setDisabled(true);
               }
           }else{
               this.$refs.cost.setDisabled(true);
               this.$refs["btn_print"].setDisabled(true);
           }
           if(!hasSaveAuth){
               this.$refs["add"].setDisabled(true);
           }
           if(!hasCheckAuth){
               this.$refs["save"].setDisabled(true);
           }
           if(!hasPrintAuth){
                this.$refs["btn_print"].setDisabled(true);
           }
        },
        methods: {
            printInfo:function(){
                let _this = this;
                this.$commonUtil.getDetailEntity("whsmove/getMoveDetailByMainId",
                    {moveMainId: this.formModel.id},
                        this.formModel,
                    function(entity){
                        _this.$refs.print.printDiv(entity);
                });
            },
            getFormModel:function(){
               //获取数据源
                var entity = this.$options.parent.propsData.entity;
                entity.whsShortName = cacheUtil.getUser().accountName;
                var aaa = cacheUtil.getUser();
                if(entity.editFlag == operTypeEnum.OPER_ADD){//新增操作
                    entity.moveNo = this.$commonUtil.appConst.nullNo;
                    entity.creatorName = cacheUtil.getUser().configUser.name;
                    entity.moveStatus = 1;
                }else if(entity.editFlag == operTypeEnum.OPER_EDIT){//编辑操作
                    //如果是已完成状态的单据 禁用整个界面
                    if(entity.moveStatus == 2){
                        this.formReadOnly = true;
                        this.config.allowEdit = false;
                    }
                    this.calcUnit(entity.detailList,false);
                }else if(entity.editFlag == operTypeEnum.OPER_ADJUST){
                    this.calcUnit(entity.detailList,false);
                }
                this.dataSource = entity.detailList;
                return entity;
            },
            deleteRows: function() {
              var $this = this;
              //返回选中的数据
              var rows = this.$refs.pmTable.getSelectedRows();
              if(rows == null || rows.length<=0){
                this.$commonUtil.valid.throwEx(this, "请先选择一条需要移除的数据!");
              }
              //从数据源中移除数据
              commonUtil.removeSelectedRows(rows,this.dataSource,(pack,moveItem)=>{
                  return pack.packId == moveItem.packId;
              });
              if(!$this.deleteIdList){
                $this.deleteIdList = [];
              }
              if(!$this.delPackNoList){
                $this.delPackNoList = [];
              }
              rows.forEach(row => {
                  if(row.id){
                    $this.deleteIdList.push(row.id);
                    $this.delPackNoList.push(row.packNo);
                  }
              });
            },
            closeWin: function(){
                this.$commonUtil.tab.close(this);
            },
            getStock:function(filter,callback){
                var $this = this;
                commonUtil.selProductNoCst(this, null, function(stocks){
                //需要添加新的记录到数据源中
                if(!$this.dataSource){
                    $this.dataSource = [];
                }
                $this.$options.methods.calcUnit(stocks,true);
                //处理数据 部分字段处理
                stocks.forEach(element => {
                    if($this.dataSource.length>0 && $this.dataSource.filter(item => item.packId === element.id).length>0){//如果有重复数据则不进行添加
                        return;
                    }
                    element.packId = element.id;
                    element.id = null;
                    element.originRoomId = element.whsRoomId;
                    element.originAreaId = element.whsAreaId;
                    element.originStackId = element.whsStackId;
                    element.originStackName = element.whsStackName;
                    element.originLayer = element.whsLayerId;
                    element.cardNo = element.cstPackNo;
                    element.amount = element.usableNum;
                    element.netWeight = element.usableWeight;
                    element.grossWeight = element.usableGrossWeight;
                    element.poundWeight = element.usablePoundWeight;
                    // element.remark = null;
                    $this.dataSource.push(element);
                });
            });
            },
            //计算比例
            calcUnit:function(details,isNew){
                var $this = this;
                if(isNew){
                    details.forEach(a=>{
                     commonUtil.calUnitWeight(a,a.usableWeight, a.usableGrossWeight, a.usablePoundWeight, a.usableNum);
                    });
                }else{
                    details.forEach(a=>{
                        commonUtil.calUnitWeight(a,a.netWeight, a.grossWeight, a.poundWeight, a.amount);
                    });
                }
            },
             //更新标题
            updateTitle: function(title) {
                this.$commonUtil.tab.updateTitle(this, title);
            },
            validateDetails:function(details){
                if(!details || !details.length > 0){
                    this.$commonUtil.valid.throwEx(this,"移库明细不能为空");
                }
                var brands= cacheUtil.getDic().BrandNameList.list;
                details.forEach(item => {
                    var brand = brands.filter(a => a.id === item.brandId)[0];
                    if(!brand){
                         this.$commonUtil.valid.throwEx(this,"捆包号:" + item.packNo + "无品名信息");
                    }
                    if(this.$commonUtil.IsNull(item.targetRoomId) && this.$commonUtil.IsNull(item.targetAreaId)){
                         this.$commonUtil.valid.throwEx(this,"捆包号:" + item.packNo + "目标库区信息不能为空");
                    }
                    if(this.$commonUtil.IsNull(item.targetStackName)){
                         this.$commonUtil.valid.throwEx(this,"捆包号:" + item.packNo + "目标库位信息不能为空");
                    }
                    if(this.$commonUtil.IsNull(item.netWeight) || item.netWeight <= 0){
                         this.$commonUtil.valid.throwEx(this,"捆包号:" + item.packNo + "净重不能为空且不能小于0");
                    }
                    if (this.$commonUtil.IsNull(item.amount))
                    {
                         this.$commonUtil.valid.throwEx(this,"捆包号:" + item.packNo + "数量不能为空");
                    }
                    if (item.amount <= 0 && brand.whsoutType != 2)
                    {
                         this.$commonUtil.valid.throwEx(this,"捆包号:" + item.packNo + "数量必须大于0！");
                    }
                    if (item.originRoomId == item.targetRoomId && item.originAreaId == item.targetAreaId && item.originStackName == item.targetStackName)
                    {
                         this.$commonUtil.valid.throwEx(this,"捆包号:" + item.packNo + "原始库位信息不能与目标库位信息相同");
                    }
                });
            },
            saveInfo:function(){
                //组装请求参数对象  
                var $this = this;
                var submitModel =JSON.parse(JSON.stringify(this.formModel));
                
                var transStr = '';
                if(!this.$commonUtil.IsNull(submitModel.transceiver) && submitModel.transceiver.length>0){
                    submitModel.transceiver.forEach(element => {
                        transStr = transStr + ',' + element;
                    });
                    transStr = transStr.substring(1,transStr.length);
                }
                submitModel.transceiver = transStr;
                submitModel.detailList = this.dataSource;
                this.validateDetails(submitModel.detailList);
                if(submitModel.editFlag==operTypeEnum.OPER_ADD){//新增操作
                    httpUtil.post("whsmove/addMoveInfo",submitModel, data => {
                        this.$message({
                            message: '新增移库单成功',
                            type: 'success'
                        });
                        $this.updateTitle("编辑移库单[" + data.moveNo + "]");
                        //回显数据
                        $this.handleBackData(data);
                        $this.$refs["btn_print"].setDisabled(false);
                        //变为修改操作
                        $this.formModel.editFlag = operTypeEnum.OPER_EDIT;
                        $this.$options.parent.propsData.parentView.queryData();
                    });
                }else{//修改操作
                    submitModel.deleteIdList = this.deleteIdList;
                    submitModel.delPackNoList = this.delPackNoList;
                    httpUtil.post("whsmove/updateMoveInfo",submitModel, data => {
                        var titleHead = '修改';
                        if(this.formModel.editFlag==operTypeEnum.OPER_ADJUST){
                            titleHead = '调整';
                        }
                        this.$message({
                            message: titleHead + '移库单成功',
                            type: 'success'
                        });
                        $this.handleBackData(data);
                        $this.$options.parent.propsData.parentView.queryData();
                    });
                }
            },
            handleBackData:function(data){
                for(var p in data){
                    if(p == 'transceiver'){
                        if(data[p]!=null && data[p]!=''){
                            this.formModel[p] = data[p].split(',');
                            for(let i = 0; i　< this.formModel[p].length; i++) {
                                    this.formModel[p][i] = parseInt(this.formModel[p][i]);
                            }
                        }else{
                            this.formModel[p] = new Array;
                        }
                    }else{
                        this.$set(this.formModel,p,data[p]);
                    }
                }
                this.calcUnit(data.detailList,false);
                this.dataSource = this.formModel.detailList;
            },
            saveAndAuditInfo:function(){
                var $this = this;
                var submitModel =JSON.parse(JSON.stringify(this.formModel));
                var transStr = '';
                if(submitModel.transceiver.length>0){
                    submitModel.transceiver.forEach(element => {
                        transStr = transStr + ',' + element;
                    });
                    transStr = transStr.substring(1,transStr.length);
                }
                submitModel.transceiver = transStr;
                submitModel.detailList = this.dataSource;
                this.validateDetails(submitModel.detailList);
                httpUtil.post("whsmove/saveWithAuditMoveInfo",submitModel, data => {
                        this.$message({
                            message: '保存并审核移库单成功',
                            type: 'success'
                        });
                        //回显数据
                        $this.handleBackData(data);
                        $this.$refs["add"].setDisabled(true);
                        $this.$refs["save"].setDisabled(true);
                        $this.$refs["cost"].setDisabled(false);
                        $this.$refs["select"].setDisabled(true);
                        $this.$refs["remove"].setDisabled(true);
                        $this.$refs["btn_print"].setDisabled(false);
                        $this.updateTitle("查看移库单[" + data.moveNo + "]");
                        $this.formReadOnly = true;
                        $this.config.allowEdit = false;
                        //刷新管理界面数据
                        $this.$options.parent.propsData.parentView.queryData();
                });
            },
            settleInfo(){
                var $this = this;
                var submitModel =JSON.parse(JSON.stringify(this.formModel));
                submitModel.detailList = this.dataSource;
                this.wrapData(submitModel);
				const costBalanceItem = {
                	component: costBalanceAddManage,
                	propsData:{entity:submitModel},
                	name: "新增结算单",
            	}
            	this.$tab.open(costBalanceItem);
            },
            wrapData(entity){
                var cstId=0;
                for(var i=0;i<entity.detailList.length;i++){
                    cstId=entity.detailList[i].cstId;
                    break;
                }
                entity.businessNo = entity.moveNo;
                entity.cstId = cstId;
                entity.businessType = 3;
                entity.createDate = entity.createTime;
                entity.creatorData = entity.creator;
                if(!entity.detailList){
                    return;
                }
                entity.detailList.forEach(element => {
                    element.material = element.textureId;
                    element.productPlace = element.producingId;
                    element.businessNo = element.moveNo;
                    //element.transferDate = element.transferTime;
                    element.whsInFirstDate = element.whsinTime;
                    element.createDate = element.createTime;
                    element.numFin = element.amount;
                    if(!element.transferTimes){
                        element.transferNum = 0;
                    }else{
                        element.transferNum = element.transferTimes;
                    }
                    element.businessType = 3;
                    element.costDate = element.costTime;
                });
                entity.detail=entity.detailList;
            },
        },
    }
</script>

<style scoped>
  
</style>
